/* META {"id":"sciences-A1-velo-transmission","matiere":"sciences","annee":"A","periode":1,"theme":"Les objets techniques : la transmission du mouvement","resume":"Un tour de pédale, combien de tours de roue ? Le plateau, la chaîne et le pignon expliquent la distance parcourue.","motsCles":["vélo","transmission","plateau","pignon","chaîne","objet technique"]} */
(function(){
let R={}, NP=11, NPsel=null, manT=1, spinId=0; const NPL=44; const PIG=[11,22,44]; // dents du pignon / du plateau (NPsel : choix de l'élève, null = démonstration automatique)
const C={frame:"#2563A8",tr:"#E07A1F",wheel:"#1E2430",brake:"#C0392B",dir:"#7B3F98",ink:"#1E2430",gr:"#2E8B57"};
const RW=[430,600], FW=[1130,600], BB=[720,620], RR=165, RPL=72, CIRC=2.1; // circonférence (m)
const rP=()=>RPL*NP/NPL;
function gear(n,r){ let d=""; const th=Math.min(7,r*0.22); for(let i=0;i<n;i++){ const a0=i/n*2*Math.PI, a1=(i+.25)/n*2*Math.PI, a2=(i+.5)/n*2*Math.PI, a3=(i+.75)/n*2*Math.PI;
  const p=(a,rr)=>`${(rr*Math.cos(a)).toFixed(1)},${(rr*Math.sin(a)).toFixed(1)}`; d+=(i?"L":"M")+p(a0,r-th)+" L"+p(a1,r+th*.6)+" L"+p(a2,r+th*.6)+" L"+p(a3,r-th)+" "; } return d+"Z"; }
function chainPath(){ // courroie entre plateau (BB,RPL) et pignon (RW,rP)
  const [x1,y1]=BB,[x2,y2]=RW, r1=RPL, r2=rP(); const dx=x2-x1, dy=y2-y1, D=Math.hypot(dx,dy); const base=Math.atan2(dy,dx); const g=Math.acos((r1-r2)/D);
  const t1=base+g, t2=base-g; // angles des points de tangence
  const P=(c,r,a)=>[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];
  const a1=P(BB,r1,t1), b1=P(RW,r2,t1), a2=P(BB,r1,t2), b2=P(RW,r2,t2);
  return `M${a1} L${b1} A${r2},${r2} 0 0 1 ${b2} L${a2} A${r1},${r1} 0 1 1 ${a1}Z`; }
function pose(a,theta,shift){ // theta : angle du pédalier (rad)
    const tp=theta*NPL/NP; a.set(R.pignon,{d:gear(NP,rP()),transform:`translate(${RW}) rotate(${tp*180/Math.PI})`}); a.set(R.pignonDot,{cx:RW[0]+rP()*.6*Math.cos(tp),cy:RW[1]+rP()*.6*Math.sin(tp)});
    a.set(R.plateau,{transform:`translate(${BB}) rotate(${theta*180/Math.PI})`}); a.set(R.platDot,{cx:BB[0]+RPL*.7*Math.cos(theta),cy:BB[1]+RPL*.7*Math.sin(theta)});
    a.set(R.mani,{transform:`translate(${BB}) rotate(${theta*180/Math.PI})`});
    a.set(R.chain,{d:chainPath(),"stroke-dashoffset":-theta*RPL});
    R.wR.sp.setAttribute("transform",`rotate(${tp*180/Math.PI})`); R.wF.sp.setAttribute("transform",`rotate(${tp*180/Math.PI})`);
    a.set(R.marks,{"stroke-dashoffset":(shift?tp*RR:0)});
    return tp;
  }
Anim.run({
  titre:"Le vélo : comment le mouvement est-il transmis ?",
  sousTitre:"Sciences et technologie · CM1-CM2 · Les objets techniques",
  matiere:"sciences", badge:"Sciences",
  accroche:"Quand je pédale une fois, combien de fois la roue tourne-t-elle ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a; const L=a.layer("velo"); R.L=L;
    R.road=el("g",{},L); el("rect",{x:0,y:RW[1]+RR,width:1600,height:900,fill:"#E3E7EC"},R.road); R.marks=el("path",{stroke:"#fff","stroke-width":8,"stroke-dasharray":"60 60",d:`M-200,${RW[1]+RR+40} L1800,${RW[1]+RR+40}`},R.road);
    const wheel=(c)=>{ const g=el("g",{},L); el("circle",{cx:0,cy:0,r:RR,fill:"none",stroke:C.wheel,"stroke-width":16},g); el("circle",{cx:0,cy:0,r:RR-14,fill:"none",stroke:"#9AA3B2","stroke-width":4},g); const sp=el("g",{},g); for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; el("line",{x1:0,y1:0,x2:(RR-14)*Math.cos(a),y2:(RR-14)*Math.sin(a),stroke:"#9AA3B2","stroke-width":2},sp);} el("circle",{cx:RR-14,cy:0,r:9,fill:C.brake},sp); el("circle",{r:12,fill:"#555"},g); g.sp=sp; a.tr(g,c[0],c[1]); return g; };
    R.wR=wheel(RW); R.wF=wheel(FW);
    // cadre
    R.cadre=el("path",{d:`M${RW} L${BB} L660,340 L${RW} M660,340 L1030,360 L${BB} M1030,360 L${FW} M1030,360 L1010,300`,fill:"none",stroke:C.frame,"stroke-width":16,"stroke-linejoin":"round","stroke-linecap":"round"},L);
    R.selle=el("path",{d:"M610,320 Q660,300 715,322 L700,334 L620,332Z",fill:"#333"},L); el("line",{x1:660,y1:340,x2:660,y2:325,stroke:"#333","stroke-width":8},L);
    R.guidon=el("path",{d:"M1010,300 Q1040,280 1090,300 L1100,320",fill:"none",stroke:"#333","stroke-width":10,"stroke-linecap":"round"},L);
    R.frein=el("g",{},L); el("path",{d:`M1080,305 Q1070,330 1060,340`,fill:"none",stroke:C.brake,"stroke-width":5},R.frein); el("rect",{x:1112,y:425,width:30,height:14,rx:4,fill:C.brake},R.frein); el("path",{d:"M1062,340 Q1100,380 1125,425",fill:"none",stroke:"#555","stroke-width":2.5},R.frein);
    // transmission
    R.chain=el("path",{fill:"none",stroke:"#3A3A3A","stroke-width":9,"stroke-dasharray":"7 5"},L);
    R.pignon=el("path",{fill:"#B8BEC8",stroke:"#555","stroke-width":2},L); R.pignonDot=el("circle",{r:4,fill:C.tr},L);
    R.plateau=el("path",{d:gear(NPL,RPL),fill:"#C8CED6",stroke:"#555","stroke-width":2},L); R.platDot=el("circle",{r:6,fill:C.tr},L);
    R.mani=el("g",{},L); el("line",{x1:0,y1:0,x2:0,y2:95,stroke:"#444","stroke-width":12,"stroke-linecap":"round"},R.mani); el("rect",{x:-26,y:88,width:52,height:16,rx:4,fill:"#222"},R.mani); el("circle",{r:14,fill:"#666"},R.mani);
    // étiquettes de constitution
    const lab=a.layer("lab"); R.lab=lab; R.labs={};
    const LB=(id,x,y,txt,col,tx,ty)=>{ const g=el("g",{},lab); a.label(g,x,y,txt,{size:22,stroke:col,color:col}); a.arrow(g,`M${x},${y+(ty>y?18:-18)} L${tx},${ty}`,{color:col,w:3}); R.labs[id]=g; };
    LB("cadre",860,200,"cadre",C.frame,840,355); LB("selle",520,230,"selle",C.frame,610,315); LB("guidon",1250,230,"guidon (diriger)",C.dir,1090,300); LB("frein",1330,400,"freins (s'arrêter)",C.brake,1145,430);
    LB("roue",180,330,"roues",C.wheel,330,470); LB("plateau",860,800,"pédalier + plateau",C.tr,735,700); LB("chaine",560,830,"chaîne",C.tr,580,640); LB("pignon",230,830,"pignon",C.tr,420,620);
    R.leg=el("g",{},lab); [["structure",C.frame],["transmettre le mouvement",C.tr],["diriger",C.dir],["freiner",C.brake]].forEach(([t,c],i)=>{ el("rect",{x:40+i*330,y:40,width:26,height:26,rx:6,fill:c},R.leg); el("text",{x:76+i*330,y:62,"font-size":22,"font-weight":700,fill:C.ink,text:t},R.leg); });
    // compteurs
    const cpt=a.layer("cpt"); R.cpt=cpt; R.cptB=el("rect",{x:1180,y:30,width:390,height:250,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},cpt);
    R.c1=el("text",{x:1205,y:85,"font-size":26,"font-weight":800,fill:C.tr},cpt); R.c2=el("text",{x:1205,y:135,"font-size":26,"font-weight":800,fill:C.ink},cpt); R.c3=el("text",{x:1205,y:185,"font-size":26,"font-weight":800,fill:C.gr},cpt); R.c4=el("text",{x:1205,y:240,"font-size":22,fill:"#4A5468"},cpt);
    R.dents=el("g",{},a.svg); const pill=(x,y,col)=>{ const g=a.label(R.dents,x,y,"plateau : 44 dents",{size:24,stroke:col,color:col,w:310,h:54}); return g.querySelector("text"); };
    R.dT1=pill(930,805,C.tr); R.dT2=pill(300,805,C.tr); R.dA1=a.arrow(R.dents,"M850,780 L765,688",{color:C.tr,w:4}); R.dA2=a.arrow(R.dents,"M330,778 L418,640",{color:C.tr,w:4});
    // tableau des pignons (étape 5)
    R.tab=el("g",{},a.svg); el("text",{x:40,y:60,"font-size":26,"font-weight":800,fill:C.ink,text:"Un tour de pédale · plateau de 44 dents · trois pignons (exemples)"},R.tab);
    R.rows=PIG.map((n,i)=>{ const g=el("g",{},R.tab), y=82+i*64, r=44/n; R.rows; const bg=el("rect",{x:40,y,width:1110,height:54,rx:12,fill:"#FBEFE2",stroke:C.tr,"stroke-width":3},g);
      el("text",{x:62,y:y+37,"font-size":26,"font-weight":800,fill:C.ink,text:`pignon ${n} dents`},g);
      el("text",{x:330,y:y+37,"font-size":26,"font-weight":700,fill:C.ink,text:`→ ${r} tour${r>1?"s":""} de roue`},g);
      el("text",{x:620,y:y+37,"font-size":26,"font-weight":800,fill:C.gr,text:`→ ${(r*CIRC).toFixed(1).replace(".",",")} m`},g);
      el("rect",{x:790,y:y+14,width:130,height:26,rx:13,fill:"#fff",stroke:C.ink,"stroke-width":2},g); el("rect",{x:792,y:y+16,width:Math.max(8,126*r/4),height:22,rx:11,fill:C.brake},g);
      el("text",{x:935,y:y+37,"font-size":24,"font-weight":700,fill:C.ink,text:["effort fort","effort moyen","effort faible"][i]},g); g.bg=bg; return g; });
    // photos « dans la réalité »
    R.phP=a.photo(a.svg,{id:"s-a1-plateau",x:60,y:50,w:340,h:160,cap:"En vrai : plateau et chaîne",size:20,rot:-1.5});
    R.phC=a.photo(a.svg,{id:"s-a1-cassette",x:470,y:50,w:340,h:160,cap:"En vrai : pignons de roue arrière",size:20,rot:1.5});
    // manipulation : choix du pignon (barre #manip), la roue refait un tour de pédale à chaque choix
    a.manip.innerHTML=`Pignon arrière : `+PIG.map(n=>`<button data-n="${n}">${n} dents</button>`).join("");
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ NPsel=+b.dataset.n; const id=++spinId, t0=performance.now(); const f=now=>{ if(id!==spinId) return; manT=Math.min(1,(now-t0)/2600); a.redraw(); if(manT<1) requestAnimationFrame(f); }; manT=0; requestAnimationFrame(f); a.redraw(); });
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:80,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"La chaîne de transmission du mouvement"},sy);
    R.ch=["mes jambes","pédales","plateau","chaîne","pignon","roue arrière","le vélo avance"].map((t,i)=>{ const g=el("g",{},sy); const x=120+i*228; a.label(g,x,220,t,{size:23,stroke:i===6?C.gr:C.tr,color:i===6?C.gr:"#8A4A0E",w:200,h:80}); if(i<6) a.arrow(g,`M${x+102},220 L${x+124},220`,{color:"#9AA3B2",w:5,head:3}); return g; });
    R.syT=el("text",{x:800,y:350,"text-anchor":"middle","font-size":26,fill:C.ink,text:"Le pignon et la roue arrière sont fixés ensemble : ils font le même nombre de tours."},sy);
    R.myth=a.layer("myth"); a.myth(R.myth,200,430,1200,"Un grand pignon à l'arrière fait aller plus vite.","C'est l'inverse ! Un petit pignon fait tourner la roue plus de fois à chaque tour de pédale : on va plus vite, mais c'est plus dur. Un grand pignon rend la montée plus facile.");
  },
  reset(a){ [R.lab,R.cpt,R.dents,R.tab,R.phP,R.phC,R.syn,R.myth,R.leg,...Object.values(R.labs)].forEach(e=>a.op(e,0)); a.op(R.L,1); NP=11; a.set(R.cptB,{height:250}); pose(a,0,false); },
  etapes:[
  { titre:"De quoi est fait un vélo ?", duree:9000,
    legende:"Un vélo est un objet technique. Chaque partie a une fonction : le cadre porte, les roues roulent, le guidon dirige, les freins arrêtent, et la transmission fait avancer.",
    voix:"Un vélo est un objet technique. Chaque partie a une fonction. Le cadre et la selle forment la structure. Les roues roulent. Le guidon permet de diriger, les freins de s'arrêter. Et les pédales, le plateau, la chaîne et le pignon forment la transmission : ce sont eux qui font avancer le vélo.",
    anim(t,a){ const s=a.seg; a.op(R.lab,1); a.op(R.leg,s(t,0,.1)); ["cadre","selle","roue","guidon","frein","plateau","chaine","pignon"].forEach((k,i)=>a.op(R.labs[k],s(t,.08+i*.1,.16+i*.1))); } },
  { titre:"Je pédale : le plateau tourne", duree:7000,
    legende:"Quand j'appuie sur les pédales, le pédalier fait tourner le plateau. Pédales et plateau sont fixés ensemble : ils font exactement le même nombre de tours.",
    voix:"Quand j'appuie sur les pédales, je fais tourner le pédalier. Le plateau est fixé aux pédales : il fait exactement le même nombre de tours qu'elles. Mais comment ce mouvement arrive-t-il jusqu'à la roue arrière, qui est loin ?",
    anim(t,a){ const s=a.seg; a.op(R.lab,1); Object.values(R.labs).forEach(l=>a.op(l,1-s(t,0,.1))); a.op(R.leg,1-s(t,0,.1)); const th=2*Math.PI*s(t,.15,.9); pose(a,th,false); a.op(R.cpt,s(t,.1,.2)); a.set(R.cptB,{height:90});
      R.c1.textContent=`Tours de pédale : ${(th/2/Math.PI).toFixed(1).replace(".",",")}`; R.c2.textContent=""; R.c3.textContent=""; R.c4.textContent="";
      a.cls(R.plateau,"glow",t>.15&&t<.9); a.op(R.phP,s(t,.3,.5)); } },
  { titre:"La chaîne transmet le mouvement", duree:12000,
    legende:"La chaîne relie le plateau (44 dents) au pignon (11 dents). Quand 44 maillons passent, le petit pignon fait 4 tours ! 1 tour de pédale = 4 tours de pignon.",
    voix:"La chaîne relie le plateau au pignon de la roue arrière. Comptons les dents : le plateau en a quarante-quatre, le pignon seulement onze. Quand je fais un tour de pédale, quarante-quatre maillons de chaîne avancent. Pour les laisser passer, le petit pignon doit faire quatre tours ! Un tour de pédale donne donc quatre tours de pignon.",
    anim(t,a){ const s=a.seg; a.op(R.cpt,1); a.set(R.cptB,{height:200}); a.op(R.dents,s(t,0,.1)); R.dT1.textContent=`plateau : ${NPL} dents`; R.dT2.textContent=`pignon : ${NP} dents`; a.cls(R.chain,"glow",t>.1&&t<.9); a.op(R.phP,1); a.op(R.phC,s(t,.2,.4));
      const th=2*Math.PI*s(t,.12,.92,true); const tp=pose(a,th,false); R.c1.textContent=`Tours de pédale : ${(th/2/Math.PI).toFixed(2).replace(".",",")}`; R.c2.textContent=`Tours de pignon : ${(tp/2/Math.PI).toFixed(2).replace(".",",")}`; R.c3.textContent=""; R.c4.textContent=`maillons passés : ${Math.round(th/2/Math.PI*NPL)}`; } },
  { titre:"La roue avance", duree:12000,
    legende:"Le pignon est fixé à la roue arrière : elle fait aussi 4 tours. Une roue fait environ 2,1 m par tour : 1 tour de pédale fait avancer le vélo d'environ 8,4 m !",
    voix:"Le pignon est fixé à la roue arrière : la roue fait donc, elle aussi, quatre tours. À chaque tour, une roue de vélo avance d'environ deux mètres dix. Résultat : un seul tour de pédale fait avancer le vélo d'environ huit mètres quarante !",
    anim(t,a){ const s=a.seg; a.op(R.cpt,1); a.set(R.cptB,{height:250}); a.op(R.dents,1); a.op(R.phP,1); a.op(R.phC,1); R.dT1.textContent=`plateau : ${NPL} dents`; R.dT2.textContent=`pignon : ${NP} dents`;
      const th=2*Math.PI*s(t,.08,.9,true); const tp=pose(a,th,true); const tw=tp/2/Math.PI;
      R.c1.textContent=`Tours de pédale : ${(th/2/Math.PI).toFixed(2).replace(".",",")}`; R.c2.textContent=`Tours de roue : ${tw.toFixed(2).replace(".",",")}`; R.c3.textContent=`Distance : ${(tw*CIRC).toFixed(1).replace(".",",")} m`; R.c4.textContent="1 tour de roue ≈ 2,1 m (exemple)";
      a.cls(R.wR,"glow",t>.08&&t<.9); } },
  { titre:"À vous : choisissez le pignon", duree:14000,
    legende:"Petit pignon : plus de tours de roue, on va vite mais c'est dur. Grand pignon : facile en côte. À vous : choisissez un pignon avec les boutons, regardez ce qui change.",
    voix:"Changeons de pignon, sans toucher au plateau. Avec onze dents, un tour de pédale donne quatre tours de roue : on avance loin, mais il faut beaucoup forcer. Avec vingt-deux dents, deux tours de roue seulement : c'est plus facile. Avec quarante-quatre dents, un seul tour de roue : on avance peu, mais pédaler est très doux. À vous maintenant : choisissez un pignon avec les boutons, et regardez ce qui change. Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ NPsel=null; manT=1; }
      a.op(R.cpt,1); a.set(R.cptB,{height:250}); a.op(R.dents,1); a.op(R.phP,1-s(t,0,.08)); a.op(R.phC,1-s(t,0,.08)); a.op(R.tab,s(t,0,.08));
      const auto=NPsel===null; const ph=Math.min(2,Math.max(0,Math.floor((t-.08)/.29))); const loc=s(t,.08+ph*.29,.08+(ph+1)*.29,true);
      NP=auto?PIG[ph]:NPsel; const th=2*Math.PI*(auto?loc:manT); const tp=pose(a,th,true); const ratio=NPL/NP;
      R.dT1.textContent=`plateau : ${NPL} dents`; R.dT2.textContent=`pignon : ${NP} dents`;
      R.rows.forEach((g,i)=>{ const here=PIG[i]===NP; a.op(g,!auto||t>.08+i*.29-.02?1:0); a.set(g.bg,{fill:here?"#FFD9AE":"#FBEFE2","stroke-width":here?5:3}); });
      if(a.manip) a.manip.querySelectorAll("button").forEach(b=>b.classList.toggle("sel",+b.dataset.n===NP));
      R.c1.textContent=`Pédale : ${(th/2/Math.PI).toFixed(2).replace(".",",")} tour`; R.c2.textContent=`Roue : ${(tp/2/Math.PI).toFixed(2).replace(".",",")} tour${ratio>1?"s":""}`; R.c3.textContent=`Distance : ${(tp/2/Math.PI*CIRC).toFixed(1).replace(".",",")} m`; R.c4.textContent=`${NPL} ÷ ${NP} = ${ratio.toFixed(0)}`; } },
  { titre:"Synthèse", duree:9000,
    legende:"Le mouvement passe des jambes aux pédales, au plateau, à la chaîne, au pignon puis à la roue. Le rapport des dents fixe la distance parcourue à chaque tour de pédale.",
    voix:"Récapitulons. Le mouvement de mes jambes passe aux pédales, puis au plateau, à la chaîne, au pignon, et enfin à la roue arrière : le vélo avance. Le nombre de dents du plateau et du pignon décide du nombre de tours que fait la roue à chaque coup de pédale.",
    anim(t,a){ const s=a.seg; a.op(R.syn,s(t,0,.1)); R.ch.forEach((g,i)=>a.op(g,s(t,.08+i*.07,.15+i*.07))); a.op(R.syT,s(t,.55,.65)); a.op(R.myth,s(t,.7,.82)); a.cls(R.myth.faux,"pulse",t>.82&&t<1); } },
  ]
});
})();
