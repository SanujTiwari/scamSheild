/**
 * ScamShield URL Intelligence Service
 * External API integration for URL/domain threat intelligence
 * 
 * Integrates:
 * - Google Safe Browsing API (free Lookup API)
 * - VirusTotal API (free Community tier)
 * - WHOIS/RDAP (free public protocol)
 * 
 * All APIs are optional — graceful degradation when unavailable.
 */

const pool = require("../config/db");

// ─── Cache TTL (24 hours in milliseconds) ───
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Extract clean domain from a URL string
 */
const extractDomain = (urlString) => {
  try {
    // Add protocol if missing for URL constructor
    let normalized = urlString.trim();
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = "https://" + normalized;
    }
    const parsed = new URL(normalized);
    return parsed.hostname.toLowerCase();
  } catch {
    // Fallback: try to extract domain manually
    const cleaned = urlString.replace(/^(https?:\/\/)?(www\.)?/i, "").split("/")[0].split("?")[0].split("#")[0];
    return cleaned.toLowerCase();
  }
};

/**
 * Check domain intel cache in database
 */
const getCachedIntel = async (domain) => {
  try {
    const result = await pool.query(
      `SELECT * FROM domain_intel_cache WHERE domain = $1 AND cached_at > NOW() - INTERVAL '24 hours'`,
      [domain]
    );
    if (result.rows.length > 0) {
      return result.rows[0];
    }
  } catch (err) {
    console.error("Cache lookup error:", err.message);
  }
  return null;
};

/**
 * Save domain intel to cache
 */
const saveCachedIntel = async (domain, safeBrowsingResult, virustotalResult, whoisResult) => {
  try {
    await pool.query(
      `INSERT INTO domain_intel_cache (domain, safe_browsing_result, virustotal_result, whois_result, cached_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (domain) DO UPDATE SET
         safe_browsing_result = $2,
         virustotal_result = $3,
         whois_result = $4,
         cached_at = NOW()`,
      [domain, JSON.stringify(safeBrowsingResult), JSON.stringify(virustotalResult), JSON.stringify(whoisResult)]
    );
  } catch (err) {
    console.error("Cache save error:", err.message);
  }
};

// ═══════════════════════════════════════════════
// Google Safe Browsing API (Lookup API v4)
// ═══════════════════════════════════════════════

const checkGoogleSafeBrowsing = async (url) => {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return { available: false, reason: "API key not configured" };
  }

  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { clientId: "scamshield", clientVersion: "2.0" },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Safe Browsing API error:", response.status, errorText);
      return { available: false, reason: `API returned ${response.status}` };
    }

    const data = await response.json();
    const matches = data.matches || [];

    return {
      available: true,
      isThreat: matches.length > 0,
      threats: matches.map((m) => ({
        type: m.threatType,
        platform: m.platformType,
      })),
      threatCount: matches.length,
    };
  } catch (err) {
    console.error("Safe Browsing API error:", err.message);
    return { available: false, reason: err.message };
  }
};

// ═══════════════════════════════════════════════
// VirusTotal API (v3 Community)
// ═══════════════════════════════════════════════

const checkVirusTotal = async (url) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return { available: false, reason: "API key not configured" };
  }

  try {
    // VT v3: encode URL as base64 (without padding) for URL lookup
    const urlId = Buffer.from(url).toString("base64").replace(/=+$/, "");

    const response = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        method: "GET",
        headers: { "x-apikey": apiKey },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.status === 404) {
      // URL not in VT database — not necessarily safe, just unknown
      return {
        available: true,
        found: false,
        malicious: 0,
        suspicious: 0,
        harmless: 0,
        undetected: 0,
        totalEngines: 0,
      };
    }

    if (response.status === 429) {
      return { available: false, reason: "Rate limit exceeded" };
    }

    if (!response.ok) {
      return { available: false, reason: `API returned ${response.status}` };
    }

    const data = await response.json();
    const stats = data?.data?.attributes?.last_analysis_stats || {};

    return {
      available: true,
      found: true,
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      totalEngines: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
      reputation: data?.data?.attributes?.reputation,
      categories: data?.data?.attributes?.categories || {},
    };
  } catch (err) {
    console.error("VirusTotal API error:", err.message);
    return { available: false, reason: err.message };
  }
};

// ═══════════════════════════════════════════════
// WHOIS / RDAP (Free Public Protocol)
// ═══════════════════════════════════════════════

