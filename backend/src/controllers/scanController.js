/**
 * ScamShield Scan Controller V2
 * Integrates: Rule Engine + AI Analysis + External Intelligence APIs
 *
 * Score combination formula:
 *   Final = (ruleScore * 0.60) + (aiScore * 0.25) + (intelScore * 0.15)
 *
 * If AI is unavailable: Final = (ruleScore * 0.75) + (intelScore * 0.25)
 * If Intel is unavailable: Final = (ruleScore * 0.75) + (aiScore * 0.25)
 * If both unavailable: Final = ruleScore (100%)
 */

const pool = require("../config/db");
const {
  analyzeJob,
  analyzeMessage,
  analyzePayment,
  analyzeRecruiter,
  analyzeUrl,
  getRiskLevel,
} = require("../services/riskEngine");
const { generateExplanation, analyzeWithAI } = require("../services/aiService");
const { gatherUrlIntelligence, extractDomain } = require("../services/urlIntelligenceService");

// ═══════════════════════════════════════════════
// Score Combination Engine
// ═══════════════════════════════════════════════

/**
 * Merge rule-based, AI, and threat intelligence scores with dynamic weighting.
 * If a source is unavailable, its weight is redistributed to available sources.
 */
const combineScores = (ruleResult, aiResult, intelResult) => {
  const aiAvailable = aiResult && aiResult.available;
  const intelAvailable = intelResult && intelResult.score !== undefined && intelResult.sources && intelResult.sources.length > 0;

  let ruleWeight, aiWeight, intelWeight;

  if (aiAvailable && intelAvailable) {
    ruleWeight = 0.60;
    aiWeight = 0.25;
    intelWeight = 0.15;
  } else if (aiAvailable && !intelAvailable) {
    ruleWeight = 0.75;
    aiWeight = 0.25;
    intelWeight = 0;
  } else if (!aiAvailable && intelAvailable) {
    ruleWeight = 0.75;
    aiWeight = 0;
    intelWeight = 0.25;
  } else {
    ruleWeight = 1.0;
    aiWeight = 0;
    intelWeight = 0;
  }

  const ruleScore = ruleResult.score || 0;
  const aiScore = aiAvailable ? (aiResult.riskScore || 0) : 0;
  const intelScore = intelAvailable ? (intelResult.score || 0) : 0;

  const combinedScore = Math.round(
    ruleScore * ruleWeight +
    aiScore * aiWeight +
    intelScore * intelWeight
  );

  const finalScore = Math.max(0, Math.min(100, combinedScore));

  // Merge risk factors from all sources
  const allFactors = [...(ruleResult.riskFactors || [])];

  // Add AI indicators as risk factors
  if (aiAvailable && aiResult.indicators) {
    for (const indicator of aiResult.indicators) {
      // Avoid duplicate findings — check if reason already exists
      const isDuplicate = allFactors.some(
        (f) => f.reason.toLowerCase().includes(indicator.finding.toLowerCase().substring(0, 30))
      );
      if (!isDuplicate) {
        allFactors.push({
          category: indicator.category || "AI Analysis",
          reason: `[AI] ${indicator.finding}`,
          score: Math.round(aiScore / Math.max(aiResult.indicators.length, 1)),
          severity: indicator.severity || "Medium",
        });
      }
    }
  }

  // Add threat intelligence findings as risk factors
  if (intelAvailable && intelResult.findings) {
    for (const finding of intelResult.findings) {
      allFactors.push({
        category: finding.source === "WHOIS/RDAP" ? "Company Risk" : "Threat Intelligence",
        reason: `[${finding.source}] ${finding.finding}`,
        score: Math.round(intelScore / Math.max(intelResult.findings.length, 1)),
        severity: finding.severity || "Medium",
      });
    }
  }

  // Calculate combined confidence
  let confidenceFactors = 0;
  let confidenceTotal = 0;

  // Rule engine always contributes
  confidenceTotal += 0.50;
  confidenceFactors += 0.50 * (ruleResult.confidence || (ruleResult.riskFactors && ruleResult.riskFactors.length > 0 ? 0.7 : 0.3));

  if (aiAvailable) {
    confidenceTotal += 0.30;
    confidenceFactors += 0.30 * 0.85; // AI generally has high confidence when available
  }

  if (intelAvailable) {
    confidenceTotal += 0.20;
    confidenceFactors += 0.20 * (intelResult.sources.length / 3); // More sources = higher confidence
  }

  const confidence = confidenceTotal > 0
    ? Math.round((confidenceFactors / confidenceTotal) * 100) / 100
    : 0;

  // Build sources array
  const sources = ["ScamShield Rule Engine"];
  if (aiAvailable) sources.push("Gemini AI Analysis");
  if (intelAvailable) {
    for (const src of intelResult.sources) {
      sources.push(src);
    }
  }

  return {
    score: finalScore,
    riskLevel: getRiskLevel(finalScore),
    riskFactors: allFactors,
    confidence,
    sources,
    reasons: allFactors.map((f) => f.reason),
    recommendations: ruleResult.recommendations || [],
    scoreBreakdown: {
      ruleScore,
      ruleWeight,
      aiScore: aiAvailable ? aiScore : null,
      aiWeight: aiAvailable ? aiWeight : 0,
      intelScore: intelAvailable ? intelScore : null,
      intelWeight: intelAvailable ? intelWeight : 0,
    },
    aiSummary: aiAvailable ? aiResult.summary : null,
    threatIntelligence: intelAvailable ? {
      domain: intelResult.domain,
      findings: intelResult.findings,
      rawResults: intelResult.rawResults,
    } : null,
  };
};

