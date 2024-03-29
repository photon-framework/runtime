// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./DocumentTransition.d.ts" />

import { isAbsolute, join } from "@frank-mayer/magic/Path";
import { nextEventLoop } from "@frank-mayer/magic/Timing";
import { render } from "mustache";
import { contentLoader } from "./contentLoader";
import { hashToString } from "./hash";
import { logger } from "./logger";
import { triggerPage } from "./page";
import { getLanguages, router } from "./router";
import { url } from "./URL";
import { UUID } from "./UUID";
import { view } from "./view";

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

  public async navigateTo(
    path: string,
    a?: HTMLAnchorElement,
    fromNavigationStack = false
  ): Promise<void> {
    this.routerState = "routing";

    url.pathname = [path, !fromNavigationStack];
    let _path = url.pathname;

    logger.debug(`navigating to "${_path}"`);

    const languages = getLanguages()

    // change language
    if (a && a.hreflang) {
      if (!languages || languages.has(a.hreflang)) {
        logger.debug(`setting language to "${a.hreflang}"`);
        document.documentElement.setAttribute("lang", a.hreflang);
      }
    } else if (a && a.lang) {
      if (!languages || languages.has(a.lang)) {
        logger.debug(`setting language to "${a.lang}"`);
        document.documentElement.setAttribute("lang", a.lang);
      }
    } else if (router.dataset.langSegment) {
      const langSegment = Number.parseInt(router.dataset.langSegment, 10);
      if (!isNaN(langSegment) && langSegment > -1) {
        const lang = _path.split("/").filter(Boolean)[langSegment];
        if (lang && (!languages || languages.has(lang))) {
          logger.debug(`setting language to "${lang}"`);
          document.documentElement.setAttribute("lang", lang);
        }
      }
    }

    if (!_path || _path === "/") {
      _path = router.dataset.default;
    }

    _path = isAbsolute(_path) ? _path : join(url.pathname, _path);

    const oldHash = await hashToString(router.innerHTML);
    const newContent = await contentLoader.load(_path);
    if (oldHash !== newContent.hash) {
      logger.debug("Content changed, rendering page");
      if (document.createDocumentTransition) {
        logger.debug("Document Transition supported, starting");
        const transition = document.createDocumentTransition();
        transition.start(()=>{router.innerHTML = newContent.content});
      }
      else {
        logger.debug("Document Transition not supported");
        router.innerHTML = newContent.content
      }
    } else {
      logger.debug("Content unchanged, skipping rendering");
    }

    for (const fn of newContent.scripts) {
      fn();
    }

    this.updateRoutingAnchors();
    triggerPage(url.pathname);
    this.updateTitle();

    this.routerState = "idle";
    if (!fromNavigationStack) {
      await nextEventLoop();
      window.scrollTo(0, 0);
    }
  }

  private readonly routingAnchorsStore = new Map<string, string>();

  public updateRoutingAnchors(): void {
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
          async(evt) => {
            evt.preventDefault();
            const localHrefUrl = new URL(a.href);
            await this.navigateTo(localHrefUrl.pathname, a);
          },
          { passive: false }
        );
      }
    }
  }

  private updateTitle(): void {
    const newTitle = render(document.title, view);
    if (newTitle !== document.title) {
      document.title = newTitle;
    }
  }
}

/** @internal */
export const controller = new Controller();
controller.routerState = "idle";
