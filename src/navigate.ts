import { router } from "./router";
import { nextEventLoop, join } from "@frank-mayer/magic";
import { RoutedEvent, RoutingEvent } from "./eventListener";
import { updateRouterContent } from "./updateRouterContent";
import { updateRoutingAnchors } from "./updateRoutingAnchors";
import { updateHtmlLang } from "./updateHtmlLang";

/**
 * Push a new location to the url without reloading the page.
 */
export const navigate = (path: string): string => {
  const newPath =
    path[0] === "/"
      ? path
      : join(router.dataset.route ?? window.location.pathname, path);

  return (router.dataset.route = newPath);
};

export const performNavigation = async (
  newLocation: string,
  pageTitle: string = document.title,
  replaceState: boolean = false
) => {
  if (router.dispatchEvent(new RoutingEvent(newLocation))) {
    if (replaceState) {
      window.history.replaceState({ pageTitle }, pageTitle, newLocation);
    } else {
      window.history.pushState({ pageTitle }, pageTitle, newLocation);
    }

    await updateRouterContent(newLocation);
    await nextEventLoop();
    updateRoutingAnchors();
    updateHtmlLang();
    router.dispatchEvent(new RoutedEvent(newLocation));
  }
};

export const performNavigationPop = async (newLocation: string) => {
  await updateRouterContent(newLocation);
  await nextEventLoop();
  updateRoutingAnchors();
  updateHtmlLang();
  router.dispatchEvent(new RoutedEvent(newLocation));
};
