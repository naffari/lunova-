import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import { routeModules } from "./routeModules";

const Cleaning = lazy(routeModules.cleaning);
const ResidentialCleaning = lazy(routeModules.residentialCleaning);
const CommercialCleaning = lazy(routeModules.commercialCleaning);
const PowerWashing = lazy(routeModules.powerWashing);
const WindowCleaning = lazy(routeModules.windowCleaning);
const AutoDetailing = lazy(routeModules.autoDetailing);
const BinCleaning = lazy(routeModules.binCleaning);
const JunkRemoval = lazy(routeModules.junkRemoval);
const Landscaping = lazy(routeModules.landscaping);
const Blog = lazy(routeModules.blog);
const BlogPost = lazy(routeModules.blogPost);
const Quote = lazy(routeModules.quote);
const QuoteSuccess = lazy(routeModules.quoteSuccess);
const Booking = lazy(routeModules.booking);
const BookingSuccess = lazy(routeModules.bookingSuccess);
const Privacy = lazy(routeModules.privacy);
const NotFound = lazy(routeModules.notFound);

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
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      { path: "quote", Component: Quote },
      { path: "quote/success", Component: QuoteSuccess },
      { path: "book", Component: Booking },
      { path: "book/success", Component: BookingSuccess },
      { path: "privacy", Component: Privacy },
      { path: "*", Component: NotFound },
    ],
  },
]);
