export default {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  moduleFileExtensions: ["js", "json"],
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.json" }]
  },
  clearMocks: true,
};