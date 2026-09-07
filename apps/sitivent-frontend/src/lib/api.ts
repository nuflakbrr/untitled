import axios from 'axios';
import { cookies, headers } from 'next/headers';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = (await cookies()).get('sitivent_access_token')?.value;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.headers['X-Skip-Tenant'] === 'true') {
    delete config.headers['X-Skip-Tenant'];
  } else {
    const tenantId = (await cookies()).get('sitivent_active_tenant')?.value ?? (await headers()).get('x-sitivent-tenant-id');
    if (tenantId && !config.headers['X-Tenant-ID']) config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});

export default api;
