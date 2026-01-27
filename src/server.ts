import {file, serve} from "bun";
import {baseHtml} from "./lib/baseHtml";
import {config} from "dotenv";
import * as path from "path";
import {MIME_TYPES} from "./MIME_TYPES.ts";
import { getHitsData, addHit, logUnknownRequest } from "./metrics";

config();

const ALLOWED_PATHS = ["/", "/favicon.ico", "/styles/style.css", "/main.js", "/main.js.map"];

console.log(process.cwd());

const outDir = path.join(process.cwd(), "out");
const uiDir = path.join(process.cwd(), "src/ui");

const ipRequestCount: Record<string, number> = {};

const getMimeType = (filepath: string): string => {
    const getFileExtension = (path: string): string =>
        path.split('.').pop()?.toLowerCase() || "";
    const extension = getFileExtension(filepath);
    return MIME_TYPES[extension] || "text/plain";
};

// Bun server handler
const server = serve({
    port: parseInt(process.env.PORT || "3000"),
    async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const isHit = !req.url.includes("favicon") && !pathname.includes(".") && req.method === "GET";

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204 });
        }

        const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
        if (!isHit && !req.url.includes("img") && !ALLOWED_PATHS.includes(pathname)) {
            console.log(`->\t[${req.method}] ${req.url}\t${ip}`);
        }

        // Handle static files from "out" and "src/ui" directories
        const staticFiles = [outDir, uiDir];
        let staticFileFound = false;
        for (const dir of staticFiles) {
            const staticFilePath = path.join(dir, pathname.slice(1)); // Remove leading "/"

            if (await Bun.file(staticFilePath).exists()) {
                staticFileFound = true;
                const mimeType = getMimeType(staticFilePath);

                return new Response(await file(staticFilePath).arrayBuffer(), {
                    headers: { "Content-Type": mimeType },
                });
            }
        }

        // Unknown path detection
        if (!staticFileFound && !ALLOWED_PATHS.includes(pathname)) {
            await logUnknownRequest(req, ip);
            await new Promise((resolve) => {
                setTimeout(resolve, 1000 + (Math.random() * 10000));
            });
        }

        // Handle dynamic routes (fallback to baseHtml render)
        try {
            const hitsData = getHitsData();
            const html = await baseHtml(req, hitsData);
            if (isHit) {
                const count = (ipRequestCount[ip] || 0) + 1;
                if (count <= 10) {
                    addHit().then(() => console.log(`+HIT\t[${req.method}] ${req.url}\t${ip} (Hits: ${count})`));
                } else {
                    console.log(`NOHIT (limit reached)\t[${req.method}] ${req.url}\t${ip}`);
                }
                ipRequestCount[ip] = count;
            }
            return new Response(html, { headers: { "Content-Type": "text/html" } });
        } catch (error) {
            console.error("Error rendering HTML:", error);
            return new Response("Internal Server Error", { status: 500 });
        }
    },
});

console.log(`Server is running on http://localhost:${server.port}`);