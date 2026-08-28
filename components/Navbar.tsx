"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import SearchOverlay from "@/components/SearchOverlay";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal text-warmwhite text-center text-xs tracking-wide py-2 px-4">
        Free on-site estimates available &mdash;{" "}
        <Link href="/showroom" className="underline underline-offset-2 hover:text-accent">
          book a free estimate
        </Link>
      </div>

      <header
        className={`sticky top-0 z-40 w-full bg-warmwhite/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container-lux flex items-center justify-between h-20">
          <Link href="/" className="font-serif text-xl md:text-2xl tracking-tight text-charcoal">
            LuxeStone <span className="text-accent">Interiors</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {siteConfig.nav.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-charcoal/80 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-charcoal hover:text-accent transition-colors"
            >
              <Search size={20} />
            </button>
            <Link href="/request-quote" className="hidden md:inline-flex btn-primary">
              Request a Quote
            </Link>
            <button
              aria-label="Menu"
              className="lg:hidden p-2 text-charcoal"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-warmwhite flex flex-col">
          <div className="container-lux flex items-center justify-between h-20 border-b border-warmgray/20">
            <span className="font-serif text-xl">LuxeStone Interiors</span>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-6 overflow-y-auto">
            {siteConfig.nav.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 border-b border-warmgray/15 text-lg font-serif text-charcoal"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-6 mt-auto">
            <Link href="/request-quote" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>
              Request a Quote
            </Link>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
