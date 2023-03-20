/*
  Warnings:

  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageSizeMb` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryImages` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[priority]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[primaryImageId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `primaryImageId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_priority_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "priority" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
DROP COLUMN "imageSizeMb",
DROP COLUMN "priority",
DROP COLUMN "secondaryImages",
ADD COLUMN     "primaryImageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "sizeMb" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "productId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_secondaryImages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_secondaryImages_AB_unique" ON "_secondaryImages"("A", "B");

-- CreateIndex
CREATE INDEX "_secondaryImages_B_index" ON "_secondaryImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Category_priority_key" ON "Category"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "Product_primaryImageId_key" ON "Product"("primaryImageId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_primaryImageId_fkey" FOREIGN KEY ("primaryImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondaryImages" ADD CONSTRAINT "_secondaryImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_secondaryImages" ADD CONSTRAINT "_secondaryImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
