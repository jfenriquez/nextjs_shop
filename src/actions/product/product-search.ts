"use server";

import prisma from "@/lib/prisma";

export const productSearch = async (name: string) => {
  try {
    const res = await prisma.product.findMany({
      where: {
        title: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
    });
    return {
      products: res.map((product) => ({
        ...product,
        images: product.ProductImage?.map((image) => image.url) ?? [],
      })),
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Error searching products");
  }
};
