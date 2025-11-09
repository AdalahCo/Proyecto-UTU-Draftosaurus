CREATE DATABASE accounts;
USE accounts;

CREATE TABLE Users (
    gmail VARCHAR(100) PRIMARY KEY NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    lang varchar(20)
);

INSERT INTO Users (gmail, nombre, contraseña) VALUES
    ('AdalahBrowser@gmail.com', 'Admin', '$$2y$10$vgihVIHkLBCjAGD94Db7rudwETeFjzVZdb9MgDpgjS8NqIPkBRjSS'), /*ProyectoUTU2025*/
    ('Test@gmail.com', 'User', '$2y$10$5p6Pb/NfJ65/jlqcnpxFROQzr2nSC5XC9QsZVVfmxPJU8BprNP91W') /*12345*/