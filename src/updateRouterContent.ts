import { htmlError } from "./htmlError";
import { insertPlaceholders } from "./insertPlaceholders";
import { router } from "./router";
import { Client, path as P } from "@frank-mayer/magic";

const htmlLocationFromPath = (path: string) => {
  const url = P.join(router.dataset.content, path + ".html");
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
      router.innerHTML = routerCache.get(htmlLocation)!;
    } else {
      const resp = await fetch(htmlLocation);
      if (resp.ok) {
        const html = await resp.text();
        routerCache.set(htmlLocation, html);
        router.innerHTML = html;
      } else {
        router.innerHTML = htmlError(
          `${resp.status} ${resp.statusText}`,
          resp.url
        );
      }
    }
    insertPlaceholders(router);
  } catch (err) {
    router.innerHTML = htmlError(JSON.stringify(err));
  }
};

if (!Client.saveData) {
  (async () => {
    for (const a of Array.from(document.querySelectorAll("a[data-route]"))) {
      const route = P.resolve((a as HTMLElement).dataset.route!);
      const htmlLocation = htmlLocationFromPath(route);
      const resp = await fetch(htmlLocation);
      if (resp.ok) {
        const html = await resp.text();
        routerCache.set(htmlLocation, html);
      }
    }
  })();
}
