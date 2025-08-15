import { getPaginatedOrders } from "@/actions/order/get-paginated-orders";
import { ToastItem, ToastMessage } from "@/components/ui/ClientToastHandler";
import { Title } from "@/components/ui/Title";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

export const revalidate = 0;

const page = async () => {
  const { ok, orders } = await getPaginatedOrders();
  const toastArray: ToastItem[] = [];

  if (!ok) {
    toastArray.push({
      type: "error",
      message: "Hubo un error al obtener las órdenes",
    });
    redirect("/auth/login");
  }

  return (
    <>
      <Title title="Todas las Órdenes" />
      <ToastMessage toasts={toastArray} />

      <div className="overflow-x-auto mt-6 animate-fade-in-up">
        <table className="table table-zebra rounded-xl shadow-md">
          <thead className="bg-base-300 text-base-content">
            <tr>
              <th>#ID</th>
              <th>Nombre completo</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-base-200 transition duration-300"
              >
                <td className="font-semibold">
                  {order.id.slice(12).toUpperCase()}
                </td>
                <td>
                  {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                </td>
                <td className="flex items-center gap-2">
                  <IoCardOutline
                    className={`text-lg ${
                      order.isPaid ? "text-success" : "text-error"
                    }`}
                  />
                  <span
                    className={`badge ${
                      order.isPaid ? "badge-success" : "badge-error"
                    }`}
                  >
                    {order.isPaid ? "Pagada" : "No Pagada"}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/orders/${order.id}`}
                    className="btn btn-sm btn-accent btn-outline"
                  >
                    Ver orden
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default page;
