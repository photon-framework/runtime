import { contentLoader } from "./contentLoader.js";
import "./query.js";
import { controller } from "./controller.js";
import { url } from "./URL.js";
import { isInitialized, setInitialized } from "./initialized.js";

/**
 * Boot the framework.
 */
export const initialize = async () => {
  if (isInitialized()) {
    return;
  }

  await contentLoader.loadRefs(document);
  controller.updateRoutingAnchors();
  await controller.navigateTo(url.pathname);

  window.addEventListener(
    "popstate",
    (ev) => {
      if (ev.state) {
        controller.navigateTo(ev.state.path, undefined, true);
      }
    },
    {
      passive: true,
      capture: false,
    }
  );

  setInitialized();
};
