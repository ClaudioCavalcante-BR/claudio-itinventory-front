# claudio-itinventory-front

Aplicação front-end do ecossistema ITInventory (Controller-Inventory), voltada ao controle de ativos de tecnologia. Esta interface web consome a API do projeto itinventory_equip (backend) e entrega autenticação, navegação por perfis e operações de inventário (CRUD e exportação CSV).

Mockup do front-end (wireframe)
1. Arquivo: docs/mockups/ITInventory_Wireframe_v1.1.pdf
2. Versão: ITInventory_Wireframe_v1.1

## Sumário

1. O que é o projeto
2. Objetivos
3. Principais funcionalidades
4. Stack de tecnologias
5. Arquitetura e diretrizes
6. Estrutura de pastas
6.1 Padrões de nomes
6.2 Estrutura sugerida para Busca Textual (Elasticsearch)
7. Como executar
8. Scripts NPM
9. Configurações e variáveis
10. Qualidade e padrões
11. Testes manuais sugeridos
12. Compatibilidade entre navegadores
13. Segurança e privacidade
14. Licença
15. Autor e repositórios relacionados

## 1. O que é o projeto

O claudio-itinventory-front é uma aplicação Web desenvolvida em React + Vite para operação de um inventário de equipamentos de TI. A aplicação foi desenhada para suportar cenários de controle de parque tecnológico, com autenticação via JWT, regras de visibilidade por perfil e integração com serviços de backend para consulta, manutenção e exportação de dados.

## 2. Objetivos

1. Centralizar a gestão do inventário de equipamentos de TI em uma interface Web única, simples e responsiva.
2. Permitir operação com diferentes perfis e restrições claras de acesso (incluindo rotas administrativas).
3. Fornecer fluxo completo de autenticação e consumo de API com token Bearer e tratamento de expiracao.
4. Entregar produtividade operacional com listagem, filtros, edição, ativação e inativação e exportação CSV.
5. Organizar a base de código com separação de responsabilidades (rotas, serviços, contexto, UI e paginas).

## 3. Principais funcionalidades

1. Autenticação e sessão
   1. Login com credenciais e obtenção de token JWT.
   2. Carregamento do perfil do usuário autenticado para controle de rotas e permissões.
   3. Logout e limpeza de token.
2. Equipamentos (inventário)
   1. Listagem com grid e paginação.
   2. Cadastro e edição.
   3. Exclusão conforme permissão.
   4. Exportação CSV conforme permissão.
3. Usuarios (administrativo)
   1. Listagem em grid com ações administrativas.
   2. Cadastro e edição.
   3. Ativação e inativação.
   4. Exportação CSV quando habilitada no backend.
4. Resiliência
   1. Interceptação de 401 e limpeza de token com redirecionamento para login.
   2. Interceptação de 403 para exibir bloqueio por permissão sem derrubar a sessão.
   3. Tratamento de mixed content quando o front estiver em HTTPS e a API em HTTP.

## 4. Stack de tecnologias

1. Base
   1. React 19.2
   2. Vite 7.2
2. UI
   1. MUI Material 7.3
   2. MUI X DataGrid 8.23
3. Roteamento
   1. react-router-dom 7.11
4. Estado e dados
   1. Redux Toolkit 2.11
   2. React Redux 9.2
   3. TanStack React Query 5.90
5. HTTP
   1. Axios 1.13
6. Qualidade e testes
   1. ESLint 9.39
   2. Vitest 4.0
   3. Testing Library React 16.3 e jest-dom 6.9
   4. jsdom 27.4

## 5. Arquitetura e diretrizes

1. Separação por responsabilidade
   1. pages concentra telas por módulo (Auth, Dashboard, Users e extensões futuras).
   2. components concentra componentes reutilizáveis (Layout, UI, Landing).
   3. routes centraliza o roteamento e os guards (PrivateRoute e AdminRoute).
   4. services centraliza integrações HTTP por domínio (api, AuthService, EquipmentService, UserService).
   5. context orquestra sessão e domínio, com providers e ações reutilizáveis.
   6. constants consolida enums e mapeamentos de exibição (status, labels e tipos).
   7. store concentra store e slices quando aplicável.
2. Diretrizes de segurança (camada front)
   1. Authorization Bearer token em rotas protegidas via interceptor.
   2. Token invalido ou expirado remove sessão e direciona para login.
   3. Falta de permissão (403) e tratada sem derrubar a sessão.
