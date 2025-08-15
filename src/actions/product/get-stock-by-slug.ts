"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: {
        inStock: true,
      },
    });
    console.log(product?.inStock, "________________");
    if (!product) return null;

    return product?.inStock ?? 0;
  } catch (error) {
    throw new Error("error slug");
  }
};
