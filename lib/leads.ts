import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { Lead, LeadSource, LeadType } from "@/types";
import { MOCK_MODE } from "@/lib/config";
import { sendLeadNotificationEmail, sendCustomerConfirmationEmail } from "@/lib/email";
import { sendTelegramLeadAlert } from "@/lib/telegram";

// ----------------------------------------------------------------
// In MOCK_MODE, leads are persisted to a local JSON file so the
// admin dashboard has something real to display without a database.
// When MOCK_MODE=false, swap this module's implementation for
// Prisma calls against the `Lead` model in prisma/schema.prisma —
// the function signatures below are designed to map 1:1 onto it.
// ----------------------------------------------------------------

const DB_PATH = path.join(process.cwd(), "lib", "mock-store", "leads.json");

async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeLeads(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

export interface CreateLeadInput {
  type: LeadType;
  source: LeadSource;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project?: string;
  location?: string;
  message?: string;
  data: Record<string, unknown>;
  files?: string[];
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const lead: Lead = {
    id: nanoid(10),
    status: "NEW",
    notes: [],
    createdAt: new Date().toISOString(),
    ...input,
  };

  if (MOCK_MODE) {
    const leads = await readLeads();
    leads.unshift(lead);
    await writeLeads(leads);
  } else {
    // PRODUCTION MODE: replace with Prisma, e.g.
    // await prisma.lead.create({ data: { ...lead } });
    throw new Error(
      "MOCK_MODE=false requires a configured Prisma/Postgres connection — see prisma/schema.prisma"
    );
  }

  // Fire-and-forget notifications (mocked when MOCK_MODE=true)
  await Promise.allSettled([
    sendLeadNotificationEmail(lead),
    sendCustomerConfirmationEmail(lead),
    sendTelegramLeadAlert(lead),
  ]);

  return lead;
}

export async function getAllLeads(): Promise<Lead[]> {
  if (MOCK_MODE) {
    return readLeads();
  }
  throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  if (!MOCK_MODE) {
    throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  }
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  await writeLeads(leads);
  return lead;
}

export async function addLeadNote(id: string, text: string): Promise<Lead | null> {
  if (!MOCK_MODE) {
    throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  }
  const leads = await readLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.notes.push({ id: nanoid(6), text, createdAt: new Date().toISOString() });
  await writeLeads(leads);
  return lead;
}
