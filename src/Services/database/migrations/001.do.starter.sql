CREATE TABLE "manga" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "description" varchar,
  "content_page_url" varchar UNIQUE,
  "last_update" timestamptz
);

CREATE TABLE "chapter" (
  "id" SERIAL PRIMARY KEY,
  "manga_id" int NOT NULL,
  "num" NUMERIC,
  "url" varchar UNIQUE,
  "release_date" timestamptz
);

CREATE TABLE "notification" (
  "chapter_id" int PRIMARY KEY
);

ALTER TABLE "chapter" ADD FOREIGN KEY ("manga_id") REFERENCES "manga" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification" ADD FOREIGN KEY ("chapter_id") REFERENCES "chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE;