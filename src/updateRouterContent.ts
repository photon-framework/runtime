import { join } from "path";
import { router } from "./router";

const htmlLocationFromPath = (path: string) => {
  const url = join(router.dataset.content, path, "index.html");
  if (url[0] === "/") {
    return url;
  } else {
    return "/" + url;
  }
};

export const updateRouterContent = async (path: string) => {
  const response = await fetch(htmlLocationFromPath(path));
  if (response.ok) {
    router.innerHTML = await response.text();
  } else {
    router.innerHTML = `<h1>${response.status}</h1><p>${response.statusText}</p><a href="${response.url}">${response.url}</a>`;
  }
};
