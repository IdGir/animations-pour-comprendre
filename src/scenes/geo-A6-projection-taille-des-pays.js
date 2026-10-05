/* META {"id":"geo-A6-projection-taille-des-pays","matiere":"geographie","annee":"connexe","periode":1,"theme":"Se déplacer / se repérer dans l'espace (connexe)","resume":"Pour aplatir la Terre sur une carte, il faut l'étirer : la carte de Mercator gonfle les pays proches des pôles (le Groenland paraît aussi grand que l'Afrique, qui est pourtant 14 fois plus grande).","motsCles":["projection","Mercator","planisphère","échelle","déformation","Groenland","Afrique","globe"]} */
//@data n4gores n4land
(function(){
/* ===== bibliothèque géo (copiée dans chaque scène N4) ===== */
const D2R=Math.PI/180;
const C={ink:"#1E2430",ink2:"#4A5468",sea:"#CFE6F4",seaD:"#A9CDE4",land:"#E8DFC4",landS:"#B5A67C",teal:"#1C6E61",tealS:"#D5EAE4",or:"#E07A1F",red:"#C0392B",blue:"#2563A8",green:"#2E8B57",line:"#D6DBE4",night:"#1B2A52"};
/* décodage des anneaux (dixièmes de degré) */
function decode(rs){ return rs.map(r=>{ const n=r.p.length/2, lon=new Float32Array(n), lat=new Float32Array(n), X=new Float32Array(n), Y=new Float32Array(n), Z=new Float32Array(n);
  for(let i=0;i<n;i++){ const L=r.p[2*i]/10, P=r.p[2*i+1]/10; lon[i]=L; lat[i]=P; const a=L*D2R,b=P*D2R; X[i]=Math.cos(b)*Math.cos(a); Y[i]=Math.cos(b)*Math.sin(a); Z[i]=Math.sin(b); }
  return {h:!!r.h,n,lon,lat,X,Y,Z}; }); }
const f1=v=>(Math.round(v*10)/10);
/* anneaux -> chemin SVG avec une fonction de projection pt(lon,lat)->[x,y] (anneaux ouverts non fermés par la projection) */
function flatPath(rs,pt){ let d=""; for(const r of rs){ for(let i=0;i<r.n;i++){ const q=pt(r.lon[i],r.lat[i]); d+=(i?"L":"M")+f1(q[0])+" "+f1(q[1]); } d+="Z"; } return d; }
/* ---------- globe orthographique avec découpe à l'horizon ---------- */
const ORI=1; // sens de l'arc sur le limbe (déterminé par test, voir plus bas)
function orthoPath(rs,lon0,lat0,R,cx,cy){
  const l0=lon0*D2R,p0=lat0*D2R, cl=Math.cos(l0), sl=Math.sin(l0), cp=Math.cos(p0), sp=Math.sin(p0);
  let d="";
  for(const r of rs){
    const n=r.n, dx=new Float32Array(n), sx=new Float32Array(n), sy=new Float32Array(n); let nv=0;
    for(let i=0;i<n;i++){ const x1=r.X[i]*cl+r.Y[i]*sl, y1=-r.X[i]*sl+r.Y[i]*cl; const x2=x1*cp+r.Z[i]*sp, z2=-x1*sp+r.Z[i]*cp; dx[i]=x2; sx[i]=y1; sy[i]=z2; if(x2>=0) nv++; }
    if(nv===0) continue;
    if(nv===n){ for(let i=0;i<n;i++) d+=(i?"L":"M")+f1(cx+R*sx[i])+" "+f1(cy-R*sy[i]); d+="Z"; continue; }
    if(r.h) continue;
    // points d'entrée / sortie sur le limbe
    const cross=(a,b)=>{ const s=dx[a]/(dx[a]-dx[b]); let y=sx[a]+s*(sx[b]-sx[a]), z=sy[a]+s*(sy[b]-sy[a]); const L=Math.hypot(y,z)||1; return [y/L,z/L]; };
    const runs=[];
    for(let i=0;i<n;i++){ const j=(i+1)%n; if(dx[i]<0&&dx[j]>=0){
      const E=cross(i,j); const pts=[]; let k=j; let guard=0;
      while(dx[k]>=0&&guard++<n){ pts.push([sx[k],sy[k]]); k=(k+1)%n; }
      const X=cross((k+n-1)%n,k);
      runs.push({E,X,pts,ae:Math.atan2(-E[1],E[0]),ax:Math.atan2(-X[1],X[0])}); } }
    if(!runs.length) continue;
    const used=new Array(runs.length).fill(false);
    for(let s0=0;s0<runs.length;s0++){ if(used[s0]) continue; let cur=s0, guard=0; let first=true;
      while(!used[cur]&&guard++<runs.length+1){
        used[cur]=true; const rn=runs[cur];
        d+=(first?"M":"L")+f1(cx+R*rn.E[0])+" "+f1(cy-R*rn.E[1]); first=false;
        for(const q of rn.pts) d+="L"+f1(cx+R*q[0])+" "+f1(cy-R*q[1]);
        d+="L"+f1(cx+R*rn.X[0])+" "+f1(cy-R*rn.X[1]);
        // prochain run le long du limbe
        let best=-1,bd=1e9; for(let q=0;q<runs.length;q++){ let da=(runs[q].ae-rn.ax)*ORI; da=((da%(2*Math.PI))+2*Math.PI)%(2*Math.PI); if(da<bd){bd=da;best=q;} }
        const steps=Math.max(1,Math.ceil(bd/(8*D2R)));
        for(let m=1;m<=steps;m++){ const a=rn.ax+ORI*bd*m/steps; d+="L"+f1(cx+R*Math.cos(a))+" "+f1(cy+R*Math.sin(a)); }
        cur=best; }
      d+="Z"; }
  }
  return d;
}
/* ligne de la graticule sur le globe : liste de points lon/lat -> segments visibles */
function orthoLine(pts,lon0,lat0,R,cx,cy){
  const l0=lon0*D2R,p0=lat0*D2R, cl=Math.cos(l0), sl=Math.sin(l0), cp=Math.cos(p0), sp=Math.sin(p0);
  let d="", pen=false, prev=null;
  for(const [lo,la] of pts){ const a=lo*D2R,b=la*D2R; const x=Math.cos(b)*Math.cos(a), y=Math.cos(b)*Math.sin(a), z=Math.sin(b);
    const x1=x*cl+y*sl, y1=-x*sl+y*cl; const x2=x1*cp+z*sp, z2=-x1*sp+z*cp;
    if(x2>=0){ d+=(pen?"L":"M")+f1(cx+R*y1)+" "+f1(cy-R*z2); pen=true; } else pen=false; }
  return d;
}
const meridian=(lon,step)=>{ const a=[]; for(let la=-90;la<=90.001;la+=step||3) a.push([lon,la]); return a; };
const parallel=(lat,step)=>{ const a=[]; for(let lo=-180;lo<=180.001;lo+=step||3) a.push([lo,lat]); return a; };
/* test d'orientation : un anneau extérieur entièrement visible est-il horaire à l'écran ? */
function equiX(lon,W,lon0){ return (lon-lon0)/360*W; }
/* projections planes */
const mercY=lat=>{ const p=Math.max(-85,Math.min(85,lat))*D2R; return Math.log(Math.tan(Math.PI/4+p/2))/D2R; }; // en "degrés équivalents"
function mollweide(lon,lat,R,cx,cy,lon0){ const p=lat*D2R; let th=p; if(Math.abs(lat)<89.99){ for(let i=0;i<8;i++){ const f=2*th+Math.sin(2*th)-Math.PI*Math.sin(p); const fp=2+2*Math.cos(2*th); if(Math.abs(fp)<1e-9)break; th-=f/fp; } } else th=Math.sign(p)*Math.PI/2;
  let dl=lon-(lon0||0); return [cx+R*(2*Math.SQRT2/Math.PI)*(dl*D2R)*Math.cos(th), cy-R*Math.SQRT2*Math.sin(th)]; }
/* texte avec halo blanc */
function T(parent,x,y,str,o){ o=o||{}; const t=Anim.H.el("text",{x,y,"text-anchor":o.anchor||"middle","font-size":o.size||24,"font-weight":o.weight||700,fill:o.color||C.ink,stroke:o.halo===false?null:(o.haloColor||"#fff"),"stroke-width":o.halo===false?null:(o.sw||6),"paint-order":"stroke","stroke-linejoin":"round",transform:o.rot?`rotate(${o.rot} ${x} ${y})`:null},parent); const ls=String(str).split("\n"); if(ls.length===1) t.textContent=str; else ls.forEach((l,i)=>Anim.H.el("tspan",{x,dy:i?(o.lh||1.15)*(o.size||24):0,text:l},t)); return t; }
/* pastille (point repère) */
function dot(parent,x,y,r,col){ return Anim.H.el("circle",{cx:x,cy:y,r:r||9,fill:col||C.or,stroke:"#fff","stroke-width":3},parent); }
/* flèche simple */
function A(parent,d,col,w,head){ return Anim.H.arrow(parent,d,{color:col||C.or,w:w||6,head:head||4}); }
/* test de l'orientation des anneaux */
(function(){ /* rien : l'orientation est fixée par la constante ORI */ })();
function orthoPt(lon,lat,lon0,lat0,R,cx,cy){ const l0=lon0*D2R,p0=lat0*D2R; const a=lon*D2R,b=lat*D2R; const x=Math.cos(b)*Math.cos(a), y=Math.cos(b)*Math.sin(a), z=Math.sin(b);
  const x1=x*Math.cos(l0)+y*Math.sin(l0), y1=-x*Math.sin(l0)+y*Math.cos(l0); const x2=x1*Math.cos(p0)+z*Math.sin(p0), z2=-x1*Math.sin(p0)+z*Math.cos(p0); return [cx+R*y1,cy-R*z2,x2]; }
/* icônes soleil / lune (formes SVG) */
function sunIcon(parent,x,y,s,col){ const g=Anim.H.el("g",{transform:`translate(${x},${y}) scale(${s})`},parent); for(let k=0;k<8;k++){ const an=k*Math.PI/4; Anim.H.el("line",{x1:Math.cos(an)*1.35,y1:Math.sin(an)*1.35,x2:Math.cos(an)*1.9,y2:Math.sin(an)*1.9,stroke:col||"#F2A900","stroke-width":.28,"stroke-linecap":"round"},g); } Anim.H.el("circle",{r:1,fill:col||"#F5B800",stroke:"#C98A00","stroke-width":.1},g); return g; }
function moonIcon(parent,x,y,s,col){ const g=Anim.H.el("g",{transform:`translate(${x},${y}) scale(${s})`},parent); Anim.H.el("path",{d:"M0.35,-1.5 A1.5,1.5 0 1 0 1.3,0.8 A1.25,1.25 0 0 1 0.35,-1.5 Z",fill:col||"#2D3E7A",stroke:"#1B2A52","stroke-width":.1},g); return g; }
/* horloge à aiguilles : renvoie {g,set(h)} */
function makeClock(parent,x,y,r,col){ const g=Anim.H.el("g",{transform:`translate(${x},${y})`},parent); const E=Anim.H.el;
  E("circle",{r:r+8,fill:"#fff",stroke:col||C.ink,"stroke-width":8},g); E("circle",{r,fill:"#FBFBF8",stroke:"#C9CED8","stroke-width":2},g);
  for(let k=0;k<12;k++){ const an=k*Math.PI/6; E("line",{x1:Math.sin(an)*r*.84,y1:-Math.cos(an)*r*.84,x2:Math.sin(an)*r*.95,y2:-Math.cos(an)*r*.95,stroke:C.ink,"stroke-width":k%3?3:6},g); }
  [[12,0,-.64],[3,.64,0],[6,0,.64],[9,-.64,0]].forEach(([n,dx,dy])=>E("text",{x:dx*r,y:dy*r+8,"text-anchor":"middle","font-size":Math.max(22,r*.24),"font-weight":700,fill:C.ink,text:String(n)},g));
  const hh=E("line",{x1:0,y1:0,x2:0,y2:-r*.5,stroke:C.ink,"stroke-width":9,"stroke-linecap":"round"},g), mm=E("line",{x1:0,y1:0,x2:0,y2:-r*.78,stroke:C.ink,"stroke-width":5,"stroke-linecap":"round"},g); E("circle",{r:8,fill:C.ink},g);
  return {g,set(h){ h=((h%24)+24)%24; hh.setAttribute("transform",`rotate(${(h%12)*30})`); mm.setAttribute("transform",`rotate(${(h%1)*360})`); }}; }
const pad2=n=>String(n).padStart(2,"0");
function fmtT(h){ let m=Math.round(((h%24)+24)%24*60)%1440; return Math.floor(m/60)+" h "+pad2(m%60); }
/* densification d'anneaux lon/lat (pas en degrés) pour les projections qui courbent les bords */
function densify(rs,step){ step=step||3; return rs.map(r=>{ const L=[],P=[]; for(let i=0;i<r.n;i++){ const j=(i+1)%r.n; const a=[r.lon[i],r.lat[i]], b=[r.lon[j],r.lat[j]]; const k=Math.max(1,Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))/step)); for(let m=0;m<k;m++){ L.push(a[0]+(b[0]-a[0])*m/k); P.push(a[1]+(b[1]-a[1])*m/k); } } return {h:r.h,n:L.length,lon:L,lat:P}; }); }
function polyRing(pts){ return {h:false,n:pts.length,lon:pts.map(p=>p[0]),lat:pts.map(p=>p[1])}; }

