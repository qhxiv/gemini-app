CREATE TABLE "user"(
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "chat"(
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"("id"),
    "title" TEXT NOT NULL
);

CREATE TYPE role AS ENUM ('user', 'model');

CREATE TABLE "content"(
    "id" SERIAL PRIMARY KEY,
    "chatId" INTEGER NOT NULL REFERENCES "chat"("id"),
    "role" role NOT NULL
);

CREATE TABLE "part"(
    "id" SERIAL PRIMARY KEY,
    "contentId" INTEGER NOT NULL REFERENCES "content"("id"),
    "text" TEXT NOT NULL
);

INSERT INTO "user" VALUES (1, 'user', 'password');
