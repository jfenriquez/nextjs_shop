"use client";
import QuantitySelector from "@/components/product/QuantitySelector";
import { useCartStore } from "@/store/cart/cart/cartStore";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcDeleteDatabase } from "react-icons/fc";

const ProductInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const productQuantityUpdate = useCartStore(
    (state) => state.updateProductQuantity
  );
  const RemoveInCart = useCartStore((state) => state.removeProductToCart);

  return (
    <div className="space-y-6">
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex items-start gap-4 bg-base-100 rounded-xl shadow-sm p-4"
        >
          <Image
            src={`${product.image}`}
            width={100}
            height={100}
            className="rounded-md object-cover"
            alt={product.title}
          />

          <div className="flex-1">
            <Link
              href={`/product/${product.slug}`}
              className="text-lg font-semibold text-primary hover:underline"
            >
              {product.title}
            </Link>

            <p className="text-base text-base-content/80 mb-2">
              ${product.price.toFixed(2)}
            </p>

            <QuantitySelector
              quantity={product.quantity}
              onChangeQuantity={(quantity) =>
                productQuantityUpdate(product, quantity)
              }
            />
          </div>

          <button
            className="hover:scale-110 transition-transform mt-1"
            onClick={() => RemoveInCart(product)}
            title="Eliminar del carrito"
          >
            <FcDeleteDatabase size={32} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductInCart;
