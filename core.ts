import { updateRoutingAnchors } from "./src/updateRoutingAnchors";
import { router } from "./src/router";

updateRoutingAnchors();

window.history.replaceState(
  { pageTitle: document.title },
  document.title,
  router.dataset.route
);
