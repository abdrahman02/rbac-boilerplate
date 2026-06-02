-- Backfill: mark all existing users (created before email-verification was introduced)
-- as verified and active. Users who registered after the feature is live will follow
-- the normal verify-email → isActive=true flow.
UPDATE `users`
SET
  `email_verified_at` = COALESCE(`email_verified_at`, `created_at`),
  `is_active`         = TRUE
WHERE `deleted_at` IS NULL;