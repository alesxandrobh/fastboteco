# Alterações - 16/05/2025

## Multi-Tenant e Cadastro de Clientes/Estabelecimentos
- Adicionado formulário no frontend para cadastro de novo cliente/estabelecimento e criação de banco de dados dedicado.
- Adicionado componente TenantRegistration para cadastro multi-tenant.
- Página de configurações agora permite cadastrar clientes e criar bancos automaticamente.

## Backend
- Adicionado endpoint `/api/tenants` para cadastro de cliente e criação automática do banco de dados, incluindo execução do script de estrutura.
- Salva informações do cliente na tabela central `tenants`.

## Refatoração e Escalabilidade
- Estrutura preparada para multi-tenancy, permitindo que cada restaurante/bar utilize seu próprio banco de dados.
- Ajustes de tipagem e organização para facilitar manutenção e evolução do sistema.

## Observações
- Próximos passos: adaptar autenticação e seleção dinâmica do banco conforme o cliente logado.
- Correções de tipagem e melhorias de UX podem ser aplicadas conforme uso.
