/* META {"id":"geo-A2-lire-une-carte","matiere":"geographie","annee":"A","periode":1,"theme":"Se déplacer / se repérer dans l'espace","resume":"Du plan de la classe à la carte de la France en passant par le quartier et la ville de Dijon : à chaque niveau l'échelle, la légende et ce qu'on garde changent ; une carte n'est pas une photo mais un choix.","motsCles":["carte","plan","échelle","légende","rose des vents","orientation","Dijon"]} */
//@data france
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

const FR=FRANCE;
const S=[105,1.5,0.1,0.00072];           // pixels par mètre à chaque niveau (classe, quartier, ville, France)
const ORI0=[700,450], ORI3=[930,369];     // position de l'origine (la classe, à Dijon) à l'écran
const CC=[454.3,436.8];                    // centre de Dijon dans la projection « Côte-d'Or »
const KC=1000/5.6, KF=1000/0.617;          // mètres par pixel de données (ville, France)
const LV=[0,1,2,3];
let Zm=3;                                  // niveau de zoom choisi (manipulation)
let r={};
const fade=(z,k)=>Math.max(0,Math.min(1,(0.62-Math.abs(z-k))/0.24));
function zs(z){ z=Math.max(0,Math.min(3,z)); const k=Math.min(2,Math.floor(z)), f=z-k; const s=Math.exp(Math.log(S[k])+(Math.log(S[k+1])-Math.log(S[k]))*f); let o=ORI0; if(z>2){ const g=Anim.H.ease(z-2); o=[ORI0[0]+(ORI3[0]-ORI0[0])*g, ORI0[1]+(ORI3[1]-ORI0[1])*g]; } return {s,o}; }
function niceBar(s){ const c=[1,2,5]; let best=null; for(let e=-1;e<=7;e++) for(const m of c){ const d=m*Math.pow(10,e); if(d*s<=165&&d*s>=60){ best=d; } } return best; }
const fmtD=d=>d<1000?(d+" m").replace(".",","):(d/1000+" km");
const hash=(i,j)=>{ const x=Math.sin(i*127.1+j*311.7)*43758.5453; return x-Math.floor(x); };
const overlap=(a,b)=>!(a[2]<b[0]||a[0]>b[2]||a[3]<b[1]||a[1]>b[3]);
// ---- géométrie du quartier (en mètres, origine = la classe)
const XS=[-560,-340,-120,120,340,560], YS=[-400,-170,95,360];
const POI={ ecole:[-38,-26,38,26], cour:[-110,-160,110,85], mairie:[190,-110,270,-40], boulang:[-215,40,-175,80], parc:[-326,110,-134,350] };
const BUS=[60,95];
function houses(){ const out=[]; for(let bi=0;bi<5;bi++) for(let bj=0;bj<3;bj++){ const x0=XS[bi]+18,x1=XS[bi+1]-18,y0=YS[bj]+18,y1=YS[bj+1]-18; if(bi===1&&bj===2) continue; if(bi===2&&bj===1) continue;
  for(let x=x0;x+30<=x1;x+=38) for(let y=y0;y+26<=y1;y+=36){ const h=hash(x,y); if(h<.16) continue; const w=24+hash(y,x)*10,hh=18+hash(x+1,y+2)*9; const R=[x+3,y+3,x+3+w,y+3+hh]; if([POI.mairie,POI.boulang,POI.cour].some(p=>overlap(R,[p[0]-6,p[1]-6,p[2]+6,p[3]+6]))) continue; out.push(R); } } return out; }
