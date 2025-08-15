import { Product } from "@/interfaces/product.interface";
import React from "react";
import ProductGridItem from "./ProductGridItem";

interface Props {
  products: Product[];
}

const ProductsGrid = ({ products }: Props) => {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-12 px-2 sm:px-0">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product} />
      ))}
    </section>
  );
};

export default ProductsGrid;
