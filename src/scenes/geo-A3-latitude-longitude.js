/* META {"id":"geo-A3-latitude-longitude","matiere":"geographie","annee":"A","periode":1,"theme":"Se déplacer / se repérer dans l'espace","resume":"Le globe se couvre de parallèles et de méridiens : avec deux nombres (latitude, longitude), on situe n'importe quel point de la Terre, comme Dijon à 47° N et 5° E.","motsCles":["latitude","longitude","équateur","méridien de Greenwich","coordonnées","globe","planisphère"]} */
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

const LAND=decode(N4LAND.land), EU=decode(N4LAND.eu);
const Dj={lon:5.04,lat:47.32};
const G={lon0:0,lat0:18,R:300,cx:450,cy:480};
const INS={ix:1270,cy:308,r:130,top:100};
const MAP={x:100,y:150,w:1400,h:700};
const mx=lon=>MAP.x+(lon+180)/360*MAP.w, my=lat=>MAP.y+(90-lat)/180*MAP.h;
const mp={lat:47,lon:5};
const PLACES=[["Dijon",47.3,5.0],["Paris",48.9,2.4],["Tokyo",35.7,139.7],["New York",40.7,-74],["Sydney",-33.9,151.2],["Le Caire",30,31.2],["Rio de Janeiro",-22.9,-43.2],["Dakar",14.7,-17.5],["Le Cap",-33.9,18.4]];
const fmtLat=v=>v===0?"0°":Math.abs(v)+"° "+(v<0?"S":"N"), fmtLon=v=>(v===0||Math.abs(v)===180)?Math.abs(v)+"°":Math.abs(v)+"° "+(v<0?"O":"E");
const V={z:1,clon:0,clat:0}; // vue de la carte plane
const MS=(lon,lat)=>[MAP.x+MAP.w/2+V.z*(mx(lon)-mx(V.clon)), MAP.y+MAP.h/2+V.z*(my(lat)-my(V.clat))];
let r={};
const GP=(lon,lat)=>orthoPt(lon,lat,G.lon0,G.lat0,G.R,G.cx,G.cy);
function part(pts,f){ return pts.slice(0,Math.max(2,Math.ceil(pts.length*Math.min(1,Math.max(0,f))))); }
function par(lat,start,f){ const a=[]; for(let k=0;k<=120;k++) a.push([start+k*3,lat]); return part(a,f); }
function drawGlobe(){
  r.gLand.setAttribute("d",orthoPath(LAND,G.lon0,G.lat0,G.R,G.cx,G.cy));
}
function lines(o){ // o: {eq,trop,par30,mer,gw}
  const {cx,cy,R}=G;
  r.eq.setAttribute("d",orthoLine(par(0,G.lon0-90,o.eq),G.lon0,G.lat0,R,cx,cy));
  r.trop.forEach((p,i)=>p.setAttribute("d",orthoLine(par(i?-23.44:23.44,G.lon0-90,o.trop),G.lon0,G.lat0,R,cx,cy)));
  r.p30.forEach((p,i)=>p.setAttribute("d",orthoLine(par([30,60,-30,-60][i],G.lon0-90,o.par),G.lon0,G.lat0,R,cx,cy)));
  r.mer.forEach((p,i)=>p.setAttribute("d",orthoLine(part(meridian(-150+30*i),o.mer),G.lon0,G.lat0,R,cx,cy)));
  r.gw.setAttribute("d",orthoLine(part(meridian(0),o.gw),G.lon0,G.lat0,R,cx,cy));
  r.am.setAttribute("d",orthoLine(part(meridian(180),o.gw),G.lon0,G.lat0,R,cx,cy));
}
function glabels(items){ // [{lon,lat,txt,color,dx,dy,anchor}]
  r.gl.forEach((t,i)=>{ const it=items[i]; if(!it){ t.style.display="none"; return; } const p=GP(it.lon,it.lat); if(p[2]<0.12||it.o<=0.01){ t.style.display="none"; return; }
    t.style.display=""; t.setAttribute("x",p[0]+(it.dx||0)); t.setAttribute("y",p[1]+(it.dy||0)); t.setAttribute("fill",it.color||C.ink); t.setAttribute("text-anchor",it.anchor||"middle"); t.setAttribute("opacity",it.o===undefined?1:it.o); t.removeAttribute("transform"); t.textContent=it.txt; }); }
function pin(g,lon,lat,o){ const p=GP(lon,lat); if(p[2]<0.05||o<=0.01){ g.style.display="none"; return; } g.style.display=""; g.setAttribute("opacity",o); g.setAttribute("transform",`translate(${p[0]},${p[1]})`); }
function insetAngle(g,ang,col){ /* utilisé dans les schémas */ }
function setView(z,clon,clat){ V.z=z;V.clon=clon;V.clat=clat; const tx=MAP.x+MAP.w/2-z*mx(clon), ty=MAP.y+MAP.h/2-z*my(clat); r.mapIn.setAttribute("transform",`translate(${tx},${ty}) scale(${z})`); }

