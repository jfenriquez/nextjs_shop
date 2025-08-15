"use server";

import { PaypalOrderStatusResponse } from "@/interfaces/paypalInterface";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const token = await getPaypalBearerToken();
  console.log(token);

  if (!token) {
    console.error("Failed to retrieve PayPal bearer token");
    return;
  }
  const resp = await verifyPaypalCheckPayment(paypalTransactionId, token);
  if (!resp) {
    console.error("Failed to verify PayPal payment");
    return;
  }
  const { status, purchase_units } = resp;

  if (status !== "COMPLETED") {
    console.error("Payment not completed:", status);
    return;
  }

  ////orderId
  const purchaseUnit = purchase_units[0];

  try {
    const updateOrder = await prisma.order.update({
      where: { id: purchaseUnit.invoice_id },
      data: { isPaid: true, paidAt: new Date() },
    });
    console.log("Order updated successfully:", updateOrder);
    revalidatePath("/orders/" + purchaseUnit.invoice_id);
    return {
      ok: true,
      message: "Order updated successfully",
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      ok: false,
      message: "Error updating order",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | undefined> => {
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? "";
  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8" // Use 'utf-8' encoding to ensure proper encoding of the string
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const result = await fetch(PAYPAL_OAUTH_URL, requestOptions).then(
      (response) => response.json()
    );

    return result.access_token;
  } catch (error) {
    console.error("Error in getPaypalBearerToken:", error);
  }
};

const verifyPaypalCheckPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | undefined> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken} `);
  const PAYPAL_ORDERS_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    return await fetch(PAYPAL_ORDERS_URL, {
      ...requestOptions,
      cache: "no-cache",
    }).then((r) => r.json());
  } catch (error) {
    console.error("Error in verifyPaypalCheckPayment:", error);
  }
};
