import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import path from "path";

export default {
  input: "src/index.ts",
  output: {
    file: path.resolve(__dirname, "dist/bundle.js"),
    sourcemap: true,
    format: "iife",
  },
  plugins: [
    ,
    nodeResolve({
      extensions: [".ts", ".js"],
    }),
    typescript({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
    serve({
      openPage: path.resolve(__dirname, "public/index.html"),
      contentBase: "",
      port: 3000,
    }),
  ],
};
