CREATE TABLE booked_appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INTEGER, -- Optional, if the appointment is with a specific doctor
    hospital_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- e.g., pending, confirmed, cancelled, completed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
