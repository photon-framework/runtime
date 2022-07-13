import { dotenv } from "./dotenv";

const consoleCss =
  "background:black;color:#9683EC;font-size:0.8rem;padding:0.2rem 0.5rem;margin:0;";

const format = (message: Array<any>) => {
  return [
    "%c" +
      message
        .map((x) => {
          if (typeof x === "string") {
            return x;
          } else {
            let t = typeof x;
            if (t === "object" && x.constructor && x.constructor.name) {
              t = x.constructor.name;
            }

            return `<${t}>` + JSON.stringify(x, undefined, 2);
          }
        })
        .join(" "),
    consoleCss,
  ];
};

/**
 * Photon Logger
 *
 * Only errors are logged in production.
 */
export const logger = {
  log: (...message: Array<any>) => {
    if (!dotenv.production) {
      console.log(...format(message));
    }
  },
  warn: (...message: Array<any>) => {
    if (!dotenv.production) {
      console.warn(...format(message));
    }
  },
  error: (...message: Array<any>) => {
    console.error(...format(message));
  },
  debug: (...message: Array<any>) => {
    if (!dotenv.production) {
      console.debug(...format(message));
    }
  },
};