const HOUSES=houses();
function drawQuartier(g,mode,E){ // E = fonctions d'élément
  const el=E; const W=1000;
  el("rect",{x:-700,y:-500,width:1400,height:1000,fill:"#F3F0E4"},g);
  if(mode!=="B"){ el("rect",{x:POI.parc[0],y:POI.parc[1],width:POI.parc[2]-POI.parc[0],height:POI.parc[3]-POI.parc[1],rx:10,fill:"#CFE8B8",stroke:"#6AA84F","stroke-width":2,"vector-effect":"non-scaling-stroke"},g); for(let i=0;i<14;i++){ el("circle",{cx:-310+hash(i,3)*160,cy:130+hash(i,9)*200,r:9,fill:"#7DB65B"},g); } }
  XS.forEach((x,i)=>{ const main=false; el("line",{x1:x,y1:-480,x2:x,y2:480,stroke:mode==="B"?"#B7B09B":"#C9C4B3","stroke-width":mode==="B"?20:16,"stroke-linecap":"butt"},g); el("line",{x1:x,y1:-480,x2:x,y2:480,stroke:"#fff","stroke-width":mode==="B"?15:12},g); });
  YS.forEach((y,j)=>{ if(j===0||j===3){ } const main=(j===2); el("line",{x1:-700,y1:y,x2:700,y2:y,stroke:main?"#D9A441":"#C9C4B3","stroke-width":main?(mode==="B"?30:24):(mode==="B"?20:16)},g); el("line",{x1:-700,y1:y,x2:700,y2:y,stroke:main?"#F7D58A":"#fff","stroke-width":main?(mode==="B"?24:18):(mode==="B"?15:12)},g); });
  if(mode!=="B") HOUSES.forEach(h=>el("rect",{x:h[0],y:h[1],width:h[2]-h[0],height:h[3]-h[1],fill:"#D8D2BF",stroke:"#A9A18A","stroke-width":1.2,"vector-effect":"non-scaling-stroke"},g));
  if(mode!=="B"){ const m=POI.mairie; el("rect",{x:m[0],y:m[1],width:m[2]-m[0],height:m[3]-m[1],fill:"#B9C9F0",stroke:"#2563A8","stroke-width":2.5,"vector-effect":"non-scaling-stroke"},g); const b=POI.boulang; el("rect",{x:b[0],y:b[1],width:b[2]-b[0],height:b[3]-b[1],fill:"#F6D365",stroke:"#B07A00","stroke-width":2.5,"vector-effect":"non-scaling-stroke"},g); }
  const e=POI.ecole; if(mode!=="B") el("rect",{x:POI.cour[0],y:POI.cour[1],width:POI.cour[2]-POI.cour[0],height:POI.cour[3]-POI.cour[1],fill:"#EDE9D6"},g);
  el("rect",{x:e[0],y:e[1],width:e[2]-e[0],height:e[3]-e[1],fill:"#F4B6A8",stroke:"#C0392B","stroke-width":3,"vector-effect":"non-scaling-stroke"},g);
  el("circle",{cx:BUS[0],cy:BUS[1],r:mode==="B"?15:10,fill:"#fff",stroke:"#1E2430","stroke-width":3,"vector-effect":"non-scaling-stroke"},g);
  if(mode==="B"){ el("line",{x1:-560,y1:95,x2:560,y2:95,stroke:"#C0392B","stroke-width":5,"stroke-dasharray":"18 12","vector-effect":"non-scaling-stroke"},g); }
}
function legendPanel(a,parent,title,items){ const E=Anim.H.el; const g=E("g",{},parent); const x=1272,y=104,w=312,h=62+items.length*50;
  E("rect",{x,y,width:w,height:h,rx:14,fill:"#fff","fill-opacity":.96,stroke:C.ink,"stroke-width":3},g); T(g,x+w/2,y+40,title,{size:28,color:C.teal,halo:false});
  items.forEach((it,i)=>{ const yy=y+62+i*50; it.draw(g,x+22,yy); T(g,x+84,yy+22,it.label,{size:23,weight:600,anchor:"start",halo:false}); }); return g; }
const sym={
  rect:(f,s)=>(g,x,y)=>Anim.H.el("rect",{x,y:y+2,width:46,height:30,rx:4,fill:f,stroke:s,"stroke-width":3},g),
  line:(c,w,d)=>(g,x,y)=>Anim.H.el("line",{x1:x,y1:y+17,x2:x+46,y2:y+17,stroke:c,"stroke-width":w,"stroke-dasharray":d||null},g),
  circ:(f,s)=>(g,x,y)=>Anim.H.el("circle",{cx:x+23,cy:y+17,r:13,fill:f,stroke:s,"stroke-width":3},g),
  door:(g,x,y)=>{ Anim.H.el("path",{d:`M${x},${y+28} L${x},${y+4} A24,24 0 0 1 ${x+24},${y+28}`,fill:"none",stroke:C.ink,"stroke-width":3},g); Anim.H.el("line",{x1:x,y1:y+28,x2:x+46,y2:y+28,stroke:C.ink,"stroke-width":3},g); }
};
function rose(parent,cx,cy,r){ const E=Anim.H.el; const g=E("g",{},parent); E("circle",{cx,cy,r:r+8,fill:"#fff","fill-opacity":.95,stroke:C.ink,"stroke-width":3},g);
  [[0,-1,C.red],[1,0,C.ink],[0,1,C.ink],[-1,0,C.ink]].forEach(([dx,dy,col])=>{ const px=-dy,py=dx; E("path",{d:`M${cx+dx*r*.95},${cy+dy*r*.95} L${cx+px*r*.2},${cy+py*r*.2} L${cx},${cy} L${cx-px*r*.2},${cy-py*r*.2} Z`,fill:col,opacity:col===C.red?1:.8},g); });
  [["N",0,-1],["E",1,0],["S",0,1],["O",-1,0]].forEach(([t,dx,dy])=>T(g,cx+dx*(r+30),cy+dy*(r+30)+9,t,{size:26,color:t==="N"?C.red:C.ink,halo:true,sw:5})); return g; }
