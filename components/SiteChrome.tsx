"use client";

import { usePathname } from "next/navigation";

export default function SiteChrome({
  navbar,
  footer,
  sticky,
  projectCta,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  sticky: React.ReactNode;
  projectCta: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
      {sticky}
      {projectCta}
    </>
  );
}
