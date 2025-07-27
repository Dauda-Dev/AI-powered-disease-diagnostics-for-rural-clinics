CREATE TABLE business (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NULL,
    business_address VARCHAR(255) NULL,
    mobile VARCHAR(255) NULL,
    business_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
