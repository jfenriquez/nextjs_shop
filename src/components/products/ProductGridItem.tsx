"use client";

import { Product } from "@/interfaces/product.interface";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  product: Product;
}

const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  console.log("product", product.images[0]);

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300 rounded-xl overflow-hidden group">
      <Link href={`/product/${product.slug}`} className="block relative w-full">
        <Image
          src={
            displayImage ? displayImage : "/products/1473809-00-A_1_2000.png"
          }
          alt={product.title}
          width={500}
          height={500}
          className="w-full h-auto object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
          onMouseEnter={() => setDisplayImage(product.images[1])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />
      </Link>

      <div className="p-4 text-base-content">
        <Link
          href={`/product/${product.slug}`}
          className="font-medium text-md hover:text-primary transition-colors line-clamp-2"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-lg font-bold">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductGridItem;