3. Diretrizes de UX
   1. Layout público separado do layout privado.
   2. Feedback de carregamento durante validação inicial da sessão.
   3. Componentização de UI básica para padronizar confirmações e badges.

## 6. Estrutura de pastas
```
claudio-itinventory-front/
├─ public/                                   --> Arquivos estáticos servidos na raiz (/)
│  ├─ bg-ativos.jpg                          --> Background (telas internas/ativos)
│  ├─ bg-ativos1.jpg                         --> Variante de background (telas internas)
│  ├─ bg-landing.jpg                         --> Background da Landing (tela pública)
│  └─ vite.svg                               --> Ícone padrão do Vite
│
├─ src/                                      --> Código-fonte principal (React)
│  ├─ assets/                                --> Imagens/arquivos importados por componentes
│  │  ├─ images/
│  │  │  └─ bg-landing.jpg                   --> Imagem usada na Landing (import)
│  │  └─ react.svg                           --> Asset padrão (placeholder/demonstração)
│  │
│  ├─ components/                            --> Componentes reutilizáveis (UI + Layout + Landing)
│  │  ├─ Demo/
│  │  │  └─ ClassClock.jsx                   --> Componente demonstrativo (relógio)
│  │  ├─ Landing/
│  │  │  ├─ Landing.jsx                      --> Tela pública de boas-vindas (hero/CTA)
│  │  │  └─ Landing.module.css               --> Estilos isolados da Landing
│  │  ├─ Layout/
│  │  │  ├─ AppLayout.jsx                    --> Casca do app privado (Sidebar + Header + conteúdo)
│  │  │  ├─ PublicLayout.jsx                 --> Casca das telas públicas (Landing/Login)
│  │  │  ├─ Header.jsx                       --> Topo (ações globais / identidade)
│  │  │  ├─ Sidebar.jsx                      --> Menu lateral (navegação do sistema)
│  │  │  └─ Footer.jsx                       --> Rodapé
│  │  └─ UI/
│  │     ├─ Card.jsx                         --> Wrapper visual (borda/sombra/padding)
│  │     ├─ ConfirmDialog.jsx                --> Modal de confirmação (ex.: excluir)
│  │     └─ StatusBadge.jsx                  --> Selo visual para status (ativo/inativo etc.)
│  │
│  ├─ constants/                             --> Constantes e mapeamentos (enums/labels)
│  │  ├─ equipmentEnums.js                   --> Enums/labels de Equipment (type/status etc.)
│  │  └─ status.js                           --> Mapeamento de status (valor vs texto amigável)
│  │
│  ├─ context/                               --> Context API (sessão e domínio)
│  │  ├─ AuthContext.jsx                     --> Autenticação (login/logout, token, perfil, loading)
│  │  └─ AssetsContext.jsx                   --> Domínio “equipments” (CRUD, reload, integração UI)
│  │
│  ├─ forms/                                 --> Blocos funcionais (Ativos/Equipamentos)
│  │  ├─ AssetList.jsx                       --> Lista (tabela/filtro/ações/export)
│  │  ├─ AssetItem.jsx                       --> Item/linha (ações edit/delete)
│  │  └─ AssetForm.jsx                       --> Formulário criar/editar (validação + submit)
│  │
│  ├─ pages/                                 --> Telas por módulo
│  │  ├─ Auth/
│  │  │  ├─ LoginPage.jsx                    --> Tela de login (integra com AuthContext)
│  │  │  ├─ LoginPage.module.css             --> Estilos isolados do login
│  │  │  └─ RegisterUserPage.jsx             --> Tela alternativa/legada de cadastro (Auth)
│  │  ├─ Dashboard/
│  │  │  └─ Dashboard.jsx                    --> Painel principal (visão geral/indicadores)
│  │  └─ Users/
│  │     ├─ UserListPage.jsx                 --> Gestão de usuários (ADMIN) com DataGrid/ações
│  │     ├─ UserEditPage.jsx                 --> Edição de usuário (ADMIN)
│  │     ├─ RegisterUserPage.jsx             --> Cadastro de usuário (ADMIN)
│  │     ├─ RegisterUserPage.module.css      --> Estilos isolados do cadastro
│  │     ├─ userListColumns.jsx              --> Colunas do DataGrid (Users)
│  │     ├─ userListUi.js                    --> Helpers de UI (diálogos/formatadores)
│  │     └─ userListUtils.js                 --> Helpers utilitários (regras/normalizações)
│  │
│  ├─ routes/                                --> Rotas e proteção por autenticação/perfil
│  │  ├─ Router.jsx                          --> Tabela de rotas + layouts (público/privado/admin)
│  │  ├─ PrivateRoute.jsx                    --> Guard: exige usuário autenticado
│  │  └─ AdminRoute.jsx                      --> Guard: exige perfil ADMIN
│  │
│  ├─ services/                              --> Integração HTTP com o backend (Axios)
│  │  ├─ api.js                              --> Axios base + interceptors (Bearer, 401/403, HTTPS PROD)
│  │  ├─ AuthService.js                      --> Endpoints de autenticação (/login, /my-profile)
│  │  ├─ EquipmentService.js                 --> CRUD/export de equipamentos (/api/equipments)
│  │  ├─ UserService.js                      --> CRUD/export/ativação de usuários (/api/usuarios)
│  │  └─ __tests__/                          --> Testes unitários dos services
│  │     ├─ api.headers.test.js              --> Validação de headers/interceptors
│  │     ├─ api.ngrok-header.test.js         --> Header específico (cenário túnel/dev)
│  │     ├─ api.security.test.js             --> Regras de segurança (HTTPS em PROD)
│  │     ├─ EquipmentService.fetch.test.js   --> Testes de listagem/busca
│  │     ├─ EquipmentService.crud.test.js    --> Testes CRUD
│  │     └─ EquipmentService.export.test.js  --> Testes exportação CSV
│  │
│  ├─ store/
│  │  └─ index.js                            --> Redux Toolkit (slice de assets: items/filter/reducers)
│  │
│  ├─ styles/
│  │  └─ globals.css                         --> Estilos globais (tokens/tema/layout base)
│  │
│  ├─ test/
│  │  └─ setup.js                            --> Setup do ambiente de testes
│  │
│  ├─ App.jsx                                --> Componente raiz do app
│  ├─ main.jsx                               --> Bootstrap (Router + Contexts + Redux + React Query)
│  ├─ App.css                                --> Estilos gerais do App
│  └─ index.css                              --> CSS base carregado no entrypoint
│
├─ .env.local                                --> Variáveis do ambiente local (ex.: baseURL)
├─ .env.test                                 --> Variáveis do ambiente de testes
├─ .env.example                              --> Modelo de variáveis esperadas (referência)
├─ .gitignore                                --> Arquivos/pastas ignorados no Git
├─ eslint.config.js                          --> Regras de lint
├─ index.html                                --> Template HTML do Vite (mount do React no #root)
├─ package.json                              --> Dependências + scripts (dev/build/test)
├─ package-lock.json                         --> Lock das versões das dependências
├─ vite.config.js                            --> Configuração do Vite (plugins/build/aliases)
└─ README.md                                 --> Documentação do projeto
```

