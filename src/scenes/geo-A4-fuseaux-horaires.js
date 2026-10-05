/* META {"id":"geo-A4-fuseaux-horaires","matiere":"geographie","annee":"connexe","periode":1,"theme":"Se déplacer / se repérer dans l'espace","resume":"La Terre tourne sous le Soleil : quand il est midi à Dijon, il fait nuit à Tokyo ; la planète est découpée en 24 fuseaux horaires de 15° et l'heure avance d'une heure vers l'est.","motsCles":["fuseaux horaires","rotation de la Terre","jour et nuit","décalage horaire","Greenwich","heure d'hiver"]} */
//@data n4land
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

const LAND=decode(N4LAND.land);
const MAPR={x:60,y:200,w:1180,h:590};
const mx=lon=>MAPR.x+(lon+180)/360*MAPR.w, my=lat=>MAPR.y+(90-lat)/180*MAPR.h;
/* villes : décalage légal avec Greenwich en hiver (heure d'hiver en France) */
const CITIES=[{n:"Dijon",lon:5.04,lat:47.32,off:1,col:C.or,pos:[0,-24,"middle"]},{n:"New York",lon:-74.0,lat:40.71,off:-5,col:C.blue,pos:[-16,8,"end"]},{n:"Tokyo",lon:139.69,lat:35.68,off:9,col:C.red,pos:[0,-24,"middle"]},{n:"Sydney",lon:151.2,lat:-33.87,off:11,col:C.green,pos:[-16,8,"end"]}];
let ut=11; // heure de Greenwich (instant montré)
let dh=12; // heure choisie à Dijon (manipulation)
const wrap180=v=>((v%360)+540)%360-180;
const subLon=u=>wrap180(-15*(u-12));
const isDay=(c,u)=>{ const st=((u+c.lon/15)%24+24)%24; return st>=6&&st<18; };
const P1={cx:640,cy:480,R:290};
let r={};
function polarPath(rs,R,cx,cy){ let d=""; for(const q of rs){ let mxl=-90; for(let i=0;i<q.n;i++) if(q.lat[i]>mxl) mxl=q.lat[i]; if(mxl<=0) continue; let first=true;
  const add=(lo,la)=>{ const rr=R*(90-Math.max(0,la))/90, an=lo*D2R; d+=(first?"M":"L")+f1(cx+rr*Math.cos(an))+" "+f1(cy-rr*Math.sin(an)); first=false; };
  for(let i=0;i<q.n;i++){ const j=(i+1)%q.n; add(q.lon[i],q.lat[i]); if((q.lat[i]>=0)!==(q.lat[j]>=0)){ const f=q.lat[i]/(q.lat[i]-q.lat[j]); add(q.lon[i]+f*(q.lon[j]-q.lon[i]),0); } } d+="Z"; } return d; }
function card(parent,c,x,y){ const g=Anim.H.el("g",{},parent); const E=Anim.H.el;
  E("rect",{x,y,width:262,height:142,rx:14,fill:"#fff",stroke:c.col,"stroke-width":4},g);
  T(g,x+16,y+38,c.n,{size:28,color:c.col,anchor:"start",halo:false});
  g.time=T(g,x+16,y+90,"",{size:44,color:C.ink,anchor:"start",halo:false}); g.sub=T(g,x+16,y+124,"",{size:22,weight:600,color:C.ink2,anchor:"start",halo:false});
  g.ic=E("g",{},g); return g; }
function cardSet(g,c,u,x,y,subTxt){ const loc=u+c.off; g.time.textContent=fmtT(loc); g.sub.textContent=subTxt||""; while(g.ic.firstChild) g.ic.removeChild(g.ic.firstChild);
  const day=isDay(c,u); const bg=Anim.H.el("circle",{cx:x+216,cy:y+52,r:34,fill:day?"#FFF3C4":"#E4E8F5"},g.ic); if(day) sunIcon(g.ic,x+216,y+52,17); else moonIcon(g.ic,x+214,y+52,16); }
