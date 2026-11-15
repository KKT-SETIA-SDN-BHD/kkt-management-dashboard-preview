'use strict';

const $ = (id) => document.getElementById(id);
const fixtures = [
  {project:'DEMO-A',name:'Harbour Works',client:'Sample Client A',number:'DEMO-PC-08',claimDate:'2026-11-12',submission:'2026-11-13',claimed:12800,certified:null,certifiedDate:null,invoice:null,invoiceDate:null,received:null,paymentDate:null,outstanding:null,retention:null,status:'Pending certification',updated:'2026-11-13',source:'Synthetic claim'},
  {project:'DEMO-B',name:'Garden Works',client:'Sample Contractor B',number:'DEMO-PC-03',claimDate:'2026-11-10',submission:'2026-11-10',claimed:22500,certified:21000,certifiedDate:'2026-11-11',invoice:'DEMO-INV-03',invoiceDate:'2026-11-11',received:null,paymentDate:null,outstanding:21000,retention:1100,status:'Certified · payment pending',updated:'2026-11-12',source:'Synthetic certificate and invoice'},
  {project:'DEMO-A',name:'Harbour Works',client:'Sample Client A',number:'DEMO-PC-07',claimDate:'2026-10-21',submission:'2026-10-22',claimed:16300,certified:15000,certifiedDate:'2026-10-24',invoice:'DEMO-INV-07',invoiceDate:'2026-10-24',received:15000,paymentDate:'2026-11-09',outstanding:0,retention:800,status:'Bank verified (demo)',updated:'2026-11-09',source:'Synthetic bank reconciliation'},
];
const operations = [
  ['Project Progress Updates','Harbour Works · Site inspection logged','2026-11-13'],
  ['Pending Management Approvals','Sample procurement request','2026-11-12'],
  ['Subcontractor Claims & Payments','Sample application received','2026-11-11'],
  ['Variation Orders (VO)','Sample VO under review','2026-11-10'],
  ['Extension of Time (EOT)','Sample EOT submitted','2026-11-07'],
];
const labelRows = [
  ['Project Number','project'],['Project Name','name'],['Client / Main Contractor','client'],
  ['Claim Number','number'],['Claim Date','claimDate'],['Submission Date','submission'],
  ['Claimed Amount','claimed',true],['Certified Amount','certified',true],['Certification Date','certifiedDate'],
  ['Invoice Number','invoice'],['Invoice Date','invoiceDate'],['Payment Received','received',true],['Payment Date','paymentDate'],
  ['Outstanding Amount','outstanding',true],['Retention','retention',true],['Status','status'],['Last Updated','updated'],['Source','source'],
];
const money = (value) => value == null ? 'UNKNOWN' : new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR'}).format(value);
const text = (tag,value,className) => {
  const el = document.createElement(tag);
  el.textContent = value;
  if (className) el.className = className;
  return el;
};

const sorted = fixtures.slice().sort((a,b) => b.claimDate.localeCompare(a.claimDate));
const pending = sorted.filter((claim) => claim.status === 'Pending certification').length;
const outstanding = sorted.reduce((sum,claim) => sum + (claim.outstanding ?? 0),0);
const latestPayment = sorted.filter((claim) => claim.paymentDate && claim.received != null).sort((a,b) => b.paymentDate.localeCompare(a.paymentDate))[0];
for (const [title, value, context] of [
  ['Pending Certification',String(pending),'Sample claim awaiting review'],
  ['Outstanding Payments',money(outstanding),'Known sample invoices'],
  ['Latest Payment Received',money(latestPayment.received),latestPayment.paymentDate + ' · verified demo'],
]) {
  const article = text('article','','metric');
  article.append(text('h2',title),text('strong',value),text('span',context));
  $('metrics').append(article);
}
for (const [title,detail,date] of operations) {
  const article = text('article','','mini');
  article.append(text('h2',title),text('p',detail),text('span',date+' · Synthetic fixture'));
  $('project-updates').append(article);
}
for (const project of new Set(sorted.map((claim) => claim.project))) {
  const option = text('option',project);
  option.value = project;
  $('project-filter').append(option);
}

let sampleFile;
async function preparePDF() {
  try {
    const response = await fetch('./demo-claim.pdf',{credentials:'omit',redirect:'error'});
    if (!response.ok) throw new Error('PDF unavailable');
    const data = await response.blob();
    sampleFile = new File([data],'demo-claim.pdf',{type:'application/pdf'});
    $('share-pdf').disabled = false;
  } catch {
    $('share-status').textContent = 'Use View PDF or Download PDF to open the sample.';
  }
}
function showClaim(claim) {
  $('detail-title').textContent = claim.number;
  const details = $('claim-details');
  details.replaceChildren();
  for (const [label,key,isAmount] of labelRows) {
    details.append(text('dt',label),text('dd',isAmount ? money(claim[key]) : claim[key] ?? 'UNKNOWN'));
  }
  details.append(text('dt','Original PDF Reference'),text('dd','demo-claim.pdf (sample)'));
  $('claim-dialog').showModal();
  if (!sampleFile) void preparePDF();
}
function renderClaims() {
  const filter = $('project-filter').value;
  $('claim-list').replaceChildren();
  for (const claim of sorted.filter((item) => !filter || filter === item.project)) {
    const button = text('button','','claim');
    button.type = 'button';
    const desc = text('span','');
    desc.append(text('b',claim.number + ' · ' + claim.name),text('small',claim.project + ' · ' + claim.claimDate));
    const outcome = text('span','','total');
    outcome.append(text('span',money(claim.claimed)),text('small',claim.status));
    button.append(desc,outcome);
    button.addEventListener('click',() => showClaim(claim));
    $('claim-list').append(button);
  }
}
$('project-filter').addEventListener('change',renderClaims);
$('close-claim').addEventListener('click',() => $('claim-dialog').close());
$('share-pdf').addEventListener('click',async () => {
  if (!sampleFile || !navigator.canShare?.({files:[sampleFile]})) {
    $('share-status').textContent = 'File sharing is unavailable here. Download or open the PDF, then use the device Share menu.';
    return;
  }
  try {
    await navigator.share({files:[sampleFile],title:'KKT sample claim'});
    $('share-status').textContent = 'Share sheet closed.';
  } catch (error) {
    $('share-status').textContent = error.name === 'AbortError' ? 'Sharing cancelled.' : 'Sharing unavailable. Try downloading the sample PDF.';
  }
});
function renderPortfolio(role) {
  $('property-list').replaceChildren();
  $('session-button').textContent = role ? 'Demo sign out' : 'Demo sign in';
  $('property-notice').textContent = role ? 'Visible sample portfolio · ' + role : 'Use Demo sign in to inspect a sample portfolio.';
  if (!role) return;
  const row = text('article','','rent');
  row.append(text('b',role === 'private' ? 'Sample Private Unit' : 'Sample Company Shop'),
    text('p',role === 'private' ? 'RM 450 · Proof received · Bank credit UNKNOWN' : 'RM 900 · Sample lease · Payment UNKNOWN'));
  $('property-list').append(row);
}
$('session-button').addEventListener('click',() => {
  if ($('session-button').textContent === 'Demo sign out') renderPortfolio(null);
  else $('session-dialog').showModal();
});
$('close-session').addEventListener('click',() => $('session-dialog').close());
for (const button of document.querySelectorAll('[data-role]')) {
  button.addEventListener('click',() => {
    renderPortfolio(button.dataset.role);
    $('session-dialog').close();
  });
}
renderClaims();
