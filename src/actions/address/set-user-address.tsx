"use server";

import { Address } from "@/interfaces/addressInterface";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    console.log("Setting user address:", address, userId);
    const newAddress = await createOrRemplaceUserAddress(address, userId);
    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.error("💥 Error en setUserAddress:", {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
    });

    // Para depuración temporal, lanza el error real
    throw error;

    // En producción podrías lanzar esto:
    // throw new Error("Failed to set user address");
  }
};

/////////////________________________/
export const createOrRemplaceUserAddress = async (
  address: Address,
  userId: string
) => {
  try {
    const storeAdress = await prisma.userAddress.findUnique({
      where: { userId }, 
    });
    const addressToSave = {
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      address2: address.address2,
      postalCode: address.postalCode,
      countryId: address.country,
      phone: address.phone,
      city: address.city,
      userId: userId,
    };

    if (!storeAdress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    } else {
      const updatedAddress = await prisma.userAddress.update({
        where: { userId },
        data: addressToSave,
      });
      return updatedAddress;
    }
  } catch (error) {
    console.error("Error setting user address:", error);
    throw new Error("Failed to set user address");
  }
};
