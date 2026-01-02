-- VRPL Database Initialization Script
-- Run this in your Omnicore Database SQL Editor

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    author_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Blog Comments Table
CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert Default Admin (if not exists)
-- Username: admin
-- Password: ChangeMe123!
INSERT INTO admins (username, password_hash, email) 
VALUES (
    'admin', 
    '$2a$10$Df0jWOxfmbrUedNbFhqNPuNFqocEbJxrvnUTKlH5Y9FDKwNOjzL1S', 
    'admin@vrpl.com'
) 
ON CONFLICT (username) DO NOTHING;

-- 6. Insert Default Initial Categories (Optional)
INSERT INTO blog_categories (name, slug, description)
VALUES 
    ('Sustainability', 'sustainability', 'Articles about environmental impact and sustainable practices'),
    ('Technology', 'technology', 'Updates on our plasma gasification technology'),
    ('News', 'news', 'Latest news and announcements from VRPL')
ON CONFLICT (slug) DO NOTHING;
