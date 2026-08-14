// Local preview server for certifiedclosers.net.
// Zero dependencies, Node only.  node serve.js   ->  http://localhost:5858
// Port 5858 on purpose: the Camp app owns 5757, don't fight it.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 5858;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";

  // Keep the server inside ROOT no matter what the URL says.
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end("Nope");
    return;
  }

  fs.readFile(file, (err, buf) => {
    if (err) {
      // A bare folder name (/apply) should still find its index.html.
      fs.readFile(path.join(file, "index.html"), (err2, buf2) => {
        if (err2) {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h1>404</h1><p>Nothing at " + p + "</p>");
          return;
        }
        res.writeHead(200, { "Content-Type": TYPES[".html"] });
        res.end(buf2);
      });
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store", // always serve the edit you just made
    });
    res.end(buf);
  });
}).listen(PORT, () => {
  console.log("certifiedclosers.net preview running");
  console.log("  sales page  ->  http://localhost:" + PORT + "/");
  console.log("  application ->  http://localhost:" + PORT + "/apply/");
  console.log("  dispo       ->  http://localhost:" + PORT + "/dispo/");
});
