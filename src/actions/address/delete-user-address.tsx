"use server";
import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    const address = prisma.userAddress.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!address) {
      throw new Error("Address not found for the user");
    }
    const deleteAddress = await prisma.userAddress.deleteMany({
      where: {
        userId: userId,
      },
    });
    return deleteAddress;
  } catch (error) {
    console.error("Error deleting user address:", error);
  }
};
