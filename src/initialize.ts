import { contentLoader } from "./contentLoader";
import "./query";
import { controller } from "./controller";
import { url } from "./URL";
import { isInitialized, setInitialized } from "./initialized";

/**
 * Boot the framework.
 */
export const initialize = async() => {
  if (isInitialized()) {
    return;
  }

  await contentLoader.loadRefs(document);
  controller.updateRoutingAnchors();
  await controller.navigateTo(url.pathname);

  window.addEventListener(
    "popstate",
    async(ev) => {
      if (ev.state && ev.state.path) {
        await controller.navigateTo(ev.state.path, undefined, true);
      }
    },
    {
      passive: true,
      capture: false,
    }
  );

  setInitialized();
};
