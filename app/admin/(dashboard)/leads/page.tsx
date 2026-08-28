import { getAllLeads } from "@/lib/leads";
import LeadTable from "@/components/LeadTable";

export default async function AdminLeadsPage() {
  const leads = await getAllLeads();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Leads</h1>
      <LeadTable initialLeads={leads} />
    </div>
  );
}
