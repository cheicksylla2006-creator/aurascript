#!/usr/bin/env node
/**
 * Aura Script — connecteur MCP (Model Context Protocol), transport stdio.
 *
 * Lancé par l'assistant de bureau (Claude Desktop, Gemini CLI, Codex CLI…), jamais
 * par Internet. Aucun port n'est ouvert. Deux modes, choisis à chaque appel :
 *   1. Aura Script ouvert  -> tube nommé local + jeton : tous les outils de
 *      l'application, en direct, avec les autorisations de l'utilisateur.
 *   2. Aura Script fermé   -> lecture du dossier « partage » (documents que
 *      l'utilisateur a choisi de partager) ; une création de document est mise
 *      « en attente » et proposée à l'utilisateur à la prochaine ouverture.
 * Aucune dépendance : Node.js (ou l'exécutable d'Aura Script avec
 * ELECTRON_RUN_AS_NODE=1) suffit.
 */
'use strict';
const fs = require('fs'), path = require('path'), net = require('net');
const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
/* Version du connecteur = version d'Aura Script (vérifié par tools/test-mcp.js). */
const VERSION = '2.5.0';
/* Métadonnées de sécurité de CHAQUE outil, en mode connecté comme hors ligne
   (exigence de l'annuaire Anthropic : title + readOnlyHint / destructiveHint).
   Règle suivie : lecture seule → readOnlyHint ; toute écriture (même une création)
   → destructiveHint, ce qui fait demander confirmation par l'assistant. Aucun outil
   ne contacte Internet : openWorldHint est toujours faux. */
const META = {
  get_workspace:    { title: 'Get open workspace',        lecture: true },
  list_documents:   { title: 'List documents',            lecture: true },
  read_document:    { title: 'Read document',             lecture: true },
  search_documents: { title: 'Search documents',          lecture: true },
  open_document:    { title: 'Open document in Aura Script', lecture: true },
  sheet_read:       { title: 'Read spreadsheet',          lecture: true },
  edit_text:        { title: 'Edit text document',        idem: true },
  sheet_write:      { title: 'Write spreadsheet cells',   idem: true },
  slides_edit:      { title: 'Edit presentation',         idem: false },
  canvas_add:       { title: 'Add canvas object',         idem: false },
  code_write_file:  { title: 'Write code file',           idem: true },
  create_chart:     { title: 'Create chart',              idem: false },
  create_document:  { title: 'Create document',           idem: false },
};
function annoter(nom, ecrit) {
  const m = META[nom] || { title: nom.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()), lecture: !ecrit };
  const lecture = META[nom] ? m.lecture : !ecrit;
  return { title: m.title, annotations: lecture
    ? { title: m.title, readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
    : { title: m.title, readOnlyHint: false, destructiveHint: true, idempotentHint: !!m.idem, openWorldHint: false } };
}
const ici = __dirname;
const log = (...a) => { try { process.stderr.write('[aura-mcp] ' + a.join(' ') + '\n'); } catch (_) {} };
/* Fichier de connexion : variable AURA_CONNEXION (extension Claude Desktop), puis à côté du
   script (dossier Documents\Aura Script\Connecteur), puis l'emplacement fixe %USERPROFILE%\.aura-script. */
function connexion() {
  for (const f of [process.env.AURA_CONNEXION, path.join(ici, 'connexion.json'), path.join(require('os').homedir(), '.aura-script', 'connexion.json')]) {
    if (!f) continue;
    try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (_) {}
  }
  return null;
}
/* Invites prêtes à l'emploi : elles apparaissent dans le menu de Claude (et des autres clients). */
const INVITES = [
  { name: 'rediger_document', title: 'Rédiger un document dans Aura Script', description: 'Rédige un document complet et le crée dans Aura Script.', arguments: [{ name: 'sujet', description: 'Sujet ou consigne du document', required: true }],
    texte: a => `Rédige un document soigné sur : ${a.sujet}. Structure-le avec des titres. Quand il est prêt, crée-le dans Aura Script avec l’outil create_document (type « texte », contenu en Markdown).` },
  { name: 'resumer_document', title: 'Résumer un document Aura Script', description: 'Trouve un document et en fait un résumé.', arguments: [{ name: 'titre', description: 'Titre ou mot-clé du document', required: true }],
    texte: a => `Cherche dans Aura Script le document « ${a.titre} » (search_documents puis read_document) et fais-en un résumé clair en 5 points, puis propose 3 améliorations.` },
  { name: 'document_en_presentation', title: 'Transformer un document en présentation', description: 'Crée une présentation Aura Script à partir d’un document.', arguments: [{ name: 'titre', description: 'Titre ou mot-clé du document source', required: true }],
    texte: a => `Lis le document Aura Script « ${a.titre} », puis crée une présentation (create_document, type « slides », Markdown avec « # Titre » par diapositive) : une idée par diapositive, 3 à 6 puces.` },
  { name: 'tableau_depuis_texte', title: 'Créer une feuille de calcul', description: 'Transforme des données en feuille Aura Script.', arguments: [{ name: 'donnees', description: 'Données ou description du tableau', required: true }],
    texte: a => `Organise ces données en tableau avec une ligne d’en-tête, puis crée une feuille dans Aura Script (create_document, type « sheet », contenu CSV) : ${a.donnees}` },
];

