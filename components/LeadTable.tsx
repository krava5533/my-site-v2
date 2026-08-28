"use client";

import React, { useMemo, useState } from "react";
import { Lead, LeadStatus } from "@/types";

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "QUOTING", "WON", "LOST"];

export default function LeadTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (query && !`${l.name} ${l.email} ${l.company ?? ""}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [leads, statusFilter, query]);

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function addNote(id: string) {
    if (!noteDraft.trim()) return;
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteDraft }),
    });
    const json = await res.json();
    if (json.lead) {
      setLeads((prev) => prev.map((l) => (l.id === id ? json.lead : l)));
    }
    setNoteDraft("");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search leads..."
          className="form-input sm:max-w-xs"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input sm:max-w-xs">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-warmgray/15 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-warmgray/15 text-left text-xs uppercase tracking-wide text-warmgray">
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <React.Fragment key={l.id}>
                <tr className="border-b border-warmgray/10 align-top">
                  <td className="p-3">
                    <p className="font-medium">{l.name}</p>
                    {l.company && <p className="text-xs text-warmgray">{l.company}</p>}
                  </td>
                  <td className="p-3 text-xs text-warmgray">
                    <p>{l.email}</p>
                    <p>{l.phone}</p>
                  </td>
                  <td className="p-3">{l.type}</td>
                  <td className="p-3">{l.source}</td>
                  <td className="p-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                      className="text-xs border border-warmgray/30 px-2 py-1"
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-warmgray text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                      className="text-xs text-accent underline"
                    >
                      {expanded === l.id ? "Close" : "Details"}
                    </button>
                  </td>
                </tr>
                {expanded === l.id && (
                  <tr className="border-b border-warmgray/10 bg-stonebeige/15">
                    <td colSpan={7} className="p-4">
                      <p className="text-sm mb-3"><strong>Message:</strong> {l.message || "—"}</p>
                      {l.files && l.files.length > 0 && (
                        <p className="text-sm mb-3">
                          <strong>Files:</strong>{" "}
                          {l.files.map((f, i) => (
                            <a key={i} href={f} className="text-accent underline mr-2">File {i + 1}</a>
                          ))}
                        </p>
                      )}
                      <div className="mb-3">
                        <strong className="text-sm">Notes:</strong>
                        <ul className="text-xs text-warmgray mt-1 space-y-1">
                          {l.notes.map((n) => (
                            <li key={n.id}>{n.text} <span className="opacity-60">— {new Date(n.createdAt).toLocaleString()}</span></li>
                          ))}
                          {l.notes.length === 0 && <li>No notes yet.</li>}
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Add a note..."
                          className="form-input flex-1"
                        />
                        <button onClick={() => addNote(l.id)} className="btn-secondary !py-2 !px-4 text-xs">Add</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-warmgray">No leads match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
