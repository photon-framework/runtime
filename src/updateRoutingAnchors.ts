import { router } from "./router";
import { navigate, performNavigation } from "./navigate";
import { join } from "path";

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

const updateRoutingAnchor = (a: HTMLAnchorElement) => {
  a.setAttribute("href", join(router.dataset.route!, a.dataset.route!));
  a.addEventListener("click", onRoutingAnchorClick, elOptions);
};

export const updateRoutingAnchors = (target: ParentNode = document.body) => {
  (
    target.querySelectorAll("a[data-route]") as NodeListOf<HTMLAnchorElement>
  ).forEach(updateRoutingAnchor);
};
