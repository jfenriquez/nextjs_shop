"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      emailVerified: null, // 🚨 aún no verificado
    },
  });

  // Generar token único
  const token = uuidv4();

  await prisma.verificationToken.create({
    data: {
      identifier: user.email,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  // Configurar transporte para enviar email
  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Verifica tu correo electrónico",
    html: `
    <p>Haz click en el siguiente enlace para verificar tu correo:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `,
  });

  return {
    ok: true,
    message: "Usuario registrado. Revisa tu correo para verificar tu cuenta.",
  };
};

/* "use server";

import { signIn } from "@/auth.config";
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
        name,
        email,
        password: bcryptjs.hashSync(password),
        emailVerified: null, // 👈 aún no verificado
      },
    });

    // 🔹 Dispara el correo de verificación
    await signIn("email", {
      email: user.email!,
      callbackUrl: "/auth/verify-request", // 👈 aquí va callbackUrl
      redirect: false,
    });

    return {
      ok: true,
      message: "Cuenta creada, revisa tu correo para verificarla.",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Something went wrong: " + error,
    };
  }
}
 */
