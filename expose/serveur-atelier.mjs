#!/usr/bin/env node
/* Atelier Exposés — petit serveur local (Node 18 ou plus, aucune installation de module)
   - sert le dossier où il se trouve (animations-cycle3) sur http://localhost:8642
   - /api/qwant : résultats de recherche pour l'Atelier (API officielle Staan si une clé est enregistrée, sinon Qwant filtre strict)
   - /api/cle   : enregistre la clé Staan (fichier staan-cle.txt, jamais envoyée au navigateur)
   - /api/get   : lit une page web ou un dictionnaire pour l'Atelier (le navigateur seul ne le peut pas)
   - /api/img   : récupère une image pour l'enregistrer dans l'exposé
   N'écoute que sur cet ordinateur (127.0.0.1). Arrêt : fermer la fenêtre noire. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = +process.env.PORT || 8642;
const QWANT = process.env.QWANT_API || "https://api.qwant.com/v3/search/web";
const TEST = !!process.env.ATELIER_TEST;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MIME = { ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".ico": "image/x-icon", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8", ".pdf": "application/pdf" };
const STAAN = process.env.STAAN_API || "https://api.staan.ai/v2/search/web";
const FICHIER_CLE = path.join(DIR, "staan-cle.txt");
const FICHIER_QUOTA = path.join(DIR, "staan-quota.json");
const QUOTA_MAX = 1000; // requêtes gratuites par mois chez Staan
let cleStaan = (process.env.STAAN_API_KEY || "").trim();
if (!cleStaan) { try { cleStaan = fs.readFileSync(FICHIER_CLE, "utf8").split(/\r?\n/)[0].trim(); } catch {} }
const cache = new Map(); // mêmes recherches : pas de requête en plus (économise le quota)
let cookieQwant = "";
const tgp = 1 + Math.floor(Math.random() * 3);

function json(res, code, obj) { res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }); res.end(JSON.stringify(obj)); }
function urlPermise(u) {
  let x; try { x = new URL(u); } catch { return false; }
  if (!/^https?:$/.test(x.protocol)) return false;
  if (TEST) return true;
  const h = x.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".lan") || !h.includes(".") || h.startsWith("[")) return false;
  if (/^(127\.|10\.|0\.|169\.254\.|192\.168\.)/.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) return false;
  return true;
}
async function lireLimite(r, max) {
  const reader = r.body.getReader(); const morceaux = []; let n = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; n += value.length; if (n > max) { reader.cancel(); throw new Error("trop gros"); } morceaux.push(value); }
  return Buffer.concat(morceaux);
}
async function qwant(q, offset) {
  const p = new URLSearchParams({ q, count: "10", locale: "fr_FR", offset: String(offset || 0), device: "desktop", tgp: String(tgp), safesearch: "2", displayed: "true", llm: "false" });
  const r = await fetch(`${QWANT}?${p}`, { headers: { "User-Agent": UA, "Accept": "application/json", "Accept-Language": "fr-FR,fr;q=0.9",
    "Referer": "https://www.qwant.com/", "Origin": "https://www.qwant.com", ...(cookieQwant ? { Cookie: cookieQwant } : {}) }, signal: AbortSignal.timeout(12000) });
  const sc = (r.headers.getSetCookie && r.headers.getSetCookie()) || []; const dd = sc.find(c => c.startsWith("datadome=")); if (dd) cookieQwant = dd.split(";")[0];
  if (r.status === 403) return { ok: false, err: "bloque" };
  if (r.status === 429) return { ok: false, err: "trop" };
  const j = await r.json().catch(() => null);
  if (!j) return { ok: false, err: "refus" };
  if (j.status !== "success") return { ok: false, err: j.data && j.data.error_code === 24 ? "trop" : (j.data && j.data.url ? "bloque" : "refus") };
  const items = [];
  for (const bloc of (j.data && j.data.result && j.data.result.items && j.data.result.items.mainline) || []) {
    if (bloc.type !== "web") continue;
    for (const it of bloc.items || []) if (it.url && it.title) items.push({ title: it.title, url: it.url, desc: it.desc || "" });
  }
  return { ok: true, items };
}
function moisCourant() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
function quota() {
  try { const j = JSON.parse(fs.readFileSync(FICHIER_QUOTA, "utf8")); if (j.mois === moisCourant()) return { mois: j.mois, n: +j.n || 0 }; } catch {}
  return { mois: moisCourant(), n: 0 };
}
function compter() { const q = quota(); q.n++; try { fs.writeFileSync(FICHIER_QUOTA, JSON.stringify(q)); } catch {} return q; }
const domainesValides = t => String(t || "").split(/[\s,;]+/).map(x => x.trim().toLowerCase()).filter(x => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(x)).slice(0, 10);
async function staan(q, offset, inc, exc) {
  const clef = `${q}|${offset}|${inc.join(",")}|${exc.join(",")}`;
  const c = cache.get(clef); if (c && Date.now() - c.t < 3600e3) return c.r;
  if (quota().n >= QUOTA_MAX) return { ok: false, err: "quota" };
  const exclusions = exc.map(d => ` -site:${d}`).join("");
  const entetes = { "Authorization": "Bearer " + cleStaan, "Accept": "application/json", "User-Agent": "Atelier-Exposes/1.1" };
  let r;
  try {
    r = await fetch(STAAN, { method: "POST", headers: { ...entetes, "Content-Type": "application/json" }, signal: AbortSignal.timeout(12000),
      body: JSON.stringify({ q: q + exclusions, market: "fr-fr", offset, ...(inc.length ? { include_domains: inc } : {}) }) });
    if (r.status === 400 || r.status === 422) { // repli : GET avec opérateurs site:
      const op = inc.length ? " (" + inc.map(d => "site:" + d).join(" OR ") + ")" : "";
      const p = new URLSearchParams({ q: q + op + exclusions, market: "fr-fr", offset: String(offset) });
      r = await fetch(`${STAAN}?${p}`, { headers: entetes, signal: AbortSignal.timeout(12000) });
    }
  } catch { return { ok: false, err: "reseau" }; }
  if (r.status === 401 || r.status === 403) return { ok: false, err: "cle" };
  if (r.status === 402) return { ok: false, err: "quota" };
  if (r.status === 429) return { ok: false, err: "trop" };
  if (!r.ok) return { ok: false, err: "refus" };
  const j = await r.json().catch(() => null);
  if (!j) return { ok: false, err: "refus" };
  const n = compter().n;
  const items = ((j.web && j.web.results) || []).filter(x => x.url && x.title).map(x => ({ title: x.title, url: x.url, desc: x.snippet || "" }));
  const res = { ok: true, items, moteur: "staan", n };
  cache.set(clef, { t: Date.now(), r: res });
  return res;
}
async function lire(u, image) {
  const r = await fetch(u, { headers: { "User-Agent": UA, "Accept": image ? "image/*" : "text/html,application/json;q=0.9,*/*;q=0.5", "Accept-Language": "fr-FR,fr;q=0.9" },
    redirect: "follow", signal: AbortSignal.timeout(15000) });
  return r;
}

