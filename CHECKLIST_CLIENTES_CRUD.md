# Checklist de Ajustes CRUD de Clientes (Multi-Tenant)

## Backend
- [x] Implementar rotas REST para clientes:
  - [x] GET /api/customers
  - [x] POST /api/customers
  - [x] PUT /api/customers/:id
  - [x] DELETE /api/customers/:id
- [x] Validar dados recebidos com Zod (customerSchema)
- [x] Garantir autenticação JWT nas rotas de clientes
- [x] Retornar mensagens de erro claras para o frontend

## Frontend
- [x] Corrigir endpoints das chamadas de API para `/api/customers`
- [x] Garantir feedback visual (toast) para todas as operações (adicionar, editar, remover)
- [x] Validar que o CRUD está 100% funcional (adicionar, editar, remover, listar)
- [x] Tratar erros de integração e exibir mensagens amigáveis

## Testes
- [x] Testar cadastro de cliente (POST)
- [x] Testar edição de cliente (PUT)
- [x] Testar remoção de cliente (DELETE)
- [x] Testar listagem de clientes (GET)
- [x] Validar que o token JWT está sendo enviado corretamente

## Documentação
- [x] Atualizar documentação de endpoints e customização
- [x] Adicionar este checklist ao repositório

---
Marque cada item como concluído após validação. Se encontrar novos problemas, adicione ao checklist.
