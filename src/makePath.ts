export type path = Array<string>;

export const makePath: {
  (path: string): path;
  (path: path): string;
} = (path: any): any => {
  if (typeof path === "string") {
    return path.split("/").filter(Boolean);
  } else if (Array.isArray(path)) {
    return "/" + path.join("/");
  } else {
    throw new Error(`Invalid path: ${JSON.stringify(path)}`);
  }
};