/* ---------- pont vers l'application ouverte ---------- */
let seq = 0, nomClient = '';
function appeler(type, nom, args, delai) {
  const c = connexion(); if (!c || !c.tube) return Promise.reject(new Error('connecteur désactivé'));
  return new Promise((ok, ko) => {
    const s = net.connect(c.tube); let tampon = '', fini = false; const id = ++seq;
    const fin = (e, v) => { if (fini) return; fini = true; clearTimeout(t); try { s.destroy(); } catch (_) {} e ? ko(e) : ok(v); };
    const t = setTimeout(() => fin(new Error('délai dépassé')), delai || 310000);
    s.on('connect', () => s.write(JSON.stringify({ id, jeton: c.jeton, type, nom, args, client: nomClient }) + '\n'));
    s.on('data', d => { tampon += d; const i = tampon.indexOf('\n'); if (i >= 0) { let r; try { r = JSON.parse(tampon.slice(0, i)); } catch (e) { return fin(e); } r.erreur ? fin(new Error(r.erreur)) : fin(null, r.resultat); } });
    s.on('error', e => fin(e));
  });
}
const appOuverte = () => appeler('outils', '', {}, 1500).then(() => true, () => false);

/* ---------- mode « application fermée » ---------- */
function partages() {
  const c = connexion(); if (!c) return [];
  try { return fs.readdirSync(c.partage).filter(f => f.endsWith('.json')).map(f => { try { return JSON.parse(fs.readFileSync(path.join(c.partage, f), 'utf8')); } catch (_) { return null; } }).filter(Boolean); } catch (_) { return []; }
}
const OUTILS_HORS_LIGNE = [
  { name: 'list_documents', description: 'Liste les documents que l’utilisateur a partagés avec les assistants (Aura Script est fermé : lecture seule).', inputSchema: { type: 'object', properties: { type: { type: 'string', description: 'texte, slides, sheet, canvas, code, pdf' } } } },
  { name: 'read_document', description: 'Lit un document partagé (id obtenu par list_documents).', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'search_documents', description: 'Cherche un texte dans les documents partagés.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'create_document', description: 'Propose un NOUVEAU document (texte en Markdown, sheet en CSV, slides en Markdown « # Titre », code). Aura Script étant fermé, la proposition sera présentée à l’utilisateur à la prochaine ouverture.', inputSchema: { type: 'object', properties: { type: { type: 'string', enum: ['texte', 'sheet', 'slides', 'code'] }, title: { type: 'string' }, content: { type: 'string' } }, required: ['type', 'title', 'content'] } },
];
const OUTILS_HORS_LIGNE_ANNOTES = () => OUTILS_HORS_LIGNE.map(o => { const { annotations: _a, ...base } = o; return { ...base, ...annoter(o.name, o.name === 'create_document') }; });
const PAS_INSTALLE = 'Aura Script n’est pas encore relié sur cet ordinateur. Installez Aura Script (Microsoft Store, gratuit), puis activez Paramètres › Connecteurs › « Activer le connecteur MCP local ». / Aura Script is not connected on this computer yet: install Aura Script (free, Microsoft Store), then turn on Settings › Connectors › “Enable the local MCP connector”.';
function horsLigne(nom, a) {
  if (!connexion()) throw new Error(PAS_INSTALLE);
  const docs = partages();
  if (nom === 'list_documents') return docs.filter(d => !a.type || d.type === a.type).map(d => ({ id: d.id, type: d.type, titre: d.titre, modifie: new Date(d.modifie).toISOString() }));
  if (nom === 'read_document') { const d = docs.find(x => x.id === a.id); if (!d) throw new Error('Document introuvable ou non partagé.'); return d; }
  if (nom === 'search_documents') { const q = String(a.query || '').toLowerCase(); if (!q) return []; return docs.map(d => { const t = JSON.stringify(d.contenu).toLowerCase(), i = t.indexOf(q); return i < 0 ? null : { id: d.id, titre: d.titre, type: d.type, extrait: t.slice(Math.max(0, i - 120), i + 160) }; }).filter(Boolean).slice(0, 30); }
  if (nom === 'create_document') {
    const c = connexion(); const f = path.join(c.enAttente, Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '.json');
    const prop = { action: 'create_document', args: { type: String(a.type), title: String(a.title || '').slice(0, 200), content: String(a.content || '').slice(0, 2e6) }, client: nomClient, date: Date.now() };
    fs.mkdirSync(c.enAttente, { recursive: true }); fs.writeFileSync(f, JSON.stringify(prop, null, 1));
    return { en_attente: true, message: 'Aura Script est fermé : le document sera proposé à l’utilisateur à la prochaine ouverture.' };
  }
  throw new Error('Cet outil nécessite qu’Aura Script soit ouvert.');
}

/* ---------- JSON-RPC 2.0 sur stdio ---------- */
const envoyer = m => process.stdout.write(JSON.stringify(m) + '\n');
const resultat = (id, result) => envoyer({ jsonrpc: '2.0', id, result });
const erreur = (id, code, message) => envoyer({ jsonrpc: '2.0', id, error: { code, message } });
const texte = v => ({ content: [{ type: 'text', text: typeof v === 'string' ? v : JSON.stringify(v, null, 1) }] });

async function traiter(m) {
  const { id, method, params = {} } = m;
  if (method === 'initialize') {
    nomClient = String(params.clientInfo?.name || '').slice(0, 60);
    const v = VERSIONS.includes(params.protocolVersion) ? params.protocolVersion : VERSIONS[1];
    return resultat(id, { protocolVersion: v, capabilities: { tools: { listChanged: false }, resources: { listChanged: false }, prompts: { listChanged: false } }, serverInfo: { name: 'aura-script', title: 'Aura Script', version: VERSION }, instructions: 'Aura Script est un logiciel d’écriture local (texte, présentations, feuilles de calcul, canvas, code, PDF). Quand l’application est ouverte, les outils agissent sur ses documents ; chaque modification est soumise à l’accord de l’utilisateur. Quand elle est fermée, seuls les documents partagés sont lisibles.' });
  }
  if (method === 'ping') return resultat(id, {});
  if (method === 'prompts/list') return resultat(id, { prompts: INVITES.map(({ texte, ...p }) => p) });
  if (method === 'prompts/get') {
    const p = INVITES.find(x => x.name === params.name); if (!p) return erreur(id, -32602, 'Invite inconnue : ' + params.name);
    const a = params.arguments || {}; for (const x of p.arguments) if (x.required && !String(a[x.name] || '').trim()) return erreur(id, -32602, 'Argument manquant : ' + x.name);
    return resultat(id, { description: p.description, messages: [{ role: 'user', content: { type: 'text', text: p.texte(a) } }] });
  }
  if (method === 'tools/list') {
    try { const l = await appeler('outils', '', {}, 1500); return resultat(id, { tools: l.map(o => ({ name: o.name, description: o.description, inputSchema: o.parameters, ...annoter(o.name, !!o.ecrit) })) }); }
    catch (_) { return resultat(id, { tools: OUTILS_HORS_LIGNE_ANNOTES() }); }
  }
  if (method === 'tools/call') {
    const nom = String(params.name || ''), args = params.arguments || {};
    try {
      if (await appOuverte()) { const r = await appeler('appel', nom, args); return resultat(id, { ...texte(r), isError: !!(r && r.erreur) }); }
      return resultat(id, texte(horsLigne(nom, args)));
    } catch (e) { return resultat(id, { ...texte('Erreur : ' + e.message), isError: true }); }
  }
  if (method === 'resources/list') return resultat(id, { resources: partages().map(d => ({ uri: 'aura://document/' + d.id, name: d.titre || d.id, mimeType: 'application/json', description: 'Document Aura Script partagé (' + d.type + ')' })) });
  if (method === 'resources/read') { const uid = String(params.uri || '').replace('aura://document/', ''); const d = partages().find(x => x.id === uid); if (!d) return erreur(id, -32002, 'Ressource introuvable'); return resultat(id, { contents: [{ uri: params.uri, mimeType: 'application/json', text: JSON.stringify(d, null, 1) }] }); }
  if (id !== undefined) return erreur(id, -32601, 'Méthode inconnue : ' + method);
}

let tampon = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => {
  tampon += d; let i;
  while ((i = tampon.indexOf('\n')) >= 0) {
    const l = tampon.slice(0, i).trim(); tampon = tampon.slice(i + 1); if (!l) continue;
    let m; try { m = JSON.parse(l); } catch (_) { erreur(null, -32700, 'JSON invalide'); continue; }
    Promise.resolve(traiter(m)).catch(e => { log(e.stack || e); if (m.id !== undefined) erreur(m.id, -32603, String(e.message || e)); });
  }
});
process.stdin.on('end', () => process.exit(0));
log('prêt');
