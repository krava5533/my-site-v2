import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Settings</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        This contact info and these social links appear across the site — in the footer, the
        Contact page, the Get an Estimate page, and search engine data.
      </p>
      <SettingsForm initial={settings} />
    </div>
  );
}
