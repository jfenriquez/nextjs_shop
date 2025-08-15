"use server";

import prisma from "@/lib/prisma";
import { ProductImage } from "../../generated/prisma/index";
import { auth } from "@/auth.config";

export const getOrderByid = async (id: string) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized access");
    }
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        OrderAddress: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,
            ////tbl product
            product: {
              select: {
                title: true,
                slug: true,
                ////tbl imagen]
                ProductImage: {
                  select: { url: true },
                  orderBy: { id: "asc" }, // o por fecha, por ejemplo createdAt
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    ////if session user
    if (session.user.role === "USER") {
      if (order.userId !== session.user.id) {
        throw new Error("You do not have permission to view this order");
      }
    }

    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order");
  }
};
