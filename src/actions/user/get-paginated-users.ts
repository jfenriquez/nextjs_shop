"use server";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return {
      ok: false,
      message: "Unauthorized access",
    };
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,

      role: true,
    },
  });

  return {
    ok: true,
    users: users,
  };
};