function nightRects(u){ const s=wrap180(subLon(u)+90); const w=MAPR.w/2; const x0=mx(s); const out=[]; if(s+180<=180) out.push([x0,w]); else { out.push([x0,mx(180)-x0]); out.push([MAPR.x,mx(s+180-360)-MAPR.x]); } return out; }
function drawMap(a,u,o){ // met à jour le voile de nuit, le soleil et les épingles
  const nr=nightRects(u); r.night.forEach((e,i)=>{ if(nr[i]){ a.set(e,{x:nr[i][0],width:nr[i][1]}); e.style.display=""; } else e.style.display="none"; });
  const sx=mx(subLon(u)); r.sun.setAttribute("transform",`translate(${sx},${MAPR.y-38})`); a.op(r.sun,o.sun===undefined?1:o.sun);
  r.pins.forEach((p,i)=>a.op(p,o.pins===undefined?1:(Array.isArray(o.pins)?o.pins[i]:o.pins)));
}
Anim.run({
  titre:"Pourquoi n'y a-t-il pas la même heure partout ?",
  sousTitre:"Géographie · CM1-CM2 · Les fuseaux horaires",
  matiere:"geographie", badge:"Géographie",
  accroche:"Midi à Dijon : quelle heure est-il à Tokyo ?",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a;
    const defs=el("defs",{},a.svg); const cm=el("clipPath",{id:"fclip"},defs); el("rect",{x:MAPR.x,y:MAPR.y,width:MAPR.w,height:MAPR.h},cm);
    r.hd=T(a.layer("hd"),800,64,"",{size:38,color:C.teal,halo:false});
    // ----- vue du pôle Nord
    const pv=a.layer("pole"); r.pole=pv; const {cx,cy,R}=P1;
    el("circle",{cx,cy,r:R+10,fill:"#E8F1F7"},pv); el("circle",{cx,cy,r:R,fill:C.sea,stroke:"#5D7C94","stroke-width":4},pv);
    const rot=el("g",{},pv); r.rot=rot;
    const clipP=el("clipPath",{id:"pclip"},defs); el("circle",{cx,cy,r:R},clipP); const inner=el("g",{"clip-path":"url(#pclip)"},rot);
    el("path",{d:polarPath(LAND,R,cx,cy),fill:C.land,stroke:C.landS,"stroke-width":1.2,"fill-rule":"evenodd"},inner);
    for(let k=0;k<24;k++){ const an=k*15*D2R; el("line",{x1:cx,y1:cy,x2:cx+R*Math.cos(an),y2:cy-R*Math.sin(an),stroke:k===0?C.blue:"#6C8CA3","stroke-width":k===0?5:1.4},inner); }
    [30,60].forEach(la=>el("circle",{cx,cy,r:R*(90-la)/90,fill:"none",stroke:"#6C8CA3","stroke-width":1.4},inner));
    r.pc=CITIES.slice(0,3).map(c=>{ const rr=R*(90-c.lat)/90, an=c.lon*D2R; return dot(rot,cx+rr*Math.cos(an),cy-rr*Math.sin(an),11,c.col); });
    // nuit (moitié gauche) + terminateur
    r.nightP=el("path",{d:`M${cx},${cy-R} A${R},${R} 0 0 0 ${cx},${cy+R} Z`,fill:C.night,"fill-opacity":.42},pv);
    el("line",{x1:cx,y1:cy-R-14,x2:cx,y2:cy+R+14,stroke:"#1B2A52","stroke-width":3,"stroke-dasharray":"8 8"},pv);
    el("circle",{cx,cy,r:R,fill:"none",stroke:"#5D7C94","stroke-width":4},pv);
    el("circle",{cx,cy,r:6,fill:C.ink},pv); T(pv,cx,cy+R+52,"Vue d'au-dessus du pôle Nord · trait bleu : méridien de Greenwich",{size:22,color:C.ink2,halo:false});
    r.pl=CITIES.slice(0,3).map(c=>T(pv,0,0,c.n,{size:24,color:c.col}));
    r.gwL=T(pv,cx,cy,"",{size:22,color:C.blue});
    // soleil + rayons
    r.sunP=el("g",{},pv); sunIcon(r.sunP,1330,300,58); for(let k=-3;k<=3;k++){ const yy=300+k*70; A(r.sunP,`M${1200},${yy} L${P1.cx+R+50},${yy}`,"#E5A800",5,3.5); }
    T(r.sunP,1330,420,"Le Soleil",{size:26,color:"#8A6500"}); T(pv,1100,120,"Lumière du Soleil",{size:22,color:"#8A6500"});
    T(pv,cx-130,cy-R-26,"NUIT",{size:30,color:C.night,halo:false}); T(pv,cx+130,cy-R-26,"JOUR",{size:30,color:"#B07A00",halo:false});
    // flèche de rotation (sens inverse des aiguilles d'une montre, vu du dessus)
    { const Rr=R+46, a0=145*D2R, a1=215*D2R; const p0=[cx+Rr*Math.cos(a0),cy-Rr*Math.sin(a0)], p1=[cx+Rr*Math.cos(a1),cy-Rr*Math.sin(a1)]; r.rotA=A(pv,`M${p0[0]},${p0[1]} A${Rr},${Rr} 0 0 0 ${p1[0]},${p1[1]}`,C.or,7,4); }
    T(pv,cx-R-62,cy,"La Terre tourne\nvers l'est",{size:24,color:C.or,anchor:"end",lh:1.2});
    r.dcard=card(pv,CITIES[0],40,130); r.dcard.remove(); pv.appendChild(r.dcard);
    // ----- carte plane
    const mp=a.layer("map"); r.map=mp;
    el("rect",{x:MAPR.x,y:MAPR.y,width:MAPR.w,height:MAPR.h,fill:C.sea},mp);
    const cg=el("g",{"clip-path":"url(#fclip)"},mp);
    el("path",{d:flatPath(LAND,(lo,la)=>[mx(lo),my(la)]),fill:C.land,stroke:C.landS,"stroke-width":1,"fill-rule":"evenodd"},cg);
    // fuseaux
    r.bands=el("g",{"clip-path":"url(#fclip)"},mp); r.bandR=[];r.bandL=[];
    for(let k=-12;k<=12;k++){ const x0=mx(15*k-7.5), w=MAPR.w/24; const g=el("g",{},r.bands); el("rect",{x:x0,y:MAPR.y,width:w,height:MAPR.h,fill:k%2?"rgba(37,99,168,.16)":"rgba(255,255,255,.18)",stroke:"#41627C","stroke-width":1.5},g); r.bandR.push(g); }
    r.bandLab=el("g",{},mp); for(let k=-12;k<=12;k++){ const x=mx(15*k); if(x<MAPR.x+16||x>MAPR.x+MAPR.w-16) continue; const t=T(r.bandLab,x,MAPR.y-12,(k>0?"+"+k:k<0?"−"+(-k):"0"),{size:24,color:k===0?C.blue:C.ink,halo:false}); r.bandL.push([k,t]); }
    r.night=[0,1].map(()=>el("rect",{x:0,y:MAPR.y,width:10,height:MAPR.h,fill:C.night,"fill-opacity":.45},cg));
    el("rect",{x:MAPR.x,y:MAPR.y,width:MAPR.w,height:MAPR.h,fill:"none",stroke:"#5D7C94","stroke-width":3},mp);
    r.gw=el("line",{x1:mx(0),y1:MAPR.y,x2:mx(0),y2:MAPR.y+MAPR.h,stroke:C.blue,"stroke-width":5},mp);
    r.sun=el("g",{},mp); sunIcon(r.sun,0,0,22);
    r.pins=CITIES.map((c,i)=>{ const g=el("g",{},mp); const x=mx(c.lon),y=my(c.lat); dot(g,x,y,11,c.col); T(g,x+c.pos[0],y+c.pos[1],c.n,{size:24,color:c.col,anchor:c.pos[2]}); return g; });
    r.mapT=T(mp,MAPR.x+MAPR.w/2,MAPR.y+MAPR.h+36,"",{size:24,color:C.ink2,halo:false});
    // cartes de villes (colonne droite)
    r.cards=CITIES.map((c,i)=>card(a.layer("card"+i),c,1290,200+i*152));
    r.cardL=r.cards.map(g=>g.parentNode);
    // ----- horloges (étape 4)
    const ck=a.layer("clocks"); r.ck=ck; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},ck);
    r.clk=CITIES.map((c,i)=>{ const x=235+i*377, y=440; const o={}; o.g=el("g",{},ck); o.c=makeClock(o.g,x,y,105,c.col); T(o.g,x,y-170,c.n,{size:34,color:c.col,halo:false}); o.t=T(o.g,x,y+190,"",{size:48,color:C.ink,halo:false}); o.d=T(o.g,x,y+250,"",{size:26,weight:700,color:c.col,halo:false}); o.ic=el("g",{},o.g); o.x=x;o.y=y; return o; });
    r.ckNote=T(ck,800,820,"(exemple en hiver : heure d'hiver à Dijon ; à Sydney, c'est l'heure d'été de l'Australie)",{size:24,color:C.ink2,halo:false});
    // ----- téléphoner (étape 5)
    const tl=a.layer("tel"); r.tel=tl; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},tl);
    const X0=200,PX=50; const hx=h=>X0+h*PX; r.hx=hx;
    T(tl,800,100,"Heure à Dijon",{size:28,color:C.ink2,halo:false});
    [0,3,6,9,12,15,18,21,24].forEach(h=>{ el("line",{x1:hx(h),y1:150,x2:hx(h),y2:158,stroke:C.ink,"stroke-width":3},tl); T(tl,hx(h),142,h+" h",{size:24,color:C.ink,halo:false}); });
    const bar=(y,label,col,sleepFrom,sleepTo,off)=>{ const g=el("g",{},tl); el("rect",{x:hx(0),y,width:24*PX,height:70,rx:8,fill:"#FFF3C4",stroke:col,"stroke-width":3},g);
      // sommeil : de 23 h à 7 h (heure locale) -> en heure de Dijon
      const segs=[[(23-off),(31-off)]]; segs.forEach(([a0,b0])=>{ for(const sh of [-24,0,24]){ const s0=Math.max(0,a0+sh), s1=Math.min(24,b0+sh); if(s1>s0) el("rect",{x:hx(s0),y,width:(s1-s0)*PX,height:70,fill:C.night,"fill-opacity":.72},g); } });
      el("rect",{x:hx(0),y,width:24*PX,height:70,rx:8,fill:"none",stroke:col,"stroke-width":4},g);
      T(g,hx(0)-14,y+46,label,{size:30,color:col,anchor:"end",halo:false}); return g; };
    r.barD=bar(230,"Dijon",C.or,0,0,0); r.barT=bar(400,"Tokyo",C.red,0,0,8);
    T(tl,hx(3.5),176,"on dort (exemple : de 23 h à 7 h)",{size:22,color:C.night,halo:false});
    T(tl,hx(0)-14,560,"",{size:1});
    r.curL=el("g",{},tl); r.curLine=el("line",{y1:200,y2:490,stroke:C.ink,"stroke-width":5},r.curL); 
    r.curD=el("g",{},r.curL); r.curT=el("g",{},r.curL);
    r.winG=el("g",{},tl); el("rect",{x:hx(7),y:520,width:8*PX,height:22,rx:6,fill:C.green},r.winG); T(r.winG,hx(11),582,"Bon moment pour appeler : de 7 h à 15 h à Dijon",{size:28,color:"#14532D",halo:false});
    r.telMsg=el("g",{},tl);
    // ----- photos
    const lp=a.layer("photos");
    r.phNight=a.photo(lp,{id:"g-a4-terre-nuit",x:1230,y:590,w:260,h:160,cap:"La Terre la nuit (lumières)",rot:2});
    r.phWZ=a.photo(lp,{id:"g-a4-weltzeituhr",x:1290,y:210,w:250,h:300,cap:"Une horloge des fuseaux",rot:-2});
    // ----- synthèse
    const sy=a.layer("synth"); r.synth=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    T(sy,800,80,"À retenir",{size:38,color:C.teal,halo:false});
    r.sc=[["La Terre tourne","sur elle-même en 24 h :\nle Soleil éclaire une moitié","#B07A00"],["24 fuseaux","de 15° chacun,\ncomptés depuis Greenwich","#2563A8"],["+ 1 h vers l'est","− 1 h vers l'ouest\n(chaque pays choisit son heure)","#C0392B"]].map((c,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:130,width:460,height:240,rx:18,fill:"#F1F7F5",stroke:c[2],"stroke-width":4},g); T(g,x,200,c[0],{size:36,color:c[2],halo:false}); T(g,x,270,c[1],{size:26,weight:600,halo:false,lh:1.3}); return g; });
    r.myth=a.layer("myth"); a.myth(r.myth,200,430,1200,"Il est la même heure partout, et le Soleil se lève en même temps partout.","Quand il est midi à Dijon, il est 6 h du matin à New York et 20 h à Tokyo : la Terre tourne, donc le Soleil n'éclaire pas tout le monde en même temps.");
    a.manip.innerHTML=`Heure à Dijon : <input type="range" id="mH" min="0" max="23" step="1" value="12" style="width:320px"> <b id="mHv" style="min-width:90px">12 h 00</b> <span style="font-weight:500;font-size:17px">(l'heure change dans le monde entier)</span>`;
    document.getElementById("mH").oninput=e=>{ dh=+e.target.value; document.getElementById("mHv").textContent=fmtT(dh); a.redraw(); };
  },
  reset(a){
    [r.pole,r.map,r.ck,r.tel,r.synth,r.myth,r.phNight,r.phWZ,r.bands,r.bandLab,r.gw,r.sun,r.mapT,r.winG,r.curL,...r.pins,...r.cardL,...r.clk.map(o=>o.g)].forEach(e=>a.op(e,0));
    r.hd.textContent=""; r.rot.setAttribute("transform",""); r.mapT.textContent=""; r.night.forEach(e=>e.style.display="none"); r.bandR.forEach(g=>a.op(g,0)); r.bandL.forEach(([k,t])=>a.op(t,0));
    r.pl.forEach(t=>t.style.display="none"); a.op(r.gwL,0);
  },
  etapes:[
  { titre:"La Terre tourne", duree:13000,
    legende:"La Terre tourne sur elle-même en 24 heures. Le Soleil n'éclaire que la moitié tournée vers lui : pour Dijon, le jour se lève, passe, puis la nuit arrive.",
    voix:"Regarde la Terre vue d'en haut, au-dessus du pôle Nord. Elle tourne sur elle-même, vers l'est, et fait un tour complet en vingt-quatre heures. Le Soleil n'éclaire que la moitié de la Terre qui est tournée vers lui. Suis Dijon : quand elle entre dans la lumière, c'est le matin ; puis c'est le jour ; puis elle ressort de la lumière, et la nuit arrive.",
    anim(t,a){ const s=a.seg; r.hd.textContent="La Terre tourne sous le Soleil"; a.op(r.pole,s(t,0,.08)); const u=6+24*s(t,.08,.98,true); const rotDeg=15*(u-12);
      r.rot.setAttribute("transform",`rotate(${-rotDeg} ${P1.cx} ${P1.cy})`);
      CITIES.slice(0,3).forEach((c,i)=>{ const rr=P1.R*(90-c.lat)/90, an=(c.lon+rotDeg)*D2R; const x=P1.cx+rr*Math.cos(an), y=P1.cy-rr*Math.sin(an); const lab=r.pl[i]; lab.style.display=""; const ox=Math.cos(an)>=0?16:-16; lab.setAttribute("x",x+ox); lab.setAttribute("y",y-14); lab.setAttribute("text-anchor",ox>0?"start":"end"); lab.setAttribute("fill",c.col); });
      { const an=rotDeg*D2R; const x=P1.cx+(P1.R+34)*Math.cos(an), y=P1.cy-(P1.R+34)*Math.sin(an); a.op(r.gwL,1); r.gwL.setAttribute("x",x); r.gwL.setAttribute("y",y+8); r.gwL.setAttribute("text-anchor",Math.cos(an)>=0?"start":"end"); }
      a.op(r.dcard,s(t,.05,.12)); cardSet(r.dcard,CITIES[0],u,40,130,"heure légale"); r.dcard.sub.textContent=isDay(CITIES[0],u)?"c'est le jour":"c'est la nuit";
      a.op(r.phNight,s(t,.1,.3)); } },
  { titre:"Jour ici, nuit ailleurs", duree:11000,
    legende:"Quand il est midi à Dijon, il fait déjà nuit à Tokyo et à Sydney, et le jour se lève à New York. Il n'est pas la même heure partout !",
    voix:"Aplatissons la Terre sur une carte. Au moment où il est midi à Dijon, la moitié éclairée par le Soleil est la zone claire. À New York, le jour vient de se lever : il est six heures du matin. Mais à Tokyo, il est vingt heures, et à Sydney, vingt-deux heures : c'est déjà la nuit.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Au même instant : midi à Dijon"; a.op(r.pole,1-s(t,0,.15)); a.op(r.phNight,0); a.op(r.map,s(t,.05,.2)); ut=11; drawMap(a,ut,{sun:s(t,.15,.3),pins:CITIES.map((c,i)=>s(t,.2+i*.05,.3+i*.05))});
      CITIES.forEach((c,i)=>{ a.op(r.cardL[i],s(t,.3+i*.15,.42+i*.15)); cardSet(r.cards[i],c,ut,1290,200+i*152,i===0?"":(i===1?"6 h de moins":i===2?"8 h de plus":"10 h de plus")); });
      r.mapT.textContent="Zone sombre : c'est la nuit. (schéma : le jour et la nuit durent chacun 12 h)"; a.op(r.mapT,s(t,.3,.45)); } },
  { titre:"24 fuseaux horaires", duree:13000,
    legende:"Pour que chacun ait une heure proche du Soleil, la Terre est découpée en 24 fuseaux de 15°. De fuseau en fuseau vers l'est, on ajoute 1 heure ; vers l'ouest, on en enlève 1.",
    voix:"Pour s'organiser, on a découpé la Terre en vingt-quatre fuseaux horaires, un par heure de la journée. Chaque fuseau mesure quinze degrés de large, car trois cent soixante divisé par vingt-quatre font quinze. On part de Greenwich, au milieu. Quand on va vers l'est, on ajoute une heure à chaque fuseau. Vers l'ouest, on enlève une heure.",
    anim(t,a){ const s=a.seg; r.hd.textContent="24 fuseaux de 15° : une heure par fuseau"; a.op(r.pole,0); a.op(r.map,1); r.cardL.forEach(e=>a.op(e,0)); a.op(r.bands,1); a.op(r.bandLab,1); a.op(r.gw,s(t,0,.1)); ut=11; drawMap(a,ut,{sun:0,pins:0}); r.night.forEach(e=>e.style.display="none");
      r.bandR.forEach((g,i)=>{ const k=i-12; const d=Math.abs(k); a.op(g,s(t,.1+d*.045,.16+d*.045)); }); r.bandL.forEach(([k,tx])=>a.op(tx,s(t,.1+Math.abs(k)*.045,.18+Math.abs(k)*.045)));
      a.op(r.pins[0],s(t,.85,.95)); a.op(r.pins[2],s(t,.85,.95)); a.op(r.phWZ,s(t,.2,.4)); r.mapT.textContent="Numéros = heures de décalage avec Greenwich : vers l'est +, vers l'ouest −"; a.op(r.mapT,s(t,.5,.65)); } },
  { titre:"Les décalages", duree:12000,
    legende:"Quand il est midi à Dijon : 6 h à New York (6 h de moins), 20 h à Tokyo (8 h de plus), 22 h à Sydney (10 h de plus). Les aiguilles avancent vers l'est, reculent vers l'ouest.",
    voix:"Midi à Dijon. Allons vers l'ouest, jusqu'à New York : on recule de six heures, il est six heures du matin. Allons vers l'est, à Tokyo : on avance de huit heures, il est vingt heures. Et à Sydney, on avance de dix heures : il est vingt-deux heures. Ici, on prend l'exemple de l'hiver ; en été, certains écarts changent d'une heure.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Le décalage horaire"; a.op(r.map,1-s(t,0,.1)); a.op(r.ck,s(t,0,.12)); a.op(r.phWZ,0);
      CITIES.forEach((c,i)=>{ const o=r.clk[i]; a.op(o.g,s(t,.05+i*.04,.15+i*.04)); const off=c.off-1; const prog=s(t,.3+i*.05,.75+i*.05); const loc=12+off*prog; o.c.set(loc); o.t.textContent=fmtT(loc); const cdel=off===0?"heure de Dijon":(off<0?(-off)+" h de moins":"+"+off+" h de plus"); o.d.textContent=prog>.98||i===0?cdel:""; while(o.ic.firstChild) o.ic.removeChild(o.ic.firstChild); const day=isDay(c,loc-c.off); Anim.H.el("circle",{cx:o.x+138,cy:o.y-170,r:28,fill:day?"#FFF3C4":"#E4E8F5"},o.ic); if(day) sunIcon(o.ic,o.x+138,o.y-170,14); else moonIcon(o.ic,o.x+136,o.y-170,13); });
      a.op(r.ckNote,s(t,.8,.95)); } },
  { titre:"Téléphoner au Japon", duree:14000,
    legende:"À 20 h à Dijon, il est 4 h du matin à Tokyo : on dort ! Pour appeler en même temps, il faut choisir un moment où les deux sont réveillés.",
    voix:"Pourquoi n'appelle-t-on pas le Japon à vingt heures ? Parce qu'à vingt heures à Dijon, il est quatre heures du matin à Tokyo : tout le monde dort ! Les zones sombres montrent les heures de sommeil. Pour téléphoner, il faut un moment où les deux pays sont réveillés. Par exemple à neuf heures à Dijon, car il est alors dix-sept heures à Tokyo.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Quand téléphoner à Tokyo ?"; a.op(r.ck,0); a.op(r.tel,s(t,0,.1)); a.op(r.curL,s(t,.08,.15));
      let h=12; if(t<.5) h=12+8*s(t,.1,.42); else h=20-11*s(t,.55,.82);
      const hh=h; const x=r.hx(hh); a.set(r.curLine,{x1:x,x2:x}); 
      while(r.curD.firstChild) r.curD.removeChild(r.curD.firstChild); while(r.curT.firstChild) r.curT.removeChild(r.curT.firstChild);
      a.label(r.curD,x,203,fmtT(hh),{size:24,stroke:C.or,color:C.ink,fill:"#fff"}); const tk=(hh+8)%24; a.label(r.curT,x,500,fmtT(tk),{size:24,stroke:C.red,color:C.ink,fill:"#fff"});
      const sleepT=(tk>=23||tk<7), sleepD=(hh>=23||hh<7);
      while(r.telMsg.firstChild) r.telMsg.removeChild(r.telMsg.firstChild);
      if(t>=.42&&t<.55){ const m=a.label(r.telMsg,800,690,"20 h à Dijon = 4 h à Tokyo : il dort !",{size:38,stroke:C.red,color:"#7A1D12",fill:"#FDECEA",sw:4}); } 
      if(t>=.55&&t<.8){ a.label(r.telMsg,800,690,"…en avançant l'heure d'appel",{size:30,stroke:C.ink2,color:C.ink2,fill:"#fff"}); }
      if(t>=.8){ a.label(r.telMsg,800,690,"9 h à Dijon = 17 h à Tokyo : tout le monde est réveillé",{size:36,stroke:C.green,color:"#14532D",fill:"#E8F6EE",sw:4}); }
      a.op(r.winG,s(t,.82,.95)); } },
  { titre:"À toi : choisis l'heure", duree:5000,
    legende:"À toi ! Avec le curseur, choisis l'heure à Dijon : regarde l'heure dans les trois autres villes et la nuit qui avance sur la carte.",
    voix:"À toi de jouer ! Déplace le curseur pour choisir l'heure qu'il est à Dijon. Regarde l'heure qu'il est alors à New York, à Tokyo et à Sydney, et la zone de nuit qui se déplace sur la carte. Quelle heure est-il à Tokyo quand on déjeune à Dijon ?",
    anim(t,a){ const s=a.seg; r.hd.textContent="Quelle heure est-il ailleurs ?"; a.op(r.tel,0); a.op(r.ck,0); a.op(r.phWZ,0); a.op(r.map,1); a.op(r.bands,s(t,0,.2)*0); a.op(r.gw,1); ut=dh-1; drawMap(a,ut,{sun:1,pins:1});
      CITIES.forEach((c,i)=>{ a.op(r.cardL[i],1); const d=c.off-1; cardSet(r.cards[i],c,ut,1290,200+i*152,i===0?"heure à Dijon":(d<0?(-d)+" h de moins":d+" h de plus")); });
      a.op(r.bandLab,0); r.mapT.textContent="Zone sombre : nuit · Soleil : au-dessus du lieu où il est midi (schéma)"; a.op(r.mapT,1); } },
  { titre:"Synthèse", duree:10000,
    legende:"La Terre tourne, donc le Soleil n'éclaire pas tout le monde en même temps. On a découpé la Terre en 24 fuseaux : +1 h vers l'est, −1 h vers l'ouest.",
    voix:"Pour retenir : la Terre tourne sur elle-même, donc le Soleil n'éclaire pas tout le monde en même temps. On a découpé la Terre en vingt-quatre fuseaux horaires. Quand on va vers l'est, on ajoute une heure par fuseau ; vers l'ouest, on en enlève une. Voilà pourquoi il n'est pas la même heure partout.",
    anim(t,a){ const s=a.seg; r.hd.textContent=""; a.op(r.map,1-s(t,0,.1)); a.op(r.synth,s(t,0,.1)); r.cardL.forEach(e=>a.op(e,0)); r.sc.forEach((c,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(c,v); a.tr(c,0,(1-v)*40); }); a.op(r.myth,s(t,.6,.78)); a.cls(r.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