const checkWhoisRdap = async (domain) => {
  try {
    // Use RDAP (Registration Data Access Protocol) — the modern WHOIS replacement
    // RDAP is a free, public, standardized protocol maintained by IANA/ICANN
    const response = await fetch(
      `https://rdap.org/domain/${encodeURIComponent(domain)}`,
      {
        method: "GET",
        headers: { Accept: "application/rdap+json" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      return { available: false, reason: `RDAP returned ${response.status}` };
    }

    const data = await response.json();

    // Extract registration and expiration dates from events
    let registrationDate = null;
    let expirationDate = null;
    let lastChanged = null;

    if (data.events && Array.isArray(data.events)) {
      for (const event of data.events) {
        if (event.eventAction === "registration") {
          registrationDate = event.eventDate;
        } else if (event.eventAction === "expiration") {
          expirationDate = event.eventDate;
        } else if (event.eventAction === "last changed") {
          lastChanged = event.eventDate;
        }
      }
    }

    // Calculate domain age in days
    let domainAgeDays = null;
    if (registrationDate) {
      const regDate = new Date(registrationDate);
      const now = new Date();
      domainAgeDays = Math.floor((now - regDate) / (1000 * 60 * 60 * 24));
    }

    // Extract registrar name
    let registrar = null;
    if (data.entities && Array.isArray(data.entities)) {
      for (const entity of data.entities) {
        if (entity.roles && entity.roles.includes("registrar")) {
          registrar = entity.vcardArray?.[1]?.find((v) => v[0] === "fn")?.[3] || entity.handle || null;
        }
      }
    }

    return {
      available: true,
      domainName: data.ldhName || domain,
      registrationDate,
      expirationDate,
      lastChanged,
      domainAgeDays,
      registrar,
      status: data.status || [],
    };
  } catch (err) {
    console.error("RDAP/WHOIS error:", err.message);
    return { available: false, reason: err.message };
  }
};

// ═══════════════════════════════════════════════
// Main Intelligence Gathering Function
// ═══════════════════════════════════════════════

/**
 * Gather all available intelligence for a URL/domain.
 * Uses cache when available. Returns structured intelligence report.
 * 
 * @param {string} url - The URL to analyze
 * @returns {Object} Intelligence report with scores and source attribution
 */
const gatherUrlIntelligence = async (url) => {
  const domain = extractDomain(url);
  const sources = [];
  let intelScore = 0;
  let intelMaxScore = 0;
  const findings = [];

  // 1. Check cache first
  const cached = await getCachedIntel(domain);
  let safeBrowsingResult, virustotalResult, whoisResult;

  if (cached) {
    safeBrowsingResult = cached.safe_browsing_result || {};
    virustotalResult = cached.virustotal_result || {};
    whoisResult = cached.whois_result || {};
  } else {
    // 2. Fetch from all APIs in parallel
    [safeBrowsingResult, virustotalResult, whoisResult] = await Promise.all([
      checkGoogleSafeBrowsing(url),
      checkVirusTotal(url),
      checkWhoisRdap(domain),
    ]);

    // 3. Cache results
    await saveCachedIntel(domain, safeBrowsingResult, virustotalResult, whoisResult);
  }

  // ─── Process Google Safe Browsing Results ───
  if (safeBrowsingResult.available) {
    sources.push("Google Safe Browsing");
    intelMaxScore += 40;

    if (safeBrowsingResult.isThreat) {
      intelScore += 40;
      findings.push({
        source: "Google Safe Browsing",
        severity: "Critical",
        finding: `URL flagged as threat: ${safeBrowsingResult.threats.map((t) => t.type.replace(/_/g, " ").toLowerCase()).join(", ")}`,
      });
    }
  }

  // ─── Process VirusTotal Results ───
  if (virustotalResult.available) {
    sources.push("VirusTotal");
    intelMaxScore += 35;

    if (virustotalResult.found) {
      const { malicious, suspicious, totalEngines } = virustotalResult;
      const flaggedRatio = totalEngines > 0 ? (malicious + suspicious) / totalEngines : 0;

      if (malicious >= 5 || flaggedRatio > 0.15) {
        intelScore += 35;
        findings.push({
          source: "VirusTotal",
          severity: "Critical",
          finding: `Flagged by ${malicious} security engines as malicious (${suspicious} suspicious) out of ${totalEngines} total engines`,
        });
      } else if (malicious >= 1 || suspicious >= 2) {
        intelScore += 20;
        findings.push({
          source: "VirusTotal",
          severity: "High",
          finding: `Flagged by ${malicious} engine(s) as malicious, ${suspicious} as suspicious out of ${totalEngines} engines`,
        });
      } else if (suspicious >= 1) {
        intelScore += 8;
        findings.push({
          source: "VirusTotal",
          severity: "Medium",
          finding: `${suspicious} security engine(s) flagged this URL as suspicious out of ${totalEngines} engines`,
        });
      }
    } else {
      // URL not in VT database — slight risk signal (unknown URL)
      intelScore += 5;
      findings.push({
        source: "VirusTotal",
        severity: "Low",
        finding: "URL not found in VirusTotal database (no prior scans recorded)",
      });
    }
  }

  // ─── Process WHOIS/RDAP Results ───
  if (whoisResult.available) {
    sources.push("WHOIS/RDAP");
    intelMaxScore += 25;

    if (whoisResult.domainAgeDays !== null) {
      if (whoisResult.domainAgeDays < 30) {
        intelScore += 25;
        findings.push({
          source: "WHOIS/RDAP",
          severity: "High",
          finding: `Domain registered only ${whoisResult.domainAgeDays} day(s) ago — very new domains are frequently used for phishing`,
        });
      } else if (whoisResult.domainAgeDays < 90) {
        intelScore += 15;
        findings.push({
          source: "WHOIS/RDAP",
          severity: "Medium",
          finding: `Domain registered ${whoisResult.domainAgeDays} days ago — relatively new domain`,
        });
      } else if (whoisResult.domainAgeDays < 365) {
        intelScore += 5;
        findings.push({
          source: "WHOIS/RDAP",
          severity: "Low",
          finding: `Domain is ${whoisResult.domainAgeDays} days old (registered: ${new Date(whoisResult.registrationDate).toLocaleDateString()})`,
        });
      }
      // Domains older than 1 year add nothing — expected for legitimate sites
    }
  }

  // ─── Calculate normalized intel score (0-100) ───
  const normalizedIntelScore = intelMaxScore > 0
    ? Math.min(Math.round((intelScore / intelMaxScore) * 100), 100)
    : 0;

  return {
    domain,
    sources,
    score: normalizedIntelScore,
    maxPossibleScore: intelMaxScore,
    findings,
    rawResults: {
      safeBrowsing: safeBrowsingResult,
      virusTotal: virustotalResult,
      whois: whoisResult,
    },
  };
};

module.exports = {
  gatherUrlIntelligence,
  extractDomain,
  checkGoogleSafeBrowsing,
  checkVirusTotal,
  checkWhoisRdap,
};
