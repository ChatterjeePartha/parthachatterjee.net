// Minimal static file server for previewing the rendered _site folder.
// Root is hardcoded so it does not depend on the process working directory.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "/Users/shss-partha-01/Library/CloudStorage/Dropbox/Claude working folder/parthachatterjee.net/_site";
const PORT = 4848;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath.endsWith("/")) urlPath += "index.html";
    let filePath = path.join(ROOT, urlPath);
    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
      fs.readFile(filePath, (err2, data) => {
        if (err2) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found: " + urlPath);
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log("preview server on http://127.0.0.1:" + PORT);
  });
