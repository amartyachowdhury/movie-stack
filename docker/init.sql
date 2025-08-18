-- Initialize the movie_stack database
CREATE DATABASE IF NOT EXISTS movie_stack;
\c movie_stack;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The actual tables will be created by SQLAlchemy
-- This file can be used for any additional database setup
