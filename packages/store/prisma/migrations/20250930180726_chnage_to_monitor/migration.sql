/*
  Warnings:

  - You are about to drop the `Website` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Website" DROP CONSTRAINT "Website_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WebsiteTick" DROP CONSTRAINT "WebsiteTick_websiteId_fkey";

-- DropTable
DROP TABLE "public"."Website";

-- CreateTable
CREATE TABLE "public"."Monitor" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Monitor" ADD CONSTRAINT "Monitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
