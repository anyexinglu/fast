import * as React from "react";

export default function Document({ children }) {
  return (
    <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>Saber</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="module" src="./client/client.ts"></script>
      </head>
      <body>
        <div id="root">{children}</div>
        xxx
      </body>
    </html>
  );
}
