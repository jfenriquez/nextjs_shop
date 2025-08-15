import { Title } from "@/components/ui/Title";
import Link from "next/link";
import React from "react";
import FormAddress from "./ui/FormAddress";
import { getCountries } from "@/actions/country/get-countries";
import { auth } from "@/auth.config";

import { getUserAddress } from "@/actions/address/get-user-address";

const page = async () => {
  const countries = await getCountries();
  const session = await auth();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Acceso no autorizado</h1>
        <p className="mb-4">Por favor, inicia sesión para continuar.</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }
  const UserAddress = await getUserAddress(session.user.id);
  console.log("UserAddress", UserAddress);
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <FormAddress
          countries={countries}
          userStoredAddress={{
            ...UserAddress,
            country: UserAddress?.country ?? undefined,
          }}
        />
      </div>
    </div>
  );
};

export default page;
