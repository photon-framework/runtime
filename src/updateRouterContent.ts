import { htmlError } from "./htmlError";
import { insertPlaceholders } from "./insertPlaceholders";
import { router } from "./router";
import { client, path as P } from "@frank-mayer/magic";

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
      } else if (resp.status === 404) {
        const p404 = router.dataset.fallback ?? router.dataset.default;
        const resp2 = await fetch(p404);
        if (resp2.ok) {
          const html = await resp2.text();
          router.innerHTML = html;
        } else {
          router.innerHTML = htmlError(
            `${resp.status} ${resp.statusText}`,
            resp.url
          );
        }
      } else {
        router.innerHTML = htmlError(
          `${resp.status} ${resp.statusText}`,
          resp.url
        );
      }
    }
    await insertPlaceholders(router);
  } catch (err) {
    router.innerHTML = htmlError(JSON.stringify(err));
  }
};

if (!client.saveData) {
  (async () => {
    for (const a of Array.from(document.querySelectorAll("a[data-route]"))) {
      const route = P.resolve((a as HTMLElement).dataset.route!);
      const htmlLocation = htmlLocationFromPath(route);
      if (routerCache.has(htmlLocation)) {
        continue;
      }
      const resp = await fetch(htmlLocation);
      if (resp.ok) {
        routerCache.set(htmlLocation, await resp.text());
      }
    }
  })();
}
