-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentAmount" INTEGER,
ADD COLUMN     "paymentDate" TIMESTAMP(3);