function pill(parent,x,y,n,txt){ const g=Anim.H.el("g",{},parent); const lb=Anim.H.label(g,0,0,n+".  "+txt,{size:26,stroke:C.or,color:"#7A3E00",fill:"#FFF6EA"}); g.setAttribute("transform",`translate(${x},${y})`); return g; }

Anim.run({
  titre:"Lire une carte : du plan de la classe à la France",
  sousTitre:"Géographie · CM1-CM2 · Se repérer dans l'espace",
  matiere:"geographie", badge:"Géographie",
  accroche:"Comment passe-t-on du plan de la classe à la carte de la France ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a;
    const defs=el("defs",{},a.svg);
    const cm=el("clipPath",{id:"zclip"},defs); el("rect",{x:0,y:0,width:1600,height:900,rx:14},cm);
    const world=a.layer("world"); world.setAttribute("clip-path","url(#zclip)"); r.world=world;
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#F3F0E4"},world);
    // L4 : mer
    r.sea=el("rect",{x:0,y:0,width:1600,height:900,fill:C.sea},world);
    r.g4=el("g",{},world); r.g3=el("g",{},world); r.g2=el("g",{},world); r.g1=el("g",{},world);
    // ---- L4 France
    const g4=el("g",{transform:`scale(${KF}) translate(${-FR.dijonF[0]},${-FR.dijonF[1]})`},r.g4); r.g4in=g4;
    FR.regions.forEach(rg=>{ const bfc=rg.code==="27"; el("path",{d:rg.d,fill:bfc?"#F7D9A8":"#EEF3E8",stroke:"#6E7F6E","stroke-width":1.4,"vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},g4); });
    // ---- L3 ville
    const g3=el("g",{transform:`scale(${KC}) translate(${-CC[0]},${-CC[1]})`},r.g3); r.g3in=g3;
    const near=FR.communes.filter(c=>Math.hypot(c.c[0]-CC[0],c.c[1]-CC[1])<70);
    near.forEach(c=>el("path",{d:c.d,fill:c.nom==="Dijon"?"#F7D9A8":"#EEE9D8",stroke:"#8E8A78","stroke-width":1.5,"vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},g3));
    el("ellipse",{cx:435.4,cy:436.9,rx:4.2,ry:.9,fill:"#9CCBE8",stroke:"#2F7FB5","stroke-width":1.5,"vector-effect":"non-scaling-stroke"},g3);
    // ---- L2 quartier (mètres)
    const g2=el("g",{},r.g2); r.g2in=g2; drawQuartier(g2,"A",el);
    // ---- L1 classe (px à 100 px/m)
    const g1=el("g",{},r.g1); r.g1in=g1;
    el("rect",{x:-1500,y:-1100,width:3000,height:2200,fill:"#F3F0E4"},g1);
    r.floor=el("rect",{x:-400,y:-300,width:800,height:600,fill:"#FFF8E7"},g1);
    r.walls=el("rect",{x:-400,y:-300,width:800,height:600,fill:"none",stroke:"#1E2430","stroke-width":24,"stroke-linejoin":"miter"},g1);
    r.win=[-250,0,250].map(x=>{ const g=el("g",{},g1); el("rect",{x:x-60,y:-312,width:120,height:24,fill:"#BFE3F7",stroke:"#2F7FB5","stroke-width":4},g); return g; });
    r.door=el("g",{},g1); el("rect",{x:-360,y:288,width:100,height:24,fill:"#FFF8E7"},r.door); el("path",{d:"M-360,300 L-360,200 A100,100 0 0 1 -260,300",fill:"rgba(224,122,31,.12)",stroke:C.ink,"stroke-width":4},r.door);
    r.board=el("g",{},g1); el("rect",{x:-388,y:-150,width:24,height:300,fill:"#2E6B4F",stroke:"#14352A","stroke-width":3},r.board);
    r.desk=el("g",{},g1); el("rect",{x:-330,y:-80,width:80,height:160,rx:4,fill:"#B87A3D",stroke:"#6E4520","stroke-width":4},r.desk);
    r.tables=[]; for(let i=0;i<3;i++) for(let j=0;j<4;j++){ const g=el("g",{},g1); el("rect",{x:-110+i*200-60,y:-190+j*120-30,width:120,height:60,rx:5,fill:"#E3C08F",stroke:"#8B5E34","stroke-width":4},g); r.tables.push(g); }
    // ---- cadres de zoom (écran)
    const ov=a.layer("ov"); r.ov=ov;
    r.fr=[0,1,2].map(()=>el("rect",{fill:"none",stroke:C.red,"stroke-width":4,"stroke-dasharray":"10 6",rx:2},ov));
    r.mk=el("g",{},ov); r.mkC=el("circle",{r:9,fill:C.red,stroke:"#fff","stroke-width":3},r.mk);
    r.mkT=[["ma classe",0],["mon quartier",1]].map(([t])=>T(ov,0,0,t,{size:26,color:C.red,anchor:"start"}));
    // étiquettes de communes (ville)
    const comm=["Dijon","Fontaine-lès-Dijon","Talant","Longvic","Chenôve","Saint-Apollinaire","Marsannay-la-Côte"];
    r.cl=comm.map(n=>{ const c=near.find(x=>x.nom===n); return {n,c:c?c.c:null,t:T(ov,0,0,n,{size:22,color:"#3B3A31",weight:700})}; });
    r.gareT=T(ov,0,0,"gare",{size:22,color:"#1E2430",weight:800,anchor:"end"}); r.lacT=T(ov,0,0,"lac Kir",{size:22,color:"#1F5F8F",weight:800}); r.gareD=dot(ov,0,0,7,C.ink); r.cenD=dot(ov,0,0,8,C.or);
    r.cenT=T(ov,0,0,"centre-ville",{size:22,color:"#B35A00",weight:800,anchor:"start"});
    // villes France
    const FC={Paris:[337.8,176.1,"start",14,-8],Lille:[369.7,55,"start",14,-8],Strasbourg:[581.9,188.9,"start",14,8],Lyon:[454.4,387.2,"start",14,10],Marseille:[485.2,554.7,"start",14,8],Bordeaux:[193.5,447.1,"end",-14,8],Toulouse:[289.7,535.2,"end",-14,8],Nantes:[155.9,282.3,"end",-14,8],Dijon:[461.6,280.3,"start",14,-12]};
    r.fc=Object.keys(FC).map(n=>{ const q=FC[n]; const g=el("g",{},ov); const d=el("circle",{r:n==="Dijon"?8:6,fill:n==="Dijon"?C.or:C.ink,stroke:"#fff","stroke-width":2.5},g); const t=T(g,q[3],q[4]+4,n,{size:22,color:n==="Dijon"?"#B35A00":C.ink,anchor:q[2],weight:800}); return {n,q,g}; });
    r.bfcT=T(ov,0,0,"Bourgogne-\nFranche-\nComté",{size:22,color:"#8A5A00",weight:800,lh:1.1});
    // titres
    const ti=a.layer("titres"); r.ti=["Plan de la classe","Plan du quartier","Carte de la ville : Dijon","Carte de la France"].map(t=>{ const g=el("g",{},ti); el("rect",{x:20,y:16,width:Math.max(380,t.length*21+50),height:66,rx:12,fill:"#fff","fill-opacity":.97,stroke:C.ink,"stroke-width":3},g); T(g,40,60,t,{size:34,color:C.ink,anchor:"start",halo:false}); return g; });
    // légendes
    const lg=a.layer("legendes"); r.lg=[
      legendPanel(a,lg,"Légende",[{draw:sym.rect("#E3C08F","#8B5E34"),label:"table"},{draw:sym.rect("#B87A3D","#6E4520"),label:"bureau"},{draw:sym.rect("#2E6B4F","#14352A"),label:"tableau"},{draw:sym.rect("#BFE3F7","#2F7FB5"),label:"fenêtre"},{draw:sym.door,label:"porte"}]),
      legendPanel(a,lg,"Légende",[{draw:sym.rect("#F4B6A8","#C0392B"),label:"école"},{draw:sym.rect("#B9C9F0","#2563A8"),label:"mairie"},{draw:sym.rect("#F6D365","#B07A00"),label:"boulangerie"},{draw:sym.rect("#CFE8B8","#6AA84F"),label:"parc"},{draw:sym.circ("#fff","#1E2430"),label:"arrêt de bus"},{draw:sym.rect("#D8D2BF","#A9A18A"),label:"maisons"}]),
      legendPanel(a,lg,"Légende",[{draw:sym.rect("#F7D9A8","#8E8A78"),label:"commune de Dijon"},{draw:sym.rect("#EEE9D8","#8E8A78"),label:"autres communes"},{draw:sym.line("#8E8A78",3),label:"limite de commune"},{draw:sym.rect("#9CCBE8","#2F7FB5"),label:"lac"},{draw:sym.circ("#E07A1F","#fff"),label:"centre-ville"}]),
      legendPanel(a,lg,"Légende",[{draw:sym.rect("#F7D9A8","#6E7F6E"),label:"notre région"},{draw:sym.rect("#EEF3E8","#6E7F6E"),label:"autres régions"},{draw:sym.line("#6E7F6E",3),label:"limite de région"},{draw:sym.circ("#1E2430","#fff"),label:"grande ville"},{draw:sym.circ("#E07A1F","#fff"),label:"Dijon"}])];
    // échelle
    const sb=a.layer("echelle"); r.sb=sb; el("rect",{x:24,y:772,width:560,height:112,rx:12,fill:"#fff","fill-opacity":.96,stroke:C.ink,"stroke-width":3},sb);
    T(sb,40,806,"Échelle : 1 cm sur la carte",{size:24,color:C.ink,anchor:"start",halo:false});
    r.barA=el("rect",{x:40,y:822,width:100,height:16,fill:"#fff",stroke:C.ink,"stroke-width":3},sb); r.barB=el("rect",{x:40,y:822,width:50,height:16,fill:C.ink},sb); r.barC=el("rect",{x:90,y:822,width:50,height:16,fill:"#fff",stroke:C.ink,"stroke-width":3},sb);
    r.barT=T(sb,40,872,"",{size:26,color:C.or,anchor:"start",weight:800,halo:false});
    r.barX=T(sb,0,872,"",{size:1});
    // rose des vents
    r.rose=rose(a.layer("rose"),1480,788,64);
    // pastilles du pas 1
    const pl=a.layer("pills"); r.pills=[pill(pl,640,50,1,"Le titre"),pill(pl,1428,452,2,"La légende"),pill(pl,700,826,3,"L'échelle"),pill(pl,1400,648,4,"Rose des vents")];
    // ---- pas 6 : deux cartes du même quartier
    const ch=a.layer("choix"); r.ch=ch; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},ch);
    [["A",40,"Carte A : les bâtiments et les services"],["B",820,"Carte B : les rues et le bus"]].forEach(([m,x,tt])=>{ const cp=el("clipPath",{id:"cc"+m},defs); el("rect",{x,y:130,width:740,height:440,rx:10},cp); const pg=el("g",{"clip-path":`url(#cc${m})`},ch); const inn=el("g",{transform:`translate(${x+370},${350}) scale(1.1)`},pg); drawQuartier(inn,m,el); el("rect",{x,y:130,width:740,height:440,rx:10,fill:"none",stroke:C.ink,"stroke-width":4},ch); T(ch,x+370,108,tt,{size:30,color:C.teal,halo:false}); });
    T(ch,410,604,"école · mairie · boulangerie · parc · maisons",{size:22,color:C.ink2,halo:false}); T(ch,1190,604,"école · arrêt de bus · ligne de bus (exemple)",{size:22,color:C.ink2,halo:false});
    r.chT=T(ch,800,680,"Même quartier, deux cartes :\non garde seulement ce qui sert.",{size:30,color:C.ink,halo:false,lh:1.25});
    r.chT2=T(ch,800,780,"Une carte est un choix de celui qui la dessine :\nce qu'on garde, les symboles, l'échelle.",{size:26,weight:600,color:C.ink2,halo:false,lh:1.3});
    const lp=a.layer("photos"); r.ph1=a.photo(lp,{id:"g-a2-plan-dijon-ancien",x:60,y:640,w:230,h:150,cap:"Un plan ancien de Dijon",rot:-2,size:22}); r.ph2=a.photo(lp,{id:"g-a2-cassini",x:1300,y:640,w:230,h:150,cap:"Une carte de Cassini",rot:2,size:22});
    // ---- synthèse
    const sy=a.layer("synth"); r.synth=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    T(sy,800,76,"Pour lire une carte, je regarde…",{size:38,color:C.teal,halo:false});
    r.cards=[["Le titre","De quoi parle la carte ?",(g,x,y)=>{ el("rect",{x:x-90,y:y-22,width:180,height:44,rx:8,fill:"#fff",stroke:C.ink,"stroke-width":3},g); T(g,x,y+9,"Plan de…",{size:26,halo:false}); }],
      ["La légende","Que veulent dire les signes ?",(g,x,y)=>{ el("rect",{x:x-70,y:y-26,width:44,height:30,rx:4,fill:"#F4B6A8",stroke:"#C0392B","stroke-width":3},g); el("rect",{x:x-70,y:y+14,width:44,height:20,rx:4,fill:"#CFE8B8",stroke:"#6AA84F","stroke-width":3},g); T(g,x-16,y-2,"école",{size:23,anchor:"start",halo:false}); T(g,x-16,y+32,"parc",{size:23,anchor:"start",halo:false}); }],
      ["L'échelle","Combien mesure la réalité ?",(g,x,y)=>{ el("rect",{x:x-60,y:y-8,width:60,height:16,fill:C.ink},g); el("rect",{x,y:y-8,width:60,height:16,fill:"#fff",stroke:C.ink,"stroke-width":3},g); T(g,x,y+38,"1 cm = 100 m",{size:24,weight:700,halo:false}); }],
      ["L'orientation","Où est le nord ?",(g,x,y)=>{ el("path",{d:`M${x},${y-46} L${x+13},${y} L${x},${y+10} L${x-13},${y} Z`,fill:C.red},g); el("path",{d:`M${x},${y+46} L${x+13},${y} L${x},${y-10} L${x-13},${y} Z`,fill:C.ink,opacity:.8},g); T(g,x,y-56,"N",{size:26,color:C.red,halo:false}); }]].map((c,i)=>{ const g=el("g",{},sy); const x=215+i*390; el("rect",{x:x-180,y:120,width:360,height:270,rx:16,fill:"#F1F7F5",stroke:C.teal,"stroke-width":4},g); T(g,x,176,c[0],{size:34,color:C.teal,halo:false}); c[2](g,x,262); T(g,x,356,c[1],{size:23,weight:600,halo:false}); return g; });
    r.myth=a.layer("myth"); a.myth(r.myth,200,450,1200,"Une carte est une photo de la réalité.","Une carte est un dessin qui fait des choix : ce qu'on garde, les symboles, l'échelle. Deux cartes du même endroit peuvent être très différentes.");
    // ---- manipulation
    a.manip.innerHTML=`Zoom : <input type="range" id="mZ" min="0" max="300" step="1" value="300" style="width:420px"> <b id="mZv" style="min-width:300px;text-align:left">Carte de la France</b>`;
    document.getElementById("mZ").oninput=e=>{ Zm=+e.target.value/100; a.redraw(); };
  },
  reset(a){
    [r.world,r.ov,r.sb,r.rose,r.ch,r.synth,r.myth,r.ph1,r.ph2,...r.pills,...r.cards,...r.ti,...r.lg,...r.fr,r.mk,...r.mkT,r.gareT,r.lacT,r.gareD,r.cenD,r.cenT,r.bfcT,r.bfcT].forEach(e=>a.op(e,0));
    r.cl.forEach(o=>a.op(o.t,0)); r.fc.forEach(o=>a.op(o.g,0));
    r.win.forEach(e=>a.op(e,1)); r.tables.forEach(e=>a.op(e,1)); [r.door,r.board,r.desk,r.walls,r.floor].forEach(e=>{a.op(e,1);}); a.draw(r.walls,1); 
  },
  etapes:[
  { titre:"Le plan de la classe", duree:14000,
    legende:"Voici le plan de ma classe, vue d'en haut. Il a toujours : un titre, une légende, une échelle et une rose des vents qui montre le nord.",
    voix:"Voici le plan de ma classe, dessiné comme si on la regardait d'en haut. Une carte ou un plan a toujours quatre choses. Un titre, pour dire de quoi on parle. Une légende, pour expliquer les signes : une table, un bureau, un tableau. Une échelle, pour savoir combien mesure la réalité. Et une rose des vents, qui montre où est le nord, en haut de la carte.",
    anim(t,a){ const s=a.seg; a.op(r.world,s(t,0,.06)); setZ(a,0); a.op(r.ti[0],1);
      a.draw(r.walls,s(t,.02,.2)); a.op(r.floor,s(t,0,.1)); r.win.forEach((w,i)=>a.op(w,s(t,.2+i*.02,.26+i*.02))); a.op(r.door,s(t,.26,.32)); a.op(r.board,s(t,.28,.34)); a.op(r.desk,s(t,.3,.36)); r.tables.forEach((g,i)=>a.op(g,s(t,.34+i*.012,.4+i*.012)));
      a.op(r.lg[0],s(t,.48,.56)); a.op(r.sb,s(t,.62,.7)); a.op(r.rose,s(t,.74,.82));
      a.op(r.pills[0],s(t,.12,.2)*(1-s(t,.9,.98)*0)); a.op(r.pills[1],s(t,.5,.58)); a.op(r.pills[2],s(t,.64,.72)); a.op(r.pills[3],s(t,.76,.84)); } },
  { titre:"Du plan de la classe au plan du quartier", duree:11000,
    legende:"Je dézoome : la classe devient un petit rectangle dans l'école. À cette échelle, 1 cm représente 100 m, on ne voit plus les tables mais les rues et les bâtiments.",
    voix:"Maintenant, je prends du recul. La classe devient un petit rectangle dans le bâtiment de l'école. Regarde la barre d'échelle : elle représente de plus en plus de mètres. Sur ce plan du quartier, un centimètre représente cent mètres. On ne voit plus les tables, mais on voit les rues, les maisons, la mairie, le parc. La légende a changé aussi.",
    anim(t,a){ const s=a.seg; a.op(r.world,1); a.op(r.pills[0],1-s(t,0,.1)); a.op(r.pills[1],1-s(t,0,.1)); a.op(r.pills[2],1-s(t,0,.1)); a.op(r.pills[3],1-s(t,0,.1)); setZ(a,s(t,.1,.85)); } },
  { titre:"…à la carte de la ville", duree:11000,
    legende:"Encore plus loin : le quartier devient un petit rectangle sur la carte de Dijon. Ici, 1 cm représente 1 km. On ne garde que les communes, la gare, le lac.",
    voix:"Je dézoome encore. Le quartier devient un tout petit rectangle sur la carte de la ville de Dijon. Un centimètre représente maintenant un kilomètre. Les maisons ont disparu : on ne garde que les limites des communes, la gare, le lac Kir. La carte garde moins de détails, parce qu'on a besoin de voir un territoire plus grand.",
    anim(t,a){ const s=a.seg; a.op(r.world,1); setZ(a,1+s(t,.1,.85)); } },
  { titre:"…à la carte de la France", duree:12000,
    legende:"Dernier dézoome : Dijon n'est plus qu'un point sur la carte de la France. Ici, 1 cm représente environ 200 km. On ne garde que les régions et les grandes villes.",
    voix:"Dernier recul : toute la France. Dijon n'est plus qu'un petit point. Un centimètre représente maintenant environ deux cents kilomètres. On ne garde que les régions, les limites et les grandes villes : Paris, Lyon, Marseille. En quatre cartes, l'échelle a changé, la légende a changé, le titre a changé. Seul le nord est resté en haut.",
    anim(t,a){ const s=a.seg; a.op(r.world,1); setZ(a,2+s(t,.1,.85)); } },
  { titre:"À toi : zoome et dézoome", duree:4000,
    legende:"À toi ! Déplace le curseur pour zoomer et dézoomer : regarde la barre d'échelle, la légende et le titre qui changent.",
    voix:"À toi de jouer ! Avec le curseur, zoome et dézoome. Observe la barre d'échelle : quand on voit un grand territoire, elle représente beaucoup de kilomètres. Quand on voit un petit lieu, elle représente seulement quelques mètres. Regarde aussi la légende et le titre qui changent à chaque niveau.",
    anim(t,a){ a.op(r.world,1); setZ(a,Zm); const lab=Zm<.5?"Plan de la classe":Zm<1.5?"Plan du quartier":Zm<2.5?"Carte de la ville":"Carte de la France"; const v=document.getElementById("mZv"); if(v) v.textContent=lab; const e=document.getElementById("mZ"); if(e&&+e.value!==Math.round(Zm*100)) e.value=Math.round(Zm*100); } },
  { titre:"Une carte, c'est un choix", duree:12000,
    legende:"Voici le même quartier sur deux cartes : chacune garde ce qui sert à son usage. Une carte n'est pas une photo : celui qui la dessine choisit.",
    voix:"Voici le même quartier sur deux cartes différentes. La première garde les bâtiments et les services. La seconde garde les rues et le bus. Ce n'est pas une photo de la réalité : celui qui dessine la carte choisit ce qu'il garde, quels symboles il utilise et quelle échelle il prend. Les cartes anciennes, elles aussi, faisaient d'autres choix.",
    anim(t,a){ const s=a.seg; a.op(r.world,1-s(t,0,.1)); a.op(r.ov,0); a.op(r.sb,0); a.op(r.rose,1-s(t,0,.1)); r.ti.forEach(e=>a.op(e,0)); r.lg.forEach(e=>a.op(e,0)); a.op(r.ch,s(t,0,.12)); a.op(r.chT,s(t,.5,.62)); a.op(r.chT2,s(t,.6,.72)); a.op(r.ph1,s(t,.7,.85)); a.op(r.ph2,s(t,.78,.92)); } },
  { titre:"Synthèse", duree:11000,
    legende:"Pour lire une carte : le titre, la légende, l'échelle, l'orientation. Et je me souviens qu'une carte fait des choix.",
    voix:"Pour retenir : quand je lis une carte, je regarde d'abord le titre, puis la légende, puis l'échelle, puis l'orientation avec la rose des vents. Et je n'oublie pas qu'une carte n'est pas une photographie : c'est un dessin qui fait des choix.",
    anim(t,a){ const s=a.seg; a.op(r.ch,1-s(t,0,.1)); a.op(r.ph1,0); a.op(r.ph2,0); a.op(r.synth,s(t,0,.1)); r.cards.forEach((c,i)=>{ const v=s(t,.1+i*.1,.22+i*.1); a.op(c,v); a.tr(c,0,(1-v)*40); }); a.op(r.myth,s(t,.6,.78)); a.cls(r.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
function setZ(a,z){
  const {s,o}=zs(z);
  [[r.g1,r.g1in,s/105,0],[r.g2,r.g2in,s,1],[r.g3,r.g3in,s,2],[r.g4,r.g4in,s,3]].forEach(([g,gi,sc,k])=>{ g.setAttribute("transform",`translate(${o[0]},${o[1]}) scale(${sc})`); a.op(g,fade(z,k)); a.op(r.ti[k],fade(z,k)); a.op(r.lg[k],fade(z,k)); });
  a.op(r.sea,Math.max(0,Math.min(1,(z-1.8)/.8))); r.g3.setAttribute("opacity",Math.max(fade(z,2),0)); 
  a.op(r.ov,1); a.op(r.sb,1); a.op(r.rose,1);
  // ville : le fond de L3 est transparent hors des communes -> fond beige sous la ville
  // cadres de zoom (région montrée au niveau précédent)
  const fr=[[8,6,z,.35,.2,1.8,.2],[1067,600,z,1.4,.2,2.8,.2],[16000,9000,z,2.4,.2,3.3,.2]];
  r.fr.forEach((e,i)=>{ const [w,h]=fr[i]; const wpx=w*s, hpx=h*s; const op=Math.max(0,Math.min(1,(z-fr[i][3])/fr[i][4]))*Math.max(0,Math.min(1,(fr[i][5]-z)/fr[i][6])); const big=wpx>1500; a.set(e,{x:o[0]-wpx/2,y:o[1]-hpx/2,width:Math.max(4,wpx),height:Math.max(4,hpx)}); a.op(e,big?0:op); });
  const mop=Math.max(0,Math.min(1,(z-.35)/.2)); a.op(r.mk,mop); r.mk.setAttribute("transform",`translate(${o[0]},${o[1]})`);
  r.mkT.forEach((t,i)=>{ t.setAttribute("x",o[0]+22); t.setAttribute("y",o[1]+(i===2?-14:(i===1?44:34))); const op=i===0?Math.min(1,Math.max(0,(z-.5)/.2))*Math.min(1,Math.max(0,(1.4-z)/.2)):i===1?Math.min(1,Math.max(0,(z-1.5)/.2))*Math.min(1,Math.max(0,(2.4-z)/.2)):Math.min(1,Math.max(0,(z-2.5)/.2)); a.op(t,op); });
  // étiquettes villes (L3)
  const f3=fade(z,2), kC=s*KC;
  r.cl.forEach(c=>{ if(!c.c){ a.op(c.t,0); return; } const dx=(c.c[0]-CC[0])*kC, dy=(c.c[1]-CC[1])*kC; const x=o[0]+dx, y=o[1]+dy+(c.n==="Dijon"?-90:0); c.t.setAttribute("x",x); c.t.setAttribute("y",y+6); c.t.setAttribute("text-anchor","middle"); a.op(c.t,(x>120&&x<1180&&y>110&&y<740)?f3:0); if(c.n==="Dijon") c.t.setAttribute("font-size",30); });
  { const pg=[449,434.9], pl=[435.4,436.9]; const gx=o[0]+(pg[0]-CC[0])*kC, gy=o[1]+(pg[1]-CC[1])*kC; r.gareD.setAttribute("cx",gx); r.gareD.setAttribute("cy",gy); r.gareT.setAttribute("x",gx-12); r.gareT.setAttribute("y",gy-14); a.op(r.gareD,f3); a.op(r.gareT,f3);
    const lx=o[0]+(pl[0]-CC[0])*kC, ly=o[1]+(pl[1]-CC[1])*kC; r.lacT.setAttribute("x",lx); r.lacT.setAttribute("text-anchor","middle"); r.lacT.setAttribute("y",ly+34); a.op(r.lacT,f3);
    r.cenD.setAttribute("cx",o[0]); r.cenD.setAttribute("cy",o[1]); a.op(r.cenD,f3); r.cenT.setAttribute("x",o[0]+16); r.cenT.setAttribute("y",o[1]-14); a.op(r.cenT,f3); }
  // villes France (L4)
  const f4=fade(z,3), kF=s*KF;
  r.fc.forEach(c=>{ const x=o[0]+(c.q[0]-FR.dijonF[0])*kF, y=o[1]+(c.q[1]-FR.dijonF[1])*kF; c.g.setAttribute("transform",`translate(${x},${y})`); a.op(c.g,f4); });
  { const x=o[0]+(468-FR.dijonF[0])*kF, y=o[1]+(305-FR.dijonF[1])*kF; r.bfcT.setAttribute("x",x); r.bfcT.setAttribute("y",y); r.bfcT.querySelectorAll("tspan").forEach(ts=>ts.setAttribute("x",x)); a.op(r.bfcT,f4); }
  // barre d'échelle
  const d=niceBar(s)||1; const px=d*s; a.set(r.barA,{width:px}); a.set(r.barB,{width:px/2}); a.set(r.barC,{x:40+px/2,width:px/2}); r.barT.textContent="= "+fmtD(d)+" dans la réalité";
}
})();
