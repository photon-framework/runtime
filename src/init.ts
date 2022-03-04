import { navigate, performNavigation } from "./navigate";
import { router } from "./router";
import { updateRoutingAnchors } from "./updateRoutingAnchors";

export const init = () => {
  if (router.innerHTML.length === 0 || router.dataset.route === undefined) {
    let route: string;
    if (router.dataset.route) {
      route = router.dataset.route;
    } else {
      route = location.pathname;
    }

    if (route === "/") {
      route = router.dataset.default;
    }

    performNavigation(navigate(route), document.title, true);
  } else {
    updateRoutingAnchors();
  }
};

(globalThis as any).debug = {
  performNavigation,
  navigate,
  router,
};
