CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    school_role VARCHAR(50),
    student_number VARCHAR(50),
    student_program VARCHAR(100),
    person_department VARCHAR(100),
    person_email VARCHAR(255),
    id_image_path VARCHAR(255),
    item_code VARCHAR(50),
    item_name VARCHAR(255),
    item_desc TEXT,
    item_features TEXT,
    last_location VARCHAR(255),
    lost_date DATE,
    item_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);