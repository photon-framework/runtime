import { logger } from "./logger";

/**
 * Search params, the app was initialized with.
 */
export const searchParams: ReadonlyMap<string, string> = new Map<
  string,
  string
>();

/**
 * Search params, the app was initialized with.
 */
export const searchParamsRecord = (): Readonly<Record<string, string>> => {
  const rec: Record<string, string> = {};
  for (const q of searchParams) {
    rec[q[0]] = q[1];
  }
  return rec;
};

new URL(window.location.href).searchParams.forEach((value, key) => {
  (searchParams as Map<string, string>).set(key, value);
});

const STRIP_COMMENTS =
  /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,)]*))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
// eslint-disable-next-line @typescript-eslint/ban-types
const getParamNames = (func: Function) => {
  if (typeof func !== "function") {
    logger.error("query::getParamNames: not a function", func);
    return [];
  }

  const fnStr = func.toString().replace(STRIP_COMMENTS, "");
  const result = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (!result) {
    return [];
  }
  return Array.from(result);
};

/**
 * Call a function and fill the arguments with the search params.
 * @param fn The function to call.
 * @param thisPtr The this pointer to use for the function.
 * @returns The return value of the function.
 */
export const callQueryFunction = <R>(
  fn: (...args: Array<string | undefined>) => R,
  thisPtr?: any
): R => {
  if (typeof fn !== "function") {
    logger.error("query::callQueryFunction: not a function", fn);
    return undefined as any;
  }

  const params = getParamNames(fn);

  const paramValues = params.map((param) => {
    if (searchParams.has(param)) {
      return searchParams.get(param);
    } else {
      return undefined;
    }
  });

  if (thisPtr) {
    return fn.apply(thisPtr, paramValues);
  } else {
    return fn(...paramValues);
  }
};
