"use server";
import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const response = await prisma.category.findMany({});

    if (response.length <= 0) {
      throw new Error("Failed to fetch categories");
    }

    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
