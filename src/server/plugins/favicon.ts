/**
 * copy from github "koa-favicon"
 * Module dependencies.
 */
import { resolve } from "path";
import * as fs from "fs";

export default function (path, options?: any) {
  if (!path) {
    return (ctx, next) => {
      if ("/favicon.ico" != ctx.path) {
        return next();
      }
    };
  }

  path = resolve(path);
  options = options || {};

  let icon;
  const maxAge =
    options.maxAge == null
      ? 86400000
      : Math.min(Math.max(0, options.maxAge), 31556926000);
  const cacheControl = `public, max-age=${(maxAge / 1000) | 0}`;
  const mime = options.mime || "image/x-icon";

  return (ctx, next) => {
    console.log(222, ctx.path, "/favicon.ico" != ctx.path);
    if ("/favicon.ico" != ctx.path) {
      return next();
    }

    if ("GET" !== ctx.method && "HEAD" !== ctx.method) {
      ctx.status = "OPTIONS" == ctx.method ? 200 : 405;
      ctx.set("Allow", "GET, HEAD, OPTIONS");
    } else {
      // lazily read the icon
      if (!icon) icon = fs.readFileSync(path);
      ctx.set("Cache-Control", cacheControl);
      ctx.type = mime;
      ctx.body = icon;
    }
  };
}
