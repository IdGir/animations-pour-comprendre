#!/usr/bin/env node
/* Télécharge les photos d'illustration depuis Wikimedia Commons (licences libres) pour les animations.
   Usage :  node telecharger-photos.mjs            (télécharge ce qui manque)
            node telecharger-photos.mjs --refaire  (retélécharge tout)
            node telecharger-photos.mjs chateau-guedelon  (retélécharge une seule photo)
   Aucune dépendance : Node 18 ou plus. Écrit : <id>.jpg, credits.js (crédits affichés dans les animations), apercu.html (à vérifier). */
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "AnimationsPourComprendre/1.0 (usage pedagogique en classe, cycle 3; https://commons.wikimedia.org)";
const LICENCES = /^(CC0|CC BY|CC BY-SA|CC-BY|Public domain|PD|Domaine public|Attribution)/i;
const args = process.argv.slice(2); const refaireTout = args.includes("--refaire"); const ids = args.filter(a => !a.startsWith("--"));
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
const creditsFile = path.join(dir, "credits.js");
let credits = {}; try { credits = JSON.parse(fs.readFileSync(creditsFile, "utf8").replace(/^[^{]*/, "").replace(/;\s*$/, "")); } catch {}
const infos = (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, "infos.json"), "utf8")); } catch { return {}; } })();
const norm = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const strip = h => (h || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(url, binaire = false, essais = 4) {
  for (let i = 0; i < essais; i++) {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": binaire ? "image/*" : "application/json" } });
    if (r.status === 429 || r.status >= 500) { await sleep(2000 * (i + 1)); continue; }
    if (!r.ok) throw new Error("HTTP " + r.status + " pour " + url.slice(0, 90));
    return binaire ? Buffer.from(await r.arrayBuffer()) : r.json();
  }
  throw new Error("Trop de tentatives : " + url.slice(0, 90));
}
const PROPS = "&prop=imageinfo&iiprop=url|extmetadata|mime|size&iiurlwidth=1280&format=json";
function candidats(json) { return Object.values(json?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0)).filter(p => p.imageinfo?.[0]); }
function valide(p, must) {
  const ii = p.imageinfo[0], md = ii.extmetadata || {};
  if (!/^image\/jpeg$/.test(ii.mime)) return false;
  if (ii.width < 1000) return false;
  const lic = strip(md.LicenseShortName?.value); if (!LICENCES.test(lic) || /non-free|fair use/i.test(lic)) return false;
  const texte = norm(p.title + " " + strip(md.ImageDescription?.value) + " " + strip(md.ObjectName?.value) + " " + strip(md.Categories?.value));
  return (must || []).every(m => texte.includes(norm(m)));
}
async function trouver(e) {
  if (e.file) { const t = e.file.startsWith("File:") ? e.file : "File:" + e.file;
    const j = await get(`${API}?action=query&titles=${encodeURIComponent(t)}${PROPS}`); const c = candidats(j); if (c.length) return c[0]; throw new Error("fichier introuvable : " + t); }
  const j = await get(`${API}?action=query&generator=search&gsrsearch=${encodeURIComponent(e.q + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=25${PROPS}`);
  const c = candidats(j).filter(p => valide(p, e.must)); if (!c.length) throw new Error("aucun résultat libre et net pour « " + e.q + " »");
  return c[0];
}
const ok = [], ko = [];
for (const e of manifest) {
  if (ids.length && !ids.includes(e.id)) continue;
  const f = path.join(dir, e.id + ".jpg");
  if (!refaireTout && !ids.length && fs.existsSync(f) && credits[e.id]) { console.log("déjà là   ", e.id); continue; }
  try {
    const p = await trouver(e); const ii = p.imageinfo[0], md = ii.extmetadata || {};
    const buf = await get(ii.thumburl || ii.url, true); fs.writeFileSync(f, buf);
    const auteur = strip(md.Artist?.value) || "auteur inconnu", lic = strip(md.LicenseShortName?.value) || "licence libre";
    credits[e.id] = `${auteur.slice(0, 60)} · ${lic} · Wikimedia Commons`;
    infos[e.id] = { titre: p.title, page: ii.descriptionurl, auteur, licence: lic, requete: e.q || e.file, alt: e.alt || "" };
    console.log("téléchargé", e.id, "←", p.title); ok.push(e.id); await sleep(400);
  } catch (err) { console.log("ÉCHEC     ", e.id, "—", err.message); ko.push(e.id); }
}
fs.writeFileSync(creditsFile, "window.PHOTO_CREDITS=" + JSON.stringify(credits, null, 1) + ";\n");
fs.writeFileSync(path.join(dir, "infos.json"), JSON.stringify(infos, null, 1));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
fs.writeFileSync(path.join(dir, "apercu.html"), `<!doctype html><meta charset="utf-8"><title>Aperçu des photos</title><style>body{font-family:Segoe UI,sans-serif;margin:20px;background:#f4f4f6}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}figure{margin:0;background:#fff;border-radius:10px;padding:10px;box-shadow:0 1px 6px #0002}img{width:100%;height:220px;object-fit:cover;border-radius:6px}figcaption{font-size:14px;line-height:1.4}</style><h1>Photos téléchargées (${Object.keys(infos).length})</h1><p>Vérifiez que chaque image correspond bien au sujet. Pour en changer une : ouvrez manifest.json, remplacez la requête par <code>"file": "Nom_du_fichier.jpg"</code> (nom exact sur commons.wikimedia.org), puis relancez le script avec l'identifiant.</p><div class="g">${Object.entries(infos).map(([id, i]) => `<figure><img src="${id}.jpg"><figcaption><b>${esc(id)}</b> — ${esc(i.alt)}<br>${esc(i.titre)}<br>${esc(credits[id] || "")}<br><a href="${esc(i.page)}">page Commons</a></figcaption></figure>`).join("")}</div>`);
console.log(`\nTerminé : ${ok.length} téléchargée(s), ${ko.length} échec(s). Ouvrez apercu.html pour vérifier les images.`);
if (ko.length) console.log("À revoir :", ko.join(", "));
