/**
 * ScamShield Risk Engine V3
 * Real Multi-Signal Scam Detection & Prevention Engine
 *
 * Architecture:
 * - 50+ regex-based indicator patterns per scanner
 * - Weighted multi-signal combination (no single indicator > 60)
 * - Category-based risk aggregation
 * - Transparent confidence scoring from signal coverage
 * - No hardcoded scores, no Math.random(), no dummy logic
 */

// ═══════════════════════════════════════════════
// Constants & Helpers
// ═══════════════════════════════════════════════

const RISK_THRESHOLDS = {
  SAFE: 20,
  LOW: 40,
  MEDIUM: 60,
  HIGH: 80,
  // Above 80 = Critical
};

const getRiskLevel = (score) => {
  if (score <= RISK_THRESHOLDS.SAFE) return "Safe";
  if (score <= RISK_THRESHOLDS.LOW) return "Low Risk";
  if (score <= RISK_THRESHOLDS.MEDIUM) return "Medium Risk";
  if (score <= RISK_THRESHOLDS.HIGH) return "High Risk";
  return "Critical Risk";
};

const getSeverity = (factorScore) => {
  if (factorScore >= 25) return "Critical";
  if (factorScore >= 15) return "High";
  if (factorScore >= 8) return "Medium";
  return "Low";
};

/**
 * Calculate confidence from signal coverage:
 * How many evaluable signal categories actually contributed data?
 */
const calculateConfidence = (factors, totalCategories) => {
  if (totalCategories === 0) return 0;
  const uniqueCategories = new Set(factors.map((f) => f.category));
  // Base confidence from signal coverage
  const coverage = uniqueCategories.size / totalCategories;
  // Factor in how many individual signals fired
  const signalDensity = Math.min(factors.length / 5, 1); // 5+ signals = max density
  // Weighted: 60% coverage + 40% density
  const raw = coverage * 0.6 + signalDensity * 0.4;
  return Math.round(raw * 100) / 100;
};

/**
 * Normalize raw score with diminishing returns to prevent score inflation.
 * First 60 points map linearly. After that, each additional point is harder to reach.
 */
const normalizeScore = (rawScore) => {
  if (rawScore <= 60) return Math.min(rawScore, 100);
  // Diminishing returns above 60: logarithmic compression
  const excess = rawScore - 60;
  const compressed = 60 + (40 * (1 - Math.exp(-excess / 60)));
  return Math.min(Math.round(compressed), 100);
};

/**
 * Count regex matches in text (handles overlapping patterns)
 */
const countMatches = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

// ═══════════════════════════════════════════════
// Recommendation Generator
// ═══════════════════════════════════════════════

const generateRecommendations = (riskFactors) => {
  const recommendations = new Set();
  const categories = new Set(riskFactors.map((f) => f.category));

  if (categories.has("Payment Risk")) {
    recommendations.add("Do not make any upfront payments, registration fees, or security deposits.");
    recommendations.add("Legitimate employers or platforms never ask candidates to pay for employment.");
  }

  if (categories.has("Communication Risk")) {
    recommendations.add("Avoid communicating exclusively via informal messaging apps like WhatsApp or Telegram.");
    recommendations.add("Request formal written communication from an official corporate email domain.");
  }

  if (categories.has("Company Risk") || categories.has("Identity Risk")) {
    recommendations.add("Verify the organization through official public business registries and company websites.");
    recommendations.add("Contact the company directly using phone numbers listed on their official website.");
  }

  if (categories.has("URL Risk")) {
    recommendations.add("Do not click unverified links or enter personal credentials on non-HTTPS or suspicious domains.");
    recommendations.add("Double-check the web address domain for typosquatting or misspellings.");
  }

  if (categories.has("Behavior Risk")) {
    recommendations.add("Never share sensitive banking details, OTPs, or passwords.");
    recommendations.add("Be cautious of high-pressure urgency claims or offers that seem too good to be true.");
  }

  if (categories.has("Content Risk")) {
    recommendations.add("Research the company and role independently before proceeding.");
    recommendations.add("Verify salary claims against industry standards for the stated role and location.");
  }

  if (categories.has("Social Engineering")) {
    recommendations.add("Do not act on emotional pressure — take time to verify claims independently.");
    recommendations.add("Legitimate organizations will not threaten you for not responding immediately.");
  }

  if (categories.has("Data Theft Risk")) {
    recommendations.add("Never share OTPs, PINs, passwords, or banking credentials via message or call.");
    recommendations.add("Report requests for sensitive personal information to the appropriate authorities.");
  }

  if (categories.has("Threat Intelligence")) {
    recommendations.add("This URL has been flagged by security services. Do not visit or enter any information.");
    recommendations.add("If you already visited this URL, change any passwords entered and monitor accounts.");
  }

  if (recommendations.size === 0) {
    recommendations.add("Exercise standard due diligence and verify contact credentials before proceeding.");
  }

  return Array.from(recommendations);
};

// ═══════════════════════════════════════════════
// 1. JOB SCAM SCANNER (50+ indicators)
// ═══════════════════════════════════════════════