// ═══════════════════════════════════════════════
// Save Scan Record (with enhanced fields)
// ═══════════════════════════════════════════════

const saveScanRecord = async (userId, scanType, inputData, result) => {
  let aiExplanation = "";
  try {
    aiExplanation = await generateExplanation(
      {
        title: inputData.title || scanType,
        companyName: inputData.companyName || inputData.senderEmail || "N/A",
        description: JSON.stringify(inputData),
      },
      result
    );
  } catch (err) {
    console.error("AI Explanation error:", err);
    aiExplanation = `This scan yielded a risk score of ${result.score}/100 (${result.riskLevel}).`;
  }

  // 1. Insert scan
  const scanQuery = await pool.query(
    `INSERT INTO scans (user_id, scan_type, input_data, risk_score, risk_level, ai_explanation)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      scanType,
      JSON.stringify(inputData),
      result.score,
      result.riskLevel,
      aiExplanation,
    ]
  );

  const savedScan = scanQuery.rows[0];

  // 2. Insert risk_factors
  if (result.riskFactors && result.riskFactors.length > 0) {
    for (const factor of result.riskFactors) {
      await pool.query(
        `INSERT INTO risk_factors (scan_id, category, reason, score, severity)
         VALUES ($1, $2, $3, $4, $5)`,
        [savedScan.id, factor.category, factor.reason, factor.score, factor.severity]
      );
    }
  }

  // Also maintain backwards compatibility in jobs table if it's a job scan
  if (scanType === "job" && inputData.title && inputData.companyName) {
    try {
      await pool.query(
        `INSERT INTO jobs (user_id, title, company_name, description, risk_score, risk_level, reasons, ai_explanation)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          inputData.title,
          inputData.companyName,
          inputData.description || "",
          result.score,
          result.riskLevel,
          JSON.stringify(result.reasons || []),
          aiExplanation,
        ]
      );
    } catch (e) {
      console.error("Jobs fallback table insert error:", e);
    }
  }

  return {
    ...savedScan,
    riskFactors: result.riskFactors || [],
    recommendations: result.recommendations || [],
    confidence: result.confidence,
    sources: result.sources,
    scoreBreakdown: result.scoreBreakdown,
    aiSummary: result.aiSummary,
    threatIntelligence: result.threatIntelligence,
  };
};

// ═══════════════════════════════════════════════
// Scan Handlers
// ═══════════════════════════════════════════════

const scanJob = async (req, res) => {
  try {
    const { title, companyName, description, salary, email, phone, website } = req.body;
    if (!title || !companyName || !description) {
      return res.status(400).json({ success: false, message: "Title, company name, and description are required" });
    }

    const inputData = { title, companyName, description, salary, email, phone, website };
    const fullText = `${title} ${companyName} ${description} ${salary || ""} ${email || ""}`;

    // Run rule engine and AI analysis in parallel
    const [ruleResult, aiResult] = await Promise.all([
      Promise.resolve(analyzeJob(inputData)),
      analyzeWithAI(fullText, "job"),
    ]);

    // Combine scores (no intel for job scans — they don't have URLs)
    const combinedResult = combineScores(ruleResult, aiResult, null);
    const saved = await saveScanRecord(req.user.id, "job", inputData, combinedResult);

    res.status(201).json({ success: true, scan: saved });
  } catch (error) {
    console.error("Scan Job Error:", error);
    res.status(500).json({ success: false, message: "Unable to complete the analysis. Please try again." });
  }
};

const scanMessage = async (req, res) => {
  try {
    const { message, senderEmail, senderPhone, platform } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const inputData = { message, senderEmail, senderPhone, platform };
    const fullText = `${message} ${senderEmail || ""} ${platform || ""}`;

    // Run rule engine and AI analysis in parallel
    const [ruleResult, aiResult] = await Promise.all([
      Promise.resolve(analyzeMessage(inputData)),
      analyzeWithAI(fullText, "message"),
    ]);

    // Check if message contains URLs — if so, gather threat intelligence
    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
    const extractedUrls = message.match(urlPattern) || [];
    let intelResult = null;
    if (extractedUrls.length > 0) {
      try {
        intelResult = await gatherUrlIntelligence(extractedUrls[0]);
      } catch (err) {
        console.error("URL intel in message scan error:", err.message);
      }
    }

    const combinedResult = combineScores(ruleResult, aiResult, intelResult);
    const saved = await saveScanRecord(req.user.id, "message", inputData, combinedResult);

    res.status(201).json({ success: true, scan: saved });
  } catch (error) {
    console.error("Scan Message Error:", error);
    res.status(500).json({ success: false, message: "Unable to complete the analysis. Please try again." });
  }
};

