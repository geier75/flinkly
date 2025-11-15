/**
 * Image Moderation via AWS Rekognition
 * 
 * Detects inappropriate content in uploaded images:
 * - Explicit nudity
 * - Suggestive content
 * - Violence
 * - Hate symbols
 * - Drugs/Alcohol
 * 
 * Uses AWS Rekognition DetectModerationLabels API
 */

import { ENV } from "../_core/env";

export interface ImageModerationResult {
  allowed: boolean;
  confidence: number;
  labels: ModerationLabel[];
  reason?: string;
}

export interface ModerationLabel {
  name: string;
  confidence: number;
  parentName?: string;
}

/**
 * Moderate image via AWS Rekognition
 * 
 * Note: AWS Rekognition requires AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
 * For production, configure these via environment variables.
 * For development, use placeholder implementation.
 */
export async function moderateImage(imageUrl: string): Promise<ImageModerationResult> {
  // Check if AWS credentials are configured
  const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsRegion = process.env.AWS_REGION || "eu-central-1";

  if (!awsAccessKey || !awsSecretKey) {
    console.warn("[Image Moderation] AWS credentials not configured. Skipping moderation.");
    return {
      allowed: true,
      confidence: 0,
      labels: [],
      reason: "AWS Rekognition not configured",
    };
  }

  try {
    // Dynamically import AWS SDK (only in production)
    const { RekognitionClient, DetectModerationLabelsCommand } = await import("@aws-sdk/client-rekognition");

    const client = new RekognitionClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    });

    // Fetch image from URL
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageBuffer);

    // Call AWS Rekognition
    const command = new DetectModerationLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MinConfidence: 60, // Minimum confidence threshold (60%)
    });

    const response = await client.send(command);
    const labels: ModerationLabel[] = (response.ModerationLabels || []).map((label: any) => ({
      name: label.Name || "",
      confidence: label.Confidence || 0,
      parentName: label.ParentName,
    }));

    // Check for critical labels
    const criticalLabels = [
      "Explicit Nudity",
      "Nudity",
      "Graphic Male Nudity",
      "Graphic Female Nudity",
      "Sexual Activity",
      "Violence",
      "Visually Disturbing",
      "Hate Symbols",
      "Drugs",
    ];

    const hasCriticalContent = labels.some(
      (label) =>
        criticalLabels.includes(label.name) && label.confidence > 80
    );

    if (hasCriticalContent) {
      return {
        allowed: false,
        confidence: Math.max(...labels.map((l) => l.confidence)),
        labels,
        reason: "Image contains inappropriate content",
      };
    }

    // Check for suggestive content (lower threshold)
    const suggestiveLabels = ["Suggestive", "Revealing Clothes"];
    const hasSuggestiveContent = labels.some(
      (label) =>
        suggestiveLabels.includes(label.name) && label.confidence > 90
    );

    if (hasSuggestiveContent) {
      return {
        allowed: false,
        confidence: Math.max(...labels.map((l) => l.confidence)),
        labels,
        reason: "Image contains suggestive content",
      };
    }

    // Image passed moderation
    return {
      allowed: true,
      confidence: labels.length > 0 ? Math.max(...labels.map((l) => l.confidence)) : 0,
      labels,
    };
  } catch (error) {
    console.error("[Image Moderation] Error:", error);
    
    // On error, allow image but log for manual review
    return {
      allowed: true,
      confidence: 0,
      labels: [],
      reason: "Moderation service unavailable",
    };
  }
}

/**
 * Batch moderate multiple images
 */
export async function moderateImages(imageUrls: string[]): Promise<ImageModerationResult[]> {
  const results = await Promise.all(imageUrls.map((url) => moderateImage(url)));
  return results;
}
