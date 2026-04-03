import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'db.json');

function readDB() {
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const db = readDB();

  // POST /api/auth/login
  if (req.method === 'POST' && path === '/api/auth/login') {
    const body = await parseBody(req);
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) {
      return json(res, 401, { error: 'Invalid credentials' });
    }
    const token = Buffer.from(JSON.stringify({ id: user.id, role: user.role })).toString('base64');
    return json(res, 200, {
      token,
      user: { id: user.id, email: user.email, role: user.role, clusterId: user.clusterId || null },
    });
  }

  // GET /api/enuma-admin/clusters (schools list)
  if (req.method === 'GET' && path === '/api/enuma-admin/clusters') {
    return json(res, 200, db.schools);
  }

  // GET /api/enuma-admin/institutions
  if (req.method === 'GET' && path === '/api/enuma-admin/institutions') {
    return json(res, 200, db.institutions);
  }

  // GET /api/enuma-admin/clusters-list (clusters for dropdown)
  if (req.method === 'GET' && path === '/api/enuma-admin/clusters-list') {
    return json(res, 200, db.clusters);
  }

  // GET /api/enuma-admin/accounts
  if (req.method === 'GET' && path === '/api/enuma-admin/accounts') {
    const activeAccounts = db.accounts.filter((a) => !a.deleted);
    return json(res, 200, activeAccounts);
  }

  // POST /api/enuma-admin/accounts
  if (req.method === 'POST' && path === '/api/enuma-admin/accounts') {
    const body = await parseBody(req);
    const exists = db.accounts.find((a) => a.email === body.email && !a.deleted);
    if (exists) {
      return json(res, 409, { error: 'An account with this email address already exists.' });
    }
    const newAccount = {
      id: `a${Date.now()}`,
      email: body.email,
      rights: 'Enuma Admin',
      password: generatePassword(),
      deleted: false,
    };
    db.accounts.push(newAccount);
    writeDB(db);
    return json(res, 201, newAccount);
  }

  // DELETE /api/enuma-admin/accounts/:id
  if (req.method === 'DELETE' && path.startsWith('/api/enuma-admin/accounts/')) {
    const id = path.split('/').pop();
    const account = db.accounts.find((a) => a.id === id);
    if (!account) {
      return json(res, 404, { error: 'Account not found' });
    }
    account.deleted = true;
    writeDB(db);
    return json(res, 200, { success: true });
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(3001, () => {
  console.log('Mock API server running on http://localhost:3001');
});
