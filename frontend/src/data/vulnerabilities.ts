export type Difficulty = "iniciante" | "intermediário";

export interface Vulnerability {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  icon: string;
  content: string;
  labFileName: string;
  labZipUrl: string;
}

export const vulnerabilities: Vulnerability[] = [
  {
    id: "1",
    title: "Cross-Site Scripting (XSS)",
    slug: "xss",
    category: "Injeção",
    difficulty: "iniciante",
    icon: "🔥",
    description: "Aprenda como scripts maliciosos podem ser injetados em páginas web e como prevenir esse tipo de ataque.",
    content: `# Cross-Site Scripting (XSS)

## O que é?

**Cross-Site Scripting (XSS)** é uma vulnerabilidade que permite a um atacante injetar scripts maliciosos em páginas web visualizadas por outros usuários. Isso acontece quando a aplicação inclui dados do usuário na página sem a devida sanitização.

## Como funciona?

Imagine um campo de comentários em um blog. Se o sistema não validar o conteúdo, um atacante pode enviar:

\`\`\`html
<script>alert('Seu cookie: ' + document.cookie)</script>
\`\`\`

Quando outros usuários acessarem a página, esse script será executado no navegador deles.

## Tipos de XSS

### 1. XSS Refletido (Reflected)
O script malicioso vem da URL e é "refletido" na resposta do servidor.

\`\`\`
https://site.com/busca?q=<script>alert('XSS')</script>
\`\`\`

### 2. XSS Armazenado (Stored)
O script é salvo no banco de dados e executado toda vez que a página é carregada.

### 3. XSS Baseado em DOM
A manipulação acontece diretamente no JavaScript do lado do cliente.

## Impacto

- 🍪 Roubo de cookies e sessões
- 👤 Sequestro de contas
- 📧 Phishing direcionado
- 🔄 Redirecionamento para sites maliciosos

## Como prevenir?

1. **Escape de saída**: Sempre escape dados antes de renderizá-los no HTML
2. **Content Security Policy (CSP)**: Configure headers CSP
3. **Validação de entrada**: Valide e sanitize todas as entradas do usuário
4. **Use frameworks modernos**: React, Vue e Angular escapam dados por padrão

\`\`\`javascript
// ❌ Vulnerável
element.innerHTML = userInput;

// ✅ Seguro
element.textContent = userInput;
\`\`\`

## 🧪 Hora de praticar!

No laboratório abaixo, você encontrará uma aplicação Node.js vulnerável a XSS. Sua missão é identificar e corrigir a vulnerabilidade.`,
    labFileName: "lab-xss.zip",
    labZipUrl: "",
  },
  {
    id: "2",
    title: "SQL Injection",
    slug: "sql-injection",
    category: "Injeção",
    difficulty: "iniciante",
    description: "Entenda como comandos SQL maliciosos podem ser inseridos em consultas e comprometer todo o banco de dados.",
    icon: "💉",
    content: `# SQL Injection

## O que é?

**SQL Injection** é uma vulnerabilidade que permite a um atacante interferir nas consultas SQL que a aplicação faz ao banco de dados. É uma das falhas mais antigas e perigosas da web.

## Como funciona?

Quando uma aplicação constrói consultas SQL concatenando strings com dados do usuário:

\`\`\`sql
SELECT * FROM users WHERE username = '\\\${username}' AND password = '\\\${password}'
\`\`\`

Um atacante pode inserir:
- **Usuário**: \`admin' --\`
- **Senha**: \`qualquer coisa\`

A consulta resultante:
\`\`\`sql
SELECT * FROM users WHERE username = 'admin' --' AND password = 'qualquer coisa'
\`\`\`

O \`--\` comenta o resto da query, ignorando a verificação de senha!

## Tipos de SQL Injection

### 1. In-band (Clássico)
O resultado aparece diretamente na resposta.

### 2. Blind SQL Injection
O atacante infere informações pelas respostas (verdadeiro/falso).

### 3. Out-of-band
Os dados são extraídos por um canal diferente (DNS, HTTP).

## Impacto

- 🗄️ Acesso total ao banco de dados
- 🔓 Bypass de autenticação
- 📝 Modificação ou exclusão de dados
- 💻 Em alguns casos, execução de comandos no servidor

## Como prevenir?

1. **Prepared Statements**: Use consultas parametrizadas
2. **ORM**: Utilize um ORM (Sequelize, Prisma, etc.)
3. **Validação**: Valide o tipo de dado esperado
4. **Princípio do menor privilégio**: Limite permissões do banco

\`\`\`javascript
// ❌ Vulnerável
db.query("SELECT * FROM users WHERE id = " + userId);

// ✅ Seguro (Prepared Statement)
db.query("SELECT * FROM users WHERE id = ?", [userId]);
\`\`\`

## 🧪 Hora de praticar!

No laboratório, você encontrará uma aplicação com uma vulnerabilidade de SQL Injection. Corrija-a usando prepared statements.`,
    labFileName: "lab-sql-injection.zip",
    labZipUrl: "",
  },
  {
    id: "3",
    title: "Cross-Site Request Forgery (CSRF)",
    slug: "csrf",
    category: "Sessão",
    difficulty: "intermediário",
    description: "Descubra como um atacante pode forçar um usuário autenticado a executar ações indesejadas.",
    icon: "🎭",
    content: `# Cross-Site Request Forgery (CSRF)

## O que é?

**CSRF** é um ataque que força um usuário autenticado a executar ações indesejadas em uma aplicação web. O atacante explora a confiança que o site tem no navegador do usuário.

## Como funciona?

1. O usuário está logado no banco online (site-banco.com)
2. O atacante envia um link malicioso por e-mail
3. O link contém um formulário oculto que faz uma transferência
4. Como o navegador envia os cookies automaticamente, a ação é executada

\`\`\`html
<!-- Página maliciosa do atacante -->
<img src="https://banco.com/transfer?to=atacante&amount=10000" />

<!-- Ou com formulário oculto -->
<form action="https://banco.com/transfer" method="POST" id="form">
  <input type="hidden" name="to" value="atacante" />
  <input type="hidden" name="amount" value="10000" />
</form>
<script>document.getElementById('form').submit();</script>
\`\`\`

## Impacto

- 💸 Transferências financeiras não autorizadas
- 🔑 Alteração de senha/email
- 📧 Envio de mensagens em nome do usuário
- ⚙️ Alteração de configurações da conta

## Como prevenir?

1. **Token CSRF**: Gere tokens únicos por sessão/formulário
2. **SameSite Cookies**: Configure cookies com \`SameSite=Strict\`
3. **Verificar Origin/Referer**: Valide o header de origem
4. **Double Submit Cookie**: Envie o token em cookie e no body

\`\`\`javascript
// Gerar token CSRF
const csrfToken = crypto.randomBytes(32).toString('hex');
session.csrfToken = csrfToken;

// Verificar no POST
if (req.body.csrf !== req.session.csrfToken) {
  return res.status(403).send('Token CSRF inválido');
}
\`\`\`

## 🧪 Hora de praticar!

O laboratório contém uma aplicação sem proteção CSRF. Implemente tokens CSRF para protegê-la.`,
    labFileName: "lab-csrf.zip",
    labZipUrl: "",
  },
  {
    id: "4",
    title: "Insecure Direct Object Reference (IDOR)",
    slug: "idor",
    category: "Controle de Acesso",
    difficulty: "iniciante",
    description: "Veja como a falta de verificação de autorização permite acessar dados de outros usuários.",
    icon: "🔓",
    content: `# Insecure Direct Object Reference (IDOR)

## O que é?

**IDOR** ocorre quando uma aplicação expõe referências diretas a objetos internos (como IDs de banco de dados) e não verifica se o usuário tem autorização para acessá-los.

## Como funciona?

Imagine uma URL para ver seu perfil:
\`\`\`
https://app.com/api/users/123/profile
\`\`\`

Se você simplesmente mudar o ID:
\`\`\`
https://app.com/api/users/124/profile
\`\`\`

E conseguir ver o perfil de outro usuário, isso é um IDOR!

## Exemplos comuns

\`\`\`javascript
// ⚠️ VULNERÁVEL: Não verifica se o usuário logado é o dono
app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  res.json(invoice);
});

// ✅ SEGURO: Verifica autorização
app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  res.json(invoice);
});
\`\`\`

## Impacto

- 📄 Acesso a dados confidenciais de outros usuários
- 🔧 Modificação de recursos alheios
- 🗑️ Exclusão de dados de terceiros
- 📊 Enumeração de todos os registros

## Como prevenir?

1. **Verificação de autorização**: Sempre verifique se o usuário tem permissão
2. **UUIDs**: Use identificadores não sequenciais
3. **Controle de acesso centralizado**: Middleware de autorização
4. **Testes de acesso**: Teste com diferentes usuários

## 🧪 Hora de praticar!

O laboratório tem uma API com IDOR. Adicione verificações de autorização adequadas.`,
    labFileName: "lab-idor.zip",
    labZipUrl: "",
  },
  {
    id: "5",
    title: "Command Injection",
    slug: "command-injection",
    category: "Injeção",
    difficulty: "intermediário",
    description: "Entenda como a execução insegura de comandos do sistema pode dar controle total do servidor ao atacante.",
    icon: "⚡",
    content: `# Command Injection

## O que é?

**Command Injection** ocorre quando uma aplicação passa dados não sanitizados do usuário para comandos do sistema operacional. Isso permite que o atacante execute comandos arbitrários no servidor.

## Como funciona?

Uma aplicação que faz ping em um endereço:

\`\`\`javascript
const { exec } = require('child_process');
exec('ping -c 4 ' + userInput);
\`\`\`

Se o usuário enviar:
\`\`\`
google.com; cat /etc/passwd
\`\`\`

O servidor executa:
\`\`\`bash
ping -c 4 google.com; cat /etc/passwd
\`\`\`

## Operadores perigosos

| Operador | Descrição |
|----------|-----------|
| \`;\` | Executa comandos em sequência |
| \`&&\` | Executa o próximo se o anterior teve sucesso |
| \`\\|\\|\` | Executa o próximo se o anterior falhou |
| \`\\|\` | Pipe - redireciona saída |
| \`\\\`cmd\\\`\` | Substituição de comando |
| \`$(cmd)\` | Substituição de comando |

## Impacto

- 💻 Controle total do servidor
- 📁 Leitura/escrita de qualquer arquivo
- 🌐 Movimentação lateral na rede
- 🔧 Instalação de malware

## Como prevenir?

1. **Evite exec/system**: Use APIs nativas sempre que possível
2. **Whitelist**: Permita apenas valores esperados
3. **execFile**: Use execFile em vez de exec
4. **Escape**: Sanitize caracteres especiais do shell

\`\`\`javascript
// ❌ Vulnerável
exec('ping -c 4 ' + host);

// ✅ Seguro
execFile('ping', ['-c', '4', host]);
\`\`\`

## 🧪 Hora de praticar!

No laboratório, corrija uma aplicação vulnerável a Command Injection.`,
    labFileName: "lab-command-injection.zip",
    labZipUrl: "",
  },
];
