import { router } from "./router";
import { navigate, performNavigation } from "./navigate";
import { join } from "@frank-mayer/magic";

const elOptions: AddEventListenerOptions = {
  passive: false,
  capture: true,
};

const onRoutingAnchorClick = (ev: MouseEvent) => {
  ev.preventDefault();
  let a = ev.target as HTMLAnchorElement;
  while (a.tagName !== "A" && a.parentElement) {
    a = a.parentElement as HTMLAnchorElement;
  }

  if (a.tagName !== "A" && a.dataset.route) {
    throw new Error("Invalid event target for routing anchor click");
  }

  const route = a.dataset.route;
  if (!route) {
    throw new Error(`No route specified for anchor, ${a.outerHTML}`);
  }

  performNavigation(navigate(route));
};

export const updateRoutingAnchors = () => {
  (
    document.querySelectorAll("a[data-route]") as NodeListOf<HTMLAnchorElement>
  ).forEach((a) => {
    a.href = join(router.dataset.route!, a.dataset.route!);

    if (a.hasAttribute("data-linked")) {
      return;
    }
    a.toggleAttribute("data-linked", true);

    a.addEventListener("click", onRoutingAnchorClick, elOptions);
  });
};
