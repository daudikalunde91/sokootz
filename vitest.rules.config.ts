import { defineConfig } from "vitest/config";
import path from "node:path";

/** Firestore security-rule tests; require the Firestore emulator (see TESTING.md). */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
