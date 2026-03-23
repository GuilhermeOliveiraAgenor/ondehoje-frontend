# 🚀 Onde Hoje - Frontend

Interface web da aplicação Onde Hoje, responsável pela interação do usuário com a plataforma de descoberta de eventos e estabelecimentos.

O frontend consome a API desenvolvida em **Node.js** com **NestJS**, responsável pela autenticação, geolocalização, **pagamentos** e gerenciamento dos dados da aplicação.

## 🔗 Backend API

https://github.com/GuilhermeOliveiraAgenor/ondehoje-backend

## 📌 About

O Onde Hoje é uma aplicação web desenvolvida com **Next.js** que conecta usuários a eventos e estabelecimentos de entretenimento de forma inteligente, utilizando filtros, categorias e geolocalização.

A interface foi desenvolvida com foco em performance e experiência do usuário, permitindo que usuários encontrem opções próximas com base na sua localização, enquanto empresas podem divulgar seus eventos dentro da plataforma.

💳 A monetização da plataforma é realizada através de planos de divulgação pagos por meio da plataforma **Stripe**, permitindo que empresas promovam seus eventos e estabelecimentos dentro da aplicação.

A aplicação utiliza **React Query** para gerenciamento de estado assíncrono, **TailwindCSS** e **shadcn/ui** para construção da interface, além de **React Hook Form + Zod** para validação de formulários e login social com **Google Auth**.

>📄 Acesse a documentação completa:
><br>
>👉 [Documentação Onde Hoje](https://drive.google.com/file/d/1AV04oNaKpU44M1bavN1ACDR9V1wlY6sS/view?usp=sharing)


## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido em equipe como parte de um **Trabalho de Conclusão de Curso (TCC)**, com **5 integrantes**, envolvendo desde a concepção da arquitetura até a implementação completa do sistema.

A gestão do projeto foi realizada com **Jira**, garantindo organização, divisão de tarefas e acompanhamento do progresso, sempre com foco em colaboração e entrega contínua.

## 📷 Interface

**Tela principal da aplicação**
<p align="center"> <img src="./home-menu.png" width="1000"> </p>
<b>Detalhes do evento</b>
<p align="center"> <img src="./event-details.png" width="1000"> </p>
<b>Tela de pagamento</b>
<p align="center"> <img src="./payment.png" width="1000"> </p>


## ⚙️ Features

- Gestão de eventos, estabelecimentos e anúncios
- Busca e filtros de eventos e estabelecimentos
- Integração com Stripe para pagamentos
- Geolocalização com Mapbox
- Autenticação com Google (OAuth)
- Geração de cupons promocionais
- Interface de moderação de conteúdo

## 🛠️ Tech Stack
- TypeScript
- React
- Next.js
- React Query
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod


## 🏗️ Estrutura do projeto

A estrutura do projeto é organizada em **módulos de funcionalidades** e **componentes reutilizáveis**, promovendo melhor organização do código e maior facilidade na evolução da aplicação.

```text
src
├─ app
├─ auth
├─ components
├─ hooks
├─ lib
├─ modules
│  └─ class
│     ├─ components
│     ├─ hooks
│     ├─ schemas
│     ├─ services
│     └─ types
└─ utils
```

### Descrição das principais pastas

- app → rotas e páginas da aplicação utilizando o App Router do Next.js
- auth → gerenciamento de autenticação e sessão do usuário
- components → componentes reutilizáveis da interface
- hooks → hooks globais da aplicação
- lib → utilitários e configurações compartilhadas
- modules → organização das funcionalidades do sistema

## ▶️ Run

### 1️⃣ Clone o repositório
```
git clone https://github.com/GuilhermeOliveiraAgenor/ondehoje-frontend.git
cd ondehoje-frontend
```

### 2️⃣ Instalar dependências
```
npm install
```

### 3️⃣ Configurar variáveis de ambiente
Utilize o `.env.example` como base para configurar o arquivo `.env`.
```
cp .env.example .env
```

### 4️⃣ Iniciar aplicação

```
npm run dev
```

## 📌 Observação

Este projeto foi originalmente desenvolvido em um repositório privado durante o TCC e posteriormente publicado neste repositório.

📄 A documentação completa do projeto está disponível acima e detalha toda a construção da aplicação.

