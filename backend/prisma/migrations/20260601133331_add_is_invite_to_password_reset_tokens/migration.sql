-- AlterTable
ALTER TABLE `password_reset_tokens` ADD COLUMN `is_invite` BOOLEAN NOT NULL DEFAULT false;
