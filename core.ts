const router = document.querySelector("*[photon-router]");

if (!router) {
  throw new Error("No router found");
}

console.debug("Initializing Photon");

const routingAnchors = document.querySelectorAll(
  "a[data-route]"
) as NodeListOf<HTMLAnchorElement>;
routingAnchors.forEach((a) => {
  a.href = a.dataset.route!;
  delete a.dataset.route;

  a.addEventListener(
    "click",
    (ev) => {
      ev.preventDefault();
      console.debug("Routing to", a.href);
      router.dispatchEvent(
        new CustomEvent("routing", {
          detail: {
            route: a.href,
          },
          cancelable: false,
        })
      );
    },
    {
      passive: false,
    }
  );
});
