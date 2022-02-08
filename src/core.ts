import { updateRoutingAnchors } from "./updateRoutingAnchors";
import { router } from "./router";
import { insertPlaceholders } from "./insertPlaceholders";
import { performNavigation } from "./navigate";

updateRoutingAnchors();

window.history.replaceState(
  { pageTitle: document.title },
  document.title,
  router.dataset.route
);

insertPlaceholders(document.body);

window.addEventListener(
  "popstate",
  (ev) => {
    const state = ev.state;
    if (state) {
      performNavigation(location.pathname);
    }
  },
  {
    passive: true,
  }
);
