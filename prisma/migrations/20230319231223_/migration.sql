/*
  Warnings:

  - Added the required column `active` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSizeMb` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "categoryName" TEXT NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "imageSizeMb" DOUBLE PRECISION NOT NULL;
