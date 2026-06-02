"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1717282800000 = void 0;
class InitialSchema1717282800000 {
    name = 'InitialSchema1717282800000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'normal_user', 'store_owner')`);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(60) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "address" TEXT NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'normal_user',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "stores" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(60) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "address" TEXT NOT NULL,
        "owner_id" UUID,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stores" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_stores_email" UNIQUE ("email"),
        CONSTRAINT "FK_stores_owner" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "store_id" UUID NOT NULL,
        "value" SMALLINT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ratings" PRIMARY KEY ("id"),
        CONSTRAINT "CK_ratings_value" CHECK ("value" >= 1 AND "value" <= 5),
        CONSTRAINT "UQ_ratings_user_store" UNIQUE ("user_id", "store_id"),
        CONSTRAINT "FK_ratings_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ratings_store" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}
exports.InitialSchema1717282800000 = InitialSchema1717282800000;
//# sourceMappingURL=1717282800000-InitialSchema.js.map