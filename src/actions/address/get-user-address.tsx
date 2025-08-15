"use server";

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });
    if (!address) {
      return null; // or handle the case where no address is found{
    }
    const { id, countryId, address2, ...rest } = address;
    return {
      ...rest,
      address2: address2 ? address2 : "",
      country: countryId,
    };
  } catch (error) {
    console.log(error);
  }
};
