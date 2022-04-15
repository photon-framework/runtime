import { router } from "./router";
import { insertPlaceholders } from "./insertPlaceholders";
import { performNavigationPop } from "./navigate";
import { init } from "./init";

init();

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
      performNavigationPop(location.pathname);
    }
  },
  {
    passive: true,
  }
);
