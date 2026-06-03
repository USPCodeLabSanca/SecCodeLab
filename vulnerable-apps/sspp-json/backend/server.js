const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

function buildUsers() {
  return [
    {
      userId: 1,
      username: 'alice',
      password: '1234',
      name: 'Alice',
      isAdmin: false,
      age: 25,
      skinColor: 'pale',
      favoriteAnimal: 'cat',
    },
    {
      userId: 2,
      username: 'bob',
      password: 'hunter2',
      name: 'Bob',
      isAdmin: false,
      age: 30,
      skinColor: 'tan',
      favoriteAnimal: 'dog',
    },
    {
      userId: 99,
      username: 'root',
      password: 'verylongpassword',
      name: 'Admin',
      isAdmin: true,
      age: 40,
      skinColor: 'green',
      favoriteAnimal: 'dragon',
    },
  ];
}

let users = buildUsers();

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  res.json({ userId: user.userId });
});

app.get('/users/:userId', (req, res) => {
  const user = users.find((u) => u.userId === parseInt(req.params.userId, 10));
  if (!user) return res.status(404).json({ error: 'not found' });
  res.json(publicUser(user));
});

// ---------------------------------------------------------------
// Rota vulneravel: Mass Assignment
// O corpo inteiro da requisicao e copiado para o usuario sem
// filtrar quais campos podem ser alterados pelo cliente.
// ---------------------------------------------------------------
app.patch('/users/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = users.find((u) => u.userId === userId);
  if (!user) return res.status(404).json({ error: 'not found' });

  const dataToUpdate = req.body || {};
  for (const key of Object.keys(dataToUpdate)) {
    if (key in user && key !== 'userId' && key !== 'username') {
      user[key] = dataToUpdate[key];
    }
  }

  res.json(publicUser(user));
});

// ---------------------------------------------------------------
// Endpoint do laboratorio: dispara o ataque contra a propria API
// e reporta se a vulnerabilidade ainda esta presente.
// ---------------------------------------------------------------
app.post('/lab/run-test', async (req, res) => {
  users = buildUsers();

  try {
    const loginRes = await fetch(`http://localhost:${PORT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'alice', password: '1234' }),
    });
    if (!loginRes.ok) throw new Error('login failed');
    const { userId } = await loginRes.json();

    await fetch(`http://localhost:${PORT}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favoriteAnimal: 'parrot', isAdmin: true }),
    });

    const after = await fetch(`http://localhost:${PORT}/users/${userId}`).then(
      (r) => r.json()
    );

    const vulnerable = after.isAdmin === true;
    res.json({
      vulnerable,
      message: vulnerable
        ? 'Vulnerabilidade ainda detectada.'
        : 'Vulnerabilidade corrigida.',
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`sspp-json lab rodando em http://localhost:${PORT}`);
});
