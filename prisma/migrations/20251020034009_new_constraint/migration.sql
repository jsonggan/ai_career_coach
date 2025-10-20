/*
  Warnings:

  - The primary key for the `user_career_paths` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."user_career_paths" DROP CONSTRAINT "user_career_paths_pkey",
ADD CONSTRAINT "user_career_paths_pkey" PRIMARY KEY ("user_id", "career_id");
