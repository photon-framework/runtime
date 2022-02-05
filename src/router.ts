const router = document.querySelector("*[photon-router]") as HTMLElement;

if (!router) {
  throw new Error("No router found");
}

export { router };
