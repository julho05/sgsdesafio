USE sgs_db;

-- Solicitantes
INSERT INTO solicitante (nome, cpf_cnpj) VALUES
('Ana Paula Ferreira',    '111.222.333-44'),
('Carlos Eduardo Lima',   '222.333.444-55'),
('Mariana Souza Costa',   '333.444.555-66'),
('Roberto Alves Neto',    '14.200.166/0001-00'),
('Fernanda Oliveira',     '444.555.666-77'),
('Tech Solutions Ltda',   '22.456.789/0001-11');

-- Categorias
INSERT INTO categoria (nome) VALUES
('Servicos'),
('Material'),
('Transporte'),
('Equipamentos'),
('Treinamento');

-- Solicitacoes
INSERT INTO solicitacao (solicitante_id, categoria_id, descricao, valor, data_solicitacao, status) VALUES
(1, 1, 'Contratacao de servico de limpeza mensal',         1500.00, '2026-05-01', 'SOLICITADO'),
(2, 2, 'Compra de resmas de papel A4',                      350.00, '2026-05-03', 'LIBERADO'),
(3, 3, 'Frete para entrega de materiais em filial',         800.00, '2026-05-05', 'APROVADO'),
(4, 4, 'Aquisicao de notebook para setor financeiro',      4500.00, '2026-05-10', 'REJEITADO'),
(5, 5, 'Curso de Excel avancado para equipe',              1200.00, '2026-05-12', 'CANCELADO'),
(6, 1, 'Manutencao de equipamentos de ar condicionado',    2300.00, '2026-05-15', 'SOLICITADO'),
(1, 3, 'Passagem aerea para reuniao em Sao Paulo',          980.00, '2026-05-20', 'LIBERADO');