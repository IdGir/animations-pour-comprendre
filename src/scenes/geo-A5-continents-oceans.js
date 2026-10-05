/* META {"id":"geo-A5-continents-oceans","matiere":"geographie","annee":"A","periode":1,"theme":"Se déplacer / se repérer dans l'espace","resume":"La Terre est couverte à 71 % d'eau : on y repère les 6 continents (7 selon les pays) et les 5 océans, on découvre où vivent les humains et où se trouvent la France et ses départements d'outre-mer.","motsCles":["continents","océans","71 % d'eau","population","DROM","planisphère"]} */
//@data n4cont
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

const CONT=N4CONT.cont;
const KEYS=["Europe","Asie","Afrique","Amérique du Nord","Amérique du Sud","Océanie","Antarctique"];
const COL={"Europe":"#5B8FD0","Asie":"#E9B949","Afrique":"#7DB85A","Amérique du Nord":"#E1785A","Amérique du Sud":"#E1785A","Océanie":"#B084CC","Antarctique":"#F4F7FA"};
const COL7S="#B9452B";
const GRP={"Europe":["Europe"],"Asie":["Asie"],"Afrique":["Afrique"],"Amérique":["Amérique du Nord","Amérique du Sud"],"Océanie":["Océanie"],"Antarctique":["Antarctique"]};
/* fiches (arrondis ; superficies : Wikipédia ; population 2025 : ONU, révision 2024 via INED) */
const FICHE={"Europe":{aire:"≈ 10 millions de km²",pop:"≈ 744 millions",part:"9 %",terre:6.7,hum:9.0,col:"#5B8FD0"},"Asie":{aire:"≈ 44,6 millions de km²",pop:"≈ 4,8 milliards",part:"59 %",terre:29.8,hum:58.7,col:"#C9971C"},"Afrique":{aire:"≈ 30,4 millions de km²",pop:"≈ 1,55 milliard",part:"19 %",terre:20.3,hum:18.8,col:"#4E8E2F"},"Amérique":{aire:"≈ 42 millions de km²",pop:"≈ 1,05 milliard",part:"13 %",terre:28.1,hum:12.8,col:"#C0482A"},"Océanie":{aire:"≈ 8,5 millions de km²",pop:"≈ 47 millions",part:"0,6 %",terre:5.7,hum:0.6,col:"#8A5BAA"},"Antarctique":{aire:"≈ 14 millions de km²",pop:"aucun habitant permanent",part:"0 %",terre:9.5,hum:0,col:"#6F8499"}};
const MR={R:186,cx:560,cy:478};
const MP=(lon,lat)=>mollweide(lon,lat,MR.R,MR.cx,MR.cy,0);
const G={cx:520,cy:480,R:300};
let sel=null; let r={};
function ellipsePath(){ let d=""; for(let k=0;k<=120;k++){ const lat=90-180*k/120; const q=MP(-180,lat); d+=(k?"L":"M")+f1(q[0])+" "+f1(q[1]); } for(let k=120;k>=0;k--){ const lat=90-180*k/120; const q=MP(180,lat); d+="L"+f1(q[0])+" "+f1(q[1]); } return d+"Z"; }
const OCE={
 "Atlantique":[[-67,-60],[20,-60],[20,30],[42,30],[42,47],[30,47],[30,66],[-100,66],[-100,22],[-96,17],[-90,14.8],[-80,9],[-76,2],[-72,-8],[-67,-20],[-69,-35],[-68,-52],[-67,-56]],
 "Indien":[[20,-60],[147,-60],[147,-25],[142,-11],[125,-9],[115,-8.5],[105,-6],[102,0],[101,3],[98,8],[98,16],[92,22],[92,30],[33,30],[20,30]],
 "Arctique":[[-180,66],[180,66],[180,90],[-180,90]],
 "Austral":[[-180,-60],[180,-60],[180,-90],[-180,-90]]};
