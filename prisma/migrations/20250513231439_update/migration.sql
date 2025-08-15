/*
  Warnings:

  - The values [male,female] on the enum `gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "gender_new" AS ENUM ('men', 'women', 'unisex', 'kid');
ALTER TABLE "Product" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "gender" TYPE "gender_new" USING ("gender"::text::"gender_new");
ALTER TYPE "gender" RENAME TO "gender_old";
ALTER TYPE "gender_new" RENAME TO "gender";
DROP TYPE "gender_old";
ALTER TABLE "Product" ALTER COLUMN "gender" SET DEFAULT 'unisex';
COMMIT;
