import { contentLoader } from "./contentLoader.js";
import "./query.js";
import { controller } from "./controller.js";
import { url } from "./URL.js";
import { setInitialized } from "./initialized.js";

export const initialize = async () => {
  await contentLoader.loadRefs(document);
  controller.routingAnchors();
  await controller.navigateTo(url.pathname);
  setInitialized();
};
