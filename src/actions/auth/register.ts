"use server";

import { signOut } from "@/auth.config";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: bcryptjs.hashSync(password),
      },
    });
    return {
      ok: true,
      message: "User created successfully",
      user: user,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Something went wrong" + error,
    };
  }
}
