import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {
        languageOptions: {globals: globals.node},
        rules: {"no-unused-vars": "error"},
    },
    pluginJs.configs.recommended,
];
