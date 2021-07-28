import Koa from "koa";
import * as fs from "fs";
import * as Path from "path";
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

app.use(async ctx => {
  const { path, request } = ctx;
  const { url } = request;
  if (path === "/") {
    let content = fs.readFileSync("./index.html", "utf-8");
    ctx.type = "text/html";
    ctx.body = content;
    return;
  }
  if (url.endsWith(".js") || url.endsWith(".ts")) {
    const p = Path.resolve(__dirname, url.slice(1));
    ctx.type = "application/javascript";
    const content = fs.readFileSync(p, "utf-8");
    ctx.body = content;
    return;
  }
  ctx.body = "Hello World";
});

app.listen(3000);
