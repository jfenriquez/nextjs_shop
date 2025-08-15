"use server";
import { auth } from "@/auth.config";
import { Role } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, newRole: Role) => {
  try {
    const session = await auth();

    if (session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: "Unauthorized access",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        ok: false,
        message: "User not found",
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/admin/users");
    return {
      ok: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error changing user role:", error);
    throw new Error("Failed to change user role");
  }
};
