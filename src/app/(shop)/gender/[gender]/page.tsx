import { redirect } from "next/navigation";

import ProductsGrid from "@/components/products/ProductsGrid";
import { Title } from "@/components/ui/Title";
import { getPaginatedProductsWithImages } from "@/actions/product/product-pagination";
import Pagination from "@/components/ui/Pagination";
import { gender as GenderType } from "@/generated/prisma";
import { Product } from "@/interfaces/product.interface";

interface SearchParams {
  page?: string;
}

interface PageProps {
  params: Promise<{ gender: string }>;
  ///searchParams: SearchParams;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { gender } = await params;
  //const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = await searchParams;
  const page = search.page ? parseInt(search.page) : 1;
  const { products: prismaProducts, totalPages } =
    await getPaginatedProductsWithImages({
      page,
      gender: gender as GenderType,
    });

  // Convert Prisma product types to our interface type
  const products = prismaProducts.map((product) => ({
    ...product,
    images: product.ProductImage?.map((img) => img.url) ?? [],
    gender: product.gender as Product["gender"],
  }));

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const pageTitle = `Artículos de ${
    gender.charAt(0).toUpperCase() + gender.slice(1)
  }`;

  return (
    <>
      <Title title={pageTitle} subtitle="Todos los productos" />
      <ProductsGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
