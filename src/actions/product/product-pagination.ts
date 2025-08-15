"use server";

import prisma from "@/lib/prisma";
import { gender as Gender } from "@/generated/prisma/client";
interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(Number(page)) || isNaN(Number(take))) {
    page = 1;
    take = 12;
  }
  if (page < 1) {
    page = 1;
  }

  try {
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },

      //! Por género
      where: {
        gender: !gender ? undefined : gender,
      },
    });
    const totalCount = await prisma.product.count({
      //! Por género
      where: {
        gender: !gender ? undefined : gender,
      },
    });
    const totalPages = Math.ceil(totalCount / take);

    //console.log(products);
    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage?.map((image) => image.url) ?? [],
      })),
    };
  } catch (error) {
    throw new Error("Error fetching products with images:" + error);
    //return { products: [] };
  }
};
