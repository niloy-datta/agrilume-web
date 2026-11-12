import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // react-three-fiber code mutates three.js objects (uniforms, fog, controls) inside useFrame on purpose; the
  // React-Compiler immutability/refs rules do not apply to that imperative render loop.
  {
    files: ["components/timetravel/scene/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // vendored third-party binaries/scripts (MediaPipe Hands) are not our code
    "public/**",
  ]),
]);

export default eslintConfig;
