import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardAgenceLayoutClient from "./DashboardAgenceLayoutClient";

export default async function DashboardAgenceLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "AGENCE") redirect("/login");

  return (
    <DashboardAgenceLayoutClient session={session}>
      {children}
    </DashboardAgenceLayoutClient>
  );
}