const serveur = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://localhost");
    if (u.pathname === "/api/ping") return json(res, 200, { atelier: true, v: "1.1", staan: !!cleStaan, quota: { n: quota().n, max: QUOTA_MAX } });
    if (u.pathname === "/api/cle" && req.method === "POST") { // enregistre (ou efface) la clé Staan ; jamais renvoyée au navigateur
      const o = req.headers.origin; if (o && !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o)) return json(res, 403, { ok: false });
      let corps = ""; for await (const m of req) { corps += m; if (corps.length > 2000) return json(res, 413, { ok: false }); }
      let cle = ""; try { cle = String(JSON.parse(corps).cle || "").trim(); } catch {}
      if (cle && !/^[\w.~+\/=-]{8,200}$/.test(cle)) return json(res, 400, { ok: false, err: "format" });
      try { if (cle) fs.writeFileSync(FICHIER_CLE, cle + "\n"); else if (fs.existsSync(FICHIER_CLE)) fs.unlinkSync(FICHIER_CLE); } catch { return json(res, 500, { ok: false, err: "ecriture" }); }
      cleStaan = cle; cache.clear(); return json(res, 200, { ok: true, staan: !!cle });
    }
    if (u.pathname === "/api/qwant") {
      const q = (u.searchParams.get("q") || "").slice(0, 200); if (!q.trim()) return json(res, 400, { ok: false, err: "vide" });
      const offset = +u.searchParams.get("offset") || 0;
      if (cleStaan) { // moteur officiel Staan ; si indisponible (hors quota ou clé refusée) on le dit, sinon repli sur l'ancien moteur
        const r = await staan(q, offset, domainesValides(u.searchParams.get("inc")), domainesValides(u.searchParams.get("exc")));
        if (r.ok || r.err === "quota" || r.err === "cle" || r.err === "trop") return json(res, 200, { ...r, quota: { n: quota().n, max: QUOTA_MAX } });
      }
      try { return json(res, 200, { moteur: "qwant", ...(await qwant(q, offset)) }); } catch (e) { return json(res, 200, { ok: false, err: "reseau" }); }
    }
    if (u.pathname === "/api/get" || u.pathname === "/api/img") {
      const cible = u.searchParams.get("url") || ""; const image = u.pathname === "/api/img";
      if (!urlPermise(cible)) return json(res, 400, { ok: false, err: "adresse refusée" });
      try {
        const r = await lire(cible, image);
        const type = (r.headers.get("content-type") || "").toLowerCase();
        if (image ? !type.startsWith("image/") : !/(text\/|json|xml)/.test(type)) return json(res, 415, { ok: false, err: "type " + type });
        const corps = await lireLimite(r, image ? 8e6 : 4e6);
        res.writeHead(r.status, { "content-type": type || "text/plain", "x-url-finale": r.url, "cache-control": "no-store" }); return res.end(corps);
      } catch (e) { return json(res, 502, { ok: false, err: String(e.message || e) }); }
    }
    // fichiers du dossier
    let rel = decodeURIComponent(u.pathname); if (rel.endsWith("/")) rel += "index.html";
    const chemin = path.normalize(path.join(DIR, rel));
    if (!chemin.startsWith(DIR)) { res.writeHead(403); return res.end("Interdit"); }
    fs.stat(chemin, (err, st) => {
      if (err || !st.isFile()) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); return res.end("Introuvable"); }
      res.writeHead(200, { "content-type": MIME[path.extname(chemin).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(chemin).pipe(res);
    });
  } catch (e) { res.writeHead(500); res.end("Erreur"); }
});
serveur.on("error", e => {
  if (e.code === "EADDRINUSE") { console.log(`L'Atelier est déjà lancé (port ${PORT}). J'ouvre le navigateur.`); ouvrir(); setTimeout(() => process.exit(0), 1500); }
  else { console.error(e); }
});
function ouvrir() {
  if (process.argv.includes("--sans-navigateur")) return;
  const url = `http://localhost:${PORT}/expose.html`;
  const cmd = process.platform === "win32" ? `start "" "${url}"` : process.platform === "darwin" ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, () => {});
}
serveur.listen(PORT, "127.0.0.1", () => {
  console.log("Atelier Exposés : http://localhost:" + PORT + "/expose.html");
  console.log("Laissez cette fenêtre ouverte pendant la séance. Pour arrêter : fermez-la.");
  ouvrir();
});
