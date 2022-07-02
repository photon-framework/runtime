import { navigate, performNavigation } from "./navigate";
import { triggerPage } from "./page";
import { router } from "./router";
import { updateHtmlLang } from "./updateHtmlLang";
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
    updateHtmlLang();
    triggerPage(router.dataset.route);
  }
};

(globalThis as any).debug = {
  performNavigation,
  navigate,
  router,
};
