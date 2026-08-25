const BASE = '/api'

export async function apiGet(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost(path: string, data: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPatch(path: string, data: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
}

function nl(r: any) { return { items: r.data?.items || r.items || r.data || [], total: r.data?.total || r.total || 0 } }
function crud(path: string) {
  return {
    list: () => apiGet(path).then(nl),
    get: (id: string) => apiGet(`${path}/${id}`),
    create: (data: any) => apiPost(path, data),
    update: (id: string, data: any) => apiPatch(`${path}/${id}`, data),
    delete: (id: string) => apiDelete(`${path}/${id}`),
  }
}

export const Products = crud('/products')
export const Orders = crud('/orders')
export const AICoaches = crud('/aicoaches')
export const TrainerPackages = crud('/trainer-packages')
export const ContentProjects = crud('/content-projects')
export const Courses = crud('/courses')
export const SocialAccounts = crud('/social-accounts')
export const WhatsAppContacts = crud('/whats-app-contacts')
export const CustomerDashboards = crud('/customer-dashboards')
