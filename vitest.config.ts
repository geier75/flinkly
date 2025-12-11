import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "path";
import dotenv from "dotenv";

// Load .env file directly
dotenv.config();

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
    },
  },
  test: {
    include: [
      "server/**/*.test.ts", 
      "server/**/*.spec.ts",
      "client/**/*.test.tsx",
      "client/**/*.test.ts"
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
    ],
    environment: "node",
    environmentMatchGlobs: [
      ["client/**", "jsdom"],
    ],
    globals: true,
    setupFiles: ["./client/src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/**",
        "dist/**",
        "e2e/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/test/**",
        "**/__tests__/**",
        "**/types/**",
      ],
      // Thresholds can be increased as more tests are added
      // Current baseline: ~5% statements, ~40% branches, ~14% functions
      thresholds: {
        statements: 4,
        branches: 35,
        functions: 10,
        lines: 4,
      },
    },
  },
});
