-- Create the database
CREATE DATABASE IF NOT EXISTS tech_blog;

-- Use the database
USE tech_blog;

-- Create the `user` table
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `post` table
CREATE TABLE post (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_Id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_Id) REFERENCES user (id) ON DELETE CASCADE
);

-- Create the `comment` table
CREATE TABLE comment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  userId INT NOT NULL,
  postId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE
);

