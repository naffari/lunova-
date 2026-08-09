import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Routes, Route } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async";
import type { ComponentType } from "react";
import Root from "./app/Root";
import { routeModules } from "./app/routeModules";
import type { RouteModuleKey } from "./app/routeModules";
import { ROUTE_CONFIG, expandPrerenderPaths } from "./app/routeConfig";
import { CITY_SLUGS } from "./app/constants/cities";
import { GUIDE_SLUGS } from "./app/constants/guides";

/**
 * Prerender entry.
 *
 * Why this exists: the site was a pure client-rendered SPA, so `index.html`
 * shipped an empty `<div id="root">` and every title, description, canonical,
 * Open Graph tag and JSON-LD block was injected by react-helmet-async only
 * after hydration. Social and messaging crawlers do not execute JavaScript —
 * so a shared Lunova link previewed as a blank card, and non-Google crawlers
 * saw a page with no content and no metadata. For a business whose acquisition
 * is local search and shared links, that was the most expensive defect present.
 *
 * Why the route table is rebuilt here instead of reusing routes.ts:
 * `renderToString` cannot render a `React.lazy` component — it suspends and
 * throws. So the modules are awaited up front and mounted eagerly. Both tables
 * are generated from ROUTE_CONFIG, so they cannot drift.
 */

type PageModule = { default: ComponentType };

interface ResolvedRoute {
  path: string;
  Component: ComponentType;
}

let resolved: ResolvedRoute[] | null = null;

async function resolveRoutes(): Promise<ResolvedRoute[]> {
  if (resolved) return resolved;

  resolved = await Promise.all(
    ROUTE_CONFIG.map(async ({ path, module }) => {
      const loaded = (await routeModules[module as RouteModuleKey]()) as PageModule;
      return { path, Component: loaded.default };
    })
  );

  return resolved;
}

export interface RenderResult {
  /** Markup for `<div id="root">`. */
  html: string;
  /** Serialised `<head>` tags produced by react-helmet-async for this route. */
  head: string;
}

export async function render(url: string): Promise<RenderResult> {
  const routes = await resolveRoutes();
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    createElement(
      HelmetProvider,
      { context: helmetContext },
      createElement(
        StaticRouter,
        { location: url },
        createElement(
          Routes,
          null,
          createElement(
            Route,
            { path: "/", element: createElement(Root) },
            routes.map(({ path, Component }) =>
              path === "/"
                ? createElement(Route, { key: path, index: true, element: createElement(Component) })
                : createElement(Route, {
                    key: path,
                    path: path.replace(/^\//, ""),
                    element: createElement(Component),
                  })
            )
          )
        )
      )
    )
  );

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [
        helmet.title?.toString() ?? "",
        helmet.meta?.toString() ?? "",
        helmet.link?.toString() ?? "",
        helmet.script?.toString() ?? "",
      ]
        .filter(Boolean)
        .join("\n    ")
    : "";

  return { html, head };
}

/**
 * Static paths to emit: the flat routes, one URL per service-area city, and
 * one per guide.
 *
 * Both patterned sets resolve through their `:param` route above, which reads
 * the slug from useParams(). StaticRouter matches the concrete URL to the
 * pattern, so each one renders that page's real content rather than a shell.
 */
export async function listPrerenderPaths(): Promise<string[]> {
  return expandPrerenderPaths(CITY_SLUGS, GUIDE_SLUGS);
}
