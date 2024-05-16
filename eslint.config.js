import pluginJs from "@eslint/js";
import globals from "globals";

// eslint-disable-next-line no-restricted-exports
export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      "no-restricted-exports": [
        "error",
        { restrictDefaultExports: { direct: true } },
      ],
      "sort-vars": "error",
    },
  },
  pluginJs.configs.recommended,
];
