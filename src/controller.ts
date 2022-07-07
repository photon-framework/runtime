import { isAbsolute, join } from "@frank-mayer/magic/Path";
import { contentLoader } from "./contentLoader.js";
import { hashToString } from "./hash.js";
import { triggerPage } from "./page.js";
import { router } from "./router.js";
import { url } from "./URL.js";
import { UUID } from "./UUID.js";

class Controller {
  public async navigateTo(path: string): Promise<void> {
    url.pathname = path;

    if (path === "" || path === "/") {
      path = router.dataset.default;
    }

    path = isAbsolute(path) ? path : join(url.pathname, path);

    const oldHash = await hashToString(router.innerHTML);
    const newContent = await contentLoader.load(path);
    if (oldHash !== newContent.hash) {
      router.innerHTML = newContent.content;
    }

    for (const fn of newContent.scripts) {
      fn();
    }

    this.routingAnchors();

    triggerPage(url.pathname);
  }

  private readonly routingAnchorsStore = new Set<string>();

  public routingAnchors(): void {
    for (const a of Array.from<HTMLAnchorElement>(
      document.querySelectorAll("a[href]")
    )) {
      {
        const uuid = a.getAttribute("uuid");
        if (uuid && this.routingAnchorsStore.has(uuid)) {
          continue;
        }
      }

      const hrefUrl = new URL(a.href);
      if (hrefUrl.origin === url.origin) {
        const uuid = UUID();
        a.setAttribute("uuid", uuid);
        this.routingAnchorsStore.add(uuid);

        a.addEventListener(
          "click",
          (evt) => {
            evt.preventDefault();
            this.navigateTo(hrefUrl.pathname);
          },
          { passive: false }
        );
      }
    }
  }
}

export const controller = new Controller();