const scanPayment = async (req, res) => {
  try {
    const { requestText, amount, reason, method, senderInfo } = req.body;
    if (!requestText && !reason) {
      return res.status(400).json({ success: false, message: "Payment request description or reason is required" });
    }

    const inputData = { requestText, amount, reason, method, senderInfo };
    const fullText = `${requestText || ""} ${amount || ""} ${reason || ""} ${method || ""} ${senderInfo || ""}`;

    const [ruleResult, aiResult] = await Promise.all([
      Promise.resolve(analyzePayment(inputData)),
      analyzeWithAI(fullText, "payment"),
    ]);

    const combinedResult = combineScores(ruleResult, aiResult, null);
    const saved = await saveScanRecord(req.user.id, "payment", inputData, combinedResult);

    res.status(201).json({ success: true, scan: saved });
  } catch (error) {
    console.error("Scan Payment Error:", error);
    res.status(500).json({ success: false, message: "Unable to complete the analysis. Please try again." });
  }
};

const scanRecruiter = async (req, res) => {
  try {
    const { name, email, phone, company, profileUrl } = req.body;
    if (!name && !email) {
      return res.status(400).json({ success: false, message: "Recruiter name or email is required" });
    }

    const inputData = { name, email, phone, company, profileUrl };
    const fullText = `${name || ""} ${email || ""} ${company || ""} ${profileUrl || ""}`;

    const [ruleResult, aiResult] = await Promise.all([
      Promise.resolve(analyzeRecruiter(inputData)),
      analyzeWithAI(fullText, "recruiter"),
    ]);

    const combinedResult = combineScores(ruleResult, aiResult, null);
    const saved = await saveScanRecord(req.user.id, "recruiter", inputData, combinedResult);

    res.status(201).json({ success: true, scan: saved });
  } catch (error) {
    console.error("Scan Recruiter Error:", error);
    res.status(500).json({ success: false, message: "Unable to complete the analysis. Please try again." });
  }
};

const scanUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: "URL is required" });
    }

    // Basic URL input sanitization
    const sanitizedUrl = url.trim().substring(0, 2048);

    const inputData = { url: sanitizedUrl };

    // Run ALL THREE analysis layers in parallel for URL scans
    const [ruleResult, aiResult, intelResult] = await Promise.all([
      Promise.resolve(analyzeUrl(inputData)),
      analyzeWithAI(sanitizedUrl, "url"),
      gatherUrlIntelligence(sanitizedUrl).catch((err) => {
        console.error("URL intelligence gathering error:", err.message);
        return { sources: [], score: 0, findings: [] };
      }),
    ]);

    const combinedResult = combineScores(ruleResult, aiResult, intelResult);

    // Preserve URL structural analysis from rule engine
    if (ruleResult.urlAnalysis) {
      combinedResult.urlAnalysis = ruleResult.urlAnalysis;
    }

    const saved = await saveScanRecord(req.user.id, "url", inputData, combinedResult);

    res.status(201).json({ success: true, scan: saved });
  } catch (error) {
    console.error("Scan URL Error:", error);
    res.status(500).json({ success: false, message: "Unable to complete the analysis. Please try again." });
  }
};

// ═══════════════════════════════════════════════
// History & CRUD (preserved from V1)
// ═══════════════════════════════════════════════

const getScanHistory = async (req, res) => {
  try {
    const query = await pool.query(
      `SELECT s.*, COALESCE(json_agg(rf.*) FILTER (WHERE rf.id IS NOT NULL), '[]') AS risk_factors
       FROM scans s
       LEFT JOIN risk_factors rf ON rf.scan_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({ success: true, count: query.rows.length, scans: query.rows });
  } catch (error) {
    console.error("Get Scan History Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getSingleScan = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await pool.query(
      `SELECT s.*, COALESCE(json_agg(rf.*) FILTER (WHERE rf.id IS NOT NULL), '[]') AS risk_factors
       FROM scans s
       LEFT JOIN risk_factors rf ON rf.scan_id = s.id
       WHERE s.id = $1 AND s.user_id = $2
       GROUP BY s.id`,
      [id, req.user.id]
    );

    if (query.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Scan not found" });
    }

    res.status(200).json({ success: true, scan: query.rows[0] });
  } catch (error) {
    console.error("Get Single Scan Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await pool.query(
      `DELETE FROM scans WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Scan not found" });
    }

    res.status(200).json({ success: true, message: "Scan record deleted successfully" });
  } catch (error) {
    console.error("Delete Scan Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  scanJob,
  scanMessage,
  scanPayment,
  scanRecruiter,
  scanUrl,
  getScanHistory,
  getSingleScan,
  deleteScan,
};
