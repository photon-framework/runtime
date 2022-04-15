import { htmlError } from "./htmlError";
import { resolve } from "@frank-mayer/magic";

const photonRefCache = new Map<string, string>();
const placeholder = new RegExp("\\{\\{([^\\{\\}]+)\\}\\}", "g");

export const insertPlaceholders = async (root: Element) => {
  for (const el of Array.from(
    root.querySelectorAll("photon-ref[src]") as NodeListOf<HTMLElement>
  )) {
    try {
      const srcs = [
        resolve("/", el.getAttribute("src")!),
        resolve(el.getAttribute("src")!),
      ];

      let html: string | undefined = undefined;

      for (const src of srcs) {
        if (photonRefCache.has(src)) {
          html = photonRefCache.get(src)!;
          break;
        }
      }

      if (!html) {
        for (const src of srcs) {
          const resp = await fetch(src);
          if (resp.ok) {
            html = await resp.text();
            photonRefCache.set(src, html);
            break;
          } else if (resp.status === 404) {
            html ??= htmlError(`${resp.status} ${resp.statusText}`, resp.url);
            continue;
          } else {
            html ??= htmlError(`${resp.status} ${resp.statusText}`, resp.url);
          }
        }
      }

      html ??= htmlError("404 Not Found", el.getAttribute("src")!);

      el.outerHTML = html.replace(placeholder, (match) => {
        const key = match.substring(2, match.length - 2);

        if (key in el.dataset) {
          return el.dataset[key]!;
        }

        return "";
      });
    } catch (err) {
      el.innerHTML = htmlError(
        "Exception thrown " + JSON.stringify(err, undefined, 2)
      );
    }
  }
};