Visao objetiva das pastas mais relevantes

1. public
   1. Arquivos estáticos servidos diretamente (imagens de background e assets).
2. src
   1. assets (assets importados por componentes)
   2. components (Layout, UI, Landing e componentes reutilizáveis)
   3. constants (enums e mapeamentos de exibição)
   4. context (AuthContext e AssetsContext)
   5. forms (formularios e listagens do dominio de equipamentos)
   6. pages (telas por módulo)
   7. routes (Router e guards)
   8. services (api e services por domínio, incluindo testes em services/__tests__)
   9. store (Redux store e slices quando aplicável)
   10. styles (tokens e estilos globais)
   11. test (setup comum para testes)

### 6.1 Padrões de nomes

1. Componentes React
   1. PascalCase (exemplo: UserListPage.jsx)
   2. Um componente por arquivo quando possivel
2. Paginas
   1. src/pages/Módulo/NomeDaPagina.jsx
   2. Sufixo Page quando for tela principal
3. Serviços
   1. src/services/NomeService.js
   2. Testes de serviços em src/services/__tests__/Nome.test.js
4. Estilos
   1. CSS Modules com sufixo .module.css quando for estilo por componente
   2. Estilos globais em src/styles
5. Variáveis de ambiente
   1. Sempre com prefixo VITE_

### 6.2 Estrutura sugerida para Busca Textual (Elasticsearch)

Objetivo
Criar uma tela independente para busca textual de equipamentos, consultando endpoint de search no backend (Elasticsearch via API), com resultados paginados, filtros e exportação.

Sugestao de organizacao

1. src/pages/Search
   1. EquipmentTextSearchPage.jsx
   2. EquipmentTextSearchPage.module.css
2. src/services
   1. SearchService.js
