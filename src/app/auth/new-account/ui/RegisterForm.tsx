"use client";

import { login } from "@/actions/auth/login";
import { registerUser } from "@/actions/auth/register";
import { ToastItem, ToastMessage } from "@/components/ui/ClientToastHandler";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IoInformationCircleOutline } from "react-icons/io5";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [error, setError] = useState("");

  const addToast = (toast: ToastItem) => {
    setToasts((prev) => [...prev, toast]);
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, name, password } = data;

    const res = await registerUser(name, email.toLowerCase(), password);
    console.log({ res });
    if (!res.ok) {
      addToast({
        type: "error",
        message: "Ocurrió un error al registrar",
      });
      setError(res.message);
      return;
    }
    if (res.ok) {
      const loginRes = await login(email.toLowerCase(), password);

      if (!loginRes.ok) {
        addToast({
          type: "error",
          message: "Ocurrió un error de login",
        });

        return;
      }
    }
    // ✅ Refresh del estado y redirección con Next.js App Router
    window.location.href = "/";
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <ToastMessage toasts={toasts} />

      <div className="form-control">
        <label htmlFor="name" className="label">
          <span className="label-text">Nombre de usuario</span>
        </label>
        <input
          id="name"
          type="text"
          className="input input-bordered"
          {...register("name", { required: true })}
          defaultValue="test"
          autoFocus
        />
        {errors.name && (
          <span className="text-error text-sm mt-1">
            * El nombre es obligatorio.
          </span>
        )}
      </div>

      <div className="form-control">
        <label htmlFor="email" className="label">
          <span className="label-text">Correo electrónico</span>
        </label>
        <input
          id="email"
          type="email"
          className="input input-bordered"
          {...register("email", { required: true })}
          defaultValue="test@gmail.com"
        />
        {errors.email && (
          <span className="text-error text-sm mt-1">
            * El correo es obligatorio.
          </span>
        )}
      </div>

      <div className="form-control">
        <label htmlFor="password" className="label">
          <span className="label-text">Contraseña</span>
        </label>
        <input
          id="password"
          type="password"
          className="input input-bordered"
          {...register("password", { required: true })}
          defaultValue="123456"
        />
        {errors.password && (
          <span className="text-error text-sm mt-1">
            * La contraseña es obligatoria.
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full flex justify-center items-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <span className="loading loading-spinner loading-sm"></span>
        )}
        {isSubmitting ? "Registrando..." : "Registrar"}
      </button>
    </form>
  );
};

export default RegisterForm;
