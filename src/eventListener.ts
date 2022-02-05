import { router } from "./router";

export class RoutingEvent extends CustomEvent<{
  router: HTMLElement;
  route: string;
}> {
  constructor(newLocation: string) {
    super("routed", {
      detail: {
        router: router,
        route: newLocation,
      },
      cancelable: false,
    });
  }
}

interface RouterEventMap {
  routed: RoutingEvent;
}

export const addRoutingEventListener = <K extends keyof RouterEventMap>(
  type: K,
  listener: (ev: RouterEventMap[K]) => void,
  options?: AddEventListenerOptions
) => {
  router.addEventListener(type, listener as any, options);
};
