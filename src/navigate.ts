import { router } from "./router";
import { join } from "path";
import { RoutedEvent, RoutingEvent } from "./eventListener";
import { updateRouterContent } from "./updateRouterContent";

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
      : join(router.dataset.route ?? window.location.pathname, path);
  window.history.pushState({ pageTitle }, pageTitle, newPath);
  return (router.dataset.route = newPath);
};

export const performNavigation = (newLocation: string) => {
  if (router.dispatchEvent(new RoutingEvent(newLocation))) {
    updateRouterContent(newLocation).then(() => {
      router.dispatchEvent(new RoutedEvent(newLocation));
    });
  }
};
