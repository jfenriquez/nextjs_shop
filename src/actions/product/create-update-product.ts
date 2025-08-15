"use server";
import { gender, Product, sizes } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth.config";

cloudinary.config(process.env.CLOUDINARY_URL || "");

const productSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0, "Price must be a non-negative number")
    .transform((val) => parseFloat(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0, "Stock must be a non-negative number")
    .transform((val) => parseInt(val.toFixed(0))),
  sizes: z.string().transform((val) => {
    if (!val || val.trim() === "") return [];
    return val
      .split(",")
      .map((size) => size.trim().toUpperCase())
      .filter((size) => ["XS", "S", "M", "L", "XL", "XXL"].includes(size));
  }),
  tags: z.string(),
  gender: z.nativeEnum(gender),
  categoryId: z.string().min(1, "Category is required"),
});

export const createOrUpdateProduct = async (formData: FormData) => {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    return {
      ok: false,
      message: "Unauthorized access",
    };
  }
  const data = Object.fromEntries(formData);

  // Debug: ver qué datos llegan
  console.log("Datos recibidos:", data);

  const parsedData = productSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation failed:", parsedData.error);
    return {
      ok: false,
      message: "Datos inválidos. Verifica los campos del formulario.",
    };
  }

  const product = parsedData.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();

  const { id, ...rest } = product;
  let productSaved: Product;
  try {
    // Subir imágenes fuera de la transacción
    const imageFiles = formData.getAll("images") as File[];
    const validImageFiles = imageFiles.filter(
      (file) => file instanceof File && file.size > 0
    );

    const uploadedImages = await uploadImages(validImageFiles);

    // Guardar producto dentro de la transacción (sin imágenes)
    const prismaTX = await prisma.$transaction(async (tx) => {
      let product: Product;

      const tagsArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      const validSizes = rest.sizes.filter((size) =>
        ["XS", "S", "M", "L", "XL", "XXL"].includes(size)
      ) as sizes[];

      if (id) {
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: { set: validSizes },
            tags: { set: tagsArray },
          },
        });
      } else {
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: { set: validSizes },
            tags: { set: tagsArray },
          },
        });
      }

      return { product };
    });

    productSaved = prismaTX.product;

    // Guardar imágenes fuera de la transacción
    if (uploadedImages.length > 0) {
      await prisma.productImage.createMany({
        data: uploadedImages.map((url) => ({
          url: url!,
          productId: productSaved.id,
        })),
      });
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${productSaved.slug}`);
    revalidatePath(`/products/${productSaved.slug}`);

    return {
      ok: true,
      message: "Producto creado o actualizado correctamente",
      product: productSaved,
    };
  } catch (error) {
    console.error("Error completo:", error);
    return {
      ok: false,
      message: `Error al procesar: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`,
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((result) => result.secure_url);
      } catch (error) {
        console.log("Error uploading image:", error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages.filter((url) => url !== null);
  } catch (error) {
    console.log("Error in uploadImages:", error);
    return [];
  }
};
