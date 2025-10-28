module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    "@next/next",
    "@typescript-eslint",
    "deprecation",
    "import",
    "jsx-a11y",
    "react",
    "react-hooks",
  ],
  rules: {
    "deprecation/deprecation": "error",
    "no-restricted-imports": [
      "error",
      {
        name: "next/navigation",
        message:
          "next/navigation is deprecated in App Router. Use next/router instead.",
      },
    ],
  },
  ignorePatterns: ["node_modules", ".next", "**/*.js", "**/*.jsx"],
};
