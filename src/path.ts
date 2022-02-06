export type path = Array<string>;

export const makePath = (path: string): path => {
  return path.split("/").filter(Boolean);
};
