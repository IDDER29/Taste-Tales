const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // axios v1 ships ESM that Jest can't parse; use its CJS build in tests.
    // Use a rootDir file path — axios's package `exports` blocks deep subpath specifiers.
    "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs",
  },
};

module.exports = createJestConfig(customJestConfig);
