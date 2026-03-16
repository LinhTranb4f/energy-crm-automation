/**
 * Download ClickUp document and all its sub-pages from a given link.
 * Only downloads pages belonging to the same ClickUp doc (no external links).
 * Run: node download.js
 */

import "dotenv/config";
import fs from "fs/promises";
import path from "path";

const CLICKUP_API_BASE = "https://api.clickup.com/api/v3";
const REQUEST_DELAY_MS = 300;

function parseClickupDocUrl(url) {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  let pathname;
  try {
    pathname = new URL(trimmed).pathname;
  } catch {
    return null;
  }
  const pathParts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  let workspaceId = null;
  let docId = null;
  let pageId = null;
  const idPattern = /^[a-z0-9]+-[0-9]+$/;

  for (const part of pathParts) {
    if (/^\d{6,}$/.test(part)) workspaceId = part;
    if (idPattern.test(part)) {
      if (docId == null) docId = part;
      else pageId = part;
    }
  }
  if (!workspaceId || !docId) return null;
  return { workspaceId, docId, pageId: pageId || undefined };
}

function sanitizeFilename(name) {
  if (!name || !String(name).trim()) return "untitled";
  let s = String(name).trim();
  s = s.replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, " ");
  return (s.slice(0, 200) || "untitled");
}

// ClickUp: Personal token (pk_xxx) = "Authorization: {token}" (không có Bearer)
// OAuth token = "Authorization: Bearer {token}"
function getAuthHeader(token) {
  const t = token.startsWith("Bearer ") ? token.slice(7) : token;
  return t.startsWith("pk_") ? t : `Bearer ${t}`;
}

