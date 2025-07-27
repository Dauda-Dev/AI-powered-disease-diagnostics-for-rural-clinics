ALTER TABLE booked_appointments
ADD COLUMN consultation_notes TEXT NULL;

ALTER TABLE booked_appointments
ADD COLUMN consultType VARCHAR(50) NULL;
