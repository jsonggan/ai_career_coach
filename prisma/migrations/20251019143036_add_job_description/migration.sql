/*
  Warnings:

  - You are about to drop the column `feedback` on the `peer_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `peer_reviews` table. All the data in the column will be lost.
  - Added the required column `academic_performance_rating` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areas_for_improvement` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collaboration_teamwork_rating` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strengths_feedback` to the `peer_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."peer_reviews" DROP COLUMN "feedback",
DROP COLUMN "rating",
ADD COLUMN     "academic_performance_rating" INTEGER NOT NULL,
ADD COLUMN     "additional_comments" TEXT,
ADD COLUMN     "areas_for_improvement" TEXT NOT NULL,
ADD COLUMN     "collaboration_teamwork_rating" INTEGER NOT NULL,
ADD COLUMN     "strengths_feedback" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."job_description" (
    "job_id" INTEGER NOT NULL,
    "job_url" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "job_hard_skills" TEXT NOT NULL,
    "job_soft_skills" TEXT NOT NULL,

    CONSTRAINT "job_description_pkey" PRIMARY KEY ("job_id")
);
