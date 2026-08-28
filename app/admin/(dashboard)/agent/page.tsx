import { getAgentLog } from "@/lib/agent-log";

const CHANNEL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  sms: "SMS",
  email: "Email",
};

export default async function AdminAgentPage() {
  const log = await getAgentLog();
  const aiConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">AI Agent</h1>
      <p className="text-sm text-warmgray mb-6 max-w-2xl">
        Every message the AI agent receives and replies to across Telegram, SMS, and email
        shows up here — review it regularly, especially early on.
      </p>

      {!aiConfigured && (
        <div className="bg-stonebeige/30 text-charcoal text-sm p-4 mb-8 max-w-2xl">
          <strong>ANTHROPIC_API_KEY is not set.</strong> The agent webhooks are live and will
          log incoming messages, but replies will use a generic fallback message instead of a
          real AI-drafted reply until you add a key to <code>.env.local</code>. See the README
          for full setup instructions per channel (Telegram, Twilio SMS, email).
        </div>
      )}

      <div className="bg-white border border-warmgray/15 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-warmgray/15 text-left text-xs uppercase tracking-wide text-warmgray">
              <th className="p-3">Channel</th>
              <th className="p-3">From</th>
              <th className="p-3">Message</th>
              <th className="p-3">AI Reply</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {log.map((entry) => (
              <tr key={entry.id} className="border-b border-warmgray/10 align-top">
                <td className="p-3">{CHANNEL_LABELS[entry.channel] || entry.channel}</td>
                <td className="p-3 text-warmgray">{entry.fromName || entry.fromContact || "—"}</td>
                <td className="p-3 max-w-xs">{entry.incomingMessage}</td>
                <td className="p-3 max-w-xs">{entry.reply || <span className="text-warmgray">No reply sent</span>}</td>
                <td className="p-3 text-warmgray whitespace-nowrap">{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {log.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-warmgray">No agent conversations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
