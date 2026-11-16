'use strict';
// Candidate client for the deployed Supabase Edge Function URL:
// https://<project>.supabase.co/functions/v1/kkt-dashboard-readonly
// NOT connected to public demo and never stores a privileged key.
const allowed = new Set(['claims','projects','property','documents']);
export class DashboardApi {
  constructor({baseUrl,getAccessToken}) {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
        !url.pathname.endsWith('/functions/v1/kkt-dashboard-readonly')) {
      throw new Error('HTTPS_GATEWAY_REQUIRED');
    }
    if (typeof getAccessToken !== 'function') throw new Error('TOKEN_PROVIDER_REQUIRED');
    this.baseUrl = url.href.replace(/\/$/,'');
    this.getAccessToken = getAccessToken;
  }
  async list(resource,{signal}={}) {
    if (!allowed.has(resource)) throw new Error('RESOURCE_NOT_ALLOWED');
    const token = await this.getAccessToken();
    if (typeof token !== 'string' || !token) throw new Error('AUTH_REQUIRED');
    const response = await fetch(this.baseUrl + '/' + resource,{
      method:'GET',mode:'cors',credentials:'omit',cache:'no-store',redirect:'error',signal,
      headers:{Authorization:'Bearer ' + token,Accept:'application/json'}
    });
    if (response.status === 401 || response.status === 403) throw new Error('ACCESS_DENIED');
    if (!response.ok) throw new Error('DASHBOARD_UNAVAILABLE');
    const data = await response.json();
    if (!data || !Array.isArray(data.items) || !data.asOf || data.source !== 'verified') throw new Error('INVALID_RESPONSE');
    return data;
  }
}
