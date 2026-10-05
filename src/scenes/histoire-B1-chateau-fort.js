/* META {"id":"histoire-B1-chateau-fort","matiere":"histoire","annee":"B","periode":1,"theme":"Le château fort au Moyen Âge : protéger, habiter, montrer sa puissance","resume":"De la motte castrale au château de pierre : comment le château protège, abrite le seigneur et montre sa puissance sur la seigneurie.","motsCles":["château fort","motte castrale","donjon","douves","pont-levis","herse","seigneur","seigneurie","Moyen Âge"]} */
(function(){
let pT=1; const fresh=t=>{ const f=t<pT-.05; pT=t; return f; }; // vrai quand l'étape (re)démarre : remet la manipulation à zéro
let R={}, pont=true, pv=1, manuel=false, tok=0; // pont-levis levé ? pv = position affichée (1 levé, 0 baissé)
const C={sky:"#E6F1FA",grass:"#BFD9A0",stone:"#D9CCB3",stoneD:"#8C7A5B",wood:"#A9743F",woodD:"#6B4524",water:"#6FA8D6",or:"#E07A1F",red:"#C0392B",bl:"#2563A8",gr:"#2E8B57",ink:"#1E2430"};
const K=C.ink;
const IC={
  longue:e=>{ const r=e("g",{transform:"rotate(-25)"}); e("rect",{x:-44,y:-8,width:62,height:16,rx:3,fill:"#7A8494",stroke:K,"stroke-width":3},r); e("rect",{x:18,y:-13,width:30,height:26,rx:4,fill:"#5A6478",stroke:K,"stroke-width":3},r); e("path",{d:"M-6,10 L-26,46 M-6,10 L14,46",stroke:C.woodD,"stroke-width":5,"stroke-linecap":"round"}); },
  lit:e=>{ e("rect",{x:-44,y:-26,width:10,height:62,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("rect",{x:-44,y:4,width:88,height:18,fill:"#E0C070",stroke:C.woodD,"stroke-width":3}); e("rect",{x:44,y:-6,width:8,height:42,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("rect",{x:-32,y:-10,width:30,height:14,rx:6,fill:"#fff",stroke:K,"stroke-width":3}); },
  salle:e=>{ e("rect",{x:-46,y:6,width:92,height:10,rx:3,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("path",{d:"M-34,16 L-34,44 M34,16 L34,44",stroke:C.woodD,"stroke-width":6}); e("path",{d:"M-26,6 L-20,-18 L-4,-18 L2,6Z",fill:"#E8C84A",stroke:K,"stroke-width":3}); e("ellipse",{cx:24,cy:2,rx:18,ry:6,fill:"#C9605A",stroke:K,"stroke-width":3}); e("path",{d:"M-12,-18 L-12,-34",stroke:C.or,"stroke-width":4}); },
  reserve:e=>{ e("path",{d:"M-44,40 Q-52,-6 -30,-22 L-6,-22 Q16,-6 8,40Z",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3.5}); e("path",{d:"M-30,-22 L-18,-36 L-6,-22",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3.5}); e("rect",{x:14,y:-6,width:36,height:46,rx:8,fill:C.wood,stroke:C.woodD,"stroke-width":3}); e("path",{d:"M14,6 L50,6 M14,26 L50,26",stroke:C.woodD,"stroke-width":3}); },
  bouclier:e=>{ e("path",{d:"M-34,-38 L34,-38 L34,0 Q34,30 0,46 Q-34,30 -34,0Z",fill:C.bl,stroke:K,"stroke-width":4,"stroke-linejoin":"round"}); e("path",{d:"M0,-38 L0,44 M-34,-8 L34,-8",stroke:"#fff","stroke-width":6}); },
  maison:e=>{ e("rect",{x:-34,y:-6,width:68,height:50,fill:"#EADBC0",stroke:K,"stroke-width":4}); e("path",{d:"M-44,-4 L0,-42 L44,-4Z",fill:C.red,stroke:K,"stroke-width":4}); e("rect",{x:-9,y:16,width:18,height:28,fill:C.woodD}); },
  couronne:e=>{ e("path",{d:"M-38,26 L-44,-24 L-20,-4 L0,-36 L20,-4 L44,-24 L38,26Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":4,"stroke-linejoin":"round"}); e("rect",{x:-38,y:20,width:76,height:12,fill:"#E0A800",stroke:"#8A6A00","stroke-width":3}); [-44,0,44].forEach((x,i)=>e("circle",{cx:x,cy:i===1?-38:-26,r:6,fill:C.red,stroke:"#8A6A00","stroke-width":2})); }
};
function majBoutons(){ if(R.bUp){ R.bUp.classList.toggle("sel",pont); R.bDown.classList.toggle("sel",!pont); } }
function icon(a,parent,nom,x,y,s){ const g=a.el("g",{transform:`translate(${x},${y}) scale(${s||1})`},parent); IC[nom]((t,at,par)=>a.el(t,at,par||g)); return g; }
function ph(a,parent,o){ const g=a.el("g",{},parent); const p=a.photo(g,o); g._missing=p._missing; if(!p._missing) a.el("text",{x:o.x+o.w/2,y:o.y-26,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#8A3A00",text:"Dans la réalité"},g); return g; }
const GY=700;
function cren(x,y,w,n){ let d=`M${x},${y}`; const cw=w/(2*n-1); for(let i=0;i<2*n-1;i++){ const up=i%2===0; d+=up?` l0,-22 l${cw},0 l0,22`:` l${cw},0`; } return d; }
function person(a,p,col,s){ const g=a.el("g",{},p); a.el("circle",{cx:0,cy:-50,r:11,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2},g); a.el("path",{d:"M-13,-38 L13,-38 L18,0 L-18,0Z",fill:col,stroke:C.ink,"stroke-width":2},g); g._s=s||1; return g; }
Anim.run({
  titre:"Le château fort : à quoi sert-il ?",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Un château fort, ce n'est pas seulement pour faire la guerre…",
  manipDes:2, manipJusqua:2,
  init(a){
    const {el}=a; const bg=a.layer("bg");
    el("rect",{x:0,y:0,width:1600,height:GY,fill:C.sky,rx:14},bg); el("rect",{x:0,y:GY,width:1600,height:200,fill:C.grass},bg);
    // ---- motte castrale (bois)
    const mo=el("g",{},bg); R.motte=mo;
    R.mound=el("path",{d:`M480,${GY} Q800,430 1120,${GY}Z`,fill:"#9BBF78",stroke:"#5E7F3E","stroke-width":3},mo);
    R.wTower=el("g",{},mo); el("rect",{x:740,y:380,width:120,height:180,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.wTower); for(let i=0;i<6;i++) el("line",{x1:740,y1:400+i*28,x2:860,y2:400+i*28,stroke:C.woodD,"stroke-width":2},R.wTower); el("path",{d:"M728,384 L800,320 L872,384Z",fill:C.woodD},R.wTower);
    R.pal=el("g",{},mo); for(let i=0;i<22;i++){ const x=640+i*15; el("path",{d:`M${x},${600} l0,-50 l6,-10 l6,10 l0,50Z`,fill:C.wood,stroke:C.woodD,"stroke-width":1.5},R.pal); }
    R.bc=el("g",{},mo); for(let i=0;i<20;i++){ const x=160+i*15; el("path",{d:`M${x},${GY} l0,-40 l6,-10 l6,10 l0,40Z`,fill:C.wood,stroke:C.woodD,"stroke-width":1.5},R.bc); } el("text",{x:310,y:640,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.woodD,text:"basse-cour"},R.bc);
    R.mLab=el("text",{x:800,y:290,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.woodD,text:"Motte castrale en bois (vers l'an 1000)"},mo);
    // ---- château de pierre
    const ca=el("g",{id:"chateau"},bg); R.ch=ca; const st={fill:C.stone,stroke:C.stoneD,"stroke-width":3};
    R.donjon=el("g",{},ca); el("rect",Object.assign({x:900,y:230,width:170,height:300},st),R.donjon); el("path",Object.assign({d:cren(900,230,170,5)},st),R.donjon); el("rect",{x:970,y:300,width:24,height:40,rx:10,fill:"#3E4B5C"},R.donjon);
    el("rect",Object.assign({x:450,y:470,width:700,height:230},st),ca); el("path",Object.assign({d:cren(450,470,700,17)},st),ca);
    R.mach=el("g",{},ca); for(let i=0;i<8;i++) el("path",{d:`M${720+i*20},${470} l0,16 l10,0 l0,-16`,fill:"#7A6A50"},R.mach);
    [[400,370],[1110,370]].forEach(([x,y])=>{ el("rect",Object.assign({x,y,width:90,height:GY-y},st),ca); el("path",Object.assign({d:cren(x,y,90,3)},st),ca); el("rect",{x:x+38,y:y+60,width:12,height:40,fill:"#3E4B5C"},ca); el("rect",{x:x+38,y:y+170,width:12,height:40,fill:"#3E4B5C"},ca); });
    el("rect",Object.assign({x:730,y:420,width:140,height:280},st),ca); el("path",Object.assign({d:cren(730,420,140,4)},st),ca);
    el("path",{d:`M760,${GY} L760,600 Q800,560 840,600 L840,${GY}Z`,fill:"#2B2B2B"},ca);
    R.herse=el("g",{},ca); for(let i=0;i<5;i++) el("line",{x1:765+i*17,y1:585,x2:765+i*17,y2:GY,stroke:"#555","stroke-width":4},R.herse); for(let j=0;j<4;j++) el("line",{x1:760,y1:610+j*25,x2:840,y2:610+j*25,stroke:"#555","stroke-width":4},R.herse);
    R.douves=el("rect",{x:300,y:GY+2,width:1000,height:60,fill:C.water,stroke:"#3C78A8","stroke-width":2},bg);
    R.pont=el("rect",{x:756,y:GY-4,width:88,height:66,fill:C.wood,stroke:C.woodD,"stroke-width":3},bg);
    R.cLab=el("text",{x:800,y:190,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#5A4A30",text:"Château fort en pierre (XIIe-XIIIe siècles)"},bg);
    // étiquettes de défense
    const lab=a.layer("labels"); R.labs={};
    const L=(id,x,y,txt,tx,ty)=>{ const g=el("g",{},lab); const lb=a.label(g,x,y,txt,{size:22,stroke:C.bl,color:C.bl}); const dx=tx-x; const side=Math.abs(dx)>lb._w/2+20; const sx=side?x+Math.sign(dx)*lb._w/2:x, sy=side?y:y+(ty>y?1:-1)*lb._h/2; a.arrow(g,`M${sx},${sy} L${tx},${ty}`,{color:C.bl,w:3}); R.labs[id]=g; };
    L("douves",1270,830,"douves pleines d'eau",1220,740); L("pont",1000,830,"pont-levis",846,740); L("herse",620,560,"herse",758,630);
    L("tour",250,300,"tours : on tire\nle long des murs",400,400); L("mach",620,380,"mâchicoulis",725,478); L("donjon",1290,240,"donjon :\ndernier refuge",1072,280); L("chemin",1300,430,"chemin de ronde",1150,462);
    // attaquants
    R.att=[...Array(6)].map((_,i)=>{ const p=person(a,lab,C.red); return p; });
    R.fleches=[...Array(6)].map(()=>el("line",{stroke:"#3E2A14","stroke-width":3},lab)); R.pierres=[...Array(3)].map(()=>el("circle",{r:10,fill:"#7A6A50"},lab));
    R.status=el("text",{x:800,y:880,"text-anchor":"middle","font-size":28,"font-weight":800},lab);
    // coupe du donjon
    const cp=a.layer("coupe"); R.coupe=cp;
    el("rect",{x:1040,y:30,width:530,height:840,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},cp);
    el("text",{x:1305,y:78,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Dans le donjon (coupe)"},cp);
    const F=[["longue","Le guet","surveiller les environs"],["lit","La chambre","du seigneur et de sa famille"],["salle","La grande salle","repas, fêtes, justice, réunions"],["reserve","Les réserves","grain, vin, armes + un puits"]];
    R.floors=F.map((f,i)=>{ const g=el("g",{},cp); const y=110+i*185; el("rect",{x:1080,y,width:450,height:170,fill:["#EEF3F8","#F6EEE4","#FBF3E2","#EFE8DA"][i],stroke:C.stoneD,"stroke-width":3},g); icon(a,g,f[0],1138,y+88,.95); el("text",{x:1200,y:y+75,"font-size":28,"font-weight":800,fill:C.ink,text:f[1]},g); el("text",{x:1200,y:y+115,"font-size":22,fill:"#4A5468",text:f[2]},g); return g; });
    R.bcList=el("g",{},cp);
    // seigneurie
    const sg=a.layer("seigneurie"); R.sg=sg;
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#DCEBC8",rx:14},sg);
    el("path",{d:"M600,520 Q800,220 1000,520Z",fill:"#A9C98A",stroke:"#5E7F3E","stroke-width":3},sg);
    const use=el("use",{href:"#chateau",transform:"translate(800,330) scale(.28) translate(-800,-470)"},sg);
    const vill=[[260,640,"village"],[1330,660,"village"],[420,250,"hameau"],[1250,260,"moulin"]];
    R.vill=vill.map(([x,y,n])=>{ const g=el("g",{},sg); for(let i=0;i<3;i++){ el("rect",{x:x-60+i*42,y:y-20,width:34,height:28,fill:"#EADBC0",stroke:"#7A6A4E"},g); el("path",{d:`M${x-64+i*42},${y-18} l21,-20 l21,20Z`,fill:"#B9A27A"},g);} el("text",{x,y:y+40,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#3F5A2A",text:n},g); g._x=x; g._y=y; return g; });
    R.champs=[[120,420,"champs"],[1380,460,"champs"],[700,760,"champs du seigneur"]].map(([x,y,n])=>{ const g=el("g",{},sg); el("rect",{x:x-90,y:y-40,width:180,height:80,fill:"#E2C77A",stroke:"#B39248","stroke-width":2},g); el("text",{x,y:y+8,"text-anchor":"middle","font-size":20,"font-weight":700,fill:"#6B5520",text:n},g); return g; });
    R.liens=vill.map(([x,y])=>{ const ar=a.arrow(sg,`M800,420 Q${(800+x)/2},${(420+y)/2-80} ${x},${y-40}`,{color:C.red,w:5,dash:"12 8"}); return ar; });
    R.refuge=[...Array(6)].map(()=>person(a,sg,"#8C6D46"));
    R.sgT=el("text",{x:800,y:60,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink,text:"La seigneurie : le château domine le paysage"},sg);
    R.sgL=el("g",{},sg); a.label(R.sgL,800,850,"Le seigneur commande, rend la justice, fait payer des taxes… et protège.",{size:24,stroke:C.red,color:C.red});
    // synthèse
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    el("text",{x:800,y:80,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"Les 3 fonctions du château fort"},sy);
    R.f3=[["bouclier","Protéger","murs, tours, douves, donjon ;\nrefuge des paysans",C.bl],["maison","Habiter","maison du seigneur,\nde sa famille, de ses soldats",C.gr],["couronne","Montrer sa puissance","il domine le paysage ;\ncentre du pouvoir du seigneur",C.red]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:330,rx:18,fill:"#fff",stroke:f[3],"stroke-width":4},g); icon(a,g,f[0],x,195,1.2); el("text",{x,y:290,"text-anchor":"middle","font-size":32,"font-weight":800,fill:f[3],text:f[1]},g); const t=el("text",{x,y:340,"text-anchor":"middle","font-size":24,fill:C.ink},g); f[2].split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},t)); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,200,500,1200,"Le château fort sert seulement à faire la guerre, et tous les paysans y habitent.","C'est surtout la maison du seigneur et le centre de son pouvoir ; les paysans vivent au village et s'y réfugient en cas de danger.");
    // photos "Dans la réalité"
    const pl=a.layer("photos");
    R.phG=ph(a,pl,{id:"h-b1-guedelon",x:40,y:90,w:330,h:215,cap:"Chantier de Guédelon (Yonne)",rot:-1.5});
    R.phP=ph(a,pl,{id:"h-b1-pontlevis",x:1300,y:505,w:260,h:120,cap:"Un pont-levis relevé",rot:1.5});
    R.phC=ph(a,pl,{id:"h-b1-chateauneuf",x:36,y:92,w:276,h:170,cap:"Châteauneuf-en-Auxois",rot:-1.5});
    // manipulation : le pont-levis
    a.manip.innerHTML=`<span style="font-size:24px"><b>À vous :</b> le pont-levis</span> <button id="mUp" class="sel" style="font-size:22px;min-height:50px">levé</button><button id="mDown" style="font-size:22px;min-height:50px">baissé</button>`;
    R.bUp=document.getElementById("mUp"); R.bDown=document.getElementById("mDown");
    const go=up=>{ pont=up; manuel=true; majBoutons(); const my=++tok, t0=performance.now(), v0=pv, v1=up?1:0; (function f(now){ if(my!==tok) return; const u=Math.min(1,(now-t0)/1100); pv=v0+(v1-v0)*a.ease(u); a.redraw(); if(u<1) requestAnimationFrame(f); })(t0); };
    R.bUp.onclick=()=>go(true); R.bDown.onclick=()=>go(false);
  },
  reset(a){
    [R.motte,R.ch,R.douves,R.pont,R.cLab,R.coupe,R.sg,R.syn,R.myth,R.status,...Object.values(R.labs),...R.att,...R.fleches,...R.pierres,R.herse,R.phG,R.phP,R.phC].forEach(e=>a.op(e,0));
    a.op(R.mound,1); a.op(R.wTower,1); a.op(R.pal,1); a.op(R.bc,1); a.op(R.mLab,1); R.ch.removeAttribute("transform"); R.ch.setAttribute("transform","translate(0,0)");
    a.set(R.pont,{transform:""}); a.set(R.herse,{transform:""}); R.floors.forEach(f=>a.op(f,0));
  },
  etapes:[
  { titre:"Vers l'an 1000 : la motte castrale", duree:7000,
    legende:"Vers l'an 1000, les seigneurs construisent des mottes castrales : une butte de terre, une tour en bois et une palissade. En bas, la basse-cour.",
    voix:"Vers l'an mille, les seigneurs font construire des mottes castrales : une grosse butte de terre, surmontée d'une tour en bois et entourée d'une palissade. En contrebas, une autre enceinte protège la basse-cour, avec les écuries et les ateliers.",
    anim(t,a){ const s=a.seg; a.op(R.motte,1); const m=s(t,0,.35); R.mound.setAttribute("transform",`translate(0,${GY}) scale(1,${Math.max(m,.001)}) translate(0,${-GY})`);
      a.op(R.pal,s(t,.3,.5)); a.op(R.wTower,s(t,.45,.65)); a.tr(R.wTower,0,(1-s(t,.45,.65))*120); a.op(R.bc,s(t,.6,.8)); a.op(R.mLab,s(t,.75,.9)); } },
  { titre:"Le château de pierre", duree:8000,
    legende:"Le bois brûle facilement. Aux XIIe et XIIIe siècles, les seigneurs bâtissent des châteaux en pierre : hautes murailles, tours, donjon et douves.",
    voix:"Mais le bois brûle facilement ! Aux douzième et treizième siècles, les seigneurs qui en ont les moyens font bâtir des châteaux en pierre : de hautes murailles, des tours, un donjon, et tout autour, des fossés remplis d'eau, les douves.",
    anim(t,a){ const s=a.seg; a.op(R.motte,1-s(t,0,.3)); a.op(R.ch,s(t,.2,.3)); const v=Math.max(s(t,.2,.75),.001); R.ch.setAttribute("transform",`translate(0,${GY}) scale(1,${v}) translate(0,${-GY})`);
      a.op(R.douves,s(t,.7,.85)); a.op(R.pont,s(t,.75,.85)); a.op(R.herse,s(t,.75,.85)); a.op(R.cLab,s(t,.85,1)); a.op(R.phG,s(t,.55,.7)); } },
  { titre:"Fonction 1 : protéger", duree:12000,
    legende:"Des ennemis attaquent ! Les douves, le pont-levis levé et la herse les arrêtent, et les défenseurs tirent depuis les tours. À vous : baissez le pont-levis, regardez ce qui change.",
    voix:"Des ennemis attaquent ! Les douves les empêchent d'approcher du mur. Le pont-levis est levé et la herse ferme la porte. Depuis les tours et le chemin de ronde, les défenseurs tirent des flèches, et par les mâchicoulis ils lancent des pierres. Si tout cela échoue, il reste le donjon, le dernier refuge. À vous maintenant : baissez le pont-levis, et regardez ce qui change pour les attaquants !",
    anim(t,a){ const s=a.seg; if(fresh(t)){ manuel=false; pont=true; pv=1; majBoutons(); }
      a.op(R.ch,1); a.op(R.douves,1); a.op(R.pont,1); a.op(R.herse,1); a.op(R.cLab,1-s(t,0,.1)); a.op(R.phG,1-s(t,0,.1)); a.op(R.phP,s(t,.35,.5));
      const fin=t>=1||manuel;                    // fin : la manipulation prend la main
      const rp=fin?pv:s(t,.15,.3);               // 1 = pont-levis levé, 0 = baissé
      const ok=!fin||pv>.99;                      // les attaquants sont-ils repoussés ?
      R.pont.setAttribute("transform",`translate(0,${GY-4}) scale(1,${Math.cos(rp*Math.PI/2)||.001}) translate(0,${-(GY-4)})`);
      R.herse.setAttribute("transform",`translate(0,${-(1-rp)*110})`);
      R.att.forEach((p,i)=>{ const v=s(t,.05,.45); a.op(p,(v>0||manuel)?1:0); let x=a.lerp(-60-i*60,600+i*30,v), y=810+(i%2)*40;
        if(fin){ const g=1-pv; x=a.lerp(100+i*30,800+(i-2.5)*14,g); y=a.lerp(y,GY-10,g); } else if(t>.6){ x-= s(t,.75,1)*500; }
        a.tr(p,x,y-Math.abs(Math.sin(v*20+i))*5,1); });
      ["douves","pont","herse","tour","chemin","mach","donjon"].forEach((k,i)=>a.op(R.labs[k],fin?1:s(t,.3+i*.07,.36+i*.07)));
      R.fleches.forEach((f,i)=>{ const v=s(t,.45+i*.03,.6+i*.03,true); const sx=i%2?1155:445, sy=420+(i%3)*60; const ex=500+i*40, ey=800; a.op(f,v>0&&v<1&&ok&&!fin?1:0); const x=a.lerp(sx,ex,v), y=a.lerp(sy,ey,v); a.set(f,{x1:x,y1:y,x2:x+(ex-sx)*.06,y2:y+(ey-sy)*.06}); });
      R.pierres.forEach((p,i)=>{ const v=s(t,.6+i*.05,.75+i*.05,true); a.op(p,v>0&&v<1&&ok&&!fin?1:0); a.set(p,{cx:740+i*50,cy:a.lerp(490,780,v*v)}); });
      a.op(R.status,fin?1:0); a.set(R.status,{fill:pont?C.gr:C.red}); R.status.textContent=pont?"Pont-levis levé : les attaquants sont repoussés":"Pont-levis baissé : les ennemis entrent dans le château !"; } },
  { titre:"Fonction 2 : habiter", duree:10000,
    legende:"Le château est aussi une maison : le seigneur y vit avec sa famille, ses chevaliers et ses serviteurs. Dans le donjon : réserves, grande salle, chambres et guet.",
    voix:"Le château est aussi une maison. Le seigneur y vit avec sa famille, ses chevaliers et ses serviteurs. Regardons l'intérieur du donjon : en bas, les réserves de nourriture et un puits ; au-dessus, la grande salle, pour les repas, les fêtes et la justice ; plus haut, les chambres ; et tout en haut, le guet qui surveille les environs.",
    anim(t,a){ const s=a.seg; a.op(R.phP,0); a.op(R.phG,0); Object.values(R.labs).forEach(l=>a.op(l,1-s(t,0,.1))); R.att.forEach(p=>a.op(p,0)); a.op(R.status,0); R.pont.setAttribute("transform",`translate(0,${GY-4}) scale(1,.001) translate(0,${-(GY-4)})`); a.set(R.herse,{transform:""});
      const m=s(t,0,.25); R.ch.setAttribute("transform",`translate(${-m*330},${m*120}) scale(${1-m*.25})`); R.douves.setAttribute("transform",`translate(${-m*330},${m*120}) scale(${1-m*.25})`); R.pont.setAttribute("transform",`translate(${-m*330},${m*120}) scale(${1-m*.25}) translate(0,${GY-4}) scale(1,.001) translate(0,${-(GY-4)})`);
      a.op(R.coupe,s(t,.2,.3)); [3,2,1,0].forEach((f,i)=>a.op(R.floors[f],s(t,.3+i*.15,.4+i*.15))); } },
  { titre:"Fonction 3 : montrer sa puissance", duree:11000,
    legende:"Construit sur une hauteur, le château domine les villages : il montre la puissance du seigneur, qui commande, juge et fait payer des taxes. En cas de danger, les paysans viennent s'y réfugier.",
    voix:"Le château est construit sur une hauteur : on le voit de loin. Il montre la puissance du seigneur sur toute sa seigneurie. Le seigneur commande les paysans, rend la justice et leur fait payer des taxes. En échange, en cas de guerre, les paysans des villages viennent se réfugier derrière ses murailles.",
    anim(t,a){ const s=a.seg; a.op(R.coupe,1-s(t,0,.1)); a.op(R.sg,s(t,0,.15)); R.douves.removeAttribute("transform"); a.op(R.douves,0); a.op(R.pont,0); R.ch.setAttribute("transform","translate(0,0)");
      R.liens.forEach((l,i)=>{ a.op(l,s(t,.2+i*.06,.22+i*.06)); a.draw(l.path,s(t,.2+i*.06,.35+i*.06)); });
      a.op(R.sgL,s(t,.45,.55)); a.op(R.phC,s(t,.7,.85));
      R.refuge.forEach((p,i)=>{ const v=s(t,.6+i*.03,.92+i*.01); const src=R.vill[i%2]; a.op(p,v>0&&v<1?1:0); a.tr(p,a.lerp(src._x+(i-2)*20,800+(i-2.5)*16,v),a.lerp(src._y+60,470,v),.8); }); } },
  { titre:"Synthèse : 3 fonctions", duree:9000,
    legende:"Un château fort sert à protéger, à habiter et à montrer la puissance du seigneur.",
    voix:"Récapitulons : un château fort a trois fonctions. Il protège : murailles, tours, douves, donjon. Il sert d'habitation au seigneur et à sa famille. Et il montre la puissance du seigneur, qui domine la région depuis son château.",
    anim(t,a){ const s=a.seg; a.op(R.sg,1); a.op(R.phC,0); a.op(R.syn,s(t,0,.1)); R.f3.forEach((f,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
