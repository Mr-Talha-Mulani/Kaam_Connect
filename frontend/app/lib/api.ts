const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Helpers ──────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kc_token');
}

function getHeaders(auth = false): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (body: object) =>
    apiFetch('/auth/register', { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ email, password }) }),

  getMe: () =>
    apiFetch('/auth/me', { headers: getHeaders(true) }),
};

// ── Jobs (public) ────────────────────────────────────────────
export const jobsApi = {
  search: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/jobs${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string | number) => apiFetch(`/jobs/${id}`),
};

// ── Job Seeker ────────────────────────────────────────────────
export const seekerApi = {
  getProfile: () => apiFetch('/profile/job-seeker', { headers: getHeaders(true) }),

  upsertProfile: (data: object) =>
    apiFetch('/profile/job-seeker', { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),

  applyToJob: (jobId: string | number, cover_note = '') =>
    apiFetch(`/jobs/${jobId}/apply`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify({ cover_note }) }),

  getMyApplications: () => apiFetch('/jobs/seeker/my-applications', { headers: getHeaders(true) }),

  withdrawApplication: (applicationId: string | number) =>
    apiFetch(`/jobs/seeker/applications/${applicationId}/withdraw`, { method: 'PATCH', headers: getHeaders(true) }),

  saveJob: (jobId: string | number) =>
    apiFetch(`/jobs/${jobId}/save`, { method: 'POST', headers: getHeaders(true) }),

  unsaveJob: (jobId: string | number) =>
    apiFetch(`/jobs/${jobId}/save`, { method: 'DELETE', headers: getHeaders(true) }),

  getSavedJobs: () => apiFetch('/jobs/seeker/saved', { headers: getHeaders(true) }),
};

// ── Employer ──────────────────────────────────────────────────
export const employerApi = {
  getProfile: () => apiFetch('/profile/employer', { headers: getHeaders(true) }),

  upsertProfile: (data: object) =>
    apiFetch('/profile/employer', { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),

  createJob: (data: object) =>
    apiFetch('/jobs', { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),

  getMyJobs: () => apiFetch('/jobs/employer/my-jobs', { headers: getHeaders(true) }),

  updateJob: (jobId: string | number, data: object) =>
    apiFetch(`/jobs/${jobId}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),

  deleteJob: (jobId: string | number) =>
    apiFetch(`/jobs/${jobId}`, { method: 'DELETE', headers: getHeaders(true) }),

  getJobApplicants: (jobId: string | number) =>
    apiFetch(`/jobs/${jobId}/applicants`, { headers: getHeaders(true) }),

  getAllApplicants: () => apiFetch('/jobs/employer/all-applicants', { headers: getHeaders(true) }),

  updateApplicationStatus: (jobId: string | number, applicationId: string | number, status: string) =>
    apiFetch(`/jobs/${jobId}/applicants/${applicationId}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ status }),
    }),
};

// ── Notifications ─────────────────────────────────────────────
export const notificationsApi = {
  getAll: () => apiFetch('/jobs/notifications/all', { headers: getHeaders(true) }),
  markRead: (id: string | number) =>
    apiFetch(`/jobs/notifications/${id}/read`, { method: 'PATCH', headers: getHeaders(true) }),
  markAllRead: () =>
    apiFetch('/jobs/notifications/read-all', { method: 'PATCH', headers: getHeaders(true) }),
};
