export const revalidate = 200; // revalidate at most every hour
import { getPaginatedProductsWithImages } from "@/actions/product/product-pagination";
import ProductsGrid from "@/components/products/ProductsGrid";
import Pagination from "@/components/ui/Pagination";
import { Title } from "@/components/ui/Title";
import { Product } from "@/interfaces/product.interface";

interface Props {
  /* searchParams: {
    page?: string;
  }; */
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const search = await searchParams;
  const page = search.page ? parseInt(search.page) : 1;
  //const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products: prismaProducts, totalPages } =
    await getPaginatedProductsWithImages({ page });

  /*  if (prismaProducts.length === 0) {
    redirect("/");
  } */

  // Convert Prisma products to our interface type
  const products: Product[] = prismaProducts.map((product) => ({
    ...product,
    images: product.ProductImage?.map((img) => img.url) ?? [],
    gender: product.gender as Product["gender"],
  }));

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" />
      <ProductsGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
