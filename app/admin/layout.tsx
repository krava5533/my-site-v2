import AdminSessionProvider from "@/components/AdminSessionProvider";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
