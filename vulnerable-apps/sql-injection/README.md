# Lab: SQL Injection

Aplicacao de uma livraria com login e busca de produtos. As consultas SQL
sao montadas concatenando strings com dados do usuario, permitindo injetar
comandos SQL nos campos de login e na busca.

## Como rodar

```
docker compose up --build
```

Depois abra http://localhost:3000

Contas de teste:
- visitante / senha123   (usuario comum)
- admin     / supersecreta (administrador — tente acessar sem a senha correta)

## Objetivo

1. Logar como `visitante` e explorar o catalogo de livros.
2. Tentar entrar como `admin` sem saber a senha, usando SQL injection no
   campo de usuario. Exemplo de payload:

   ```
   admin' --
   ```

   A senha pode ser qualquer valor.
3. (Opcional) Explorar a rota `GET /search?q=...` e tentar extrair dados
   extras com UNION-based injection. A tabela `products` tem uma coluna
   `secret_note` que nao aparece na busca normal.
4. Clicar em "Rodar teste" para confirmar que a vulnerabilidade existe.
   O teste tenta logar como admin via injection automaticamente.
5. Corrigir as rotas vulneraveis em `backend/server.js` usando prepared
   statements (parametros do `pg`).
6. Reiniciar o container (`docker compose up --build`) e rodar o teste
   novamente. Quando o teste reportar `[SEGURO]`, o desafio esta completo.

## Dica de correcao

Em vez de interpolar valores na string SQL, use placeholders `$1`, `$2`:

```js
// Login seguro
const result = await pool.query(
  'SELECT * FROM users WHERE username = $1 AND password = $2',
  [username, password]
);

// Busca segura
const result = await pool.query(
  'SELECT id, name, description, price FROM products WHERE name LIKE $1',
  [`%${q}%`]
);
```

Nunca concatene entrada do usuario diretamente na query.
