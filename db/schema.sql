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
