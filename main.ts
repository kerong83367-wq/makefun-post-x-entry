// Entry program for the make.fun bounty post-x-promote-make-your-own-bounty-01.
// The post itself is the entry. This program only hands the grader the post's
// address: it reads POST.json from the repository root, checks that it names a
// real X status URL, and copies it to the output directory as /output/POST.json.
// Node 22+, standard library only, no network access.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(BOT_DIR, "POST.json");
const raw = readFileSync(source, "utf8");
const data: unknown = JSON.parse(raw);

if (
  typeof data !== "object" ||
  data === null ||
  typeof (data as { url?: unknown }).url !== "string"
) {
  console.error('POST.json must be an object with a string field "url".');
  process.exit(1);
}

const url = (data as { url: string }).url;
const m = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.exec(url);
if (m === null) {
  console.error(`POST.json does not name an X status URL: ${url}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, join(OUTPUT_DIR, "POST.json"));
console.log(`POST.json copied to ${OUTPUT_DIR}/POST.json for ${url}`);
