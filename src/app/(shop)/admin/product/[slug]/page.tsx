import { getProductBySlug } from "@/actions/product/get-product-by-slug";
import { Title } from "@/components/ui/Title";
import { redirect } from "next/navigation";

import React from "react";
import { ProductForm } from "./ui/ProductForm";

import { getCategories } from "@/actions/category/get-categories";
import { auth } from "@/auth.config";

interface Props {
  params: Promise<{ slug: string }>; // obligatorio
  searchParams: Promise<{ page?: string }>;
}

const ProductPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  await searchParams; // no-op, pero satisface el tipo
  console.log(slug);

  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }

  const title = (
    slug === "new" ? "Crear Producto" : `Editar Producto: ${product?.title}`
  ) as string;

  const categories = await getCategories();
  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
};

export default ProductPage;
