"use client";
import QuantitySelector from "@/components/product/QuantitySelector";
import SizeSelector from "@/components/product/SizeSelector";
import { CartProduct, Product, Size } from "@/interfaces/product.interface";
import { useCartStore } from "@/store/cart/cart/cartStore";
import React, { useState } from "react";

interface Props {
  product: Product;
}
const AddToCart = ({ product }: Props) => {
  const addProductTocart = useCartStore((state) => state.addProductTocart);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);
  const addToCar = async () => {
    setPosted(true);
    if (!size) return;
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      image: product.images[0],
    };

    addProductTocart(cartProduct);
    console.log("dsdsd");
  };

  return (
    <>
      {posted ? <span className="bg-red-500">seleccione una talla</span> : ""}
      {/* Selector de Tallas */}
      <SizeSelector
        onSizeChanged={(size: Size) => {
          setSize(size);
        }}
        selectedSize={size}
        availableSizes={product.sizes}
      />

      {/* Selector de Cantidad */}
      <QuantitySelector
        quantity={quantity}
        onChangeQuantity={(quantity: number) => {
          setQuantity(quantity);
        }}
      />

      {/*TODO:MEJORAR BOTON NO SE VE Button */}
      <button className="btn-primary my-5" onClick={addToCar}>
        Agregar al carrito
      </button>
    </>
  );
};

export default AddToCart;
