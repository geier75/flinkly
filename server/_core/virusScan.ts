/**
 * Virus-Scan-Utility mit ClamAV
 * 
 * Scannt File-Uploads auf Malware/Viren vor dem Speichern in S3.
 * 
 * Usage:
 * ```ts
 * const buffer = Buffer.from(fileData, "base64");
 * const result = await scanFileForVirus(buffer, "uploaded-file.pdf");
 * 
 * if (!result.isClean) {
 *   throw new Error(`Virus detected: ${result.viruses.join(", ")}`);
 * }
 * ```
 */

import NodeClam from "clamscan";
import { Readable } from "stream";

let clamScanInstance: NodeClam | null = null;

/**
 * Initialize ClamAV scanner (lazy initialization)
 */
async function getClamScanner(): Promise<NodeClam> {
  if (clamScanInstance) {
    return clamScanInstance;
  }

  try {
    const instance = await new NodeClam().init({
      removeInfected: false, // Don't auto-delete, let us handle it
      quarantineInfected: false, // Don't quarantine, we'll reject upload
      debugMode: false,
      clamdscan: {
        socket: "/var/run/clamav/clamd.ctl", // Ubuntu default socket
        host: "127.0.0.1",
        port: 3310,
        timeout: 60000, // 60 seconds
        localFallback: true, // Fallback to local scan if daemon unavailable
      },
      preference: "clamdscan", // Prefer daemon for performance
    });

    clamScanInstance = instance;
    console.log("[VirusScan] ClamAV initialized successfully");
    return instance;
  } catch (error) {
    console.error("[VirusScan] Failed to initialize ClamAV:", error);
    throw new Error("Virus scanner initialization failed");
  }
}

export interface VirusScanResult {
  isClean: boolean;
  viruses: string[];
  scanTime: number; // milliseconds
}

/**
 * Scan file buffer for viruses
 * 
 * @param fileBuffer - File content as Buffer
 * @param fileName - Original filename (for logging)
 * @returns VirusScanResult
 */
export async function scanFileForVirus(
  fileBuffer: Buffer,
  fileName: string
): Promise<VirusScanResult> {
  const startTime = Date.now();

  try {
    const scanner = await getClamScanner();

    // Convert Buffer to Readable Stream (ClamAV requires stream)
    const stream = Readable.from(fileBuffer);

    // Scan stream
    const { isInfected, viruses } = await scanner.scanStream(stream);

    const scanTime = Date.now() - startTime;

    if (isInfected) {
      console.warn(
        `[VirusScan] Virus detected in "${fileName}": ${viruses.join(", ")} (${scanTime}ms)`
      );
      return {
        isClean: false,
        viruses: viruses || ["Unknown virus"],
        scanTime,
      };
    }

    console.log(`[VirusScan] File "${fileName}" is clean (${scanTime}ms)`);
    return {
      isClean: true,
      viruses: [],
      scanTime,
    };
  } catch (error) {
    console.error(`[VirusScan] Scan failed for "${fileName}":`, error);
    
    // FAIL-SAFE: If scanner fails, REJECT upload (security-first approach)
    // Alternative: Allow upload if scanner is down (availability-first)
    throw new Error("Virus scan failed - upload rejected for security");
  }
}

/**
 * Check if ClamAV is available and healthy
 */
export async function checkVirusScannerHealth(): Promise<boolean> {
  try {
    const scanner = await getClamScanner();
    const version = await scanner.getVersion();
    console.log(`[VirusScan] ClamAV version: ${version}`);
    return true;
  } catch (error) {
    console.error("[VirusScan] Health check failed:", error);
    return false;
  }
}
