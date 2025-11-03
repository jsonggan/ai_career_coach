/*
  Warnings:

  - A unique constraint covering the columns `[user_email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "scopes" TEXT[] DEFAULT ARRAY['user']::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "public"."users"("user_email");
