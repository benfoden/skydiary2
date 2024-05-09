import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}
