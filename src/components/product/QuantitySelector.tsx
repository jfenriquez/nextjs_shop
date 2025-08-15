"use client";

import React from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onChangeQuantity: (value: number) => void;
}

const QuantitySelector = ({ quantity, onChangeQuantity }: Props) => {
  const onValueChange = (value: number) => {
    if (quantity + value < 1) return;
    onChangeQuantity(quantity + value);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Botón - */}
      <button
        onClick={() => onValueChange(-1)}
        className="btn btn-outline btn-circle btn-sm"
        aria-label="Disminuir cantidad"
      >
        <IoRemoveCircleOutline size={20} />
      </button>

      {/* Cantidad actual */}
      <span className="px-5 py-2 bg-base-200 rounded-lg text-center w-16 text-base-content font-semibold select-none">
        {quantity}
      </span>

      {/* Botón + */}
      <button
        onClick={() => onValueChange(1)}
        className="btn btn-outline btn-circle btn-sm"
        aria-label="Aumentar cantidad"
      >
        <IoAddCircleOutline size={20} />
      </button>
    </div>
  );
};

export default QuantitySelector;
