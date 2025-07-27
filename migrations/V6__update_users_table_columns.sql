-- V2__add_role_columns_to_users.sql

ALTER TABLE users
ADD COLUMN role_level INTEGER NOT NULL DEFAULT 0;

ALTER TABLE users
ADD COLUMN business_id INTEGER;

ALTER TABLE users
ADD COLUMN role_name VARCHAR(50);
