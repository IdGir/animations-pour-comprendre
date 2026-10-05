/* META {"id":"sciences-E3-phases-de-la-lune","matiere":"sciences","annee":"B","periode":1,"theme":"La Terre dans l'espace : la Lune et ses phases","resume":"La Lune tourne autour de la Terre en environ un mois : le Soleil en éclaire toujours la moitié, et selon sa position on en voit plus ou moins (nouvelle Lune, quartiers, pleine Lune). Les phases ne sont pas l'ombre de la Terre.","motsCles":["Lune","phases","lunaison","orbite","Soleil","éclipse","quartier","croissante","décroissante"]} */
(function(){
const R={}; let manActive=false, manDay=7.4;
const C={sun:"#F5B82E",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B",moonL:"#F6F0D6",moonD:"#2B3045"};
const EX=520, EY=255, ER=46, OR=175, MR=28, SX=125, SY=255, SR=58;   // Terre, orbite, Moon (rayon), Soleil
const CYC=29.5;                                                       // durée d'un cycle de phases (jours)
const rad=d=>d*Math.PI/180;
const NOMS=["Nouvelle Lune","Premier croissant","Premier quartier","Gibbeuse croissante","Pleine Lune","Gibbeuse décroissante","Dernier quartier","Dernier croissant"];
const phaseIdx=e=>Math.round((((e%360)+360)%360)/45)%8;
const moonPos=e=>{ const th=rad(180+e); return [EX+OR*Math.cos(th),EY-OR*Math.sin(th)]; };
const dayOf=e=>e/360*CYC;
const fj=d=>(Math.round(d*10)/10).toString().replace(".",",");
/* Lune vue de la Terre : e = angle Soleil-Terre-Lune compté dans le sens du mouvement (0 nouvelle, 90 premier quartier, 180 pleine) */
function mkMoon(a,parent,r){ const {el}=a; const g=el("g",{},parent);
  el("circle",{r,fill:C.moonD,stroke:"#6B7388","stroke-width":Math.max(2,r*.03)},g);
  const lit=el("path",{fill:C.moonL},g);
  [[-.35,-.3,.28],[.3,-.45,.2],[.05,.25,.3],[-.5,.35,.17],[.5,.3,.18]].forEach(([x,y,k])=>el("circle",{cx:x*r,cy:y*r,r:k*r,fill:"#8A8F9E","fill-opacity":.2},g));
  g.upd=e=>{ e=((e%360)+360)%360; const w=e<=180, ee=w?e:360-e; const rx=r*Math.abs(Math.cos(rad(ee)));
    const d=ee<=90?`M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 0 0,${-r} Z`:`M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx},${r} 0 0 1 0,${-r} Z`;
    lit.setAttribute("d",ee<.5?"M0,0":d); lit.setAttribute("transform",w?"":"scale(-1,1)"); };
  return g; }

Anim.run({
  titre:"Les phases de la Lune",
  sousTitre:"Sciences et technologie · CM1-CM2 · La Terre dans l'espace",
  matiere:"sciences", badge:"Sciences", manipDes:4, manipJusqua:4,
  accroche:"Pourquoi la Lune change-t-elle de forme au fil des jours ?",
  init(a){
    const {el}=a;
    /* ---------- orbite vue de dessus (en haut) ---------- */
    const T=a.layer("T"); R.T=T;
    el("text",{x:EX,y:44,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468",text:"Vue de dessus, au-dessus du pôle Nord"},T);
    R.rays=[-150,-100,-50,0,50,100,150].map(dy=>el("line",{x1:SX+SR+16,y1:EY+dy,x2:dy===0?EX-ER-8:EX+OR+60,y2:EY+dy,stroke:C.sun,"stroke-width":4,"stroke-linecap":"round","stroke-dasharray":"16 12","stroke-opacity":.85},T));
    el("circle",{cx:EX,cy:EY,r:OR,fill:"none",stroke:"#9AA3B2","stroke-width":3,"stroke-dasharray":"12 10"},T);
    R.shadow=el("rect",{x:EX,y:EY-ER,width:OR+135,height:2*ER,fill:"#1B2447","fill-opacity":.85},T);
    R.shT=el("text",{x:EX+ER+114,y:EY+8,"text-anchor":"middle","font-size":22,"font-weight":700,fill:"#fff",text:"ombre de la Terre"},T);
    el("circle",{cx:SX,cy:SY,r:SR+24,fill:C.sun,opacity:.28},T); el("circle",{cx:SX,cy:SY,r:SR,fill:C.sun,stroke:"#E39A0B","stroke-width":4},T);
    el("text",{x:SX,y:SY+SR+44,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#8A5A00",text:"Soleil"},T);
    el("circle",{cx:EX,cy:EY,r:ER,fill:"#4A90D9",stroke:"#1E4F8A","stroke-width":3},T);
    el("path",{d:`M${EX-10},${EY-34} q22,2 30,18 q-4,20 -22,18 q-14,-14 -8,-36z`,fill:"#5DAA5B"},T);
    el("path",{d:`M${EX-30},${EY+4} q10,-2 14,10 q-6,14 -16,8z`,fill:"#5DAA5B"},T);
    el("text",{x:EX,y:EY+ER+30,"text-anchor":"middle","font-size":26,"font-weight":800,fill:"#1E4F8A",text:"Terre"},T);
    R.sight=el("line",{stroke:"#7E8AA0","stroke-width":3,"stroke-dasharray":"6 6"},T);
    R.mt=el("g",{},T); el("circle",{r:MR,fill:C.moonD,stroke:"#6B7388","stroke-width":3},R.mt); el("path",{d:`M0,${-MR} A${MR},${MR} 0 0 0 0,${MR} Z`,fill:C.moonL},R.mt);   // vue de dessus : moitié éclairée toujours côté Soleil (gauche)
    R.face=el("path",{fill:"none",stroke:C.red,"stroke-width":6,"stroke-linecap":"round"},R.mt);
    R.orbA=a.arrow(T,`M${EX+(OR+40)*Math.cos(rad(195))},${EY-(OR+40)*Math.sin(rad(195))} A${OR+40},${OR+40} 0 0 0 ${EX+(OR+40)*Math.cos(rad(240))},${EY-(OR+40)*Math.sin(rad(240))}`,{color:C.or,w:7,head:3.2});
    R.orbT=a.label(T,150,432,"La Lune tourne\nautour de la Terre",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.lbL=a.label(T,EX-190,EY+OR+50,"moitié éclairée",{size:24,stroke:"#E39A0B",color:"#8A5A00",fill:"#FFF6D8"});
    R.lbN=a.label(T,EX+190,EY+OR+50,"moitié dans la nuit",{size:24,stroke:"#2B3045",color:"#fff",fill:"#2B3045"});
    // tour des informations (haut droite)
    R.gau=el("g",{},T); const GX0=860, GW=660, GY=118;
    el("text",{x:GX0,y:80,"font-size":26,"font-weight":700,fill:C.ink,text:"Jours depuis la nouvelle Lune (exemple moyen)"},R.gau);
    el("rect",{x:GX0,y:GY-14,width:GW,height:28,rx:8,fill:"#E7EAF0",stroke:"#9AA3B2","stroke-width":2},R.gau);
    R.gFill=el("rect",{x:GX0,y:GY-14,width:0,height:28,rx:8,fill:"#F5D56A"},R.gau);
    [[0,"0"],[7.4,"7"],[14.8,"15"],[22.1,"22"],[29.5,"29,5"]].forEach(([d,tx])=>{ const x=GX0+GW*d/CYC; el("line",{x1:x,y1:GY+14,x2:x,y2:GY+24,stroke:C.ink,"stroke-width":2},R.gau); el("text",{x,y:GY+50,"text-anchor":"middle","font-size":22,fill:C.ink,text:tx},R.gau); });
    R.gMk=el("g",{},R.gau); el("path",{d:"M0,-16 L-11,-34 L11,-34Z",fill:C.red},R.gMk); el("line",{x1:0,y1:-16,x2:0,y2:16,stroke:C.red,"stroke-width":4},R.gMk);
    R.name=el("text",{x:GX0,y:218,"font-size":34,"font-weight":800,fill:C.ink},T);
    R.sub=el("text",{x:GX0,y:258,"font-size":28,"font-weight":700},T);
    R.cbox=el("g",{},T); el("rect",{x:GX0-14,y:286,width:GW+28,height:150,rx:14,fill:"#FFF8EC",stroke:C.or,"stroke-width":3},R.cbox); R.cTx=el("text",{x:GX0+10,y:332,"font-size":28,"font-weight":600,fill:C.ink},R.cbox);
    R.leg=el("g",{},T); el("path",{d:"M860,462 h50",stroke:C.red,"stroke-width":6,"stroke-linecap":"round"},R.leg); el("text",{x:926,y:470,"font-size":22,fill:C.ink,text:"face de la Lune tournée vers la Terre : celle qu'on voit"},R.leg);
    el("text",{x:1530,y:44,"text-anchor":"end","font-size":22,fill:"#5A6478",text:"Tailles et distances pas à l'échelle"},T);
    /* ---------- vue depuis la Terre (en bas) ---------- */
    const B=a.layer("B"); R.B=B;
    el("text",{x:250,y:540,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Vue depuis la Terre"},B);
    el("text",{x:250,y:572,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(dans l'hémisphère nord)"},B);
    R.big=el("g",{transform:"translate(250,696)"},B); R.bigM=mkMoon(a,R.big,118);
    R.bigN=el("text",{x:250,y:860,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink},B);
    R.strip=el("g",{},B); el("text",{x:1070,y:540,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Les 8 phases d'un cycle (environ 29,5 jours)"},R.strip);
    R.thumbs=NOMS.map((n,i)=>{ const g=el("g",{},R.strip); const cx=[700,945,1190,1435][i%4], cy=i<4?628:790; const ring=el("circle",{cx,cy,r:54,fill:"none",stroke:C.or,"stroke-width":6},g);
      const m=el("g",{transform:`translate(${cx},${cy})`},g); const mm=mkMoon(a,m,42); mm.upd(i*45);
      el("text",{x:cx,y:cy+82,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,text:n},g); g.ring=ring; return g; });
    /* ---------- manipulation ---------- */
    a.manip.innerHTML=`Jour du cycle : <input type="range" id="mD" min="0" max="29.5" step="0.1" value="7.4" aria-label="Position de la Lune sur son orbite (jour du cycle)"> <b id="mDt" style="min-width:70px">jour 7</b> <button data-d="0">Nouvelle Lune</button> <button data-d="7.4">1er quartier</button> <button data-d="14.8">Pleine Lune</button> <button data-d="22.1">Dernier quartier</button>`;
    const sl=a.manip.querySelector("#mD"); sl.oninput=()=>{ manActive=true; manDay=+sl.value; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ manActive=true; manDay=+b.dataset.d; a.redraw(); });
    /* ---------- idée fausse ---------- */
    R.myth=a.layer("myth"); R.mc=a.myth(R.myth,840,60,700,"Les phases de la Lune, c'est l'ombre de la Terre sur la Lune.","Non : l'ombre de la Terre ne tombe sur la Lune que pendant une éclipse de Lune, un événement rare. Les phases viennent de la moitié de la Lune éclairée par le Soleil, qu'on voit sous un angle différent chaque jour.");
    R.ph2=a.photo(R.myth,{id:"s-e3-eclipse-lune",x:1000,y:560,w:440,h:240,cap:"Une éclipse totale de Lune",rot:2});
    /* ---------- synthèse ---------- */
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["La Lune tourne autour de la Terre. Le cycle des phases dure environ 29,5 jours.",C.bl],["Le Soleil éclaire toujours la moitié de la Lune. Selon sa position, on voit plus ou moins de cette moitié éclairée.",C.or],["Les phases ne sont pas l'ombre de la Terre (sauf pendant une éclipse). Et la Lune nous montre toujours la même face.",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:930,height:170,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+85,r:34,fill:c},g); el("text",{x:120,y:y+98,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+62,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,50,1.2); return g; });
    R.ph1=a.photo(R.syn,{id:"s-e3-phases-lune",x:1050,y:230,w:440,h:300,cap:"Les phases de la Lune",rot:-2});
  },
  reset(a){ [R.T,R.B,R.myth,R.syn,R.ph2,R.ph1].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Le Soleil éclaire la moitié de la Lune", duree:8000,
    legende:"La Lune tourne autour de la Terre. Le Soleil en éclaire toujours une moitié, celle qui est tournée vers lui : l'autre moitié est dans la nuit.",
    voix:"La Lune tourne autour de la Terre. Elle ne produit pas de lumière : elle est éclairée par le Soleil. Comme pour la Terre, le Soleil éclaire toujours une moitié de la Lune, celle qui est tournée vers lui. L'autre moitié est dans la nuit.",
    anim(t,a){ const s=a.seg; pose(a,{e:90,top:s(t,0,.15),rays:s(t,.1,.3),lbl:s(t,.5,.7),orbA:s(t,.75,.9)}); } },
  { titre:"Un tour de la Lune : environ un mois", duree:15000,
    legende:"La Lune fait le tour de la Terre. Au fil des jours, la forme de la partie éclairée qu'on voit change : c'est le cycle des phases, environ 29 jours et demi.",
    voix:"Regardons la Lune faire un tour autour de la Terre. En bas, voici ce que voit un observateur sur la Terre. La moitié éclairée de la Lune est toujours tournée vers le Soleil, mais l'observateur ne la voit pas toujours de la même façon. La forme change jour après jour. Après environ vingt-neuf jours et demi, on retrouve la même phase : c'est le cycle de la Lune.",
    anim(t,a){ const s=a.seg; const e=360*s(t,.12,.95,true); pose(a,{e,top:1,rays:1,orbA:1,big:s(t,0,.1),gauge:s(t,0,.1),face:s(t,.05,.12),strip:e,sight:1}); } },
  { titre:"Quatre positions importantes", duree:15000,
    legende:"Nouvelle Lune : on ne voit rien. Premier quartier : une moitié. Pleine Lune : tout le disque. Dernier quartier : l'autre moitié.",
    voix:"Arrêtons la Lune à quatre endroits. À la nouvelle Lune, elle est du même côté que le Soleil : sa face éclairée est tournée à l'opposé de nous, et on ne voit rien. Au premier quartier, on voit la moitié de la face éclairée, à droite. À la pleine Lune, elle est à l'opposé du Soleil : on voit toute la face éclairée. Au dernier quartier, on voit de nouveau une moitié, mais à gauche.",
    anim(t,a){ const s=a.seg; const E=[0,90,180,270]; const i=Math.min(3,Math.floor(t*4)); const f=a.seg(t*4-i,0,.35); const e=i?a.lerp(E[i-1],E[i],f):0;
      const TX=["La Lune est du même côté que le Soleil : la face éclairée est de l'autre côté. Vu de la Terre, on ne voit rien.","On voit la moitié de la face éclairée : un demi-disque, à droite.","La Lune est à l'opposé du Soleil : on voit toute la face éclairée.","On voit de nouveau un demi-disque, mais à gauche."];
      pose(a,{e,top:1,rays:1,orbA:1,big:1,gauge:1,face:1,all:1,sight:1,call:TX[i],callA:s(t*4-i,.3,.5)}); } },
  { titre:"Lune croissante, lune décroissante", duree:15000,
    legende:"De la nouvelle à la pleine Lune, la partie éclairée grandit, à droite : la Lune est croissante. Ensuite elle diminue, à gauche : la Lune est décroissante.",
    voix:"Suivons de nouveau la Lune. De la nouvelle Lune jusqu'à la pleine Lune, la partie éclairée qu'on voit grandit, du côté droit : on dit que la Lune est croissante. Après la pleine Lune, elle diminue, du côté gauche : la Lune est décroissante. Entre les deux, on passe par le croissant, le quartier et la gibbeuse.",
    anim(t,a){ const s=a.seg; const e=360*s(t,.05,.95,true); pose(a,{e,top:1,rays:1,orbA:1,big:1,gauge:1,face:1,all:1,sight:1,call:e<180?"Lune CROISSANTE : la partie éclairée grandit. Elle est à droite (dans l'hémisphère nord).":"Lune DÉCROISSANTE : la partie éclairée diminue. Elle est à gauche (dans l'hémisphère nord).",callA:s(t,.02,.1),hl:1}); } },
  { titre:"À vous : placez la Lune", duree:16000,
    legende:"Déplacez la Lune sur son orbite avec le curseur ou les boutons : regardez la forme qu'on voit depuis la Terre. À vous de trouver la position de la pleine Lune !",
    voix:"À vous de jouer ! Avec le curseur, placez la Lune où vous voulez sur son orbite. Regardez en bas la forme qu'on voit depuis la Terre. Où faut-il placer la Lune pour voir une pleine Lune ? Et pour ne rien voir du tout ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02) manActive=false; const d=manActive?manDay:7.4*s(t,.15,.9,true); const e=d/CYC*360; pose(a,{e,top:1,rays:1,orbA:1,big:1,gauge:1,face:1,all:1,sight:1,hl:1,man:1}); const sl=document.getElementById("mD"), tx=document.getElementById("mDt"); if(sl&&!manActive) sl.value=d.toFixed(1); if(tx) tx.textContent="jour "+Math.round(d); } },
  { titre:"Idée fausse : l'ombre de la Terre ?", duree:12000,
    legende:"Beaucoup pensent que les phases viennent de l'ombre de la Terre. Mais ici la Lune est loin de l'ombre et on la voit déjà à moitié éclairée : l'ombre de la Terre est une autre histoire (éclipse).",
    voix:"On entend souvent que les phases de la Lune sont l'ombre de la Terre sur la Lune. C'est faux. Regardez : au premier quartier, la Lune est très loin de l'ombre de la Terre, et pourtant on ne la voit qu'à moitié. L'ombre de la Terre ne touche la Lune que lors d'une éclipse de Lune, un événement rare. Les phases, c'est la moitié éclairée par le Soleil, vue sous des angles différents.",
    anim(t,a){ const s=a.seg; pose(a,{e:90,top:1,rays:1,orbA:0,big:s(t,0,.1),face:1,shade:s(t,.1,.35),myth:s(t,.4,.6),hl:1,big2:1}); a.cls(R.mc.faux,"pulse",t>.7); } },
  { titre:"À retenir", duree:9000,
    legende:"La Lune tourne autour de la Terre en un mois environ ; le Soleil en éclaire toujours la moitié ; selon sa position, on voit plus ou moins cette moitié. Ce n'est pas l'ombre de la Terre.",
    voix:"À retenir. Un : la Lune tourne autour de la Terre, et le cycle des phases dure environ vingt-neuf jours et demi. Deux : le Soleil éclaire toujours la moitié de la Lune, et selon sa position, on voit plus ou moins de cette moitié éclairée. Trois : les phases ne sont pas l'ombre de la Terre, sauf pendant une éclipse. Et la Lune nous montre toujours la même face.",
    anim(t,a){ const s=a.seg; pose(a,{syn:1}); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.22,.3+i*.22))); a.op(R.ph1,s(t,.75,.95)); } },
  ]
});
function pose(a,o){ const d=k=>o[k]||0, op=a.op;
  op(R.syn,o.syn?1:0); if(o.syn){ [R.T,R.B,R.myth].forEach(e=>op(e,0)); return; } op(R.ph1,0);
  op(R.T,1); op(R.B,d("big")>0?1:0);
  const e=((o.e%360)+360)%360, [mx,my]=moonPos(e);
  R.rays.forEach((r,i)=>{ op(r,d("rays"));  });
  op(R.mt,d("top")); a.tr(R.mt,mx,my);
  op(R.orbA,d("orbA")); op(R.orbT,d("orbA")); op(R.lbL,d("lbl")); op(R.lbN,d("lbl"));
  // face tournée vers la Terre : arc rouge
  const dx=EX-mx, dy=EY-my, al=Math.atan2(dy,dx), rr=MR+9, p1=[rr*Math.cos(al-Math.PI/2),rr*Math.sin(al-Math.PI/2)], p2=[rr*Math.cos(al+Math.PI/2),rr*Math.sin(al+Math.PI/2)];
  R.face.setAttribute("d",`M${p1[0]},${p1[1]} A${rr},${rr} 0 0 1 ${p2[0]},${p2[1]}`); op(R.face,d("face")); op(R.leg,d("face"));
  const L=Math.hypot(dx,dy); a.set(R.sight,{x1:EX-dx/L*(ER+4),y1:EY-dy/L*(ER+4),x2:mx+dx/L*(MR+12),y2:my+dy/L*(MR+12)}); op(R.sight,d("sight")*.9);
  // ombre de la Terre (idée fausse)
  op(R.shadow,d("shade")); op(R.shT,d("shade"));
  // vue en bas
  R.bigM.upd(e); const idx=phaseIdx(e), day=dayOf(e);
  R.bigN.textContent=NOMS[idx]; op(R.bigN,1);
  op(R.strip,(o.all||o.strip!==undefined)?1:0);
  R.thumbs.forEach((g,i)=>{ const seen=o.all||o.strip>=359||o.strip>=i*45-1; g.setAttribute("opacity",seen?1:.2); op(g.ring,o.hl&&i===idx?1:0); });
  // jauge et titre
  op(R.gau,d("gauge")); const GX0=860, GW=660; R.gFill.setAttribute("width",GW*Math.min(1,day/CYC)); a.tr(R.gMk,GX0+GW*Math.min(1,day/CYC),118);
  const hasInfo=d("gauge")>0&&!o.myth; op(R.name,hasInfo?1:0); op(R.sub,hasInfo?1:0);
  R.name.textContent="Jour "+(o.man?Math.round(day):fj(day))+" : "+NOMS[idx];
  const w=e<180; R.sub.textContent=e<4||e>356||Math.abs(e-180)<4?(Math.abs(e-180)<4?"la Lune est à son maximum":"début du cycle"):w?"Lune croissante : la partie éclairée grandit":"Lune décroissante : la partie éclairée diminue"; R.sub.setAttribute("fill",w?C.gr:C.or);
  // bulle d'explication
  op(R.cbox,o.call&&hasInfo?o.callA:0); if(o.call){ a.wrap(R.cTx,o.call,46,1.25); }
  // idée fausse
  op(R.myth,d("myth")); op(R.ph2,d("myth")); if(d("myth")>0){ op(R.gau,0); op(R.name,0); op(R.sub,0); op(R.cbox,0); op(R.leg,0); op(R.strip,0); R.orbA&&op(R.orbA,0); }
}
})();
