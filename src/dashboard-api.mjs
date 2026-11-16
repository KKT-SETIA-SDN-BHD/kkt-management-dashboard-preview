'use strict';
// Browser-facing read-only API client. Calls only an explicitly configured authenticated gateway.
// This module does not contain Supabase service credentials and is not wired into the demo.
const allowed = new Set(['claims','projects','property','documents']);
export class DashboardApi {
  constructor({baseUrl, getAccessToken}) {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) throw new Error('HTTPS_GATEWAY_REQUIRED');
    if (typeof getAccessToken !== 'function') throw new Error('TOKEN_PROVIDER_REQUIRED');
    this.baseUrl = url.href.endsWith('/') ? url.href : url.href + '/';
    this.getAccessToken = getAccessToken;
  }
  async list(resource,{signal}={}) {
    if (!allowed.has(resource)) throw new Error('RESOURCE_NOT_ALLOWED');
    const token = await this.getAccessToken();
    if (typeof token !== 'string' || !token) throw new Error('AUTH_REQUIRED');
    const response = await fetch(new URL('v1/dashboard/' + resource,this.baseUrl),{
      method:'GET',mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',signal,
      headers:{Authorization:'Bearer ' + token,Accept:'application/json'}
    });
    if (response.status === 401 || response.status === 403) throw new Error('ACCESS_DENIED');
    if (!response.ok) throw new Error('DASHBOARD_UNAVAILABLE');
    const data = await response.json();
    if (!data || !Array.isArray(data.items) || !data.asOf) throw new Error('INVALID_RESPONSE');
    return data;
  }
}
