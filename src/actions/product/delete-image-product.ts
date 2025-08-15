"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

export const deleteImageProduct = async (imageId: string, imageUrl: string) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return {
      ok: false,
      message: "Unauthorized access",
    };
  }

  if (!imageUrl.startsWith("http")) {
    return {
      ok: false,
      message: "Invalid image URL",
    };
  }

  const imageName = imageUrl.split("/").pop()?.split(".")[0] || "";
  try {
    // Assuming you have a Prisma model for ProductImage
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: { slug: true },
        },
      },
    });
    revalidatePath(`/admin/products/${deletedImage.product.slug}`);

    ////cloudinary delete
    const cloudinaryResponse = await cloudinary.uploader.destroy(imageName, {
      resource_type: "image",
    });
    // Optionally, you can also delete the image from Cloudinary if needed
    // await cloudinary.uploader.destroy(deletedImage.publicId);

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Error deleting product image:", error);
    return { success: false, message: "Failed to delete image" };
  }
};
