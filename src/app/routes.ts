import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import { routeModules } from "./routeModules";
import type { RouteModuleKey } from "./routeModules";
import { ROUTE_CONFIG } from "./routeConfig";

/**
 * Client router. Every page is code-split; the route table itself comes from
 * ROUTE_CONFIG so it stays in step with the prerender entry.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: ROUTE_CONFIG.map(({ path, module }) => {
      const Component = lazy(routeModules[module as RouteModuleKey]);
      // react-router wants the index route flagged rather than pathed "/".
      if (path === "/") return { index: true as const, Component };
      return { path: path.replace(/^\//, ""), Component };
    }),
  },
]);
