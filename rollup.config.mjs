import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts", // Your entry point,
  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/bundle.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve({
      extensions: [".ts", ".js"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: ["src/tests/**"],
    }),
  ],
};
