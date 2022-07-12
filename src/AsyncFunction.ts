type AsyncFunctionConstructor = (
  ...args: Array<string>
) => ((...args: Array<string>) => Promise<any>) & Function;

/** @internal */
export const AsyncFunction: AsyncFunctionConstructor = Object.getPrototypeOf(
  async function () {}
).constructor;
