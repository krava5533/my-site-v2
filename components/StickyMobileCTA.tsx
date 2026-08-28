import Link from "next/link";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-warmwhite border-t border-warmgray/20 p-3 flex gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <Link href="/showroom" className="btn-secondary flex-1 !py-3 text-xs">
        Free Estimate
      </Link>
      <Link href="/request-quote" className="btn-primary flex-1 !py-3 text-xs">
        Request a Quote
      </Link>
    </div>
  );
}
