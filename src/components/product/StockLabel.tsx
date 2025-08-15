"use client";

import { getStockBySlug } from "@/actions/product/get-stock-by-slug";
import React, { useEffect, useState } from "react";

interface Props {
  slug: string;
}

const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    const inStock = await getStockBySlug(slug);
    setStock(Number(inStock));
    setIsLoading(false);
  };

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="skeleton h-6 w-32 rounded"></div>
      ) : (
        <div
          className={`badge ${
            stock > 0 ? "badge-success" : "badge-error"
          } badge-lg font-semibold`}
        >
          {stock > 0 ? `Stock: ${stock}` : "Sin stock"}
        </div>
      )}
    </div>
  );
};

export default StockLabel;
