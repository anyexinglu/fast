import * as Path from "path";

export const appRoot = Path.resolve(
  Path.dirname(require.resolve("koa")),
  "..",
  "..",
  ".."
);

export const SRC_DIR = Path.join(appRoot, "src");

export const CLIENT_DIR = Path.join(appRoot, "src/client");

console.log("...CLIENT_DIR", CLIENT_DIR);
