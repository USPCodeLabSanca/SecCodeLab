let currentUserId = null;

const $ = (sel) => document.querySelector(sel);

async function fetchUser(userId) {
  const res = await fetch(`/users/${userId}`);
  return res.json();
}

function renderUser(user) {
  const view = $('#avatar-view');
  view.innerHTML = '';
  for (const [key, value] of Object.entries(user)) {
    const tr = document.createElement('tr');
    const k = document.createElement('td');
    const v = document.createElement('td');
    k.textContent = key;
    v.textContent = String(value);
    tr.appendChild(k);
    tr.appendChild(v);
    view.appendChild(tr);
  }

  const form = $('#edit-form');
  for (const field of ['name', 'age', 'skinColor', 'favoriteAnimal']) {
    if (form.elements[field]) form.elements[field].value = user[field] ?? '';
  }
}

$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#login-error').textContent = '';
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    $('#login-error').textContent = 'Credenciais invalidas';
    return;
  }
  const { userId } = await res.json();
  currentUserId = userId;
  $('#login-section').hidden = true;
  $('#avatar-section').hidden = false;
  renderUser(await fetchUser(userId));
});

$('#edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  if (data.age) data.age = Number(data.age);
  await fetch(`/users/${currentUserId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  renderUser(await fetchUser(currentUserId));
});

$('#logout').addEventListener('click', () => {
  currentUserId = null;
  $('#avatar-section').hidden = true;
  $('#login-section').hidden = false;
  $('#test-output').textContent = '';
  $('#login-form').reset();
  $('#login-form').elements.username.value = 'alice';
  $('#login-form').elements.password.value = '1234';
});

$('#run-test').addEventListener('click', async () => {
  $('#test-output').textContent = 'Rodando...';
  const res = await fetch('/lab/run-test', { method: 'POST' });
  const data = await res.json();
  $('#test-output').textContent = data.vulnerable
    ? '[VULNERAVEL] ' + data.message
    : '[SEGURO] ' + data.message;
});
