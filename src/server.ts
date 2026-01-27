import {file, serve} from "bun";
import {baseHtml} from "./lib/baseHtml";
import {config} from "dotenv";
import * as path from "path";
import {MIME_TYPES} from "./MIME_TYPES.ts";
import { getHitsData, addHit, logUnknownRequest } from "./metrics";

config();

const ALLOWED_PATHS = ["/", "/favicon.ico", "/styles/style.css", "/main.js", "/main.js.map", "/requests-report"];

console.log(process.cwd());

const outDir = path.join(process.cwd(), "out");
const uiDir = path.join(process.cwd(), "src/ui");

const ipRequestCount: Record<string, number> = {};

const handleUnknownPath = async (req: Request, ip: string) => {
    await logUnknownRequest(req, ip);
    await new Promise((resolve) => {
        setTimeout(resolve, 1000 + (Math.random() * 10000));
    });
    return new Response("Nice try. But no.", {
        status: 200,
        headers: { "logged-your-mom": "true" }
    });
};

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

        const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";

        if (pathname === "/requests-report") {
            const code = url.searchParams.get("code");
            if (code && code === process.env.CODE) {
                const logFilePath = "requests.csv";
                if (await Bun.file(logFilePath).exists()) {
                    return new Response(Bun.file(logFilePath), {
                        headers: { "Content-Type": "text/csv" }
                    });
                } else {
                    return new Response("No requests logged yet.", { status: 404 });
                }
            } else {
                return handleUnknownPath(req, ip);
            }
        }

        const isHit = !req.url.includes("favicon") && !pathname.includes(".") && req.method === "GET";

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204 });
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
            return handleUnknownPath(req, ip);
        }

        if (!isHit && !req.url.includes("img") && !ALLOWED_PATHS.includes(pathname)) {
            console.log(`->\t[${req.method}] ${req.url}\t${ip}`);
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