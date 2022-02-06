import { makePath } from "./path";
import type { path } from "./path";
import { router } from "./router";

export class RoutingEvent extends CustomEvent<{
  router: HTMLElement;
  route: path;
}> {
  constructor(newLocation: string) {
    super("route", {
      detail: {
        router: router,
        route: makePath(newLocation),
      },
      cancelable: true,
    });
  }
}

export class RoutedEvent extends CustomEvent<{
  router: HTMLElement;
  route: path;
}> {
  constructor(newLocation: string) {
    super("routed", {
      detail: {
        router: router,
        route: makePath(newLocation),
      },
      cancelable: false,
    });
  }
}

interface RouterEventMap {
  route: RoutingEvent;
  routed: RoutedEvent;
}

export const addRoutingEventListener = <K extends keyof RouterEventMap>(
  type: K,
  listener: (ev: RouterEventMap[K]) => void,
  options?: AddEventListenerOptions
) => {
  router.addEventListener(type, listener as any, options);
};
