-- OASIS database schema. Safe to run more than once.

CREATE TABLE IF NOT EXISTS posts (
  id              serial PRIMARY KEY,
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  excerpt         text NOT NULL DEFAULT '',
  content         text NOT NULL DEFAULT '',
  cover_image_url text,
  published       boolean NOT NULL DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published, published_at DESC);

CREATE TABLE IF NOT EXISTS messages (
  id         serial PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL DEFAULT 'General enquiry',
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_created_idx ON messages (created_at DESC);

-- Uploaded files (images and PDFs), stored in chunks so each upload request
-- stays under Vercel's request size limit.
CREATE TABLE IF NOT EXISTS files (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  content_type text NOT NULL,
  size         integer NOT NULL,
  chunk_count  integer NOT NULL,
  complete     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS file_chunks (
  file_id uuid NOT NULL REFERENCES files (id) ON DELETE CASCADE,
  idx     integer NOT NULL,
  data    bytea NOT NULL,
  PRIMARY KEY (file_id, idx)
);

-- Posts are either blog posts or research, and can have a downloadable PDF.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'blog' CHECK (kind IN ('blog', 'research'));
ALTER TABLE posts ADD COLUMN IF NOT EXISTS pdf_file_id uuid REFERENCES files (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS posts_kind_published_idx ON posts (kind, published, published_at DESC);

-- Full-text search over posts. The expression must match SEARCH_DOCUMENT in lib/posts.ts.
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN ((
  setweight(to_tsvector('english', coalesce(title, '')), 'A')
  || setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  || setweight(to_tsvector('english', coalesce(content, '')), 'C')
));
