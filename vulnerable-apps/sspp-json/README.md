# Lab: Server-side Parameter Pollution (JSON)

Variante de SSPP em structured data formats: a rota `PATCH /users/:userId`
copia o corpo JSON recebido direto para o objeto do usuario, sem validar
quais campos podem ser alterados. Um usuario comum consegue se promover
a admin enviando `isAdmin: true` no body.

## Como rodar

```
docker compose up --build
```

Depois abra http://localhost:3000

Contas de teste:
- alice / 1234            (usuario comum)
- bob   / hunter2         (usuario comum)
- root  / verylongpassword (admin)

## Objetivo

1. Logar como `alice` e observar que `GET /users/:id` devolve o campo
   `isAdmin` no JSON.
2. Clicar em "Rodar teste" para confirmar que a vulnerabilidade existe.
   O teste loga como alice, manda `PATCH` com `isAdmin: true` no body
   e checa se o campo realmente mudou.
3. Editar `backend/server.js` para corrigir a rota `PATCH /users/:userId`,
   aceitando apenas os campos que o cliente tem permissao para alterar.
4. Reiniciar o container (`docker compose up --build`) e rodar o teste
   novamente. Quando o teste reportar `[SEGURO]`, o desafio esta completo.

## Dica de correcao

Em vez de iterar sobre `req.body` inteiro, extraia apenas os campos
permitidos:

```js
const { name, age, skinColor, favoriteAnimal } = req.body;
```

E aplique apenas esses no objeto do usuario.
