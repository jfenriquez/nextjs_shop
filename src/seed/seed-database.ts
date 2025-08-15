import {
  PrismaClient,
  sizes as PrismaSizesEnum,
  gender as PrismaGenderEnum,
} from "../generated/prisma";
import { initialData } from "./seed";
import { countries } from "./seed-countries";
// Helper para mapear el género del seed a tu enum de Prisma
const mapGenderToPrisma = (
  seedGender: string
): PrismaGenderEnum | undefined => {
  const lowerSeedGender = seedGender.toLowerCase();
  switch (lowerSeedGender) {
    case "men":
      return PrismaGenderEnum.men;
    case "women":
      return PrismaGenderEnum.women;
    case "kid":
      return PrismaGenderEnum.kid;
    case "unisex":
      return PrismaGenderEnum.unisex;
    default:
      console.warn(`Género desconocido en seed: ${seedGender}`);
      return undefined; // O podrías asignar un valor por defecto o lanzar un error
  }
};

// Helper para filtrar y mapear tallas a tu enum de Prisma
const mapSizesToPrisma = (seedSizes: string[]): PrismaSizesEnum[] => {
  const validPrismaSizes: PrismaSizesEnum[] = Object.values(PrismaSizesEnum);
  return seedSizes.filter((size) =>
    validPrismaSizes.includes(size as PrismaSizesEnum)
  ) as PrismaSizesEnum[];
};

// Función principal para ejecutar el seeder
async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Iniciando el proceso de seeding...");

    await prisma.user.deleteMany();
    // 1. Borrar datos existentes en el orden correcto
    await prisma.productImage.deleteMany();
    console.log("🗑️ Imágenes de productos eliminadas.");
    await prisma.product.deleteMany();
    console.log("🗑️ Productos eliminados.");
    await prisma.category.deleteMany();
    console.log("🗑️ Categorías eliminadas.");
    await prisma.country.deleteMany();
    console.log("🗑️ Country eliminadas.");
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    console.log("🗑️ order -orderitem-orderaddress eliminadas.");

    ////add countries
    await prisma.country.createMany({
      data: countries.map((country) => ({
        name: country.name,
        code: country.id,
      })),
    });

    const { products, user: seedUsers } = initialData;
    ///add users
    await prisma.user.createMany({
      data: seedUsers,
    });

    // 2. Crear Categorías a partir de los 'type' de los productos
    const categoryNames = [...new Set(products.map((p) => p.type))];
    const categoriesToCreate = categoryNames.map((name) => ({ name }));

    await prisma.category.createMany({
      data: categoriesToCreate,
    });
    console.log(
      `📚 ${categoryNames.length} categorías creadas: ${categoryNames.join(
        ", "
      )}`
    );

    // Obtener las categorías creadas para mapear nombre a ID
    const categoriesFromDb = await prisma.category.findMany();
    const categoryMap = new Map(
      categoriesFromDb.map((cat) => [cat.name, cat.id])
    );

    // 3. Crear Productos y sus Imágenes
    for (const seedProduct of products) {
      const categoryId = categoryMap.get(seedProduct.type);
      if (!categoryId) {
        console.warn(
          `⚠️ Categoría '${seedProduct.type}' no encontrada para el producto '${seedProduct.title}'. Saltando producto.`
        );
        continue;
      }

      const prismaGender = mapGenderToPrisma(seedProduct.gender);
      if (!prismaGender) {
        console.warn(
          `⚠️ Género '${seedProduct.gender}' no válido para el producto '${seedProduct.title}'. Saltando producto o asignando default si se prefiere.`
        );
        // Podrías decidir saltar, asignar un default, o lanzar un error aquí
        continue;
      }

      const prismaSizes = mapSizesToPrisma(seedProduct.sizes);

      const productData = {
        title: seedProduct.title,
        description: seedProduct.description,
        inStock: seedProduct.inStock,
        price: seedProduct.price, // Prisma espera Int, tus datos de seed ya son números enteros
        sizes: prismaSizes,
        gender: prismaGender,
        tags: seedProduct.tags,
        slug: seedProduct.slug,
        categoryId: categoryId,
        ProductImage: {
          create: seedProduct.images.map((imageUrl) => ({ url: imageUrl })),
        },
      };

      await prisma.product.create({ data: productData });
      console.log(`🛍️ Producto creado: ${seedProduct.title}`);
    }

    console.log("✅ Seeding completado exitosamente!");
  } catch (error) {
    console.error("❌ Error durante el proceso de seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Desconectado de la base de datos.");
  }
}

main();
