CREATE TABLE IF NOT EXISTS audit_logs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED  DEFAULT NULL,
  action        VARCHAR(100)  NOT NULL,
  resource_type VARCHAR(100)  NOT NULL,
  resource_id   INT UNSIGNED  DEFAULT NULL,
  details       JSON          DEFAULT NULL,
  ip_address    VARCHAR(45)   DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_al_user_id       (user_id),
  INDEX idx_al_resource_type (resource_type),
  INDEX idx_al_created_at    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
