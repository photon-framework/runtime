import { router } from "./router";
import { path as P } from "@frank-mayer/magic";
import { RoutedEvent, RoutingEvent } from "./eventListener";
import { updateRouterContent } from "./updateRouterContent";
import { updateRoutingAnchors } from "./updateRoutingAnchors";

/**
 * Push a new location to the url without reloading the page.
 */
export const navigate = (
  path: string,
  pageTitle: string = document.title
): string => {
  const newPath =
    path[0] === "/"
      ? path
      : P.join(router.dataset.route ?? window.location.pathname, path);
  window.history.pushState({ pageTitle }, pageTitle, newPath);
  return (router.dataset.route = newPath);
};

export const performNavigation = (newLocation: string) => {
  if (router.dispatchEvent(new RoutingEvent(newLocation))) {
    updateRouterContent(newLocation).then(() => {
      updateRoutingAnchors(router);
      router.dispatchEvent(new RoutedEvent(newLocation));
    });
  }
};
