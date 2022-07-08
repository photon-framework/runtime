import { isAbsolute, join } from "@frank-mayer/magic/Path";
import { nextEventLoop } from "@frank-mayer/magic/Timing";
import { render } from "mustache";
import { contentLoader } from "./contentLoader.js";
import { hashToString } from "./hash.js";
import { triggerPage } from "./page.js";
import { router } from "./router.js";
import { url } from "./URL.js";
import { UUID } from "./UUID.js";
import { view } from "./view.js";

class Controller {
  public set routerState(value: string) {
    if (value) {
      router.setAttribute("router-state", value);
      document.documentElement.setAttribute("router-state", value);
    } else {
      router.removeAttribute("router-state");
      document.documentElement.removeAttribute("router-state");
    }
  }

  public async navigateTo(path: string): Promise<void> {
    this.routerState = "routing";

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

    this.routerState = "idle";
    await nextEventLoop();
    window.scrollTo(0, 0);
  }

  private readonly routingAnchorsStore = new Map<string, string>();

  public routingAnchors(): void {
    for (const a of Array.from<HTMLAnchorElement>(
      document.querySelectorAll("a[href]")
    )) {
      const hrefUrl = new URL(a.href);

      {
        const uuid = a.getAttribute("uuid");
        if (uuid && this.routingAnchorsStore.has(uuid)) {
          const nval = render(
            this.routingAnchorsStore.get(uuid)!,
            view
          ).replace(
            /&(?:(?:#)|(?:%23))x([0-9A-Z]+);/gi,
            (_: string, hex: string) => {
              return String.fromCharCode(parseInt(hex, 16));
            }
          );

          hrefUrl.pathname = nval;
          a.href = hrefUrl.href;
          continue;
        }
      }

      if (hrefUrl.origin === url.origin) {
        const uuid = UUID();
        a.setAttribute("uuid", uuid);
        this.routingAnchorsStore.set(uuid, a.getAttribute("href")!);

        a.addEventListener(
          "click",
          (evt) => {
            evt.preventDefault();
            const hrefUrl = new URL(a.href);
            this.navigateTo(hrefUrl.pathname);
          },
          { passive: false }
        );
      }
    }
  }
}

export const controller = new Controller();
controller.routerState = "idle";
