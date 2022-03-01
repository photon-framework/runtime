import { htmlError } from "./htmlError";
import { insertPlaceholders } from "./insertPlaceholders";
import { join } from "path-browserify";
import { router } from "./router";
import { Client } from "@frank-mayer/magic";

const htmlLocationFromPath = (path: string) => {
  const url = join(router.dataset.content, path + ".html");
  if (url[0] === "/") {
    return url;
  } else {
    return "/" + url;
  }
};

const routerCache = new Map<string, string>();

export const updateRouterContent = async (path: string) => {
  try {
    const htmlLocation = htmlLocationFromPath(path);
    if (routerCache.has(htmlLocation)) {
      console.debug("Using cached content for", htmlLocation);
      router.innerHTML = routerCache.get(htmlLocation)!;
    } else {
      console.debug("Fetching content for", htmlLocation);
      const resp = await fetch(htmlLocation);
      if (resp.ok) {
        const html = await resp.text();
        routerCache.set(htmlLocation, html);
        router.innerHTML = html;
        insertPlaceholders(router);
      } else {
        router.innerHTML = htmlError(
          `${resp.status} ${resp.statusText}`,
          resp.url
        );
      }
    }
  } catch (err) {
    router.innerHTML = htmlError(JSON.stringify(err));
  }
};

if (!Client.saveData) {
  (async () => {
    for (const a of Array.from(document.querySelectorAll("a[data-route]"))) {
      console.debug("Preloading", (a as HTMLElement).dataset.route);
      const htmlLocation = htmlLocationFromPath(
        (a as HTMLElement).dataset.route!
      );
      const resp = await fetch(htmlLocation);
      if (resp.ok) {
        const html = await resp.text();
        routerCache.set(htmlLocation, html);
      }
    }
  })();
}
