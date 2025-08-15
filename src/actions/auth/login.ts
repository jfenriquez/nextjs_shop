"use server";
import { signIn } from "@/auth.config";
import { revalidatePath } from "next/cache";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log(Object);
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    });
    return "success";
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "type" in error &&
      (error as { type?: string }).type === "CredentialsSignin"
    ) {
      return "invalid credentials";
    }

    return "error signing";
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    revalidatePath(`/perfil`);
    return { ok: true };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, message: "Unexpected error during login" };
  }
};
