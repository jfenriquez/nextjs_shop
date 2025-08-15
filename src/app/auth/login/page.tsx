import Link from "next/link";
import React from "react";
import LoginForm from "./ui/LoginForm";

const LoginPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-base-100">
      <div className="w-full max-w-lg p-6 bg-base-200 rounded-box shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-base-content">
          Ingresar a tu cuenta
        </h1>

        <LoginForm />

        <div className="text-center mt-6 text-sm text-base-content/70">
          ¿No tienes una cuenta aún?{" "}
          <Link
            href="/auth/new-account"
            className="link link-primary font-medium"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
