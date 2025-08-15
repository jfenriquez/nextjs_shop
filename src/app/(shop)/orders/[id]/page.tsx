import { Title } from "@/components/ui/Title";
import Image from "next/image";
import { getOrderByid } from "@/actions/order/get-order-by-id";
import PaypalButton from "@/components/paypal/PaypalButton";
import OrderStatus from "@/components/order/OrderStatus";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderByid(id);

  return (
    <section className="flex justify-center items-center mb-32 px-4 sm:px-8 lg:px-16">
      <div className="flex flex-col w-full max-w-6xl">
        <Title title={`Orden #${id.slice(12).toUpperCase()}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* 🛒 Productos */}
          <div className="flex flex-col gap-4">
            <OrderStatus isPaid={order.isPaid} />

            {order.orderItems.map((item) => (
              <div
                key={item.product.slug}
                className="flex bg-base-100 p-3 rounded-xl shadow-md items-center"
              >
                <Image
                  src={`${item.product.ProductImage[0].url}`}
                  width={100}
                  height={100}
                  alt={item.product.title}
                  className="rounded w-[100px] h-[100px] object-cover mr-4"
                />
                <div className="text-sm sm:text-base">
                  <p className="font-medium">
                    {item.product.title} - Talla {item.size}
                  </p>
                  <p className="text-base-content">
                    Precio: <span className="font-semibold">${item.price}</span>
                  </p>
                  <p className="text-base-content">Cantidad: {item.quantity}</p>
                  <p className="text-base-content">
                    Subtotal: ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 📦 Resumen de orden */}
          <div className="bg-base-200 rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-2 text-base-content">
              Dirección de entrega
            </h2>
            <div className="text-sm text-base-content mb-4 space-y-1">
              <p>
                {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
              </p>
              <p>{order.OrderAddress?.phone}</p>
              <p>{order.OrderAddress?.countryId}</p>
              <p>{order.OrderAddress?.city}</p>
              <p>{order.OrderAddress?.address}</p>
              <p>{order.OrderAddress?.postalCode}</p>
            </div>

            <div className="divider" />

            <h2 className="text-xl font-semibold mb-2 text-base-content">
              Resumen de orden
            </h2>

            <div className="text-sm grid grid-cols-2 gap-y-2 text-base-content">
              <span>No. Productos:</span>
              <span className="text-right">{order.itemsInOrder} artículos</span>

              <span>Subtotal:</span>
              <span className="text-right">${order.subTotal}</span>

              <span>Impuestos (19%):</span>
              <span className="text-right">${order.tax}</span>

              <span className="mt-3 text-base font-bold">Total:</span>
              <span className="mt-3 text-base font-bold text-right">
                ${order.total}
              </span>
            </div>

            {/* 🧾 Botón de pago */}
            {!order?.isPaid && (
              <div className="mt-6">
                <PaypalButton amount={order.total} orderId={order.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
