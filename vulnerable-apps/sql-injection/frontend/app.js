let currentUser = null;

const $ = (sel) => document.querySelector(sel);

function showError(message) {
  const el = $('#login-error');
  el.textContent = message;
  el.hidden = !message;
}

function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function renderProducts(products) {
  const container = $('#products');
  if (!products.length) {
    container.innerHTML = '<p class="empty">Nenhum livro encontrado.</p>';
    return;
  }

  container.innerHTML = products
    .map(
      (p) => `
      <article class="product">
        <div class="product-body">
          <h4>${escapeHtml(p.name)}</h4>
          <p>${escapeHtml(p.description)}</p>
        </div>
        <span class="product-price">${formatPrice(p.price)}</span>
      </article>
    `
    )
    .join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadCatalog() {
  const res = await fetch('/products');
  const data = await res.json();
  renderProducts(data.products);
}

function showDashboard(user) {
  currentUser = user;
  $('#user-name').textContent = user.name;
  $('#user-username').textContent = user.username;

  const badge = $('#role-badge');
  badge.textContent = user.role === 'admin' ? 'Admin' : 'Usuario';
  badge.className = `badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`;

  $('#login-section').hidden = true;
  $('#dashboard-section').hidden = false;
  $('#test-output').hidden = true;
  $('#test-output').textContent = '';
  loadCatalog();
}

function showLogin() {
  currentUser = null;
  $('#dashboard-section').hidden = true;
  $('#login-section').hidden = false;
  showError('');
}

$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');

  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    showError(err.error === 'invalid credentials' ? 'Credenciais invalidas' : 'Erro ao entrar');
    return;
  }

  const { user } = await res.json();
  showDashboard(user);
});

$('#search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = new FormData(e.target).get('q');
  const res = await fetch(`/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  if (data.error) {
    renderProducts([]);
    return;
  }
  renderProducts(data.products);
});

$('#logout').addEventListener('click', () => {
  showLogin();
  $('#login-form').reset();
  $('#login-form').elements.username.value = 'visitante';
  $('#login-form').elements.password.value = 'senha123';
});

$('#run-test').addEventListener('click', async () => {
  const output = $('#test-output');
  output.hidden = false;
  output.textContent = 'Rodando...';
  output.className = 'test-output';

  const res = await fetch('/lab/run-test', { method: 'POST' });
  const data = await res.json();

  if (data.error) {
    output.textContent = 'Erro: ' + data.error;
    output.className = 'test-output test-error';
    return;
  }

  output.textContent = data.vulnerable
    ? '[VULNERAVEL] ' + data.message
    : '[SEGURO] ' + data.message;
  output.className = data.vulnerable
    ? 'test-output test-vuln'
    : 'test-output test-safe';
});
