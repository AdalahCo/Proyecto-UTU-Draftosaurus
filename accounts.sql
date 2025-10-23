CREATE DATABASE accounts;
USE accounts;

CREATE TABLE Users (
    gmail VARCHAR(100) PRIMARY KEY NOT NULL,
    nombre VARCHAR(20) NOT NULL,
    contraseña VARCHAR(20) NOT NULL,
    lang varchar(20)
);

INSERT INTO Users (gmail, nombre, contraseña) VALUES
    ('AdalahBrowser@gmail.com', 'Admin', 'ProyectoUTU2025'),
    ('Test@gmail.com', 'User', '12345')