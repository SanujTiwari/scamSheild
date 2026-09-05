/**
 * ScamShield AI Service V2
 * Gemini AI integration for both during-detection analysis and post-hoc explanation
 *
 * Functions:
 * - analyzeWithAI(): Deep text analysis during detection (returns structured JSON)
 * - generateExplanation(): Post-hoc explanation of results (returns text)
 * - chatResponse(): Interactive chat assistant (returns text)
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ═══════════════════════════════════════════════
// AI Deep Analysis (During Detection)
// ═══════════════════════════════════════════════

/**
 * Analyze text content with Gemini AI during the detection phase.
 * Returns structured indicators that are merged with rule-based analysis.
 *
 * @param {string} text - The text to analyze
 * @param {string} scanType - "job" | "message" | "payment" | "recruiter" | "url"
 * @returns {Object} Structured analysis with indicators and risk assessment
 */
const analyzeWithAI = async (text, scanType) => {
  if (!process.env.GEMINI_API_KEY) {
    return { available: false, reason: "Gemini API key not configured" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const typePrompts = {
      job: `Analyze this job posting/description for scam indicators. Look for:
- Unrealistic salary claims (compare to industry norms)
- Vague or missing company details
- Requests for money before employment
- Requests for sensitive personal data (OTP, bank details, passwords)
- Artificial urgency or pressure
- MLM/pyramid scheme language
- Poor grammar/formatting suggesting non-professional origin
- Claims that seem too good to be true
- Missing job requirements for senior roles
- Suspicious contact methods`,

      message: `Analyze this message for scam/phishing indicators. Look for:
- Social engineering tactics (authority, fear, greed, urgency)
- Phishing attempts (fake login, verify account)
- Payment or money transfer requests
- Requests for OTP, passwords, or personal information
- Fake rewards, prizes, or lottery claims
- Impersonation of known brands or organizations
- Suspicious links
- Emotional manipulation
- Too-good-to-be-true offers`,

      payment: `Analyze this payment request for fraud indicators. Look for:
- Advance fee fraud patterns
- Non-standard payment methods (crypto, gift cards)
- Pressure to pay immediately
- Fake refund promises
- Requests to personal accounts rather than company accounts
- Suspicious justifications for the payment
- MLM or pyramid scheme patterns`,

      recruiter: `Analyze this recruiter information for legitimacy. Look for:
- Use of free email services for professional communication
- Mismatch between claimed company and email domain
- Missing verifiable professional presence
- Suspicious communication patterns
- Unverified claims of authority`,

      url: `Analyze this URL for phishing/malware indicators. Look for:
- Brand impersonation in the domain name
- Typosquatting patterns
- Suspicious domain structure
- Indicators of credential harvesting
- Known phishing patterns in URL structure`,
    };

    const prompt = `You are a cybersecurity fraud analyst. ${typePrompts[scanType] || typePrompts.message}

INPUT TEXT:
"""
${text.substring(0, 3000)}
"""

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, no explanation outside JSON):
{
  "riskAssessment": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": <number 0-100>,
  "indicators": [
    {
      "category": "<risk category>",
      "finding": "<specific finding description>",
      "severity": "Low" | "Medium" | "High" | "Critical"
    }
  ],
  "summary": "<1-2 sentence analysis summary>"
}

RULES:
- riskScore must reflect the actual analysis — do not default to a middle value
- Only include indicators you genuinely detect in the text
- If the text appears legitimate, return a low score with few or no indicators
- Be specific in findings — reference actual text content when possible
- Category should be one of: "Payment Risk", "Content Risk", "Behavior Risk", "Communication Risk", "URL Risk", "Identity Risk", "Data Theft Risk", "Social Engineering", "Company Risk"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Strip markdown code blocks if present
    responseText = responseText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const parsed = JSON.parse(responseText);

    // Validate response structure
    if (!parsed.riskAssessment || typeof parsed.riskScore !== "number" || !Array.isArray(parsed.indicators)) {
      console.error("AI response missing required fields:", parsed);
      return { available: false, reason: "Invalid AI response structure" };
    }

    // Clamp score to valid range
    parsed.riskScore = Math.max(0, Math.min(100, Math.round(parsed.riskScore)));

    return {
      available: true,
      riskAssessment: parsed.riskAssessment,
      riskScore: parsed.riskScore,
      indicators: parsed.indicators.slice(0, 10), // Limit to 10 indicators
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    return { available: false, reason: error.message };
  }
};

// ═══════════════════════════════════════════════
// Post-Hoc Explanation Generator (existing, preserved)
// ═══════════════════════════════════════════════

const generateExplanation = async (jobData, riskResult) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a job scam detection expert. Analyze this job posting and provide a clear, concise explanation (2-3 sentences) of why this job posting has been rated as "${riskResult.riskLevel}" with a risk score of ${riskResult.score}/100.

Job Title: ${jobData.title}
Company: ${jobData.companyName}
Description: ${jobData.description}

Detected Risk Factors: ${riskResult.reasons.length > 0 ? riskResult.reasons.join(", ") : "No specific red flags detected"}

Provide a human-readable explanation that helps the user understand the risk assessment. Be direct and helpful. If the risk is low, reassure the user but suggest general caution. If the risk is high, clearly explain the danger signs. Do NOT use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Explanation Error:", error);
    // Fallback: generate template-based explanation
    if (riskResult.reasons.length === 0) {
      return "This job posting appears to be legitimate. No common scam indicators were detected. However, always verify the company and job details independently before sharing personal information.";
    }
    return `This job posting has been flagged as ${riskResult.riskLevel} (score: ${riskResult.score}/100). The following concerns were identified: ${riskResult.reasons.join("; ")}. We recommend exercising caution and verifying the legitimacy of this opportunity through independent research.`;
  }
};

// ═══════════════════════════════════════════════
// Chat Assistant (existing, preserved)
// ═══════════════════════════════════════════════

const chatResponse = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are ScamShield AI, an expert assistant specializing in detecting multi-type scams including fake job postings, recruiter impersonation, payment requests, phishing messages, and suspicious URLs. You help users detect scams before they cost them, providing clear risk analysis and actionable safety recommendations.

IMPORTANT RULES:
- Keep responses concise (max 3-4 paragraphs)
- Be helpful, professional, and empathetic
- Analyze inputs for specific red flags without claiming certainty unless clear evidence exists
- Use terms like "suspicious", "high risk", or "unverified" when evidence is ambiguous
- Provide actionable advice
- Do NOT use markdown formatting - use plain text only

User Message: ${userMessage}

Respond helpfully:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat AI Error:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment. In the meantime, remember: legitimate employers never ask for upfront payments, and always verify job postings through official company websites.";
  }
};

module.exports = { analyzeWithAI, generateExplanation, chatResponse };
