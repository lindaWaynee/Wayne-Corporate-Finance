# WAYNE CORPORATE FINANCE

ERP administrativo e financeiro corporativo para operacao interna de BPO financeiro.

## Recursos entregues

- Portal executivo responsivo para desktop, notebook, Android e iPhone.
- Dashboard, clientes, contas a pagar/receber, fluxo, documentos, pendencias, impostos, checklist, protocolos, relatorios e configuracoes.
- API Express com autenticacao JWT, perfis de acesso e auditoria.
- Persistencia PostgreSQL modelada com Prisma e carga inicial corporativa.
- Exportacao de relatorios em CSV no portal e endpoints preparados para documentos.

## Execucao local

1. Copie `apps/api/.env.example` para `apps/api/.env`.
2. Suba o PostgreSQL: `docker compose up -d`.
3. Instale pacotes: `npm install`.
4. Gere e migre o banco: `npm run db:generate` e `npm run db:migrate`.
5. Carregue os registros iniciais: `npm run db:seed`.
6. Inicie portal e API: `npm run dev`.

O portal abre em `http://localhost:5173` e a API em `http://localhost:4000/api`.

## Acesso inicial

- E-mail: `diretoria@waynefinance.com.br`
- Senha: `Wayne@2026`

Troque a senha e a chave JWT antes de qualquer uso real.
