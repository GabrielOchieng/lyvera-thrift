-- 0. Create the Category table first!
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- 1. Create Categories based on unique values currently in Product
INSERT INTO "Category" ("id", "name")
SELECT DISTINCT lower(replace("category", ' ', '-')), "category" 
FROM "Product"
WHERE "category" IS NOT NULL;

-- 2. Add the new categoryId column as nullable first
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

-- 3. Map the existing products to their new Category IDs
UPDATE "Product" 
SET "categoryId" = lower(replace("category", ' ', '-'));

-- 4. Now that every row has a categoryId, make it NOT NULL
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- 5. Drop the old string column
ALTER TABLE "Product" DROP COLUMN "category";

-- 6. Add the formal Foreign Key constraint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" 
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. Add a unique constraint to Category name (as per your schema)
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");