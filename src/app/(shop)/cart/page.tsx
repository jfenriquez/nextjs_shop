"use client";

import QuantitySelector from "@/components/product/QuantitySelector";
import { Title } from "@/components/ui/Title";

import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Product } from "../../../interfaces/product.interface";
import ProductInCart from "./ui/ProductInCart";
import OrderSummary from "./ui/OrderSummary";

const CartPage = () => {
  ///redirect("/emptyCart");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Carrito" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar más items</span>
            <Link href="/" className="underline mb-5">
              Continúa comprando
            </Link>

            {/* Items */}
            <ProductInCart />
          </div>

          {/* Checkout - Resumen de orden */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
