import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Cleaning from "./pages/Cleaning";
import ResidentialCleaning from "./pages/services/ResidentialCleaning";
import CommercialCleaning from "./pages/services/CommercialCleaning";
import PowerWashing from "./pages/services/PowerWashing";
import WindowCleaning from "./pages/services/WindowCleaning";
import AutoDetailing from "./pages/services/AutoDetailing";
import BinCleaning from "./pages/services/BinCleaning";
import JunkRemoval from "./pages/JunkRemoval";
import Landscaping from "./pages/Landscaping";
import Quote from "./pages/Quote";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";

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
