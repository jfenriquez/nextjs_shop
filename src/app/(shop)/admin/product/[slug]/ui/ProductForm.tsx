"use client";

import { ProductImage } from "@/generated/prisma";
import { Category } from "@/interfaces/categoryInterface";
import { Product } from "@/interfaces/product.interface";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createOrUpdateProduct } from "@/actions/product/create-update-product";
import { useRouter } from "next/navigation";
import { deleteImageProduct } from "@/actions/product/delete-image-product";
import { FiUpload } from "react-icons/fi";
import { ToastMessage } from "@/components/ui/ClientToastHandler";
import { useState } from "react";
import { set } from "zod";
import { ToastItem } from "../../../../../../components/ui/ClientToastHandler";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: "men" | "women" | "kid" | "unisex" | "male" | "female";
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const toastArray: ToastItem[] = [];

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      sizes: product.sizes ?? [],
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      images: undefined,
      description: product.description ?? "",
      gender: product.gender ?? undefined,
    },
  });

  watch("sizes");

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    if (sizes.has(size)) sizes.delete(size);
    else sizes.add(size);
    setValue("sizes", Array.from(sizes));
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      console.log("Datos enviados:", data); // Para debug

      const formdata = new FormData();
      const { images, ...productToSave } = data;

      // Verificar que los campos requeridos existan
      if (!productToSave.title?.trim()) {
        alert("El título es requerido");
        return;
      }
      if (!productToSave.slug?.trim()) {
        alert("El slug es requerido");
        return;
      }
      if (!productToSave.categoryId) {
        alert("Debe seleccionar una categoría");
        return;
      }
      if (!productToSave.gender) {
        alert("Debe seleccionar un género");
        return;
      }

      if (product.id) formdata.append("id", product.id);

      formdata.append("title", productToSave.title.trim());
      formdata.append("slug", productToSave.slug.trim());
      formdata.append("description", productToSave.description?.trim() || "");
      formdata.append("price", productToSave.price.toString());
      formdata.append("inStock", productToSave.inStock.toString());
      // Enviar sizes como string separado por comas (como espera tu servidor)
      formdata.append("sizes", productToSave.sizes.join(","));
      formdata.append("tags", productToSave.tags?.trim() || "");
      formdata.append("categoryId", productToSave.categoryId);
      formdata.append("gender", productToSave.gender);

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formdata.append("images", images[i]);
        }
      }

      console.log("FormData creado, enviando..."); // Para debug

      const {
        ok,
        product: updateProduct,
        message,
      } = await createOrUpdateProduct(formdata);

      if (!ok) {
        toastArray.push({
          type: "error",
          message: "Hubo un error ",
        });
        return;
      }
      toastArray.push({
        type: "success",
        message: "Producto guardado exitosamente",
      });
      router.replace(`/admin/product/${updateProduct?.slug}`);
    } catch (error) {
      toastArray.push({
        type: "error",
        message: "Error inesperado al procesar el formulario",
      });
      console.error("Error en onSubmit:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ToastMessage toasts={toastArray} />
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          {product.id ? "Editar Producto" : "Nuevo Producto"}
        </h1>
        <p className="text-base-content/70">
          Completa la información del producto
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Información General - Izquierda */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-6">Información General</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título del producto"
                  {...register("title", { required: "El título es requerido" })}
                  className={`input input-bordered w-full ${
                    errors.title ? "input-error" : ""
                  }`}
                />
                {errors.title && (
                  <div className="text-error text-sm">
                    {errors.title.message}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Slug (URL del producto)"
                  {...register("slug", { required: "El slug es requerido" })}
                  className={`input input-bordered w-full ${
                    errors.slug ? "input-error" : ""
                  }`}
                />
                {errors.slug && (
                  <div className="text-error text-sm">
                    {errors.slug.message}
                  </div>
                )}

                <textarea
                  placeholder="Descripción del producto..."
                  {...register("description", {
                    required: "La descripción es requerida",
                  })}
                  rows={4}
                  className={`textarea textarea-bordered w-full resize-none ${
                    errors.description ? "textarea-error" : ""
                  }`}
                />
                {errors.description && (
                  <div className="text-error text-sm">
                    {errors.description.message}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("price", {
                        required: "El precio es requerido",
                        min: {
                          value: 0,
                          message: "El precio debe ser mayor a 0",
                        },
                      })}
                      type="number"
                      step="0.01"
                      placeholder="Precio"
                      className={`input input-bordered w-full ${
                        errors.price ? "input-error" : ""
                      }`}
                    />
                    {errors.price && (
                      <div className="text-error text-sm mt-1">
                        {errors.price.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("inStock", {
                        required: "El stock es requerido",
                        min: {
                          value: 0,
                          message: "El stock no puede ser negativo",
                        },
                      })}
                      type="number"
                      placeholder="Stock disponible"
                      className={`input input-bordered w-full ${
                        errors.inStock ? "input-error" : ""
                      }`}
                    />
                    {errors.inStock && (
                      <div className="text-error text-sm mt-1">
                        {errors.inStock.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      {...register("gender", {
                        required: "Selecciona un género",
                      })}
                      className={`select select-bordered w-full ${
                        errors.gender ? "select-error" : ""
                      }`}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="men">Hombre</option>
                      <option value="women">Mujer</option>
                      <option value="kid">Niño/a</option>
                      <option value="unisex">Unisex</option>
                    </select>
                    {errors.gender && (
                      <div className="text-error text-sm mt-1">
                        {errors.gender.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <select
                      {...register("categoryId", {
                        required: "Selecciona una categoría",
                      })}
                      className={`select select-bordered w-full ${
                        errors.categoryId ? "select-error" : ""
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <div className="text-error text-sm mt-1">
                        {errors.categoryId.message}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  {...register("tags", { required: "Los tags son requeridos" })}
                  type="text"
                  placeholder="Tags (separados por comas): camiseta, algodón, casual"
                  className={`input input-bordered w-full ${
                    errors.tags ? "input-error" : ""
                  }`}
                />
                {errors.tags && (
                  <div className="text-error text-sm">
                    {errors.tags.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tallas e Imágenes - Derecha */}
        <div className="space-y-6">
          {/* Tallas */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Tallas Disponibles</h2>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((size) => {
                  const isSelected = getValues("sizes").includes(size);
                  return (
                    <div
                      onClick={() => onSizeChanged(size)}
                      key={size}
                      className={`btn btn-sm ${
                        isSelected ? "btn-primary" : "btn-outline"
                      } cursor-pointer`}
                    >
                      {size}
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-base-content/60 mt-2">
                Selecciona las tallas disponibles
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Imágenes</h2>

              {/* Área de subida */}
              <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <FiUpload className="w-8 h-8 mx-auto mb-3 text-base-content/60" />
                <p className="text-sm text-base-content/80 mb-3">
                  Arrastra imágenes aquí o selecciona archivos
                </p>
                <input
                  type="file"
                  {...register("images")}
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  className="file-input file-input-bordered file-input-sm w-full"
                />
                <p className="text-xs text-base-content/60 mt-2">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>

              {/* Imágenes existentes */}
              {product.ProductImage && product.ProductImage.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Imágenes actuales
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.ProductImage.map((image: ProductImage) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg border border-base-300">
                          <Image
                            src={
                              image.url.startsWith("http")
                                ? image.url
                                : `/products/${image.url}`
                            }
                            alt="Product Image"
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={async () => (
                            await deleteImageProduct(image.id, image.url),
                            router.refresh()
                          )}
                          className="btn btn-circle btn-error btn-xs absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar imagen"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de envío - Ancho completo */}
        <div className="lg:col-span-3">
          <button
            type="submit"
            disabled={!isValid}
            className="btn btn-primary btn-lg w-full"
          >
            {product.id ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};
