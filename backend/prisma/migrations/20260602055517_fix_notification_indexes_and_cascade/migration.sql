-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_created_by_fkey`;

-- DropIndex
DROP INDEX `notifications_created_by_fkey` ON `notifications`;

-- AlterTable
ALTER TABLE `notifications` MODIFY `created_by` INTEGER UNSIGNED NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `notification_reads` RENAME INDEX `notification_reads_user_id_fkey` TO `notification_reads_user_id_idx`;

-- RenameIndex
ALTER TABLE `notification_roles` RENAME INDEX `notification_roles_role_id_fkey` TO `notification_roles_role_id_idx`;
