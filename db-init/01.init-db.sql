/* users table */
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
