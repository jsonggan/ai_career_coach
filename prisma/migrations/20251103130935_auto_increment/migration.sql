-- AlterTable
CREATE SEQUENCE "public".users_user_id_seq;
ALTER TABLE "public"."users" ALTER COLUMN "user_id" SET DEFAULT nextval('"public".users_user_id_seq');
ALTER SEQUENCE "public".users_user_id_seq OWNED BY "public"."users"."user_id";
