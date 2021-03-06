import { client, disposeNode, join } from "@frank-mayer/magic";
import { AsyncFunction } from "./AsyncFunction";
import { emptyStringHash, hashToString } from "./hash";
import { logger } from "./logger";
import { router } from "./router";

type Resp = { text: string; ok: boolean; status: number };

type ContentLoaderEntry = {
  content: string;
  ok: boolean;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  scripts: Set<Function>;
};

type ContentLoaderValue = {
  content: string;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  scripts: Set<Function>;
};

class ContentLoader {
  private readonly cache = new Map<string, ContentLoaderEntry>();
  private readonly openRequests = new Map<string, Promise<Resp>>();

  constructor() {
    try {
      if (router.dataset.preload && !client.saveData) {
        const preload = JSON.parse(router.dataset.preload);
        if (Array.isArray(preload)) {
          setTimeout(async() => {
            try {
              for await (const path of preload) {
                logger.debug(`Preloading "${path}"`);
                void this.load(path);
              }
            } catch (e) {
              logger.error(e);
            }
          }, 750);
        }
      }
    } catch (e) {
      logger.error("Error during preload", e);
    }
  }

  private async loadRef(el: HTMLElement): Promise<void> {
    const src = el.getAttribute("src")!;
    const data = new Map<string, string>();
    for (const k in el.dataset) {
      data.set(k, el.dataset[k]!);
    }

    const resp = await this.fetch(src);
    if (resp.ok) {
      el.outerHTML = resp.text.replace(
        /[{]{2}[a-zA-Z_$]+[\w$]*[}]{2}/g,
        (placeholder) => {
          const varname = placeholder.substring(2, placeholder.length - 2);
          return data.has(varname) ? data.get(varname)! : "";
        }
      );
    }
  }

  public async load(path: string): Promise<ContentLoaderValue> {
    let _path = path;

    while (_path.length > 1 && _path.endsWith("/")) {
      _path = _path.substring(0, _path.length - 1);
    }
    if (_path === "/") {
      _path = router.dataset.default;
      while (_path.length > 1 && _path.endsWith("/")) {
        _path = _path.substring(0, _path.length - 1);
      }
    }

    if (this.cache.has(_path)) {
      const cacheEntry = this.cache.get(_path)!;
      if (cacheEntry.ok) {
        logger.debug(`Cache hit for "${_path}"`);
        return cacheEntry;
      } else {
        return this.error();
      }
    }

    try {
      const response = await this.fetch(
        join(router.dataset.content, _path + ".html")
      );

      if (response.status < 400) {
        const respTxt = response.text;
        const shadowEl = document.createElement("div");
        shadowEl.innerHTML = respTxt;
        await this.loadRefs(shadowEl);
        // eslint-disable-next-line @typescript-eslint/ban-types
        const scripts = new Set<Function>();
        for (const el of Array.from(shadowEl.getElementsByTagName("script"))) {
          if (el.textContent) {
            scripts.add(AsyncFunction(el.textContent));
          }
          el.remove();
        }
        const content = shadowEl.innerHTML;
        disposeNode(shadowEl);
        const hash = await hashToString(content);
        const entry = {
          ok: true,
          content,
          hash,
          scripts,
        };
        logger.debug(`Storing "${_path}" in cache`);
        this.cache.set(_path, entry);
        return entry;
      } else {
        logger.debug(`Storing error for "${_path}" in cache`);
        this.cache.set(_path, {
          ok: false,
          content: "",
          hash: await emptyStringHash,
          scripts: new Set(),
        });
        return this.error();
      }
    } catch (e) {
      return this.error();
    }
  }
  public async loadRefs(target: ParentNode) {
    for (const el of Array.from<HTMLElement>(
      target.querySelectorAll("photon-ref[src]")
    )) {
      await this.loadRef(el);
    }
  }

  public error(): Promise<ContentLoaderValue> {
    return this.load(router.dataset.fallback);
  }

  private fetch(path: string): Promise<Resp> {
    if (this.openRequests.has(path)) {
      return this.openRequests.get(path)!;
    } else {
      const resp = new Promise<Resp>((res, rej) => {
        fetch(path, {
          method: "GET",
          redirect: "follow",
          cache: "no-cache",
        })
          .then((response) => {
            response
              .text()
              .then((text) => {
                res({ text, ok: response.ok, status: response.status });
              })
              .catch(rej);
          })
          .catch(rej);
      });

      this.openRequests.set(path, resp);
      return resp;
    }
  }
}

/** @internal */
export const contentLoader = new ContentLoader();
