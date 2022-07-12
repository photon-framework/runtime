import { contentLoader } from "./contentLoader.js";
import "./query.js";
import { controller } from "./controller.js";
import { url } from "./URL.js";
import { setInitialized } from "./initialized.js";

/**
 * Boot the framework.
 */
export const initialize = async () => {
  await contentLoader.loadRefs(document);
  controller.updateRoutingAnchors();
  await controller.navigateTo(url.pathname);
  setInitialized();
};
