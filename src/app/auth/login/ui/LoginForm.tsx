"use client";

import { authenticate } from "@/actions/auth/login";
import { ToastItem, ToastMessage } from "@/components/ui/ClientToastHandler";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";
import { IoInformationOutline } from "react-icons/io5";

const LoginForm = () => {
  const toastArray: ToastItem[] = [];
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  useEffect(() => {
    if (errorMessage === "success") {
      window.location.replace("/");
    }
  }, [errorMessage]);

  if (errorMessage && errorMessage !== "success") {
    toastArray.push({
      type: "error",
      message: errorMessage,
    });
  }
  return (
    <form
      action={formAction}
      className="w-full max-w-md mx-auto bg-base-100 rounded-box shadow-lg p-6 flex flex-col gap-4"
    >
      <ToastMessage toasts={toastArray} />
      <h2 className="text-xl font-bold text-center text-base-content">
        Iniciar sesión
      </h2>

      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">Correo electrónico</span>
        </label>
        <input
          name="email"
          id="email"
          className="input input-bordered"
          type="email"
          required
          defaultValue="test@gmail.com"
        />
      </div>

      <div className="form-control">
        <label htmlFor="password" className="label">
          <span className="label-text">Contraseña</span>
        </label>
        <input
          name="password"
          id="password"
          className="input input-bordered"
          type="password"
          required
          defaultValue="123456"
        />
      </div>

      <button
        type="submit"
        className={`btn btn-primary w-full ${
          isPending && "btn-disabled"
        } flex items-center justify-center gap-2`}
        disabled={isPending}
      >
        {isPending && (
          <span className="loading loading-spinner loading-sm"></span>
        )}
        {isPending ? "Verificando..." : "Ingresar"}
      </button>

      <div className="divider">o</div>

      <Link href="/auth/new-account" className="btn btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

export default LoginForm;
