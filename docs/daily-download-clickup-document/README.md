# Download ClickUp Document

Download a ClickUp document and all its sub-pages from a given link. **Only content from that doc is downloaded**—no external links or other docs are followed.

**Run with Node.js:** `node download.js`

## Setup

1. **Node.js 18+** required.

2. Install dependencies (once):

```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):

```bash
copy .env.example .env
```

4. Fill in `.env`:

- **CLICKUP_API_TOKEN**: Personal API key from [ClickUp Settings > Apps](https://app.clickup.com/settings/apps).
- **DOWNLOAD_LINK**: The ClickUp document URL to download, e.g.:
  - `https://doc.clickup.com/24322455/d/h/q68cq-250875/72920db03440d96/q68cq-617035`
  - `https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-617035`

Optional:

- **OUTPUT_DIR**: Folder to save files into (default: `./clickup_downloads`).

## Run

```bash
node download.js
```

or:

```bash
npm run download
```

## Behavior

- Parses the link to get **workspace**, **doc**, and optional **page**.
- Uses ClickUp API v3 to fetch the **page listing** for that doc only.
- If the link points to a specific page → only that page and all its **sub-pages** are downloaded.
- If the link points to the doc root → **all pages** in the doc are downloaded.
- Each page is saved as a `.md` file; folder structure mirrors the doc tree in ClickUp.
- **Only pages from the same doc** (same `doc_id`) are included—no external or cross-doc links.

## Output

- Default location: `./clickup_downloads/<doc name>/...`
- One `.md` file per page; subfolders match sub-pages.

---

## Cursor knowledge base (indexing)

Downloaded files live in your workspace, so they are indexed by **Cursor’s Codebase Indexing**, not by the separate “Docs” (Add Doc) feature.

- **Auto index:** Cursor may index new or changed files in the background, but it is **not guaranteed** to update immediately after a download. It can be delayed or incomplete.
- **Manual index (recommended):** After running the download, open **Settings → Indexing & Docs**, find **Codebase Indexing**, and click **Sync** to refresh the index. That way the new or updated files are included in Cursor’s context for chat and search.

**Summary:** To rely on the latest downloaded content in Cursor, run the script, then trigger a manual **Sync** under Codebase Indexing in settings.
