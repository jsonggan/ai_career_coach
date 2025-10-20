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
