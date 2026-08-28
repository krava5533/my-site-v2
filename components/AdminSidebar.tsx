"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, FolderKanban, Layers, BookImage, Images, Users, LogOut, MessageSquareQuote, Settings, Bot,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/agent", label: "AI Agent", icon: Bot },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/materials", label: "Materials", icon: Images },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/inspiration", label: "Inspiration", icon: BookImage },
  { href: "/admin/testimonials", label: "Reviews", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-charcoal text-warmwhite min-h-screen flex flex-col">
      <div className="p-6 border-b border-warmwhite/10">
        <p className="font-serif text-xl">LuxeStone</p>
        <p className="text-xs text-warmwhite/50">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                active ? "bg-warmwhite/10 text-warmwhite" : "text-warmwhite/70 hover:bg-warmwhite/5"
              }`}
            >
              <Icon size={16} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-warmwhite/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-warmwhite/70 hover:text-warmwhite w-full"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
