import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";

const EmptyPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-base-100 p-6 rounded-box shadow-inner text-base-content">
      <FiShoppingCart className="text-6xl text-base-content/40 mb-4" />

      <h2 className="text-2xl font-bold mb-2 text-center">
        Tu carrito está vacío
      </h2>

      <p className="text-base text-base-content/60 mb-6 text-center">
        Agrega productos para verlos aquí.
      </p>

      <Link href="/">
        <button className="btn btn-primary">Ir a la tienda</button>
      </Link>
    </div>
  );
};

export default EmptyPage;
