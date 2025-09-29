-- CreateEnum
CREATE TYPE "public"."WebsiteStatus" AS ENUM ('Bad', 'Good');

-- CreateTable
CREATE TABLE "public"."Website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Validator" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebsiteTick" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "status" "public"."WebsiteStatus" NOT NULL,
    "latency" DOUBLE PRECISION NOT NULL,
    "validatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteTick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Website" ADD CONSTRAINT "Website_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Website"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTick" ADD CONSTRAINT "WebsiteTick_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "public"."Validator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
