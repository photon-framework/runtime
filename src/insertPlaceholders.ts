import { htmlError } from "./htmlError";

const photonRefCache = new Map<string, string>();

export const insertPlaceholders = async (root: Element) => {
  for await (const el of Array.from(
    root.querySelectorAll("photon-ref[src]") as NodeListOf<HTMLElement>
  )) {
    try {
      const src = el.getAttribute("src")!;

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

      el.outerHTML = html;
    } catch (err) {
      el.innerHTML = htmlError(JSON.stringify(err));
    }
  }
};
