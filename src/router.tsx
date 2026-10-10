import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    // Must match `base` and the router basepath in vite.config.ts.
    basepath: "/website",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
