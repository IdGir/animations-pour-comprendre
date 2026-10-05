/* META {"id":"sciences-D1-engrenages-vitesse","matiere":"sciences","annee":"connexe","periode":1,"theme":"Mouvement, objets techniques : les engrenages","resume":"Deux roues dentées engrenées tournent en sens opposés ; la petite tourne plus vite selon le rapport des dents ; une roue intermédiaire rétablit le sens.","motsCles":["engrenage","roue dentée","rapport","sens de rotation","horloge","boîte de vitesses"]} */
(function(){
let R={}, E=null;
let nB=10, spin=0; // manipulation : nombre de dents de la roue menée ; angle de la roue menante (°)
const KM=3; // indice de l'étape de manipulation
const NS=[10,15,20,30,40], PM=40, AXm=250, AYm=430;
const TIERS={10:"2 tours",15:"1 tour et un tiers",20:"1 tour",30:"deux tiers de tour",40:"un demi-tour"};
const C={A:"#2563A8",B:"#E07A1F",Cc:"#2E8B57",ink:"#1E2430",gris:"#5A6478",red:"#C0392B"};
const FILL={A:"#C9DBF5",B:"#F9D9B4",Cc:"#C6E7D3"};
const P=44; // pas des dents (px) : rayon = n*P/(2π)
const rad=(n,p)=>n*(p||P)/(2*Math.PI);
const f1=v=>(Math.round(v*10)/10).toString().replace(".",",");
const f2=v=>v.toFixed(2).replace(".",",");
function gearPath(n,r,d){ const s=2*Math.PI/n; let p=""; const pt=(a,rr)=>`${(rr*Math.cos(a)).toFixed(1)},${(rr*Math.sin(a)).toFixed(1)}`;
  for(let i=0;i<n;i++){ const c=i*s; p+=(i?" L":"M")+pt(c-.30*s,r-d)+" L"+pt(c-.16*s,r+d)+" L"+pt(c+.16*s,r+d)+" L"+pt(c+.30*s,r-d); }
  return p+" Z"; }
// angle (deg) de la roue menée B (nB dents) quand la menante A (nA dents) est à thA (deg) ; B est dans la direction alpha (deg) depuis A
function mesh(nA,nB,thA,alpha){ return -(nA/nB)*(thA-alpha)+alpha+180+180/nB; }
function mkGear(parent,n,col,p){ p=p||P; const r=rad(n,p), d=p*.3; const g=E("g",{},parent); const body=E("g",{},g);
  E("path",{d:gearPath(n,r,d),fill:FILL[col],stroke:C[col],"stroke-width":3,"stroke-linejoin":"round"},body);
  E("circle",{r:r*.62,fill:"none",stroke:C[col],"stroke-width":2,opacity:.45},body);
  E("line",{x1:0,y1:0,x2:r*.80,y2:0,stroke:C[col],"stroke-width":Math.max(4,r*.07),"stroke-linecap":"round"},body);
  E("circle",{cx:r*.80,cy:0,r:Math.max(5,r*.075),fill:C.red,stroke:"#fff","stroke-width":2},body);
  E("circle",{r:Math.max(6,r*.09),fill:C.ink},body);
  g.body=body; g.n=n; g.r=r; return g; }
function put(g,x,y,deg){ g.setAttribute("transform",`translate(${x},${y})`); g.body.setAttribute("transform",`rotate(${deg})`); }
function turnArrow(a,parent,cx,cy,rr,dir,color){ const t=Math.PI/180; const a0=(dir>0?-150:-30)*t, a1=(dir>0?-35:-145)*t;
  const x0=cx+rr*Math.cos(a0), y0=cy+rr*Math.sin(a0), x1=cx+rr*Math.cos(a1), y1=cy+rr*Math.sin(a1);
  return a.arrow(parent,`M${x0},${y0} A${rr},${rr} 0 0 ${dir>0?1:0} ${x1},${y1}`,{color,w:9,head:3.2}); }
let a=null;
const panel=(parent,x,y,w,h,col)=>E("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},parent);
const txt=(parent,x,y,s,o)=>{ o=o||{}; return E("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.color||C.ink,"text-anchor":o.anchor||"start",text:s,stroke:o.halo?"#fff":null,"stroke-width":o.halo?5:null,"paint-order":o.halo?"stroke":null},parent); };

Anim.run({
  titre:"Les engrenages : tourner plus vite, tourner dans l'autre sens",
  sousTitre:"Sciences et technologie · CM1-CM2 · Mouvement et objets techniques",
  matiere:"sciences", badge:"Sciences",
  accroche:"Deux roues dentées qui s'engrènent tournent-elles pareil ?",
  manipDes:KM, manipJusqua:KM,
  init(api){
    a=api; E=api.el;
    // ---------- étape 1 : deux roues identiques
    const L1=a.layer("s1"); R.L1=L1; const x1=420, y1=410, d1=2*rad(20,56); R.x1=x1; R.y1=y1; R.d1=d1;
    R.g1a=mkGear(L1,20,"A",56); R.g1b=mkGear(L1,20,"B",56);
    R.ar1=E("g",{},L1); turnArrow(a,R.ar1,x1,y1,90,1,C.A); turnArrow(a,R.ar1,x1+d1,y1,90,-1,C.B);
    txt(R.ar1,380,660,"roue bleue : sens des aiguilles",{anchor:"middle",color:C.A,halo:1});
    txt(R.ar1,380,692,"d'une montre",{anchor:"middle",color:C.A,halo:1});
    txt(R.ar1,830,660,"roue orange : sens contraire",{anchor:"middle",color:C.B,halo:1});
    txt(R.ar1,830,692,"des aiguilles d'une montre",{anchor:"middle",color:C.B,halo:1});
    R.c1=E("g",{},L1); panel(R.c1,1010,120,540,310);
    txt(R.c1,1040,170,"Chaque roue a 20 dents",{size:26});
    R.c1a=txt(R.c1,1040,240,"",{color:C.A,size:30,w:800}); R.c1b=txt(R.c1,1040,300,"",{color:C.B,size:30,w:800});
    txt(R.c1,1040,375,"même nombre de dents = même vitesse",{size:24,w:600});
    R.ph1=a.photo(L1,{id:"s-d1-horloge",x:1090,y:500,w:360,h:240,cap:"Engrenages d'une horloge",rot:-2});
    // ---------- étapes 2-3 : grande roue 30 dents / petite roue 10 dents
    const L2=a.layer("s2"); R.L2=L2; const GX=340, GY=470, rG=rad(30), rS=rad(10); R.GX=GX; R.GY=GY; R.PX=GX+rG+rS;
    R.gG=mkGear(L2,30,"A"); R.gS=mkGear(L2,10,"B");
    R.ar2=E("g",{},L2); turnArrow(a,R.ar2,GX,GY,100,1,C.A); turnArrow(a,R.ar2,R.PX,GY,rS*.55,-1,C.B);
    R.ar3=E("g",{},L2); turnArrow(a,R.ar3,GX,GY,100,-1,C.A); turnArrow(a,R.ar3,R.PX,GY,rS*.55,1,C.B);
    R.t2=E("g",{},L2); a.label(R.t2,GX,GY+rG+52,"grande roue : 30 dents\n(on la fait tourner)",{size:24,stroke:C.A,color:C.A}); a.label(R.t2,R.PX+30,GY-rS-120,"petite roue : 10 dents",{size:24,stroke:C.B,color:C.B});
    R.t3=E("g",{},L2); a.label(R.t3,GX,GY+rG+52,"grande roue : 30 dents",{size:24,stroke:C.A,color:C.A}); a.label(R.t3,R.PX+30,GY-rS-120,"petite roue : 10 dents\n(on la fait tourner)",{size:24,stroke:C.B,color:C.B});
    R.c2=E("g",{},L2); panel(R.c2,820,120,730,640);
    R.c2h=txt(R.c2,850,170,"",{size:28,w:800});
    R.c2a=txt(R.c2,850,240,"",{size:30,w:800}); R.c2b=txt(R.c2,850,300,"",{size:30,w:800});
    R.c2d=E("g",{},R.c2); R.c2dx=txt(R.c2d,850,375,"",{size:28,w:800});
    R.c2e=E("g",{},R.c2); R.b2l1=txt(R.c2e,850,470,"",{size:24,color:C.A}); R.b2l2=txt(R.c2e,850,545,"",{size:24,color:C.B});
    R.b2a=E("rect",{x:1070,y:444,width:0,height:36,rx:10,fill:C.A},R.c2e); R.b2b=E("rect",{x:1070,y:519,width:0,height:36,rx:10,fill:C.B},R.c2e);
    E("line",{x1:1070,y1:430,x2:1070,y2:570,stroke:C.ink,"stroke-width":2},R.c2e);
    R.c2n=E("text",{x:850,y:640,"font-size":26,"font-weight":700,fill:C.ink},R.c2); R.c2n2=E("text",{x:850,y:680,"font-size":26,"font-weight":700,fill:C.ink},R.c2);
    // ---------- étape 4 : MANIPULATION, on choisit le nombre de dents de la roue menée
    const LM=a.layer("s2m"); R.L2m=LM; const rA=rad(20,PM);
    R.gmA=mkGear(LM,20,"A",PM); R.gm=NS.map(n=>{ const g=mkGear(LM,n,"B",PM); g.cx=AXm+rA+rad(n,PM); return g; });
    R.cmA=txt(LM,AXm,AYm-rA-48,"bleue : 20 dents",{size:26,color:C.A,anchor:"middle",halo:1}); R.cmB=txt(LM,0,0,"",{size:26,color:C.B,anchor:"middle",halo:1});
    R.cm=E("g",{},LM); panel(R.cm,930,110,630,600,C.B);
    txt(R.cm,960,162,"La roue bleue mène (20 dents)",{size:28,w:800,color:C.A});
    R.cm1=txt(R.cm,960,222,"",{size:28,w:800,color:C.B});
    R.cm2=txt(R.cm,960,300,"",{size:30,w:800,color:C.A}); R.cm3=txt(R.cm,960,350,"",{size:30,w:800,color:C.B});
    E("line",{x1:960,y1:385,x2:1530,y2:385,stroke:"#D6DBE4","stroke-width":3},R.cm);
    R.cm4=txt(R.cm,960,440,"",{size:28,w:800}); R.cm5=E("text",{x:960,y:487,"font-size":28,"font-weight":800,fill:C.B},R.cm);
    R.cm6=E("text",{x:960,y:600,"font-size":26,"font-weight":700,fill:C.ink},R.cm);
    // ---------- étape 5 : chaîne de 3 roues
    const L4=a.layer("s4"); R.L4=L4; const n4=16, r4=rad(n4), X4=[300,300+2*r4,300+4*r4], Y4=400; R.X4=X4; R.Y4=Y4;
    R.g4=[mkGear(L4,n4,"A"),mkGear(L4,n4,"B"),mkGear(L4,n4,"Cc")];
    R.ar4=E("g",{},L4); [[C.A,1],[C.B,-1],[C.Cc,1]].forEach(([c,d],i)=>turnArrow(a,R.ar4,X4[i],Y4,62,d,c));
    R.lab4=E("g",{},L4);
    [["roue 1 : roue menante",C.A,X4[0],Y4+r4+55],["roue 2 : roue intermédiaire",C.B,X4[1],Y4+r4+130],["roue 3",C.Cc,X4[2],Y4+r4+55]].forEach(([t,c,x,y])=>a.label(R.lab4,x,y,t,{size:24,stroke:c,color:c}));
    R.s4t=E("g",{},L4); panel(R.s4t,1050,110,500,370,C.B);
    txt(R.s4t,1075,160,"Trois roues de 16 dents",{size:26,w:800});
    R.s4a=txt(R.s4t,1075,225,"1 : sens des aiguilles",{color:C.A,size:26}); R.s4b=txt(R.s4t,1075,275,"2 : sens contraire",{color:C.B,size:26}); R.s4c=txt(R.s4t,1075,325,"3 : sens des aiguilles",{color:C.Cc,size:26});
    R.s4n=E("text",{x:1075,y:390,"font-size":24,"font-weight":600,fill:C.ink},R.s4t); a.wrap(R.s4n,"La roue du milieu ne change pas la vitesse : elle change seulement le sens.",30);
    R.ph4=a.photo(L4,{id:"s-d1-montre",x:1100,y:560,w:340,h:226,cap:"Mécanisme d'une montre",rot:2});
    // ---------- étape 5 : applications
    const L5=a.layer("s5"); R.L5=L5; const PY=95, PH=620, PW=490, PXs=[40,555,1070];
    PXs.forEach(x=>panel(L5,x,PY,PW,PH));
    txt(L5,PXs[0]+PW/2,PY+46,"Horloge",{size:30,w:800,anchor:"middle",color:C.A});
    txt(L5,PXs[1]+PW/2,PY+46,"Perceuse à main",{size:30,w:800,anchor:"middle",color:C.B});
    txt(L5,PXs[2]+PW/2,PY+46,"Boîte de vitesses",{size:30,w:800,anchor:"middle",color:C.Cc});
    const cx=PXs[0]+PW/2, cy=PY+250; R.hcx=cx; R.hcy=cy;
    E("circle",{cx,cy,r:150,fill:"#FBFCFE",stroke:C.ink,"stroke-width":6},L5);
    for(let i=0;i<12;i++){ const t=i/12*2*Math.PI; E("line",{x1:cx+132*Math.sin(t),y1:cy-132*Math.cos(t),x2:cx+146*Math.sin(t),y2:cy-146*Math.cos(t),stroke:C.ink,"stroke-width":i%3?3:6},L5); }
    [["12",0],["3",3],["6",6],["9",9]].forEach(([s,i])=>{ const t=i/12*2*Math.PI; E("text",{x:cx+104*Math.sin(t),y:cy-104*Math.cos(t)+10,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:s},L5); });
    R.hH=E("line",{x1:0,y1:0,x2:0,y2:-80,stroke:C.A,"stroke-width":12,"stroke-linecap":"round"},L5); R.hM=E("line",{x1:0,y1:0,x2:0,y2:-118,stroke:C.B,"stroke-width":7,"stroke-linecap":"round"},L5);
    E("circle",{cx,cy,r:9,fill:C.ink},L5);
    R.hT1=txt(L5,cx,PY+470,"",{size:26,w:800,anchor:"middle",color:C.B}); R.hT2=txt(L5,cx,PY+510,"",{size:26,w:800,anchor:"middle",color:C.A});
    txt(L5,cx,PY+570,"des engrenages relient les aiguilles",{size:22,w:600,anchor:"middle",color:C.gris});
    const px=PXs[1], p2=26, r24=rad(24,p2), r8=rad(8,p2); R.p2=p2; R.pgx=px+150; R.pgy=PY+250; R.ppx=R.pgx+r24+r8;
    R.gD=mkGear(L5,24,"B",p2); R.gD2=mkGear(L5,8,"A",p2);
    a.label(L5,R.pgx,R.pgy+r24+52,"manivelle (grande roue)",{size:22,stroke:C.B,color:C.B});
    a.label(L5,R.ppx+10,R.pgy-r8-70,"petit pignon\n(il tient le foret)",{size:22,stroke:C.A,color:C.A});
    R.pT1=txt(L5,px+PW/2,PY+470,"",{size:26,w:800,anchor:"middle",color:C.B}); R.pT2=txt(L5,px+PW/2,PY+510,"",{size:26,w:800,anchor:"middle",color:C.A});
    txt(L5,px+PW/2,PY+570,"schéma simplifié",{size:22,w:600,anchor:"middle",color:C.gris});
    const bx=PXs[2], bp=22, r12=rad(12,bp), r24b=rad(24,bp);
    R.bx=bx; R.by1=PY+195; R.by2=PY+455; R.bp=bp; R.r12=r12; R.r24b=r24b;
    R.gB1=mkGear(L5,12,"Cc",bp); R.gB1o=mkGear(L5,24,"A",bp); R.gB2=mkGear(L5,24,"Cc",bp); R.gB2o=mkGear(L5,12,"A",bp);
    txt(L5,bx+30,PY+90,"moteur",{size:22,color:C.Cc}); txt(L5,bx+PW-30,PY+90,"sortie (roues)",{size:22,color:C.A,anchor:"end"});
    txt(L5,bx+PW/2,PY+318,"vitesse lente : moteur 2 tours = sortie 1 tour",{size:22,anchor:"middle"}); txt(L5,bx+PW/2,PY+346,"lent, mais avec de la force (exemple)",{size:22,w:600,anchor:"middle",color:C.gris});
    txt(L5,bx+PW/2,PY+578,"vitesse rapide : moteur 1 tour = sortie 2 tours",{size:22,anchor:"middle"}); txt(L5,bx+PW/2,PY+606,"rapide, mais moins de force (exemple)",{size:22,w:600,anchor:"middle",color:C.gris});
    txt(L5,800,775,"Petite → grande : lent mais puissant. Grande → petite : rapide.",{size:26,anchor:"middle"});
    // ---------- synthèse
    const sy=a.layer("syn"); R.syn=sy; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    txt(sy,800,70,"À retenir",{size:38,w:800,anchor:"middle"});
    R.pts=[["1","Deux roues dentées qui s'engrènent tournent dans des sens contraires.",C.A],["2","La petite roue tourne plus vite : 30 dents ÷ 10 dents = 3 tours pour 1 tour.",C.B],["3","Une roue intermédiaire permet de retrouver le sens de départ.",C.Cc]].map(([n,t,c],i)=>{
      const g=E("g",{},sy); E("rect",{x:150,y:110+i*105,width:1300,height:88,rx:16,fill:"#fff",stroke:c,"stroke-width":4},g); E("circle",{cx:205,cy:154+i*105,r:28,fill:c},g); E("text",{x:205,y:166+i*105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g);
      E("text",{x:255,y:164+i*105,"font-size":26,"font-weight":700,fill:C.ink,text:t},g); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,150,450,1300,"Deux roues engrenées tournent toujours à la même vitesse et dans le même sens.","Elles tournent en sens contraires. Et si elles n'ont pas le même nombre de dents, la plus petite tourne plus vite : on compte les dents !");
    // manipulation : la roue bleue tourne tant qu'on est dans l'étape (la classe a le temps de compter les tours)
    a.manip.innerHTML='Roue orange (menée) : '+NS.map(n=>`<button data-n="${n}" class="${n===nB?"sel":""}">${n} dents</button>`).join(" ");
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ nB=+b.dataset.n; spin=0; a.manip.querySelectorAll("button").forEach(x=>x.classList.toggle("sel",x===b)); a.redraw(); });
    let last=performance.now();
    setInterval(()=>{ const now=performance.now(), dt=Math.min(now-last,100); last=now; if(a.step()===KM){ spin+=dt*0.09; a.redraw(); } },40);
  },
  reset(a){ [R.L1,R.L2,R.L2m,R.cm,R.L4,R.L5,R.syn,R.myth,R.ar1,R.c1,R.ph1,R.ph4,R.ar2,R.ar3,R.t2,R.t3,R.c2,R.c2d,R.c2e,R.ar4,R.lab4,R.s4t].forEach(e=>a.op(e,0));
    R.pts.forEach(g=>a.op(g,0)); },
  etapes:[
  { titre:"Deux roues dentées", duree:8000,
    legende:"Deux roues de 20 dents s'engrènent. La roue bleue tourne dans le sens des aiguilles d'une montre, la roue orange tourne dans l'autre sens.",
    voix:"Voici deux roues dentées qui s'engrènent : les dents de l'une se glissent entre les dents de l'autre. Quand la roue bleue tourne dans le sens des aiguilles d'une montre, la roue orange est poussée par ses dents : elle tourne dans l'autre sens ! Ici, les deux roues ont le même nombre de dents, donc elles font le même nombre de tours.",
    anim(t,a){ const s=a.seg; a.op(R.L1,1); const x0=R.x1, y0=R.y1, d=R.d1; const th=360*2*s(t,.15,.95,true);
      put(R.g1a,x0,y0,th); put(R.g1b,x0+d,y0,mesh(20,20,th,0));
      a.op(R.ar1,s(t,.05,.2)); a.op(R.c1,s(t,.1,.25)); a.op(R.ph1,s(t,.4,.6));
      R.c1a.textContent="Roue bleue : "+f1(th/360)+(th/360>=2?" tours":" tour"); R.c1b.textContent="Roue orange : "+f1(th/360)+(th/360>=2?" tours":" tour"); } },
  { titre:"La petite roue tourne plus vite", duree:11000,
    legende:"La grande roue (30 dents) fait 1 tour : 30 dents passent. La petite roue (10 dents) doit donc faire 3 tours pour les laisser passer. 30 ÷ 10 = 3.",
    voix:"Maintenant, la grande roue a trente dents et la petite en a dix. Quand la grande roue fait un tour, trente dents passent. La petite roue n'a que dix dents : pour laisser passer les trente dents, elle doit faire trois tours ! Trente divisé par dix égale trois. La petite roue tourne trois fois plus vite.",
    anim(t,a){ const s=a.seg; a.op(R.L2,1); a.op(R.L1,1-s(t,0,.12)); a.op(R.ar2,s(t,.05,.2)); a.op(R.t2,s(t,.05,.2)); a.op(R.c2,s(t,.05,.2)); a.op(R.c2e,s(t,.1,.25));
      const th=360*s(t,.25,.9,true); put(R.gG,R.GX,R.GY,th); put(R.gS,R.PX,R.GY,mesh(30,10,th,0));
      R.c2h.textContent="On compte les tours"; const u=th/360;
      R.c2a.textContent="Grande roue (30 dents) : "+f2(u)+(u>=2?" tours":" tour"); R.c2b.textContent="Petite roue (10 dents) : "+f2(u*3)+(u*3>=2?" tours":" tour");
      a.op(R.c2d,s(t,.86,.97)); R.c2dx.textContent="30 dents ÷ 10 dents = 3";
      R.b2l1.textContent="grande roue"; R.b2l2.textContent="petite roue"; R.b2a.setAttribute("width",130*u); R.b2b.setAttribute("width",130*u*3);
      R.c2n.textContent=""; R.c2n2.textContent=""; } },
  { titre:"Et dans l'autre sens ?", duree:9000,
    legende:"Si c'est la petite roue qui entraîne la grande, tout s'inverse : la grande tourne 3 fois moins vite. Elle est plus lente, mais plus puissante.",
    voix:"Et si c'est la petite roue qui entraîne la grande ? Tout s'inverse. Pour faire faire un tour à la grande roue, il faut trois tours de la petite. La grande roue tourne donc trois fois moins vite. Elle est plus lente, mais elle tourne avec plus de force.",
    anim(t,a){ const s=a.seg; a.op(R.L2,1); a.op(R.ar2,1-s(t,0,.15)); a.op(R.t2,1-s(t,0,.15)); a.op(R.ar3,s(t,.05,.2)); a.op(R.t3,s(t,.05,.2)); a.op(R.c2,1); a.op(R.c2e,1); a.op(R.c2d,1);
      const thS=-882+1080*s(t,.2,.9,true); put(R.gS,R.PX,R.GY,thS); put(R.gG,R.GX,R.GY,mesh(10,30,thS,180));
      const u=(thS+882)/360; R.c2h.textContent="On compte les tours";
      R.c2a.textContent="Petite roue (10 dents) : "+f2(u)+(u>=2?" tours":" tour"); R.c2b.textContent="Grande roue (30 dents) : "+f2(u/3)+" tour";
      R.c2dx.textContent="10 dents ÷ 30 dents = un tiers";
      R.b2l1.textContent="grande roue"; R.b2l2.textContent="petite roue"; R.b2a.setAttribute("width",130*u/3); R.b2b.setAttribute("width",130*u);
      R.c2n.textContent="la grande roue est 3 fois plus lente,"; R.c2n2.textContent="mais elle tourne avec plus de force."; a.op(R.c2n,s(t,.8,.95)); a.op(R.c2n2,s(t,.8,.95)); } },
  { titre:"À vous : choisissez la roue orange", duree:7000,
    legende:"À vous : choisissez le nombre de dents de la roue orange et regardez ce qui change. Moins de dents : elle tourne plus vite. Plus de dents : plus lentement.",
    voix:"À vous ! La roue bleue a vingt dents et c'est elle qui tourne. Avec les boutons, choisissez le nombre de dents de la roue orange, et regardez ce qui change. Avec moins de dents, la roue orange tourne plus vite. Avec plus de dents, elle tourne plus lentement. Et avec vingt dents aussi, les deux roues tournent pareil. Prenez votre temps : comptez les tours !",
    anim(t,a){ const s=a.seg; a.op(R.L2m,s(t,0,.12)); a.op(R.L2,1-s(t,0,.12)); a.op(R.L1,0); a.op(R.cm,s(t,.05,.2));
      const i=NS.indexOf(nB), g=R.gm[i], rB=rad(nB,PM); R.gm.forEach((h,j)=>a.op(h,j===i?1:0));
      put(R.gmA,AXm,AYm,spin); put(g,g.cx,AYm,mesh(20,nB,spin,0));
      R.cmB.setAttribute("x",g.cx); R.cmB.setAttribute("y",AYm+Math.max(rB,rad(20,PM))+58); R.cmB.textContent="orange : "+nB+" dents";
      const u=spin/360, v=u*20/nB;
      R.cm1.textContent="Roue orange (menée) : "+nB+" dents";
      R.cm2.textContent="Roue bleue : "+f1(u)+(u>=2?" tours":" tour"); R.cm3.textContent="Roue orange : "+f1(v)+(v>=2?" tours":" tour");
      R.cm4.textContent="20 dents ÷ "+nB+" dents = "+(Math.round(200/nB)/10).toString().replace(".",",");
      a.wrap(R.cm5,"Quand la bleue fait 1 tour, l'orange fait "+TIERS[nB]+".",34);
      a.wrap(R.cm6,nB<20?"L'orange a moins de dents : elle tourne plus vite.":nB===20?"Même nombre de dents : même vitesse.":"L'orange a plus de dents : elle tourne plus lentement (mais avec plus de force).",36); } },
  { titre:"Trois roues à la suite", duree:9000,
    legende:"Avec trois roues, la roue 2 tourne dans le sens contraire de la roue 1, et la roue 3 retrouve le sens de la roue 1. La roue du milieu s'appelle roue intermédiaire.",
    voix:"Et avec trois roues à la suite ? La roue un tourne dans un sens. La roue deux tourne dans le sens contraire. Et la roue trois, poussée par la roue deux, tourne de nouveau dans le sens de la roue un ! La roue du milieu s'appelle la roue intermédiaire : elle ne change pas la vitesse, mais elle change le sens.",
    anim(t,a){ const s=a.seg; a.op(R.L4,1); a.op(R.L2,0); a.op(R.L2m,1-s(t,0,.12)); const th=360*2*s(t,.15,.95,true); const thB=mesh(16,16,th,0), thC=mesh(16,16,thB,0);
      put(R.g4[0],R.X4[0],R.Y4,th); put(R.g4[1],R.X4[1],R.Y4,thB); put(R.g4[2],R.X4[2],R.Y4,thC);
      a.op(R.ar4,s(t,.05,.2)); a.op(R.lab4,s(t,.05,.2)); a.op(R.s4t,s(t,.15,.3)); a.op(R.ph4,s(t,.5,.7)); } },
  { titre:"Dans la vie de tous les jours", duree:11000,
    legende:"Horloge : l'aiguille des minutes fait 12 tours pendant que celle des heures en fait 1. Perceuse à main : le foret tourne 3 fois plus vite que la manivelle. Boîte de vitesses : on choisit entre force et vitesse.",
    voix:"Les engrenages sont partout. Dans une horloge, l'aiguille des minutes fait douze tours pendant que celle des heures en fait un seul. Dans une perceuse à main, la manivelle fait tourner un petit pignon trois fois plus vite qu'elle. Et dans la boîte de vitesses d'une voiture, on choisit des roues différentes : une petite qui entraîne une grande pour avoir de la force, ou l'inverse pour aller vite.",
    anim(t,a){ const s=a.seg; a.op(R.L5,1); a.op(R.L4,1-s(t,0,.12)); const u=s(t,.1,.95,true);
      // horloge
      const hh=u*360, mm=u*360*12; a.set(R.hH,{transform:`translate(${R.hcx},${R.hcy}) rotate(${hh})`}); a.set(R.hM,{transform:`translate(${R.hcx},${R.hcy}) rotate(${mm})`});
      R.hT1.textContent="minutes : "+f1(u*12)+(u*12>=2?" tours":" tour"); R.hT2.textContent="heures : "+f1(u)+" tour";
      // perceuse
      const thc=360*2*u; put(R.gD,R.pgx,R.pgy,thc); put(R.gD2,R.ppx,R.pgy,mesh(24,8,thc,0));
      R.pT1.textContent="manivelle : "+f1(2*u)+(2*u>=2?" tours":" tour"); R.pT2.textContent="foret : "+f1(6*u)+(6*u>=2?" tours":" tour");
      // boîte de vitesses
      const thm=720*u; const bx=R.bx, a1=R.bx+110;
      put(R.gB1,a1,R.by1,thm); put(R.gB1o,a1+R.r12+R.r24b,R.by1,mesh(12,24,thm,0));
      put(R.gB2,a1+20,R.by2,thm); put(R.gB2o,a1+20+R.r12+R.r24b,R.by2,mesh(24,12,thm,0)); } },
  { titre:"Synthèse", duree:10000,
    legende:"Roues engrenées : sens contraires. Plus la roue a de dents, plus elle tourne lentement. Une roue intermédiaire rétablit le sens.",
    voix:"Pour retenir. Deux roues dentées qui s'engrènent tournent dans des sens contraires. La petite roue tourne plus vite que la grande : on compte les dents, trente divisé par dix égale trois. Et une roue intermédiaire permet de retrouver le sens de départ. Attention : deux roues engrenées ne tournent pas toujours à la même vitesse, ni dans le même sens !",
    anim(t,a){ const s=a.seg; a.op(R.L5,1-s(t,0,.1)); a.op(R.syn,s(t,0,.1)); R.pts.forEach((g,i)=>a.op(g,s(t,.08+i*.12,.18+i*.12))); a.op(R.myth,s(t,.55,.7)); } },
  ]
});
})();
