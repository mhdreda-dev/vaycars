-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "fuel" SET DEFAULT 'DIESEL',
ALTER COLUMN "transmission" SET DEFAULT 'MANUAL',
ALTER COLUMN "luggage" DROP NOT NULL,
ALTER COLUMN "airConditioning" SET DEFAULT false,
ALTER COLUMN "shortDescriptionFr" DROP NOT NULL,
ALTER COLUMN "shortDescriptionAr" DROP NOT NULL,
ALTER COLUMN "fullDescriptionFr" DROP NOT NULL,
ALTER COLUMN "fullDescriptionAr" DROP NOT NULL,
ALTER COLUMN "priceNoteFr" DROP NOT NULL,
ALTER COLUMN "priceNoteAr" DROP NOT NULL,
ALTER COLUMN "priceNoteAr" SET DEFAULT 'الثمن على حساب التاريخ والمدة';
