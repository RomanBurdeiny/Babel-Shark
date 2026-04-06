-- Права для vlasky:mysql / mysql-live-select (binlog, SHOW BINARY LOGS).
-- Выполняется только при первом создании тома. Уже поднятому MySQL — см. комментарий в docker-compose.yml.
GRANT REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO `babel_shark`@`%`;
FLUSH PRIVILEGES;