const D=D2R;
const MX=640, YEM=615, YES=470, RS=165, W60=60*D*RS;
const SEA="#8FC1E3", LANDC="#E3D5A2", LANDS="#B5A67C";
const ORG="#E8913A", ORGD="#9A4F00", REDC="#C0392B", GRN="#3E9B5B";
const LANDALL=decode(N4LAND.land); const LAND=LANDALL.filter(q=>{ let m=-90; for(let i=0;i<q.n;i++) if(q.lat[i]>m) m=q.lat[i]; return m>-58; });
const GO=N4GORES.gores.map(g=>({lonc:g.lonc,rs:decode(g.rings)}));
const CTY={}; Object.keys(N4GORES.cty).forEach(k=>CTY[k]=decode(N4GORES.cty[k]));
const GRO=CTY["Groenland"][0];
const RT=6371.0088;
function sphArea(rs){ let tot=0; for(const q of rs){ let s=0; for(let i=0;i<q.n;i++){ const j=(i+1)%q.n; s+=(q.lon[j]-q.lon[i])*D*(Math.sin(q.lat[i]*D)+Math.sin(q.lat[j]*D))/2; } tot+=Math.abs(s); } return tot*RT*RT; }
const A_GRO=sphArea([GRO]);
const AREF=A_GRO*Math.pow(RS/RT,2); // surface réelle du Groenland en px² à l'échelle de la carte
const lerpv=(a,b,t)=>a+(b-a)*t;
const e3=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function mix(c1,c2,t){ const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)); const a=p(c1),b=p(c2); return "#"+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,"0")).join(""); }
const frN=(v,d)=>(Math.round(v*Math.pow(10,d))/Math.pow(10,d)).toString().replace(".",",");
const MXY=(lon,lat)=>[MX+lon*D*RS, YEM-RS*D*mercY(lat)];
const MR={R:150,cx:600,cy:470};
const MW=(lon,lat)=>mollweide(lon,lat,MR.R,MR.cx,MR.cy,0);
const FR=[5.04,47.32];
const KSQ=300/Math.sqrt(30.4);
/* ---- état de la manipulation ---- */
let Lg=72, touched=false;
let r={};
function gpt(j,dl,la,u,sl){ const cx=MX+(j-2.5)*W60; const xs=cx+dl*D*Math.cos(la*D)*RS, ys=YES-la*D*RS; const xm=cx+dl*D*RS, ym=YEM-RS*D*mercY(la);
  return [MX+(lerpv(xs,xm,u)-MX)*sl, lerpv(ys,ym,u)]; }
