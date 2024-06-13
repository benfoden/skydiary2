import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export async function GET() {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/auth/signin");
  }
  if (session.user.name) {
    return redirect("/home");
  }
  if (!session.user.name) {
    return redirect("/auth/new-user");
  }
}
