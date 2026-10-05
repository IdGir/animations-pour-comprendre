import * as d3 from "d3-geo";
import * as topo from "topojson-client";
import fs from "fs";
const rd=f=>JSON.parse(fs.readFileSync(f,"utf8"));

/* contexte de chemin simplifié (arrondi + tolérance) */
function pathStr(projection, geo, tol=1.2){
  let out=[], lx=null, ly=null, first=null, count=0;
  const ctx={
    moveTo(x,y){ x=Math.round(x); y=Math.round(y); out.push(`M${x} ${y}`); lx=x; ly=y; first=[x,y]; count=0; },
    lineTo(x,y){ x=Math.round(x); y=Math.round(y); if(Math.hypot(x-lx,y-ly)<tol) return; out.push(`L${x} ${y}`); lx=x; ly=y; count++; },
    closePath(){ out.push("Z"); },
    arc(){},
  };
  d3.geoPath(projection, ctx)(geo);
  // retire les anneaux dégénérés
  return out.join("").replace(/M[^MZ]*?Z/g, m=> (m.match(/L/g)||[]).length<2 ? "" : m).replace(/(\d)\.0(?=\D)/g,"$1");
}

/* ===== EUROPE (Clovis / Charlemagne) ===== */
const land=topo.feature(rd("../node_modules/world-atlas/land-50m.json"), rd("../node_modules/world-atlas/land-50m.json").objects.land);
const W=1600, H=760;
const projE=d3.geoConicConformal().rotate([-14,0]).parallels([35,55])
  .fitExtent([[0,0],[W,H]], {type:"Feature",geometry:{type:"Polygon",coordinates:[[[-11,29],[46,29],[46,58.5],[-11,58.5],[-11,29]].reverse()]}})
  .clipExtent([[-20,-20],[W+20,H+20]]);
const poly=c=>({type:"Feature",geometry:{type:"Polygon",coordinates:[c.concat([c[0]]).reverse()]}});
// orientation: d3 attend le sens horaire pour l'intérieur (sphère) — on teste et inverse si l'aire > 2π
const P=c=>{ let f=poly(c); if(d3.geoArea(f)>2*Math.PI) f={type:"Feature",geometry:{type:"Polygon",coordinates:[c.concat([c[0]])]}}; return f; };

