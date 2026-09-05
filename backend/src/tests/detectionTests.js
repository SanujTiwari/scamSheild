/**
 * ScamShield Detection Engine Test Suite
 * Tests rule-based detection across all scanner types
 *
 * Run: node src/tests/detectionTests.js
 */

const { analyzeJob, analyzeMessage, analyzePayment, analyzeRecruiter, analyzeUrl } = require("../services/riskEngine");

let passed = 0;
let failed = 0;

const assert = (testName, condition, actual, expected) => {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}`);
    console.log(`     Expected: ${expected}`);
    console.log(`     Actual:   ${actual}`);
    failed++;
  }
};

const assertRange = (testName, value, min, max) => {
  const condition = value >= min && value <= max;
  assert(testName, condition, value, `${min}-${max}`);
};

// ═══════════════════════════════════════════════
console.log("\n🔍 ScamShield Detection Engine Test Suite");
console.log("═".repeat(55));

// ─── TEST 1: Legitimate Job ───
console.log("\n📋 Test 1: Legitimate Software Engineer Job");
const legitimateJob = analyzeJob({
  title: "Senior Software Engineer",
  companyName: "Google",
  description: "We are looking for a Senior Software Engineer to join our Cloud Platform team. You will design, develop, and maintain large-scale distributed systems. Requirements: 5+ years of experience in Java, Python, or Go. Strong understanding of distributed systems and data structures. BS/MS in Computer Science or equivalent. We offer competitive salary, equity, health insurance, and flexible work arrangements.",
  salary: "$180,000/year",
  email: "careers@google.com",
  website: "google.com",
});
assertRange("Score should be ≤ 20 (Safe)", legitimateJob.score, 0, 20);
assert("Risk level should be Safe", legitimateJob.riskLevel === "Safe", legitimateJob.riskLevel, "Safe");
assert("Should have few or no risk factors", legitimateJob.riskFactors.length <= 2, legitimateJob.riskFactors.length, "≤ 2");

// ─── TEST 2: Obvious Job Scam ───
console.log("\n📋 Test 2: Obvious Job Scam");
const obviousScam = analyzeJob({
  title: "Data Entry Specialist",
  companyName: "Global Apex Solutions",
  description: "Earn $4,200/week working from home! No experience required. Simple data entry work. Registration fee of $89 required before start. Pay via UPI or gift card. Urgent hiring — limited seats available! Contact us on WhatsApp immediately. Send your bank details and OTP to verify your account.",
  salary: "$4,200/week",
  email: "hr-apex@gmail.com",
  website: "apex-solutions-fake.xyz",
});
assertRange("Score should be ≥ 70 (High/Critical)", obviousScam.score, 70, 100);
assert("Risk level should be High or Critical", ["High Risk", "Critical Risk"].includes(obviousScam.riskLevel), obviousScam.riskLevel, "High Risk or Critical Risk");
assert("Should have 5+ risk factors", obviousScam.riskFactors.length >= 5, obviousScam.riskFactors.length, "≥ 5");
assert("Should detect payment risk", obviousScam.riskFactors.some(f => f.category === "Payment Risk"), "found", "Payment Risk category");
assert("Should detect data theft risk", obviousScam.riskFactors.some(f => f.category === "Data Theft Risk"), "found", "Data Theft Risk category");

// ─── TEST 3: Mixed Signals Job ───
console.log("\n📋 Test 3: Suspicious Job with Mixed Signals");
const mixedJob = analyzeJob({
  title: "Customer Support Representative",
  companyName: "TechCorp Solutions",
  description: "Join our customer support team! Work from home and handle customer inquiries via phone and email. Training provided. Contact our hiring manager on WhatsApp for more details.",
  salary: "$35,000/year",
  email: "hiring@techcorp-solutions.com",
});
assertRange("Score should be 15-55 (Low-Medium)", mixedJob.score, 10, 55);
assert("Should have at least 1 factor", mixedJob.riskFactors.length >= 1, mixedJob.riskFactors.length, "≥ 1");

// ─── TEST 4: Legitimate URL ───
console.log("\n📋 Test 4: Legitimate URL (google.com)");
const legitimateUrl = analyzeUrl({ url: "https://www.google.com" });
assertRange("Score should be ≤ 15 (Safe)", legitimateUrl.score, 0, 15);
assert("Risk level should be Safe", legitimateUrl.riskLevel === "Safe", legitimateUrl.riskLevel, "Safe");

// ─── TEST 5: Known Phishing Pattern URL ───
console.log("\n📋 Test 5: Phishing Pattern URL");
const phishingUrl = analyzeUrl({ url: "http://192.168.1.1/login/verify-account" });
assertRange("Score should be ≥ 50 (Medium+)", phishingUrl.score, 50, 100);
assert("Should detect IP address usage", phishingUrl.riskFactors.some(f => f.reason.includes("IP address")), "found", "IP address factor");
assert("Should detect HTTP", phishingUrl.riskFactors.some(f => f.reason.includes("HTTP")), "found", "HTTP factor");

// ─── TEST 6: Suspicious Domain ───
console.log("\n📋 Test 6: Suspicious Domain (amaz0n-careers.xyz)");
const suspiciousDomain = analyzeUrl({ url: "https://amaz0n-careers-apply.xyz/login/verify" });
assertRange("Score should be ≥ 40 (Medium+)", suspiciousDomain.score, 40, 100);
assert("Should detect brand impersonation", suspiciousDomain.riskFactors.some(f => f.reason.toLowerCase().includes("impersonation") || f.reason.toLowerCase().includes("amazon")), "found", "brand impersonation");
assert("Should detect suspicious TLD", suspiciousDomain.riskFactors.some(f => f.reason.includes("top-level domain")), "found", "suspicious TLD");

// ─── TEST 7: Scam SMS ───
console.log("\n📋 Test 7: Scam SMS");
const scamSms = analyzeMessage({
  message: "URGENT: Your bank account has been suspended. Click here to verify: http://sbi-verify-account.xyz/login. Enter your OTP and password to reactivate immediately. Failure to act within 2 hours will result in permanent account closure.",
  platform: "SMS",
});
assertRange("Score should be ≥ 55 (Medium-High+)", scamSms.score, 55, 100);
assert("Should detect urgency", scamSms.riskFactors.some(f => f.reason.toLowerCase().includes("urgency")), "found", "urgency detection");
assert("Should detect OTP request", scamSms.riskFactors.some(f => f.reason.toLowerCase().includes("otp") || f.category === "Data Theft Risk"), "found", "OTP/data theft");
assert("Should detect suspicious URL", scamSms.riskFactors.some(f => f.category === "URL Risk"), "found", "URL Risk");

// ─── TEST 8: Legitimate SMS ───
console.log("\n📋 Test 8: Legitimate SMS");
const legitimateSms = analyzeMessage({
  message: "Your order #12345 has been shipped via FedEx. Expected delivery: Tuesday. Track at fedex.com/track",
  platform: "SMS",
});
assertRange("Score should be ≤ 25 (Safe/Low)", legitimateSms.score, 0, 25);

// ─── TEST 9: Scam Email ───
console.log("\n📋 Test 9: Scam Email (Fake Reward + Payment)");
const scamEmail = analyzeMessage({
  message: "Congratulations! You have been selected as the winner of our $50,000 prize. To claim your reward, you must pay a processing fee of $199 via gift card. This offer expires today — act now or lose your prize forever! Click here to claim: http://prize-claim-center.top/verify",
  senderEmail: "rewards@prize-winner.xyz",
  platform: "Email",
});
assertRange("Score should be ≥ 60 (High+)", scamEmail.score, 60, 100);
assert("Should detect social engineering", scamEmail.riskFactors.some(f => f.category === "Social Engineering" || f.category === "Behavior Risk"), "found", "Social Engineering/Behavior");
assert("Should detect payment request", scamEmail.riskFactors.some(f => f.category === "Payment Risk"), "found", "Payment Risk");

// ─── TEST 10: Legitimate Recruitment Email ───
console.log("\n📋 Test 10: Legitimate Recruitment Email");
const legitimateRecruitment = analyzeMessage({
  message: "Hi, I came across your profile on LinkedIn and would like to discuss a software engineering opportunity at our company. We are hiring for our backend team and your experience seems like a great fit. Would you be available for a call this week? Best regards, Sarah from Microsoft Talent Acquisition.",
  senderEmail: "sarah@microsoft.com",
  platform: "Email",
});
assertRange("Score should be ≤ 30 (Safe/Low)", legitimateRecruitment.score, 0, 30);

// ─── ADDITIONAL: Payment Scam Test ───
console.log("\n📋 Test 11: Payment Scam (Registration Fee + Gift Card)");
const paymentScam = analyzePayment({
  requestText: "Required registration fee of $89 for laptop shipment deposit. Payment via gift card or crypto only. 100% refundable after joining. Pay now before deadline expires.",
  amount: "$89",
  reason: "Laptop deposit",
  method: "Gift Cards",
});
assertRange("Score should be ≥ 65 (High+)", paymentScam.score, 65, 100);
assert("Should detect multiple payment risks", paymentScam.riskFactors.filter(f => f.category === "Payment Risk").length >= 2, paymentScam.riskFactors.filter(f => f.category === "Payment Risk").length, "≥ 2");

// ─── ADDITIONAL: Recruiter Scam Test ───
console.log("\n📋 Test 12: Suspicious Recruiter (Gmail + No Company)");
const suspiciousRecruiter = analyzeRecruiter({
  name: "John Smith",
  email: "john.hr.hiring@gmail.com",
  phone: "+1 555",
  company: "",
  profileUrl: "",
});
assertRange("Score should be ≥ 35 (Medium+)", suspiciousRecruiter.score, 35, 100);
assert("Should detect free email", suspiciousRecruiter.riskFactors.some(f => f.reason.includes("free public email")), "found", "free email detection");
assert("Should detect missing company", suspiciousRecruiter.riskFactors.some(f => f.category === "Company Risk"), "found", "Company Risk");

// ─── ADDITIONAL: Legitimate Recruiter Test ───
console.log("\n📋 Test 13: Legitimate Recruiter");
const legitimateRecruiter = analyzeRecruiter({
  name: "Sarah Johnson",
  email: "sarah.johnson@microsoft.com",
  phone: "+1 425-555-0100",
  company: "Microsoft",
  profileUrl: "https://linkedin.com/in/sarah-johnson-recruiter",
});
assertRange("Score should be ≤ 20 (Safe)", legitimateRecruiter.score, 0, 20);

// ═══════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions`);
console.log(`   ${failed === 0 ? "🎉 All tests passed!" : `⚠️  ${failed} test(s) need attention`}`);
console.log("");

process.exit(failed > 0 ? 1 : 0);
