"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import React from "react";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { setTransactionId } from "@/actions/order/payments/set-transaction-id";
import { paypalCheckPayment } from "@/actions/order/payments/paypal-check-payment";

interface Props {
  orderId: string;
  amount: number;
}

const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="space-y-3 mb-10 animate-pulse" aria-busy="true">
        <div className="h-11 bg-base-300 rounded-xl"></div>
        <div className="h-11 bg-base-300 rounded-xl"></div>
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: "USD",
            value: roundedAmount.toString(),
          },
        },
      ],
    });

    const { ok } = await setTransactionId(orderId, transactionId);
    if (!ok) {
      console.error("Error saving transaction ID");
      throw new Error("Error saving transaction ID");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details || !details.id) {
      console.error("No details or ID returned from PayPal");
      return;
    }

    await paypalCheckPayment(details.id);
  };

  return (
    <div className="mb-10">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={{ layout: "vertical" }}
      />
    </div>
  );
};

export default PaypalButton;
