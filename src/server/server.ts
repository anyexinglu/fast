import Koa from "koa";
import * as fs from "fs";
import * as Path from "path";
import * as React from "react";
import { renderToString } from "react-dom/server";
import Document from "./Document";
import { SRC_DIR, CLIENT_DIR } from "./constants";
import favicon from "./plugins/favicon";
console.log("...server");

const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(favicon(SRC_DIR + "/static/favicon.ico"));

app.use(async ctx => {
  const { path } = ctx;
  const regex = new RegExp(`^/([0-9a-zA-Z_-]+)`);

  const match = path.match(regex);
  const view = match?.[1] || "about"; // use about as default

  let Page;
  if (path.includes("client")) {
    const file = fs.readFileSync(Path.join(SRC_DIR, path));

    ctx.type = "application/javascript";
    ctx.body = file;
    return;
  }

  try {
    Page = require(CLIENT_DIR + `/views/${view}`).default;
  } catch (e) {
    // Error: Cannot find module './views/12'
    console.log("...e", e);
    Page = require(CLIENT_DIR + `/views/404`).default;
  }

  const html = renderToString(
    React.createElement(Document, { children: React.createElement(Page) })
  );
  ctx.response.body = html;
  ctx.response.type = "html";
});

app.listen(3000);