Anim.run({
  titre:"Latitude et longitude : se repérer avec deux nombres",
  manipDes:6, manipJusqua:6,
  sousTitre:"Géographie · CM1-CM2 · Se repérer dans l'espace",
  matiere:"geographie", badge:"Géographie",
  accroche:"Comment indiquer où l'on est, même au milieu de l'océan ?",
  init(a){
    const {el}=a;
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"gclip"},defs); el("circle",{cx:G.cx,cy:G.cy,r:G.R},cp);
    const cm=el("clipPath",{id:"mclip"},defs); el("rect",{x:MAP.x,y:MAP.y,width:MAP.w,height:MAP.h,rx:6},cm);
    // titre de l'étape
    r.hd=T(a.layer("hd"),800,64,"",{size:38,color:C.teal,halo:false});
    // ----- GLOBE
    const gg=a.layer("globe"); r.globe=gg;
    el("circle",{cx:G.cx,cy:G.cy,r:G.R+8,fill:"#E8F1F7",stroke:"none"},gg);
    el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:C.sea,stroke:"#7FA9C4","stroke-width":3},gg);
    const gi=el("g",{"clip-path":"url(#gclip)"},gg);
    r.gLand=el("path",{d:"",fill:C.land,stroke:C.landS,"stroke-width":1.2,"fill-rule":"evenodd"},gi);
    const L=(w,col,dash)=>el("path",{d:"",fill:"none",stroke:col,"stroke-width":w,"stroke-dasharray":dash||null,"stroke-linecap":"round"},gi);
    r.mer=[...Array(12)].map(()=>L(1.6,"#5D7C94")); r.p30=[...Array(4)].map(()=>L(1.6,"#5D7C94"));
    r.trop=[L(3.2,"#C77D0A","10 8"),L(3.2,"#C77D0A","10 8")]; r.am=L(2.4,"#5D7C94","6 6"); r.gw=L(6,C.blue); r.eq=L(6,C.red);
    el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:"none",stroke:"#5D7C94","stroke-width":3},gg);
    // axe
    r.axis=el("g",{},gg); el("line",{x1:G.cx,y1:G.cy-G.R-48,x2:G.cx,y2:G.cy+G.R+48,stroke:"#555","stroke-width":4,"stroke-dasharray":"2 9","stroke-linecap":"round"},r.axis);
    T(r.axis,G.cx,G.cy-G.R-58,"Pôle Nord",{size:24,color:"#333"}); T(r.axis,G.cx,G.cy+G.R+84,"Pôle Sud",{size:24,color:"#333"});
    r.gl=[...Array(14)].map(()=>T(gg,0,0,"",{size:24}));
    r.pinDj=el("g",{},gg); dot(r.pinDj,0,0,10,C.or); T(r.pinDj,16,8,"Dijon",{size:26,color:C.or,anchor:"start"});
    r.pinOc=el("g",{},gg); dot(r.pinOc,0,0,11,C.red); T(r.pinOc,0,-22,"?",{size:40,color:C.red}); 
    r.bubble=el("g",{},gg); a.label(r.bubble,G.cx,G.cy+G.R+8-40,"",{size:1}); r.bubble.remove();
    // ----- insets (colonne de droite)
    const ins=a.layer("insets"); r.ins=ins;
    // latitude (coupe)
    const {ix,top:RT,r:ir}=INS, icy=INS.cy;
    r.inLat=el("g",{},ins);
    el("rect",{x:ix-230,y:RT,width:460,height:440,rx:16,fill:"#fff",stroke:C.line,"stroke-width":3},r.inLat);
    T(r.inLat,ix,RT+36,"La Terre vue de côté (coupe)",{size:24,halo:false});
    el("circle",{cx:ix,cy:icy,r:ir,fill:"#E8F1F7",stroke:"#5D7C94","stroke-width":4},r.inLat);
    el("line",{x1:ix-ir-30,y1:icy,x2:ix+ir+30,y2:icy,stroke:C.red,"stroke-width":6},r.inLat);
    T(r.inLat,ix-ir-34,icy+34,"équateur 0°",{size:22,color:C.red,anchor:"start",halo:false});
    T(r.inLat,ix,icy-ir-12,"Pôle Nord 90°",{size:22,halo:false});
    el("circle",{cx:ix,cy:icy,r:6,fill:C.ink},r.inLat);
    r.latRad=el("line",{x1:ix,y1:icy,x2:ix,y2:icy,stroke:C.or,"stroke-width":6,"stroke-linecap":"round"},r.inLat);
    r.latArc=el("path",{d:"",fill:"rgba(224,122,31,.25)",stroke:C.or,"stroke-width":4},r.inLat);
    r.latDot=el("circle",{r:11,fill:C.or,stroke:"#fff","stroke-width":3},r.inLat);
    r.latTxt=T(r.inLat,ix+70,icy-26,"",{size:34,color:C.or,anchor:"start",halo:false});
    r.latLab=T(r.inLat,ix,icy+ir+58,"",{size:28,color:C.or,halo:false});
    // longitude (vue de dessus)
    r.inLon=el("g",{},ins);
    el("rect",{x:ix-230,y:RT,width:460,height:440,rx:16,fill:"#fff",stroke:C.line,"stroke-width":3},r.inLon);
    T(r.inLon,ix,RT+36,"La Terre vue d'au-dessus du pôle Nord",{size:22,halo:false});
    el("circle",{cx:ix,cy:icy,r:ir,fill:"#E8F1F7",stroke:"#5D7C94","stroke-width":4},r.inLon);
    for(let k=0;k<12;k++){ const an=(90+30*k)*D2R; el("line",{x1:ix,y1:icy,x2:ix+ir*Math.cos(an),y2:icy+ir*Math.sin(an),stroke:"#9FB8CC","stroke-width":2},r.inLon); }
    T(r.inLon,ix,icy+ir+34,"Greenwich 0°",{size:22,color:C.blue,halo:false}); T(r.inLon,ix+ir+8,icy+8,"90° E",{size:20,anchor:"start",halo:false,color:C.ink2}); T(r.inLon,ix-ir-8,icy+8,"90° O",{size:20,anchor:"end",halo:false,color:C.ink2}); T(r.inLon,ix,icy-ir-10,"180°",{size:20,halo:false,color:C.ink2});
    el("line",{x1:ix,y1:icy,x2:ix,y2:icy+ir+8,stroke:C.blue,"stroke-width":7,"stroke-linecap":"round"},r.inLon);
    r.lonRad=el("line",{x1:ix,y1:icy,x2:ix,y2:icy,stroke:C.or,"stroke-width":6,"stroke-linecap":"round"},r.inLon);
    r.lonArc=el("path",{d:"",fill:"rgba(224,122,31,.3)",stroke:C.or,"stroke-width":4},r.inLon);
    r.lonTxt=T(r.inLon,ix+30,icy+ir*.5,"",{size:30,color:C.or,anchor:"start",halo:false});
    r.lonLab=T(r.inLon,ix,icy+ir+74,"",{size:28,color:C.or,halo:false});
    // ----- photos
    const lp=a.layer("photos");
    r.phGW=a.photo(lp,{id:"g-a3-greenwich",x:1090,y:590,w:320,h:200,cap:"Le méridien de Greenwich",rot:2});
    r.phNasa=a.photo(lp,{id:"g-a3-terre-nasa",x:1100,y:230,w:300,h:300,cap:"La Terre vue de l'espace",rot:-2});
    // ----- carte plane
    const mp=a.layer("map"); r.map=mp;
    el("rect",{x:MAP.x,y:MAP.y,width:MAP.w,height:MAP.h,rx:6,fill:C.sea},mp);
    const clipG=el("g",{"clip-path":"url(#mclip)"},mp); r.mapIn=el("g",{},clipG);
    r.mLand=el("path",{d:flatPath(LAND,(lo,la)=>[mx(lo),my(la)]),fill:C.land,stroke:C.landS,"stroke-width":1,"vector-effect":"non-scaling-stroke","fill-rule":"evenodd"},r.mapIn);
    r.mLandEU=el("path",{d:flatPath(EU,(lo,la)=>[mx(lo),my(la)]),fill:C.land,stroke:C.landS,"stroke-width":1.2,"vector-effect":"non-scaling-stroke","fill-rule":"evenodd"},r.mapIn);
    const gl=(x1,y1,x2,y2,w,col,dash)=>{ const e=el("line",{x1,y1,x2,y2,stroke:col,"stroke-width":w,"vector-effect":"non-scaling-stroke","stroke-dasharray":dash||null},r.mapIn); return e; };
    r.gridV=[];r.gridH=[];r.gridV5=[];r.gridH5=[];
    for(let lo=-180;lo<=180;lo+=30) r.gridV.push(gl(mx(lo),MAP.y,mx(lo),MAP.y+MAP.h,lo===0?0:1.6,"#4F6F86"));
    for(let la=-90;la<=90;la+=30) r.gridH.push(gl(MAP.x,my(la),MAP.x+MAP.w,my(la),la===0?0:1.6,"#4F6F86"));
    r.fine=el("g",{},r.mapIn);
    for(let lo=-30;lo<=50;lo+=5) if(lo%30) r.gridV5.push(el("line",{x1:mx(lo),y1:my(70),x2:mx(lo),y2:my(25),stroke:"#7C98AC","stroke-width":1,"vector-effect":"non-scaling-stroke"},r.fine));
    for(let la=25;la<=70;la+=5) if(la%30) r.gridH5.push(el("line",{x1:mx(-30),y1:my(la),x2:mx(50),y2:my(la),stroke:"#7C98AC","stroke-width":1,"vector-effect":"non-scaling-stroke"},r.fine));
    r.gEq=gl(MAP.x,my(0),MAP.x+MAP.w,my(0),5,C.red); r.gGW=gl(mx(0),MAP.y,mx(0),MAP.y+MAP.h,5,C.blue);
    r.gTr=[gl(MAP.x,my(23.44),MAP.x+MAP.w,my(23.44),2.5,"#C77D0A","10 8"),gl(MAP.x,my(-23.44),MAP.x+MAP.w,my(-23.44),2.5,"#C77D0A","10 8")];
    el("rect",{x:MAP.x,y:MAP.y,width:MAP.w,height:MAP.h,rx:6,fill:"none",stroke:"#5D7C94","stroke-width":3},mp);
    // étiquettes de la carte (hors zoom)
    const ml=a.layer("maplab"); r.ml=ml;
    r.mTop=[...Array(26)].map(()=>T(ml,0,0,"",{size:22,color:C.ink2,halo:true,sw:5}));
    r.mLeft=[...Array(26)].map(()=>T(ml,0,0,"",{size:22,color:C.ink2,anchor:"end",halo:true,sw:5}));
    r.mEqT=T(ml,MAP.x+MAP.w-8,my(0)-10,"Équateur",{size:24,color:C.red,anchor:"end"});
    r.mGwT=T(ml,mx(0)+10,MAP.y+30,"Greenwich",{size:24,color:C.blue,anchor:"start"});
    r.mTrT=[T(ml,MAP.x+MAP.w-12,my(23.44)-8,"Tropique du Cancer",{size:22,color:"#8A5A00",anchor:"end"}),T(ml,MAP.x+MAP.w-12,my(-23.44)+26,"Tropique du Capricorne",{size:22,color:"#8A5A00",anchor:"end"})];
    // repères (point + lignes de coordonnées)
    r.cur=a.layer("cursors");
    r.cH=el("line",{stroke:C.or,"stroke-width":5,"stroke-dasharray":"12 8"},r.cur); r.cV=el("line",{stroke:C.or,"stroke-width":5,"stroke-dasharray":"12 8"},r.cur);
    r.cP=el("g",{},r.cur); r.cPc=el("circle",{r:14,fill:"none",stroke:C.red,"stroke-width":5},r.cP); r.cPd=el("circle",{r:8,fill:C.red,stroke:"#fff","stroke-width":2},r.cP);
    r.cLab=el("g",{},r.cur);
    r.cLabs=[...Array(4)].map(()=>{ const g=el("g",{},r.cur); return g; });
    // synthèse
    const sy=a.layer("synth"); r.synth=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    T(sy,800,80,"Pour se repérer sur la Terre",{size:38,color:C.teal,halo:false});
    r.cards=[["Latitude","vers le nord ou le sud\n(0° à l'équateur, 90° aux pôles)",C.red,"47° N"],["Longitude","vers l'est ou l'ouest\n(0° à Greenwich, 180° à l'opposé)",C.blue,"5° E"],["Deux nombres","= un point unique,\nmême au milieu de l'océan","#2E8B57","(47° N ; 5° E)"]].map((c,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:130,width:460,height:290,rx:18,fill:"#F1F7F5",stroke:c[2],"stroke-width":4},g); T(g,x,190,c[0],{size:36,color:c[2],halo:false}); T(g,x,262,c[3],{size:52,color:C.ink,halo:false}); T(g,x,334,c[1],{size:23,weight:600,halo:false,lh:1.3}); return g; });
    a.manip.innerHTML=`Latitude : <input type="range" id="mLat" min="-90" max="90" step="1" value="47" style="width:200px"> <b id="mLatV" style="min-width:76px">47° N</b> Longitude : <input type="range" id="mLon" min="-180" max="180" step="1" value="5" style="width:200px"> <b id="mLonV" style="min-width:76px">5° E</b> <button id="mP0">Dijon</button><button id="mP1">Tokyo</button><button id="mP2">New York</button><button id="mP3">Sydney</button>`;
    const upd=()=>{ document.getElementById("mLatV").textContent=fmtLat(mp.lat); document.getElementById("mLonV").textContent=fmtLon(mp.lon); document.getElementById("mLat").value=mp.lat; document.getElementById("mLon").value=mp.lon; a.redraw(); };
    document.getElementById("mLat").oninput=e=>{ mp.lat=+e.target.value; upd(); }; document.getElementById("mLon").oninput=e=>{ mp.lon=+e.target.value; upd(); };
    [[47,5],[36,140],[41,-74],[-34,151]].forEach((q,i)=>{ document.getElementById("mP"+i).onclick=()=>{ mp.lat=q[0]; mp.lon=q[1]; upd(); }; });
    r.myth=a.layer("myth"); a.myth(r.myth,200,470,1200,"On ne peut localiser un lieu que par le nom d'une ville.","Avec deux nombres, la latitude et la longitude, on peut situer n'importe quel point de la Terre, même sans ville ni nom.");
  },
  reset(a){
    [r.globe,r.ins,r.inLat,r.inLon,r.phGW,r.phNasa,r.map,r.ml,r.cur,r.synth,r.myth,r.pinDj,r.pinOc,r.cP,r.cH,r.cV,r.axis,r.mLandEU,r.fine,r.gEq,r.gGW,...r.gTr,...r.mTrT,r.mEqT,r.mGwT,...r.cards].forEach(e=>a.op(e,0));
    r.cLabs.forEach(g=>a.op(g,0)); r.mTop.forEach(t=>t.style.display="none"); r.mLeft.forEach(t=>t.style.display="none");
    r.globe.removeAttribute("transform"); r.hd.textContent="";
    r.gridV.forEach(e=>a.op(e,0)); r.gridH.forEach(e=>a.op(e,0)); a.op(r.mLand,1); setView(1,0,0);
    G.lon0=0;G.lat0=18;G.R=300;G.cx=450;G.cy=480; r.gl.forEach(t=>t.style.display="none");
  },
  etapes:[
  { titre:"Où suis-je ?", duree:9000,
    legende:"Dijon a un nom. Mais un point au milieu de l'océan n'en a pas ! Comment le décrire à quelqu'un ?",
    voix:"Sur le globe, on peut montrer Dijon, parce que la ville a un nom. Mais comment décrire un point perdu au milieu de l'océan Pacifique, où il n'y a aucune ville ? Pour cela, on a tracé des lignes imaginaires sur la Terre.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Un globe sans repères"; a.op(r.globe,s(t,0,.1)); a.op(r.axis,s(t,.05,.2));
      G.lon0=lerp3(30,-100,s(t,.1,.9,true)); G.lat0=18; drawGlobe(); lines({eq:0,trop:0,par:0,mer:0,gw:0}); glabels([]);
      pin(r.pinDj,Dj.lon,Dj.lat,s(t,.15,.3)*(1-s(t,.55,.7))); pin(r.pinOc,-140,20,s(t,.75,.88));
      a.op(r.phNasa,s(t,.1,.3)); } },
  { titre:"L'équateur et les parallèles", duree:10000,
    legende:"Les parallèles sont des cercles autour de la Terre. L'équateur (0°) la coupe en deux. La latitude se mesure en degrés vers le nord ou vers le sud.",
    voix:"Première famille de lignes : les parallèles. Ce sont des cercles tracés autour de la Terre, parallèles à l'équateur. L'équateur est le grand cercle du milieu : zéro degré. La latitude indique de combien de degrés on est au nord ou au sud de l'équateur, jusqu'à quatre-vingt-dix degrés aux pôles. Dijon est à quarante-sept degrés nord.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Les parallèles : la latitude"; a.op(r.globe,1); a.op(r.axis,1); a.op(r.phNasa,1-s(t,0,.12));
      G.lon0=lerp3(-100,10,s(t,0,.5)); G.lat0=18; drawGlobe();
      lines({eq:s(t,.05,.3),trop:0,par:s(t,.3,.55),mer:0,gw:0});
      const lat=[[30,"30° N",1],[60,"60° N",1],[-30,"30° S",1],[-60,"60° S",1],[0,"0° équateur",1]]; 
      glabels([ {lon:G.lon0+2,lat:0,txt:"équateur 0°",color:C.red,dx:12,dy:-12,anchor:"start",o:s(t,.25,.35)}, {lon:G.lon0+2,lat:30,txt:"30° N",dx:12,dy:-8,anchor:"start",o:s(t,.55,.65)},{lon:G.lon0+2,lat:60,txt:"60° N",dx:12,dy:-8,anchor:"start",o:s(t,.55,.65)},{lon:G.lon0+2,lat:-30,txt:"30° S",dx:12,dy:26,anchor:"start",o:s(t,.55,.65)},{lon:G.lon0+2,lat:-60,txt:"60° S",dx:12,dy:26,anchor:"start",o:s(t,.55,.65)} ]);
      pin(r.pinDj,Dj.lon,Dj.lat,s(t,.62,.72)); 
      a.op(r.ins,s(t,.6,.7)); a.op(r.inLat,s(t,.6,.7)); const v=s(t,.68,.95); const ang=47.32*v*D2R; const ix=INS.ix,iy=INS.cy,ir=INS.r; const ex=ix+ir*Math.cos(ang), ey=iy-ir*Math.sin(ang);
      a.set(r.latRad,{x2:ex,y2:ey}); a.set(r.latDot,{cx:ex,cy:ey}); r.latArc.setAttribute("d",`M${ix},${iy} L${ix+ir*.5},${iy} A${ir*.5},${ir*.5} 0 0 0 ${ix+ir*.5*Math.cos(ang)},${iy-ir*.5*Math.sin(ang)} Z`);
      r.latTxt.textContent=Math.round(47.32*v)+"°"; r.latTxt.setAttribute("x",ix+ir*.5+16); r.latTxt.setAttribute("y",iy-10-ir*.12*v);
      r.latLab.textContent=v>0.98?"Dijon : latitude 47° N":""; } },
  { titre:"Les méridiens et Greenwich", duree:11000,
    legende:"Les méridiens vont d'un pôle à l'autre. On a choisi celui de Greenwich (près de Londres) comme point de départ : 0°. La longitude se mesure vers l'est ou vers l'ouest.",
    voix:"Deuxième famille : les méridiens. Ce sont des demi-cercles qui vont du pôle Nord au pôle Sud. Il fallait choisir un méridien de départ : on a choisi celui qui passe à Greenwich, près de Londres, en Angleterre. C'est le zéro degré. La longitude indique de combien de degrés on est à l'est ou à l'ouest de ce méridien, jusqu'à cent quatre-vingts degrés. Dijon est à cinq degrés est.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Les méridiens : la longitude"; a.op(r.globe,1); a.op(r.axis,1);
      G.lon0=lerp3(10,15,s(t,0,1)); G.lat0=18; drawGlobe();
      lines({eq:1,trop:0,par:1,mer:s(t,.05,.35),gw:s(t,.3,.5)});
      const lo=[];[-60,-30,30,60,90].forEach((v)=>lo.push({lon:v,lat:0,txt:Math.abs(v)+"° "+(v<0?"O":"E"),dy:-12,dx:0,o:s(t,.45,.55),color:C.ink}));
      lo.push({lon:0,lat:0,txt:"0°",color:C.blue,dy:28,o:s(t,.4,.5)});
      glabels(lo);
      pin(r.pinDj,Dj.lon,Dj.lat,s(t,.6,.7));
      a.op(r.ins,s(t,.55,.65)); a.op(r.inLat,0); a.op(r.inLon,s(t,.55,.65)); a.op(r.phGW,s(t,.15,.35)*(1-s(t,.55,.65)));
      const v=s(t,.65,.95); const ang=(5.04*v)*D2R; const ix=INS.ix,iy=INS.cy,ir=INS.r; // 0° vers le bas, l'est vers la droite (vue du pôle Nord)
      const ex=ix+ir*Math.sin(ang), ey=iy+ir*Math.cos(ang);
      a.set(r.lonRad,{x2:ex,y2:ey}); r.lonArc.setAttribute("d",`M${ix},${iy} L${ix},${iy+ir*.55} A${ir*.55},${ir*.55} 0 0 0 ${ix+ir*.55*Math.sin(ang)},${iy+ir*.55*Math.cos(ang)} Z`);
      r.lonTxt.textContent=(5.04*v).toFixed(0)+"°"; r.lonTxt.setAttribute("x",ix+26); r.lonTxt.setAttribute("y",iy+ir*.5);
      r.lonLab.textContent=v>0.98?"Dijon : longitude 5° E":"";
      a.op(r.phGW,s(t,.15,.3)*(1-s(t,.55,.65))); } },
  { titre:"Du globe à la carte", duree:9000,
    legende:"Sur une carte du monde, les parallèles deviennent des lignes horizontales, les méridiens des lignes verticales : un quadrillage. Les tropiques sont deux parallèles remarquables.",
    voix:"Sur une carte du monde, on voit toute la Terre à plat. Les parallèles deviennent des lignes horizontales, les méridiens des lignes verticales. Cela forme un quadrillage, comme dans un jeu de bataille navale. Les deux tropiques, le Cancer au nord et le Capricorne au sud, sont deux parallèles remarquables, à vingt-trois degrés et demi de l'équateur.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Le quadrillage sur la carte du monde"; const k=s(t,0,.35);
      a.op(r.globe,1-k); const sc=1-.35*k; r.globe.setAttribute("transform",`translate(${G.cx*(1-sc)-300*k},${G.cy*(1-sc)}) scale(${sc})`);
      G.lon0=15; G.lat0=18; drawGlobe(); lines({eq:1,trop:0,par:1,mer:1,gw:1}); glabels([]); pin(r.pinDj,Dj.lon,Dj.lat,1); a.op(r.ins,0);
      a.op(r.map,s(t,.2,.45)); a.op(r.mLand,1); setView(1,0,0);
      r.gridV.forEach((e,i)=>a.op(e,s(t,.4+i*.02,.5+i*.02))); r.gridH.forEach((e,i)=>a.op(e,s(t,.55+i*.04,.65+i*.04)));
      a.op(r.gEq,s(t,.6,.7)); a.op(r.gGW,s(t,.6,.7)); a.op(r.mEqT,s(t,.7,.8)); a.op(r.mGwT,s(t,.7,.8)); r.gTr.forEach(e=>a.op(e,s(t,.8,.9))); r.mTrT.forEach(e=>a.op(e,s(t,.85,.95)));
      mapTicks(a,30,s(t,.75,.9)); } },
  { titre:"Les coordonnées de Dijon", duree:11000,
    legende:"Zoom sur l'Europe : Dijon est à 47° de latitude nord et 5° de longitude est. On écrit : 47° N, 5° E. Ce sont ses coordonnées géographiques.",
    voix:"Zoomons sur l'Europe. On cherche Dijon. On descend depuis le haut de la carte jusqu'à la ligne de quarante-sept degrés nord, et on suit la ligne verticale de cinq degrés est. Elles se croisent à Dijon. Ses coordonnées géographiques sont donc : quarante-sept degrés nord, cinq degrés est.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Dijon : 47° N, 5° E"; a.op(r.globe,0); a.op(r.map,1);
      const z=lerp3(1,6,s(t,0,.35)); setView(z,lerp3(0,8,s(t,0,.35)),lerp3(0,47,s(t,0,.35)));
      const hi=s(t,.15,.4); a.op(r.mLand,1-hi); a.op(r.mLandEU,hi);
      r.gridV.forEach(e=>a.op(e,1)); r.gridH.forEach(e=>a.op(e,1)); a.op(r.gEq,1); a.op(r.gGW,1); a.op(r.fine,s(t,.25,.45)); a.op(r.mEqT,0);a.op(r.mGwT,0);
      mapTicks(a,5,s(t,.35,.5),true);
      const p=MS(Dj.lon,Dj.lat); const fx=MAP.x, fy=MAP.y;
      // ligne horizontale (latitude) puis verticale (longitude)
      const h=s(t,.5,.65), v=s(t,.68,.85);
      a.op(r.cur,1); a.op(r.cH,h>0?1:0); a.set(r.cH,{x1:MAP.x,y1:p[1],x2:MAP.x+(p[0]-MAP.x)*h,y2:p[1]}); a.op(r.cV,v>0?1:0); a.set(r.cV,{x1:p[0],y1:MAP.y+MAP.h,x2:p[0],y2:MAP.y+MAP.h-(MAP.y+MAP.h-p[1])*v});
      a.op(r.cP,s(t,.85,.92)); r.cP.setAttribute("transform",`translate(${p[0]},${p[1]})`); r.cPc.setAttribute("r",14+8*Math.sin(t*30)*s(t,.9,1));
      const lab=r.cLabs[0]; while(lab.firstChild) lab.removeChild(lab.firstChild);
      const gtxt=Anim.H.el("g",{},lab); a.label(gtxt,p[0]+190,p[1]-90,"Dijon\n47° N, 5° E",{size:30,stroke:C.or,color:C.ink,fill:"#FFF6EA"}); a.op(lab,s(t,.9,1));
      latlonBadges(a,p,h,v); } },
  { titre:"Trouver un point avec deux nombres", duree:14000,
    legende:"Avec deux nombres, on retrouve un lieu : on lit la latitude sur le côté, la longitude en bas, et on cherche le croisement. Même au milieu de l'océan !",
    voix:"Maintenant, joue au jeu des coordonnées. Trente-six degrés nord, cent quarante degrés est : c'est Tokyo, au Japon. Quarante et un degrés nord, soixante-quatorze degrés ouest : c'est New York. Trente-quatre degrés sud, cent cinquante et un degrés est : c'est Sydney, en Australie. Et vingt degrés nord, cent quarante degrés ouest ? Il n'y a pas de ville : c'est au milieu de l'océan Pacifique. Deux nombres suffisent pour le situer.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Chercher un point avec deux nombres"; a.op(r.globe,0); a.op(r.map,1); setView(1,0,0); a.op(r.mLand,1); a.op(r.mLandEU,0); a.op(r.fine,0);
      r.gridV.forEach(e=>a.op(e,1)); r.gridH.forEach(e=>a.op(e,1)); a.op(r.gEq,1); a.op(r.gGW,1); mapTicks(a,30,1);
      const Q=[[36,140,"36° N, 140° E","Tokyo (Japon)",C.red],[41,-74,"41° N, 74° O","New York (États-Unis)",C.blue],[-34,151,"34° S, 151° E","Sydney (Australie)","#2E8B57"],[20,-140,"20° N, 140° O","Océan Pacifique : aucune ville !",C.or]];
      a.op(r.cur,1); a.op(r.cP,0); a.op(r.cH,0); a.op(r.cV,0); r.hd.textContent="";
      Q.forEach((q,i)=>{ const T0=i*.25; const g=r.cLabs[i]; while(g.firstChild) g.removeChild(g.firstChild);
        if(t<T0){ a.op(g,0); return; } a.op(g,1);
        const p=[mx(q[1]),my(q[0])]; const h=s(t,T0+.03,T0+.11), v=s(t,T0+.11,T0+.19), rev=s(t,T0+.19,T0+.23);
        const act=t<T0+.25||i===3;
        if(act){ const e1=Anim.H.el("line",{x1:MAP.x,y1:p[1],x2:MAP.x+(p[0]-MAP.x)*h,y2:p[1],stroke:q[4],"stroke-width":5,"stroke-dasharray":"12 8"},g); const e2=Anim.H.el("line",{x1:p[0],y1:MAP.y+MAP.h,x2:p[0],y2:MAP.y+MAP.h-(MAP.y+MAP.h-p[1])*v,stroke:q[4],"stroke-width":5,"stroke-dasharray":"12 8"},g); a.op(e1,h>0?1:0); a.op(e2,v>0?1:0);
          const gb=Anim.H.el("g",{},g); a.label(gb,800,70,q[2],{size:42,stroke:q[4],color:C.ink,fill:"#fff",sw:4}); a.op(gb,s(t,T0,T0+.03)*(i===3?1:1-s(t,T0+.22,T0+.25))); }
        if(rev>0){ const gd=Anim.H.el("g",{},g); const dd=dot(gd,p[0],p[1],11,q[4]); const gc=Anim.H.el("g",{},gd); const lb=a.label(gc,0,0,q[3],{size:26,stroke:q[4],color:C.ink,fill:"#fff"}); const by=(q[0]>55||i===3)?p[1]-64:p[1]-60; const bxx=Math.max(MAP.x+lb._w/2+8,Math.min(MAP.x+MAP.w-lb._w/2-8,p[0])); gc.setAttribute("transform",`translate(${bxx},${by})`); a.op(gd,rev); } }); } },
  { titre:"À toi de chercher", duree:5000,
    legende:"À toi ! Déplace les curseurs pour faire bouger le repère. Trouve Tokyo, New York… puis un point où il n'y a aucune ville.",
    voix:"À toi de jouer ! Avec les deux curseurs, déplace le repère sur la carte : un pour la latitude, un pour la longitude. Essaie de trouver Tokyo, puis New York. Puis cherche un point où il n'y a aucune ville : tu verras que les deux nombres fonctionnent partout.",
    anim(t,a){ const s=a.seg; r.hd.textContent=""; a.op(r.globe,0); a.op(r.map,1); setView(1,0,0); a.op(r.mLand,1); a.op(r.mLandEU,0); a.op(r.fine,0);
      r.gridV.forEach(e=>a.op(e,1)); r.gridH.forEach(e=>a.op(e,1)); a.op(r.gEq,1); a.op(r.gGW,1); mapTicks(a,30,1);
      r.cLabs.forEach(g=>{ while(g.firstChild) g.removeChild(g.firstChild); a.op(g,0); });
      a.op(r.cur,s(t,0,.3)); a.op(r.cH,1); a.op(r.cV,1); a.op(r.cP,1);
      const p=[mx(mp.lon),my(mp.lat)]; a.set(r.cH,{x1:MAP.x,y1:p[1],x2:p[0],y2:p[1]}); a.set(r.cV,{x1:p[0],y1:MAP.y+MAP.h,x2:p[0],y2:p[1]}); r.cP.setAttribute("transform",`translate(${p[0]},${p[1]})`); r.cPc.setAttribute("r",14);
      const g0=r.cLabs[0]; a.op(g0,1); a.label(Anim.H.el("g",{},g0),800,70,fmtLat(mp.lat)+",  "+fmtLon(mp.lon),{size:42,stroke:C.or,color:C.ink,fill:"#fff",sw:4});
      let best=null,bd=1e9; PLACES.forEach(q=>{ const dd=Math.hypot(q[1]-mp.lat,(q[2]-mp.lon)*Math.cos(q[1]*D2R)); if(dd<bd){bd=dd;best=q;} });
      const g1=r.cLabs[1]; a.op(g1,1); const near=bd<4; const txt=near?"Tu es près de "+best[0]+" !":"Ici : pas de grande ville… mais les coordonnées marchent !";
      const lb=a.label(Anim.H.el("g",{},g1),0,0,txt,{size:26,stroke:near?C.green:C.ink2,color:C.ink,fill:near?"#E8F6EE":"#fff"}); const bx=Math.max(MAP.x+lb._w/2+8,Math.min(MAP.x+MAP.w-lb._w/2-8,p[0])); const by=p[1]<MAP.y+100?p[1]+60:p[1]-56; lb.setAttribute("transform",`translate(${bx},${by})`); } },
  { titre:"Synthèse", duree:10000,
    legende:"Latitude (nord/sud) + longitude (est/ouest) : deux nombres suffisent à situer n'importe quel point de la Terre.",
    voix:"Pour retenir : la latitude dit si l'on est plus ou moins au nord ou au sud de l'équateur. La longitude dit si l'on est plus ou moins à l'est ou à l'ouest de Greenwich. Deux nombres suffisent pour situer n'importe quel point de la Terre, même quand il n'y a ni ville ni nom.",
    anim(t,a){ const s=a.seg; r.hd.textContent=""; a.op(r.map,1-s(t,0,.1)); a.op(r.cur,1-s(t,0,.1)); a.op(r.synth,s(t,0,.1)); r.cards.forEach((c,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(c,v); a.tr(c,0,(1-v)*40); }); a.op(r.myth,s(t,.65,.8)); a.cls(r.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
function lerp3(a,b,t){ return a+(b-a)*t; }
function mapTicks(a,step,o,fine){
  const items=[]; // longitudes en haut, latitudes à gauche
  r.mTop.forEach(t=>t.style.display="none"); r.mLeft.forEach(t=>t.style.display="none");
  if(o<=0.01) return; a.op(r.ml,1); let i=0,j=0;
  for(let lo=-180;lo<=180;lo+=step){ const x=MS(lo,0)[0]; if(x<MAP.x+14||x>MAP.x+MAP.w-14) continue; if(i>=r.mTop.length) break; const tx=r.mTop[i++]; tx.style.display=""; tx.setAttribute("x",x); tx.setAttribute("y",MAP.y+MAP.h-8); tx.setAttribute("opacity",o); tx.setAttribute("font-size",22); tx.textContent=lo===0?"0°":Math.abs(lo)+"° "+(lo<0?"O":"E"); }
  for(let la=-90;la<=90;la+=step){ const y=MS(0,la)[1]; if(y<MAP.y+16||y>MAP.y+MAP.h-16) continue; if(j>=r.mLeft.length) break; const tx=r.mLeft[j++]; tx.style.display=""; tx.setAttribute("x",MAP.x+84); tx.setAttribute("y",y-5); tx.setAttribute("opacity",o); tx.setAttribute("text-anchor","end"); tx.textContent=la===0?"0°":Math.abs(la)+"° "+(la<0?"S":"N"); }
}
function latlonBadges(a,p,h,v){
  const g1=r.cLabs[1], g2=r.cLabs[2]; while(g1.firstChild) g1.removeChild(g1.firstChild); while(g2.firstChild) g2.removeChild(g2.firstChild);
  const b1=Anim.H.el("g",{},g1); a.label(b1,MAP.x+96,p[1],"47° N",{size:28,stroke:C.or,color:C.or,fill:"#fff"}); a.op(g1,h);
  const b2=Anim.H.el("g",{},g2); a.label(b2,p[0],MAP.y+MAP.h-44,"5° E",{size:28,stroke:C.or,color:C.or,fill:"#fff"}); a.op(g2,v); }
})();
