import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { AgentChannel } from "@/lib/ai-agent";

export interface AgentLogEntry {
  id: string;
  channel: AgentChannel;
  fromName?: string;
  fromContact?: string; // phone number, telegram chat id, or email address
  incomingMessage: string;
  reply: string | null;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "storage", "mock-store", "agent-log.json");

async function readAll(): Promise<AgentLogEntry[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as AgentLogEntry[];
  } catch {
    return [];
  }
}

async function writeAll(items: AgentLogEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function getAgentLog(): Promise<AgentLogEntry[]> {
  return readAll();
}

export async function logAgentInteraction(entry: Omit<AgentLogEntry, "id" | "createdAt">): Promise<AgentLogEntry> {
  const items = await readAll();
  const record: AgentLogEntry = { id: nanoid(10), createdAt: new Date().toISOString(), ...entry };
  items.unshift(record);
  // Keep the log from growing unbounded in mock mode
  await writeAll(items.slice(0, 500));
  return record;
}
