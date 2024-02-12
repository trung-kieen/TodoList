-- Comment if already have user trungkieen
CREATE USER 'trungkieen'@'localhost' IDENTIFIED BY 'supersecret';
CREATE DATABASE todolist_app;
GRANT ALL PRIVILEGES ON todolist_app.* TO 'trungkieen'@'localhost';
FLUSH PRIVILEGES;

