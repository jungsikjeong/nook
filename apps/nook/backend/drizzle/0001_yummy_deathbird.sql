ALTER TABLE "users" ADD COLUMN "nickname" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_nickname_unique" UNIQUE("nickname");