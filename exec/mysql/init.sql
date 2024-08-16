CREATE DATABASE IF NOT EXISTS battlepeople;

-- Create admin user
CREATE USER 'bunnies'@'%' IDENTIFIED BY 'VhGjVihJtfVUzhsT7m8y';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'bunnies'@'%';

-- Create developer user
CREATE USER 'rabbits'@'%' IDENTIFIED BY 'kevinhomealone';
GRANT SELECT, INSERT, UPDATE, DELETE ON battlepeople.* TO 'rabbits'@'%';

FLUSH PRIVILEGES;

DROP USER 'root'@'%';

FLUSH PRIVILEGES;
