-- CreateTable
CREATE TABLE "public"."ai_insights" (
    "insight_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "generated_on" TIMESTAMP(3) NOT NULL,
    "recommendation" TEXT NOT NULL,
    "spec_additional_comment" TEXT NOT NULL,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("insight_id")
);

-- CreateTable
CREATE TABLE "public"."career_paths" (
    "career_id" INTEGER NOT NULL,
    "career_title" TEXT NOT NULL,
    "career_desc" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "career_paths_pkey" PRIMARY KEY ("career_id")
);

-- CreateTable
CREATE TABLE "public"."certificates" (
    "cert_id" INTEGER NOT NULL,
    "cert_name" TEXT NOT NULL,
    "cert_provider" TEXT NOT NULL,
    "cert_level" TEXT NOT NULL,
    "cert_category" TEXT NOT NULL,
    "is_added_by_user" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("cert_id")
);

-- CreateTable
CREATE TABLE "public"."community_posts" (
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "posted_on" TIMESTAMP(3) NOT NULL,
    "post_content" TEXT NOT NULL,
    "course_rating" INTEGER NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "public"."external_courses" (
    "external_course_id" INTEGER NOT NULL,
    "external_course_name" TEXT NOT NULL,
    "external_provider" TEXT NOT NULL,
    "external_course_desc" TEXT NOT NULL,
    "external_ai_tagged_skill" TEXT NOT NULL,
    "is_added_by_user" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "external_courses_pkey" PRIMARY KEY ("external_course_id")
);

-- CreateTable
CREATE TABLE "public"."courses" (
    "course_id" INTEGER NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_desc" TEXT NOT NULL,
    "course_full_desc" TEXT NOT NULL,
    "ai_tagged_skill" TEXT NOT NULL,
    "course_link" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

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

-- CreateTable
CREATE TABLE "public"."linkedin_benchmark" (
    "id" INTEGER NOT NULL,
    "skill_name" TEXT NOT NULL,
    "avg_skill_score" DOUBLE PRECISION NOT NULL,
    "percentile_75" DOUBLE PRECISION NOT NULL,
    "percentile_90" DOUBLE PRECISION NOT NULL,
    "sample_size" INTEGER NOT NULL,

    CONSTRAINT "linkedin_benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."peer_reviews" (
    "review_date" TIMESTAMP(3) NOT NULL,
    "review_id" SERIAL NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "reviewee_id" INTEGER NOT NULL,
    "academic_performance_rating" INTEGER NOT NULL,
    "additional_comments" TEXT,
    "areas_for_improvement" TEXT NOT NULL,
    "collaboration_teamwork_rating" INTEGER NOT NULL,
    "strengths_feedback" TEXT NOT NULL,

    CONSTRAINT "peer_reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "project_id" INTEGER NOT NULL,
    "project_title" TEXT NOT NULL,
    "project_desc" TEXT NOT NULL,
    "difficulty_level" TEXT NOT NULL,
    "estimated_time" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "public"."skill_competencies" (
    "skill_id" INTEGER NOT NULL,
    "skill_name" TEXT NOT NULL,
    "skill_grade" TEXT NOT NULL,
    "skill_category" TEXT NOT NULL,

    CONSTRAINT "skill_competencies_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "public"."specialization" (
    "spec_id" INTEGER NOT NULL,
    "spec_name" TEXT NOT NULL,
    "spec_desc" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "specialization_pkey" PRIMARY KEY ("spec_id")
);

-- CreateTable
CREATE TABLE "public"."study_plan_certificate" (
    "id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "cert_id" INTEGER NOT NULL,

    CONSTRAINT "study_plan_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."study_plan_courses" (
    "id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "study_plan_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."study_plan_external_courses" (
    "id" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "external_course_id" INTEGER NOT NULL,

    CONSTRAINT "study_plan_external_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."study_plan_projects" (
    "plan_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,

    CONSTRAINT "study_plan_projects_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "public"."study_plans" (
    "plan_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_desc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "public"."user_career_paths" (
    "user_id" INTEGER NOT NULL,
    "career_id" INTEGER NOT NULL,

    CONSTRAINT "user_career_paths_pkey" PRIMARY KEY ("user_id","career_id")
);

-- CreateTable
CREATE TABLE "public"."user_certificates" (
    "user_cert_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date_obtained" DATE NOT NULL,
    "cert_id" INTEGER NOT NULL,

    CONSTRAINT "user_certificates_pkey" PRIMARY KEY ("user_cert_id")
);

-- CreateTable
CREATE TABLE "public"."user_courses" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "enrollment_date" DATE NOT NULL,
    "completion_status" TEXT NOT NULL,

    CONSTRAINT "user_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_external_courses" (
    "user_external_course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "external_course_completion_date" DATE NOT NULL,
    "external_course_id" INTEGER NOT NULL,

    CONSTRAINT "user_external_courses_pkey" PRIMARY KEY ("user_external_course_id")
);

-- CreateTable
CREATE TABLE "public"."user_skill" (
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "proficiency_score" DOUBLE PRECISION NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "data_source" TEXT NOT NULL,

    CONSTRAINT "user_skill_pkey" PRIMARY KEY ("user_id","skill_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."users_specialization" (
    "user_id" INTEGER NOT NULL,
    "spec_id" INTEGER NOT NULL,
    "added_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_specialization_pkey" PRIMARY KEY ("user_id","spec_id")
);

-- CreateTable
CREATE TABLE "public"."recommended_certificate" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cert_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "recommended_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommended_courses" (
    "re_course_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "recommended_courses_pkey" PRIMARY KEY ("re_course_id")
);

-- CreateTable
CREATE TABLE "public"."recommended_external_courses" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "external_course_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "recommended_external_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommended_projects" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "recommended_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_projectsTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_projectsTousers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_projectsTousers_B_index" ON "public"."_projectsTousers"("B");

-- AddForeignKey
ALTER TABLE "public"."ai_insights" ADD CONSTRAINT "ai_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."community_posts" ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."peer_reviews" ADD CONSTRAINT "peer_reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."peer_reviews" ADD CONSTRAINT "peer_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_certificate" ADD CONSTRAINT "study_plan_certificate_cert_id_fkey" FOREIGN KEY ("cert_id") REFERENCES "public"."certificates"("cert_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_certificate" ADD CONSTRAINT "study_plan_certificate_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."study_plans"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_courses" ADD CONSTRAINT "study_plan_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_courses" ADD CONSTRAINT "study_plan_courses_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."study_plans"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_external_courses" ADD CONSTRAINT "study_plan_external_courses_external_course_id_fkey" FOREIGN KEY ("external_course_id") REFERENCES "public"."external_courses"("external_course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_external_courses" ADD CONSTRAINT "study_plan_external_courses_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."study_plans"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_projects" ADD CONSTRAINT "study_plan_projects_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."study_plans"("plan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plan_projects" ADD CONSTRAINT "study_plan_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."study_plans" ADD CONSTRAINT "study_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_career_paths" ADD CONSTRAINT "user_career_paths_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "public"."career_paths"("career_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_career_paths" ADD CONSTRAINT "user_career_paths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_certificates" ADD CONSTRAINT "user_certificates_cert_id_fkey" FOREIGN KEY ("cert_id") REFERENCES "public"."certificates"("cert_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_certificates" ADD CONSTRAINT "user_certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_courses" ADD CONSTRAINT "user_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_courses" ADD CONSTRAINT "user_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_external_courses" ADD CONSTRAINT "user_external_courses_external_course_id_fkey" FOREIGN KEY ("external_course_id") REFERENCES "public"."external_courses"("external_course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_external_courses" ADD CONSTRAINT "user_external_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_skill" ADD CONSTRAINT "user_skill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skill_competencies"("skill_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_skill" ADD CONSTRAINT "user_skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_specialization" ADD CONSTRAINT "users_specialization_spec_id_fkey" FOREIGN KEY ("spec_id") REFERENCES "public"."specialization"("spec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users_specialization" ADD CONSTRAINT "users_specialization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_certificate" ADD CONSTRAINT "recommended_certificate_cert_id_fkey" FOREIGN KEY ("cert_id") REFERENCES "public"."certificates"("cert_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_certificate" ADD CONSTRAINT "recommended_certificate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_courses" ADD CONSTRAINT "recommended_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_courses" ADD CONSTRAINT "recommended_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_external_courses" ADD CONSTRAINT "recommended_external_courses_external_course_id_fkey" FOREIGN KEY ("external_course_id") REFERENCES "public"."external_courses"("external_course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_external_courses" ADD CONSTRAINT "recommended_external_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_projects" ADD CONSTRAINT "recommended_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recommended_projects" ADD CONSTRAINT "recommended_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_projectsTousers" ADD CONSTRAINT "_projectsTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."projects"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_projectsTousers" ADD CONSTRAINT "_projectsTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
