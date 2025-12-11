// @ts-nocheck
import { Request, Response } from "express";
import { getDb } from "../adapters";

/**
 * Liveness probe - checks if server is running
 * Returns 200 if server is alive
 */
export async function livenessCheck(req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

/**
 * Readiness probe - checks if server is ready to accept traffic
 * Checks database connection
 * Returns 200 if ready, 503 if not ready
 */
export async function readinessCheck(req: Request, res: Response) {
  try {
    // Check database connection
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Simple query to verify DB connection
    await db.execute("SELECT 1");

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
      checks: {
        database: "ok",
      },
    });
  } catch (error) {
    console.error("[Health] Readiness check failed:", error);
    res.status(503).json({
      status: "not_ready",
      timestamp: new Date().toISOString(),
      checks: {
        database: "error",
      },
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
