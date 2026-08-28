import { getAllLeads } from "@/lib/leads";
import { getProducts } from "@/lib/store/products";
import { getAllProjects } from "@/lib/data/all-projects";

export default async function AdminOverviewPage() {
  const [leads, products, projects] = await Promise.all([getAllLeads(), getProducts(), getAllProjects()]);

  const counts = {
    total: leads.length,
    quote: leads.filter((l) => l.type === "Quote Request").length,
    sample: leads.filter((l) => l.type === "Sample Request").length,
    upload: leads.filter((l) => l.type === "Project Upload").length,
    appointment: leads.filter((l) => l.type === "Estimate Appointment").length,
    new: leads.filter((l) => l.status === "NEW").length,
  };

  const cards = [
    { label: "New Leads", value: counts.new },
    { label: "Total Leads", value: counts.total },
    { label: "Quote Requests", value: counts.quote },
    { label: "Sample Requests", value: counts.sample },
    { label: "Project Uploads", value: counts.upload },
    { label: "Appointments", value: counts.appointment },
    { label: "Products", value: products.length },
    { label: "Projects", value: projects.length },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-warmgray/15 p-6">
            <p className="text-xs uppercase tracking-wide text-warmgray mb-2">{c.label}</p>
            <p className="font-serif text-3xl">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-serif text-xl mb-4">Recent Leads</h2>
      <div className="bg-white border border-warmgray/15 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-warmgray/15 text-left text-xs uppercase tracking-wide text-warmgray">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 8).map((l) => (
              <tr key={l.id} className="border-b border-warmgray/10">
                <td className="p-3">{l.name}</td>
                <td className="p-3">{l.type}</td>
                <td className="p-3">{l.source}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3 text-warmgray">{new Date(l.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-warmgray">No leads yet — submissions from the site will appear here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
