"use client";

import { useCartStore } from "@/store/cart/cart/cartStore";
import { currencyFormatAsync } from "@/utils/currencyFormats";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { IoReceiptOutline } from "react-icons/io5";

const OrderSummary = () => {
  const { subTotal, taxRate, total, totalItem } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );

  const [formattedSubTotal, setFormattedSubTotal] = useState("...");
  const [formattedTaxRate, setFormattedTaxRate] = useState("...");
  const [formattedTotal, setFormattedTotal] = useState("...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      currencyFormatAsync(subTotal),
      currencyFormatAsync(taxRate),
      currencyFormatAsync(total),
    ])
      .then(([sub, tax, tot]) => {
        setFormattedSubTotal(sub);
        setFormattedTaxRate(tax);
        setFormattedTotal(tot);
      })
      .catch((err) => {
        console.error("Error formateando precios:", err);
        setFormattedSubTotal(subTotal.toString());
        setFormattedTaxRate(taxRate.toString());
        setFormattedTotal(total.toString());
      })
      .finally(() => setIsLoading(false));
  }, [subTotal, taxRate, total]);

  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-xl shadow-lg p-7 flex justify-center items-center h-52">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-lg p-7 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <IoReceiptOutline className="text-3xl text-primary" />
        <h2 className="text-2xl font-semibold">Resumen de orden</h2>
      </div>

      <div className="grid grid-cols-2 gap-y-2 text-base-content">
        <span>No. Productos</span>
        <span className="text-right">
          {totalItem === 1 ? "1 artículo" : `${totalItem} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{formattedSubTotal}</span>

        <span>Impuestos (19%)</span>
        <span className="text-right">{formattedTaxRate}</span>

        <span className="mt-4 font-semibold text-xl">Total:</span>
        <span className="mt-4 text-right font-bold text-xl text-primary">
          {formattedTotal}
        </span>
      </div>

      <div className="mt-6 w-full">
        <Link
          href="/checkout/address"
          className="btn btn-primary btn-block text-white"
        >
          Ir al Checkout
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
