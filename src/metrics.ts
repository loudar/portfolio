import * as fs from "node:fs";
import { writeFile, appendFile } from "node:fs/promises";
import * as path from "path";

const isDev = !fs.existsSync("/portfolio");
const hitsTxtPath = isDev ? path.join(process.cwd(), "hits.txt") : "/portfolio/hits.txt";

if (!fs.existsSync(hitsTxtPath)) {
    fs.writeFileSync(hitsTxtPath, "");
}

export function getHitsData(): Record<string, number> {
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

export function saveHitsData(data: Record<string, number>) {
    const lines = Object.entries(data)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => `${date};${count}`);
    fs.writeFileSync(hitsTxtPath, lines.join("\n"));
}

export async function addHit() {
    const today = new Date().toISOString().split("T")[0];
    const data = getHitsData();
    data[today] = (data[today] || 0) + 1;
    saveHitsData(data);
}

export async function logUnknownRequest(req: Request, ip: string) {
    const url = new URL(req.url);
    const timestamp = new Date().toISOString();
    const path = url.pathname;
    const method = req.method;
    const userAgent = req.headers.get("user-agent") || "unknown";

    const baseLine = `"${timestamp}","${ip}","${path}","${method}","${userAgent}"`;
    const logEntry = `${baseLine}\n`;
    const logFilePath = "requests.csv";

    console.warn(`Unknown path request: ${baseLine}`);
    if (!fs.existsSync(logFilePath)) {
        await writeFile(logFilePath, "timestamp,ip,path,method,user_agent\n");
    }
    await appendFile(logFilePath, logEntry);
}