function gorePaths(u,sl){
  for(let j=0;j<6;j++){
    const s=sl[j]; let d="";
    for(const q of GO[j].rs){ for(let i=0;i<q.n;i++){ const p=gpt(j,q.lon[i],q.lat[i],u,s); d+=(i?"L":"M")+f1(p[0])+" "+f1(p[1]); } d+="Z"; }
    r.gL[j].setAttribute("d",d);
    let ds=""; const pts=[]; for(let la=90;la>=-90;la-=6) pts.push(gpt(j,-30,la,u,s)); for(let la=-90;la<=90;la+=6) pts.push(gpt(j,30,la,u,s));
    pts.forEach((p,i)=>{ ds+=(i?"L":"M")+f1(p[0])+" "+f1(p[1]); }); r.gS[j].setAttribute("d",ds+"Z");
    let dg=""; [-60,-30,0,30,60].forEach(la=>{ for(let dl=-30;dl<=30;dl+=10){ const p=gpt(j,dl,la,u,s); dg+=(dl>-30?"L":"M")+f1(p[0])+" "+f1(p[1]); } });
    r.gG[j].setAttribute("d",dg);
    if(j<5){ const pg=[]; for(let la=90;la>=-90;la-=6) pg.push(gpt(j,30,la,u,sl[j])); for(let la=-90;la<=90;la+=6) pg.push(gpt(j+1,-30,la,u,sl[j+1])); let dp=""; pg.forEach((p,i)=>{ dp+=(i?"L":"M")+f1(p[0])+" "+f1(p[1]); }); r.gP[j].setAttribute("d",dp+"Z"); }
    r.gL[j].setAttribute("fill",mix(LANDC,j%2?"#D4C48A":LANDC,1-u));
    r.gL[j].setAttribute("stroke",mix(LANDC,j%2?"#D4C48A":LANDC,1-u));
  }
}
/* Groenland tourné le long de son méridien : le centre (72° N, 42° O) est amené à la latitude L */
function groPath(L){ const lc=-42, p0=72, dlt=(p0-L)*D, cd=Math.cos(dlt), sd=Math.sin(dlt); let d="", ar=0, minY=1e9, minX=1e9, maxX=-1e9; const pts=[];
  for(let i=0;i<GRO.n;i++){ const la=GRO.lat[i]*D, dl=(GRO.lon[i]-lc)*D; const x=Math.cos(la)*Math.cos(dl), y=Math.cos(la)*Math.sin(dl), z=Math.sin(la);
    const x2=x*cd+z*sd, z2=z*cd-x*sd; const lat2=Math.asin(Math.max(-1,Math.min(1,z2)))/D, lon2=lc+Math.atan2(y,x2)/D; const p=MXY(lon2,lat2); pts.push(p); d+=(i?"L":"M")+f1(p[0])+" "+f1(p[1]); if(p[1]<minY) minY=p[1]; if(p[0]<minX) minX=p[0]; if(p[0]>maxX) maxX=p[0]; }
  for(let i=0;i<pts.length;i++){ const q=pts[(i+1)%pts.length]; ar+=pts[i][0]*q[1]-q[0]*pts[i][1]; }
  return {d:d+"Z",area:Math.abs(ar)/2,minY,cx:(minX+maxX)/2}; }
