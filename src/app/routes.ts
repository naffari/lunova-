import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";

const Cleaning = lazy(() => import("./pages/Cleaning"));
const ResidentialCleaning = lazy(() => import("./pages/services/ResidentialCleaning"));
const CommercialCleaning = lazy(() => import("./pages/services/CommercialCleaning"));
const PowerWashing = lazy(() => import("./pages/services/PowerWashing"));
const WindowCleaning = lazy(() => import("./pages/services/WindowCleaning"));
const AutoDetailing = lazy(() => import("./pages/services/AutoDetailing"));
const BinCleaning = lazy(() => import("./pages/services/BinCleaning"));
const JunkRemoval = lazy(() => import("./pages/JunkRemoval"));
const Landscaping = lazy(() => import("./pages/Landscaping"));
const Quote = lazy(() => import("./pages/Quote"));
const Booking = lazy(() => import("./pages/Booking"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "cleaning", Component: Cleaning },
      { path: "services/residential-cleaning", Component: ResidentialCleaning },
      { path: "services/commercial-cleaning", Component: CommercialCleaning },
      { path: "services/power-washing", Component: PowerWashing },
      { path: "services/window-cleaning", Component: WindowCleaning },
      { path: "services/auto-detailing", Component: AutoDetailing },
      { path: "services/bin-cleaning", Component: BinCleaning },
      { path: "junk-removal", Component: JunkRemoval },
      { path: "landscaping", Component: Landscaping },
      { path: "quote", Component: Quote },
      { path: "book", Component: Booking },
      { path: "*", Component: NotFound },
    ],
  },
]);
