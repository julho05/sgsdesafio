INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Ana Paula Ferreira', '111.222.333-44') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '111.222.333-44');

INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Carlos Eduardo Lima', '222.333.444-55') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '222.333.444-55');

INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Mariana Souza Costa', '333.444.555-66') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '333.444.555-66');

INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Roberto Alves Neto', '14.200.166/0001-00') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '14.200.166/0001-00');

INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Fernanda Oliveira', '444.555.666-77') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '444.555.666-77');

INSERT INTO solicitante (nome, cpf_cnpj)
SELECT * FROM (SELECT 'Tech Solutions Ltda', '22.456.789/0001-11') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM solicitante WHERE cpf_cnpj = '22.456.789/0001-11');

INSERT INTO categoria (nome)
SELECT * FROM (SELECT 'Servicos') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Servicos');

INSERT INTO categoria (nome)
SELECT * FROM (SELECT 'Material') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Material');

INSERT INTO categoria (nome)
SELECT * FROM (SELECT 'Transporte') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Transporte');

INSERT INTO categoria (nome)
SELECT * FROM (SELECT 'Equipamentos') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Equipamentos');

INSERT INTO categoria (nome)
SELECT * FROM (SELECT 'Treinamento') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Treinamento');