"use client";

import { deleteUserAddress } from "@/actions/address/delete-user-address";
import { setUserAddress } from "@/actions/address/set-user-address";
import { Country } from "@/generated/prisma";
import { Address } from "@/interfaces/addressInterface";
import { useAddressStore } from "@/store/address/adressStore";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  countries: Country[] | [];
  userStoredAddress?: Partial<Address> | null | undefined;
}

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress?: boolean;
};

const FormAddress = ({ countries, userStoredAddress }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      ...userStoredAddress,
      rememberAddress: true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAddress = useAddressStore((state) => state.setAddress);
  const address = useAddressStore((state) => state.address);
  const hasHydrated = useAddressStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (address.firstName) {
      reset(address);
    }
  }, [hasHydrated]);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return "/";
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    const { rememberAddress, ...rest } = data;

    try {
      await setAddress(rest);
      if (rememberAddress) {
        await setUserAddress(rest, session!.user.id);
      } else {
        await deleteUserAddress(session!.user.id);
      }
      router.push("/checkout");
    } catch (error) {
      console.error("Error al enviar dirección:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (countries.length === 0)
    return <p className="text-center">Cargando países...</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {[
        { name: "firstName", label: "Nombres", required: true },
        { name: "lastName", label: "Apellidos", required: true },
        { name: "address", label: "Dirección", required: true },
        { name: "address2", label: "Dirección 2 (opcional)", required: false },
        { name: "postalCode", label: "Código postal", required: true },
        { name: "city", label: "Ciudad", required: true },
        { name: "phone", label: "Teléfono", required: true },
      ].map(({ name, label, required }) => (
        <div key={name} className="form-control w-full">
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register(name as keyof FormInputs, { required })}
          />
        </div>
      ))}

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">País</span>
        </label>
        <select
          className="select select-bordered w-full"
          {...register("country", { required: true })}
        >
          <option value="">[ Seleccione ]</option>
          {countries.map((country) => (
            <option key={country.id} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control mt-2 sm:col-span-2">
        <label className="cursor-pointer label gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register("rememberAddress")}
          />
          <span className="label-text">¿Recordar dirección?</span>
        </label>
      </div>

      <div className="form-control mt-4 sm:col-span-2">
        <button
          type="submit"
          className={`btn btn-primary w-full flex items-center justify-center gap-2 ${
            (!isValid || isSubmitting) && "btn-disabled"
          }`}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isSubmitting ? "Procesando..." : "Siguiente"}
        </button>
      </div>
    </form>
  );
};

export default FormAddress;