const zones={
 west:[[-6.5,49.8],[-5.3,51.5],[-5.0,54.0],[-5.2,55.0],[-1.5,55.1],[2,52.5],[3.2,51.6],[4.3,51.9],[6.1,51.85],[6.9,51.0],[7.6,50.3],[8.3,50],[8.5,49.5],[8.2,48.9],[7.6,47.6],[9.0,47.7],[10.5,48.0],[12.0,48.9],[13.5,48.6],[16,48.2],[17.2,48.0],[18.9,47.8],[19.0,46],[19.3,45],[19.3,43.5],[19.6,41.8],[18.8,30.3],[15,31],[10,32.5],[8,33.5],[5,34.5],[0,35],[-2,34.5],[-5,34],[-6.5,34],[-10,34],[-10,44]],
 east:[[19.3,45],[20.5,44.8],[22.5,44.6],[25,43.7],[28,44],[29.7,45.2],[31,45.5],[38,45],[41.8,41.5],[43,39.5],[41,37.2],[39.5,36],[38.5,34.5],[36.5,32],[35,29.5],[34.5,28],[33.5,24],[32.5,22],[30,22],[27,30],[25,30.5],[20,30.5],[18.8,30.3],[19.6,41.8],[19.3,43.5]],
 francs481:[[2.6,50.3],[4.4,50.25],[5.0,51.0],[4.3,51.7],[3.2,51.4],[2.4,51.1]],
 syagrius:[[-1.4,49.7],[0,49.7],[1.5,50.2],[2.6,50.3],[4.4,50.25],[5.0,49.5],[4.8,48.3],[3.5,47.5],[1.5,47.3],[0,47.5],[-1.2,48.4]],
 francs511:[[-1.4,49.7],[-1.8,48.6],[-2.1,47.2],[-1.5,46.2],[-1.2,45],[-1.5,43.5],[-1.8,43.3],[0,42.7],[1.6,42.6],[2.0,43.4],[3.0,44.1],[3.6,44.4],[4.0,45.0],[3.9,46.2],[4.2,47.0],[4.6,47.6],[5.2,47.9],[6.5,47.9],[7.6,47.6],[8.6,47.7],[9.6,48.3],[10.5,49.4],[9.8,50.5],[8.6,51.5],[7.0,52.3],[5.5,53.4],[4.6,52.9],[3.2,51.6],[2.0,51.1],[1.5,50.2],[0,49.7]],
 burgondes:[[3.9,46.2],[4.0,45.0],[3.6,44.4],[4.6,44.0],[5.6,44.0],[6.9,44.3],[7.1,45.3],[7.8,45.9],[7.6,46.6],[7.6,47.6],[6.5,47.9],[5.2,47.9],[4.6,47.6],[4.2,47.0]],
 wisigoths:[[1.6,42.6],[0,42.7],[-1.8,43.3],[-9.5,43.2],[-9.6,36.8],[-5.6,36.0],[0,38.5],[3.3,41.9],[4.5,43.3],[3.6,44.4],[3.0,44.1],[2.0,43.4]],
 charlemagne:[[-5,48.6],[-2.5,47],[-1.9,43.4],[-1.5,42.8],[0.5,42.4],[0.6,41.6],[1.5,41.2],[3.5,41.8],[4.5,43.0],[7.5,43.5],[8.5,44.0],[9,43],[10.5,42.5],[12.0,41.4],[13.2,41.25],[14.2,41.9],[14.7,42.2],[13.8,43.5],[13.6,44.6],[14.5,45.3],[15.6,45.0],[16.5,45.2],[18.0,45.0],[19.1,45.6],[19.1,47.0],[18.2,47.9],[16.5,48.6],[14.5,48.6],[13.8,48.8],[12.5,49.7],[12.0,50.3],[11.8,51.4],[11.8,52.4],[11.0,53.0],[10.7,53.6],[10.3,54.4],[9.0,54.8],[8.0,55.0],[5,53.6],[3,51.5],[1.5,51],[-1.0,49.9],[-4,49.0]],
};
const limes=[[4.3,51.9],[6.1,51.85],[6.9,51.0],[7.6,50.3],[8.3,50],[8.5,49.5],[8.2,48.9],[9.0,48.6],[10.5,48.9],[12.0,48.9],[13.5,48.6],[16,48.2],[17.2,48.0],[18.9,47.8],[19.0,46],[20.5,44.8],[22.5,44.6],[25,43.7],[28,44],[29.7,45.2]];
const villes={Rome:[12.5,41.9],Constantinople:[28.98,41.01],Ravenne:[12.2,44.42],Tournai:[3.39,50.6],Soissons:[3.32,49.38],Reims:[4.03,49.26],Paris:[2.35,48.86],"Vouillé":[0.17,46.64],"Aix-la-Chapelle":[6.08,50.78],Barcelone:[2.17,41.39],Pavie:[9.16,45.19],Dijon:[5.04,47.32],Lyon:[4.83,45.76],Toulouse:[1.44,43.6]};
const europe={land:pathStr(projE,land,1.4)};
for(const k in zones) europe[k]=pathStr(projE,P(zones[k]),1);
europe.limes=pathStr(projE,{type:"LineString",coordinates:limes},1);
europe.villes={}; for(const k in villes){ const p=projE(villes[k]); europe.villes[k]=[Math.round(p[0]),Math.round(p[1])]; }
const cz=(f)=>{const c=d3.geoPath(projE).centroid(P(zones[f]));return c.map(Math.round)};
europe.centres={}; for(const k in zones) europe.centres[k]=cz(k);
fs.writeFileSync("europe.json",JSON.stringify(europe));
console.log("europe", JSON.stringify(europe).length);

