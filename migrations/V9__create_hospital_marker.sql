CREATE TABLE hospital_marker (
    id SERIAL PRIMARY KEY,
    marker_id TEXT NOT NULL,
    business_id TEXT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    hours TEXT,
    lat TEXT NOT NULL,
    lng TEXT NOT NULL,
    amenity TEXT NULL,
    type TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
