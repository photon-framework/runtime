import { dotenv } from "./dotenv.js";

const consoleCss = ["background: black; color: purple"];

const format = (message: any) => {
  if (typeof message === "string") {
    return [`%c${message.trim()}`, ...consoleCss];
  } else {
    return [`%c${JSON.stringify(message, undefined, 2)}`, ...consoleCss];
  }
};

/** @internal */
export const logger = {
  log: (message: any) => {
    console.log(...format(message));
  },
  warn: (message: any) => {
    console.warn(...format(message));
  },
  error: (message: any) => {
    console.error(...format(message));
  },
  debug: (message: any) => {
    if (!dotenv.production) {
      console.debug(...format(message));
    }
  },
};
