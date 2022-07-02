import { router } from "./router";
import { callQueryFunction } from "./query";

export interface Page {
  route: string;
  onRouted(...params: Array<string | undefined>): void;
}

const pageRegister = new Map<string, Page>();

export const page: ClassDecorator = <T extends Function>(Page: T): T | void => {
  const page: Page = new (Page as any)();
  if ("onRouted" in page) {
    const route = page.route.startsWith("/") ? page.route : "/" + page.route;
    pageRegister.set(route, page);
    if (route === router.dataset.route) {
      callQueryFunction(page.onRouted, page);
    }
  } else {
    throw new Error(`Page "${Page.name}" has no onRouted method.`);
  }
};

let lastPage: string = "";
export const triggerPage = (route: string): void => {
  if (lastPage === route) {
    return;
  } else {
    lastPage = route;
  }

  const page = pageRegister.get(route);
  if (page) {
    callQueryFunction(page.onRouted, page);
  }
};
