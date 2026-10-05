/* META {"id":"geo-B2-qui-fait-quoi","matiere":"geographie","annee":"B","periode":1,"theme":"Découper, mesurer, se déplacer dans les territoires","resume":"Commune, département, région, État : le trajet d'un élève de la maison au diplôme montre qui s'occupe de quoi.","motsCles":["commune","département","région","État","compétences","école","collège","lycée"]} */
(function(){
const R={}; let qsel=0;
const C={com:"#2E8B57",dep:"#2563A8",reg:"#C2570C",etat:"#4A5468",ink:"#1E2430"};
const SIT=[
 ["Toit école","Le toit de l'école élémentaire fuit : qui le répare ?",0,"L'école appartient à la commune : c'est elle qui construit et entretient le bâtiment."],
 ["Naissance","Une famille veut un acte de naissance : à qui s'adresser ?",0,"L'état civil se tient à la mairie, c'est-à-dire à la commune."],
 ["Cantine collège","Qui s'occupe du chauffage et de la cantine du collège ?",1,"Le collège dépend du département : bâtiment, repas, agents d'entretien."],
 ["Route D","Un trou sur une route départementale (panneau D) : qui la répare ?",1,"Les routes départementales sont gérées par le département."],
 ["Lycée","Qui construit et entretient le bâtiment du lycée ?",2,"Le lycée dépend de la région : bâtiment, équipement, repas."],
 ["Train T E R","Qui organise les trains régionaux (T E R) ?",2,"Les trains régionaux sont organisés par la région."],
 ["Programmes","Qui décide de ce qu'on apprend en CM2 ?",3,"Les programmes scolaires sont fixés par l'État, partout en France."],
 ["Bac","Qui délivre le baccalauréat ?",3,"Le baccalauréat est un diplôme national, délivré par l'État."]];
// étapes du trajet (points sur la route)
const P=[[170,402],[520,386],[880,402],[1230,386],[1450,402]];
Anim.run({
  titre:"Qui s'occupe de quoi ?",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : découper, mesurer, se déplacer dans les territoires",
  matiere:"geographie", badge:"Géographie",
  accroche:"Commune, département, région, État : qui s'occupe de ton école, de ton collège, de ton lycée ?",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a;
    const bg=a.layer("bg");
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Le trajet d'un élève, de la maison au diplôme"},bg);
    el("rect",{x:30,y:80,width:1540,height:420,rx:20,fill:"#F1F7F5",stroke:"#B8D4CC","stroke-width":3},bg);
    // collines
    el("path",{d:"M30,330 Q300,230 560,320 T1100,300 T1570,330 L1570,480 Q1570,500 1550,500 L50,500 Q30,500 30,480Z",fill:"#E2F0E0"},bg);
    // routes (chaque tronçon : un chemin)
    const road=a.layer("roads");
    const legD=[
      `M${P[0][0]},${P[0][1]} C250,420 420,360 ${P[1][0]},${P[1][1]}`,
      `M${P[1][0]},${P[1][1]} C640,430 760,360 ${P[2][0]},${P[2][1]}`,
      `M${P[2][0]},${P[2][1]} C1000,440 1100,350 ${P[3][0]},${P[3][1]}`,
      `M${P[3][0]},${P[3][1]} C1320,420 1390,380 ${P[4][0]},${P[4][1]}`];
    R.legs=legD.map((d,i)=>{ const g=el("g",{},road);
      if(i===2){ // voie ferrée
        el("path",{d,fill:"none",stroke:"#6B5B45","stroke-width":16,"stroke-dasharray":"4 12"},g);
        el("path",{d,fill:"none",stroke:"#2A2F3A","stroke-width":4,transform:"translate(0,-5)"},g);
        el("path",{d,fill:"none",stroke:"#2A2F3A","stroke-width":4,transform:"translate(0,5)"},g);
      } else {
        el("path",{d,fill:"none",stroke:i===1?"#B8894A":"#9AA3B2","stroke-width":i===1?30:24,"stroke-linecap":"round"},g);
        el("path",{d,fill:"none",stroke:"#fff","stroke-width":3,"stroke-dasharray":"16 14"},g);
      }
      g.p=el("path",{d,fill:"none",stroke:"none"},g); g.dd=d; return g; });
    R.legPath=legD.map(d=>{ const p=el("path",{d,fill:"none",stroke:"none"},road); return p; });
    // panneaux sur les routes
    R.signs=el("g",{},road);
    { const g=el("g",{transform:"translate(700,340)"},R.signs); el("rect",{x:-22,y:-22,width:44,height:44,rx:6,fill:"#F2C94C",stroke:C.ink,"stroke-width":3},g); el("text",{x:0,y:9,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"D"},g); }
    { const g=el("g",{transform:"translate(1060,342)"},R.signs); const l=a.label(g,0,0,"TER",{size:24,fill:"#fff",stroke:C.reg,color:C.reg}); }
    // bâtiments + étiquettes
    R.places=[];
    const flag=(g,x,y)=>{ el("line",{x1:x,y1:y,x2:x,y2:y-46,stroke:C.ink,"stroke-width":3},g); [["#2B4AA8",0],["#fff",11],["#D63A2F",22]].forEach(([c,dx])=>el("rect",{x:x+dx,y:y-46,width:11,height:20,fill:c,stroke:"#9AA3B2","stroke-width":.8},g)); };
    const place=(i,name,sub,col)=>{ const g=el("g",{},road); const [x,y]=P[i]; const by=y-30; // bas du bâtiment
      if(i===0){ el("rect",{x:x-46,y:by-62,width:92,height:62,fill:"#F4E3C7",stroke:C.ink,"stroke-width":3},g); el("path",{d:`M${x-60},${by-62} L${x},${by-112} L${x+60},${by-62}Z`,fill:"#C0583B",stroke:C.ink,"stroke-width":3},g); el("rect",{x:x-10,y:by-36,width:20,height:36,fill:"#8A5A2B"},g); el("rect",{x:x-36,y:by-48,width:18,height:18,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); el("rect",{x:x+18,y:by-48,width:18,height:18,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); }
      else if(i===1){ el("rect",{x:x-70,y:by-70,width:140,height:70,fill:"#F6D58A",stroke:C.ink,"stroke-width":3},g); el("rect",{x:x-18,y:by-100,width:36,height:30,fill:"#F6D58A",stroke:C.ink,"stroke-width":3},g); flag(g,x,by-100); el("rect",{x:x-12,y:by-34,width:24,height:34,fill:"#8A5A2B"},g); [-52,-32,24,44].forEach(dx=>el("rect",{x:x+dx-8,y:by-52,width:16,height:18,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g)); }
      else if(i===2){ el("rect",{x:x-95,y:by-84,width:190,height:84,fill:"#E9B58A",stroke:C.ink,"stroke-width":3},g); flag(g,x,by-84); el("rect",{x:x-14,y:by-40,width:28,height:40,fill:"#8A5A2B"},g); [-76,-52,-28,28,52].forEach(dx=>{ el("rect",{x:x+dx-8,y:by-68,width:16,height:18,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); el("rect",{x:x+dx-8,y:by-38,width:16,height:18,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); }); }
      else if(i===3){ el("rect",{x:x-115,y:by-96,width:230,height:96,fill:"#D9C7A8",stroke:C.ink,"stroke-width":3},g); el("path",{d:`M${x-46},${by-96} L${x},${by-130} L${x+46},${by-96}Z`,fill:"#D9C7A8",stroke:C.ink,"stroke-width":3},g); flag(g,x,by-130); [-30,-10,10,30].forEach(dx=>el("rect",{x:x+dx-4,y:by-60,width:8,height:60,fill:"#F5EEDD",stroke:C.ink,"stroke-width":1.5},g)); [-92,-72,72,92].forEach(dx=>{ el("rect",{x:x+dx-8,y:by-78,width:16,height:20,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); el("rect",{x:x+dx-8,y:by-44,width:16,height:20,fill:"#BFE3F2",stroke:C.ink,"stroke-width":2},g); }); }
      else { // diplôme : parchemin
        el("rect",{x:x-70,y:by-96,width:140,height:96,rx:8,fill:"#FFFDF4",stroke:C.ink,"stroke-width":3},g); [-60,-42,-24].forEach((dy,k)=>el("line",{x1:x-48,y1:by+dy-4,x2:x+(k===2?10:48),y2:by+dy-4,stroke:"#9AA3B2","stroke-width":4},g));
        el("circle",{cx:x+34,cy:by-26,r:20,fill:"#D63A2F",stroke:"#8A1F18","stroke-width":3},g); el("path",{d:`M${x+24},${by-8} l-6,28 l16,-8 l16,8 l-6,-28Z`,fill:"#2B4AA8",stroke:"#1B2E6E","stroke-width":2},g); }
      el("text",{x,y:y+44,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:name},g);
      el("text",{x,y:y+72,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:sub},g);
      R.places.push(g); return g; };
    place(0,"Maison","naissance, quartier"); place(1,"École","3 à 11 ans"); place(2,"Collège","11 à 15 ans"); place(3,"Lycée","15 à 18 ans"); place(4,"Diplôme","brevet, C A P, bac");
    // élève
    R.kid=el("g",{},a.layer("kid"));
    { const k=R.kid; el("ellipse",{cx:0,cy:2,rx:22,ry:6,fill:"rgba(0,0,0,.18)"},k);
      el("rect",{x:-24,y:-62,width:16,height:36,rx:5,fill:C.reg,stroke:C.ink,"stroke-width":2},k); // cartable
      el("rect",{x:-14,y:-64,width:28,height:38,rx:8,fill:"#2563A8",stroke:C.ink,"stroke-width":2.5},k);
      el("line",{x1:-6,y1:-26,x2:-6,y2:-2,stroke:C.ink,"stroke-width":5,"stroke-linecap":"round"},k); el("line",{x1:7,y1:-26,x2:7,y2:-2,stroke:C.ink,"stroke-width":5,"stroke-linecap":"round"},k);
      el("circle",{cx:0,cy:-82,r:17,fill:"#F2C9A0",stroke:C.ink,"stroke-width":2.5},k);
      el("path",{d:"M-17,-84 Q-14,-104 2,-100 Q18,-98 17,-82 Q8,-92 -17,-84Z",fill:"#5A3A22"},k);
      el("circle",{cx:7,cy:-82,r:2.2,fill:C.ink},k); }
    // calque panneaux d'info
    const pn=a.layer("panels"); R.pn=pn;
    const card=(g,x,w,col,titre,items)=>{ const c=el("g",{},g); const h=360;
      el("rect",{x,y:515,width:w,height:h,rx:18,fill:"#fff",stroke:col,"stroke-width":4},c);
      el("path",{d:`M${x},${515+18} Q${x},515 ${x+18},515 L${x+w-18},515 Q${x+w},515 ${x+w},${515+18} L${x+w},${515+64} L${x},${515+64}Z`,fill:col},c);
      el("text",{x:x+24,y:515+44,"font-size":30,"font-weight":800,fill:"#fff",text:titre},c);
      c.items=items.map((lines,i)=>{ const ig=el("g",{},c); const y=515+112+i*84; el("circle",{cx:x+34,cy:y-8,r:9,fill:col},ig); const t=el("text",{x:x+58,y,"font-size":25,"font-weight":600,fill:C.ink},ig); lines.split("\n").forEach((l,j)=>el("tspan",{x:x+58,dy:j?31:0,text:l},t)); return ig; });
      return c; };
    const mk=(titreC,colC,itC,itE)=>{ const g=el("g",{},pn); g.coll=card(g,40,640,colC,titreC,itC); g.etat=card(g,700,540,C.etat,"L'ÉTAT",itE); return g; };
    R.pan=[
      (()=>{ const g=el("g",{},pn); const c=el("g",{},g); // étape 1 : légende des 4 niveaux
        el("text",{x:800,y:575,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"Qui s'occupe de quoi, tout au long du chemin ?"},c);
        g.chips=[["La commune",C.com],["Le département",C.dep],["La région",C.reg],["L'État",C.etat]].map(([n,col],i)=>{ const ig=el("g",{},c); const x=70+i*385; el("rect",{x,y:640,width:350,height:150,rx:18,fill:col,"fill-opacity":.12,stroke:col,"stroke-width":4},ig); el("text",{x:x+175,y:726,"text-anchor":"middle","font-size":32,"font-weight":800,fill:col,text:n},ig); el("text",{x:x+175,y:766,"text-anchor":"middle","font-size":24,fill:C.ink,text:["le maire","le président du conseil","le président de la région","le gouvernement"][i]},ig); return ig; });
        return g; })(),
      mk("LA COMMUNE (la mairie)",C.com,["L'état civil : acte de naissance,\nmariage, livret de famille","Les rues, les trottoirs,\nl'éclairage de la commune","L'école maternelle et élémentaire :\nbâtiment, cantine, entretien"],["Les professeurs des écoles\n(recrutés et payés par l'État)","Les programmes scolaires","Le contrôle : les inspecteurs\nde l'Éducation nationale"]),
      mk("LE DÉPARTEMENT",C.dep,["Le collège : bâtiment, chauffage,\nrepas, agents d'entretien","Les routes départementales\n(panneaux D)","L'aide sociale : protection de\nl'enfance, personnes âgées"],["Les professeurs du collège","Les programmes de la sixième\nà la troisième","Le diplôme national du brevet"]),
      mk("LA RÉGION",C.reg,["Le lycée : bâtiment, équipement,\nrepas, agents d'entretien","Les trains régionaux (T E R)\net les cars interurbains","La formation professionnelle\net l'apprentissage"],["Les professeurs du lycée","Les programmes du lycée","Le baccalauréat et le C A P"]),
      (()=>{ const g=el("g",{},pn); g.etat=card(g,300,1000,C.etat,"L'ÉTAT : ce qui est le même partout en France",["Les diplômes nationaux : le brevet, le C A P,\nle bac valent la même chose à Dijon et à Marseille","Les programmes et les professeurs\n(recrutés, formés et payés par l'État)","Aussi : l'armée, la justice, la police nationale"]); return g; })()
    ];
    // tableau de synthèse
    const sy=a.layer("syn"); R.sy=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Chacun son rôle"},sy);
    R.cols=[["La commune",C.com,"l'école\nl'état civil\nles rues"],["Le département",C.dep,"le collège\nles routes\ndépartementales\nl'aide sociale"],["La région",C.reg,"le lycée\nles trains\nrégionaux (T E R)\nla formation"],["L'État",C.etat,"les programmes\nles professeurs\nles diplômes\nl'armée, la justice"]].map(([n,col,txt],i)=>{ const g=el("g",{},sy); const x=60+i*385; el("rect",{x,y:100,width:350,height:340,rx:18,fill:"#fff",stroke:col,"stroke-width":4},g); el("path",{d:`M${x},118 Q${x},100 ${x+18},100 L${x+332},100 Q${x+350},100 ${x+350},118 L${x+350},162 L${x},162Z`,fill:col},g); el("text",{x:x+175,y:143,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#fff",text:n},g); const t=el("text",{x:x+28,y:218,"font-size":30,"font-weight":600,fill:C.ink},g); txt.split("\n").forEach((l,j)=>el("tspan",{x:x+28,dy:j?50:0,text:l},t)); return g; });
    el("text",{x:800,y:870,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"Sources : vie-publique.fr et service-public.fr (compétences des collectivités et de l'État)."},sy);
    R.myth=el("g",{},sy); a.myth(R.myth,120,490,1360,"C'est l'État qui s'occupe de tout, même des bâtiments de l'école.","L'État fixe les programmes, paie les professeurs et délivre les diplômes. Mais les bâtiments dépendent de la commune (école), du département (collège) et de la région (lycée).");
    // ---------- manipulation : qui s'en occupe ? ----------
    const Q=a.layer("qui"); R.q=Q; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},Q);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"À vous : qui s'en occupe ?"},Q);
    R.bub=el("g",{},Q); el("rect",{x:240,y:100,width:1120,height:110,rx:22,fill:"#FFF8E8",stroke:"#C9A14A","stroke-width":4},R.bub); R.bubT=el("text",{x:800,y:170,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},R.bub);
    const LV=[["La commune",C.com],["Le département",C.dep],["La région",C.reg],["L'État",C.etat]];
    R.qc=LV.map(([n,col],i)=>{ const g=el("g",{},Q); const x=60+i*385; el("rect",{x,y:330,width:350,height:150,rx:18,fill:col,"fill-opacity":.12,stroke:col,"stroke-width":4},g); el("text",{x:x+175,y:418,"text-anchor":"middle","font-size":34,"font-weight":800,fill:col,text:n},g);
      g.ok=el("text",{x:x+175,y:530,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#14532D",text:"Bonne réponse"},g); g.ar=a.arrow(Q,`M800,215 C800,270 ${x+175},260 ${x+175},322`,{color:col,w:7,head:4}); g.x=x; return g; });
    R.ex=el("g",{},Q); el("rect",{x:120,y:600,width:1360,height:190,rx:18,fill:"#E8F6EE",stroke:"#2E8B57","stroke-width":4},R.ex); R.exT=el("text",{x:160,y:665,"font-size":32,"font-weight":600,fill:"#14532D"},R.ex);
    a.manip.innerHTML=`Une situation : ${SIT.map((q,i)=>`<button id="mQ${i}"${i===0?' class="sel"':''}>${q[0]}</button>`).join("")}`;
    SIT.forEach((q,i)=>{ document.getElementById("mQ"+i).onclick=()=>{ qsel=i; SIT.forEach((_,j)=>document.getElementById("mQ"+j).classList.toggle("sel",j===i)); a.redraw(); }; });
    // photos
    const ph=a.layer("photos");
    R.ph1=a.photo(ph,{id:"g-b2-mairie",x:1290,y:522,w:250,h:165,cap:"La mairie de Dijon",rot:2});
    R.ph2=a.photo(ph,{id:"g-b2-ter",x:1290,y:522,w:250,h:165,cap:"Un T E R en gare",rot:-2});
  },
  reset(a){ [R.pn,R.sy,R.q,R.myth,R.ph1,R.ph2,R.signs,R.kid,...R.legs,...R.places,...R.pan].forEach(e=>a.op(e,0)); R.pan.forEach(g=>{ if(g.coll){a.op(g.coll,0);} if(g.etat) a.op(g.etat,0); }); },
  etapes:[
  { titre:"Le trajet d'un élève", duree:8000,
    legende:"Suivons un élève de la maison jusqu'au diplôme. À chaque étape, une question : qui s'occupe de quoi ? La commune, le département, la région ou l'État ?",
    voix:"Suivons un élève, de la maison jusqu'au diplôme. Il va à l'école, puis au collège, puis au lycée. À chaque étape, posons-nous une question : qui s'occupe de quoi ? La commune, le département, la région, ou l'État ?",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.kid,s(t,.05,.15)); a.tr(R.kid,P[0][0]+50,P[0][1]+14,1.35);
      R.places.forEach((g,i)=>a.op(g,s(t,.05+i*.12,.2+i*.12))); R.legs.forEach((g,i)=>{ a.op(g,s(t,.1+i*.12,.2+i*.12)); });
      a.op(R.signs,s(t,.55,.7));
      a.op(R.pan[0],s(t,.5,.65)); R.pan[0].chips.forEach((c,i)=>a.op(c,s(t,.55+i*.08,.65+i*.08))); } },
  { titre:"La commune : maison et école", duree:11000,
    legende:"L'élève marche vers l'école. La commune s'occupe de l'état civil, des rues et de l'école : bâtiment, cantine. L'État envoie les professeurs.",
    voix:"L'élève part de la maison et marche vers l'école. C'est la commune, c'est-à-dire la mairie, qui s'occupe de l'état civil, par exemple l'acte de naissance, des rues et des trottoirs, et de l'école : le bâtiment, la cantine, l'entretien. Mais attention : le professeur, lui, est envoyé et payé par l'État.",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.kid,1); a.op(R.signs,1); R.places.forEach(g=>a.op(g,1)); R.legs.forEach(g=>a.op(g,1));
      const q=a.along(R.legPath[0],s(t,.05,.4)); a.tr(R.kid,q.x,q.y+14,1.35);
      R.pan.forEach((g,j)=>a.op(g,j===1?1:0)); const g=R.pan[1]; a.op(g.coll,s(t,.4,.5)); g.coll.items.forEach((it,i)=>a.op(it,s(t,.48+i*.1,.58+i*.1))); a.op(g.etat,s(t,.75,.85)); g.etat.items.forEach((it,i)=>a.op(it,s(t,.78+i*.04,.88+i*.04))); a.op(R.ph1,s(t,.5,.7)); a.op(R.ph2,0); } },
  { titre:"Le département : le collège", duree:11000,
    legende:"Pour aller au collège, l'élève prend la route départementale. Le département s'occupe du collège, des routes départementales et de l'aide sociale.",
    voix:"Pour aller au collège, l'élève emprunte une route départementale. C'est le département qui s'occupe du collège : le bâtiment, le chauffage, les repas et les agents d'entretien. Il s'occupe aussi des routes départementales, et de l'aide sociale. Les professeurs et les programmes dépendent toujours de l'État.",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.kid,1); a.op(R.signs,1); R.places.forEach(g=>a.op(g,1)); R.legs.forEach(g=>a.op(g,1));
      const q=a.along(R.legPath[1],s(t,.05,.4)); a.tr(R.kid,q.x,q.y+14,1.35);
      R.pan.forEach((g,j)=>a.op(g,j===2?1:0)); const g=R.pan[2]; a.op(g.coll,s(t,.4,.5)); g.coll.items.forEach((it,i)=>a.op(it,s(t,.48+i*.1,.58+i*.1))); a.op(g.etat,s(t,.75,.85)); g.etat.items.forEach((it,i)=>a.op(it,s(t,.78+i*.04,.88+i*.04))); a.op(R.ph1,0); a.op(R.ph2,0); } },
  { titre:"La région : le lycée", duree:11000,
    legende:"Pour aller au lycée, l'élève peut prendre le T E R. La région s'occupe du lycée, des trains régionaux et de la formation professionnelle.",
    voix:"Pour aller au lycée, l'élève peut prendre le train régional, appelé T E R. C'est la région qui s'occupe des lycées : bâtiments, équipements, repas. Elle organise aussi les trains régionaux et les cars interurbains, et la formation professionnelle, par exemple pour préparer un C A P. L'État, lui, garde les programmes, les professeurs et le baccalauréat.",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.kid,1); a.op(R.signs,1); R.places.forEach(g=>a.op(g,1)); R.legs.forEach(g=>a.op(g,1));
      const q=a.along(R.legPath[2],s(t,.05,.4)); a.tr(R.kid,q.x,q.y+14,1.35);
      R.pan.forEach((g,j)=>a.op(g,j===3?1:0)); const g=R.pan[3]; a.op(g.coll,s(t,.4,.5)); g.coll.items.forEach((it,i)=>a.op(it,s(t,.48+i*.1,.58+i*.1))); a.op(g.etat,s(t,.75,.85)); g.etat.items.forEach((it,i)=>a.op(it,s(t,.78+i*.04,.88+i*.04))); a.op(R.ph1,0); a.op(R.ph2,s(t,.5,.7)); } },
  { titre:"L'État : le diplôme", duree:10000,
    legende:"À la fin, l'élève reçoit un diplôme national. C'est l'État qui le délivre : il a la même valeur partout en France. L'État garde aussi l'armée, la justice, la police nationale.",
    voix:"À la fin du chemin, l'élève reçoit un diplôme. C'est l'État qui le délivre, et il a la même valeur partout en France, à Dijon comme à Marseille. L'État s'occupe aussi de ce qui concerne tout le pays : l'armée, la justice, la police nationale.",
    anim(t,a){ const s=a.seg; a.op(R.pn,1); a.op(R.kid,1); a.op(R.signs,1); R.places.forEach(g=>a.op(g,1)); R.legs.forEach(g=>a.op(g,1));
      const q=a.along(R.legPath[3],s(t,.05,.4)); a.tr(R.kid,q.x,q.y+14,1.35);
      R.pan.forEach((g,j)=>a.op(g,j===4?1:0)); const g=R.pan[4]; a.op(g.etat,s(t,.4,.5)); g.etat.items.forEach((it,i)=>a.op(it,s(t,.48+i*.12,.6+i*.12))); a.op(R.ph1,0); a.op(R.ph2,0); } },
  { titre:"À vous : qui s'en occupe ?", duree:9000,
    legende:"À vous : choisissez une situation avec les boutons, puis regardez qui s'en occupe : la commune, le département, la région ou l'État ?",
    voix:"À vous de jouer ! Choisissez une situation avec les boutons : par exemple le toit de l'école, ou une route départementale. Regardez ensuite qui s'en occupe : la commune, le département, la région ou l'État. Essayez toutes les situations !",
    anim(t,a){ const s=a.seg; a.op(R.ph1,0); a.op(R.ph2,0); a.op(R.q,s(t,0,.08)); const q=SIT[qsel]; R.bubT.textContent=q[1]; a.op(R.bub,s(t,.08,.2));
      R.qc.forEach((g,i)=>{ a.op(g,s(t,.12+i*.05,.25+i*.05)); const on=i===q[2]&&t>.4; if(t>.4) a.op(g,on?1:.3); g.ok.setAttribute("opacity",on?1:0); a.op(g.ar,on?s(t,.45,.6):0); if(g.ar.path) a.draw(g.ar.path,on?s(t,.45,.6):0); });
      R.exT.textContent=""; a.wrap(R.exT,q[3],66,1.3); a.op(R.ex,s(t,.62,.78)); } },
  { titre:"Synthèse", duree:11000,
    legende:"Chaque niveau a son rôle : la commune pour l'école, le département pour le collège, la région pour le lycée, l'État pour les programmes, les professeurs et les diplômes.",
    voix:"Pour résumer : la commune s'occupe de l'école, le département du collège, la région du lycée. L'État, lui, fixe les programmes, paie les professeurs et délivre les diplômes. Ce n'est donc pas l'État qui s'occupe de tout : chacun a son rôle.",
    anim(t,a){ const s=a.seg; a.op(R.ph1,0); a.op(R.ph2,0); a.op(R.q,0); a.op(R.sy,s(t,0,.1)); R.cols.forEach((c,i)=>{ const v=s(t,.1+i*.1,.22+i*.1); a.op(c,v); a.tr(c,0,(1-v)*30); }); a.op(R.myth,s(t,.6,.75)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
