CREATE TABLE users (
    user_name varchar(70) NOT NULL,
    user_id SERIAL PRIMARY KEY,
    email_id varchar(100) NOT NULL UNIQUE,
    user_password varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE blogs (
    title varchar(100) NOT NULL,
    body TEXT NOT NULL,
    img varchar(100),
    blog_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Create the trigger function for updated_at in PostgreSQL
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER trigger_update_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_blogs_updated_at();

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name varchar(50) UNIQUE NOT NULL
);

ALTER TABLE users
    ADD COLUMN role_id INT,
    ADD CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES roles (role_id);

CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

CREATE TABLE permissions(
    permission_id SERIAL PRIMARY KEY,
    permission_name varchar(50) UNIQUE NOT NULL
);

CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions (permission_id) ON DELETE CASCADE
);