3. src/components/Search
   1. SearchBar.jsx
   2. SearchFilters.jsx
   3. SearchResultGrid.jsx
   4. SearchResultActions.jsx
   5. SearchEmptyState.jsx
4. src/routes
   1. Adicionar rota privada /search/equipments (ou /equipments/text-search) usando PrivateRoute
5. src/store ou src/context
   1. searchSlice.js (opcional) ou SearchContext.jsx (alternativa)

## 7. Como executar

### 7.1 Pré-requisitos

1. Node.js LTS 18 ou 20
2. NPM
3. Git
4. Backend itinventory_equip em execucao e acessivel pela URL configurada

### 7.2 Instalação no macOS

1. Instale Node.js LTS e Git
2. Valide as versões
   node -v
   npm -v
3. Siga a seção 7.4 para clonar e rodar

### 7.3 Instalação no Windows

1. Instale Node.js LTS e Git
2. Valide as versões no PowerShell ou Terminal
   node -v
   npm -v
3. Siga a seção 7.4 para clonar e rodar

### 7.4 Clonar e rodar

1. Clone o repositório
   git clone URL_DO_REPOSITORIO
2. Entre na pasta
   cd claudio-itinventory-front
3. Configure variáveis de ambiente
   1. Copie .env.example para .env.local
   2. Ajuste VITE_API_BASE_URL para a URL do backend (exemplo: http://localhost:8081)
4. Instale dependencias
   npm install
5. Execute em modo desenvolvimento
   npm run dev
6. Build e preview (opcional)
   npm run build
   npm run preview

Observacoes
1. Se o front estiver em HTTPS e o backend em HTTP, o navegador pode bloquear por mixed content. Em publicacao, prefira backend em HTTPS.
2. Garanta que CORS esteja configurado no backend para permitir a origem do front.

## 8. Scripts NPM

1. npm run dev
2. npm run build
3. npm run preview
4. npm run lint
5. npm run test
6. npm run test:run
7. npm run test:coverage

## 9. Configurações e variáveis

Arquivos de referência
1. .env.example
2. .env.local (não versionar)
3. .env.test (modo de testes)

Variáveis
1. VITE_API_BASE_URL
2. VITE_API_TIMEOUT

Valores padrão (exemplo)
1. VITE_API_BASE_URL=http://localhost:8081
2. VITE_API_TIMEOUT=15000

## 10. Qualidade e padrões

1. ESLint para padronização e prevenção de erros
2. Services centralizados com API client único e interceptors
3. Estrutura modular por paginas e módulos
4. Testes automatizados em services/__tests__ com Vitest
5. Separação clara entre UI, regras de rota e integração HTTP

## 11. Testes manuais sugeridos

1. Autenticação
   1. Login valido e acesso ao dashboard
   2. Login invalido e mensagem de erro
   3. Logout e bloqueio de rotas privadas
2. Permissões
   1. Usuário não ADMIN tentando acessar /users deve ser bloqueado
   2. ADMIN acessando /users deve ver listagem e ações
3. Equipamentos
   1. Listar e paginar
   2. Cadastrar, editar e validar persistência no backend
   3. Exportar CSV e validar download
4. Resiliência
   1. Forçar 401 (token expirado) e validar retorno ao login
   2. Forçar 403 e validar que a sessão não é derrubada

## 12. Compatibilidade entre navegadores

1. Recomenda-se validar as telas principais em Chrome e Firefox.
2. Em macOS, recomenda-se validar Safari quando o front estiver publicado em HTTPS.
3. Se houver diferenças de renderização no DataGrid, revise CSS global e wrappers de scroll.

## 13. Segurança e privacidade

1. Autenticação
   1. JWT armazenado no localStorage e enviado no header Authorization.
   2. Em caso de token invalido, a sessão e encerrada no front.
2. Rotas
   1. Rotas privadas exigem autenticação.
   2. Rotas administrativas exigem perfil permitido.
3. Transporte
   1. Em publicação, prefira HTTPS para evitar mixed content e reduzir risco de interceptação.
4. Privacidade
   1. Evite armazenar dados sensíveis no front além do necessário para sessão.
   2. Evite logs em console em produção contendo informações internas.

## 14. Licença

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 15. Autor e repositórios relacionados

1. Autor: ClaudioCavalcante-BR
2. Repositórios relacionados
   1. Front-end: claudio-itinventory-front(https://github.com/ClaudioCavalcante-BR/claudio-itinventory-front)
   2. Backend: itinventory_equip(https://github.com/ClaudioCavalcante-BR/itinventory_equip)

