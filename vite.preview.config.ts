import { defineConfig } from "vite";

// Used by `npm run preview` to serve the built static site from .output/public.
export default defineConfig({
  base: "/website/",
  build: { outDir: ".output/public" },
});
