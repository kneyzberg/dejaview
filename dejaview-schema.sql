CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  password TEXT NOT NULL
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  user_username TEXT NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL, 
  image_url TEXT
);

CREATE TABLE moviesandlists(
  list_id INTEGER NOT NULL REFERENCES lists , 
  movie_id INTEGER NOT NULL REFERENCES movies
);

CREATE TABLE ratings(
  user_username VARCHAR(25) NOT NULL REFERENCES users ON DELETE CASCADE, 
  movie_id INTEGER NOT NULL REFERENCES movies,
  rating NUMERIC NOT NULL
);