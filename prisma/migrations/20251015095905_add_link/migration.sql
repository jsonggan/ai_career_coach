-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "course_link" TEXT;
-- AlterTable
ALTER TABLE "public"."certificates" ADD COLUMN     "is_added_by_user" BOOLEAN NOT NULL DEFAULT FALSE;