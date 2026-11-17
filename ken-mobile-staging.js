'use strict';

const base = 'https://qacmlpqtiwwmrypxnnlp.supabase.co/functions/v1';
const gateway = base + '/kkt-hr-staging-gateway';
const mobileApi = base + '/kkt-ken-mobile-staging/';
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
let rentalLoaded = false;
const sourceSections = ['documents', 'cash', 'ubs', 'rent'];
const moduleButtons = [...document.querySelectorAll('[data-module]')];

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
  byId('intro').textContent = '登录查看获授权的管理模块。';
  rentalLoaded = false;
  byId('rent-list').replaceChildren();
  byId('rent-status').textContent = '';
  for (const name of sourceSections) {
    byId(name + '-source-list').replaceChildren();
    byId(name + '-source-status').textContent = '';
  }
  selectModule('engineering');
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
    const response = await mobileRead('updates', accessToken);
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
    byId('intro').textContent = '选择模块，查看获授权的管理资料。';
    signin.hidden = true;
    results.hidden = false;
    signout.hidden = false;
    setStatus('');
    renderUpdates();
    void loadSourceReviews(session.access_token);
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

function mobileRead(path, token) {
  return fetch(mobileApi + path, {
    headers: { Authorization: 'Bearer ' + token },
    cache: 'no-store', credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(15000),
  });
}

function selectModule(moduleName) {
  for (const button of moduleButtons) {
    const active = button.dataset.module === moduleName;
    button.setAttribute('aria-pressed', String(active));
    byId(button.dataset.module).hidden = !active;
  }
}

async function loadSourceReviews(token) {
  for (const name of sourceSections) byId(name + '-source-status').textContent = '正在读取来源…';
  try {
    const response = await mobileRead('source-review', token);
    if (!response.ok) throw Error('Source reviews unavailable');
    const { items } = await response.json();
    if (!Array.isArray(items)) throw Error('Invalid source response');
    if (token !== accessToken) return;

    for (const name of sourceSections) {
      const records = items.filter(item => item?.section === name);
      byId(name + '-source-status').textContent = records.length ? '' : '此账号暂无已核对来源。';
      byId(name + '-source-list').replaceChildren(...records.map(item => {
        const row = document.createElement('li');
        const heading = document.createElement('header');
        const title = document.createElement('strong');
        const date = document.createElement('time');
        const note = document.createElement('p');
        title.textContent = item.label;
        date.className = 'meta';
        date.dateTime = date.textContent = item.source_date;
        note.textContent = item.review_note;
        heading.append(title, date);
        row.append(heading, note);
        return row;
      }));
    }
  } catch {
    if (token !== accessToken) return;
    for (const name of sourceSections) {
      byId(name + '-source-status').textContent = '暂时无法读取来源。';
    }
  }
}

async function loadRental() {
  const token = accessToken;
  if (!token || rentalLoaded) return;
  const status = byId('rent-status');
  const list = byId('rent-list');
  rentalLoaded = true;
  status.textContent = '正在读取私人产业资料…';
  try {
    const response = await mobileRead('private-rent', token);
    if (!response.ok) throw Error('Private rent unavailable');
    const { items } = await response.json();
    if (!Array.isArray(items)) throw Error('Invalid response');
    if (token !== accessToken) return;
    list.replaceChildren(...items.map(item => {
      const row = document.createElement('li');
      const name = document.createElement('strong');
      const periods = document.createElement('p');
      name.textContent = item.property_label;
      periods.textContent = '已登记租期：' + item.periods_count;
      row.append(name, periods);
      return row;
    }));
    status.textContent = items.length ? '显示本人名下的已登记产业。' : '本人名下的正式租金台账待接入。';
  } catch {
    if (token !== accessToken) return;
    rentalLoaded = false;
    status.textContent = '暂时无法读取私人产业资料，请重新选择此模块。';
  }
}

for (const button of moduleButtons) {
  button.addEventListener('click', () => {
    const moduleName = button.dataset.module;
    selectModule(moduleName);
    if (moduleName === 'rent') void loadRental();
  });
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
