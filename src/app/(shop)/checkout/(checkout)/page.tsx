import { Title } from "@/components/ui/Title";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcDeleteDatabase } from "react-icons/fc";
import ProductsInCart from "./ui/productsInCart";
import PlaceOrder from "./ui/PlaceOrder";

const CheckoutPage = () => {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="VERIFICAR ORDEN" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar más items</span>
            <Link href="/cart" className="underline mb-5">
              editar carrito
            </Link>

            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Checkout - Resumen de orden */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
