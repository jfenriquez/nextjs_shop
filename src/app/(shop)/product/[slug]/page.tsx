export const revalidate = 200; // revalidate at most every hour
import { getProductBySlug } from "@/actions/product/get-product-by-slug";
import { ProductMobileSlideshow } from "@/components/product/Slideshow/ProductMobileSlideshow";
import { ProductSlideshow } from "@/components/product/Slideshow/ProductSlideshow";
import StockLabel from "@/components/product/StockLabel";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import AddToCart from "./ui/AddToCart";
import { Product } from "@/interfaces/product.interface";

interface Props {
  /* params: {
    slug: string;
  }; */
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const prod = await getProductBySlug(slug);

  return {
    title: prod?.title ?? "",
    description: prod?.description ?? "",
    openGraph: {
      title: prod?.title ?? "",
      description: prod?.description ?? "",
      images: prod?.images ? [`/products/${prod.images[0]}`] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const prismaProduct = await getProductBySlug(slug);

  if (!prismaProduct) {
    notFound();
  }

  // Convert Prisma product to our interface type
  const product: Product = {
    ...prismaProduct,
    images: prismaProduct.images ?? [],
    gender: prismaProduct.gender ?? "unisex",
    sizes: prismaProduct.sizes ?? [],
    tags: prismaProduct.tags ?? [],
  };

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2 ">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        <StockLabel slug={slug} />
        <h1 className={`antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
