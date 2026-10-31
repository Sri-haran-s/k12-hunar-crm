-- ============================================================
-- EduConnect CRM | K12 Hunar
-- Student Inquiry & Enrollment Management System
-- Database Schema — Supabase PostgreSQL
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ============================================================
-- TABLE: admins
-- Stores administrator credentials for the CRM portal
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast admin lookup by email during authentication
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- ============================================================
-- TABLE: inquiries
-- Stores all public inquiry submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(20) NOT NULL,
    user_type  VARCHAR(20) NOT NULL
                 CHECK (user_type IN ('Parent', 'Student', 'School')),
    category   VARCHAR(30) NOT NULL
                 CHECK (category IN ('Scholarship', 'Concert', 'Admission', 'General Query')),
    message    TEXT NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'New'
                 CHECK (status IN ('New', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES for performance on commonly queried/filtered columns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_inquiries_status      ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_category    ON inquiries(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_type   ON inquiries(user_type);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at  ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_name_trgm   ON inquiries USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_inquiries_phone       ON inquiries(phone);

-- ============================================================
-- FUNCTION + TRIGGER: auto-update updated_at on row change
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries;
CREATE TRIGGER trg_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- NOTE: Run this schema in Supabase SQL Editor.
-- The pg_trgm extension is needed for the trigram index on name.
-- Enable it first with: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- If pg_trgm is not available, remove idx_inquiries_name_trgm
-- and the backend will fall back to standard ILIKE queries.
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
