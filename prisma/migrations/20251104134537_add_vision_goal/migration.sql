-- CreateTable
CREATE TABLE "public"."vision_statements" (
    "vision_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "vision_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vision_statements_pkey" PRIMARY KEY ("vision_id")
);

-- CreateTable
CREATE TABLE "public"."annual_goals" (
    "goal_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "public"."goal_milestones" (
    "milestone_id" SERIAL NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "target_date" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_milestones_pkey" PRIMARY KEY ("milestone_id")
);

-- AddForeignKey
ALTER TABLE "public"."vision_statements" ADD CONSTRAINT "vision_statements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."annual_goals" ADD CONSTRAINT "annual_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."goal_milestones" ADD CONSTRAINT "goal_milestones_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."annual_goals"("goal_id") ON DELETE CASCADE ON UPDATE CASCADE;
