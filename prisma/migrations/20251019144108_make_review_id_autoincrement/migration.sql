-- AlterTable
CREATE SEQUENCE "public".peer_reviews_review_id_seq;
ALTER TABLE "public"."peer_reviews" ALTER COLUMN "review_id" SET DEFAULT nextval('"public".peer_reviews_review_id_seq');
ALTER SEQUENCE "public".peer_reviews_review_id_seq OWNED BY "public"."peer_reviews"."review_id";
