"use server";

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        ProductImage: true /* {
          select: {
            url: true,
            id: true,
          },
        }, */,
      },
    });

    if (!product) return null;
    const { ...rest } = product;
    return {
      ...rest,
      images: product.ProductImage.map((image) => image.url), ////images:['img1.png','img2.png']
    };
  } catch (error) {
    throw new Error("error slug");
  }
};