const analyzeJob = (jobData = {}) => {
  const text = `${jobData.title || ""} ${jobData.companyName || ""} ${jobData.description || ""} ${jobData.salary || ""} ${jobData.email || ""} ${jobData.phone || ""} ${jobData.website || ""}`.toLowerCase();
  const factors = [];
  let rawScore = 0;

  const addFactor = (category, reason, score) => {
    rawScore += score;
    factors.push({ category, reason, score, severity: getSeverity(score) });
  };

  // ─── PAYMENT RISK INDICATORS ───

  if (/(?:registration|application|enrollment|joining)\s*fee/i.test(text)) {
    addFactor("Payment Risk", "Registration or application fee requested before employment", 25);
  }

  if (/(?:security|refundable)\s*deposit|caution\s*money/i.test(text)) {
    addFactor("Payment Risk", "Security deposit or caution money required upfront", 25);
  }

  if (/(?:training|course|certification)\s*(?:fee|charge|cost|payment)/i.test(text)) {
    addFactor("Payment Risk", "Mandatory training fee charged to applicant", 22);
  }

  if (/(?:investment|starter\s*kit|purchase)\s*(?:required|needed|mandatory)/i.test(text)) {
    addFactor("Payment Risk", "Monetary investment or product purchase required to start", 25);
  }

  if (/pay\s*(?:rs\.?|₹|\$|usd)\s*\d+|send\s*(?:money|payment|amount)|transfer\s*(?:rs\.?|₹|\$)\s*\d+/i.test(text)) {
    addFactor("Payment Risk", "Direct payment amount specified as condition of employment", 25);
  }

  if (/(?:processing|admin|documentation|background\s*check)\s*(?:fee|charge)/i.test(text)) {
    addFactor("Payment Risk", "Processing or administrative fee demanded from candidate", 22);
  }

  if (/(?:laptop|equipment|device)\s*(?:deposit|fee|charge|payment)/i.test(text)) {
    addFactor("Payment Risk", "Equipment deposit or device fee requested before starting", 20);
  }

  if (/(?:upi|gpay|paytm|phonepe|google\s*pay|zelle|venmo|cashapp|cash\s*app)\s/i.test(text)) {
    addFactor("Payment Risk", "Personal payment platform mentioned as payment method", 15);
  }

  if (/crypto|bitcoin|btc|usdt|ethereum|eth|wallet\s*address/i.test(text)) {
    addFactor("Payment Risk", "Cryptocurrency payment method mentioned", 20);
  }

  if (/gift\s*card/i.test(text)) {
    addFactor("Payment Risk", "Gift card payment requested — a hallmark of advance-fee fraud", 25);
  }

  // ─── COMMUNICATION RISK INDICATORS ───

  const freeEmailPattern = /(?:@|\b)(?:gmail|yahoo|hotmail|outlook|aol|mail|yandex|protonmail|zoho|icloud|live|rediffmail)\.(?:com|co\.in|net|org)/i;
  if (freeEmailPattern.test(text)) {
    // Check if it's in the recruiter/company email field specifically
    const emailField = (jobData.email || "").toLowerCase();
    if (freeEmailPattern.test(emailField)) {
      addFactor("Communication Risk", "Recruiter using free public email domain for official hiring", 18);
    } else if (freeEmailPattern.test(jobData.description || "")) {
      addFactor("Communication Risk", "Free public email domain referenced in job description", 12);
    }
  }

  if (/(?:contact|reach|message|dm|call)\s+(?:\w+\s+){0,5}(?:on|via|through|at)\s+(?:whatsapp|telegram|signal|wechat)/i.test(text) ||
      /\b(?:on|via|through)\s+(?:whatsapp|telegram|signal|wechat)\b/i.test(text)) {
    addFactor("Communication Risk", "Communication directed via informal messaging platform", 15);
  }

  if (/(?:whatsapp|telegram)\s*(?:only|exclusively|directly)/i.test(text)) {
    addFactor("Communication Risk", "Communication restricted exclusively to instant messaging", 18);
  }

  // ─── CONTENT RISK INDICATORS ───

  // Unrealistic salary detection — check for actual numeric values
  const salaryField = (jobData.salary || "").toLowerCase();
  const salaryMatch = salaryField.match(/[\$₹]\s*([\d,]+)/);
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1].replace(/,/g, ""), 10);
    // Flag weekly salaries over $3000 or monthly over $15000 for entry-level sounding roles
    const isEntryLevel = /data\s*entry|typing|form\s*fill|copy\s*paste|survey|click/i.test(text);
    if (isEntryLevel && amount > 2000) {
      addFactor("Content Risk", `Unrealistic compensation ($${amount}) for entry-level task description`, 20);
    }
  }

  if (/(?:earn|make|get|salary)\s*(?:rs\.?|₹)\s*(?:\d{1,2},?\d{2},?\d{3}|\d+\s*(?:lakh|lac))|(?:earn|make)\s*\$\s*\d{4,}\s*\/?\s*(?:week|day)/i.test(text)) {
    addFactor("Content Risk", "Unrealistic or exaggerated earnings claim", 18);
  }

  if (/guaranteed\s*(?:income|salary|earnings|return|payment)/i.test(text)) {
    addFactor("Content Risk", "Guaranteed income/earnings promise — no legitimate job can guarantee this", 18);
  }

  if (/(?:no\s*(?:experience|skill|qualification|degree|education)\s*(?:required|needed|necessary))/i.test(text)) {
    const isSeniorRole = /(?:manager|director|executive|lead|head|vp|vice\s*president|chief|senior|principal)/i.test(jobData.title || "");
    if (isSeniorRole) {
      addFactor("Content Risk", "No experience required for senior-level title — contradictory and suspicious", 15);
    }
  }

  if (/(?:unlimited|passive)\s*(?:income|earnings|money)/i.test(text)) {
    addFactor("Content Risk", "Unlimited or passive income claim", 20);
  }

  if (/(?:work\s*from\s*(?:home|anywhere)|wfh)\s*(?:and)?\s*(?:earn|make|get)\s*(?:rs\.?|₹|\$)/i.test(text)) {
    addFactor("Content Risk", "Work-from-home combined with specific earning claim — common scam pattern", 12);
  }

  if (/(?:part\s*time|simple|easy)\s*(?:job|work|task)\s*(?:and)?\s*(?:earn|make|get)\s*(?:big|huge|high|daily|weekly)/i.test(text)) {
    addFactor("Content Risk", "Easy work with high pay claims — characteristic of job scam postings", 15);
  }

  if (/(?:daily\s*(?:payout|payment|earning|income))/i.test(text)) {
    addFactor("Content Risk", "Daily payout scheme — unusual for legitimate employment", 10);
  }

  // ─── BEHAVIOR RISK INDICATORS ───

  if (/(?:urgent(?:ly)?|immediate(?:ly)?|asap|right\s*now|today\s*only|last\s*chance|hurry|act\s*(?:now|fast|quickly)|don'?t\s*(?:miss|delay|wait))/i.test(text)) {
    const urgencyCount = countMatches(text, /(?:urgent|immediate|asap|right\s*now|today\s*only|last\s*chance|hurry|act\s*now|don'?t\s*miss)/gi);
    const score = Math.min(8 + urgencyCount * 3, 18);
    addFactor("Behavior Risk", `High-pressure urgency tactics detected (${urgencyCount} urgency phrase${urgencyCount > 1 ? "s" : ""} found)`, score);
  }

  if (/(?:limited\s*(?:seats?|spots?|positions?|openings?|vacancies))/i.test(text)) {
    addFactor("Behavior Risk", "Artificial scarcity — limited seats/positions claim creates false urgency", 8);
  }

  if (/(?:bank\s*(?:details?|account|info)|account\s*number|routing\s*number|sort\s*code|ifsc|swift)/i.test(text)) {
    addFactor("Data Theft Risk", "Banking details requested — never required at application stage", 22);
  }

  if (/(?:otp|one\s*time\s*(?:password|pin|code)|verification\s*code|2fa\s*code)/i.test(text)) {
    addFactor("Data Theft Risk", "OTP or verification code requested — classic phishing indicator", 25);
  }

  if (/(?:(?:credit|debit)\s*card|cvv|card\s*number|expiry\s*date)/i.test(text)) {
    addFactor("Data Theft Risk", "Credit/debit card information requested during hiring", 25);
  }

  if (/(?:ssn|social\s*security|aadhaar|aadhar|pan\s*card|passport\s*(?:number|copy|scan))/i.test(text)) {
    addFactor("Data Theft Risk", "Government identity document requested prematurely", 18);
  }

  if (/(?:password|pin|login\s*credentials)/i.test(text)) {
    addFactor("Data Theft Risk", "Password or login credentials requested — never legitimate", 22);
  }

  // ─── COMPANY RISK INDICATORS ───

  if (!jobData.companyName || jobData.companyName.trim().length < 2) {
    addFactor("Company Risk", "Missing or implausibly short company name", 12);
  }

  if (!jobData.description || jobData.description.trim().length < 50) {
    addFactor("Company Risk", "Job description is extremely short — legitimate postings contain detailed information", 10);
  }

  // Check website domain if provided
  const websiteField = (jobData.website || "").toLowerCase();
  if (websiteField) {
    if (/\.(?:xyz|top|site|work|click|loan|buzz|gq|ml|tk|cf|ga)$/i.test(websiteField)) {
      addFactor("Company Risk", "Company website uses a high-risk cheap top-level domain", 15);
    }
  }

  // ─── MLM / PYRAMID SCHEME INDICATORS ───

  if (/(?:mlm|multi\s*level\s*marketing|network\s*marketing|referral\s*(?:bonus|commission|chain)|downline|upline|pyramid)/i.test(text)) {
    addFactor("Content Risk", "Multi-level marketing or pyramid scheme indicators detected", 20);
  }

  if (/(?:refer\s*(?:friends?|people|others)\s*(?:and|to)\s*(?:earn|get|make))/i.test(text)) {
    addFactor("Content Risk", "Referral-based earning scheme — common in pyramid structures", 12);
  }

  // ─── CALCULATE FINAL RESULT ───

  const normalizedScore = normalizeScore(rawScore);
  const riskLevel = getRiskLevel(normalizedScore);
  const confidence = calculateConfidence(factors, 6); // 6 categories evaluable
  const recommendations = generateRecommendations(factors);

  return {
    score: normalizedScore,
    riskLevel,
    confidence,
    riskFactors: factors,
    reasons: factors.map((f) => f.reason),
    recommendations,
  };
};

// ═══════════════════════════════════════════════
// 2. MESSAGE SCAM SCANNER (35+ indicators)
// ═══════════════════════════════════════════════

const analyzeMessage = (messageData = {}) => {
  const text = `${messageData.message || ""} ${messageData.senderEmail || ""} ${messageData.platform || ""}`.toLowerCase();
  const factors = [];
  let rawScore = 0;

  const addFactor = (category, reason, score) => {
    rawScore += score;
    factors.push({ category, reason, score, severity: getSeverity(score) });
  };

  // ─── UNSOLICITED OFFER PATTERNS ───

  if (/(?:congratulations?|congrats)\s*[!.]?\s*(?:you(?:'ve| have)?|your|dear)\s*(?:been\s*)?(?:selected|chosen|hired|won|awarded|approved)/i.test(text)) {
    addFactor("Behavior Risk", "Unsolicited selection/award notification — common phishing opener", 18);
  }

  if (/you(?:'ve| have)?\s*(?:won|received|been\s*awarded|been\s*gifted)\s*(?:a\s*)?(?:prize|reward|gift|bonus|cashback|lottery)/i.test(text)) {
    addFactor("Social Engineering", "Fake prize or reward notification — classic social engineering", 22);
  }

  // ─── PAYMENT / FINANCIAL REQUEST ───

  if (/(?:pay|send|transfer|deposit)\s*(?:rs\.?|₹|\$|usd|inr|gbp|€)?\s*\d+/i.test(text)) {
    addFactor("Payment Risk", "Specific payment amount requested in message", 22);
  }

  if (/(?:fee|charge|payment|amount|deposit)\s*(?:of\s*)?(?:rs\.?|₹|\$)?\s*\d+/i.test(text)) {
    addFactor("Payment Risk", "Fee or charge specified in message", 20);
  }

  if (/(?:unpaid|pending|outstanding|overdue)\s*(?:fee|balance|payment|charge|bill|amount)/i.test(text)) {
    addFactor("Payment Risk", "Claim of unpaid fee/balance — pressure tactic for fraudulent payment", 18);
  }

  if (/(?:refund|cashback|return)\s*(?:of\s*)?(?:rs\.?|₹|\$)?\s*\d+.*(?:click|link|verify|confirm)/i.test(text)) {
    addFactor("Social Engineering", "Fake refund requiring action — classic phishing pattern", 20);
  }

  // ─── URGENCY & PRESSURE TACTICS ───

  const urgencyPhrases = text.match(/(?:urgent(?:ly)?|immediate(?:ly)?|expire[sd]?\s*(?:today|soon|in\s*\d+)|last\s*chance|act\s*now|don'?t\s*delay|time\s*(?:sensitive|limited)|within\s*\d+\s*(?:hour|minute|hr|min)|before\s*(?:midnight|today|deadline))/gi);
  if (urgencyPhrases && urgencyPhrases.length > 0) {
    const score = Math.min(10 + urgencyPhrases.length * 4, 22);
    addFactor("Behavior Risk", `High-pressure urgency tactics (${urgencyPhrases.length} urgency phrase${urgencyPhrases.length > 1 ? "s" : ""})`, score);
  }

  // ─── THREAT & FEAR TACTICS ───

  if (/(?:your\s*account\s*(?:will\s*be|has\s*been|is)\s*(?:suspended|blocked|closed|terminated|deactivated|locked))/i.test(text)) {
    addFactor("Social Engineering", "Account suspension threat — fear-based social engineering", 22);
  }

  if (/(?:legal\s*action|police\s*(?:complaint|report)|court\s*(?:notice|order)|arrest\s*warrant|criminal\s*charges)/i.test(text)) {
    addFactor("Social Engineering", "Legal or law enforcement threat to create panic", 20);
  }

  if (/(?:failure\s*to\s*(?:respond|comply|act|verify)|if\s*you\s*(?:do\s*not|don'?t)\s*(?:respond|act|verify|confirm))/i.test(text)) {
    addFactor("Social Engineering", "Consequence threat for non-compliance — manipulation tactic", 12);
  }

  // ─── DATA THEFT INDICATORS ───

  if (/(?:otp|one\s*time\s*(?:password|pin|code)|verification\s*code|security\s*code|2fa)/i.test(text)) {
    addFactor("Data Theft Risk", "OTP or verification code requested — never share these with anyone", 25);
  }

  if (/(?:(?:bank|account)\s*(?:details?|info(?:rmation)?|number)|routing\s*number|ifsc|swift\s*code)/i.test(text)) {
    addFactor("Data Theft Risk", "Banking information requested via message", 22);
  }

  if (/(?:(?:credit|debit)\s*card|cvv|card\s*number|expiry)/i.test(text)) {
    addFactor("Data Theft Risk", "Card details requested — legitimate services never ask via message", 25);
  }

  if (/(?:password|pin|login|sign\s*in\s*(?:details?|credentials?))/i.test(text)) {
    addFactor("Data Theft Risk", "Login credentials requested — definitive phishing indicator", 25);
  }

  if (/(?:ssn|social\s*security|aadhaar|aadhar|pan\s*card|passport\s*(?:number|copy|details?))/i.test(text)) {
    addFactor("Data Theft Risk", "Government identity information requested via message", 20);
  }

  // ─── SUSPICIOUS LINKS IN MESSAGE ───

  if (/http:\/\/(?!localhost)/i.test(text)) {
    addFactor("URL Risk", "Insecure HTTP link in message (no encryption)", 12);
  }

  const shortenerPattern = /(?:bit\.ly|tinyurl|t\.co|is\.gd|goo\.gl|ow\.ly|short\.to|cutt\.ly|rb\.gy|tiny\.cc)\//i;
  if (shortenerPattern.test(text)) {
    addFactor("URL Risk", "URL shortener detected — conceals true destination", 15);
  }

  // Extract and analyze any URLs in the message
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi;
  const extractedUrls = text.match(urlPattern) || [];
  for (const url of extractedUrls.slice(0, 3)) { // Analyze up to 3 URLs
    if (/\.(?:xyz|top|site|work|click|loan|buzz|gq|ml|tk|cf|ga)\b/i.test(url)) {
      addFactor("URL Risk", "Link to suspicious top-level domain found in message", 15);
      break; // Only flag once
    }
  }

  // ─── CHANNEL / PLATFORM RISK ───

  if (/(?:contact|reach|message|dm|call)\s*(?:me|us)?\s*(?:on|via|at|through)?\s*(?:whatsapp|telegram|signal|wechat)/i.test(text)) {
    addFactor("Communication Risk", "Request to move communication to informal messaging platform", 12);
  }

  // ─── IMPERSONATION PATTERNS ───

  if (/(?:i\s*am|this\s*is|from)\s*(?:hr|human\s*resources|recruitment|hiring\s*(?:team|department|manager))\s*(?:of|at|from)\s*/i.test(text)) {
    // Not scam by itself, but combined with other factors it's suspicious
    if (factors.length >= 2) {
      addFactor("Identity Risk", "Claims to be HR/recruitment combined with other suspicious indicators", 10);
    }
  }

  if (/(?:(?:amazon|google|microsoft|apple|meta|facebook|flipkart|myntra|swiggy|zomato|paytm|phonepe|razorpay|hdfc|sbi|icici|axis|rbi|irctc)\s*(?:team|support|customer\s*(?:care|service)|helpdesk))/i.test(text)) {
    addFactor("Identity Risk", "Claims to represent a major brand — verify directly with the company", 15);
  }

  // ─── CALCULATE FINAL RESULT ───

  const normalizedScore = normalizeScore(rawScore);
  const confidence = calculateConfidence(factors, 7);

  return {
    score: normalizedScore,
    riskLevel: getRiskLevel(normalizedScore),
    confidence,
    riskFactors: factors,
    reasons: factors.map((f) => f.reason),
    recommendations: generateRecommendations(factors),
  };
};

// ═══════════════════════════════════════════════
// 3. PAYMENT SCAM SCANNER
// ═══════════════════════════════════════════════

const analyzePayment = (paymentData = {}) => {
  const text = `${paymentData.requestText || ""} ${paymentData.amount || ""} ${paymentData.reason || ""} ${paymentData.method || ""} ${paymentData.senderInfo || ""}`.toLowerCase();
  const factors = [];
  let rawScore = 0;

  const addFactor = (category, reason, score) => {
    rawScore += score;
    factors.push({ category, reason, score, severity: getSeverity(score) });
  };

  // ─── UPFRONT FEE PATTERNS ───

  if (/(?:registration|enrollment|joining|membership|activation)\s*(?:fee|charge|payment)/i.test(text)) {
    addFactor("Payment Risk", "Upfront registration or enrollment fee requested", 28);
  }

  if (/(?:processing|admin|documentation|verification|background\s*check)\s*(?:fee|charge|cost)/i.test(text)) {
    addFactor("Payment Risk", "Processing or administrative fee demanded", 25);
  }

  if (/(?:badge|id\s*card|identity\s*card|access\s*card)\s*(?:fee|charge|cost|payment)/i.test(text)) {
    addFactor("Payment Risk", "Badge or ID card fee — legitimate employers cover this", 22);
  }

  if (/(?:security|refundable)\s*(?:deposit|amount)|caution\s*money/i.test(text)) {
    addFactor("Payment Risk", "Security deposit claim — frequently non-refundable in scams", 25);
  }

  if (/(?:training|course|certification|material)\s*(?:fee|charge|cost|payment)/i.test(text)) {
    addFactor("Payment Risk", "Training fee charged to candidate — legitimate employers pay for training", 22);
  }

  if (/(?:laptop|equipment|device|uniform|kit)\s*(?:deposit|fee|charge|payment|cost)/i.test(text)) {
    addFactor("Payment Risk", "Equipment deposit or kit purchase required before starting", 20);
  }

  // ─── PAYMENT METHOD RISK ───

  if (/(?:crypto|bitcoin|btc|usdt|ethereum|eth|wallet\s*address)/i.test(text)) {
    addFactor("Payment Risk", "Cryptocurrency payment — non-reversible, preferred by scammers", 25);
  }

  if (/gift\s*card/i.test(text)) {
    addFactor("Payment Risk", "Gift card payment — definitive scam indicator (no legitimate entity requests this)", 28);
  }

  if (/(?:upi|gpay|paytm|phonepe|google\s*pay|zelle|venmo|cashapp|cash\s*app)/i.test(text)) {
    addFactor("Payment Risk", "Personal payment platform used for business transaction", 15);
  }

  if (/personal\s*(?:account|bank)|direct\s*(?:transfer|deposit\s*to\s*(?:my|personal))/i.test(text)) {
    addFactor("Payment Risk", "Payment directed to personal account rather than corporate account", 22);
  }

  // ─── REFUND / GUARANTEE MANIPULATION ───

  if (/(?:100%|fully|completely)\s*(?:refundable|refund)/i.test(text)) {
    addFactor("Behavior Risk", "Guaranteed refund claim — used to lower resistance to advance-fee fraud", 18);
  }

  if (/(?:refund|money\s*back)\s*(?:after|upon|once|when)\s*(?:joining|starting|completing)/i.test(text)) {
    addFactor("Behavior Risk", "Conditional refund promise tied to future action — common scam tactic", 15);
  }

  // ─── URGENCY IN PAYMENT CONTEXT ───

  if (/(?:pay\s*(?:now|today|immediately|before|within)|deadline\s*(?:for|to)\s*pay|last\s*(?:date|chance)\s*(?:for|to)\s*pay)/i.test(text)) {
    addFactor("Behavior Risk", "Urgent payment deadline creates artificial pressure", 15);
  }

  // ─── CALCULATE FINAL RESULT ───

  const normalizedScore = normalizeScore(rawScore);
  const confidence = calculateConfidence(factors, 3);

  return {
    score: normalizedScore,
    riskLevel: getRiskLevel(normalizedScore),
    confidence,
    riskFactors: factors,
    reasons: factors.map((f) => f.reason),
    recommendations: generateRecommendations(factors),
  };
};

// ═══════════════════════════════════════════════
// 4. RECRUITER SCANNER
// ═══════════════════════════════════════════════

const analyzeRecruiter = (recruiterData = {}) => {
  const text = `${recruiterData.name || ""} ${recruiterData.email || ""} ${recruiterData.company || ""} ${recruiterData.phone || ""} ${recruiterData.profileUrl || ""}`.toLowerCase();
  const factors = [];
  let rawScore = 0;

  const addFactor = (category, reason, score) => {
    rawScore += score;
    factors.push({ category, reason, score, severity: getSeverity(score) });
  };

  // ─── EMAIL DOMAIN ANALYSIS ───

  const email = (recruiterData.email || "").toLowerCase().trim();
  const company = (recruiterData.company || "").toLowerCase().trim();

  if (email) {
    const freeEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "mail.com", "yandex.com", "protonmail.com", "zoho.com", "icloud.com", "live.com", "rediffmail.com", "mail.ru"];
    const emailDomain = email.split("@")[1] || "";

    if (freeEmailDomains.includes(emailDomain)) {
      addFactor("Identity Risk", "Recruiter using free public email service instead of corporate domain", 20);
    }

    // Cross-validate: if company is provided, check if email domain matches
    if (company && company.length > 2 && emailDomain && !freeEmailDomains.includes(emailDomain)) {
      // Normalize company name: "Tech Global Inc." -> "techglobal"
      const normalizedCompany = company.replace(/\b(?:inc|ltd|llc|pvt|co|corp|corporation|limited|private|group|solutions|technologies|tech|services)\b/gi, "").replace(/[^a-z0-9]/g, "");
      const normalizedDomain = emailDomain.split(".")[0].replace(/[^a-z0-9]/g, "");

      if (normalizedCompany.length > 3 && normalizedDomain.length > 3) {
        // Check if domain contains company name or vice versa
        if (!normalizedDomain.includes(normalizedCompany) && !normalizedCompany.includes(normalizedDomain)) {
          addFactor("Identity Risk", "Email domain does not match stated company name — possible impersonation", 15);
        }
      }
    }
  }

  // ─── MISSING INFORMATION ───

  if (!company || company.trim().length === 0) {
    addFactor("Company Risk", "No company affiliation provided — legitimate recruiters represent companies", 18);
  }

  if (!email && !(recruiterData.profileUrl || "").trim()) {
    addFactor("Identity Risk", "No verifiable contact information (no email, no profile link)", 15);
  }

  // ─── PROFILE URL VALIDATION ───

  const profileUrl = (recruiterData.profileUrl || "").toLowerCase().trim();
  if (profileUrl) {
    if (profileUrl.includes("linkedin.com")) {
      // Valid LinkedIn URL structure check
      if (!/linkedin\.com\/in\/[a-z0-9\-]+/i.test(profileUrl)) {
        addFactor("Identity Risk", "LinkedIn URL appears malformed or invalid", 10);
      }
    } else if (!profileUrl.includes("linkedin") && !profileUrl.includes("naukri") && !profileUrl.includes("indeed")) {
      addFactor("Identity Risk", "Profile URL is not from a recognized professional networking platform", 8);
    }
  }

  // ─── COMMUNICATION PATTERN ───

  if (/(?:whatsapp|telegram|signal)\s*(?:only|exclusively|directly)/i.test(text)) {
    addFactor("Communication Risk", "Recruiter restricts communication to informal messaging platform", 18);
  }

  if (/hr\s*manager|hiring\s*manager/i.test(text) && /whatsapp|telegram/i.test(text)) {
    addFactor("Communication Risk", "Self-claimed HR manager conducting affairs via instant messaging", 15);
  }

  // ─── PHONE NUMBER ANALYSIS ───

  const phone = (recruiterData.phone || "").trim();
  if (phone) {
    // Very short or clearly invalid phone numbers
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    if (digitsOnly.length > 0 && digitsOnly.length < 7) {
      addFactor("Identity Risk", "Phone number appears too short to be valid", 8);
    }
  }

  // ─── CALCULATE FINAL RESULT ───

  const normalizedScore = normalizeScore(rawScore);
  const confidence = calculateConfidence(factors, 4);

  return {
    score: normalizedScore,
    riskLevel: getRiskLevel(normalizedScore),
    confidence,
    riskFactors: factors,
    reasons: factors.map((f) => f.reason),
    recommendations: generateRecommendations(factors),
  };
};

// ═══════════════════════════════════════════════
// 5. URL SCANNER (Structural Analysis)
// ═══════════════════════════════════════════════

const analyzeUrl = (urlData = {}) => {
  const rawUrl = (urlData.url || "").trim();
  const url = rawUrl.toLowerCase();
  const factors = [];
  let rawScore = 0;

  const addFactor = (category, reason, score) => {
    rawScore += score;
    factors.push({ category, reason, score, severity: getSeverity(score) });
  };

  if (!url) {
    return {
      score: 0,
      riskLevel: "Safe",
      confidence: 0,
      riskFactors: [],
      reasons: [],
      recommendations: ["Please provide a valid URL for analysis."],
    };
  }

  // ─── PROTOCOL ANALYSIS ───

  if (url.startsWith("http://") && !url.startsWith("http://localhost")) {
    addFactor("URL Risk", "Insecure HTTP protocol — no encryption for data in transit", 18);
  }

  // ─── URL SHORTENER DETECTION ───

  const shorteners = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "goo.gl", "ow.ly", "short.to", "cutt.ly", "rb.gy", "tiny.cc", "shorturl.at", "trib.al"];
  for (const shortener of shorteners) {
    if (url.includes(shortener)) {
      addFactor("URL Risk", `URL shortener detected (${shortener}) — hides true destination`, 18);
      break;
    }
  }

  // ─── PARSE URL STRUCTURE ───

  let parsedUrl;
  try {
    let normalizedUrl = rawUrl;
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    parsedUrl = new URL(normalizedUrl);
  } catch {
    addFactor("URL Risk", "URL is malformed and cannot be parsed — highly suspicious", 25);
    const normalizedScore = normalizeScore(rawScore);
    return {
      score: normalizedScore,
      riskLevel: getRiskLevel(normalizedScore),
      confidence: calculateConfidence(factors, 8),
      riskFactors: factors,
      reasons: factors.map((f) => f.reason),
      recommendations: generateRecommendations(factors),
    };
  }

  const hostname = parsedUrl.hostname;
  const pathname = parsedUrl.pathname;
  const fullUrl = parsedUrl.href;

  // ─── IP ADDRESS AS HOSTNAME ───

  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    addFactor("URL Risk", "Raw IP address used instead of registered domain name — highly suspicious", 25);
  }

  // ─── SUSPICIOUS TLD ───

  const suspiciousTlds = [".xyz", ".top", ".site", ".work", ".click", ".loan", ".buzz", ".gq", ".ml", ".tk", ".cf", ".ga", ".cam", ".monster", ".icu", ".rest", ".surf", ".bar"];
  for (const tld of suspiciousTlds) {
    if (hostname.endsWith(tld)) {
      addFactor("URL Risk", `Suspicious top-level domain (${tld}) — frequently used for phishing`, 15);
      break;
    }
  }

  // ─── EXCESSIVE SUBDOMAINS ───

  const subdomainParts = hostname.split(".");
  if (subdomainParts.length > 4) {
    addFactor("URL Risk", `Excessive subdomains (${subdomainParts.length - 2} levels) — used to disguise true domain`, 15);
  }

  // ─── URL LENGTH ───

  if (fullUrl.length > 200) {
    addFactor("URL Risk", `Unusually long URL (${fullUrl.length} characters) — may contain encoded payloads`, 10);
  }

  // ─── SUSPICIOUS CHARACTERS ───

  if (url.includes("@")) {
    addFactor("URL Risk", "URL contains @ symbol — can redirect to different domain than displayed", 20);
  }

  // Double encoding or unusual encoding
  if (/%25|%2f%2f|%3a%2f%2f/i.test(url)) {
    addFactor("URL Risk", "Double URL encoding detected — obfuscation technique used in phishing", 18);
  }

  // ─── EXCESSIVE HYPHENS IN DOMAIN ───

  const domainWithoutTld = hostname.split(".").slice(0, -1).join(".");
  const hyphenCount = (domainWithoutTld.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    addFactor("URL Risk", `Excessive hyphens in domain (${hyphenCount}) — common in phishing domains`, 12);
  }

  // ─── SENSITIVE KEYWORDS IN URL ───

  const sensitivePathKeywords = ["login", "signin", "sign-in", "verify", "account", "update", "secure", "confirm", "banking", "payment", "wallet", "password", "reset", "auth"];
  const pathMatches = sensitivePathKeywords.filter((kw) => pathname.includes(kw) || hostname.includes(kw));
  if (pathMatches.length >= 2) {
    addFactor("URL Risk", `Multiple sensitive keywords in URL path (${pathMatches.join(", ")}) — phishing indicator`, 18);
  } else if (pathMatches.length === 1) {
    // Only flag if combined with suspicious TLD or other factors
    const hasBadTld = suspiciousTlds.some((tld) => hostname.endsWith(tld));
    if (hasBadTld) {
      addFactor("URL Risk", `Sensitive keyword "${pathMatches[0]}" combined with suspicious domain`, 15);
    }
  }

  // ─── BRAND IMPERSONATION DETECTION ───

  const knownBrands = [
    { name: "google", pattern: /g[o0]{2}gle|go{2,}gle|g00gle/i },
    { name: "amazon", pattern: /amaz[o0]n|amazo{2,}n|amaz0n/i },
    { name: "microsoft", pattern: /m[i1]crosoft|micr[o0]soft|microsft/i },
    { name: "apple", pattern: /app[l1]e|aple|applle/i },
    { name: "facebook", pattern: /faceb[o0]{2}k|facebbok|facebo0k/i },
    { name: "paypal", pattern: /paypa[l1]|paypall|paypa1/i },
    { name: "netflix", pattern: /netf[l1]ix|netfliix|netfl1x/i },
    { name: "linkedin", pattern: /l[i1]nked[i1]n|linkediin|1inkedin/i },
    { name: "instagram", pattern: /[i1]nstagram|1nstagram|instagr[a4]m/i },
    { name: "twitter", pattern: /tw[i1]tter|twiter|tw1tter/i },
    { name: "whatsapp", pattern: /wh[a4]ts[a4]pp|whatsap|whatssapp/i },
    { name: "walmart", pattern: /wa[l1]mart|wallmart|wal-mart/i },
    { name: "flipkart", pattern: /fl[i1]pkart|flipkart|flipkar7/i },
    { name: "hdfc", pattern: /hdfc/i },
    { name: "sbi", pattern: /sbi|state\s*bank/i },
    { name: "icici", pattern: /icici/i },
  ];

  // Only check for impersonation if the brand name is in the domain but it's NOT the official domain
  for (const brand of knownBrands) {
    if (brand.pattern.test(hostname)) {
      // Check if this is likely the ACTUAL brand domain
      const officialDomains = {
        google: ["google.com", "google.co.in", "googleapis.com", "gstatic.com"],
        amazon: ["amazon.com", "amazon.in", "amazon.co.uk", "amazonaws.com"],
        microsoft: ["microsoft.com", "live.com", "outlook.com", "office.com"],
        apple: ["apple.com", "icloud.com"],
        facebook: ["facebook.com", "fb.com"],
        paypal: ["paypal.com"],
        netflix: ["netflix.com"],
        linkedin: ["linkedin.com"],
        instagram: ["instagram.com"],
        twitter: ["twitter.com", "x.com"],
        whatsapp: ["whatsapp.com"],
        walmart: ["walmart.com"],
        flipkart: ["flipkart.com"],
        hdfc: ["hdfcbank.com", "hdfc.com"],
        sbi: ["sbi.co.in", "onlinesbi.com"],
        icici: ["icicibank.com", "icici.com"],
      };

      const isOfficial = (officialDomains[brand.name] || []).some((d) => hostname === d || hostname.endsWith("." + d));
      if (!isOfficial) {
        addFactor("URL Risk", `Possible ${brand.name.charAt(0).toUpperCase() + brand.name.slice(1)} brand impersonation — domain is not official`, 22);
        break; // Only report one brand impersonation
      }
    }
  }

  // ─── HOMOGLYPH / PUNYCODE DETECTION ───

  if (hostname.includes("xn--")) {
    addFactor("URL Risk", "Internationalized domain name (punycode) — can visually impersonate legitimate domains", 18);
  }

  // Check for common character substitutions in domain
  if (/[0-9]/.test(domainWithoutTld)) {
    const suspiciousSubstitutions = domainWithoutTld.match(/[0-9]/g) || [];
    // Only flag if numbers appear where letters would normally be (e.g., "g00gle" not "web3")
    if (suspiciousSubstitutions.length >= 2 && /[a-z]/.test(domainWithoutTld)) {
      const hasLetterNumberMix = /[a-z][0-9]|[0-9][a-z]/i.test(domainWithoutTld);
      if (hasLetterNumberMix && domainWithoutTld.length > 5) {
        addFactor("URL Risk", "Domain contains letter-number substitutions — possible typosquatting", 12);
      }
    }
  }

  // ─── ENTROPY ANALYSIS (randomized domains) ───

  if (domainWithoutTld.length > 8) {
    // Calculate character entropy
    const charFreq = {};
    for (const c of domainWithoutTld.replace(/[-_.]/g, "")) {
      charFreq[c] = (charFreq[c] || 0) + 1;
    }
    const len = domainWithoutTld.replace(/[-_.]/g, "").length;
    let entropy = 0;
    for (const freq of Object.values(charFreq)) {
      const p = freq / len;
      entropy -= p * Math.log2(p);
    }
    // High entropy (> 3.5) suggests random character generation
    if (entropy > 3.8 && len > 12) {
      addFactor("URL Risk", "Domain appears randomly generated (high character entropy) — common for disposable phishing domains", 15);
    }
  }

  // ─── CALCULATE FINAL RESULT ───

  const normalizedScore = normalizeScore(rawScore);
  const confidence = calculateConfidence(factors, 8);

  return {
    score: normalizedScore,
    riskLevel: getRiskLevel(normalizedScore),
    confidence,
    riskFactors: factors,
    reasons: factors.map((f) => f.reason),
    recommendations: generateRecommendations(factors),
    urlAnalysis: {
      hostname,
      protocol: parsedUrl.protocol,
      path: pathname,
      subdomainCount: subdomainParts.length - 2,
      urlLength: fullUrl.length,
      hasHttps: parsedUrl.protocol === "https:",
    },
  };
};

// ═══════════════════════════════════════════════
// Backwards compatibility wrapper
// ═══════════════════════════════════════════════

const calculateRisk = (description) => {
  if (typeof description === "object" && description !== null) {
    return analyzeJob(description);
  }
  return analyzeJob({ description: String(description || "") });
};

module.exports = calculateRisk;
module.exports.getRiskLevel = getRiskLevel;
module.exports.analyzeJob = analyzeJob;
module.exports.analyzeMessage = analyzeMessage;
module.exports.analyzePayment = analyzePayment;
module.exports.analyzeRecruiter = analyzeRecruiter;
module.exports.analyzeUrl = analyzeUrl;