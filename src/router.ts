const router = document.querySelector("*[photon-router]") as HTMLElement & {
  dataset: {
    route?: string;
    content: string;
    default: string;
    fallback?: string;
  };
};

if (!router) {
  throw new Error("No router found");
}

export { router };
