import { htmlError } from "./htmlError";
import { path as P } from "@frank-mayer/magic";

const photonRefCache = new Map<string, string>();
const placeholder = new RegExp("\\{\\{([^\\{\\}]+)\\}\\}", "g");

export const insertPlaceholders = async (root: Element) => {
  for await (const el of Array.from(
    root.querySelectorAll("photon-ref[src]") as NodeListOf<HTMLElement>
  )) {
    try {
      const srcs = [
        P.resolve("/", el.getAttribute("src")!),
        P.resolve(el.getAttribute("src")!),
      ];

      let html: string;

      for (const src of srcs) {
        if (photonRefCache.has(src)) {
          html = photonRefCache.get(src)!;
        } else {
          const resp = await fetch(src);
          if (resp.ok) {
            html = await resp.text();
            photonRefCache.set(src, html);
            break;
          } else if (resp.status === 404) {
            continue;
          } else {
            html = htmlError(`${resp.status} ${resp.statusText}`, resp.url);
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
      el.innerHTML = htmlError(JSON.stringify(err));
    }
  }
};
