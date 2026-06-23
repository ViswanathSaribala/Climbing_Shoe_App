const http = require("http");
const fs = require("fs");
const path = require("path");

const recommend = require("../api/recommend");
const adminShoes = require("../api/admin-shoes");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body) return resolve({});

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    req.on("error", reject);
  });
}

function sendText(res, status, text) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
}

function serveFile(urlPath, res) {
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const relativePath = decodeURIComponent(requestedPath).replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return sendText(res, 403, "Forbidden");
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) return sendText(res, 404, "Not found");

    res.statusCode = 200;
    res.setHeader("Content-Type", mimeTypes[path.extname(filePath)] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (url.pathname === "/api/recommend") {
      req.body = await readBody(req);
      return recommend(req, res);
    }

    if (url.pathname === "/api/admin-shoes") {
      req.body = await readBody(req);
      return adminShoes(req, res);
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      return sendText(res, 405, "Method not allowed");
    }

    return serveFile(url.pathname, res);
  } catch (error) {
    sendText(res, 500, error.message || "Local server error");
  }
});

server.listen(port, () => {
  console.log(`Climbing Shoe Advisor is ready at http://localhost:${port}`);
  console.log(`Database manager: http://localhost:${port}/admin.html`);
});
