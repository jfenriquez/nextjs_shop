"use server";

import { auth } from "@/auth.config";
import { sizes } from "@/generated/prisma";
import { Address } from "@/interfaces/addressInterface";
import prisma from "@/lib/prisma";

interface productToOrder {
  productId: string;
  quantity: number;
  size: string;
}

export async function placeOrderAction(
  productIds: productToOrder[],
  address: Address
) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("User not authenticated");
    }
    if (!productIds || !address) {
      throw new Error("Product IDs and address are required");
    }

    //////nota:podemos llevar 2+ productos con el mismo id
    ////traer productos
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds.map((item) => item.productId),
        },
      },
    });

    /////calcular monto
    const itemsInOrder = productIds.reduce((acc, item) => {
      const cantidad = (acc += item.quantity);
      return cantidad;
    }, 0);

    // Usamos reduce para recorrer productIds y acumular subtotal, impuesto y total
    const resumen = productIds.reduce(
      (totals, item) => {
        // 1. Obtenemos la cantidad del producto en el carrito
        const productQuantity = item.quantity;

        // 2. Buscamos el objeto completo del producto en el array `products`
        const product = products.find(
          (product) => product.id === item.productId
        );

        // 3. Si no se encuentra el producto, lanzamos un error para interrumpir el proceso
        if (!product) {
          throw new Error("Product not found");
        }

        // 4. Calculamos el subtotal para este ítem (precio unitario × cantidad)
        const itemSubtotal = product.price * productQuantity;

        // 5. Acumulamos en el acumulador:
        //    - totals.subtotal: suma de todos los subtotales sin IVA
        //    - totals.tax: suma de todos los impuestos (19% de cada subtotal)
        //    - totals.total: suma de subtotal + impuesto para cada ítem
        totals.subtotal += itemSubtotal;
        totals.tax += itemSubtotal * 0.19;
        totals.total += itemSubtotal + itemSubtotal * 0.19;

        // 6. Devolvemos el acumulador para la siguiente iteración
        return totals;
      },
      // Estado inicial del acumulador: empezamos con todo en cero
      { total: 0, subtotal: 0, tax: 0 }
    );

    // Al terminar, `resumen` contendrá un objeto con las tres propiedades:
    // { subtotal: X, tax: Y, total: Z }
    console.log(resumen);

    try {
      //////////////////////////CREAR TRANSACCION - ORDER-ORDERADDRESS-ORDERITEMS
      const prismaTx = await prisma.$transaction(async (tx) => {
        /////1.actualizar stock productos
        const updateProductsPromises = productIds.map((productMap) => {
          ////acumular valores de cantidad por producto
          const productQuantity = productIds
            .filter((p) => p.productId === productMap.productId)
            .reduce((acc, p) => acc + p.quantity, 0);

          if (productQuantity === 0) {
            throw new Error("Product quantity cannot be zero");
          }

          return tx.product.update({
            where: {
              id: productMap.productId,
            },
            data: {
              inStock: {
                decrement: productQuantity,
              },
            },
          });
        });
        const updateProducts = await Promise.all(updateProductsPromises);
        ////verificar valores negativos en stock]
        updateProducts.forEach((product) => {
          if (product.inStock < 0) {
            throw new Error(`Product ${product.title} is  out of stock`);
          }
        });

        //2. Crear la orden
        const orders = await tx.order.create({
          data: {
            userId: session.user.id,
            total: resumen.total,
            itemsInOrder: itemsInOrder,
            subTotal: resumen.subtotal,
            tax: resumen.tax,
            orderItems: {
              createMany: {
                data: productIds.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  size: item.size as sizes,
                  price: products.find(
                    (product) => product.id === item.productId
                  )?.price,
                })),
              },
            },
          },
        });

        // 3.Crear la dirección de envío
        const { country, ...restAddress } = address;
        const orderAddress = await tx.orderAddress.create({
          data: {
            ///...restAddress,
            firstName: address.firstName,
            lastName: address.lastName,
            address: address.address,
            address2: address.address2,
            postalCode: address.postalCode,
            city: address.city,
            phone: address.phone,

            orderId: orders.id,
            countryId: address.country,
          },
        });

        return {
          order: orders,
          orderAddress: orderAddress,
          updateProducts: updateProducts,
        };
      });

      return {
        ok: true,
        order: prismaTx.order,
        prismaTx: prismaTx,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  } catch (error) {
    console.log(error);
  }
}
