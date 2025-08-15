"use client";

import { placeOrderAction } from "@/actions/order/place-order";
import { useAddressStore } from "@/store/address/adressStore";
import { useCartStore } from "@/store/cart/cart/cartStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const { subTotal, taxRate, total, totalItem } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p className="text-center py-6">Cargando resumen...</p>;

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productToOrder = cart.map((item) => ({
      productId: item.id,
      size: item.size,
      quantity: item.quantity,
    }));

    const res = await placeOrderAction(productToOrder, address);
    if (!res?.ok) {
      setIsPlacingOrder(false);
      alert(res?.message || "Error al crear la orden");
      return;
    }

    useCartStore.getState().cleanCart();
    router.replace("/orders/" + res.order?.id);
  };

  return (
    <div className="bg-base-200 rounded-box shadow-lg p-6 h-fit">
      <h2 className="text-xl font-semibold mb-2 text-base-content">
        Dirección de entrega
      </h2>
      <div className="text-sm text-base-content mb-4 space-y-1">
        <p>
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.postalCode}</p>
        <p>
          {address.city} - {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div className="divider" />

      <h2 className="text-xl font-semibold mb-2 text-base-content">
        Resumen de orden
      </h2>

      <div className="grid grid-cols-2 gap-y-2 text-sm text-base-content">
        <span>No. Productos:</span>
        <span className="text-right">{totalItem}</span>

        <span>Subtotal:</span>
        <span className="text-right">${subTotal}</span>

        <span>Impuestos (19%):</span>
        <span className="text-right">${taxRate}</span>

        <span className="mt-3 font-bold text-base">Total:</span>
        <span className="mt-3 font-bold text-base text-right">${total}</span>
      </div>

      <div className="mt-6">
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className={`btn btn-primary w-full flex justify-center items-center gap-2 ${
            isPlacingOrder && "btn-disabled"
          }`}
        >
          {isPlacingOrder && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isPlacingOrder ? "Procesando..." : "Realizar pedido"}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
