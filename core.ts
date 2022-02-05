import { updateRoutingAnchors } from "./src/updateRoutingAnchors";
import { router } from "./src/router";
import { insertPlaceholders } from "./src/insertPlaceholders";

updateRoutingAnchors();

window.history.replaceState(
  { pageTitle: document.title },
  document.title,
  router.dataset.route
);

insertPlaceholders(document.body);
