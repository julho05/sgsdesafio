# SGS — Sistema de Gestão de Solicitações

Sistema web para cadastrar, listar e acompanhar solicitações de pagamento, desenvolvido como desafio para vaga de Desenvolvedor Júnior.

---

## 📋 Sobre o Projeto

O SGS permite que uma empresa gerencie suas solicitações de pagamento de forma organizada. O usuário pode cadastrar solicitações, acompanhar o status de cada uma e alterar o fluxo de aprovação.

---

## ✅ Funcionalidades

- Listagem de solicitações com filtros por status, data e categoria
- Cadastro de novas solicitações
- Visualização detalhada de cada solicitação
- Alteração de status seguindo regras de negócio
- Consulta com SQL nativo usando JOIN entre as tabelas

---

## 🛠️ Tecnologias

| Tecnologia | Para que foi usada |
|---|---|
| Java 21 | Linguagem do backend |
| Spring Boot 3 | Framework para criar a API |
| Spring Data JPA | Conexão com o banco de dados |
| MySQL | Banco de dados |
| Maven | Gerenciador de dependências |
| HTML, CSS e JavaScript | Frontend da aplicação |
| Git e GitHub | Controle de versão |

---

## 🔄 Regras de Status

As solicitações seguem um fluxo definido. Nem todo status pode ir para qualquer outro:

```
SOLICITADO → LIBERADO
SOLICITADO → REJEITADO
LIBERADO   → APROVADO
LIBERADO   → REJEITADO
APROVADO   → CANCELADO
REJEITADO  → (estado final)
CANCELADO  → (estado final)
```

---

## 🗄️ Banco de Dados

O sistema usa 3 tabelas relacionadas:

| Tabela | O que armazena |
|---|---|
| `solicitante` | Nome e CPF/CNPJ de quem faz a solicitação |
| `categoria` | Tipos de solicitação (Serviços, Material, etc) |
| `solicitacao` | As solicitações em si |

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Java 21
- Maven
- MySQL

### Passo a passo

**1. Clonar o repositório**
```bash
git clone https://github.com/julho05/sgsdesafio.git
cd sgsdesafio
```

**2. Criar o banco de dados**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE sgs_db;
exit
```

**3. Configurar a senha do MySQL**

Abra o arquivo `src/main/resources/application.properties` e altere:
```properties
spring.datasource.password=SUA_SENHA
```

**4. Rodar o backend**
```bash
mvn spring-boot:run
```

Aguarde aparecer: `Started SgsApplication in X seconds`

**5. Abrir o frontend**

Abra o arquivo `frontend/index.html` diretamente no navegador.

> As tabelas e os dados iniciais são criados automaticamente pelo Spring Boot ao iniciar.

---

## 📡 Endpoints da API

| Método | Endpoint | O que faz |
|---|---|---|
| GET | `/api/solicitacoes` | Lista com filtros opcionais |
| GET | `/api/solicitacoes/{id}` | Detalhe de uma solicitação |
| POST | `/api/solicitacoes` | Cadastrar nova solicitação |
| PATCH | `/api/solicitacoes/{id}/status` | Atualizar status |
| GET | `/api/solicitacoes/auxiliares` | Retorna solicitantes e categorias |

### Exemplos de filtros

```
GET /api/solicitacoes?status=APROVADO
GET /api/solicitacoes?dataInicio=2026-05-01&dataFim=2026-05-31
GET /api/solicitacoes?categoriaId=1
```

---

## 📁 Estrutura do Projeto

```
sgs/
├── sql/
│   ├── schema.sql           # Criação das tabelas
│   └── data.sql             # Dados iniciais
├── frontend/
│   ├── index.html           # Estrutura da página
│   ├── style.css            # Estilo visual
│   └── script.js            # Lógica e comunicação com a API
└── src/main/java/com/sgs/sgs/
    ├── entity/              # Representação das tabelas em Java
    ├── enums/               # Status possíveis
    ├── repository/          # Acesso ao banco com SQL nativo
    ├── service/             # Regras de negócio
    └── controller/          # Endpoints da API
```