/* ===== FRANCE ===== */
const reg=rd("regions.geojson"), dep=rd("departements.geojson"), com=rd("communes21.geojson");
const projF=d3.geoConicConformal().rotate([-3,0]).parallels([44,49]).fitExtent([[0,0],[700,700]],reg);
const france={W:700,H:700,regions:[],deps:[],communes:[]};
for(const f of reg.features){ const c=d3.geoPath(projF).centroid(f); france.regions.push({code:f.properties.code,nom:f.properties.nom,d:pathStr(projF,f,1),c:c.map(Math.round),aire:d3.geoArea(f)}); }
for(const f of dep.features){ const c=d3.geoPath(projF).centroid(f); france.deps.push({code:f.properties.code,nom:f.properties.nom,d:pathStr(projF,f,1.1),c:c.map(v=>Math.round(v*10)/10)}); }
// zoom Côte-d'Or : projection dédiée
const cdo=dep.features.find(f=>f.properties.code==="21");
const projC=d3.geoConicConformal().rotate([-3,0]).parallels([44,49]).fitExtent([[0,0],[700,700]],cdo);
france.cdo={d:pathStr(projC,cdo,0.6)};
for(const f of com.features){ const c=d3.geoPath(projC).centroid(f); france.communes.push({nom:f.properties.nom,d:pathStr(projC,f,2.6),c:c.map(Math.round)}); }
const pt=(p,ll)=>p(ll).map(v=>Math.round(v));
france.dijonF=pt(projF,[5.04,47.32]); france.dijonC=pt(projC,[5.04,47.32]); france.parisF=pt(projF,[2.35,48.86]);
// Outre-mer depuis world-atlas 10m
const ctry=rd("../node_modules/world-atlas/countries-10m.json");
const fr=topo.feature(ctry,ctry.objects.countries).features.find(f=>f.properties.name==="France");
const drom={Guadeloupe:[-62,-60.9,15.8,16.6],Martinique:[-61.3,-60.7,14.3,15],Guyane:[-55,-51,2,6],"La Réunion":[55.1,56,-21.5,-20.8],Mayotte:[44.9,45.4,-13.1,-12.5]};
france.drom=[];
for(const nom in drom){ const [x0,x1,y0,y1]=drom[nom];
  const polys=fr.geometry.coordinates.filter(pg=>{ const [lo,la]=pg[0][0]; return lo>=x0&&lo<=x1&&la>=y0&&la<=y1; });
  const g={type:"Feature",geometry:{type:"MultiPolygon",coordinates:polys}};
  const pr=d3.geoMercator().fitExtent([[6,6],[94,94]],g);
  france.drom.push({nom,d:pathStr(pr,g,0.6)}); }
fs.writeFileSync("france.json",JSON.stringify(france));
console.log("france",JSON.stringify(france).length, france.communes.length);

/* ===== MONDE ===== */
{
const land110=rd("../node_modules/world-atlas/land-110m.json");
const L=topo.feature(land110,land110.objects.land);
const pr=d3.geoNaturalEarth1().rotate([-10,0]).fitExtent([[20,90],[1580,840]],{type:"Sphere"});
const world={land:pathStr(pr,L,1.2),sphere:pathStr(pr,{type:"Sphere"},2),pts:{}};
const pts={France:[2.5,46.5],"Pays-Bas":[5.3,52.2],Japon:[139.7,35.7],Kenya:[37.5,0.0],Canada:[-75.7,45.4],"Inde":[77.2,28.6],"Brésil":[-47.9,-15.8],"Australie":[149.1,-35.3],"États-Unis":[-98,39],"Chine":[116.4,39.9],"Afrique du Sud":[28,-26],"Mexique":[-99.1,19.4]};
for(const k in pts) world.pts[k]=pr(pts[k]).map(Math.round);
const grat=d3.geoGraticule10(); world.grat=pathStr(pr,grat,3);
fs.writeFileSync("world.json",JSON.stringify(world)); console.log("world",JSON.stringify(world).length);
}
