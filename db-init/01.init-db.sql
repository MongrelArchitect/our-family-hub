/* users table */
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* need a replacement user for content created by deleted accounts */
INSERT INTO users (
  email,
  name
) VALUES (
  'deleted@ourfamilyhub.net',
  'Former Member'
);

/* families table */
CREATE TABLE IF NOT EXISTS families (
  id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL REFERENCES users(id),
  surname TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* junction table to match users with a family*/
CREATE TABLE IF NOT EXISTS family_members (
  family_id INT NOT NULL REFERENCES families(id),
  member_id INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (family_id, member_id)
);

/* invites table for admin to invite users to join a family */
CREATE TABLE IF NOT EXISTS invites (
  user_id INT NOT NULL REFERENCES users(id),
  family_id INT NOT NULL REFERENCES families(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, family_id)
);

/* todo lists table */
CREATE TABLE IF NOT EXISTS todo_lists (
  id SERIAL PRIMARY KEY,
  family_id INT NOT NULL REFERENCES families(id),
  created_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT
);

/* tasks that each todo_list can have */
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  todo_list_id INT NOT NULL REFERENCES todo_lists(id),
  created_by INT NOT NULL REFERENCES users(id),
  assigned_to INT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  details TEXT,
  due_by TIMESTAMPTZ,
  done BOOLEAN NOT NULL DEFAULT false
);

/* table for discussion threads */
CREATE TABLE IF NOT EXISTS threads (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL REFERENCES users(id),
  family_id INT NOT NULL REFERENCES families(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* table for thread posts */
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  author_id INT NOT NULL REFERENCES users(id),
  thread_id INT NOT NULL REFERENCES threads(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* table for calendar events */
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  family_id INT NOT NULL REFERENCES families(id),
  created_by INT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  details TEXT,
  event_date TIMESTAMPTZ NOT NULL
);
