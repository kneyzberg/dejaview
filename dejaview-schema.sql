CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY CHECK,
  name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL,
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id REFERENCES users DELETE ON CASCADE
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL, 
  image_url TEXT,
);

CREATE TABLE moviesandlists(
  list_id REFERENCES lists NOT NULL, 
  movie_id REFERENCES movies NOT NULL,
)

CREATE TABLE ratings(
  user_id REFERENCES users NOT NULL, 
  movie_id REFERENCES movies NOT NULL,
  rating NUMERIC NOT NULL
)