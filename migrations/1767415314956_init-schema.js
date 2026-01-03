/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // 1. Admins Table
    pgm.createTable('admins', {
        id: 'id',
        username: { type: 'varchar(50)', notNull: true, unique: true },
        password_hash: { type: 'varchar(255)', notNull: true },
        email: { type: 'varchar(255)' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });

    // 2. Blog Categories Table
    pgm.createTable('blog_categories', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true, unique: true },
        slug: { type: 'varchar(100)', notNull: true, unique: true },
        description: { type: 'text' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });

    // 3. Blog Posts Table
    pgm.createTable('blog_posts', {
        id: 'id',
        title: { type: 'varchar(255)', notNull: true },
        slug: { type: 'varchar(255)', notNull: true, unique: true },
        excerpt: { type: 'text' },
        content: { type: 'text', notNull: true },
        cover_image: { type: 'varchar(500)' },
        category_id: {
            type: 'integer',
            references: '"blog_categories"',
            onDelete: 'SET NULL',
        },
        tags: { type: 'text[]' },
        featured: { type: 'boolean', default: false },
        published: { type: 'boolean', default: false },
        author_id: {
            type: 'integer',
            references: '"admins"',
        },
        view_count: { type: 'integer', default: 0 },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        published_at: { type: 'timestamp' },
    });

    // Indexes for Blog Posts
    pgm.createIndex('blog_posts', 'slug');
    pgm.createIndex('blog_posts', 'category_id');
    pgm.createIndex('blog_posts', 'created_at');
    // Partial index for published posts
    pgm.createIndex('blog_posts', 'published', { where: 'published = true' });

    // 4. Blog Comments Table
    pgm.createTable('blog_comments', {
        id: 'id',
        post_id: {
            type: 'integer',
            references: '"blog_posts"',
            onDelete: 'CASCADE',
        },
        name: { type: 'varchar(100)', notNull: true },
        email: { type: 'varchar(255)', notNull: true },
        comment: { type: 'text', notNull: true },
        approved: { type: 'boolean', default: false },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
};

exports.down = pgm => {
    pgm.dropTable('blog_comments');
    pgm.dropTable('blog_posts');
    pgm.dropTable('blog_categories');
    pgm.dropTable('admins');
};
