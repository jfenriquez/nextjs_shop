"use server";

import prisma from "@/lib/prisma";

export const deleteProduct = async (id: string) => {
  try {
    const response = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    return {
      ok: true,
      response,
    };
  } catch (error) {
    return {
      ok: false,
      error: (error as Error).message || "Error deleting product",
    };
  }
};
