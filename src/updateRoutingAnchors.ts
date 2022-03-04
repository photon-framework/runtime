import { router } from "./router";
import { navigate, performNavigation } from "./navigate";
import { path as P } from "@frank-mayer/magic";

const elOptions: AddEventListenerOptions = {
  passive: false,
  capture: true,
};

const onRoutingAnchorClick = (ev: MouseEvent) => {
  const a = ev.target as HTMLAnchorElement;

  const route = a.dataset.route;
  if (!route) {
    console.warn("No route specified for anchor", a);
    return;
  }

  ev.preventDefault();

  performNavigation(navigate(route));
};

export const updateRoutingAnchors = () => {
  (
    document.querySelectorAll("a[data-route]") as NodeListOf<HTMLAnchorElement>
  ).forEach((a) => {
    a.href = P.join(router.dataset.route!, a.dataset.route!);

    if (a.hasAttribute("data-linked")) {
      return;
    }
    a.toggleAttribute("data-linked", true);

    a.addEventListener("click", onRoutingAnchorClick, elOptions);
  });
};