async function fetchApi(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(token),
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function getPageListing(workspaceId, docId, token) {
  const url = `${CLICKUP_API_BASE}/workspaces/${workspaceId}/docs/${docId}/page_listing`;
  const data = await fetchApi(url, token);

  let list = Array.isArray(data)
    ? data
    : data?.pages ?? data?.page_listing ?? data?.page_list ?? [];
  if (!Array.isArray(list)) list = [];

  if (list.length && list[0] && typeof list[0] === "object" && "parent_page_id" in list[0]) {
    list = buildTreeFromFlat(list, docId, null);
  }
  return list;
}

function buildTreeFromFlat(flatList, docId, parentId) {
  const out = [];
  for (const node of flatList) {
    if (!node || typeof node !== "object") continue;
    if (node.doc_id && String(node.doc_id) !== String(docId)) continue;
    if ((node.parent_page_id ?? node.parent_id) !== parentId) continue;
    const children = buildTreeFromFlat(flatList, docId, node.id);
    out.push(children.length ? { ...node, pages: children } : node);
  }
  return out;
}

function filterTreeToPageAndChildren(pages, targetPageId) {
  if (!targetPageId) return pages;

  function find(nodes, target) {
    for (const node of nodes) {
      if (node?.id === target) return [node];
      const child = node?.pages ?? node?.children ?? [];
      if (child.length) {
        const found = find(child, target);
        if (found.length) return found;
      }
    }
    return [];
  }
  return find(pages, targetPageId);
}

function buildIdToName(nodes) {
  const out = {};
  function walk(nodelist) {
    for (const node of nodelist) {
      if (!node || typeof node !== "object") continue;
      const id = node.id;
      const name = node.name ?? node.title ?? "untitled";
      if (id) out[id] = name;
      const children = node.pages ?? node.children ?? [];
      if (children.length) walk(children);
    }
  }
  walk(nodes);
  return out;
}

function getContentFromPageResponse(data) {
  if (!data || typeof data !== "object") return "";
  for (const key of ["body", "content", "markdown", "text"]) {
    const v = data[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  const contentObj = data.content ?? data.body;
  if (contentObj && typeof contentObj === "object" && contentObj.markdown)
    return contentObj.markdown || "";
  return "";
}

async function getPageContent(workspaceId, docId, pageId, token) {
  const url = `${CLICKUP_API_BASE}/workspaces/${workspaceId}/docs/${docId}/pages/${pageId}`;
  try {
    const data = await fetchApi(url, token);
    return getContentFromPageResponse(data);
  } catch (e) {
    console.warn(`[WARN] Failed to get page ${pageId}:`, e.message);
    return "";
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function downloadPagesRecursive(workspaceId, docId, token, nodes, outputDir, idToName, relPath = ".") {
  let count = 0;
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    if (node.doc_id && String(node.doc_id) !== String(docId)) continue;

    const pageId = node.id;
    const name = node.name ?? node.title ?? idToName[pageId] ?? "untitled";
    const safeName = sanitizeFilename(name) || `page_${pageId}`;

    const content = await getPageContent(workspaceId, docId, pageId, token);
    await sleep(REQUEST_DELAY_MS);

    const pageDir = path.join(outputDir, relPath);
    await fs.mkdir(pageDir, { recursive: true });
    let filePath = path.join(pageDir, `${safeName}.md`);
    const text = (content || `# ${name}\n\n(No content)`).trim();

    try {
      const existing = await fs.readFile(filePath, "utf8").catch(() => null);
      if (existing && existing.trim() !== text) filePath = path.join(pageDir, `${safeName}_${pageId}.md`);
    } catch (_) {}

    await fs.writeFile(filePath, text, "utf8");
    count++;
    console.log(`  [OK] ${path.join(relPath, safeName + ".md")}`);

    const children = node.pages ?? node.children ?? [];
    if (children.length) {
      count += await downloadPagesRecursive(
        workspaceId,
        docId,
        token,
        children,
        outputDir,
        idToName,
        path.join(relPath, safeName)
      );
    }
  }
  return count;
}

async function main() {
  const envPath = path.join(process.cwd(), ".env");
  try {
    await fs.access(envPath);
  } catch {
    console.error("ERROR: No .env file found in this directory.");
    console.error("  Copy .env.example to .env and set CLICKUP_API_TOKEN and DOWNLOAD_LINK.");
    process.exit(1);
  }

  const token = (process.env.CLICKUP_API_TOKEN || "").trim();
  const downloadLink = (process.env.DOWNLOAD_LINK || "").trim();
  const outputDir = (process.env.OUTPUT_DIR || "").trim() || "./clickup_downloads";

  if (!token || token === "your_clickup_api_token_here") {
    console.error("ERROR: Set CLICKUP_API_TOKEN in .env (get from https://app.clickup.com/settings/apps)");
    process.exit(1);
  }
  if (!downloadLink) {
    console.error("ERROR: Set DOWNLOAD_LINK in .env to the ClickUp document URL");
    process.exit(1);
  }

  const parsed = parseClickupDocUrl(downloadLink);
  if (!parsed) {
    console.error("ERROR: Could not parse DOWNLOAD_LINK. Use a ClickUp doc link (doc.clickup.com or app.clickup.com).");
    process.exit(1);
  }

  const { workspaceId, docId, pageId } = parsed;
  const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

  console.log(`Workspace: ${workspaceId}, Doc: ${docId}${pageId ? `, Start page: ${pageId}` : ""}`);
  console.log("Fetching page listing (same doc only, no external links)...");

  let pages;
  try {
    pages = await getPageListing(workspaceId, docId, authHeader);
  } catch (e) {
    console.error("[ERROR] Page listing request failed:", e.message);
    process.exit(1);
  }

  if (!pages.length) {
    console.error("No pages returned. Check token and URL (doc must be in the same workspace).");
    process.exit(1);
  }

  pages = filterTreeToPageAndChildren(pages, pageId);
  if (!pages.length) {
    console.error("No pages under the given link (or page not found).");
    process.exit(1);
  }

  const idToName = buildIdToName(pages);
  // Tất cả file tải về nằm trong một folder gốc (OUTPUT_DIR + tên doc)
  const baseDir = path.resolve(outputDir);
  const docTitle = (pages[0] && idToName[pages[0].id]) || "ClickUp Doc";
  const rootName = sanitizeFilename(docTitle);
  const downloadFolder = path.join(baseDir, rootName);
  await fs.mkdir(downloadFolder, { recursive: true });

  console.log(`Downloading to folder: ${downloadFolder}`);
  const n = await downloadPagesRecursive(workspaceId, docId, authHeader, pages, downloadFolder, idToName, ".");
  console.log(`Done. Downloaded ${n} page(s) into: ${downloadFolder}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
