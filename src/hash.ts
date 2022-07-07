import xxhash from "xxhash-wasm";

const h64ToString = new Promise<
  (input: string, seed?: bigint | undefined) => string
>((res, rej) => {
  xxhash()
    .then((xxh) => {
      res(xxh.h64ToString);
    })
    .catch(rej);
});

export const hashToString = async (input: string) => {
  return (await h64ToString)(input);
};

export const emptyStringHash = new Promise<string>((res, rej) => {
  h64ToString
    .then((fn) => {
      res(fn(""));
    })
    .catch(rej);
});
