import { htmlError } from "./htmlError";
import { path as P } from "@frank-mayer/magic";

const photonRefCache = new Map<string, string>();
const placeholder = new RegExp("\\{\\{([^\\{\\}]+)\\}\\}", "g");

export const insertPlaceholders = async (root: Element) => {
  for await (const el of Array.from(
    root.querySelectorAll("photon-ref[src]") as NodeListOf<HTMLElement>
  )) {
    try {
      const src = P.resolve(el.getAttribute("src")!);

      const dataset = new Map<string, string>();
      for (const key in el.dataset) {
        dataset.set(key, el.dataset[key]!);
      }

      let html: string;
      if (photonRefCache.has(src)) {
        html = photonRefCache.get(src)!;
      } else {
        const resp = await fetch(src);
        if (resp.ok) {
          html = await resp.text();
          photonRefCache.set(src, html);
        } else {
          html = htmlError(`${resp.status} ${resp.statusText}`, resp.url);
        }
      }

      el.outerHTML = html.replace(placeholder, (match) => {
        const key = match.substring(2, match.length - 2);

        if (dataset.has(key)) {
          return dataset.get(key)!;
        }

        return "";
      });
    } catch (err) {
      el.innerHTML = htmlError(JSON.stringify(err));
    }
  }
};
