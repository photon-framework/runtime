import { isInitialized } from "./initialized.js";
import { callQueryFunction } from "./query";
import { url } from "./URL.js";
import * as globToRegexp from "glob-to-regexp";

/**
 * Interface for class based pages.
 *
 * Should be used when using the `page` decorator on a class.
 *
 * @example
 * ```typescript
 * @page("/my-page")
 * class MyPage extends Page {
 *   onRouted() {
 *    // do special stuff when page is routed
 *   }
 * }
 * ```
 */
export interface CPage {
  onRouted(...params: Array<string | undefined>): void;
}

/**
 * Type for function based pages.
 *
 * @example
 * ```typescript
 * class MyPages {
 *   @page("/foo")
 *   private foo() {
 *     // do stuff
 *   }
 *
 *   @page("/bar")
 *   private bar() {
 *     // do stuff
 *   }
 * }
 * ```
 */
export type FPage = (...params: Array<string | undefined>) => void;

const pageRegister = new Array<{
  route: RegExp;
  obj: object;
  key: string | symbol;
}>();

let lastPage: string = "^";

const classInstances = new Map<string, object>();

/**
 * Page decorator.
 *
 * Can be used on a class or a method.
 *
 * @param route The route to match.
 *
 * @example
 * ```typescript
 * @page("/foo/bar/*")
 * class MyPage extends Page {
 * ```
 */
export const page = (route: string): ClassDecorator & MethodDecorator => {
  if (!route.startsWith("/")) {
    route = "/" + route;
  }

  const routeRegex = globToRegexp(route, { globstar: true, flags: "i" });

  return (target: Function | Object, propertyKey?: string | symbol) => {
    // class decorator
    if (typeof target === "function") {
      if (!classInstances.has(target.name)) {
        classInstances.set(target.name, new (target as { new (): CPage })());
      }

      const page = classInstances.get(target.name) as CPage;
      if ("onRouted" in page) {
        pageRegister.push({ route: routeRegex, obj: page, key: "onRouted" });
        if (isInitialized() && routeRegex.test(url.pathname)) {
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

      pageRegister.push({ route: routeRegex, obj, key: propertyKey });

      if (isInitialized() && routeRegex.test(url.pathname)) {
        lastPage = route;
        callQueryFunction(target[propertyKey], page);
      }
    }
  };
};

/** @internal */
export const triggerPage = (route: string): void => {
  if (lastPage === route) {
    return;
  } else {
    lastPage = route;
  }

  for (const page of pageRegister) {
    if (page.route.test(route)) {
      callQueryFunction(page.obj[page.key], page.obj);
    }
  }
};
