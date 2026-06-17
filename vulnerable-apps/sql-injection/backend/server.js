const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://lab:lab@localhost:5432/bookstore',
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

async function waitForDb() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('database not ready');
}

async function seedDatabase() {
  await pool.query(`
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      secret_note TEXT
    );

    INSERT INTO users (username, password, name, role) VALUES
      ('visitante', 'senha123', 'Visitante', 'user'),
      ('admin', 'supersecreta', 'Administrador', 'admin');

    INSERT INTO products (name, description, price, secret_note) VALUES
      ('O Guia do Viajante', 'Guia intergalactico para iniciantes.', 42.00, 'Fornecedor: Magrathea Ltd.'),
      ('1984', 'Distopia classica de George Orwell.', 29.90, 'Estoque reservado para clientes VIP.'),
      ('Clean Code', 'Boas praticas de desenvolvimento de software.', 79.50, 'Margem interna: 35%'),
      ('SQL para Leigos', 'Introducao a bancos de dados relacionais.', 34.00, 'Chave API interna: sk_live_demo_9f3a');
  `);
}

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    role: row.role,
  };
}

// ---------------------------------------------------------------
// Rota vulneravel: Login com concatenacao de strings SQL.
// Um atacante pode injetar SQL no campo username ou password.
// Exemplo: username = admin' --  (senha qualquer)
// ---------------------------------------------------------------
app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  try {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'invalid credentials' });
    }

    res.json({ user: publicUser(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ error: String(err.message) });
  }
});

// ---------------------------------------------------------------
// Rota vulneravel: Busca de produtos com LIKE concatenado.
// Permite explorar UNION-based injection para extrair dados.
// ---------------------------------------------------------------
app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) {
    return res.json({ products: [] });
  }

  try {
    const query = `SELECT id, name, description, price FROM products WHERE name LIKE '%${q}%'`;
    const result = await pool.query(query);
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: String(err.message) });
  }
});

app.get('/products', async (_req, res) => {
  const result = await pool.query(
    'SELECT id, name, description, price FROM products ORDER BY id'
  );
  res.json({ products: result.rows });
});

// ---------------------------------------------------------------
// Endpoint do laboratorio: tenta login como admin via SQL injection
// e reporta se a vulnerabilidade ainda esta presente.
// ---------------------------------------------------------------
app.post('/lab/run-test', async (req, res) => {
  await seedDatabase();

  try {
    const loginRes = await fetch(`http://localhost:${PORT}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: "admin' --", password: 'qualquer' }),
    });

    if (!loginRes.ok) {
      return res.json({
        vulnerable: false,
        message: 'Vulnerabilidade corrigida.',
      });
    }

    const { user } = await loginRes.json();
    const vulnerable = user.role === 'admin' && user.username === 'admin';

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

async function start() {
  await waitForDb();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`sql-injection lab rodando em http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
