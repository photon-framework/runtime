type AsyncFunctionConstructor = (
  ...args: Array<string>
// eslint-disable-next-line @typescript-eslint/ban-types
) => ((...$args: Array<string>) => Promise<any>) & Function;

/** @internal */
export const AsyncFunction: AsyncFunctionConstructor = Object.getPrototypeOf(
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  async function() {}
).constructor;
