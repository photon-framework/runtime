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
  /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func: Function) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, "");
  var result = fnStr
    .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
    .match(ARGUMENT_NAMES);
  if (!result) {
    return [];
  }
  return Array.from(result);
}

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