const OCOL={"Pacifique":"#B7D5F0","Atlantique":"#BFE3D6","Indien":"#D6CCEF","Arctique":"#DDEFF8","Austral":"#C3D1E6"};
const OLAB={"Pacifique":[-150,-8,"Océan\nPacifique"],"Atlantique":[-33,12,"Océan\nAtlantique"],"Indien":[78,-22,"Océan\nIndien"]};
function mkPath(rs){ return flatPath(densify(rs,3),MP); }
function bar(parent,x,y,w,h,col){ return Anim.H.el("rect",{x,y,width:Math.max(0,w),height:h,rx:5,fill:col},parent); }
Anim.run({
  titre:"Continents et océans : où vit-on sur la Terre ?",
  sousTitre:"Géographie · CM1-CM2 · Se repérer dans l'espace",
  matiere:"geographie", badge:"Géographie",
  accroche:"La Terre est-elle surtout faite de terres ou d'eau ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a; const defs=el("defs",{},a.svg);
    r.hd=T(a.layer("hd"),800,64,"",{size:38,color:C.teal,halo:false});
    // ----- globe
    const gl=a.layer("globe"); r.globe=gl; const LANDALL=decode(Object.values(CONT).flat()); r.landAll=LANDALL;
    const cp=el("clipPath",{id:"g5clip"},defs); el("circle",{cx:G.cx,cy:G.cy,r:G.R},cp);
    el("circle",{cx:G.cx,cy:G.cy,r:G.R+8,fill:"#E8F1F7"},gl); el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:"#3E8FD0",stroke:"#2A6FA8","stroke-width":3},gl);
    const gi=el("g",{"clip-path":"url(#g5clip)"},gl); r.gLand=el("path",{d:"",fill:"#D9C896",stroke:"#A8975F","stroke-width":1.2,"fill-rule":"evenodd"},gi);
    el("circle",{cx:G.cx,cy:G.cy,r:G.R,fill:"none",stroke:"#2A6FA8","stroke-width":4},gl);
    r.gT=T(gl,G.cx,G.cy+G.R+54,"Vue de l'espace : surtout du bleu !",{size:28,color:"#2A6FA8",halo:false});
    // ----- grille 71/29
    const gr=a.layer("grid"); r.grid=gr; const CS=46,GP=5,GX=130,GY=150;
    r.cells=[]; for(let i=0;i<100;i++){ const c=el("rect",{x:GX+(i%10)*(CS+GP),y:GY+Math.floor(i/10)*(CS+GP),width:CS,height:CS,rx:6,fill:i<29?"#D9C896":"#3E8FD0",stroke:i<29?"#A8975F":"#2A6FA8","stroke-width":2},gr); r.cells.push(c); }
    T(gr,GX+255,GY+532,"Chaque case = 1 % de la surface de la Terre",{size:24,color:C.ink2,halo:false});
    r.n71=el("g",{},gr); T(r.n71,1040,300,"71 %",{size:120,color:"#2A6FA8",halo:false}); T(r.n71,1040,360,"d'eau (les océans)",{size:34,color:"#2A6FA8",halo:false}); T(r.n71,1040,408,"≈ 361 millions de km²",{size:30,color:C.ink,weight:600,halo:false});
    r.n29=el("g",{},gr); T(r.n29,1040,560,"29 %",{size:120,color:"#8A7440",halo:false}); T(r.n29,1040,620,"de terres",{size:34,color:"#8A7440",halo:false}); T(r.n29,1040,668,"(continents et îles) ≈ 149 millions de km²",{size:26,color:C.ink,weight:600,halo:false});
    // ----- carte Mollweide
    const mp=a.layer("map"); r.map=mp;
    const cm=el("clipPath",{id:"m5clip"},defs); el("path",{d:ellipsePath()},cm);
    r.sea=el("path",{d:ellipsePath(),fill:OCOL.Pacifique,stroke:"#5D7C94","stroke-width":3},mp);
    const mi=el("g",{"clip-path":"url(#m5clip)"},mp);
    r.oc={}; Object.keys(OCE).forEach(k=>{ r.oc[k]=el("path",{d:mkPath([polyRing(OCE[k])]),fill:OCOL[k],stroke:"#fff","stroke-width":2,"stroke-dasharray":"8 6"},mi); });
    r.co={}; KEYS.forEach(k=>{ const p=el("path",{d:mkPath(decode(CONT[k])),fill:COL[k],stroke:k==="Antarctique"?"#8FA0B3":"#fff","stroke-width":1.6,"stroke-linejoin":"round","fill-rule":"evenodd",style:"cursor:pointer"},mi); r.co[k]=p; p.addEventListener("click",()=>{ if(a.step()===4){ sel=k.startsWith("Amérique")?"Amérique":k; refreshBtn(); a.redraw(); } }); });
    el("path",{d:ellipsePath(),fill:"none",stroke:"#5D7C94","stroke-width":3},mp);
    // étiquettes
    r.lab={}; const LP={"Europe":[16,53,"Europe"],"Asie":[95,48,"Asie"],"Afrique":[20,5,"Afrique"],"AmN":[-100,42,"Amérique"],"AmS":[-60,-14,"Amérique"],"Océanie":[135,-26,"Océanie"],"Antarctique":[0,-80,"Antarctique"]};
    Object.keys(LP).forEach(k=>{ const q=MP(LP[k][0],LP[k][1]); r.lab[k]=T(mp,q[0],q[1]+8,LP[k][2],{size:24,color:C.ink,sw:5}); });
    r.labN=T(mp,MP(-100,42)[0],MP(-100,42)[1]+8,"Amérique du Nord",{size:22,color:C.ink,sw:5}); r.labS=T(mp,MP(-60,-14)[0],MP(-60,-14)[1]+8,"Amérique du Sud",{size:22,color:C.ink,sw:5});
    r.olab={}; Object.keys(OLAB).forEach(k=>{ const q=MP(OLAB[k][0],OLAB[k][1]); r.olab[k]=T(mp,q[0],q[1],OLAB[k][2],{size:26,color:"#1F4F7A",weight:800,lh:1.1,sw:5}); });
    { const q=MP(160,8); r.olab.Pacifique2=T(mp,q[0],q[1],"Océan\nPacifique",{size:26,color:"#1F4F7A",weight:800,lh:1.1,sw:5}); }
    { const q=MP(0,60); r.olab.Arctique=T(mp,MR.cx,MR.cy-MR.R*1.414-22,"Océan Arctique",{size:26,color:"#1F4F7A",weight:800,sw:5}); r.olab.Austral=T(mp,MR.cx,MR.cy+MR.R*1.414+34,"Océan Austral",{size:26,color:"#1F4F7A",weight:800,sw:5}); }
    r.noteA=el("g",{},mp); r.noteB=el("g",{},mp);
    a.label(r.noteA,560,792,"En France, on compte 6 continents (l'Amérique est un seul continent)",{size:27,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    a.label(r.noteB,560,850,"Dans d'autres pays, on en compte 7 : Amérique du Nord et du Sud séparées",{size:25,stroke:C.or,color:C.ink,fill:"#FFF6EA"});
    r.noteO=el("g",{},mp); a.label(r.noteO,560,836,"Les limites entre les océans sont approximatives",{size:26,stroke:C.ink2,color:C.ink,fill:"#fff"});
    // ----- fiche (colonne droite)
    const fi=a.layer("fiche"); r.fiche=fi; el("rect",{x:1130,y:150,width:450,height:560,rx:16,fill:"#fff",stroke:C.teal,"stroke-width":4},fi);
    r.fN=T(fi,1355,215,"",{size:40,color:C.teal,halo:false}); r.fA=T(fi,1155,300,"",{size:26,anchor:"start",halo:false,weight:600}); r.fA2=T(fi,1155,340,"",{size:34,anchor:"start",halo:false,weight:800});
    r.fP=T(fi,1155,420,"",{size:26,anchor:"start",halo:false,weight:600}); r.fP2=T(fi,1155,460,"",{size:34,anchor:"start",halo:false,weight:800}); r.fH=T(fi,1155,520,"",{size:28,anchor:"start",halo:false,weight:700,color:C.or});
    r.fB1=el("g",{},fi); r.fB2=el("g",{},fi);
    r.fHint=T(fi,1355,430,"Clique sur un continent\n(sur la carte ou en bas)",{size:30,color:C.ink2,halo:false,lh:1.3});
    // ----- barres : où vivent les humains
    const bs=a.layer("bars"); r.bars=bs; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},bs);
    const names=["Asie","Afrique","Amérique","Europe","Océanie","Antarctique"]; r.bn=names;
    el("rect",{x:470,y:122,width:26,height:26,rx:5,fill:"#7B93A8"},bs); T(bs,508,144,"part des terres émergées",{size:26,anchor:"start",halo:false}); el("rect",{x:900,y:122,width:26,height:26,rx:5,fill:C.or},bs); T(bs,938,144,"part des habitants (2025)",{size:26,anchor:"start",halo:false});
    r.rows=names.map((n,i)=>{ const g=el("g",{},bs); const y=180+i*106; const f=FICHE[n]; T(g,380,y+52,n,{size:32,color:f.col,anchor:"end",halo:false});
      const b1=bar(g,400,y+4,f.terre*12,36,"#7B93A8"), b2=bar(g,400,y+48,f.hum*12,36,C.or); const t1=T(g,0,y+32,f.terre.toLocaleString("fr-FR")+" %",{size:26,anchor:"start",halo:false,weight:700,color:"#4A5B6C"}); const t2=T(g,0,y+76,n==="Antarctique"?"0 : aucun habitant permanent":(f.hum<1?"0,6":Math.round(f.hum))+" %",{size:26,anchor:"start",halo:false,weight:800,color:"#B35A00"}); return {g,b1,b2,t1,t2,f,y}; });
    r.bT=T(bs,800,850,"Plus de la moitié des humains vivent en Asie.",{size:34,color:C.teal,halo:false});
    // ----- France et DROM
    const fr=a.layer("france"); r.fr=fr;
    const F5=[["France métropolitaine\n(en Europe)",[[2.5,46.5]],[640,205,"start"],C.blue],["Guadeloupe et Martinique\n(Antilles, en Amérique)",[[-61.3,15.5]],[36,250,"start"],C.or],["Guyane\n(en Amérique du Sud)",[[-53,4]],[36,700,"start"],C.or],["La Réunion et Mayotte\n(océan Indien,\nprès de l'Afrique)",[[55.5,-21.1],[45.2,-12.8]],[905,690,"start"],C.or]];
    r.frp=F5.map(([n,pts,lp,col])=>{ const g=el("g",{},fr); const lx=lp[0],ly=lp[1]; pts.forEach(([lo,la])=>{ const q=MP(lo,la); const ax=lp[2]==="start"?lx+((n.length>18)?100:60):lx; el("line",{x1:q[0],y1:q[1],x2:Math.min(ax,Math.max(lx,q[0])),y2:ly+(ly>600?-26:12),stroke:col,"stroke-width":3},g); }); pts.forEach(([lo,la])=>{ const q=MP(lo,la); dot(g,q[0],q[1],col===C.blue?11:9,col); }); T(g,lx,ly,n,{size:24,color:col===C.blue?"#1F4F8F":"#8A4A00",anchor:lp[2],weight:800,lh:1.15}); return g; });
    r.frN=el("g",{},fr); a.label(r.frN,1355,420,"La France est présente\nsur plusieurs continents\net plusieurs océans",{size:30,stroke:C.teal,color:C.ink,fill:"#E8F4F1"});
    // ----- photos
    const lp=a.layer("photos"); r.phNasa=a.photo(lp,{id:"g-a5-terre-espace",x:1130,y:260,w:340,h:340,cap:"La Terre vue de l'espace",rot:-2});
    // ----- synthèse
    const sy=a.layer("synth"); r.synth=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    T(sy,800,76,"À retenir",{size:38,color:C.teal,halo:false});
    r.cards=[["71 % d'eau","29 % de terres :\nla Terre est une planète bleue","#2A6FA8"],["6 continents (7)","et 5 océans :\nPacifique, Atlantique, Indien,\nArctique, Austral","#4E8E2F"],["Plus de la moitié","des humains vivent en Asie ;\naucun ne vit en permanence\nen Antarctique","#C0482A"]].map((c,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:270,rx:18,fill:"#F1F7F5",stroke:c[2],"stroke-width":4},g); T(g,x,190,c[0],{size:36,color:c[2],halo:false}); T(g,x,252,c[1],{size:26,weight:600,halo:false,lh:1.3}); return g; });
    r.myth=a.layer("myth"); a.myth(r.myth,200,440,1200,"La Terre est surtout faite de terres.","La Terre est surtout couverte d'eau : 71 % de sa surface, contre 29 % de terres.");
    // ----- manipulation
    a.manip.innerHTML=`Choisis un continent : `+["Europe","Asie","Afrique","Amérique","Océanie","Antarctique"].map((n,i)=>`<button id="mC${i}">${n}</button>`).join("")+` <span style="font-weight:500;font-size:17px">(ou clique sur la carte)</span>`;
    ["Europe","Asie","Afrique","Amérique","Océanie","Antarctique"].forEach((n,i)=>{ document.getElementById("mC"+i).onclick=()=>{ sel=n; refreshBtn(); a.redraw(); }; });
  },
  reset(a){
    [r.globe,r.grid,r.map,r.fiche,r.bars,r.fr,r.phNasa,r.synth,r.myth,r.noteA,r.noteB,r.noteO,r.n71,r.n29,r.labN,r.labS,...r.frp,r.frN,...r.cards,...Object.values(r.lab),...Object.values(r.olab),...Object.values(r.oc),...Object.values(r.co)].forEach(e=>a.op(e,0));
    r.cells.forEach(c=>{});
    r.hd.textContent=""; a.op(r.sea,1);
    KEYS.forEach(k=>{ r.co[k].setAttribute("fill",COL[k]); r.co[k].setAttribute("stroke-width",1.6); r.co[k].setAttribute("stroke",k==="Antarctique"?"#8FA0B3":"#fff"); });
  },
  etapes:[
  { titre:"Une planète bleue", duree:10000,
    legende:"Vue de l'espace, la Terre est surtout bleue. Ce bleu, c'est l'eau des océans. Les terres sont les taches de couleur sable.",
    voix:"Regarde la Terre vue de l'espace, comme si tu étais dans une fusée. Elle tourne doucement. Qu'est-ce que tu vois le plus ? Du bleu ! Ce bleu, c'est l'eau des océans. Les terres, de couleur sable, ne sont que des îlots au milieu de cette immensité d'eau. On appelle la Terre la planète bleue.",
    anim(t,a){ const s=a.seg; r.hd.textContent="La planète bleue"; a.op(r.globe,s(t,0,.1)); const lon0=lerp5(175,20,s(t,.05,.95,true)); r.gLand.setAttribute("d",orthoPath(r.landAll,lon0,18,G.R,G.cx,G.cy)); a.op(r.phNasa,s(t,.3,.5)); } },
  { titre:"71 % d'eau, 29 % de terres", duree:12000,
    legende:"Si on découpe la surface de la Terre en 100 cases, il y en a 71 d'eau et 29 de terres. La Terre est surtout couverte d'eau.",
    voix:"Imaginons la surface de la Terre découpée en cent cases égales. Vingt-neuf cases sont des terres : les continents et les îles. Soixante et onze cases sont de l'eau : les océans. Donc la Terre est surtout couverte d'eau : environ soixante et onze pour cent.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Combien d'eau, combien de terres ?"; a.op(r.globe,1-s(t,0,.1)); a.op(r.phNasa,0); a.op(r.grid,s(t,0,.08));
      r.cells.forEach((c,i)=>{ const land=i<29; const st=land?.12+i*.008:.4+(i-29)*.0075; const v=s(t,st,st+.04); c.setAttribute("opacity",.18+.82*v); });
      a.op(r.n29,s(t,.38,.46)); a.op(r.n71,s(t,.88,.96)); } },
  { titre:"Les continents", duree:16000,
    legende:"Les terres sont réparties en continents. En France, on compte 6 continents : Europe, Asie, Afrique, Amérique, Océanie, Antarctique. Dans d'autres pays, on en compte 7.",
    voix:"Les grandes étendues de terre s'appellent les continents. En France, on en compte six : l'Europe, l'Asie, l'Afrique, l'Amérique, l'Océanie et l'Antarctique. Attention : dans d'autres pays, on compte sept continents, car on sépare l'Amérique du Nord et l'Amérique du Sud.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Les continents"; a.op(r.grid,1-s(t,0,.08)); a.op(r.map,s(t,0,.1)); Object.values(r.oc).forEach(e=>a.op(e,0));
      const order=[["Europe",["Europe"],"Europe"],["Asie",["Asie"],"Asie"],["Afrique",["Afrique"],"Afrique"],["Amérique",["Amérique du Nord","Amérique du Sud"],null],["Océanie",["Océanie"],"Océanie"],["Antarctique",["Antarctique"],"Antarctique"]];
      order.forEach(([n,ks,lab],i)=>{ const v=s(t,.08+i*.1,.16+i*.1); ks.forEach(k=>a.op(r.co[k],v)); if(lab) a.op(r.lab[lab],v); else { a.op(r.lab.AmN,v); a.op(r.lab.AmS,v); } });
      a.op(r.noteA,s(t,.74,.82)); const sp=s(t,.86,.94); a.op(r.noteB,sp); r.co["Amérique du Sud"].setAttribute("fill",mix(COL["Amérique du Nord"],COL7S,sp)); a.op(r.lab.AmN,0); a.op(r.lab.AmS,0);
      a.op(r.labN,Math.max(0,sp)); a.op(r.labS,Math.max(0,sp)); const am=s(t,.34,.42)*(1-sp); a.op(r.lab.AmN,am); a.op(r.lab.AmS,am); } },
  { titre:"Les océans", duree:14000,
    legende:"Entre les continents, il y a cinq océans : le Pacifique (le plus grand), l'Atlantique, l'Indien, l'Arctique au nord et l'Austral autour de l'Antarctique.",
    voix:"Entre les continents, il y a l'eau salée des océans. On en compte cinq : le Pacifique, le plus grand ; l'Atlantique ; l'océan Indien ; l'océan Arctique, tout en haut autour du pôle Nord ; et l'océan Austral, tout en bas autour de l'Antarctique. Les limites entre les océans ne sont pas des lignes tracées sur l'eau : elles sont approximatives.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Les cinq océans"; a.op(r.grid,0); a.op(r.map,1); r.co["Amérique du Sud"].setAttribute("fill",COL["Amérique du Nord"]);
      a.op(r.noteA,0); a.op(r.noteB,0); Object.values(r.lab).forEach(e=>a.op(e,0)); a.op(r.labN,0); a.op(r.labS,0);
      KEYS.forEach(k=>{ a.op(r.co[k],1); r.co[k].setAttribute("fill",mix(COL[k],"#E9E3D0",s(t,0,.1))); r.co[k].setAttribute("stroke","#B9AF8F"); });
      const O=["Pacifique","Atlantique","Indien","Arctique","Austral"]; O.forEach((o,i)=>{ const v=s(t,.08+i*.15,.18+i*.15); if(o!=="Pacifique") a.op(r.oc[o],v); a.op(r.olab[o],v); if(o==="Pacifique") a.op(r.olab.Pacifique2,v); }); a.op(r.noteO,s(t,.86,.94)); a.op(r.sea,1); r.sea.setAttribute("fill",OCOL.Pacifique); } },
  { titre:"À toi : choisis un continent", duree:4000,
    legende:"À toi ! Clique sur un continent (sur la carte ou avec les boutons) : sa fiche s'affiche avec sa superficie et son nombre d'habitants.",
    voix:"À toi de jouer ! Clique sur un continent, directement sur la carte ou avec les boutons du bas. Sa fiche apparaît : sa superficie, le nombre d'habitants, et la part de l'humanité qui y vit. Compare les continents entre eux : lequel est le plus peuplé ? Lequel n'a aucun habitant permanent ?",
    anim(t,a){ const s=a.seg; r.hd.textContent="Fiche d'identité d'un continent"; a.op(r.grid,0); a.op(r.map,1); a.op(r.noteO,0); Object.values(r.oc).forEach(e=>a.op(e,0)); Object.values(r.olab).forEach(e=>a.op(e,0)); a.op(r.sea,1); r.sea.setAttribute("fill","#DCEBF5");
      Object.values(r.lab).forEach(e=>a.op(e,0)); a.op(r.labN,0); a.op(r.labS,0); r.co["Amérique du Sud"].setAttribute("fill",COL["Amérique du Nord"]);
      KEYS.forEach(k=>{ const g=k.startsWith("Amérique")?"Amérique":k; const on=(sel===g); a.op(r.co[k],sel===null?1:(on?1:.4)); r.co[k].setAttribute("stroke",on?C.ink:"#fff"); r.co[k].setAttribute("stroke-width",on?4:1.6); });
      a.op(r.fiche,s(t,0,.2)); fillFiche(a); } },
  { titre:"Où vivent les humains ?", duree:14000,
    legende:"Les humains ne sont pas répartis comme les terres : plus de la moitié vit en Asie. L'Antarctique est le seul continent sans habitant permanent.",
    voix:"Où vivent les huit milliards d'humains ? Pas comme les terres ! L'Asie ne représente qu'un peu moins d'un tiers des terres, mais elle réunit plus de la moitié de l'humanité. L'Amérique couvre presque autant de terres que l'Asie, mais elle a quatre fois moins d'habitants. Et l'Antarctique n'a aucun habitant permanent, seulement des scientifiques de passage.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Terres et habitants : deux répartitions différentes"; a.op(r.map,1-s(t,0,.1)); a.op(r.fiche,1-s(t,0,.1)); a.op(r.bars,s(t,0,.1)); 
      r.rows.forEach((o,i)=>{ const v1=s(t,.1+i*.1,.25+i*.1), v2=s(t,.15+i*.1,.3+i*.1); a.set(o.b1,{width:Math.max(0,o.f.terre*12*v1)}); a.set(o.b2,{width:Math.max(0,o.f.hum*12*v2)}); o.t1.setAttribute("x",400+o.f.terre*12*v1+14); o.t2.setAttribute("x",400+o.f.hum*12*v2+14); a.op(o.t1,v1); a.op(o.t2,v2); }); a.op(r.bT,s(t,.8,.92)); } },
  { titre:"Et la France ?", duree:14000,
    legende:"La France métropolitaine est en Europe. Mais ses départements d'outre-mer sont ailleurs : Antilles et Guyane en Amérique, La Réunion et Mayotte près de l'Afrique.",
    voix:"Et la France ? La France métropolitaine, celle de Dijon, est en Europe. Mais la France a aussi des départements d'outre-mer, très loin d'ici. La Guadeloupe et la Martinique, aux Antilles, et la Guyane sont en Amérique. La Réunion et Mayotte sont dans l'océan Indien, près de l'Afrique. La France est donc présente sur plusieurs continents et plusieurs océans.",
    anim(t,a){ const s=a.seg; r.hd.textContent="Où se trouve la France ?"; a.op(r.bars,0); a.op(r.fiche,0); a.op(r.map,1); Object.values(r.oc).forEach(e=>a.op(e,0)); Object.values(r.olab).forEach(e=>a.op(e,0)); r.sea.setAttribute("fill","#DCEBF5"); r.co["Amérique du Sud"].setAttribute("fill",COL["Amérique du Nord"]); Object.values(r.lab).forEach(e=>a.op(e,0)); a.op(r.labN,0); a.op(r.labS,0);
      KEYS.forEach(k=>{ a.op(r.co[k],1); r.co[k].setAttribute("fill","#E9E3D0"); r.co[k].setAttribute("stroke","#B9AF8F"); }); a.op(r.noteO,0); r.frp.forEach((g,i)=>a.op(g,s(t,.1+i*.17,.24+i*.17))); a.op(r.fr,1); a.op(r.frN,s(t,.82,.94)); } },
  { titre:"Synthèse", duree:11000,
    legende:"La Terre est surtout couverte d'eau (71 %). On y compte 6 continents (7 selon les pays) et 5 océans. Plus de la moitié des humains vivent en Asie.",
    voix:"Pour retenir : la Terre est surtout couverte d'eau, soixante et onze pour cent. On y repère six continents, ou sept selon les pays, et cinq océans. Et plus de la moitié des humains vivent en Asie.",
    anim(t,a){ const s=a.seg; r.hd.textContent=""; a.op(r.map,1-s(t,0,.1)); a.op(r.fr,1-s(t,0,.1)); a.op(r.synth,s(t,0,.1)); r.cards.forEach((c,i)=>{ const v=s(t,.1+i*.12,.22+i*.12); a.op(c,v); a.tr(c,0,(1-v)*40); }); a.op(r.myth,s(t,.6,.78)); a.cls(r.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
function lerp5(a,b,t){ return a+(b-a)*t; }
function mix(c1,c2,t){ const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)); const a=p(c1),b=p(c2); return "#"+a.map((v,i)=>Math.round(v+(b[i]-v)*t).toString(16).padStart(2,"0")).join(""); }
function refreshBtn(){ ["Europe","Asie","Afrique","Amérique","Océanie","Antarctique"].forEach((n,i)=>{ const b=document.getElementById("mC"+i); if(b) b.classList.toggle("sel",sel===n); }); }
function fillFiche(a){ const f=sel?FICHE[sel]:null; a.op(r.fHint,f?0:1);
  [r.fN,r.fA,r.fA2,r.fP,r.fP2,r.fH].forEach(e=>a.op(e,f?1:0)); a.op(r.fB1,f?1:0); a.op(r.fB2,f?1:0);
  if(!f) return; r.fN.textContent=sel; r.fN.setAttribute("fill",f.col); r.fA.textContent="Superficie"; r.fA2.textContent=f.aire; r.fP.textContent="Habitants (2025)"; r.fP2.textContent=f.pop; r.fH.textContent=sel==="Antarctique"?"Seulement des scientifiques de passage":"= "+f.part+" de l'humanité";
  [[r.fB1,f.terre,"#7B93A8","des terres",560],[r.fB2,f.hum,C.or,"des humains",620]].forEach(([g,v,col,lab,y])=>{ while(g.firstChild) g.removeChild(g.firstChild); const x=1155; Anim.H.el("rect",{x,y:y-8,width:400,height:26,rx:6,fill:"#EEF1F5"},g); Anim.H.el("rect",{x,y:y-8,width:Math.max(0,v/60*400),height:26,rx:6,fill:col},g); T(g,x,y+44,(String(v).replace(".",","))+" % "+lab,{size:24,anchor:"start",halo:false,weight:700,color:C.ink2}); });
}
})();
