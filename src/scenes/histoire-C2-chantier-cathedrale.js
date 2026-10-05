/* META {"id":"histoire-C2-chantier-cathedrale","matiere":"histoire","annee":"connexe","periode":1,"theme":"connexe","resume":"Comment construit-on une cathédrale gothique ? Plan du maître d'œuvre, métiers du chantier, grue à roue, cintres en bois pour les voûtes, et un chantier de Notre-Dame de Paris qui dure des générations (curseur d'année à manipuler).","motsCles":["cathédrale","gothique","chantier","maître d'œuvre","grue à roue","cintre","voûte","Notre-Dame de Paris","Saint-Bénigne","générations","Moyen Âge"]} */
(function(){
const C={ink:"#1E2430",stone:"#E4D6BC",stoneD:"#8C7A5B",wood:"#B07A3E",woodD:"#6A4624",sky:"#EEF5FB",ground:"#D9CDB3",or:"#E07A1F",red:"#C0392B",ok:"#2E8B57",viol:"#6B3FA0",blue:"#2F6DB5",cream:"#FBF6EE"};
const GY=780;
let R={}, a0, YEAR=1345;
const L=(a,b,t)=>a+(b-a)*t;
function txt(p,x,y,s,o){ o=o||{}; const t=a0.el("text",{x,y,"text-anchor":o.anchor||"middle","font-size":o.size||26,"font-weight":o.weight||800,fill:o.fill||C.ink,stroke:o.stroke===undefined?"#fff":o.stroke,"stroke-width":o.sw||5,"paint-order":"stroke"},p); t.textContent=s; return t; }
// personnage : retourne {g, arm} ; l'avant-bras (arm) pivote autour de l'épaule
function man(a,p,o){ o=o||{}; const g=a.el("g",{},p);
  a.el("path",{d:"M-14,-60 L-16,0 M14,-60 L16,0",stroke:"#3A2A1E","stroke-width":9,"stroke-linecap":"round"},g);
  a.el("path",{d:"M-24,-104 L24,-104 L30,-48 L-30,-48Z",fill:o.col||"#3C6FA8",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g);
  a.el("circle",{cx:0,cy:-128,r:21,fill:"#F1C9A5",stroke:C.ink,"stroke-width":3},g);
  if(o.hat==="cap") a.el("path",{d:"M-22,-132 Q0,-158 22,-132Z",fill:o.hatCol||"#7A4A2E",stroke:C.ink,"stroke-width":3},g);
  if(o.hat==="chapeau"){ a.el("ellipse",{cx:0,cy:-142,rx:34,ry:7,fill:o.hatCol||"#5B3A8A",stroke:C.ink,"stroke-width":3},g); a.el("rect",{x:-17,y:-168,width:34,height:26,rx:6,fill:o.hatCol||"#5B3A8A",stroke:C.ink,"stroke-width":3},g); }
  const arm=a.el("g",{transform:"translate(22,-98)"},g);
  a.el("line",{x1:0,y1:0,x2:0,y2:42,stroke:o.col||"#3C6FA8","stroke-width":13,"stroke-linecap":"round"},arm);
  a.el("circle",{cx:0,cy:46,r:8,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2},arm);
  return {g,arm}; }
// voûte : géométrie ogive (coupe transversale)
const XL=520, XR=1000, Y0=520, RHO=400, TH=46, CX=760;
const PHI0=Math.PI, PHI1=Math.acos((CX-(XL+RHO))/RHO);
const NV=5;
function vous(i,side){
  const c=side<0?XL+RHO:XR-RHO; const f=k=>L(PHI0,PHI1,k/NV); const pts=[];
  const pt=(phi,r)=>{ const x=side<0?c+r*Math.cos(phi):c-r*Math.cos(phi); const y=Y0-r*Math.sin(phi); return [x,y]; };
  const a1=f(i)+(i? -0.004:0), a2=f(i+1);
  const P=[pt(a1,RHO),pt(a1,RHO+TH),pt(a2,RHO+TH),pt(a2,RHO)];
  return "M"+P.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" L")+"Z"; }
const APEX=[CX,Y0-Math.sqrt(RHO*RHO-Math.pow(CX-(XL+RHO),2))];
function keystone(){ const p1=[CX,APEX[1]]; const pL=(r)=>{ const phi=PHI1; return [XL+RHO+r*Math.cos(phi),Y0-r*Math.sin(phi)]; }; const a=pL(RHO+TH), b=[2*CX-a[0],a[1]]; return `M${p1[0]},${p1[1]} L${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}Z`; }
function arcPath(r,side){ const c=side<0?XL+RHO:XR-RHO; let d=""; for(let i=0;i<=20;i++){ const phi=L(PHI0,PHI1,i/20); const x=side<0?c+r*Math.cos(phi):c-r*Math.cos(phi); const y=Y0-r*Math.sin(phi); d+=(i?"L":"M")+x.toFixed(1)+","+y.toFixed(1); } return d; }

// grue à roue : construite en coordonnées locales (centre de la roue en 0,0)
function crane(a,p,o){ const g=a.el("g",{},p); const {Rw,r,px,py}=o; const c={g,Rw,r,px,py,y0:o.y0};
  c.rope=a.el("path",{d:"M0,0",fill:"none",stroke:"#6A4624","stroke-width":o.rw||5,"stroke-linecap":"round"},g);
  a.el("path",{d:`M${-Rw-30},${Rw+40} L${-Rw*.45},0 L${Rw*.45},0 L${Rw+30},${Rw+40}`,fill:"none",stroke:C.woodD,"stroke-width":o.rw?o.rw*2:12,"stroke-linejoin":"round"},g);
  c.jib=a.el("path",{d:`M${-Rw*.45},0 L${px},${py}`,stroke:C.woodD,"stroke-width":o.rw?o.rw*2:12,"stroke-linecap":"round"},g);
  c.pulley=a.el("circle",{cx:px,cy:py,r:Rw*.07,fill:"#D8D8D8",stroke:C.ink,"stroke-width":o.rw?o.rw*.6:4},g);
  c.wheel=a.el("g",{},g);
  a.el("circle",{cx:0,cy:0,r:Rw,fill:"#F6E7C9","fill-opacity":.35,stroke:C.wood,"stroke-width":Rw*.09},c.wheel);
  a.el("circle",{cx:0,cy:0,r:Rw*.86,fill:"none",stroke:C.woodD,"stroke-width":Rw*.025},c.wheel);
  for(let i=0;i<8;i++){ const an=i*Math.PI/4; a.el("line",{x1:0,y1:0,x2:Rw*Math.cos(an),y2:Rw*Math.sin(an),stroke:C.wood,"stroke-width":Rw*.04},c.wheel); }
  for(let i=0;i<28;i++){ const an=i*Math.PI*2/28; a.el("line",{x1:Rw*.86*Math.cos(an),y1:Rw*.86*Math.sin(an),x2:Rw*.97*Math.cos(an),y2:Rw*.97*Math.sin(an),stroke:C.woodD,"stroke-width":Rw*.03},c.wheel); }
  c.drum=a.el("g",{},c.wheel); a.el("circle",{cx:0,cy:0,r:r,fill:"#C9A064",stroke:C.ink,"stroke-width":o.rw?o.rw*.6:3},c.drum);
  for(let i=0;i<4;i++){ const an=i*Math.PI/2; a.el("line",{x1:r*.9*Math.cos(an),y1:r*.9*Math.sin(an),x2:r*Math.cos(an+.5)*.35,y2:r*Math.sin(an+.5)*.35,stroke:C.woodD,"stroke-width":Rw*.02},c.drum); }
  c.walker=a.el("g",{},g); const sc=Rw/200; const w=c.walker;
  c.legs=[0,1].map(()=>a.el("line",{x1:0,y1:0,x2:0,y2:46*sc,stroke:"#3A2A1E","stroke-width":11*sc,"stroke-linecap":"round"},w));
  a.el("path",{d:`M${-20*sc},${-8*sc} L${20*sc},${-8*sc} L${24*sc},${-70*sc} L${-24*sc},${-70*sc}Z`,fill:"#C0392B",stroke:C.ink,"stroke-width":3*sc,"stroke-linejoin":"round"},w);
  a.el("circle",{cx:0,cy:-92*sc,r:18*sc,fill:"#F1C9A5",stroke:C.ink,"stroke-width":3*sc},w);
  a.el("path",{d:`M${-19*sc},${-96*sc} Q0,${-122*sc} ${19*sc},${-96*sc}Z`,fill:"#7A4A2E",stroke:C.ink,"stroke-width":3*sc},w);
  a.el("line",{x1:0,y1:-60*sc,x2:30*sc,y2:-30*sc,stroke:"#C0392B","stroke-width":10*sc,"stroke-linecap":"round"},w);
  c.load=a.el("g",{},g); const bs=o.bs||Rw*.32; c.bs=bs;
  a.el("rect",{x:-bs/2,y:0,width:bs,height:bs*.8,fill:C.stone,stroke:C.stoneD,"stroke-width":o.rw?o.rw*.6:3},c.load);
  a.el("path",{d:`M${-bs/2},0 L${-bs*.1},${-bs*.5} L${bs*.1},${-bs*.5} L${bs/2},0`,fill:"none",stroke:"#6A4624","stroke-width":o.rw?o.rw*.9:4},c.load);
  c.sc=sc; return c; }
function updCrane(c,y,dx){ dx=dx||0; // y : position locale du haut de la pierre ; corde : tambour -> poulie -> pierre
  const th=(c.y0-y)/c.r; c.wheel.setAttribute("transform",`rotate(${th*180/Math.PI})`);
  c.walker.setAttribute("transform",`translate(0,${c.Rw*.84})`);
  c.legs[0].setAttribute("transform",`rotate(${Math.sin(th*3.2)*28})`); c.legs[1].setAttribute("transform",`rotate(${-Math.sin(th*3.2)*28})`);
  c.rope.setAttribute("d",`M${-c.r},0 L${-c.r},${c.py} L${c.px},${c.py} L${c.px+dx},${y}`);
  c.load.setAttribute("transform",`translate(${c.px+dx},${y})`); }

// plan de cathédrale qui se remplit avec les années (étapes « durée » et « manipulation »)
const PL={
  choir:"M560,90 L640,90 A40,40 0 0 1 640,170 L560,170Z",
  trans:[480,30,80,200], nave:i=>[480-55*(i+1),90,55,80], facade:[90,70,60,120], tN:[90,70,60,40], tS:[90,150,60,40],
  chap:j=>[[160+j*62,52,50,38],[160+j*62,170,50,38]]
};
function planProg(a,p){ const g=a.el("g",{},p); const o={};
  const dash={fill:"none",stroke:"#B8A06A","stroke-width":3,"stroke-dasharray":"8 7"};
  a.el("path",Object.assign({d:PL.choir},dash),g);
  const rc=(r,at)=>a.el("rect",Object.assign({x:r[0],y:r[1],width:r[2],height:r[3]},at),g);
  rc(PL.trans,dash); for(let i=0;i<6;i++) rc(PL.nave(i),dash); rc(PL.facade,dash);
  for(let j=0;j<5;j++) PL.chap(j).forEach(r=>rc(r,dash));
  const st={fill:C.stone,stroke:C.stoneD,"stroke-width":3.5,"stroke-linejoin":"round"};
  o.choir=a.el("path",Object.assign({d:PL.choir},st),g); o.choir._c=[620,130];
  o.trans=rc(PL.trans,st); o.trans._c=[520,130];
  o.nave=[...Array(6)].map((_,i)=>{ const e=rc(PL.nave(i),st); const r=PL.nave(i); e._c=[r[0]+r[2]/2,r[1]+r[3]/2]; return e; });
  o.facade=rc(PL.facade,st); o.facade._c=[120,130];
  o.tS=rc(PL.tS,{fill:"#D2BE98",stroke:C.stoneD,"stroke-width":3.5}); o.tS._c=[120,170];
  o.tN=rc(PL.tN,{fill:"#D2BE98",stroke:C.stoneD,"stroke-width":3.5}); o.tN._c=[120,90];
  o.chap=[]; for(let j=0;j<5;j++) PL.chap(j).forEach((r,k)=>{ const e=rc(r,st); e._c=[r[0]+r[2]/2,r[1]+r[3]/2]; o.chap.push(e); });
  // étiquettes
  o.lbl=[["façade et tours",120,225],["nef",330,135],["transept",520,22],["chœur",630,135]].map(([s,x,y])=>txt(g,x,y,s,{size:22,weight:700,fill:"#6A4E1E",stroke:"#FBF6EE",sw:4}));
  o.lbl[1].setAttribute("y",138);
  o.upd=y=>{ const sg=(v,a0_,a1)=>Math.max(0,Math.min(1,(v-a0_)/(a1-a0_)));
    const part=(e,pg)=>{ const k=Math.max(pg,0); if(k<=0){ e.style.display="none"; return; } e.style.display=""; const c=e._c; e.setAttribute("transform",`translate(${c[0]},${c[1]}) scale(${.35+.65*k}) translate(${-c[0]},${-c[1]})`); e.setAttribute("opacity",Math.min(1,k*3)); e.setAttribute("fill",k<1?"#E3B664":(e===o.tS||e===o.tN?"#D2BE98":C.stone)); };
    part(o.choir,sg(y,1163,1177));
    part(o.trans,sg(y,1190,1200));
    o.nave.forEach((e,i)=>part(e,sg(y,1182+i*4.3,1182+i*4.3+4.5)));
    part(o.facade,sg(y,1208,1225));
    part(o.tS,sg(y,1225,1240)); part(o.tN,sg(y,1235,1250));
    o.chap.forEach((e,i)=>part(e,sg(y,1250+i*9,1250+i*9+9)));
  };
  return o; }
function phase(y){ if(y<1177) return ["On bâtit le chœur","On commence à l'est, par le chœur."]; if(y<1182) return ["Le chœur est terminé","On peut déjà y célébrer."]; if(y<1208) return ["La nef et le transept","La nef avance vers l'ouest."]; if(y<1240) return ["La façade s'élève","Portails, galerie, grande rose."]; if(y<1250) return ["Les tours montent","Tour sud : 1240 ; tour nord : 1250."]; if(y<1345) return ["Chapelles et finitions","Chapelles, décors, finitions."]; return ["Le chantier est terminé","Près de deux siècles de travaux."]; }
const LAYERS=()=>[R.g1,R.ch,R.c3,R.gp,R.vg,R.dg,R.mg,R.syn,R.myth,R.ph1,R.ph2,R.ph3];
function only(a,...ls){ LAYERS().forEach(e=>a.op(e,0)); ls.forEach(e=>a.op(e,1)); }
const GEN=6, GENL=(1345-1163)/GEN;

Anim.run({
  titre:"Le chantier d'une cathédrale gothique",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge et la fin du Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Comment construit-on une cathédrale, sans grue à moteur, et combien de temps cela prend-il ?",
  manipDes:6, manipJusqua:6,
  init(a){
    a0=a; const {el}=a;
    el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.sky},a.svg);
    el("rect",{x:0,y:GY,width:1600,height:120,fill:C.ground},a.svg); el("line",{x1:0,y1:GY,x2:1600,y2:GY,stroke:C.stoneD,"stroke-width":3},a.svg);
    // ===== étape 1 : plan
    const g1=a.layer("plan"); R.g1=g1;
    el("rect",{x:430,y:60,width:1120,height:690,rx:18,fill:"#F6ECD2",stroke:"#B8A06A","stroke-width":4},g1);
    txt(g1,990,112,"Le plan au sol : une croix",{size:32,fill:"#6A4E1E",stroke:"#F6ECD2"});
    const pl={fill:"none",stroke:"#3A2A1E","stroke-width":9,"stroke-linejoin":"round","stroke-linecap":"round"};
    R.pT=el("path",Object.assign({d:"M560,530 L560,410 L1160,410 L1160,320 L1270,320 L1270,410 L1400,410"},pl),g1);
    R.pB=el("path",Object.assign({d:"M560,530 L1160,530 L1160,620 L1270,620 L1270,530 L1400,530"},pl),g1);
    R.pA=el("path",Object.assign({d:"M1400,410 A60,60 0 0 1 1400,530"},pl),g1);
    R.pil=[]; for(let i=0;i<7;i++){ [440,500].forEach(y=>{ const c=el("circle",{cx:620+i*78,cy:y,r:11,fill:C.stone,stroke:C.stoneD,"stroke-width":3},g1); R.pil.push(c); }); }
    R.rope=el("line",{x1:1400,y1:470,x2:1400,y2:410,stroke:C.or,"stroke-width":4},g1);
    R.peg=el("circle",{cx:1400,cy:470,r:9,fill:C.or,stroke:C.ink,"stroke-width":2},g1);
    R.pl=[["façade",560,578],["nef",815,480],["transept",1215,296],["chœur",1325,480]].map(([s,x,y])=>txt(g1,x,y,s,{size:28,fill:"#6A4E1E",stroke:"#F6ECD2"}));
    R.arrE=el("g",{},g1); txt(R.arrE,1000,700,"l'est : le chœur, vers le soleil levant",{size:24,weight:600,fill:"#6A4E1E",stroke:"#F6ECD2"});
    R.mo=man(a,g1,{col:C.viol,hat:"chapeau"}); a.tr(R.mo.g,230,GY,1.15);
    R.moLbl=a.label(g1,230,545,"Maître d'œuvre :\nil dessine le plan",{size:26,fill:"#fff",stroke:C.viol,w:330,h:92});
    R.chap=a.label(g1,250,380,"L'évêque et les chanoines\ndécident de la construire",{size:23,fill:"#FFF4DC",stroke:C.or,w:360,h:86});
    // ===== étape 2 : les métiers
    const ch=a.layer("chantier"); R.ch=ch;
    const wallRows=(parent,n,x0,w)=>{ const rows=[]; for(let i=0;i<n;i++){ const y=GY-30*(i+1); const r=el("rect",{x:x0,y:y,width:w,height:30,fill:C.stone,stroke:C.stoneD,"stroke-width":3},parent); const j=el("line",{x1:x0+(i%2?w*.35:w*.65),y1:y,x2:x0+(i%2?w*.35:w*.65),y2:y+30,stroke:C.stoneD,"stroke-width":3},parent); rows.push([r,j]); } return rows; };
    const scaffold=(parent,top,plat,xa,xb)=>{ xa=xa||1210; xb=xb||1490; const sg=el("g",{},parent); [xa,xb].forEach(x=>el("line",{x1:x,y1:GY,x2:x,y2:top,stroke:C.woodD,"stroke-width":9},sg));
      el("line",{x1:xa-20,y1:plat,x2:xb+20,y2:plat,stroke:C.wood,"stroke-width":12},sg);
      el("line",{x1:xa,y1:GY,x2:xb,y2:plat,stroke:C.wood,"stroke-width":5},sg); el("line",{x1:xb,y1:GY,x2:xa,y2:plat,stroke:C.wood,"stroke-width":5},sg);
      return sg; };
    R.wall=el("g",{},ch); R.courses=wallRows(R.wall,7,1250,200); R.scaf=scaffold(ch,420,600);
    R.work={};
    const mk=(k,x,col,hat,lbl1,lbl2,w)=>{ const m=man(a,ch,{col,hat}); a.tr(m.g,x,GY,1.1); R.work[k]={w:m,l:a.label(ch,x,555,lbl1+"\n"+lbl2,{size:23,fill:"#fff",stroke:col,w:w,h:84}),x}; };
    mk("mo",130,C.viol,"chapeau","Maître d'œuvre","il dirige tout",250);
    R.blk=el("g",{},ch); el("rect",{x:460,y:GY-60,width:100,height:60,fill:C.stone,stroke:C.stoneD,"stroke-width":3},R.blk); el("rect",{x:460,y:GY-60,width:100,height:14,fill:"#F3EBD8"},R.blk);
    mk("tp",400,"#7A8A9A","cap","Tailleur de pierre","il taille les blocs",270);
    R.anv=el("g",{},ch); el("path",{d:"M760,780 L775,745 L845,745 L870,758 L845,765 L835,780Z",fill:"#4A4F5A",stroke:C.ink,"stroke-width":3},R.anv); el("path",{d:"M885,780 Q870,730 895,700 Q900,730 920,715 Q935,745 925,780Z",fill:"#F08A24",stroke:"#9A3F00","stroke-width":3},R.anv);
    mk("fo",700,"#9A4B2B","cap","Forgeron","il forge les outils",250);
    R.poutre=el("g",{},ch); el("rect",{x:1040,y:GY-52,width:130,height:22,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.poutre); [[1055,GY-30],[1155,GY-30]].forEach(p=>el("path",{d:`M${p[0]-16},${GY} L${p[0]},${p[1]} L${p[0]+16},${GY}`,fill:"none",stroke:C.woodD,"stroke-width":8},R.poutre));
    mk("ch",985,"#3F7D4F","cap","Charpentier","échafaudages, cintres",300);
    R.mac=man(a,ch,{col:"#B7791F",hat:"cap"}); a.tr(R.mac.g,1300,600,1.0);
    R.macLbl=a.label(ch,1350,350,"Maçon : il pose\nles pierres",{size:23,fill:"#fff",stroke:"#B7791F",w:270,h:84});
    R.motier=el("g",{},ch); el("path",{d:"M1425,600 L1433,570 L1469,570 L1477,600Z",fill:"#A9A294",stroke:C.ink,"stroke-width":3},R.motier); txt(R.motier,1451,548,"mortier",{size:22,weight:700});
    R.newRow=el("g",{},ch); { const y=GY-30*8; el("rect",{x:1250,y:y,width:200,height:30,fill:C.stone,stroke:C.stoneD,"stroke-width":3},R.newRow); }
    // ===== étape 3 : la grue en contexte
    const c3=a.layer("chantier3"); R.c3=c3;
    R.wall3=el("g",{},c3); R.courses3=wallRows(R.wall3,8,1330,200); R.scaf3=scaffold(c3,420,540,1310,1550);
    R.cr1=crane(a,c3,{Rw:200,r:25,px:-280,py:-300,y0:0,rw:9,bs:90}); R.cr1.g.setAttribute("transform","translate(1000,600) scale(-.75,.75)");
    R.mac3=man(a,c3,{col:"#B7791F",hat:"cap"}); a.tr(R.mac3.g,1500,540,1.0);
    R.l3a=a.label(c3,640,250,"Grue à roue : un ouvrier\nmarche dans la grande roue",{size:24,fill:"#fff",stroke:C.wood,w:420,h:92});
    R.l3b=a.label(c3,1440,350,"Les maçons posent\nla pierre",{size:23,fill:"#fff",stroke:"#B7791F",w:270,h:84});
    R.l3c=a.label(c3,1130,300,"la pierre monte",{size:23,fill:"#fff",stroke:C.stoneD,w:240,h:52});
    // ===== étape 4 : gros plan grue
    const gp=a.layer("gros"); R.gp=gp; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.cream},gp);
    el("line",{x1:0,y1:742,x2:1600,y2:742,stroke:C.stoneD,"stroke-width":4},gp); el("rect",{x:0,y:742,width:1600,height:158,fill:C.ground},gp);
    R.cr2=crane(a,gp,{Rw:230,r:28,px:-345,py:-215,y0:0,rw:6,bs:74}); a.tr(R.cr2.g,680,470);
    R.lblRoue=a.label(gp,1000,262,"grande roue : l'homme\nmarche à l'intérieur",{size:23,fill:"#fff",stroke:C.wood,w:340,h:84});
    R.lblDrum=a.label(gp,400,120,"petit tambour : la corde s'enroule",{size:23,fill:"#fff",stroke:C.or,w:430,h:52});
    R.arrRoue=a.arrow(gp,"M900,262 L840,300",{color:C.wood,w:4,head:3.5}); R.arrDrum=a.arrow(gp,"M520,146 L655,455",{color:C.or,w:4,head:3.5});
    R.exemple=txt(gp,1240,395,"Exemple : roue de 4 m de diamètre, tambour de 50 cm",{size:22,weight:600,fill:"#4A5468",stroke:C.cream});
    R.cote1=txt(gp,1240,445,"",{size:27,stroke:C.cream}); R.cote2=txt(gp,1240,490,"",{size:27,stroke:C.cream});
    R.fp=el("g",{},gp);
    R.fpA=a.arrow(R.fp,"M1030,510 L1030,640",{color:C.red,w:12,head:3}); R.fpB=a.arrow(R.fp,"M1330,510 L1330,530",{color:C.ok,w:12,head:3});
    R.fpT1=txt(R.fp,1030,678,"poids de la pierre",{size:24,fill:"#7A1D12",stroke:C.cream}); R.fpT2=txt(R.fp,1330,678,"effort de l'homme",{size:24,fill:"#14532D",stroke:C.cream});
    R.fpT3=txt(R.fp,1330,708,"8 fois plus petit",{size:24,fill:"#14532D",stroke:C.cream});
    R.stoneL=a.label(gp,215,640,"la pierre monte",{size:23,fill:"#fff",stroke:C.stoneD,w:240,h:52});
    // ===== étape 5 : voûte
    const vg=a.layer("voute"); R.vg=vg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.sky},vg);
    el("rect",{x:0,y:GY,width:1600,height:120,fill:C.ground},vg); el("line",{x1:0,y1:GY,x2:1600,y2:GY,stroke:C.stoneD,"stroke-width":3},vg);
    [[380,XL],[XR,1120]].forEach(([x0,x1])=>{ el("rect",{x:x0,y:Y0,width:x1-x0,height:GY-Y0,fill:C.stone,stroke:C.stoneD,"stroke-width":4},vg); for(let k=0;k<8;k++) el("line",{x1:x0,y1:Y0+k*33,x2:x1,y2:Y0+k*33,stroke:C.stoneD,"stroke-width":2,opacity:.6},vg); });
    R.cint=el("g",{},vg);
    [600,760,920].forEach(x=>{ el("line",{x1:x,y1:GY,x2:x,y2:Y0-60,stroke:C.woodD,"stroke-width":14},R.cint); });
    el("line",{x1:XL,y1:Y0+90,x2:XR,y2:Y0+90,stroke:C.wood,"stroke-width":12},R.cint); el("line",{x1:XL,y1:Y0+190,x2:XR,y2:Y0+190,stroke:C.wood,"stroke-width":12},R.cint);
    [[XL,Y0+90,760,Y0+190],[XR,Y0+90,760,Y0+190]].forEach(d=>el("line",{x1:d[0],y1:d[1],x2:d[2],y2:d[3],stroke:C.wood,"stroke-width":8},R.cint));
    R.cintA=el("path",{d:arcPath(RHO-12,-1),fill:"none",stroke:C.wood,"stroke-width":26,"stroke-linecap":"butt"},R.cint); R.cintB=el("path",{d:arcPath(RHO-12,1),fill:"none",stroke:C.wood,"stroke-width":26,"stroke-linecap":"butt"},R.cint);
    R.vou=[]; for(let i=0;i<NV;i++){ [-1,1].forEach(sd=>{ const p=el("path",{d:vous(i,sd),fill:i%2?"#E9DCC3":"#DCCBA9",stroke:C.stoneD,"stroke-width":3,"stroke-linejoin":"round"},vg); R.vou.push({p,i,sd}); }); }
    R.key=el("path",{d:keystone(),fill:"#F1C40F","fill-opacity":.9,stroke:"#8A6A00","stroke-width":3.5,"stroke-linejoin":"round"},vg);
    R.keyRope=el("line",{x1:CX,y1:0,x2:CX,y2:0,stroke:"#6A4624","stroke-width":5},vg);
    R.vl1=a.label(vg,270,300,"cintre en bois :\nun moule provisoire",{size:24,fill:"#fff",stroke:C.wood,w:320,h:90});
    R.vl2=a.label(vg,1290,300,"voussoirs : pierres\ntaillées en coin",{size:24,fill:"#fff",stroke:C.stoneD,w:320,h:90});
    R.vl3=a.label(vg,1290,430,"clé de voûte :\nla dernière pierre",{size:24,fill:"#FFF4DC",stroke:"#8A6A00",w:320,h:90});
    R.vl4=a.label(vg,1290,430,"on enlève le cintre :\nla voûte tient seule",{size:24,fill:"#E8F6EE",stroke:C.ok,w:340,h:90});
    R.vf=el("g",{},vg); [-1,1].forEach(sd=>{ a.arrow(R.vf,`M${CX+sd*150},${Y0-300} L${CX+sd*260},${Y0-190}`,{color:C.red,w:7,head:3.5}); }); R.vfT=txt(R.vf,CX,90,"les pierres se serrent et se soutiennent",{size:26,fill:"#7A1D12"});
    // ===== étape 6 : durée (automatique)
    const dg=a.layer("duree"); R.dg=dg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.cream},dg);
    el("rect",{x:0,y:830,width:1600,height:70,fill:C.ground},dg);
    txt(dg,400,66,"Notre-Dame de Paris : plan du chantier",{size:30,stroke:C.cream});
    const pg6=el("g",{transform:"translate(0,100)"},dg); R.pp6=planProg(a,pg6);
    R.yr6=el("text",{x:625,y:560,"text-anchor":"middle","font-size":100,"font-weight":800,fill:C.red},dg);
    R.yrT6=el("text",{x:625,y:620,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink},dg);
    R.yrD6=el("text",{x:625,y:665,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468"},dg);
    el("text",{x:1220,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Combien de temps a duré le chantier ?"},dg);
    const X0=900,X1=1540, sc=y=>X0+(y-1150)/(1400-1150)*(X1-X0);
    R.sc=sc; R.bars=[];
    el("line",{x1:X0,y1:370,x2:X1,y2:370,stroke:C.ink,"stroke-width":3},dg);
    [1150,1200,1250,1300,1350,1400].forEach(v=>{ el("line",{x1:sc(v),y1:364,x2:sc(v),y2:376,stroke:C.ink,"stroke-width":3},dg); el("text",{x:sc(v),y:404,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:String(v)},dg); });
    const bar=(y,a0_,a1,col,nm,sub)=>{ const gb=el("g",{},dg); el("text",{x:X0,y:y-18,"font-size":26,"font-weight":800,fill:col,text:nm},gb); const rr=el("rect",{x:sc(a0_),y:y,width:0,height:40,rx:8,fill:col},gb); const tt=el("text",{x:sc(a1)+12,y:y+29,"font-size":24,"font-weight":800,fill:C.ink},gb); tt.textContent=sub; R.bars.push({rr,a0:a0_,a1,tt,gb}); };
    bar(160,1163,1345,C.blue,"Notre-Dame de Paris (1163-vers 1345)","environ 180 ans");
    bar(270,1280,1393,C.or,"Saint-Bénigne de Dijon (1280-1393)","113 ans");
    R.myth=a.layer("myth"); a.myth(R.myth,900,470,640,"« Une seule personne la construit, en quelques années. »","Des centaines d'ouvriers et plusieurs maîtres d'œuvre, pendant plus d'un siècle.");
    // ===== étape 7 : manipulation (curseur d'année)
    const mg=a.layer("manip7"); R.mg=mg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.cream},mg);
    el("rect",{x:0,y:830,width:1600,height:70,fill:C.ground},mg);
    txt(mg,400,66,"Notre-Dame de Paris : plan du chantier",{size:30,stroke:C.cream});
    const pg7=el("g",{transform:"translate(0,100)"},mg); R.pp7=planProg(a,pg7);
    R.yr7=el("text",{x:625,y:560,"text-anchor":"middle","font-size":100,"font-weight":800,fill:C.red},mg);
    R.yrT7=el("text",{x:625,y:620,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink},mg);
    R.yrD7=el("text",{x:625,y:665,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468"},mg);
    R.yrN7=el("text",{x:625,y:715,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.blue},mg);
    el("text",{x:1220,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Génération après génération"},mg);
    const T0=900,T1=1540, ts=y=>T0+(y-1163)/(1345-1163)*(T1-T0); R.ts=ts;
    el("line",{x1:T0,y1:250,x2:T1,y2:250,stroke:C.ink,"stroke-width":4},mg);
    [[1163,"première pierre",130,"start"],[1177,"chœur",170,"middle"],[1208,"façade",210,"middle"],[1245,"tours",130,"middle"],[1345,"fin",170,"end"]].forEach(([y,s,ty,an])=>{ const x=ts(y); el("circle",{cx:x,cy:250,r:9,fill:C.or,stroke:"#fff","stroke-width":2},mg); el("text",{x:an==="middle"?x:(an==="start"?x-6:x+6),y:ty,"text-anchor":an,"font-size":22,"font-weight":700,fill:"#7A3F00",text:s},mg); el("line",{x1:x,y1:ty+8,x2:x,y2:241,stroke:"#E7C79B","stroke-width":2},mg); });
    [1163,1200,1250,1300,1345].forEach(y=>{ el("text",{x:ts(y),y:296,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:String(y)},mg); });
    R.tcur=el("g",{},mg); el("path",{d:"M0,232 L0,268",stroke:C.red,"stroke-width":5},R.tcur); el("path",{d:"M-12,222 L12,222 L0,238Z",fill:C.red},R.tcur);
    R.gens=[...Array(GEN)].map((_,i)=>{ const g=el("g",{},mg); const m=man(a,g,{col:["#3C6FA8","#7A9A4A","#B7791F","#9A4B2B","#6B3FA0","#3F7D4F"][i],hat:"cap"}); a.tr(m.g,0,0,.62); a.tr(g,945+i*108,590,1); el("text",{x:0,y:30,"text-anchor":"middle","font-size":21,"font-weight":700,fill:"#4A5468",text:"vers "+Math.round(1163+i*GENL)},g); return g; });
    R.genN=el("text",{x:1220,y:690,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.blue},mg);
    el("text",{x:1220,y:730,"text-anchor":"middle","font-size":23,"font-weight":600,fill:"#4A5468",text:"6 générations d'environ 30 ans (repère)"},mg);
    R.genEnd=txt(mg,1220,790,"Les ouvriers du début ne verront jamais la fin.",{size:27,fill:"#7A1D12",stroke:C.cream});
    // ===== étape 8 : synthèse
    const sg=a.layer("synthese"); R.syn=sg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.cream},sg);
    R.sc8=[["Un plan","Le maître d'œuvre dessine la cathédrale en croix et dirige les métiers.","#6B3FA0"],["Des techniques","Une grue à roue pour monter les pierres, des cintres en bois pour bâtir les voûtes.","#E07A1F"],["Des générations","Un chantier de plus d'un siècle : tailleurs, maçons, charpentiers, forgerons se succèdent.","#2E8B57"]].map((c,i)=>{ const g=el("g",{},sg); const y=110+i*230; el("rect",{x:80,y,width:1440,height:200,rx:18,fill:"#fff",stroke:c[2],"stroke-width":5},g); el("rect",{x:80,y,width:330,height:200,rx:18,fill:c[2]},g); el("text",{x:245,y:y+116,"text-anchor":"middle","font-size":40,"font-weight":800,fill:"#fff",text:c[0]},g); const t=el("text",{x:450,y:y+88,"font-size":31,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],52,1.3); return g; });
    // ===== photos
    const lp=a.layer("photos");
    R.ph1=a.photo(lp,{id:"h-c2-chantier-fouquet-temple",x:580,y:70,w:430,h:250,cap:"Un chantier au Moyen Âge (miniature, vers 1470)",rot:-1.5,size:21});
    R.ph2=a.photo(lp,{id:"h-c2-grue-ecureuil-guedelon",x:1200,y:36,w:340,h:225,cap:"Grue à roue reconstituée (Guédelon)",rot:2,size:20});
    R.ph3=a.photo(lp,{id:"h-c2-notre-dame-paris-facade",x:60,y:480,w:340,h:210,cap:"Notre-Dame de Paris aujourd'hui",rot:-2,size:21});
    // manipulation : curseur d'année
    a.manip.innerHTML=`Année : <input type="range" id="mY" min="1163" max="1345" step="1" value="${YEAR}" aria-label="Année"> <b id="mYv">${YEAR}</b>`;
    const sl=document.getElementById("mY"), lb=document.getElementById("mYv");
    sl.oninput=()=>{ YEAR=+sl.value; lb.textContent=YEAR; a.redraw(); };
  },
  reset(a){
    LAYERS().forEach(e=>a.op(e,0));
  },
  etapes:[
  { titre:"Un plan en croix", duree:9000,
    legende:"Une cathédrale commence par un plan. L'évêque décide de la construire ; le maître d'œuvre dessine au sol une croix : la nef, le transept et le chœur.",
    voix:"Une cathédrale commence par un plan. L'évêque et les chanoines décident de la construire. Le maître d'œuvre, qui est à la fois architecte et chef de chantier, dessine le plan au sol, avec une corde et un compas. Le plan a la forme d'une croix : la nef, le transept et le chœur.",
    anim(t,a){ const s=a.seg; only(a,R.g1);
      a.op(R.chap,s(t,.02,.12)*(1-s(t,.35,.42))); a.op(R.mo.g,s(t,0,.1)); a.op(R.moLbl,s(t,.08,.18));
      a.draw(R.pT,s(t,.2,.5,true)); a.draw(R.pB,s(t,.2,.5,true));
      const u=s(t,.5,.72,true); a.draw(R.pA,u); a.op(R.rope,u>0&&u<1?1:0); a.op(R.peg,u>0?1:0);
      const ang=L(-Math.PI/2,Math.PI/2,u); R.rope.setAttribute("x2",1400+60*Math.cos(ang)); R.rope.setAttribute("y2",470+60*Math.sin(ang));
      R.pil.forEach((c,i)=>a.op(c,s(t,.72+Math.floor(i/2)*.025,.76+Math.floor(i/2)*.025)));
      R.pl.forEach((l,i)=>a.op(l,s(t,.82+i*.04,.9+i*.04))); a.op(R.arrE,s(t,.92,1));
      R.mo.arm.setAttribute("transform",`translate(22,-98) rotate(${-40-Math.sin(t*30)*10})`); } },
  { titre:"Tous les métiers du chantier", duree:12000,
    legende:"Sur le chantier, chacun a son métier : le maître d'œuvre dirige, les tailleurs de pierre taillent les blocs, le forgeron fait les outils, le charpentier les échafaudages, les maçons posent les pierres.",
    voix:"Sur le chantier, chacun a son métier. Le maître d'œuvre dirige tout. Les tailleurs de pierre taillent les blocs. Le forgeron fabrique et répare les outils en fer. Le charpentier construit les échafaudages et les cintres en bois. Les maçons posent les pierres avec du mortier, étage après étage.",
    anim(t,a){ const s=a.seg; only(a,R.ch); a.op(R.ph1,s(t,.05,.25));
      R.courses.forEach((c,i)=>c.forEach(e=>a.op(e,1))); a.op(R.newRow,s(t,.75,.9));
      a.op(R.scaf,1); a.op(R.mac.g,s(t,.55,.65)); a.op(R.motier,s(t,.55,.65)); a.op(R.macLbl,s(t,.6,.7));
      const ks=["mo","tp","fo","ch"]; ks.forEach((k,i)=>{ const v=s(t,.05+i*.13,.15+i*.13); a.op(R.work[k].w.g,v); a.op(R.work[k].l,v); });
      a.op(R.blk,s(t,.1,.2)); a.op(R.anv,s(t,.22,.3)); a.op(R.poutre,s(t,.34,.42));
      R.work.mo.w.arm.setAttribute("transform",`translate(22,-98) rotate(${-40-Math.sin(t*20)*8})`);
      R.work.tp.w.arm.setAttribute("transform",`translate(22,-98) rotate(${-50+Math.sin(t*90)*40})`);
      R.work.fo.w.arm.setAttribute("transform",`translate(22,-98) rotate(${-50+Math.sin(t*100+1)*40})`);
      R.work.ch.w.arm.setAttribute("transform",`translate(22,-98) rotate(${-70+Math.sin(t*80)*25})`);
      R.mac.arm.setAttribute("transform",`translate(22,-98) rotate(${-60+Math.sin(t*70)*30})`); } },
  { titre:"Monter les pierres : la grue à roue", duree:10000,
    legende:"Pour monter les blocs de pierre, on utilise une grue à roue : un ouvrier marche à l'intérieur d'une grande roue, la corde s'enroule et la pierre monte.",
    voix:"Pour monter les lourds blocs de pierre, il n'y a pas de moteur. On utilise une grue à roue. Un ouvrier marche à l'intérieur d'une grande roue en bois. La roue tourne, la corde s'enroule autour de l'axe, et la pierre monte jusqu'aux maçons.",
    anim(t,a){ const s=a.seg; only(a,R.c3);
      R.courses3.forEach(c=>c.forEach(e=>a.op(e,1))); a.op(R.scaf3,1); a.op(R.mac3.g,s(t,.1,.2));
      a.op(R.l3a,s(t,.05,.15)); a.op(R.l3c,s(t,.2,.3)*(1-s(t,.75,.8))); a.op(R.l3b,s(t,.9,.97));
      const u=s(t,.2,.8,true); updCrane(R.cr1,L(168,-152,u),-293*a.seg(t,.8,.9));
      R.mac3.arm.setAttribute("transform",`translate(22,-98) rotate(${-60+Math.sin(t*70)*30*s(t,.9,.97)})`); } },
  { titre:"La grue en gros plan", duree:12000,
    legende:"Le secret : la roue est bien plus grande que l'axe. L'homme marche beaucoup, mais il fait peu d'effort : la grue « démultiplie » sa force.",
    voix:"Regardons de plus près le mécanisme. La roue est beaucoup plus grande que le petit tambour où s'enroule la corde. Quand la roue fait un tour, l'homme marche une longue distance, mais la pierre ne monte que de très peu. En échange, dans cet exemple, l'effort de l'homme est huit fois plus petit que le poids de la pierre. Ce que l'on gagne en force, on le perd en distance.",
    anim(t,a){ const s=a.seg; only(a,R.gp); a.op(R.ph2,s(t,.05,.25));
      const u=s(t,.12,.9,true); const y=L(213,-120,u); updCrane(R.cr2,y);
      const turns=((213-y)/R.cr2.r)/(Math.PI*2);
      // exemple : roue 4 m de diamètre (rayon 2 m), tambour 0,5 m de diamètre (rayon 0,25 m)
      const marche=turns*2*Math.PI*2, monte=turns*2*Math.PI*0.25;
      R.cote1.textContent="L'homme a marché "+marche.toFixed(1).replace(".",",")+" m"; R.cote2.textContent="La pierre est montée de "+monte.toFixed(1).replace(".",",")+" m";
      a.op(R.exemple,s(t,.1,.2)); a.op(R.cote1,s(t,.15,.25)); a.op(R.cote2,s(t,.15,.25));
      a.op(R.lblRoue,s(t,.05,.15)); a.op(R.lblDrum,s(t,.05,.15)); a.op(R.arrRoue,s(t,.05,.15)); a.op(R.arrDrum,s(t,.05,.15)); a.op(R.stoneL,s(t,.05,.15)*(1-s(t,.5,.6)));
      const f=s(t,.6,.75); a.op(R.fp,f); a.op(R.fpT3,s(t,.7,.8)); } },
  { titre:"Bâtir une voûte avec un cintre", duree:13000,
    legende:"Pour construire une voûte, on pose d'abord un cintre en bois. Les pierres en coin (voussoirs) sont posées dessus, jusqu'à la clé de voûte. On enlève ensuite le cintre.",
    voix:"Comment construire une voûte sans qu'elle s'effondre ? On commence par monter un cintre en bois, qui sert de moule provisoire. Les ouvriers posent dessus les voussoirs, des pierres taillées en coin, des deux côtés. Enfin, on place la clé de voûte, la dernière pierre au sommet. Les pierres se serrent les unes contre les autres : on peut retirer le cintre, la voûte tient toute seule.",
    anim(t,a){ const s=a.seg; only(a,R.vg);
      a.op(R.vl1,s(t,.02,.1)*(1-s(t,.8,.88)));
      const drop=s(t,.8,.95)*30; R.cint.setAttribute("transform",`translate(0,${drop})`); a.op(R.cint,t<.9?1:1-s(t,.9,.98));
      R.vou.forEach(v=>{ const start=.1+v.i*.1; const k=s(t,start,start+.08); a.op(v.p,k); a.tr(v.p,0,-(1-k)*40); });
      a.op(R.vl2,s(t,.15,.25)*(1-s(t,.55,.6)));
      const kk=s(t,.62,.76); a.op(R.key,kk); a.tr(R.key,0,-(1-kk)*220); a.op(R.vl3,s(t,.64,.74)*(1-s(t,.8,.84)));
      R.keyRope.setAttribute("y1",-10); R.keyRope.setAttribute("y2",APEX[1]-(1-kk)*220-10); R.keyRope.setAttribute("x1",CX); R.keyRope.setAttribute("x2",CX); R.keyRope.setAttribute("display",kk>0&&kk<1?"":"none");
      a.op(R.vl4,s(t,.85,.93)); a.op(R.vf,s(t,.9,1)); } },
  { titre:"Un chantier de près de deux siècles", duree:13000,
    legende:"Notre-Dame de Paris : première pierre en 1163, fin des travaux vers 1345. Saint-Bénigne de Dijon : de 1280 à 1393. Une cathédrale n'est pas l'œuvre d'une seule personne.",
    voix:"Combien de temps dure un tel chantier ? Pour Notre-Dame de Paris, la première pierre est posée en 1163 et les travaux durent jusque vers 1345, soit presque deux siècles. À Dijon, la cathédrale Saint-Bénigne est reconstruite entre 1280 et 1393. Les ouvriers du début ne voient jamais la fin. Non, une cathédrale n'est pas l'œuvre d'une seule personne.",
    anim(t,a){ const s=a.seg; only(a,R.dg); a.op(R.ph3,s(t,.05,.25));
      const yr=L(1163,1345,s(t,.05,.7,true)); const y=Math.round(yr); R.yr6.textContent=String(y); R.pp6.upd(y);
      const ph=phase(y); R.yrT6.textContent=ph[0]; R.yrD6.textContent=ph[1];
      R.bars.forEach((b,i)=>{ const v=i===0?s(t,.05,.7,true):s(t,.45,.85,true); const end=L(b.a0,b.a1,i===0?v:v); b.rr.setAttribute("width",Math.max(0,R.sc(i===0?yr:end)-R.sc(b.a0))); a.op(b.gb,i===0?1:s(t,.4,.5)); a.op(b.tt,v>.98?1:0); });
      a.op(R.myth,s(t,.88,.98)); a.cls(R.myth.faux,"pulse",t>.95); } },
  { titre:"À vous : faites avancer le chantier", duree:6000,
    legende:"À vous : faites glisser le curseur de 1163 à 1345 et regardez le plan se remplir. Quelle partie construit-on en 1190 ? Combien de générations d'ouvriers se succèdent ?",
    voix:"À vous de jouer ! Faites glisser le curseur de l'année mille cent soixante-trois à l'année mille trois cent quarante-cinq. Regardez le plan se remplir. Quelle partie construit-on en mille cent quatre-vingt-dix ? Combien de générations d'ouvriers se succèdent ? Prenez votre temps, puis cliquez sur Continuer.",
    anim(t,a){ const s=a.seg; only(a,R.mg); a.op(R.ph3,s(t,.05,.25));
      const y=YEAR; R.yr7.textContent=String(y); R.pp7.upd(y); const ph=phase(y); R.yrT7.textContent=ph[0]; R.yrD7.textContent=ph[1];
      R.yrN7.textContent=y>1163?(y-1163)+" ans de chantier":"Première pierre";
      a.tr(R.tcur,R.ts(y),0);
      const gi=Math.min(GEN-1,Math.floor((y-1163)/GENL)); R.gens.forEach((g,i)=>g.setAttribute("opacity",i<=gi?1:.18));
      R.genN.textContent="Génération n° "+(gi+1)+" au travail";
      a.op(R.genEnd,y>=1345?1:0); } },
  { titre:"Synthèse", duree:11000,
    legende:"Un plan, des techniques ingénieuses (grue à roue, cintres) et des générations d'ouvriers : voilà comment on construit une cathédrale gothique.",
    voix:"Pour résumer : une cathédrale commence par un plan dessiné par le maître d'œuvre. Elle se construit grâce à des techniques ingénieuses : la grue à roue pour monter les pierres, les cintres en bois pour bâtir les voûtes. Et elle demande le travail de nombreuses générations d'ouvriers.",
    anim(t,a){ const s=a.seg; only(a,R.syn); R.sc8.forEach((g,i)=>{ const v=s(t,.05+i*.28,.2+i*.28); a.op(g,v); a.tr(g,(1-v)*70,0); }); } },
  ]
});
})();
