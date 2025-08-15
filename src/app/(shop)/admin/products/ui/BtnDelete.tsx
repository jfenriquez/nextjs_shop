"use client";
import React from "react";
import { ToastItem } from "../../../../../components/ui/ClientToastHandler";
import { FiTrash2 } from "react-icons/fi";
import { deleteProduct } from "@/actions/product/delete-product";
// Si usas react-toastify u otro sistema, reemplaza esto por la función que realmente lanza el toast
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
};

const BtnDelete = ({ productId }: Props) => {
  const router = useRouter();
  const handleDelete = async () => {
    const res = await deleteProduct(productId);

    if (!res.ok) {
      toast.error(
        "Hubo un error al eliminar el producto, ELIMINE LAS ORDENES DE ESE PRODUCTO"
      );
      return;
    }

    toast.success("PRODUCTO ELIMINADO");
    // Si quieres recargar o actualizar lista: window.location.reload() o
    router.refresh();
  };

  return (
    <button className="btn btn-sm btn-outline btn-error" onClick={handleDelete}>
      <FiTrash2 className="mr-1" />
      Eliminar
    </button>
  );
};

export default BtnDelete;
