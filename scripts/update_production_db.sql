-- Database Update Script
-- Run this script on your production database to ensure all tables and columns exist.
-- This script is IDEMPOTENT: it is safe to run multiple times. It will NOT delete data.

BEGIN;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist in admins
DO $$
BEGIN
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE NOT NULL;
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL;
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS email VARCHAR(255);
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in admins';
END $$;

-- 2. Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist in blog_categories
DO $$
BEGIN
    ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS name VARCHAR(100) UNIQUE NOT NULL;
    ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE NOT NULL;
    ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in blog_categories';
END $$;

-- 3. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    author_id INTEGER REFERENCES admins(id),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Ensure all columns exist in blog_posts
DO $$
BEGIN
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE NOT NULL;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT NOT NULL;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image VARCHAR(500);
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[];
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES admins(id);
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in blog_posts';
END $$;

-- 4. Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all columns exist in blog_comments
DO $$
BEGIN
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE;
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS name VARCHAR(100) NOT NULL;
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL;
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS comment TEXT NOT NULL;
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;
    ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
EXCEPTION
    WHEN duplicate_column THEN RAISE NOTICE 'Column already exists in blog_comments';
END $$;

-- 5. Indexes (IF NOT EXISTS is supported natively for indexes in newer Postgres)
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

COMMIT;

-- Usage:
-- 1. Connect to your production database using your preferred SQL client (e.g., pgAdmin, DBeaver, or command line).
-- 2. Run this entire script.
-- 3. Verify that any missing tables or columns have been added.
