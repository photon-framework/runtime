import { updateRoutingAnchors } from "./src/updateRoutingAnchors";
import { router } from "./src/router";
import { insertPlaceholders } from "./src/insertPlaceholders";
import { performNavigation } from "./src/navigate";

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
