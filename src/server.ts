import {file, serve} from "bun";
import {baseHtml} from "./lib/baseHtml";
import {config} from "dotenv";
import * as path from "path";
import {MIME_TYPES} from "./MIME_TYPES.ts";
import {getHitsData, addHit, logUnknownRequest, requestsCsvPath} from "./metrics";
import * as fs from "node:fs";

config();

const ALLOWED_PATHS = ["/", "/favicon.ico", "/robots.txt", "/styles/style.css", "/main.js", "/main.js.map", "/requests-report", "/articles", "/article"];

console.log(process.cwd());

const outDir = path.join(process.cwd(), "out");
const uiDir = path.join(process.cwd(), "src/ui");
const articlesDir = path.join(process.cwd(), "src/articles");

const ipRequestCount: Record<string, number> = {};
const excludedIps = process.env.EXCLUDED_IPS?.split(",").map(ip => ip.trim()) || [];
const knownBotUserAgents = [
    "node",
    "Bridgy Fed",
    "trendictionbot",
    "Twitterbot/1.0",
    "Mastodon",
    "Akkoma",
    "Misskey",
    "Iceshrimp.NET",
    "Catstodon"
];
const botRegexes = [/\W?Bot\W?/gmi];

const handleUnknownPath = async (req: Request, ip: string, userAgent: string) => {
    await logUnknownRequest(req, ip, userAgent);
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

const getArticleMetadata = (pathname: string): { title?: string, description?: string, image?: string } => {
    const dateId = path.basename(pathname);
    if (!/^\d{8}$/.test(dateId)) {
        return {};
    }

    const files = fs.readdirSync(articlesDir);
    const fileName = files.find(f => f.startsWith(dateId) && f.endsWith(".md") && !f.endsWith(".draft.md"));
    if (!fileName) {
        return {};
    }

    const content = fs.readFileSync(path.join(articlesDir, fileName), "utf-8");
    const lines = content.split("\n");
    let title: string | undefined;
    let description: string | undefined;
    let image: string | undefined;

    const h1 = lines.find(l => l.startsWith("# "));
    if (h1) {
        title = h1.replace("# ", "").trim();
    }

    const firstParagraph = lines.find(l => l.trim().length > 0 && !l.startsWith("#") && !l.startsWith("!["))?.trim();
    if (firstParagraph) {
        description = firstParagraph.length > 160 ? firstParagraph.substring(0, 157) + "..." : firstParagraph;
    }

    const firstImage = lines.find(l => l.trim().startsWith("!["));
    if (firstImage) {
        const match = firstImage.match(/!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
            image = match[1].split(" ")[0]; // Remove title if present
        }
    }

    return { title, description, image };
};

// Bun server handler
const server = serve({
    port: parseInt(process.env.PORT || "3000"),
    async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;

        const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent")?.trim() || "unknown";

        if (pathname === "/api/articles") {
            const files = fs.readdirSync(articlesDir);
            const articles = files
                .filter(f => f.endsWith(".md") && !f.endsWith(".draft.md"))
                .map(f => {
                    const name = f.replace(/\.md$/, "");
                    const dateMatch = name.match(/^(\d{8})\s*-\s*(.*)$/);
                    if (dateMatch) {
                        const dateStr = dateMatch[1];
                        const title = dateMatch[2];
                        const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
                        return {
                            id: dateStr,
                            name: title,
                            date: formattedDate
                        };
                    }
                    return null;
                })
                .filter(a => a !== null);
            return new Response(JSON.stringify(articles), {
                headers: { "Content-Type": "application/json" }
            });
        }

        if (pathname.startsWith("/api/article/")) {
            const dateId = path.basename(pathname);
            if (!/^\d{8}$/.test(dateId)) {
                return new Response("Invalid ID format", { status: 400 });
            }

            const files = fs.readdirSync(articlesDir);
            const fileName = files.find(f => f.startsWith(dateId) && f.endsWith(".md") && !f.endsWith(".draft.md"));

            if (fileName) {
                const filePath = path.join(articlesDir, fileName);
                return new Response(fs.readFileSync(filePath, "utf-8"), {
                    headers: { "Content-Type": "text/plain" }
                });
            } else {
                return new Response("Not Found", { status: 404 });
            }
        }

        if (pathname === "/requests-report") {
            const code = url.searchParams.get("code");
            if (code && code === process.env.CODE) {
                if (fs.existsSync(requestsCsvPath)) {
                    return new Response(fs.readFileSync(requestsCsvPath, "utf-8"), {
                        headers: { "Content-Type": "text/csv" }
                    });
                } else {
                    return new Response("No requests logged yet.", { status: 404 });
                }
            } else {
                return handleUnknownPath(req, ip, userAgent);
            }
        }

        const isBot = knownBotUserAgents.some(agent => userAgent.includes(agent) || userAgent === agent) || botRegexes.some(regex => regex.test(userAgent));
        const isHit = !req.url.includes("favicon") && !pathname.includes(".") && req.method === "GET" && !isBot;

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
        const isDynamicArticlePath = pathname.startsWith("/article/");
        if (!staticFileFound && !ALLOWED_PATHS.includes(pathname) && !isDynamicArticlePath) {
            return handleUnknownPath(req, ip, userAgent);
        }

        if (!isHit && !req.url.includes("img") && !ALLOWED_PATHS.includes(pathname) && !isDynamicArticlePath && !excludedIps.includes(ip)) {
            console.log(`->\t[${req.method}] ${req.url}\t${ip}\t${userAgent}`);
        }

        // Handle dynamic routes (fallback to baseHtml render)
        try {
            const hitsData = getHitsData();
            let title: string | undefined;
            let description: string | undefined;
            let image: string | undefined;

            if (isDynamicArticlePath) {
                const metadata = getArticleMetadata(pathname);
                title = metadata.title;
                description = metadata.description;
                image = metadata.image;
            }

            const html = await baseHtml(req, hitsData, title, description, image);
            if (isHit && !excludedIps.includes(ip) && !isDynamicArticlePath) {
                const count = (ipRequestCount[ip] || 0) + 1;
                if (count <= 10) {
                    addHit().then(() => console.log(`+HIT\t[${req.method}] ${req.url}\t${ip}\t${userAgent}\t(Hits: ${count})`));
                } else {
                    console.log(`NOHIT (limit reached)\t[${req.method}] ${req.url}\t${ip}\t${userAgent}`);
                }
                ipRequestCount[ip] = count;
            } else if (isHit && !excludedIps.includes(ip) && isDynamicArticlePath) {
                // For articles, we already identified it as a hit, but let's make sure we log it correctly
                // We don't want to double count, but server.ts structure is a bit messy with isHit
                const count = (ipRequestCount[ip] || 0) + 1;
                if (count <= 10) {
                    addHit().then(() => console.log(`+HIT (Article)\t[${req.method}] ${req.url}\t${ip}\t${userAgent}\t(Hits: ${count})`));
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