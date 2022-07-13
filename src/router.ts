/** @internal */
const router = ((window as any).router ??
  document.querySelector("*[photon-router]")) as HTMLElement & {
  dataset: Readonly<{
    content: string;
    default: string;
    fallback: string;
    homeAsEmpty?: string;
    langSegment?: string;
    languages?: string;
    preload?: string;
  }>;
};

(window as any).router = router;

(router.dataset as any).fallback ??= router.dataset.default;

if (!router) {
  throw new Error("No router found");
}

export { router };
