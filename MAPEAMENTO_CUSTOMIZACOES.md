# Mapeamento de Configurações e Customizações das Páginas

Este arquivo serve como guia rápido para desenvolvedores localizarem onde alterar configurações visuais, integrações com API e funcionais das principais páginas do sistema. Para cada página, há comentários indicando os pontos de customização mais comuns.

---

## Dashboard (`src/pages/Dashboard.tsx`)
- **Alterar cards/resumo:**
  - Os cards são renderizados pelo componente `DashboardCard`. Para mudar o layout, cor, ou ícones, altere o componente `DashboardCard` no início do arquivo.
  - Para adicionar/remover cards, edite o array de cards dentro do `return` do componente principal.
- **Alterar requisições de dados (integração com API):**
  - As chamadas para a API estão na função `fetchDashboardData` (dentro do `useEffect`).
  - Para trocar endpoints, alterar parâmetros ou tratar respostas, edite essa função.
  - Os endpoints utilizados são:
    - `/api/dashboard/stats`
    - `/api/dashboard/recent-orders`
    - `/api/dashboard/recent-rentals`
  - O serviço de requisições está em `src/services/api.ts`.

---

## Mesas (`src/pages/Tables.tsx`)
- **Alterar cor dos cards de mesa:**
  - O mapeamento de cor está em `src/components/tables/TableTypes.ts` na função `getTableColorClass`.
  - Para mudar a cor de cada status ("disponível", "ocupada", "reservada"), altere o retorno dessa função.
- **Diminuir o tamanho dos cards:**
  - O tamanho dos cards é definido no componente `TableCard` em `src/components/tables/TableCard.tsx`.
  - Altere as classes CSS ou propriedades de tamanho neste componente.
- **Adicionar/Remover ações de mesa:**
  - As ações (reservar, liberar, editar) estão em `TableActionDialog.tsx`.
- **Alterar integração com API:**
  - As requisições de mesas estão em `src/services/api.ts` (função `getTables`).
  - Para alterar endpoints ou parâmetros, edite essa função e o uso dela em `Tables.tsx`.

---

## Reservas (`src/pages/Reservations.tsx`)
- **Alterar formulário de nova reserva:**
  - O formulário está no início do arquivo ou em um componente separado (ex: `ReservationForm`).
  - Para adicionar campos, edite o JSX do formulário.
- **Alterar exibição da lista de reservas:**
  - A tabela/lista de reservas está no corpo do componente principal.
- **Alterar integração com API:**
  - As chamadas para reservas estão em `src/services/api.ts` (funções como `getReservations`, `createReservation`).
  - Para trocar endpoints ou tratar respostas, edite essas funções e o uso delas em `Reservations.tsx`.

---

## Locações (`src/pages/Rentals.tsx`)
- **Alterar campos exibidos:**
  - Os campos exibidos vêm do array de locações, renderizado no corpo do componente.
  - Para adicionar/remover campos, altere o mapeamento do array `rentals`.
- **Alterar integração com API:**
  - As requisições de locações estão em `src/services/api.ts` (função `getRentals`).
  - Para alterar endpoints, parâmetros ou tratamento de dados, edite essa função e o uso dela em `Rentals.tsx`.

---

## Financeiro (`src/pages/FinancesRestaurant.tsx` e `src/pages/FinancesRental.tsx`)
- **Alterar cards e gráficos:**
  - Os cards são definidos no corpo do componente. Para mudar layout ou cor, altere as classes CSS ou componentes de card.
  - Gráficos geralmente usam bibliotecas externas (ex: Chart.js). O componente do gráfico pode estar em um arquivo separado.
- **Alterar integração com API:**
  - As chamadas para dados financeiros estão em funções do `src/services/api.ts` (ex: `getFinanceData`).
  - Para trocar endpoints ou lógica, edite essas funções e o uso delas nas páginas financeiras.

---

## Clientes (`src/pages/Customers.tsx`)
- **Alterar colunas da tabela:**
  - As colunas são definidas no array de colunas ou diretamente no JSX da tabela.
- **Alterar formulário de cadastro:**
  - O formulário está no início do arquivo ou em um componente separado.
- **Alterar integração com API:**
  - As funções de clientes estão em `src/services/api.ts` (ex: `getCustomers`, `createCustomer`).
  - Para trocar endpoints, edite essas funções e o uso delas em `Customers.tsx`.

---

## Funcionários (`src/pages/Employees.tsx`)
- **Alterar permissões/campos:**
  - Os campos exibidos e permissões são definidos no corpo do componente.
- **Alterar integração com API:**
  - As funções de funcionários estão em `src/services/api.ts` (ex: `getEmployees`).
  - Para trocar endpoints, edite essas funções e o uso delas em `Employees.tsx`.

---

## Observações Gerais
- **Cores e temas globais:**
  - Estão definidos em arquivos de configuração do Tailwind (`tailwind.config.ts`) ou CSS global (`src/App.css`).
- **Componentes reutilizáveis:**
  - Cards, botões, inputs e outros estão em `src/components/ui/`.
- **Para qualquer ajuste visual, procure primeiro pelo componente correspondente em `src/components/` e depois pelo uso dele na página desejada.**
- **Para qualquer ajuste de integração com API, procure primeiro por funções em `src/services/api.ts` e depois pelo uso delas na página desejada.**

---

> **Dica:** Use a busca do VSCode para localizar rapidamente componentes, funções de API ou pontos de integração citados acima.
