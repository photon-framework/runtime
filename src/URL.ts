import { searchParamsRecord } from "./query.js";
import { normalize } from "@frank-mayer/magic/Path";
import { router } from "./router.js";
import { logger } from "./logger.js";

class MyUrl implements URL {
  private readonly _url: URL;

  get hash(): string {
    return this._url.hash.startsWith("#")
      ? this._url.hash
      : "#" + this._url.hash;
  }
  set hash(value: string) {
    this._url.hash = value;
    window.location.hash = value;
  }

  get host(): string {
    return this._url.host;
  }

  get hostname(): string {
    return this._url.hostname;
  }

  get href(): string {
    return this._url.href;
  }

  get origin(): string {
    return this._url.origin;
  }

  get password(): string {
    return this._url.password;
  }

  get pathname(): string {
    const path = normalize(this._url.pathname);
    return path === router.dataset.default && router.dataset.homeAsEmpty
      ? "/"
      : path;
  }
  set pathname(value: string) {
    value = normalize(value ?? "/");

    if (value === router.dataset.default && router.dataset.homeAsEmpty) {
      value = "";
    } else if (value === "/" || value === "." || value.trim() === "") {
      value = router.dataset.homeAsEmpty ? "/" : router.dataset.default;
    }

    if (this._url.pathname !== value) {
      this._url.pathname = value;

      if (window.history && window.history.pushState) {
        window.history.pushState(
          { path: value },
          value,
          this.hash !== "#"
            ? value + this._url.search + this._url.search + this.hash
            : value
        );
      } else {
        window.location.pathname = value;
      }
    }
  }

  get port(): string {
    return this._url.port;
  }

  get protocol(): string {
    return this._url.protocol;
  }

  get search(): string {
    return this._url.search;
  }

  get searchParams(): URLSearchParams {
    return new URLSearchParams(searchParamsRecord());
  }

  get username(): string {
    return this._url.username;
  }

  public constructor(url: string | URL) {
    logger.debug(`Initializing URL "${url}"`);
    this._url = new URL(url);
  }

  toJSON(): string {
    return this._url.toJSON();
  }

  toString(): string {
    return this._url.toString();
  }
}

/** @internal */
export const url: URL = new MyUrl(document.location.href);
