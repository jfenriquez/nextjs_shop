"use client";

import { useCartStore } from "@/store/cart/cart/cartStore";

import Image from "next/image";

import React from "react";

const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`${product.image}`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />

          <div>
            <span>
              {product.title}-{product.size}-{product.quantity}{" "}
            </span>
            <p>{product.price * product.quantity}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductsInCart;
