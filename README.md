# SGS — Sistema de Gestão de Solicitações

Sistema web para gerenciar solicitações de pagamento, desenvolvido como desafio para vaga de Desenvolvedor Júnior.

---

## Sobre o Projeto

O SGS permite que uma empresa registre, consulte e acompanhe solicitações de pagamento com controle de fluxo e status.

---

## Tecnologias Necessárias

Antes de rodar o projeto, certifique-se de ter instalado:

| Tecnologia | Versão |
|---|---|
| Java | 21 |
| Maven | 3.9+ |
| MySQL | 8+ |
| Git | Qualquer |

---

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/julho05/sgsdesafio.git
cd sgsdesafio
```

### 2. Criar o banco de dados

```bash
mysql -u root -p
```

```sql
CREATE DATABASE sgs_db;
exit
```

### 3. Configurar a senha do MySQL

Abra o arquivo `src/main/resources/application.properties` e altere:

```properties
spring.datasource.password=SUA_SENHA
```

### 4. Rodar o backend

```bash
mvn spring-boot:run
```

Aguarde aparecer: `Started SgsApplication in X seconds`

### 5. Abrir o frontend

Abra o arquivo `frontend/index.html` diretamente no navegador.

> As tabelas e os dados iniciais são criados automaticamente pelo Spring Boot ao iniciar.

---

## Scripts SQL

Os scripts estão na pasta `sql/` na raiz do projeto:

- `sql/schema.sql` — criação das tabelas
- `sql/data.sql` — dados iniciais

```sql
CREATE DATABASE IF NOT EXISTS sgs_db;
USE sgs_db;

CREATE TABLE IF NOT EXISTS solicitante (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome     VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(18)  NOT NULL UNIQUE
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
```

---

## Decisões Técnicas

**SQL nativo na listagem**
A listagem usa `@Query(nativeQuery = true)` com INNER JOIN entre as 3 tabelas e filtros dinâmicos. A técnica `:parametro IS NULL OR coluna = :parametro` permite usar a mesma query com ou sem filtros.

**Arquitetura em 3 camadas**
Controller, Service e Repository. Cada camada tem uma responsabilidade única — o Controller recebe as requisições, o Service contém as regras de negócio e o Repository acessa o banco.

**Regras de transição de status**
Implementadas no Service usando switch expression do Java 21. Cada status só pode ir para status específicos — por exemplo, SOLICITADO só pode ir para LIBERADO ou REJEITADO.

**BigDecimal para valores monetários**
O tipo `double` foi descartado por ter erros de precisão em operações decimais. O `BigDecimal` garante aritmética exata para valores financeiros.

---