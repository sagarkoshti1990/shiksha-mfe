const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const baseConfig = require("../../eslint.config.js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...baseConfig,
  ...compat
    .config({
      extends: ["plugin:@nx/react-typescript", "next", "next/core-web-vitals"],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
      rules: {
        ...config.rules,
        "@next/next/no-html-link-for-pages": [
          "error",
          "mfes/zoho-ticketing-system/src/pages",
        ],
        "@nx/enforce-module-boundaries": [
          "error",
          {
            allow: [],
            depConstraints: [
              {
                sourceTag: "*",
                onlyDependOnLibsWithTags: ["*"],
              },
            ],
            enforceBuildableLibDependency: true,
            allowCircularSelfDependency: true,
          },
        ],
      },
    })),
];
