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
const signout = byId('signout');
const projectFilter = byId('project-filter');
let accessToken;
let visibleUpdates = [];

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
  visibleUpdates = [];
  list.replaceChildren();
  projectFilter.replaceChildren(new Option('全部工程', ''));
  byId('record-count').textContent = '—';
  byId('project-count').textContent = '—';
  byId('latest-date').textContent = '—';
  byId('filter-count').textContent = '';
  byId('intro').textContent = '登录查看获授权工程的原件核对记录。';
  signout.hidden = true;
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

    if (accessToken !== session.access_token) return;
    visibleUpdates = items.filter(item => item
      && typeof item.project_code === 'string'
      && /^\d{4}-\d{2}-\d{2}$/.test(item.observed_on)
      && typeof item.summary === 'string');
    const projects = [...new Set(visibleUpdates.map(item => item.project_code))].sort();
    const latest = visibleUpdates.reduce((max, item) => item.observed_on > max ? item.observed_on : max, '');
    projectFilter.replaceChildren(new Option('全部工程', ''),
      ...projects.map(project => new Option(project, project)));
    byId('record-count').textContent = String(visibleUpdates.length);
    byId('project-count').textContent = String(projects.length);
    byId('latest-date').textContent = latest || '—';
    byId('intro').textContent = '已核对的工程原件。日期以原件记载为准。';
    signin.hidden = true;
    results.hidden = false;
    signout.hidden = false;
    setStatus('');
    renderUpdates();
  } catch {
    const token = clearSession();
    if (token) void gatewayCall('auth/v1/logout?scope=local', token).catch(() => {});
    setStatus('暂时无法读取工程资料，请核对账号权限或稍后重试。');
  } finally {
    enter.disabled = false;
  }
});

function renderUpdates() {
  const projectCode = projectFilter.value;
  const filtered = projectCode
    ? visibleUpdates.filter(item => item.project_code === projectCode) : visibleUpdates;
  byId('empty').hidden = filtered.length > 0;
  byId('filter-count').textContent = '显示 ' + filtered.length + ' 条';
  list.replaceChildren(...filtered.map(item => {
    const row = document.createElement('li');
    const heading = document.createElement('header');
    const project = document.createElement('strong');
    const date = document.createElement('time');
    const summary = document.createElement('p');
    project.textContent = item.project_code;
    project.className = 'pill';
    date.className = 'meta';
    date.dateTime = date.textContent = item.observed_on;
    summary.textContent = item.summary;
    heading.append(project, date);
    row.append(heading, summary);
    return row;
  }));
}

projectFilter.addEventListener('change', renderUpdates);

signout.addEventListener('click', async () => {
  const token = clearSession();
  if (!token) return;
  setStatus('正在登出…');
  const result = await gatewayCall('auth/v1/logout?scope=local', token).catch(() => null);
  setStatus(result?.ok ? '已登出。' : '已清除本页会话。服务端登出待确认。');
});

window.addEventListener('pagehide', () => { clearSession(); setStatus(''); });
