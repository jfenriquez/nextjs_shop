import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  const storedToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!storedToken || storedToken.expires < new Date()) {
    return NextResponse.json(
      { error: "Token expirado o inválido" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { email: storedToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/verify-success`);
}
