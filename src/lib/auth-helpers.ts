import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/mongo";

export async function requireUserId() {
  const s = await getServerSession(authOptions);
  if (!s?.user?.email) throw new Error("Unauthorized");

  const idFromSession = (s as any).user?.id as string | undefined;
  if (idFromSession) return idFromSession;

  const dbo = await db();
  const u = await dbo.collection("users").findOne({ email: s.user.email });
  if (!u) throw new Error("Unauthorized");
  return u._id.toString();
}
