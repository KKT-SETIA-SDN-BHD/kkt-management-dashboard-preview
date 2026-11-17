'use strict';

const base = 'https://qacmlpqtiwwmrypxnnlp.supabase.co/functions/v1';
const gateway = base + '/kkt-hr-staging-gateway';
const updatesApi = base + '/kkt-ken-mobile-staging/updates';
const byId = id => document.getElementById(id);
const signin = byId('signin');
const enter = byId('enter');
const results = byId('results');
const list = byId('updates');
const setStatus = message => { byId('status').textContent = message; };
let accessToken;

function gatewayCall(path, token, data) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  return fetch(gateway, {
    method: 'POST', headers, body: JSON.stringify({ path, data }),
    cache: 'no-store', credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(15000),
  });
}

function clearSession() {
  const token = accessToken;
  accessToken = undefined;
  results.hidden = true;
  list.replaceChildren();
  signin.hidden = false;
  byId('password').value = '';
  return token;
}

signin.addEventListener('submit', async event => {
  event.preventDefault();
  if (enter.disabled) return;
  enter.disabled = true;
  setStatus('正在验证账号及工程权限…');
  const password = byId('password').value;
  byId('password').value = '';
  try {
    const login = await gatewayCall('auth/v1/token?grant_type=password', undefined, {
      email: byId('email').value.trim(), password,
    });
    if (!login.ok) {
      setStatus(login.status === 429 ? '登录尝试过多，请稍后再试。' : '登录失败，请核对 Staging 账号。');
      return;
    }
    const session = await login.json();
    if (typeof session.access_token !== 'string' || !session.access_token) throw Error('Session unavailable');
    accessToken = session.access_token;
    const response = await fetch(updatesApi, {
      headers: { Authorization: 'Bearer ' + accessToken },
      cache: 'no-store', credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw Error('Access unavailable');
    const { items } = await response.json();
    if (!Array.isArray(items)) throw Error('Invalid response');

    const rows = items.map(item => {
      const row = document.createElement('li');
      const project = document.createElement('strong');
      const date = document.createElement('time');
      const summary = document.createElement('p');
      project.textContent = item.project_code;
      date.dateTime = date.textContent = item.observed_on;
      summary.textContent = item.summary;
      row.append(project, date, summary);
      return row;
    });
    list.replaceChildren(...rows);
    signin.hidden = true;
    results.hidden = false;
    setStatus(rows.length ? '共 ' + rows.length + ' 条。日期取自所述原件。' : '此账号暂无授权的工程记录。');
  } catch {
    const token = clearSession();
    if (token) void gatewayCall('auth/v1/logout?scope=local', token).catch(() => {});
    setStatus('暂时无法读取工程资料，请核对账号权限或稍后重试。');
  } finally {
    enter.disabled = false;
  }
});

byId('signout').addEventListener('click', async () => {
  const token = clearSession();
  if (!token) return;
  setStatus('正在登出…');
  const result = await gatewayCall('auth/v1/logout?scope=local', token).catch(() => null);
  setStatus(result?.ok ? '已登出。' : '已清除本页会话。服务端登出待确认。');
});

window.addEventListener('pagehide', () => { clearSession(); });
