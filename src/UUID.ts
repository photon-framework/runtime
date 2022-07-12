export const UUID = () => {
  return (
    "yxxxyxxxyxxxyxxxyxxxyxxxyxxxyxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 36) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(36);
    }) + Date.now().toString(36)
  );
};
