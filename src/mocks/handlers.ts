import { http, HttpResponse } from 'msw'
import { users, institutions, clusters, schools, accounts } from './data'

function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const handlers = [
  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    // Check users first
    const user = users.find((u) => u.email === body.email)
    if (user) {
      if (user.password !== body.password) {
        return HttpResponse.json({ error: 'WRONG_PASSWORD' }, { status: 401 })
      }
      const token = btoa(JSON.stringify({ userId: user.id, role: user.role }))
      const { password: _, ...userWithoutPassword } = user
      return HttpResponse.json({ token, user: userWithoutPassword })
    }

    // Check accounts (created via Account Management)
    const account = accounts.find((a) => a.email === body.email && !a.deleted)
    if (account) {
      if (account.password !== body.password) {
        return HttpResponse.json({ error: 'WRONG_PASSWORD' }, { status: 401 })
      }
      const token = btoa(JSON.stringify({ userId: account.id, role: 'enuma_admin' }))
      return HttpResponse.json({
        token,
        user: { id: account.id, email: account.email, role: 'enuma_admin', clusterId: null },
      })
    }

    return HttpResponse.json({ error: 'USER_NOT_FOUND' }, { status: 401 })
  }),

  // Get schools (cluster list)
  http.get('/api/enuma-admin/clusters', () => {
    return HttpResponse.json(schools)
  }),

  // Get institutions
  http.get('/api/enuma-admin/institutions', () => {
    return HttpResponse.json(institutions)
  }),

  // Get clusters list
  http.get('/api/enuma-admin/clusters-list', () => {
    return HttpResponse.json(clusters)
  }),

  // Get accounts
  http.get('/api/enuma-admin/accounts', () => {
    return HttpResponse.json(accounts.filter((a) => !a.deleted))
  }),

  // Create account
  http.post('/api/enuma-admin/accounts', async ({ request }) => {
    const body = (await request.json()) as { email: string }
    const exists = accounts.find((a) => a.email === body.email && !a.deleted)
    if (exists) {
      return HttpResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    const newAccount = {
      id: `a${Date.now()}`,
      email: body.email,
      rights: 'Enuma Admin',
      password: generatePassword(),
      deleted: false,
    }
    accounts.push(newAccount)
    return HttpResponse.json(newAccount, { status: 201 })
  }),

  // Delete account
  http.delete('/api/enuma-admin/accounts/:id', ({ params }) => {
    const account = accounts.find((a) => a.id === params.id)
    if (!account) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    account.deleted = true
    return HttpResponse.json({ success: true })
  }),
]
