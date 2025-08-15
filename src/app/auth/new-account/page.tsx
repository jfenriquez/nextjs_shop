import Link from "next/link";
import React from "react";
import RegisterForm from "./ui/RegisterForm";

const NewAccountPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-base-100 text-base-content transition-colors">
      <div className="w-full max-w-lg p-6 bg-base-200 rounded-box shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Crear cuenta
        </h1>

        <RegisterForm />

        <div className="divider text-base-content/60">o</div>

        <Link href="/auth/login" className="btn btn-secondary w-full">
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
};

export default NewAccountPage;
