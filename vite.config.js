import { defineConfig } from "vitest/config";

// eslint-disable-next-line no-restricted-exports
export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.js"],
    },
    files: ["test/**/*.test.js"],
  },
});
