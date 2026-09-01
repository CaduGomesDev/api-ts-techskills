# primeira-ts-api

API REST de usuários com Express + TypeScript. Os dados ficam em um array na
memória, então tudo volta ao estado inicial quando o servidor reinicia.

## Como executar

```
npm install
npm run dev
```

Servidor em `http://localhost:3000`. `npm run build` compila para `dist/` e
`npm start` roda o que foi compilado.

## Rotas

| Método | Rota       | Respostas                                      |
| ------ | ---------- | ---------------------------------------------- |
| GET    | /users     | 200 com a lista                                |
| GET    | /users/:id | 200 com o usuário, 404 se não existir          |
| POST   | /users     | 201 com o criado, 400 se o corpo for inválido  |
| PUT    | /users/:id | 200 com o atualizado, 400 ou 404               |
| DELETE | /users/:id | 200 com o usuário removido, 404 se não existir |

O corpo do POST e do PUT precisa de `name` (string), `email` (string) e
`isActive` (boolean). O `id` é gerado pelo servidor.

```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","isActive":true}'
```
