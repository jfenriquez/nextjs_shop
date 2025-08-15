import React from "react";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  isPaid: boolean;
}

const OrderStatus = ({ isPaid }: Props) => {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg shadow-md text-base-content ${
        isPaid
          ? "bg-success text-success-content"
          : "bg-error text-error-content"
      }`}
    >
      <IoCardOutline size={22} />
      <span className="font-semibold text-sm">
        {isPaid ? "Orden pagada" : "Pendiente de pago"}
      </span>
    </div>
  );
};

export default OrderStatus;
