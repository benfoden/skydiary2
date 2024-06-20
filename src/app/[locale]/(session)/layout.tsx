import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/auth/signin");
  }
  return <div className="container mx-auto min-h-screen">{children}</div>;
}
