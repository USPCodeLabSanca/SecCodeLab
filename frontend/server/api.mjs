import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, "../public/custom-vulnerabilities.json");
const PORT = Number(process.env.PORT ?? 3001);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

async function readCustomVulnerabilities() {
  const raw = await readFile(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Custom vulnerabilities file must contain an array");
  }

  return parsed;
}

async function writeCustomVulnerabilities(items) {
  await writeFile(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", reject);
  });
}

function validateVulnerability(payload) {
  const requiredFields = [
    "id",
    "title",
    "slug",
    "category",
    "difficulty",
    "icon",
    "description",
    "content",
    "labFileName",
    "labZipUrl",
  ];

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string") {
      throw new Error(`Field "${field}" must be a string`);
    }
  }
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Missing request URL" });
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (url.pathname === "/api/vulnerabilities" && req.method === "GET") {
    try {
      const items = await readCustomVulnerabilities();
      sendJson(res, 200, items);
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : "Unable to read vulnerabilities" });
    }
    return;
  }

  if (url.pathname === "/api/vulnerabilities" && req.method === "POST") {
    try {
      const payload = await readRequestBody(req);
      validateVulnerability(payload);

      const items = await readCustomVulnerabilities();
      const duplicateId = items.some((item) => item.id === payload.id);

      if (duplicateId) {
        sendJson(res, 409, { error: "Vulnerability ID already exists" });
        return;
      }

      const nextItems = [...items, payload];

      await writeCustomVulnerabilities(nextItems);
      sendJson(res, 201, payload);
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Unable to save vulnerability" });
    }
    return;
  }

  if (url.pathname.startsWith("/api/vulnerabilities/") && req.method === "PUT") {
    const id = decodeURIComponent(url.pathname.replace("/api/vulnerabilities/", ""));

    try {
      const payload = await readRequestBody(req);
      validateVulnerability(payload);

      if (payload.id !== id) {
        sendJson(res, 400, { error: "Payload ID must match route ID" });
        return;
      }

      const items = await readCustomVulnerabilities();
      const index = items.findIndex((item) => item.id === id);

      if (index === -1) {
        sendJson(res, 404, { error: "Vulnerability not found" });
        return;
      }

      const nextItems = [...items];
      nextItems[index] = payload;

      await writeCustomVulnerabilities(nextItems);
      sendJson(res, 200, payload);
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : "Unable to update vulnerability" });
    }
    return;
  }

  if (url.pathname.startsWith("/api/vulnerabilities/") && req.method === "DELETE") {
    const id = decodeURIComponent(url.pathname.replace("/api/vulnerabilities/", ""));

    try {
      const items = await readCustomVulnerabilities();
      const nextItems = items.filter((item) => item.id !== id);

      if (nextItems.length === items.length) {
        sendJson(res, 404, { error: "Vulnerability not found" });
        return;
      }

      await writeCustomVulnerabilities(nextItems);
      sendJson(res, 200, { id });
    } catch (error) {
      sendJson(res, 500, { error: error instanceof Error ? error.message : "Unable to delete vulnerability" });
    }
    return;
  }

  sendJson(res, 404, { error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Vulnerability API listening on http://localhost:${PORT}`);
});