function ellipsePath(){ let d=""; for(let k=0;k<=120;k++){ const lat=90-180*k/120; const q=MW(-180,lat); d+=(k?"L":"M")+f1(q[0])+" "+f1(q[1]); } for(let k=120;k>=0;k--){ const lat=90-180*k/120; const q=MW(180,lat); d+="L"+f1(q[0])+" "+f1(q[1]); } return d+"Z"; }
function clr(a){ [r.globe,r.q1,r.q2,r.map,r.hol,r.par,r.tis,r.tisN,r.stretch,r.cmp1,r.cmp2,r.p4,r.p4b,r.p5,r.mw,r.wl,r.wn,r.wc,r.wk,r.phG,r.phM,r.synth,r.myth,r.gores,r.mLand,r.mSea,r.ml,r.gDj,r.lGro,r.lAfr,r.lAlg,r.lMov,r.gMove,r.gGhost,...r.gP,...Object.values(r.hl),...r.cards].forEach(e=>a.op(e,0)); }
Anim.run({
  titre:"Aplatir la Terre : pourquoi les cartes déforment les tailles",
  sousTitre:"Géographie · CM1-CM2 · Se repérer dans l'espace",
  matiere:"geographie", badge:"Géographie",
  accroche:"Sur une carte, le Groenland paraît aussi grand que l'Afrique : est-ce vrai ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a; const defs=el("defs",{},a.svg);
    r.hd=T(a.layer("hd"),800,64,"",{size:38,color:C.teal,halo:false});
    // ----- globe (étape 1)
    const G={cx:560,cy:480,R:255}; r.G=G; const gl=a.layer("globe"); r.globe=gl;
    el("circle",{cx:G.cx,cy:G.cy,r:G.R+8,fill:"#E8F1F7"},gl); el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:SEA,stroke:"#2A6FA8","stroke-width":3},gl);
    r.gLand=el("path",{d:"",fill:LANDC,stroke:LANDS,"stroke-width":1.2,"fill-rule":"evenodd"},gl);
    r.gGrat=el("path",{d:"",fill:"none",stroke:"#fff","stroke-width":1.4,opacity:.55},gl);
    el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:"none",stroke:"#2A6FA8","stroke-width":4},gl);
    r.gDj=el("g",{},gl); dot(r.gDj,0,0,11,C.red); r.gDjT=T(r.gDj,22,-14,"Dijon",{size:28,anchor:"start",color:C.red,sw:6});
    r.q1=el("g",{},a.layer("q1")); a.label(r.q1,1340,360,"Comment dessiner\nune boule sur\nune feuille plate ?",{size:32,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    r.q2=el("g",{},a.layer("q2")); a.label(r.q2,1340,560,"Essaie d'aplatir une écorce\nd'orange sans la déchirer :\nc'est impossible !",{size:27,stroke:C.or,color:C.ink,fill:"#FFF6EA"});
    // ----- carte (clip)
    const cp=el("clipPath",{id:"m6clip"},defs); el("rect",{x:60,y:120,width:1160,height:702},cp);
    const mp=a.layer("map"); r.map=mp; const mi=el("g",{"clip-path":"url(#m6clip)"},mp);
    r.mSea=el("rect",{x:MX-3*W60,y:122,width:6*W60,height:700,fill:SEA,stroke:"#5D7C94","stroke-width":2},mi);
    r.mLand=el("path",{d:flatPath(LAND,MXY),fill:LANDC,stroke:LANDS,"stroke-width":1.2,"fill-rule":"evenodd"},mi);
    r.hl={}; [["Groenland",ORG],["Algérie",REDC],["Afrique",GRN]].forEach(([k,c])=>{ r.hl[k]=el("path",{d:flatPath(CTY[k],MXY),fill:c,"fill-opacity":.85,stroke:mix(c,"#000000",.35),"stroke-width":2,"fill-rule":"evenodd"},mi); });
    r.gGhost=el("path",{d:flatPath([GRO],MXY),fill:"none",stroke:ORGD,"stroke-width":3,"stroke-dasharray":"9 7"},mi);
    r.gMove=el("path",{d:"",fill:ORG,stroke:ORGD,"stroke-width":3,"stroke-linejoin":"round"},mi);
    // gores
    r.gores=el("g",{},mi); r.gS=[]; r.gL=[]; r.gG=[]; r.gP=[];
    for(let j=0;j<6;j++) r.gS.push(el("path",{d:"",fill:SEA,stroke:"#fff","stroke-width":2.5,"stroke-linejoin":"round"},r.gores));
    for(let j=0;j<5;j++) r.gP.push(el("path",{d:"",fill:"#E5533D","fill-opacity":.45,stroke:"none"},r.gores));
    for(let j=0;j<6;j++) r.gL.push(el("path",{d:"",fill:LANDC,stroke:LANDC,"stroke-width":1.6,"stroke-linejoin":"round","fill-rule":"evenodd"},r.gores));
    for(let j=0;j<6;j++) r.gG.push(el("path",{d:"",fill:"none",stroke:"#fff","stroke-width":1.4,opacity:.7},r.gores));
    // étiquettes de la carte
    r.ml=el("g",{},mp);
    r.lGro=T(r.ml,MXY(-42,72)[0],MXY(-42,72)[1]-24,"Groenland",{size:26,color:ORGD,sw:6});
    r.lAfr=T(r.ml,MXY(20,3)[0],MXY(20,3)[1]+8,"Afrique",{size:28,color:"#1B5E35",sw:6});
    r.lAlg=el("g",{},r.ml); { const p=MXY(2,28); el("line",{x1:p[0],y1:p[1],x2:p[0]+95,y2:p[1]-48,stroke:REDC,"stroke-width":3},r.lAlg); T(r.lAlg,p[0]+100,p[1]-44,"Algérie",{size:26,anchor:"start",color:"#8E2418",sw:6}); }
    r.lMov=T(r.ml,0,0,"Groenland",{size:26,color:ORGD,sw:6});
    // callouts des trous (étape 2)
    r.hol=el("g",{},mp); { const p1=gpt(1,30,72,0,1), p2=gpt(3,30,-72,0,1);
      a.label(r.hol,330,165,"des trous !",{size:28,stroke:REDC,color:REDC,fill:"#fff"}); el("line",{x1:360,y1:184,x2:p1[0]-6,y2:p1[1]-6,stroke:REDC,"stroke-width":3},r.hol);
      a.label(r.hol,950,775,"des trous !",{size:28,stroke:REDC,color:REDC,fill:"#fff"}); el("line",{x1:930,y1:757,x2:p2[0]+4,y2:p2[1]+8,stroke:REDC,"stroke-width":3},r.hol); }
    // parallèles et cercles (étape 3)
    r.par=el("g",{},mp); [[60,"60° N"],[30,"30° N"],[0,"0° (équateur)"],[-30,"30° S"]].forEach(([la,tx])=>{ const y=MXY(0,la)[1]; T(r.par,MX+3*W60-8,y-10,tx,{size:22,anchor:"end",color:C.ink,sw:5}); });
    r.tis=el("g",{},mp); [[0,"surface × 1"],[30,"surface × 1,3"],[60,"surface × 4"]].forEach(([la,tx])=>{ const p=MXY(-150,la), rad=9*D*RS/Math.cos(la*D); el("circle",{cx:p[0],cy:p[1],r:rad,fill:"#E5533D","fill-opacity":.5,stroke:"#9A2A18","stroke-width":3},r.tis); T(r.tis,p[0]+rad+12,p[1]+8,tx,{size:24,anchor:"start",color:"#9A2A18",sw:6}); });
    r.tisN=el("g",{},mp); a.label(r.tisN,360,262,"Trois cercles de même taille\nsur le globe",{size:23,stroke:"#9A2A18",color:C.ink,fill:"#fff"});
    r.stretch=el("g",{},mp); a.label(r.stretch,640,851,"Plus on s'éloigne de l'équateur, plus on étire",{size:27,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    r.cmp1=el("g",{},mp); a.label(r.cmp1,640,851,"Sur la carte, le Groenland paraît aussi grand que l'Afrique !",{size:27,stroke:ORGD,color:C.ink,fill:"#FFF3E3"});
    r.cmp2=el("g",{},mp); a.label(r.cmp2,640,851,"En réalité, l'Afrique est environ 14 fois plus grande.",{size:27,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    // ----- panneau des surfaces réelles (étape 4)
    const p4=a.layer("p4"); r.p4=p4; { const X=1245, Y=170; 
      T(p4,1395,150,"Surfaces réelles, à l'échelle",{size:24,color:C.ink2,halo:false});
      el("rect",{x:X,y:Y+16,width:300,height:300,rx:6,fill:GRN,"fill-opacity":.85,stroke:"#1B5E35","stroke-width":3},p4); T(p4,X+150,Y+150,"Afrique",{size:34,color:"#fff",halo:false}); T(p4,X+150,Y+196,"30,4 millions",{size:26,color:"#fff",halo:false,weight:700}); T(p4,X+150,Y+228,"de km²",{size:26,color:"#fff",halo:false,weight:700});
      const s1=KSQ*Math.sqrt(2.166), s2=KSQ*Math.sqrt(2.382);
      el("rect",{x:X,y:Y+360,width:s1,height:s1,rx:3,fill:ORG,stroke:ORGD,"stroke-width":3},p4); el("rect",{x:X+160,y:Y+360,width:s2,height:s2,rx:3,fill:REDC,"fill-opacity":.9,stroke:"#7B1F14","stroke-width":3},p4);
      T(p4,X+s1/2,Y+484,"Groenland",{size:24,color:ORGD,halo:false}); T(p4,X+s1/2,Y+512,"2,2 millions",{size:22,color:C.ink,halo:false,weight:600}); T(p4,X+s1/2,Y+538,"de km²",{size:22,color:C.ink,halo:false,weight:600});
      T(p4,X+160+s2/2,Y+484,"Algérie",{size:24,color:"#8E2418",halo:false}); T(p4,X+160+s2/2,Y+512,"2,4 millions",{size:22,color:C.ink,halo:false,weight:600}); T(p4,X+160+s2/2,Y+538,"de km²",{size:22,color:C.ink,halo:false,weight:600}); }
    r.p4b=el("g",{},p4); a.label(r.p4b,1395,740,"Afrique ≈ 14 Groenlands",{size:28,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    // ----- panneau manipulation (étape 5)
    const p5=a.layer("p5"); r.p5=p5; T(p5,1395,185,"Latitude du centre du Groenland",{size:24,color:C.ink2,halo:false}); r.pL=T(p5,1395,236,"",{size:44,color:ORGD,halo:false,weight:800});
    T(p5,1395,300,"Taille sur la carte",{size:24,color:C.ink2,halo:false}); r.pN=T(p5,1395,380,"",{size:84,color:"#B23A1E",halo:false,weight:800}); T(p5,1395,418,"par rapport à sa vraie taille",{size:24,color:C.ink2,halo:false});
    r.sqA=el("rect",{x:1215,y:770,width:10,height:10,rx:3,fill:ORG,"fill-opacity":.9,stroke:ORGD,"stroke-width":3},p5); r.sqT=el("rect",{x:1215,y:770,width:10,height:10,rx:2,fill:"none",stroke:C.ink,"stroke-width":3,"stroke-dasharray":"7 5"},p5);
    T(p5,1395,812,"Carré plein : sa taille sur la carte",{size:22,color:ORGD,halo:false}); T(p5,1395,842,"Pointillés : sa vraie taille (2,2 millions de km²)",{size:22,color:C.ink,halo:false,weight:600});
    // ----- carte qui respecte les surfaces (étape 6)
    const mw=a.layer("mw"); r.mw=mw; const cm=el("clipPath",{id:"w6clip"},defs); el("path",{d:ellipsePath()},cm);
    el("path",{d:ellipsePath(),fill:SEA},mw); const wi=el("g",{"clip-path":"url(#w6clip)"},mw);
    el("path",{d:flatPath(densify(LANDALL,3),MW),fill:LANDC,stroke:LANDS,"stroke-width":1,"fill-rule":"evenodd"},wi);
    [["Groenland",ORG],["Algérie",REDC],["Afrique",GRN]].forEach(([k,c])=>{ el("path",{d:flatPath(densify(CTY[k],3),MW),fill:c,"fill-opacity":.9,stroke:mix(c,"#000000",.35),"stroke-width":2,"fill-rule":"evenodd"},wi); });
    el("path",{d:ellipsePath(),fill:"none",stroke:"#5D7C94","stroke-width":3},mw);
    r.wl=el("g",{},mw); [["Groenland",-42,72,-80,-70,ORGD],["Algérie",2,28,150,-95,"#8E2418"],["Afrique",20,-8,120,110,"#1B5E35"]].forEach(([n,lo,la,dx,dy,col])=>{ const p=MW(lo,la); el("line",{x1:p[0],y1:p[1],x2:p[0]+dx,y2:p[1]+dy,stroke:col,"stroke-width":3},r.wl); dot(r.wl,p[0],p[1],7,col); T(r.wl,p[0]+dx,p[1]+dy+(dy<0?-10:30),n,{size:28,color:col,sw:6}); });
    r.wn=el("g",{},mw); a.label(r.wn,600,745,"Carte qui respecte les surfaces (les formes sont déformées sur les bords)",{size:24,stroke:C.ink2,color:C.ink,fill:"#fff"});
    r.wc=el("g",{},mw); [["Groenland","2,2 millions de km²",ORG,ORGD],["Algérie","2,4 millions de km²",REDC,"#7B1F14"],["Afrique","30,4 millions de km²",GRN,"#1B5E35"]].forEach(([n,v,c,cd],i)=>{ const y=200+i*118; el("rect",{x:1100,y,width:470,height:100,rx:14,fill:"#fff",stroke:cd,"stroke-width":3},r.wc); el("rect",{x:1118,y:y+22,width:56,height:56,rx:6,fill:c,stroke:cd,"stroke-width":3},r.wc); T(r.wc,1196,y+46,n,{size:30,anchor:"start",color:cd,halo:false}); T(r.wc,1196,y+82,v,{size:26,anchor:"start",color:C.ink,halo:false,weight:600}); });
    r.wk=el("g",{},mw); a.label(r.wk,1335,610,"Le Groenland est plus petit\nque l'Algérie !",{size:30,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    // ----- photos
    const lp=a.layer("photos"); r.phG=a.photo(lp,{id:"g-a6-fuseaux-1507",x:1250,y:215,w:320,h:320,cap:"Fuseaux d'un globe, 1507",rot:2}); r.phM=a.photo(lp,{id:"g-a6-mercator-1569",x:1235,y:215,w:340,h:340,cap:"Carte de Mercator, 1569",rot:-2});
    // ----- synthèse
    const sy=a.layer("synth"); r.synth=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); T(sy,800,76,"À retenir",{size:38,color:C.teal,halo:false});
    r.cards=[["Sphère → feuille plate","On ne peut pas aplatir\nune sphère sans la déformer :\non découpe et on étire","#2A6FA8"],["Carte de Mercator (1569)","Elle garde les formes,\nmais gonfle les pays\nprès des pôles","#C0482A"],["Pour comparer des tailles","Regarder les chiffres ou\nune carte qui respecte\nles surfaces","#2E7D4F"]].map((c,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:270,rx:18,fill:"#F1F7F5",stroke:c[2],"stroke-width":4},g); T(g,x,180,c[0],{size:30,color:c[2],halo:false}); T(g,x,244,c[1],{size:28,color:C.ink,halo:false,weight:600,lh:1.3}); return g; });
    r.myth=a.layer("myth"); a.myth(r.myth,200,440,1200,"Sur une carte, les pays ont leur vraie taille.","Une carte plate déforme toujours : le Groenland paraît aussi grand que l'Afrique, qui est pourtant 14 fois plus grande.");
    // ----- manipulation
    a.manip.innerHTML=`Latitude du Groenland : <input type="range" id="mL" min="0" max="72" step="1" value="72" style="width:260px"> <b id="mLV" style="min-width:150px">72° N</b> <button id="mB0">Position réelle</button><button id="mB1">Équateur</button>`;
    const setL=v=>{ touched=true; Lg=v; a.redraw(); };
    document.getElementById("mL").oninput=e=>setL(+e.target.value);
    document.getElementById("mB0").onclick=()=>setL(72); document.getElementById("mB1").onclick=()=>setL(0);
  },
  reset(a){ clr(a); r.hd.textContent=""; },
  etapes:[
  { titre:"Une sphère sur une feuille plate", duree:11000,
    legende:"La Terre est ronde, mais une carte est plate. Comment représenter une sphère sur une feuille, sans rien déformer ?",
    voix:"Notre planète est une sphère, une grosse boule. Sur ce globe, on voit la France, et Dijon. Mais une carte, elle, est plate : c'est une feuille de papier. Alors, comment dessiner une boule sur une feuille plate ? Essaie d'aplatir une écorce d'orange sans la déchirer : c'est impossible !",
    anim(t,a){ clr(a); const s=a.seg, G=r.G; r.hd.textContent="Une sphère ne se pose pas à plat"; a.op(r.globe,s(t,0,.08)); const lon0=-120+125*s(t,.05,.7,true); const lat0=28;
      r.gLand.setAttribute("d",orthoPath(LANDALL,lon0,lat0,G.R,G.cx,G.cy));
      let dg=""; for(let lo=-180;lo<180;lo+=30) dg+=orthoLine(meridian(lo,4),lon0,lat0,G.R,G.cx,G.cy); for(let la=-60;la<=60;la+=30) dg+=orthoLine(parallel(la,4),lon0,lat0,G.R,G.cx,G.cy); r.gGrat.setAttribute("d",dg);
      const q=orthoPt(FR[0],FR[1],lon0,lat0,G.R,G.cx,G.cy); r.gDj.setAttribute("transform",`translate(${f1(q[0])},${f1(q[1])})`); a.op(r.gDj,q[2]>.1?s(t,.72,.84):0);
      a.op(r.q1,s(t,.5,.62)); a.op(r.q2,s(t,.78,.9)); } },
  { titre:"L'écorce d'orange : des fuseaux", duree:13000,
    legende:"Comme l'écorce d'une orange, la Terre se découpe en fuseaux. Posés à plat, ces fuseaux laissent des trous entre eux.",
    voix:"Imaginons que l'on découpe la surface de la Terre en fuseaux, comme l'écorce d'une orange. Les voici, posés à plat. Regarde : entre les fuseaux, il y a des trous, surtout vers les pôles. C'est ainsi que l'on fabriquait des globes en papier, il y a plus de cinq cents ans. Mais ce n'est pas encore une carte.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent="On découpe la sphère en fuseaux, comme une écorce d'orange"; a.op(r.globe,1-s(t,0,.1)); a.op(r.map,1); a.op(r.mSea,0); a.op(r.gores,s(t,0,.06));
      const sl=[0,1,2,3,4,5].map(j=>e3(s(t,.08+j*.06,.38+j*.06))); gorePaths(0,sl);
      r.gP.forEach((p,j)=>a.op(p,s(t,.7,.82))); a.op(r.hol,s(t,.74,.86)); a.op(r.phG,s(t,.35,.5)); } },
  { titre:"On étire : la projection de Mercator", duree:17000,
    legende:"Pour boucher les trous, on étire les fuseaux, de plus en plus près des pôles : c'est la projection de Mercator (1569). Les formes sont gardées, mais les tailles sont gonflées.",
    voix:"Pour obtenir une carte sans trou, il faut étirer les fuseaux. Plus on s'éloigne de l'équateur, plus on étire. C'est l'idée du cartographe Gerardus Mercator, en mille cinq cent soixante-neuf. Regarde ces trois cercles : sur le globe, ils ont la même taille. Sur la carte, ils restent bien ronds, mais celui du nord est beaucoup plus gros : quatre fois plus en surface. Cette carte garde les formes, mais pas les tailles.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent="Pour boucher les trous, on étire : projection de Mercator"; a.op(r.map,1); a.op(r.mSea,0); a.op(r.gores,1); const u=e3(s(t,.06,.55)); gorePaths(u,[1,1,1,1,1,1]);
      r.gP.forEach(p=>a.op(p,(1-s(t,.45,.56))*.9+.1*0)); a.op(r.hol,0); a.op(r.phG,1-s(t,.05,.15)); a.op(r.par,s(t,.58,.7)); a.op(r.tis,s(t,.66,.78)); a.op(r.tisN,s(t,.66,.78)); a.op(r.stretch,s(t,.4,.52)*(1-s(t,.6,.64))); a.op(r.phM,s(t,.8,.92)); } },
  { titre:"Groenland ou Afrique ?", duree:15000,
    legende:"Sur cette carte, le Groenland paraît aussi grand que l'Afrique. En réalité, l'Afrique est environ 14 fois plus grande !",
    voix:"Regarde bien le Groenland, tout en haut, et l'Afrique. Sur cette carte, ils semblent de la même taille. Pourtant, regarde leurs vraies surfaces : l'Afrique fait environ trente millions de kilomètres carrés, le Groenland seulement deux millions. L'Afrique est quatorze fois plus grande ! Et l'Algérie, un seul pays d'Afrique, est même un peu plus grande que le Groenland.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent="Sur la carte, le Groenland paraît aussi grand que l'Afrique"; a.op(r.map,1); a.op(r.gores,0); a.op(r.mSea,1); a.op(r.mLand,1); a.op(r.hl["Groenland"],s(t,.04,.16)); a.op(r.hl["Afrique"],s(t,.16,.28)); a.op(r.hl["Algérie"],s(t,.5,.6));
      a.op(r.ml,1); a.op(r.lGro,s(t,.06,.18)); a.op(r.lAfr,s(t,.18,.3)); a.op(r.lAlg,s(t,.5,.6)); a.op(r.cmp1,s(t,.28,.38)*(1-s(t,.42,.48))); a.op(r.cmp2,s(t,.66,.76)); a.op(r.p4,s(t,.42,.56)); a.op(r.p4b,s(t,.7,.82)); } },
  { titre:"À toi : déplace le Groenland", duree:4000,
    legende:"À toi ! Fais glisser le curseur : le Groenland descend vers l'équateur. Regarde sa taille sur la carte changer, alors que sa surface réelle ne change pas.",
    voix:"À vous de jouer ! Faites glisser le curseur pour déplacer le Groenland vers l'équateur. Regardez : plus il se rapproche de l'équateur, plus il rétrécit sur la carte. Pourtant, c'est toujours le même pays, avec la même surface. Le grand chiffre indique combien de fois il est gonflé sur la carte. Prenez votre temps, puis appuyez sur Continuer.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent="À toi : déplace le Groenland vers l'équateur"; a.op(r.map,1); a.op(r.gores,0); a.op(r.mSea,1); a.op(r.mLand,1); a.op(r.hl["Afrique"],1); a.op(r.hl["Algérie"],1); a.op(r.ml,1); a.op(r.lAfr,1); a.op(r.lAlg,1); a.op(r.p5,s(t,0,.12));
      const L=touched?Lg:72*(1-e3(s(t,.2,.85))); const g=groPath(L); r.gMove.setAttribute("d",g.d); a.op(r.gMove,1); a.op(r.gGhost,L<70?1:0);
      const N=g.area/AREF; r.lMov.setAttribute("x",f1(g.cx)); r.lMov.setAttribute("y",f1(g.minY-14)); a.op(r.lMov,1);
      r.pL.textContent=Math.round(L)<1?"0° (équateur)":Math.round(L)+"° N"; r.pN.textContent="× "+frN(N,1);
      const sT=KSQ*Math.sqrt(2.187), sA=sT*Math.sqrt(N); a.set(r.sqA,{y:770-sA,width:sA,height:sA}); a.set(r.sqT,{y:770-sT,width:sT,height:sT});
      const v=document.getElementById("mL"); if(v) v.value=Math.round(L); const w=document.getElementById("mLV"); if(w) w.textContent=Math.round(L)<1?"0° (équateur)":Math.round(L)+"° N"; } },
  { titre:"Une carte qui respecte les surfaces", duree:14000,
    legende:"Sur une carte qui respecte les surfaces, on voit les vraies proportions : le Groenland est plus petit que l'Algérie, et l'Afrique est immense. Mais les formes sont déformées sur les bords.",
    voix:"Voici une autre carte, qui respecte les surfaces. Cette fois, les tailles sont justes : le Groenland est un peu plus petit que l'Algérie, et l'Afrique est immense à côté. Mais attention : les formes sont déformées près des bords. Aucune carte plate ne peut tout garder. On choisit ce que l'on veut respecter : les formes, ou les surfaces.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent="Avec une carte qui respecte les surfaces"; a.op(r.mw,s(t,0,.1)); a.op(r.wl,s(t,.1,.3)); a.op(r.wc,s(t,.35,.55)); a.op(r.wk,s(t,.6,.75)); a.op(r.wn,s(t,.78,.9)); } },
  { titre:"Synthèse", duree:12000,
    legende:"Une carte plate déforme toujours la sphère. Mercator garde les formes mais gonfle les pays près des pôles. Pour comparer des tailles, on regarde les chiffres.",
    voix:"Pour retenir : une carte plate déforme toujours la sphère. La carte de Mercator garde les formes, mais gonfle les pays proches des pôles, comme le Groenland. Pour comparer des tailles, regarde les chiffres, ou utilise une carte qui respecte les surfaces.",
    anim(t,a){ clr(a); const s=a.seg; r.hd.textContent=""; a.op(r.synth,s(t,0,.1)); r.cards.forEach((c,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(c,v); a.tr(c,0,(1-v)*40); }); a.op(r.myth,s(t,.6,.78)); a.cls(r.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
