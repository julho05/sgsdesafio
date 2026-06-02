CREATE DATABASE IF NOT EXISTS sgs_db;
USE sgs_db;


CREATE TABLE IF NOT EXISTS solicitante (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    cpf_cnpj   VARCHAR(18)  NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS categoria (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS solicitacao (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    solicitante_id   BIGINT         NOT NULL,
    categoria_id     BIGINT         NOT NULL,
    descricao        VARCHAR(500)   NOT NULL,
    valor            DECIMAL(15, 2) NOT NULL,
    data_solicitacao DATE           NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'SOLICITADO',

    CONSTRAINT fk_solicitante FOREIGN KEY (solicitante_id) REFERENCES solicitante(id),
    CONSTRAINT fk_categoria   FOREIGN KEY (categoria_id)   REFERENCES categoria(id)
);