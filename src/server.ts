import {file, serve} from "bun";
import {baseHtml} from "./lib/baseHtml";
import {config} from "dotenv";
import * as path from "path";
import {MIME_TYPES} from "./MIME_TYPES.ts";
import * as fs from "node:fs";
import { writeFile } from "node:fs/promises";

config();

console.log(process.cwd());

const outDir = path.join(process.cwd(), "out");
const uiDir = path.join(process.cwd(), "src/ui");

const getMimeType = (filepath: string): string => {
    const getFileExtension = (path: string): string =>
        path.split('.').pop()?.toLowerCase() || "";
    const extension = getFileExtension(filepath);
    return MIME_TYPES[extension] || "text/plain";
};

const isDev = !fs.existsSync("/portfolio");

const hitsTxtPath = isDev ? path.join(process.cwd(), "hits.txt") : "/portfolio/hits.txt";
if (!fs.existsSync(hitsTxtPath)) {
    fs.writeFileSync(hitsTxtPath, "");
}

function getHitsData(): Record<string, number> {
    const content = fs.readFileSync(hitsTxtPath, "utf-8");
    const lines = content.split("\n").filter(line => line.trim() !== "");
    const data: Record<string, number> = {};
    for (const line of lines) {
        if (!line.includes(";")) continue;
        const [date, count] = line.split(";");
        const parsedCount = parseInt(count);
        if (!isNaN(parsedCount)) {
            data[date] = parsedCount;
        }
    }
    return data;
}

function saveHitsData(data: Record<string, number>) {
    const lines = Object.entries(data)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => `${date};${count}`);
    fs.writeFileSync(hitsTxtPath, lines.join("\n"));
}

// Bun server handler
const server = serve({
    port: parseInt(process.env.PORT || "3000"),
    async fetch(req) {
        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204 });
        }

        const url = new URL(req.url);
        const pathname = url.pathname;

        // Handle static files from "out" and "src/ui" directories
        const staticFiles = [outDir, uiDir];
        for (const dir of staticFiles) {
            const staticFilePath = path.join(dir, pathname.slice(1)); // Remove leading "/"

            if (await Bun.file(staticFilePath).exists()) {
                const mimeType = getMimeType(staticFilePath);

                return new Response(await file(staticFilePath).arrayBuffer(), {
                    headers: { "Content-Type": mimeType },
                });
            }
        }

        // Handle dynamic routes (fallback to baseHtml render)
        try {
            const hitsData = getHitsData();
            const html = await baseHtml(req, hitsData);
            if (!req.url.includes("favicon") && !pathname.includes(".")) {
                const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
                addHit().then(() => console.log(`Hit added\t[${req.method}] ${req.url}\t${ip}`));
            }
            return new Response(html, { headers: { "Content-Type": "text/html" } });
        } catch (error) {
            console.error("Error rendering HTML:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    },
});

async function addHit() {
    const today = new Date().toISOString().split("T")[0];
    const data = getHitsData();
    data[today] = (data[today] || 0) + 1;
    saveHitsData(data);
}

console.log(`Server is running on http://localhost:${server.port}`);