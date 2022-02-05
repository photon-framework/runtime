import { router } from "./router";
import { navigate } from "./navigate";
import { join } from "path";
import { updateRouterContent } from "./updateRouterContent";

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

  const route = a.dataset.route;
  if (!route) {
    return;
  }

  console.debug("Routing to", href);

  const newLocation = navigate(route);

  updateRouterContent(newLocation).then(() => {
    router.dispatchEvent(
      new CustomEvent("routed", {
        detail: {
          router: router,
          route: newLocation,
        },
        cancelable: false,
      })
    );
  });
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
