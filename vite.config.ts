import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages serves the site from /website/; keep in sync with the router basepath below
  // and in src/router.tsx.
  base: "/website/",
  server: { port: 8080 },
  resolve: { tsconfigPaths: true },
  css: { transformer: "lightningcss" },
  plugins: [
    tailwindcss(),
    tanstackStart({
      router: {
        basepath: "/website",
      },
      prerender: {
        enabled: true,
      },
      // Fail the build if server-only code is imported into the browser bundle.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    // Nitro runs the app at build time to prerender pages. Only the static files in
    // .output/public are deployed (GitHub Pages), so a Node preset is all that's needed.
    nitro({ preset: "node-server" }),
    viteReact(),
  ],
});
