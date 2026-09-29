const BASE = '/api'

/**
 * Sends a GET request to an API path and parses the JSON response.
 *
 * @param path - API path relative to `/api`, typically beginning with `/`.
 * @returns The decoded JSON response.
 * @throws {Error} When the request returns a non-success status.
 */
export async function apiGet(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

/**
 * Sends a JSON POST request to an API path.
 *
 * @param path - API path relative to `/api`, typically beginning with `/`.
 * @param data - Value serialized as the JSON request body.
 * @returns The decoded JSON response.
 * @throws {Error} When the request returns a non-success status.
 */
export async function apiPost(path: string, data: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

/**
 * Sends a JSON PATCH request to an API path.
 *
 * @param path - API path relative to `/api`, typically beginning with `/`.
 * @param data - Value serialized as the JSON request body.
 * @returns The decoded JSON response.
 * @throws {Error} When the request returns a non-success status.
 */
export async function apiPatch(path: string, data: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
  return res.json()
}

/**
 * Sends a DELETE request to an API path.
 *
 * @param path - API path relative to `/api`, typically beginning with `/`.
 * @throws {Error} When the request returns a non-success status.
 */
export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`)
}

// Generated list endpoints can wrap their records and count at different levels.
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

/** CRUD client for `/api/products`. */
export const Products = crud('/products')
/** CRUD client for `/api/orders`. */
export const Orders = crud('/orders')
/** CRUD client for `/api/aicoaches`. */
export const AICoaches = crud('/aicoaches')
/** CRUD client for `/api/trainer-packages`. */
export const TrainerPackages = crud('/trainer-packages')
/** CRUD client for `/api/content-projects`. */
export const ContentProjects = crud('/content-projects')
/** CRUD client for `/api/courses`. */
export const Courses = crud('/courses')
/** CRUD client for `/api/social-accounts`. */
export const SocialAccounts = crud('/social-accounts')
/** CRUD client for `/api/whats-app-contacts`. */
export const WhatsAppContacts = crud('/whats-app-contacts')
/** CRUD client for `/api/customer-dashboards`. */
export const CustomerDashboards = crud('/customer-dashboards')
