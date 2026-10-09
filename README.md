# FinanSee
Stack: Node.js 22–24, Express, PostgreSQL 16/Docker Compose, Prisma, HTML/CSS/JS e Chart.js.

## Rodar
1. Copie `.env.example` para `.env`
2. `docker compose up -d`
3. `npm install`
4. `npx prisma generate`
5. `npx prisma migrate dev --name init`
6. `npm run db:seed`
7. `npm run dev`
8. Abra `http://localhost:3000`

## Git
Registre a evolução real em vários commits, por exemplo:
`docs: adiciona visao e requisitos`
`chore: configura postgres com docker compose`
`feat: cria schema prisma`
`feat: implementa crud de transacoes`
`feat: integra dashboard`
`docs: registra revisao do uso da ia`
