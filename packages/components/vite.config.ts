import path from "node:path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "src/index.ts"),
      name: "SetupmoneyComponents",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "solid-js/store"],
      output: {
        globals: {
          "solid-js": "SolidJS",
        },
      },
    },
  },
});
