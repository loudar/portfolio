import * as fs from "node:fs";
import { writeFile, appendFile } from "node:fs/promises";
import * as path from "path";

const isDev = !fs.existsSync("/portfolio");
const baseDir = isDev ? process.cwd() : "/portfolio";
const hitsTxtPath = path.join(baseDir, "hits.txt");
export const requestsCsvPath = path.join(baseDir, "requests.csv");

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

export async function logUnknownRequest(req: Request, ip: string, userAgent: string) {
    const url = new URL(req.url);
    const timestamp = new Date().toISOString();
    const path = url.pathname;
    const method = req.method;

    const header = "timestamp,ip,path,method,user_agent,count\n";
    
    let entries: string[][] = [];
    if (fs.existsSync(requestsCsvPath)) {
        const content = fs.readFileSync(requestsCsvPath, "utf-8");
        entries = content.split("\n")
            .filter(line => line.trim() !== "")
            .slice(1) // skip header
            .map(line => {
                // Simple CSV parser for quoted values
                const parts = [];
                let current = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === ',' && !inQuotes) {
                        parts.push(current);
                        current = "";
                    } else {
                        current += char;
                    }
                }
                parts.push(current);
                return parts;
            });
    }

    let found = false;
    for (const entry of entries) {
        // entry: [timestamp, ip, path, method, user_agent, count]
        if (entry[1] === ip && entry[2] === path && entry[3] === method && entry[4] === userAgent) {
            const currentCount = parseInt(entry[5] || "1");
            entry[5] = (currentCount + 1).toString();
            entry[0] = timestamp;
            found = true;
            break;
        }
    }

    if (!found) {
        entries.push([timestamp, ip, path, method, userAgent, "1"]);
    }

    const newContent = header + entries.map(entry => 
        entry.map(field => `"${field}"`).join(",")
    ).join("\n") + "\n";

    await writeFile(requestsCsvPath, newContent);
    console.warn(`Unknown path request logged: "${timestamp}","${ip}","${path}","${method}","${userAgent}"`);
}
