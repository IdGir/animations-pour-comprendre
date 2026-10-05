/* META {"id":"sciences-E2-saisons-inclinaison","matiere":"sciences","annee":"B","periode":1,"theme":"La Terre dans l'espace : les saisons, l'axe incliné de la Terre","resume":"La Terre tourne autour du Soleil en 1 an, axe incliné d'environ 23,4° : hauteur du Soleil à midi à Dijon (19°, 43°, 66°), rayons plus ou moins étalés, durée du jour ; ce n'est pas la distance au Soleil qui fait les saisons.","motsCles":["saisons","inclinaison","axe de la Terre","solstice","équinoxe","hauteur du Soleil","durée du jour","orbite"]} */
(function(){
const R={}; let manActive=false, manDoy=172;
const C={sun:"#F5B82E",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B",oc:"#4A90D9",hiv:"#2563A8",ete:"#D9631E"};
const EPS=23.44*Math.PI/180, LAT=47.32*Math.PI/180;
const rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const dateStr=doy=>{ const d=new Date(2026,0,Math.round(doy)); return d.getDate()+(d.getDate()===1?"er":"")+" "+MOIS[d.getMonth()]; };
const f1=v=>v.toFixed(1).replace(".",",");
// hauteur du Soleil à midi à Dijon : 90° - latitude + déclinaison
const ALT={hiv:deg(Math.PI/2-LAT-EPS), eq:deg(Math.PI/2-LAT), ete:deg(Math.PI/2-LAT+EPS)};   // 19,2 ; 42,7 ; 66,1
const ORB={cx:800,cy:520,rx:600,ry:220};
const orbPos=th=>[ORB.cx+ORB.rx*Math.cos(th),ORB.cy-ORB.ry*Math.sin(th)];
const MO={cx:440,cy:340,rx:330,ry:110}, mOrb=th=>[MO.cx+MO.rx*Math.cos(th),MO.cy-MO.ry*Math.sin(th)];
const MB={x0:100,w:1400,y:792,h:40}, mbx=d=>MB.x0+MB.w*(d-1)/365;
const MJ=[31,28,31,30,31,30,31,31,30,31,30,31], MN=["janv.","févr.","mars","avril","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const SAIS=[[1,79,"hiver",C.hiv,"#BFD6F2"],[79,172,"printemps",C.gr,"#BFE3C8"],[172,266,"été",C.ete,"#F8CFA3"],[266,355,"automne","#8A5A1E","#E6CFA8"],[355,366,"hiver",C.hiv,"#BFD6F2"]];
const seasonOf=n=>n<79||n>=355?0:n<172?1:n<266?2:3;
/* déclinaison du Soleil (formule usuelle, précision ≈ 0,2°), hauteur à midi et durée du jour à Dijon */
function astro(N){ const dec=-Math.asin(0.39779*Math.cos(rad(0.98565*(N+10)+1.914*Math.sin(rad(0.98565*(N-2))))));
  const alt=deg(Math.PI/2-LAT+dec); const cH=(Math.sin(rad(-0.833))-Math.sin(LAT)*Math.sin(dec))/(Math.cos(LAT)*Math.cos(dec)); const H=Math.acos(Math.max(-1,Math.min(1,cH)));
  const mins=Math.round(2*deg(H)/15*60); return {dec,alt,mins}; }

function smallGlobe(a,p,r){ const g=a.el("g",{},p); const L=r*1.7, dx=-Math.sin(EPS)*L, dy=-Math.cos(EPS)*L;
  a.el("line",{x1:-dx,y1:-dy,x2:dx,y2:dy,stroke:"#1E2430","stroke-width":4,"stroke-linecap":"round"},g);
  a.el("circle",{r,fill:C.oc,stroke:"#1E4F8A","stroke-width":3},g);
  a.el("ellipse",{rx:r,ry:r*.28,fill:"none",stroke:"#fff","stroke-width":2,"stroke-opacity":.7,transform:`rotate(${-23.44+0})`},g);
  a.el("circle",{cx:dx,cy:dy,r:7,fill:C.red,stroke:"#fff","stroke-width":2},g); return g; }
/* globe vu par la tranche : dec=true -> décembre (Soleil à droite), sinon juin (Soleil à gauche) */
function solGlobe(a,p,cx,cy,Rg,dec){
  const g=a.el("g",{},p), el=a.el, sg=dec?1:-1; // sg : côté du Soleil
  const s=[sg,0], ax=[-Math.sin(EPS),Math.cos(EPS)];
  const sa=s[0]*ax[0]+s[1]*ax[1]; let m=[s[0]-sa*ax[0],s[1]-sa*ax[1]]; const mm=Math.hypot(m[0],m[1]); m=[m[0]/mm,m[1]/mm];
  const n=[Math.cos(LAT)*m[0]+Math.sin(LAT)*ax[0], Math.cos(LAT)*m[1]+Math.sin(LAT)*ax[1]];
  const P=(v,k)=>[cx+Rg*k*v[0],cy-Rg*k*v[1]];
  el("circle",{cx,cy,r:Rg,fill:C.oc},g);
  el("path",{d:`M${cx},${cy-Rg} A${Rg},${Rg} 0 0 ${dec?0:1} ${cx},${cy+Rg} Z`,fill:"#0B1433","fill-opacity":.6},g);
  el("circle",{cx,cy,r:Rg,fill:"none",stroke:"#1E4F8A","stroke-width":4},g);
  // équateur et parallèle de Dijon (vus par la tranche : des droites)
  const eq=[Math.cos(EPS),Math.sin(EPS)]; el("line",{x1:cx-Rg*eq[0],y1:cy+Rg*eq[1],x2:cx+Rg*eq[0],y2:cy-Rg*eq[1],stroke:"#fff","stroke-width":3,"stroke-opacity":.8},g);
  const ch=Rg*Math.cos(LAT), cc=[cx+Rg*Math.sin(LAT)*ax[0],cy-Rg*Math.sin(LAT)*ax[1]]; el("line",{x1:cc[0]-ch*eq[0],y1:cc[1]+ch*eq[1],x2:cc[0]+ch*eq[0],y2:cc[1]-ch*eq[1],stroke:"#fff","stroke-width":2.5,"stroke-dasharray":"8 6","stroke-opacity":.8},g);
  // axe
  const A1=P(ax,1.35), A2=P(ax,-1.35); el("line",{x1:A2[0],y1:A2[1],x2:A1[0],y2:A1[1],stroke:"#1E2430","stroke-width":5,"stroke-linecap":"round"},g);
  el("circle",{cx:A1[0],cy:A1[1],r:10,fill:C.red,stroke:"#fff","stroke-width":2},g); g.N=A1; g.S=A2;
  // Dijon et rayon
  const D=P(n,1); g.D=D; g.n=n; g.s=s;
  const sn=s[0]*n[0]+s[1]*n[1]; g.alt=deg(Math.asin(sn));
  g.dij=el("g",{},g);
  const tg=[-n[1],n[0]]; el("line",{x1:D[0]-tg[0]*70,y1:D[1]+tg[1]*70,x2:D[0]+tg[0]*70,y2:D[1]-tg[1]*70,stroke:"#8C6A4F","stroke-width":6,"stroke-linecap":"round"},g.dij);
  const th=P(n,1.0); el("line",{x1:D[0],y1:D[1],x2:D[0]+n[0]*40,y2:D[1]-n[1]*40,stroke:C.ink,"stroke-width":5,"stroke-linecap":"round"},g.dij);
  el("circle",{cx:D[0]+n[0]*50,cy:D[1]-n[1]*50,r:11,fill:C.ink},g.dij);
  el("circle",{cx:D[0],cy:D[1],r:8,fill:C.red,stroke:"#fff","stroke-width":2},g.dij);
  // rayon de midi : vient du Soleil, horizontal à l'écran
  const x0=D[0]+sg*Math.min(430,Math.abs(sg>0?1000:600)*0+(dec?cx+430-D[0]:D[0]-(cx-430))); // longueur adaptée plus bas
  g.ray=a.arrow(g.dij,`M${D[0]+sg*300},${D[1]} L${D[0]+sg*14},${D[1]}`,{color:C.or,w:7,head:3});
  // arc d'angle : entre l'horizon (côté Soleil) et le rayon
  const hz=[sn*n[0]*0+(s[0]-sn*n[0]),(s[1]-sn*n[1])]; const hm=Math.hypot(hz[0],hz[1]); const hu=[hz[0]/hm,hz[1]/hm];
  const ar=88, p1=[D[0]+ar*hu[0],D[1]-ar*hu[1]], p2=[D[0]+ar*s[0],D[1]-ar*s[1]];
  // le sens de balayage dépend du côté
  const cross=hu[0]*s[1]-hu[1]*s[0]; // >0 : s est à gauche (anti-horaire en repère haut)
  el("path",{d:`M${p1[0]},${p1[1]} A${ar},${ar} 0 0 ${cross>0?0:1} ${p2[0]},${p2[1]}`,fill:"none",stroke:C.red,"stroke-width":5},g.dij);
  const bis=[hu[0]+s[0],hu[1]+s[1]]; const bm=Math.hypot(bis[0],bis[1]); const lp=[D[0]+150*bis[0]/bm,D[1]-150*bis[1]/bm];
  g.altL=a.label(g.dij,lp[0],lp[1],"",{size:30,w:96,h:46,stroke:C.red,color:C.red}); g.altT=g.altL.lastChild;
  g.altT.textContent=Math.round(g.alt)+"°";
  return g; }

Anim.run({
  titre:"Les saisons : pourquoi l'été est plus chaud",
  sousTitre:"Sciences et technologie · CM1-CM2 · La Terre dans l'espace",
  matiere:"sciences", badge:"Sciences", manipDes:5, manipJusqua:5,
  accroche:"Pourquoi fait-il chaud l'été et froid l'hiver ? La Terre est-elle plus près du Soleil en été ?",
  init(a){
    const {el}=a;
    /* ---------- orbite en perspective (étapes 1 et 2) ---------- */
    const O=a.layer("O"); R.O=O;
    el("ellipse",{cx:ORB.cx,cy:ORB.cy,rx:ORB.rx,ry:ORB.ry,fill:"none",stroke:"#9AA3B2","stroke-width":4,"stroke-dasharray":"14 10"},O);
    el("text",{x:ORB.cx,y:ORB.cy+ORB.ry+128,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468",text:"Orbite de la Terre, dessinée en perspective (elle est presque ronde)"},O);
    el("circle",{cx:ORB.cx,cy:ORB.cy,r:88,fill:C.sun,opacity:.28},O); el("circle",{cx:ORB.cx,cy:ORB.cy,r:62,fill:C.sun,stroke:"#E39A0B","stroke-width":4},O);
    el("text",{x:ORB.cx,y:ORB.cy+112,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#8A5A00",text:"Soleil"},O);
    R.mv=el("g",{},O); smallGlobe(a,R.mv,30);
    R.date=el("g",{},O); R.dateT=el("text",{x:1520,y:100,"text-anchor":"end","font-size":44,"font-weight":800,fill:C.ink},R.date);
    R.dateS=el("text",{x:1520,y:144,"text-anchor":"end","font-size":26,"font-weight":600,fill:"#4A5468"},R.date);
    R.cnt=el("g",{},O); a.label(R.cnt,800,96,"1 tour autour du Soleil = 1 an",{size:30,stroke:C.bl,color:C.bl});
    R.axe1=el("g",{},O); a.label(R.axe1,330,230,"L'axe de la Terre garde\ntoujours la même direction",{size:26,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.four=[[0,"21 juin",-1],[90,"équinoxe d'automne",-1],[180,"21 décembre",-1],[270,"équinoxe de printemps",1]].map(([ang,txt,sg])=>{ const g=el("g",{},O); const [x,y]=orbPos(rad(ang)); const gl=el("g",{transform:`translate(${x},${y})`},g); smallGlobe(a,gl,38);
      const lx=ang===270?x+230:x, ly=ang===270?y+6:y-100; a.label(g,lx,ly,txt,{size:24,stroke:"#7E8AA0",color:C.ink}); return g; });
    R.tiltN=el("g",{},O); a.label(R.tiltN,ORB.cx+ORB.rx-40,ORB.cy+90,"pôle Nord\npenché vers le Soleil",{size:24,stroke:C.ete,color:"#8A3A0E",fill:"#FFF1E6"}); a.label(R.tiltN,ORB.cx-ORB.rx+40,ORB.cy+90,"pôle Nord penché\nà l'opposé du Soleil",{size:24,stroke:C.hiv,color:C.hiv,fill:"#EAF1FC"});
    // encart : l'inclinaison (≈ 23,4°)
    R.inset=el("g",{},O); el("rect",{x:30,y:30,width:400,height:332,rx:16,fill:"#fff",stroke:"#C9CED8","stroke-width":3},R.inset);
    R.insG=el("g",{},R.inset); el("line",{x1:195,y1:55,x2:195,y2:310,stroke:"#9AA3B2","stroke-width":3,"stroke-dasharray":"8 6"},R.inset);
    el("circle",{cx:195,cy:190,r:70,fill:C.oc,stroke:"#1E4F8A","stroke-width":4},R.insG); el("ellipse",{cx:195,cy:190,rx:70,ry:18,fill:"none",stroke:"#fff","stroke-width":3,"stroke-opacity":.8},R.insG);
    R.insAx=el("g",{},R.insG); el("line",{x1:195,y1:60,x2:195,y2:320,stroke:C.ink,"stroke-width":6,"stroke-linecap":"round"},R.insAx); el("circle",{cx:195,cy:60,r:9,fill:C.red,stroke:"#fff","stroke-width":2},R.insAx);
    R.insArc=el("path",{fill:"none",stroke:C.red,"stroke-width":5},R.inset); R.insT=el("text",{x:290,y:96,"font-size":36,"font-weight":800,fill:C.red},R.inset);
    el("text",{x:230,y:350,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Axe incliné d'environ 23,4°"},R.inset);
    /* ---------- les deux solstices vus par la tranche (étape 3) ---------- */
    const G3=a.layer("G3"); R.G3=G3; const GR=145, GY=460, GXL=290, GXR=1310;
    R.rays3=[-130,-90,-45,0,45,90,130].map(dy=>[el("line",{x1:GXL+GR+30,y1:GY+dy,x2:ORB.cx-72,y2:GY+dy,stroke:C.sun,"stroke-width":4,"stroke-dasharray":"16 12","stroke-linecap":"round"},G3), el("line",{x1:ORB.cx+72,y1:GY+dy,x2:GXR-GR-30,y2:GY+dy,stroke:C.sun,"stroke-width":4,"stroke-dasharray":"16 12","stroke-linecap":"round"},G3)]).flat();
    el("circle",{cx:800,cy:GY,r:90,fill:C.sun,opacity:.28},G3); el("circle",{cx:800,cy:GY,r:66,fill:C.sun,stroke:"#E39A0B","stroke-width":4},G3); el("text",{x:800,y:GY+118,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#8A5A00",text:"Soleil"},G3);
    R.gD=solGlobe(a,G3,GXL,GY,GR,true); R.gJ=solGlobe(a,G3,GXR,GY,GR,false);
    R.t3=el("g",{},G3);
    a.label(R.t3,GXL,150,"21 décembre",{size:32,stroke:C.hiv,color:C.hiv,fill:"#EAF1FC"}); a.label(R.t3,GXR,150,"21 juin",{size:32,stroke:C.ete,color:"#8A3A0E",fill:"#FFF1E6"});
    R.hemi=el("g",{},G3);
    [[R.gD,"Nord : HIVER","Sud : ÉTÉ",C.hiv,C.ete],[R.gJ,"Nord : ÉTÉ","Sud : HIVER",C.ete,C.hiv]].forEach(([gg,tn,ts,cn,cs])=>{ a.label(R.hemi,gg.N[0]-6,gg.N[1]-50,tn,{size:26,stroke:cn,color:cn,fill:"#fff"}); a.label(R.hemi,gg.S[0]+6,gg.S[1]+50,ts,{size:26,stroke:cs,color:cs,fill:"#fff"}); });
    R.dijL=el("g",{},G3);
    [R.gD,R.gJ].forEach(gg=>{ const sg=gg.s[0], lx=gg.D[0]+sg*110, ly=gg.D[1]-86; el("line",{x1:lx-sg*28,y1:ly+21,x2:gg.D[0],y2:gg.D[1],stroke:C.red,"stroke-width":3},R.dijL); a.label(R.dijL,lx,ly,"Dijon",{size:26,w:100,h:42,stroke:C.red,color:C.red}); });
    R.h3=[R.gD,R.gJ];
    /* ---------- hauteur du Soleil à midi : 3 jours (étape 4) ---------- */
    const G4=a.layer("G4"); R.G4=G4; const GY4=640;
    R.col=[["hiv","21 décembre","Hiver",C.hiv,270,ALT.hiv],["eq","20 mars ou 23 septembre","Printemps / automne","#4A5468",800,ALT.eq],["ete","21 juin","Été",C.ete,1330,ALT.ete]].map(([k,dt,sn,col,c,alt])=>{
      const g=el("g",{},G4); const bx=c-60;
      el("rect",{x:c-250,y:210,width:500,height:600,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g);
      el("rect",{x:c-250,y:GY4,width:500,height:170,fill:"#DCC9A3"},g); el("line",{x1:c-250,y1:GY4,x2:c+250,y2:GY4,stroke:"#8C6A4F","stroke-width":5},g);
      el("text",{x:c,y:182,"text-anchor":"middle","font-size":34,"font-weight":800,fill:col,text:sn},g);
      el("text",{x:c,y:GY4+44,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:dt},g);
      g.sh=el("line",{x1:bx,y1:GY4,x2:bx+50,y2:GY4,stroke:"#3A3F4B","stroke-width":14,"stroke-linecap":"round","stroke-opacity":.6},g);
      el("line",{x1:bx,y1:GY4,x2:bx,y2:GY4-110,stroke:C.ink,"stroke-width":9,"stroke-linecap":"round"},g);
      g.ray=el("line",{stroke:C.sun,"stroke-width":5,"stroke-dasharray":"10 8"},g); g.ray2=el("line",{stroke:C.sun,"stroke-width":5,"stroke-dasharray":"10 8"},g);
      g.arc=el("path",{fill:"none",stroke:C.red,"stroke-width":5},g);
      g.sun=el("g",{},g); el("circle",{r:42,fill:C.sun,opacity:.3},g.sun); el("circle",{r:28,fill:C.sun,stroke:"#E39A0B","stroke-width":3},g.sun);
      g.alt=el("text",{x:c,y:GY4+92,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.red},g);
      g.omb=el("text",{x:c,y:GY4+134,"text-anchor":"middle","font-size":24,"font-weight":600,fill:C.ink},g);
      g._c=c; g._bx=bx; g._alt=alt; g._k=k; return g; });
    R.t4=el("text",{x:800,y:96,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Hauteur du Soleil à midi, à Dijon"},G4);
    /* ---------- rayons plus ou moins étalés + durée du jour (étape 5) ---------- */
    const G5=a.layer("G5"); R.G5=G5; const GY5=470;
    R.p5=[["ete",420,ALT.ete,"Été : Soleil haut",C.ete,"jour de 16 h",16],["hiv",1180,ALT.hiv,"Hiver : Soleil bas",C.hiv,"jour de 8 h 30",8.5]].map(([k,c,alt,tt,col,jt,hrs])=>{
      const g=el("g",{},G5); el("text",{x:c,y:90,"text-anchor":"middle","font-size":36,"font-weight":800,fill:col,text:tt},g);
      el("rect",{x:c-350,y:GY5,width:700,height:50,fill:"#DCC9A3"},g); el("line",{x1:c-350,y1:GY5,x2:c+350,y2:GY5,stroke:"#8C6A4F","stroke-width":5},g);
      const a1=rad(alt), W=100, x0=c-100, d=[Math.cos(a1),Math.sin(a1)], back=230;
      // faisceau : bord bas touche le sol en x0, bord haut en x0+W/sin
      const foot=W/Math.sin(a1); const q=[[x0,GY5],[x0+foot,GY5],[x0+foot-d[0]*back,GY5-d[1]*back],[x0-d[0]*back,GY5-d[1]*back]];
      g.beam=el("path",{d:`M${q.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" L")} Z`,fill:C.sun,"fill-opacity":.35,stroke:C.sun,"stroke-width":3},g);
      g.rays=[0,.25,.5,.75,1].map(f=>{ const xx=x0+foot*f; return el("line",{x1:xx-d[0]*back,y1:GY5-d[1]*back,x2:xx,y2:GY5,stroke:C.sun,"stroke-width":5,"stroke-dasharray":"12 10"},g); });
      const mx=x0+foot/2-d[0]*(back+34), my=GY5-d[1]*(back+34); g.sunI=el("g",{},g); el("circle",{cx:mx,cy:my,r:34,fill:C.sun,opacity:.3},g.sunI); el("circle",{cx:mx,cy:my,r:22,fill:C.sun,stroke:"#E39A0B","stroke-width":3},g.sunI);
      g.foot=el("line",{x1:x0,y1:GY5+5,x2:x0+foot,y2:GY5+5,stroke:"#E0560F","stroke-width":14,"stroke-linecap":"butt","stroke-opacity":Math.sin(a1)*.8+.15},g);
      g.fl=a.label(g,c,GY5+112,hrs>10?"lumière concentrée\nle sol chauffe bien":"lumière étalée\nle sol chauffe peu",{size:26,stroke:col,color:col,w:340});
      g.mult=el("text",{x:c,y:GY5+216,"text-anchor":"middle","font-size":26,"font-weight":600,fill:C.ink,text:hrs>10?"Surface éclairée : petite":"Surface éclairée : environ 3 fois plus grande"},g);
      // durée du jour
      el("rect",{x:c-300,y:745,width:600,height:30,rx:8,fill:"#1B2A55"},g); g.day=el("rect",{x:c-300+300-300*hrs/24,y:745,width:600*hrs/24,height:30,rx:8,fill:"#FFE08A"},g); g._w=600*hrs/24; g._c=c;
      el("text",{x:c,y:850,"text-anchor":"middle","font-size":30,"font-weight":800,fill:col,text:"Durée du jour à Dijon : "+jt.replace("jour de ","")},g);
      el("text",{x:c-300,y:806,"font-size":22,fill:"#4A5468",text:"0 h"},g); el("text",{x:c+300,y:806,"text-anchor":"end","font-size":22,fill:"#4A5468",text:"24 h"},g);
      g._foot=foot; return g; });
    /* ---------- MANIPULATION : choisir la date, la Terre se place sur son orbite ---------- */
    const Gm=a.layer("Gm"); R.Gm=Gm;
    el("ellipse",{cx:MO.cx,cy:MO.cy,rx:MO.rx,ry:MO.ry,fill:"none",stroke:"#9AA3B2","stroke-width":4,"stroke-dasharray":"14 10"},Gm);
    el("circle",{cx:MO.cx,cy:MO.cy,r:58,fill:C.sun,opacity:.28},Gm); el("circle",{cx:MO.cx,cy:MO.cy,r:40,fill:C.sun,stroke:"#E39A0B","stroke-width":4},Gm);
    el("text",{x:MO.cx-72,y:MO.cy+9,"text-anchor":"end","font-size":26,"font-weight":800,fill:"#8A5A00",text:"Soleil"},Gm);
    el("text",{x:MO.cx,y:90,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#4A5468",text:"Orbite de la Terre (en perspective)"},Gm);
    R.mE=el("g",{},Gm); smallGlobe(a,R.mE,32);
    R.mLab=el("g",{},Gm); a.label(R.mLab,0,0,"",{size:26,w:200,h:44,stroke:C.ink,color:C.ink}); R.mLabT=R.mLab.lastChild.lastChild;
    // Dijon à midi
    el("rect",{x:930,y:60,width:640,height:510,rx:16,fill:"#fff",stroke:"#C9CED8","stroke-width":3},Gm);
    el("text",{x:1250,y:106,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink,text:"Dijon, à midi (on regarde vers l'ouest)"},Gm);
    el("rect",{x:931,y:470,width:638,height:99,fill:"#DCC9A3"},Gm); el("line",{x1:931,y1:470,x2:1569,y2:470,stroke:"#8C6A4F","stroke-width":5},Gm);
    R.mSh=el("line",{x1:1250,y1:470,x2:1300,y2:470,stroke:"#3A3F4B","stroke-width":14,"stroke-linecap":"round","stroke-opacity":.6},Gm);
    el("line",{x1:1250,y1:470,x2:1250,y2:370,stroke:C.ink,"stroke-width":9,"stroke-linecap":"round"},Gm);
    R.mR1=el("line",{stroke:C.sun,"stroke-width":5,"stroke-dasharray":"10 8"},Gm); R.mR2=el("line",{stroke:C.sun,"stroke-width":5,"stroke-dasharray":"10 8"},Gm);
    R.mArc=el("path",{fill:"none",stroke:C.red,"stroke-width":5},Gm);
    R.mSun=el("g",{},Gm); el("circle",{r:42,fill:C.sun,opacity:.3},R.mSun); el("circle",{r:28,fill:C.sun,stroke:"#E39A0B","stroke-width":3},R.mSun);
    R.mAlt=el("text",{x:1250,y:512,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.red},Gm); R.mOmb=el("text",{x:1250,y:553,"text-anchor":"middle","font-size":24,"font-weight":600,fill:C.ink},Gm);
    // trois cartes de lecture
    R.mCards=[[40,"Axe de la Terre"],[560,"Hauteur du Soleil à midi, à Dijon"],[1080,"Durée du jour à Dijon"]].map(([x,t1])=>{ const g=el("g",{},Gm); g.r=el("rect",{x,y:598,width:480,height:100,rx:14,fill:"#fff","stroke-width":4},g); el("text",{x:x+240,y:632,"text-anchor":"middle","font-size":22,"font-weight":600,fill:"#4A5468",text:t1},g); g.v=el("text",{x:x+240,y:677,"text-anchor":"middle","font-size":34,"font-weight":800},g); return g; });
    // bande des mois
    SAIS.forEach(([d0,d1,nm,col,fill],i)=>{ el("rect",{x:mbx(d0),y:MB.y,width:mbx(d1)-mbx(d0),height:MB.h,fill,stroke:"#fff","stroke-width":2},Gm); if(i<4) el("text",{x:(mbx(d0)+mbx(d1))/2,y:MB.y+28,"text-anchor":"middle","font-size":24,"font-weight":700,fill:col,text:nm},Gm); });
    { let d=1; MJ.forEach((n,i)=>{ el("line",{x1:mbx(d),y1:MB.y+MB.h,x2:mbx(d),y2:MB.y+MB.h+8,stroke:"#7E8AA0","stroke-width":2},Gm); el("text",{x:mbx(d+n/2),y:MB.y+MB.h+34,"text-anchor":"middle","font-size":22,fill:C.ink,text:MN[i]},Gm); d+=n; }); }
    R.mFlag=el("g",{},Gm); R.mFlagL=a.label(R.mFlag,0,-52,"",{size:26,w:420,h:44,stroke:C.red,color:C.red}); R.mFlagT=R.mFlagL.lastChild; el("path",{d:"M-14,-30 L14,-30 L0,-6 Z",fill:C.red},R.mFlag); el("line",{x1:0,y1:-6,x2:0,y2:MB.h,stroke:C.red,"stroke-width":4},R.mFlag);
    a.manip.innerHTML=`Date : <input type="range" id="mDoy" min="1" max="365" step="1" value="172" aria-label="Date dans l'année"> <b id="mDate" style="min-width:130px">21 juin</b> <button data-d="79">20 mars</button> <button data-d="172">21 juin</button> <button data-d="266">23 sept.</button> <button data-d="355">21 déc.</button>`;
    const sl=a.manip.querySelector("#mDoy"); sl.oninput=()=>{ manActive=true; manDoy=+sl.value; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ manActive=true; manDoy=+b.dataset.d; a.redraw(); });
    /* ---------- l'idée fausse : la distance au Soleil (étape 6) ---------- */
    const O2=a.layer("O2"); R.O2=O2; const TX=440, TY=480, TR=270; R.T6=[TX,TY,TR];
    el("circle",{cx:TX,cy:TY,r:TR,fill:"none",stroke:"#9AA3B2","stroke-width":4,"stroke-dasharray":"14 10"},O2);
    el("circle",{cx:TX,cy:TY,r:70,fill:C.sun,opacity:.28},O2); el("circle",{cx:TX,cy:TY,r:48,fill:C.sun,stroke:"#E39A0B","stroke-width":4},O2);
    el("text",{x:TX,y:TY+8,"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#8A5A00",text:"Soleil"},O2);
    el("text",{x:TX,y:150,"text-anchor":"middle","font-size":26,"font-weight":600,fill:"#4A5468",text:"Orbite vue de dessus : presque un cercle"},O2);
    R.e6=el("g",{},O2); el("circle",{r:26,fill:C.oc,stroke:"#1E4F8A","stroke-width":3},R.e6);
    R.l6=el("line",{stroke:"#7E8AA0","stroke-width":3,"stroke-dasharray":"6 6"},O2);
    R.d6=el("g",{},O2); R.d6l=a.label(R.d6,TX,TY+TR+66,"",{size:30,w:520,h:52,stroke:C.ink,color:C.ink}); R.d6t=R.d6l.lastChild;
    R.s6=el("text",{x:TX,y:TY+TR+130,"text-anchor":"middle","font-size":30,"font-weight":800},O2);
    R.bars=el("g",{},O2); const BX=900, BW=620;
    el("text",{x:BX,y:150,"font-size":28,"font-weight":800,fill:C.ink,text:"Distance Terre–Soleil"},R.bars);
    [["Début janvier (hiver à Dijon)",147,C.hiv,200],["Début juillet (été à Dijon)",152,C.ete,300]].forEach(([n,v,c,y])=>{ el("text",{x:BX,y,"font-size":26,"font-weight":600,fill:C.ink,text:n},R.bars); const b=el("rect",{x:BX,y:y+14,height:44,rx:8,fill:c},R.bars); b._v=v; b._y=y; b._w=BW*v/152; (R.bb=R.bb||[]).push(b); const t=el("text",{x:BX+14,y:y+46,"font-size":28,"font-weight":800,fill:"#fff"},R.bars); t._b=b; t.textContent=v+" millions de km"; (R.bt=R.bt||[]).push(t); });
    R.diff=el("text",{x:BX,y:420,"font-size":26,"font-weight":700,fill:"#4A5468",text:"Écart : 5 millions de km seulement, environ 3 %"},R.bars);
    R.myth=a.layer("myth"); R.mc=a.myth(R.myth,BX,470,640,"Il fait chaud l'été parce que la Terre est plus près du Soleil.","C'est faux : en janvier, la Terre est un peu plus près du Soleil qu'en juillet, et pourtant c'est l'hiver à Dijon. Ce sont l'inclinaison de l'axe et la hauteur du Soleil qui font les saisons.");
    /* ---------- synthèse ---------- */
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["La Terre fait le tour du Soleil en 1 an, avec son axe incliné d'environ 23,4° qui garde la même direction.",C.bl],["Été : le Soleil est haut à midi (66° à Dijon), les rayons sont concentrés et les jours longs. Hiver : il est bas (19°), les rayons sont étalés et les jours courts.",C.or],["Ce n'est pas la distance au Soleil qui fait les saisons. Quand c'est l'été au nord, c'est l'hiver au sud !",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:930,height:180,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+90,r:34,fill:c},g); el("text",{x:120,y:y+103,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+58,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,50,1.2); return g; });
    R.ph1=a.photo(R.syn,{id:"s-e2-dijon-ete",x:1080,y:150,w:420,h:270,cap:"Dijon en été",rot:-2});
    R.ph2=a.photo(R.syn,{id:"s-e2-dijon-hiver",x:1080,y:500,w:420,h:270,cap:"Dijon en hiver",rot:2});
  },
  reset(a){ [R.O,R.G3,R.G4,R.G5,R.Gm,R.O2,R.myth,R.syn].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Un tour autour du Soleil en un an", duree:10000,
    legende:"La Terre tourne autour du Soleil : un tour complet dure un an. Pendant ce tour, l'axe de la Terre garde toujours la même direction.",
    voix:"En plus de tourner sur elle-même, la Terre tourne autour du Soleil. Un tour complet dure un an, soit trois cent soixante-cinq jours. Regardez la petite barre noire : c'est l'axe de la Terre, autour duquel elle tourne sur elle-même. Pendant tout le voyage, cet axe garde la même direction.",
    anim(t,a){ const s=a.seg; const th=2*Math.PI*s(t,.08,.92,true); sc1(a,{th,date:s(t,.04,.1),cnt:s(t,.05,.15),axe:s(t,.5,.65)}); } },
  { titre:"L'axe de la Terre est incliné", duree:10000,
    legende:"L'axe de la Terre est incliné d'environ 23,4°. Il pointe toujours dans la même direction : le 21 juin, le pôle Nord est penché vers le Soleil ; le 21 décembre, il est penché à l'opposé.",
    voix:"L'axe de la Terre n'est pas droit : il est incliné d'environ vingt-trois degrés et demi. Et il pointe toujours dans la même direction. Le vingt et un juin, le pôle Nord est penché vers le Soleil. Six mois plus tard, le vingt et un décembre, il est penché à l'opposé du Soleil. Aux deux dates intermédiaires, on parle d'équinoxe.",
    anim(t,a){ const s=a.seg; sc1(a,{th:Math.PI*2,fixed:1,four:s(t,.05,.4),inset:s(t,0,.2),tilt:s(t,.55,.75),arc:s(t,.05,.3)}); } },
  { titre:"Été et hiver : les deux hémisphères", duree:12000,
    legende:"Le 21 juin, le nord est penché vers le Soleil : c'est l'été au nord et l'hiver au sud. Le 21 décembre, c'est l'inverse. Le Soleil éclaire toujours la moitié de la Terre.",
    voix:"Regardons la Terre par la tranche, avec le Soleil au milieu. Le Soleil éclaire toujours la moitié de la Terre. Le vingt et un juin, le nord est penché vers le Soleil : c'est l'été dans l'hémisphère nord. Mais dans l'hémisphère sud, c'est l'hiver ! Le vingt et un décembre, c'est exactement l'inverse : l'hiver chez nous, l'été en Australie. Dijon est ici, sur le globe : en juin, le Soleil la frappe presque de face ; en décembre, il arrive de très bas.",
    anim(t,a){ const s=a.seg; sc3(a,{g:s(t,0,.12),rays:s(t,.1,.25),hemi:s(t,.3,.5),dij:s(t,.6,.78),alt:s(t,.8,.95)}); } },
  { titre:"La hauteur du Soleil à midi", duree:13000,
    legende:"À Dijon, à midi, le Soleil est à 19° au-dessus de l'horizon en hiver, 43° au début du printemps et de l'automne, 66° en été. Plus il est haut, plus l'ombre est courte.",
    voix:"Voyons ce que cela change à Dijon, à midi. En hiver, le Soleil reste très bas : environ dix-neuf degrés au-dessus de l'horizon, et l'ombre du bâton est longue. Au début du printemps et de l'automne, il monte à quarante-trois degrés. En été, il est très haut, soixante-six degrés, et l'ombre est toute courte.",
    anim(t,a){ const s=a.seg; sc4(a,[s(t,.03,.33),s(t,.33,.63),s(t,.63,.93)]); } },
  { titre:"Rayons étalés ou concentrés, jours longs ou courts", duree:13000,
    legende:"Quand le Soleil est bas, la même lumière est étalée sur une plus grande surface : le sol chauffe peu. En hiver, les jours sont aussi plus courts : environ 8 h 30 contre 16 h en été.",
    voix:"Quand le Soleil est haut, un faisceau de lumière tombe presque de face et éclaire une petite surface : la lumière est concentrée et le sol chauffe bien. Quand le Soleil est bas, le même faisceau est étalé sur une surface presque trois fois plus grande : le sol chauffe peu. Et en hiver, le jour est plus court : environ huit heures et demie, contre seize heures en été. Voilà pourquoi il fait plus froid.",
    anim(t,a){ const s=a.seg; sc5(a,{be:s(t,0,.1),ete:s(t,.05,.3),hiv:s(t,.35,.6),day:s(t,.65,.95)}); } },
  { titre:"À vous : choisissez la date", duree:15000,
    legende:"La Terre se place sur son orbite selon la date. À vous : déplacez le curseur ou touchez une date, regardez la hauteur du Soleil à midi et la durée du jour changer.",
    voix:"À vous de jouer. Le curseur choisit la date dans l'année : la Terre se place sur son orbite. Regardez le pôle Nord, penché vers le Soleil ou à l'opposé. Regardez aussi, à Dijon, la hauteur du Soleil à midi, la longueur de l'ombre, et la durée du jour. Déplacez le curseur de janvier à décembre, et dites ce que vous remarquez. Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02) manActive=false; scM(a,{mv:s(t,.12,.88,true),show:s(t,0,.1)}); } },
  { titre:"Idée fausse : la Terre est plus près en été ?", duree:14000,
    legende:"Début janvier, la Terre est à 147 millions de km du Soleil ; début juillet, à 152 millions. Elle est donc plus près en hiver ! La distance ne fait pas les saisons.",
    voix:"On entend souvent que l'été est chaud parce que la Terre est plus près du Soleil. C'est faux ! Suivons la Terre de janvier à juillet : début janvier, elle est à cent quarante-sept millions de kilomètres du Soleil, c'est son point le plus proche. Début juillet, elle est à cent cinquante-deux millions, son point le plus éloigné. La différence est petite, et la Terre est plus proche en hiver. Ce sont l'inclinaison de l'axe et la hauteur du Soleil qui font les saisons.",
    anim(t,a){ const s=a.seg; sc6(a,{mv:s(t,.06,.5,true),bars:s(t,.52,.7),myth:s(t,.74,.9)}); a.cls(R.mc.faux,"pulse",t>.9); } },
  { titre:"À retenir", duree:9000,
    legende:"Axe incliné de 23,4° + tour du Soleil en 1 an = hauteur du Soleil et durée du jour qui changent : voilà les saisons. Quand c'est l'été au nord, c'est l'hiver au sud.",
    voix:"À retenir. Un : la Terre fait le tour du Soleil en un an, avec son axe incliné d'environ vingt-trois degrés et demi, toujours dans la même direction. Deux : en été, le Soleil est haut et les jours sont longs ; en hiver, il est bas et les jours sont courts. Trois : ce n'est pas la distance au Soleil qui fait les saisons. Et quand c'est l'été dans l'hémisphère nord, c'est l'hiver dans l'hémisphère sud.",
    anim(t,a){ const s=a.seg; a.op(R.syn,1); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.2,.28+i*.2))); a.op(R.ph1,s(t,.7,.9)); a.op(R.ph2,s(t,.75,.95)); } },
  ]
});
function allOff(a){ [R.O,R.G3,R.G4,R.G5,R.Gm,R.O2,R.myth,R.syn].forEach(e=>a.op(e,0)); }
function sc1(a,o){ const op=a.op, d=k=>o[k]||0; allOff(a); op(R.O,1);
  const th=o.th||0, [x,y]=orbPos(th); a.tr(R.mv,x,y);
  const doy=172+th/(2*Math.PI)*365; R.dateT.textContent=dateStr(doy); R.dateS.textContent="position de la Terre"; op(R.date,d("date")); op(R.cnt,d("cnt")); op(R.axe1,d("axe"));
  op(R.mv,o.four?0:1); R.four.forEach(g=>op(g,d("four"))); op(R.inset,d("inset")); op(R.tiltN,d("tilt"));
  if(o.inset!==undefined){ const k=a.seg(d("arc"),0,1); R.insAx.setAttribute("transform",`rotate(${-23.44*k} 195 190)`); const r=110, ang=23.44*k; const p2=[195-r*Math.sin(rad(ang)),190-r*Math.cos(rad(ang))]; R.insArc.setAttribute("d",`M195,${190-r} A${r},${r} 0 0 0 ${p2[0]},${p2[1]}`); R.insT.textContent=ang<0.2?"":f1(ang)+"°"; R.insT.setAttribute("x",270); }
  op(R.date,o.fixed?0:d("date")); }
function sc3(a,o){ const op=a.op, d=k=>o[k]||0; allOff(a); op(R.G3,1); op(R.gD,d("g")); op(R.gJ,d("g")); op(R.t3,d("g")); R.rays3.forEach(r=>{ op(r,d("rays")); r.style.strokeDashoffset=-(d("rays")*60)%28; }); op(R.hemi,d("hemi"));
  R.h3.forEach(g=>{ op(g.dij,d("dij")); op(g.altL,d("alt")); op(g.ray,d("dij")); }); op(R.dijL,d("dij")); }
function sc4(a,k){ const op=a.op; allOff(a); op(R.G4,1);
  R.col.forEach((g,i)=>{ const v=k[i]; const alt=a.lerp(Math.min(8,g._alt),g._alt,v); const al=rad(alt); const bx=g._bx, by=640, c=g._c;
    const dist=Math.min(205,Math.sqrt(205*205)); const sx=bx-dist*Math.cos(al), sy=by-dist*Math.sin(al); a.tr(g.sun,sx,sy); op(g.sun,v>0?1:0);
    const L=Math.min(330,110/Math.tan(al)); a.set(g.sh,{x2:bx+L}); op(g.sh,v>0?1:0);
    a.set(g.ray,{x1:sx,y1:sy,x2:bx,y2:by-110}); a.set(g.ray2,{x1:sx+Math.sin(al)*0,y1:sy,x2:bx+L,y2:by}); op(g.ray,v>0?1:0); op(g.ray2,v>0?1:0);
    const ar=70, p1=[bx-ar,by], p2=[bx-ar*Math.cos(al),by-ar*Math.sin(al)]; g.arc.setAttribute("d",`M${p1[0]},${p1[1]} A${ar},${ar} 0 0 1 ${p2[0]},${p2[1]}`); op(g.arc,v>0?1:0);
    g.alt.textContent=v>0?"Soleil à "+Math.round(alt)+"° de hauteur":""; g.omb.textContent=v>=.98?"Ombre : "+f1(110/Math.tan(rad(g._alt))/110).replace(",0","")+" × la hauteur du bâton":""; }); }
function sc5(a,o){ const op=a.op, d=k=>o[k]||0; allOff(a); op(R.G5,1);
  R.p5.forEach((g,i)=>{ const v=d(i?"hiv":"ete"); op(g,v>0?1:0); g.setAttribute("opacity",v>0?1:0); g.beam.setAttribute("opacity",a.seg(v,0,.6)); g.rays.forEach(r=>{ r.setAttribute("opacity",a.seg(v,0,.6)); r.style.strokeDashoffset=-(v*80)%22; }); g.sunI.setAttribute("opacity",a.seg(v,0,.4)); g.foot.setAttribute("opacity",a.seg(v,.5,.8)); g.fl.setAttribute("opacity",a.seg(v,.7,1)); g.mult.setAttribute("opacity",a.seg(v,.7,1));
    const dv=d("day"); g.day.setAttribute("width",g._w*dv); g.day.setAttribute("x",g._c-g._w*dv/2); }); }
function scM(a,o){ const op=a.op; allOff(a); op(R.Gm,1);
  const doyF=manActive?manDoy:355+182*o.mv, N=((doyF-1)%365+365)%365+1, n=Math.round(N), A=astro(N);
  const th=(N-172)/365.25*2*Math.PI, [ex,ey]=mOrb(th); a.tr(R.mE,ex,ey); a.tr(R.mLab,ex,ey+(Math.sin(th)>=0?-92:92)); R.mLabT.textContent=dateStr(n);
  // Dijon à midi
  const al=rad(A.alt), bx=1250, by=470, sx=bx-250*Math.cos(al), sy=by-250*Math.sin(al), L=100/Math.tan(al);
  a.tr(R.mSun,sx,sy); a.set(R.mSh,{x2:bx+L}); a.set(R.mR1,{x1:sx,y1:sy,x2:bx,y2:by-100}); a.set(R.mR2,{x1:sx,y1:sy,x2:bx+L,y2:by});
  const tx=bx+L, ar=70; R.mArc.setAttribute("d",`M${tx-ar},${by} A${ar},${ar} 0 0 1 ${tx-ar*Math.cos(al)},${by-ar*Math.sin(al)}`);
  R.mAlt.textContent="Soleil à "+Math.round(A.alt)+"° au-dessus de l'horizon"; R.mOmb.textContent=L>150?"ombre longue":L>90?"ombre moyenne":"ombre courte";
  // cartes
  const lean=Math.cos(th), sai=seasonOf(N), SC=[C.hiv,C.gr,C.ete,"#8A5A1E"][sai];
  const leanT=lean>.5?"penché vers le Soleil":lean<-.5?"penché à l'opposé":"de côté (ni vers, ni contre)", leanC=lean>.5?C.ete:lean<-.5?C.hiv:"#4A5468";
  R.mCards[0].v.textContent=leanT; R.mCards[0].v.setAttribute("fill",leanC); R.mCards[0].r.setAttribute("stroke",leanC); R.mCards[0].v.setAttribute("font-size",lean>-.5&&lean<.5?26:32);
  R.mCards[1].v.textContent=Math.round(A.alt)+"°"; R.mCards[1].v.setAttribute("fill",C.red); R.mCards[1].r.setAttribute("stroke",C.red);
  R.mCards[2].v.textContent=Math.floor(A.mins/60)+" h "+String(A.mins%60).padStart(2,"0"); R.mCards[2].v.setAttribute("fill",C.bl); R.mCards[2].r.setAttribute("stroke",C.bl);
  // bande des mois
  a.tr(R.mFlag,mbx(N),MB.y); R.mFlagT.textContent=dateStr(n)+" : "+["hiver","printemps","été","automne"][sai]+" à Dijon"; { const fx=mbx(N); const dx=fx-210<15?15-(fx-210):fx+210>1585?1585-(fx+210):0; R.mFlagL.setAttribute('transform',`translate(${dx},0)`); }
  const sl=document.getElementById("mDoy"), dt=document.getElementById("mDate"); if(sl&&!manActive) sl.value=n; if(dt) dt.textContent=dateStr(n); }
function sc6(a,o){ const op=a.op, d=k=>o[k]||0; allOff(a); op(R.O2,1); const [TX,TY,TR]=R.T6;
  // Terre du 3 janvier (à gauche, jour 3) au 4 juillet (à droite, jour 185)
  const doy=3+182*d("mv"), th=Math.PI+Math.PI*d("mv")*(182/181.5);  // gauche -> bas -> droite
  const x=TX+TR*Math.cos(th), y=TY-TR*Math.sin(th); a.tr(R.e6,x,y);
  a.set(R.l6,{x1:TX,y1:TY,x2:x,y2:y});
  const dist=149.6*(1-0.0167*Math.cos(2*Math.PI*(doy-3)/365.25));
  R.d6t.textContent=dateStr(doy)+" : "+Math.round(dist)+" millions de km";
  R.s6.textContent=doy<80?"Hiver à Dijon":doy<172?"Printemps à Dijon":"Été à Dijon"; R.s6.setAttribute("fill",doy<80?C.hiv:doy<172?C.gr:C.ete);
  if(d("mv")>=.995){ R.s6.textContent="Début juillet : c'est l'été à Dijon !"; R.s6.setAttribute("fill",C.ete); }
  op(R.bars,d("bars")); R.bb.forEach(b=>b.setAttribute("width",b._w*d("bars"))); R.bt.forEach(t=>op(t,a.seg(d("bars"),.5,1)));
  op(R.myth,d("myth")); }
})();
