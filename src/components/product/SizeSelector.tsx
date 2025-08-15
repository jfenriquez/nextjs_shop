import { Size } from "@/interfaces/product.interface";
import clsx from "clsx";
import React from "react";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChanged: (size: Size) => void;
}

const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChanged,
}: Props) => {
  return (
    <div className="my-6">
      <h3 className="font-semibold mb-4 text-base-content">
        Tallas disponibles
      </h3>

      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={clsx("btn btn-sm rounded-full font-medium", {
              "btn-primary text-primary-content": size === selectedSize,
              "btn-outline": size !== selectedSize,
            })}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
