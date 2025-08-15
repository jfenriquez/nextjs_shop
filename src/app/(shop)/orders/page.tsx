export const revalidate = 0;

import { getOrdersByUserId } from "@/actions/order/get-orders-by-userId";
import { ToastItem, ToastMessage } from "@/components/ui/ClientToastHandler";
import { Title } from "@/components/ui/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { IoCardOutline } from "react-icons/io5";

const Page = async () => {
  const { ok, orders } = await getOrdersByUserId();

  const toastArray: ToastItem[] = [];

  if (!ok) {
    toastArray.push({
      type: "error",
      message: "Hubo un error al obtener tus órdenes",
    });
    redirect("/auth/login");
  }

  return (
    <section className="px-4 md:px-10 lg:px-20 py-6">
      <ToastMessage toasts={toastArray} />
      <Title title="Tus órdenes" />
      <div className="overflow-x-auto mt-6 rounded-box shadow-xl bg-base-100 p-4">
        <table className="table table-zebra table-sm md:table-md lg:table-lg">
          <thead className="bg-base-200 text-base-content text-sm uppercase tracking-wide">
            <tr>
              <th>#ID</th>
              <th>Nombre completo</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => (
              <tr key={order.id}>
                <td className="font-bold text-xs sm:text-sm">
                  {order.id.slice(12).toUpperCase()}
                </td>
                <td className="text-xs sm:text-sm">
                  {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                </td>
                <td className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <IoCardOutline
                      className={`text-lg ${
                        order.isPaid ? "text-success" : "text-error"
                      }`}
                    />
                    <span
                      className="badge text-xs border"
                      style={{
                        backgroundColor: `var(--color-${
                          order.isPaid ? "success" : "error"
                        })`,
                        color: `var(--color-${
                          order.isPaid ? "success-content" : "error-content"
                        })`,
                        borderColor: `var(--color-${
                          order.isPaid ? "success" : "error"
                        })`,
                      }}
                    >
                      {order.isPaid ? "Pagada" : "No pagada"}
                    </span>
                  </div>
                </td>
                <td>
                  <Link
                    href={`/orders/${order.id}`}
                    className="link link-hover text-sm"
                  >
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No tienes órdenes aún.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
