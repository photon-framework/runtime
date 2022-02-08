import { join as $join } from "../node_modules/path-browserify/index.js";

export const join = (...paths: Array<string>): string => $join(...paths);
