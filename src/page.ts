import { isInitialized } from "./initialized.js";
import { callQueryFunction } from "./query";
import { url } from "./URL.js";

export interface CPage {
  onRouted(...params: Array<string | undefined>): void;
}

export type FPage = (...params: Array<string | undefined>) => void;

const pageRegister = new Map<string, { obj: object; key: string | symbol }>();

let lastPage: string = "^";

const classInstances = new Map<string, object>();

export const page = (route: string): ClassDecorator & MethodDecorator => {
  if (!route.startsWith("/")) {
    route = "/" + route;
  }

  return (target: Function | Object, propertyKey?: string | symbol) => {
    // class decorator
    if (typeof target === "function") {
      if (!classInstances.has(target.name)) {
        classInstances.set(target.name, new (target as { new (): CPage })());
      }

      const page = classInstances.get(target.name) as CPage;
      if ("onRouted" in page) {
        pageRegister.set(route, { obj: page, key: "onRouted" });
        if (route === url.pathname && isInitialized()) {
          lastPage = route;
          callQueryFunction(page.onRouted, page);
        }
      } else {
        throw new Error(`Page "${target.name}" has no onRouted method.`);
      }
    } else if (propertyKey) {
      // method decorator
      if (!classInstances.has(target.constructor.name)) {
        classInstances.set(
          target.constructor.name,
          new (target.constructor as { new (): object })()
        );
      }
      const obj = classInstances.get(target.constructor.name)!;

      pageRegister.set(route, {
        obj,
        key: propertyKey,
      });
      if (route === url.pathname && isInitialized()) {
        lastPage = route;
        callQueryFunction(target[propertyKey], page);
      }
    }
  };
};

export const triggerPage = (route: string): void => {
  if (lastPage === route) {
    return;
  } else {
    lastPage = route;
  }

  const page = pageRegister.get(route);
  if (page) {
    callQueryFunction(page.obj[page.key]!, page.obj);
  }
};
