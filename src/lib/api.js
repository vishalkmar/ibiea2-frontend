// Central API client. Reads base URL from VITE_API_URL, attaches JWT, parses JSON.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'ibiea_token';
const USER_KEY = 'ibiea_user';

export const auth = {
  get token() { return localStorage.getItem(TOKEN_KEY); },
  get user() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  set(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request(path, { method = 'GET', body, authed = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (authed && auth.token) headers.Authorization = `Bearer ${auth.token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Upload a file (multipart/form-data) with auth. Returns parsed JSON.
async function uploadFile(path, file, fields = {}) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    body: fd,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
  return data;
}

// Fetch a file with auth and trigger a browser download.
async function downloadFile(path, fallbackName = 'download') {
  const res = await fetch(`${BASE}${path}`, {
    headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
  });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fallbackName; a.click();
  URL.revokeObjectURL(url);
}

export const api = {
  get: (p, authed) => request(p, { authed }),
  post: (p, body, authed) => request(p, { method: 'POST', body, authed }),
  put: (p, body, authed) => request(p, { method: 'PUT', body, authed }),
  uploadFile,
  downloadFile,

  // --- Auth (email + password, no OTP) ---
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  // --- Public reads ---
  segments: () => request('/public/segments'),
  packages: () => request('/public/packages'),
  sponsorTiers: () => request('/public/sponsor-tiers'),
  awardCategories: () => request('/public/award-categories'),
  stalls: () => request('/public/stalls'),
  theme: () => request('/public/theme'),
  publicExhibitors: (segment) => request(`/public/exhibitors${segment ? `?segment=${segment}` : ''}`),
  publicSponsors: () => request('/public/sponsors'),
  awardees: () => request('/public/awardees'),

  // --- Public writes ---
  register: (payload) => request('/registrations', { method: 'POST', body: payload }),
  enquiry: (payload) => request('/enquiries', { method: 'POST', body: payload }),
  nominate: (payload) => request('/awards/nominations', { method: 'POST', body: payload }),

  // --- Exhibitor (authed) ---
  exhibitorMe: () => request('/exhibitor/me', { authed: true }),
  exhibitorLeads: () => request('/exhibitor/leads', { authed: true }),
  exhibitorPasses: () => request('/exhibitor/passes', { authed: true }),
  exhibitorAddPass: (payload) => request('/exhibitor/passes', { method: 'POST', body: payload, authed: true }),
  exhibitorDeletePass: (id) => request(`/exhibitor/passes/${id}`, { method: 'DELETE', authed: true }),
  exhibitorDocuments: () => request('/exhibitor/documents', { authed: true }),
  exhibitorDeleteDocument: (id) => request(`/exhibitor/documents/${id}`, { method: 'DELETE', authed: true }),
  exhibitorUpdateProfile: (payload) => request('/exhibitor/profile', { method: 'PATCH', body: payload, authed: true }),
  exhibitorProjects: () => request('/exhibitor/projects', { authed: true }),
  exhibitorAddProject: (payload) => request('/exhibitor/projects', { method: 'POST', body: payload, authed: true }),
  exhibitorDeleteProject: (id) => request(`/exhibitor/projects/${id}`, { method: 'DELETE', authed: true }),
  exhibitorMatches: () => request('/exhibitor/matches', { authed: true }),
  exhibitorMeetings: () => request('/exhibitor/meetings', { authed: true }),
  exhibitorRequestMeeting: (payload) => request('/exhibitor/meetings', { method: 'POST', body: payload, authed: true }),
  exhibitorMeetingStatus: (id, status) => request(`/exhibitor/meetings/${id}`, { method: 'PATCH', body: { status }, authed: true }),

  // --- Sponsor (authed) ---
  sponsorMe: () => request('/sponsor/me', { authed: true }),

  // --- Admin (authed, role-gated server-side) ---
  adminOverview: () => request('/admin/overview', { authed: true }),
  adminRegistrations: () => request('/admin/registrations', { authed: true }),
  adminExhibitors: () => request('/admin/exhibitors', { authed: true }),
  adminSponsors: () => request('/admin/sponsors', { authed: true }),
  adminNominations: () => request('/admin/awards/nominations', { authed: true }),
  adminFinance: () => request('/admin/finance', { authed: true }),
  adminAnalytics: () => request('/admin/analytics', { authed: true }),
  adminUpdateRegistration: (id, payload) => request(`/admin/registrations/${id}`, { method: 'PATCH', body: payload, authed: true }),
  adminDeleteRegistration: (id) => request(`/admin/registrations/${id}`, { method: 'DELETE', authed: true }),
  adminResendTicket: (id) => request(`/admin/registrations/${id}/resend`, { method: 'POST', body: {}, authed: true }),
  adminUsers: () => request('/admin/users', { authed: true }),
  adminCreateUser: (payload) => request('/admin/users', { method: 'POST', body: payload, authed: true }),
  adminSetUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: 'PATCH', body: { status }, authed: true }),
  adminVerifyPayment: (ref, action) => request(`/admin/payments/${ref}/verify`, { method: 'POST', body: { action }, authed: true }),

  // Jury + awards admin
  adminJury: () => request('/admin/jury', { authed: true }),
  adminAddJury: (payload) => request('/admin/jury', { method: 'POST', body: payload, authed: true }),
  adminFinalizeWinner: (id) => request(`/admin/awards/nominations/${id}/winner`, { method: 'POST', body: {}, authed: true }),

  // CMS theme
  themeSave: (payload) => request('/admin/cms/theme', { method: 'PUT', body: payload, authed: true }),

  // Payments (Cashfree sandbox + bank transfer)
  paymentConfig: () => request('/payments/config'),
  createCashfreeOrder: (payload) => request('/payments/cashfree/order', { method: 'POST', body: payload, authed: true }),
  paymentStatus: (ref) => request(`/payments/${ref}/status`),
  createBankTransfer: (payload) => request('/payments/bank-transfer', { method: 'POST', body: payload, authed: true }),

  // Admin CRUD — exhibitors / sponsors / awardees / stalls
  adminAddExhibitor: (payload) => request('/admin/exhibitors', { method: 'POST', body: payload, authed: true }),
  adminUpdateExhibitor: (id, payload) => request(`/admin/exhibitors/${id}`, { method: 'PATCH', body: payload, authed: true }),
  adminDeleteExhibitor: (id) => request(`/admin/exhibitors/${id}`, { method: 'DELETE', authed: true }),
  adminAddSponsor: (payload) => request('/admin/sponsors', { method: 'POST', body: payload, authed: true }),
  adminUpdateSponsor: (id, payload) => request(`/admin/sponsors/${id}`, { method: 'PATCH', body: payload, authed: true }),
  adminDeleteSponsor: (id) => request(`/admin/sponsors/${id}`, { method: 'DELETE', authed: true }),
  adminAwardees: () => request('/admin/awardees', { authed: true }),
  adminAddAwardee: (payload) => request('/admin/awardees', { method: 'POST', body: payload, authed: true }),
  adminUpdateAwardee: (id, payload) => request(`/admin/awardees/${id}`, { method: 'PATCH', body: payload, authed: true }),
  adminDeleteAwardee: (id) => request(`/admin/awardees/${id}`, { method: 'DELETE', authed: true }),
  adminStalls: () => request('/admin/stalls', { authed: true }),
  adminGenerateStalls: (rows, cols) => request('/admin/stalls/generate', { method: 'POST', body: { rows, cols }, authed: true }),
  adminDeleteStall: (id) => request(`/admin/stalls/${id}`, { method: 'DELETE', authed: true }),
  adminExhibitorPasses: (id) => request(`/admin/exhibitors/${id}/passes`, { authed: true }),
};
