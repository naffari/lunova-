import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Cleaning from "./pages/Cleaning";
import JunkRemoval from "./pages/JunkRemoval";
import Landscaping from "./pages/Landscaping";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "cleaning", Component: Cleaning },
      { path: "junk-removal", Component: JunkRemoval },
      { path: "landscaping", Component: Landscaping },
    ],
  },
]);
