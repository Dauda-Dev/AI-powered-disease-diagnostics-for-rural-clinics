CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    date_of_birth TIMESTAMP NULL,
    email VARCHAR(255) NULL,
    mobile VARCHAR(255) NULL,
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


