-- CreateEnum
CREATE TYPE "public"."system_role" AS ENUM ('Manager', 'HR Admin', 'Employee');

-- CreateTable
CREATE TABLE "public"."user" (
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "system_role" "public"."system_role" NOT NULL,
    "job_role" TEXT NOT NULL,
    "rank" TEXT,
    "skill_set" TEXT[],
    "manager_user_id" UUID,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."self_assessment" (
    "self_assessment_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "goal_achieved" TEXT,
    "key_strength" TEXT,
    "key_strength_ai" TEXT,
    "area_for_improvement" TEXT,
    "overall_self_rating" INTEGER,
    "additional_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "self_assessment_pkey" PRIMARY KEY ("self_assessment_id")
);

-- CreateTable
CREATE TABLE "public"."peer_feedback" (
    "peer_feedback_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "commenter_user_id" UUID NOT NULL,
    "rating" INTEGER,
    "comment_on_strength" TEXT,
    "suggestion_for_improvement" TEXT,
    "suggestion_for_improvement_ai" TEXT,
    "final_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peer_feedback_pkey" PRIMARY KEY ("peer_feedback_id")
);

-- CreateTable
CREATE TABLE "public"."manager_evaluation" (
    "manager_evaluation_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "performance_rating" INTEGER,
    "comment_on_goal_achieved" TEXT,
    "comment_on_goal_achieved_ai" TEXT,
    "comment_on_strength" TEXT,
    "suggestion_for_improvement" TEXT,
    "suggestion_for_improvement_ai" TEXT,
    "final_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manager_evaluation_pkey" PRIMARY KEY ("manager_evaluation_id")
);

-- CreateTable
CREATE TABLE "public"."user_document" (
    "user_document_id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "extracted_content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mime_type" TEXT,

    CONSTRAINT "user_document_pkey" PRIMARY KEY ("user_document_id")
);

-- CreateTable
CREATE TABLE "public"."new_role" (
    "new_role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "description_ai" TEXT NOT NULL,
    "description_prompt" TEXT NOT NULL,
    "year_of_experience" TEXT NOT NULL,
    "department" TEXT,
    "skill" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "new_role_pkey" PRIMARY KEY ("new_role_id")
);

-- CreateTable
CREATE TABLE "public"."role_related_question" (
    "role_related_question_id" SERIAL NOT NULL,
    "role_related_question" TEXT NOT NULL,
    "new_role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_related_question_pkey" PRIMARY KEY ("role_related_question_id")
);

-- CreateTable
CREATE TABLE "public"."candidate_evaluation" (
    "candidate_evaluation_id" SERIAL NOT NULL,
    "candidate_evaluation" TEXT NOT NULL,
    "new_role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_evaluation_pkey" PRIMARY KEY ("candidate_evaluation_id")
);

-- CreateTable
CREATE TABLE "public"."user_new_role" (
    "user_new_role_id" SERIAL NOT NULL,
    "new_role_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "overall_rating" INTEGER NOT NULL,
    "ai_summary" TEXT NOT NULL,
    "reviewer_comment" TEXT NOT NULL,
    "reviewer_comment_id" UUID,
    "impact_communication" INTEGER NOT NULL,
    "skill_recency" INTEGER NOT NULL,
    "years_of_relevant_experience" INTEGER NOT NULL,
    "total_experience" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_new_role_pkey" PRIMARY KEY ("user_new_role_id")
);

-- CreateTable
CREATE TABLE "public"."user_new_role_role_related_question" (
    "user_new_role_role_related_question_id" SERIAL NOT NULL,
    "role_related_question_answer" TEXT NOT NULL,
    "user_new_role_id" INTEGER NOT NULL,
    "is_in_resume" BOOLEAN NOT NULL,
    "role_related_question_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_new_role_role_related_question_pkey" PRIMARY KEY ("user_new_role_role_related_question_id")
);

-- CreateTable
CREATE TABLE "public"."user_new_role_candidate_evaluation" (
    "user_new_role_candidate_evaluation_id" SERIAL NOT NULL,
    "candidate_evaluation_answer" TEXT NOT NULL,
    "user_new_role_id" INTEGER NOT NULL,
    "candidate_evaluation_id" INTEGER NOT NULL,
    "is_in_resume" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_new_role_candidate_evaluation_pkey" PRIMARY KEY ("user_new_role_candidate_evaluation_id")
);

-- CreateIndex
CREATE INDEX "user_new_role_role_related_question_user_new_role_id_idx" ON "public"."user_new_role_role_related_question"("user_new_role_id");

-- CreateIndex
CREATE INDEX "user_new_role_role_related_question_role_related_question_i_idx" ON "public"."user_new_role_role_related_question"("role_related_question_id");

-- CreateIndex
CREATE INDEX "user_new_role_candidate_evaluation_user_new_role_id_idx" ON "public"."user_new_role_candidate_evaluation"("user_new_role_id");

-- CreateIndex
CREATE INDEX "user_new_role_candidate_evaluation_candidate_evaluation_id_idx" ON "public"."user_new_role_candidate_evaluation"("candidate_evaluation_id");

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_manager_user_id_fkey" FOREIGN KEY ("manager_user_id") REFERENCES "public"."user"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."self_assessment" ADD CONSTRAINT "self_assessment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."peer_feedback" ADD CONSTRAINT "peer_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."peer_feedback" ADD CONSTRAINT "peer_feedback_commenter_user_id_fkey" FOREIGN KEY ("commenter_user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manager_evaluation" ADD CONSTRAINT "manager_evaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_document" ADD CONSTRAINT "user_document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_related_question" ADD CONSTRAINT "role_related_question_new_role_id_fkey" FOREIGN KEY ("new_role_id") REFERENCES "public"."new_role"("new_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."candidate_evaluation" ADD CONSTRAINT "candidate_evaluation_new_role_id_fkey" FOREIGN KEY ("new_role_id") REFERENCES "public"."new_role"("new_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role" ADD CONSTRAINT "user_new_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role" ADD CONSTRAINT "user_new_role_new_role_id_fkey" FOREIGN KEY ("new_role_id") REFERENCES "public"."new_role"("new_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role_role_related_question" ADD CONSTRAINT "user_new_role_role_related_question_user_new_role_id_fkey" FOREIGN KEY ("user_new_role_id") REFERENCES "public"."user_new_role"("user_new_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role_role_related_question" ADD CONSTRAINT "user_new_role_role_related_question_role_related_question__fkey" FOREIGN KEY ("role_related_question_id") REFERENCES "public"."role_related_question"("role_related_question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role_candidate_evaluation" ADD CONSTRAINT "user_new_role_candidate_evaluation_user_new_role_id_fkey" FOREIGN KEY ("user_new_role_id") REFERENCES "public"."user_new_role"("user_new_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_new_role_candidate_evaluation" ADD CONSTRAINT "user_new_role_candidate_evaluation_candidate_evaluation_id_fkey" FOREIGN KEY ("candidate_evaluation_id") REFERENCES "public"."candidate_evaluation"("candidate_evaluation_id") ON DELETE CASCADE ON UPDATE CASCADE;
