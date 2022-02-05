import { router } from "./router";
import { pushState } from "./pushState";
import { join } from "path";

const elOptions: AddEventListenerOptions = {
  passive: false,
  capture: true,
};

const onRoutingAnchorClick = (ev: MouseEvent) => {
  ev.preventDefault();

  const a = ev.target as HTMLAnchorElement;
  const href = a.getAttribute("href");
  if (!href) {
    return;
  }

  console.debug("Routing to", href);
  pushState(href);
  router.dispatchEvent(
    new CustomEvent("routing", {
      detail: {
        route: href,
      },
      cancelable: false,
    })
  );
};

const updateRoutingAnchor = (a: HTMLAnchorElement) => {
  a.setAttribute("href", join(router.dataset.route!, a.dataset.route!));
  delete a.dataset.route;

  a.addEventListener("click", onRoutingAnchorClick, elOptions);
};

export const updateRoutingAnchors = (target: ParentNode = document.body) => {
  (
    target.querySelectorAll("a[data-route]") as NodeListOf<HTMLAnchorElement>
  ).forEach(updateRoutingAnchor);
};
