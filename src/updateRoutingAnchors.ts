import { router } from "./router";
import { navigate, performNavigation } from "./navigate";
import { path as P } from "@frank-mayer/magic";

const elOptions: AddEventListenerOptions = {
  passive: false,
  capture: true,
};

const onRoutingAnchorClick = (ev: MouseEvent) => {
  ev.preventDefault();

  const a = ev.target as HTMLAnchorElement;

  const route = a.dataset.route;
  if (!route) {
    return;
  }

  performNavigation(navigate(route));
};

export const updateRoutingAnchors = (target: ParentNode = document.body) => {
  for (const a of Array.from(
    target.querySelectorAll("a[data-route]") as NodeListOf<HTMLAnchorElement>
  )) {
    a.setAttribute("href", P.join(router.dataset.route!, a.dataset.route!));
    a.addEventListener("click", onRoutingAnchorClick, elOptions);
  }
};
