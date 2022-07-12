let initialized = false;

/** @internal */
export const setInitialized = () => {
  initialized = true;
};

/** @internal */
export const isInitialized = () => {
  return initialized;
};
