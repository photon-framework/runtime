let initialized = false;

export const setInitialized = () => {
  initialized = true;
};

export const isInitialized = () => {
  return initialized;
};
