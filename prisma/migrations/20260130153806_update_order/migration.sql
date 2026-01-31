/*
  Warnings:

  - You are about to drop the column `medicineId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGeteway` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_medicineId_fkey";

-- DropIndex
DROP INDEX "orders_medicineId_idx";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "medicineId",
DROP COLUMN "paymentGeteway",
DROP COLUMN "quantity",
ADD COLUMN     "cartId" TEXT NOT NULL,
ADD COLUMN     "medicinesId" TEXT,
ADD COLUMN     "paymentGateway" TEXT,
ALTER COLUMN "shippingAddress" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "orders_cartId_idx" ON "orders"("cartId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_medicinesId_fkey" FOREIGN KEY ("medicinesId") REFERENCES "medicines"("id") ON DELETE SET NULL ON UPDATE CASCADE;
