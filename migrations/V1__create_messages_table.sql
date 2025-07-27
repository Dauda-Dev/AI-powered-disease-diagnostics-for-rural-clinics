CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    content TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
