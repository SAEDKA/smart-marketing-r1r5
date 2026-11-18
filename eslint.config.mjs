import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Compiler-era rules that eslint-config-next 16 turns on.
      // The product's established patterns \u2014 fetch-on-mount data
      // loading in pages/providers (set-state-in-effect) and the
      // typewriter's render-time segment math (refs / immutability /
      // purity) \u2014 predate these rules and are covered by the test
      // suite. They stay visible as warnings until a dedicated
      // compiler-readiness pass restructures them; everything else
      // remains an error.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
