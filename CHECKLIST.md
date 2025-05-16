# Checklist Festa Mesa Gest

## Testes Funcionais
- [x] Testar o fluxo de login/logout no frontend
- [x] Testar a criação automática do usuário admin
- [x] Testar requisições protegidas via Postman (com token JWT)
- [ ] Testar navegação e permissões de acesso para diferentes perfis de usuário

## Qualidade e Manutenção
- [x] Criar um arquivo CHECKLIST.md no projeto para acompanhamento
- [ ] Adicionar logs mais detalhados no backend para facilitar debug
- [ ] Documentar endpoints principais da API (README ou Swagger)
- [ ] Adicionar tratamento de erros global no backend

## Segurança
- [ ] Garantir que senhas nunca sejam logadas ou expostas
- [ ] Validar e sanitizar todos os dados recebidos nas rotas
- [ ] Implementar CORS restritivo para produção

## Testes Automatizados
- [ ] Adicionar testes unitários para funções críticas do backend
- [ ] Adicionar testes de integração para rotas de autenticação

## Migração de Dados Mockados para Banco Real
- [x] Remover mocks da página Dashboard
- [x] Remover mocks da página Orders
- [x] Remover mocks da página Tables
- [x] Remover mocks da página Kitchen
- [x] Remover mocks da página Employees
- [x] Remover mocks da página Customers
- [x] Remover mocks da página Inventory
- [x] Refatorar Inventory para consumir dados reais da API de produtos
- [x] Validar visualmente que os dados exibidos são reais
- [x] Remover mocks da página FinancesRestaurant
- [x] Remover mocks da página FinancesRental
- [x] Remover mocks da página Rentals
- [x] Remover mocks da página Reservations
- [x] Validar persistência real em cada tela
