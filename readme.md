## ⏱️ Time Record Controller

### 📌 Visão Geral

Este projeto é um sistema completo de registro de ponto eletrônico, com suporte a jornadas fixas, registros com validação de janela de tempo, controle de horas extras, relatórios e cadastro de usuários. A aplicação foi desenvolvida com:

* ⚛️ **Frontend:** React + TailwindCSS
* 🐘 **Backend:** PHP (Slim Framework)
* 🐬 **Banco de Dados:** MySQL 8
* 🐳 **Infraestrutura:** Docker e Docker Compose
* 🧬 **Migrations:** Doctrine  migrations

---

### ✅ Funcionalidades Principais

* Registro de ponto com janelas validadas:

  * Entrada Manhã (07:45 → 08:15)
  * Saída Manhã (11:45 → 12:15)
  * Entrada Tarde (13:45 → 14:15)
  * Saída Tarde (17:45 → 18:15)
  * Hora Extra (após 18:15)
* Validação de registros duplicados e fora da ordem
* Cadastro de funcionários e controle de permissões (usuário/admin)
* Cálculo automático de horas trabalhadas
* Relatórios de jornada
* Interface moderna e responsiva

---

### 📁 Estrutura de Pastas

```
/timeRecordControllerFrontend  -> Aplicacao React
/timeRecordControllerBackend   -> API em Slim
/docker/mysql/init.sql         -> Script de criacao do banco
/docker-compose.yml            -> Orquestrador dos containers
```

---

### 🚀 Executando o Projeto (Primeira vez)

```bash
# 1. Clone o repositório
$ git clone https://github.com/Gustavolskw/registro_ponto
$ cd registro_ponto

# 2. Suba os containers com Docker
$ docker-compose up --build
```

Na primeira execução:

* As dependências PHP serão instaladas via `composer install` as mesmas sao executadas dinamicamente pelo `entrypoint.sh`
* As migrations serão executadas automaticamente pelo `entrypoint.sh`
* O banco MySQL será iniciado com credenciais do arquivo `.env`
* para a configuracao do `.env` existe um arquivo chamdo `.env-exemple` dentro da pasta do backend que pode ser compiado e alterado a configuracao do token jwt e as credenciais do banco de dados

---

### 🔁 Executando nas próximas vezes (sem rebuild)

```bash
$ docker-compose up
```

---

### 🧪 Executando as Migrations Manualmente

O `entrypoint.sh` do container backend já executa as migrations automaticamente. Mas, se precisar rodar manualmente:

```bash
$ docker exec -it time-record-controller-backend bash
$ php vendor/bin/doctrine-migrations migrations:migrate
```

---

### 📦 Banco de Dados

* Host: `localhost`
* Porta: `3307`
* Usuário: `root`
* Senha: `mysql`
* Banco padrão: definido no `init.sql`

Migrations criam:

* Tabelas de usuário, registros de ponto, tipos de registro
* Dados predefinidos (tipos de registro e usuário admin inicial)

---

### 🔑 Configuracao do passe seguro do Token JWT 

dentro do arquivo `.env` do backend, deve ser definido o `JWT_SECRET` que é usado para assinar os tokens JWT. É importante manter essa chave segura e não compartilhá-la publicamente.
ela pode ser gerada a partir do comando:

```bash
$ openssl rand -base64 32
```
segue um exemplo de chave gerada:
```bash
nwLJclR1laUHwu60CaXzS5LHk64qleI9eJLSf2D4z9Y=
```
e posteriormente colada no arquivo `.env` do backend

---

### 🔐📄 Arquivo `.env` Exemplo

```dotenv
DB_HOST=mysql
DB_NAME=TimeRecordController
DB_PORT=3306
DB_USER=root
DB_PASS=mysql
DB_DRIVER=mysql

JWT_SECRET="nwLJclR1laUHwu60CaXzS5LHk64qleI9eJLSf2D4z9Y="
```
---

### 🔐 Super Admin Padrão

* Matrícula: 1
* Senha: superadmin
