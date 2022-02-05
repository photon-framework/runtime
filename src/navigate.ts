import { router } from "./router";
import { join } from "path";

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
