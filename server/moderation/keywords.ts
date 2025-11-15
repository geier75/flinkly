/**
 * Content Moderation - Keyword Blacklist
 * 
 * Detects prohibited content in gig titles, descriptions, and messages.
 * Auto-rejects critical keywords, flags suspicious ones for manual review.
 */

export interface ModerationResult {
  allowed: boolean;
  severity: "none" | "low" | "medium" | "high" | "critical";
  flaggedKeywords: string[];
  reason?: string;
}

/**
 * Critical keywords - Auto-reject immediately
 */
const CRITICAL_KEYWORDS = [
  // Illegal services
  "hack",
  "hacking",
  "crack",
  "piracy",
  "warez",
  "torrent",
  "stolen",
  "fake id",
  "fake passport",
  "fake document",
  "money laundering",
  "tax evasion",
  
  // Adult content
  "porn",
  "escort",
  "prostitution",
  "sex",
  "adult content",
  
  // Drugs
  "cocaine",
  "heroin",
  "meth",
  "mdma",
  "ecstasy",
  
  // Weapons
  "gun",
  "weapon",
  "explosive",
  "bomb",
  
  // Hate speech
  "nazi",
  "terrorist",
  "jihad",
];

/**
 * High-severity keywords - Flag for manual review
 */
const HIGH_SEVERITY_KEYWORDS = [
  // Suspicious services
  "guarantee",
  "100% success",
  "get rich quick",
  "pyramid scheme",
  "mlm",
  "multi-level marketing",
  
  // Contact info (trying to bypass platform)
  "whatsapp",
  "telegram",
  "signal",
  "my email",
  "contact me at",
  "dm me",
  
  // External payment
  "paypal",
  "venmo",
  "cash app",
  "bitcoin",
  "crypto",
  "wire transfer",
  "bank transfer",
];

/**
 * Medium-severity keywords - Flag for review if multiple detected
 */
const MEDIUM_SEVERITY_KEYWORDS = [
  "free",
  "unlimited",
  "instant",
  "fast money",
  "no experience needed",
  "work from home",
];

/**
 * Moderate text content for prohibited keywords
 */
export function moderateText(text: string): ModerationResult {
  const lowerText = text.toLowerCase();
  const flaggedKeywords: string[] = [];
  let severity: ModerationResult["severity"] = "none";

  // Check critical keywords
  for (const keyword of CRITICAL_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      flaggedKeywords.push(keyword);
      severity = "critical";
    }
  }

  // If critical keywords found, auto-reject
  if (severity === "critical") {
    return {
      allowed: false,
      severity,
      flaggedKeywords,
      reason: "Content contains prohibited keywords",
    };
  }

  // Check high-severity keywords
  for (const keyword of HIGH_SEVERITY_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      flaggedKeywords.push(keyword);
      severity = "high";
    }
  }

  // Check medium-severity keywords
  let mediumCount = 0;
  for (const keyword of MEDIUM_SEVERITY_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      flaggedKeywords.push(keyword);
      mediumCount++;
    }
  }

  // If 3+ medium-severity keywords, escalate to high
  if (mediumCount >= 3) {
    severity = "high";
  } else if (mediumCount > 0 && severity === "none") {
    severity = "medium";
  }

  // High-severity content requires manual review
  if (severity === "high") {
    return {
      allowed: false,
      severity,
      flaggedKeywords,
      reason: "Content flagged for manual review",
    };
  }

  // Medium-severity content allowed but logged
  return {
    allowed: true,
    severity,
    flaggedKeywords,
  };
}

/**
 * Moderate gig title
 */
export function moderateGigTitle(title: string): ModerationResult {
  return moderateText(title);
}

/**
 * Moderate gig description
 */
export function moderateGigDescription(description: string): ModerationResult {
  return moderateText(description);
}

/**
 * Moderate message content
 */
export function moderateMessage(message: string): ModerationResult {
  return moderateText(message);
}
