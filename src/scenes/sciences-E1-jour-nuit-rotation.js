/* META {"id":"sciences-E1-jour-nuit-rotation","matiere":"sciences","annee":"B","periode":1,"theme":"La Terre dans l'espace : jour et nuit, rotation de la Terre sur elle-même","resume":"La Terre tourne sur elle-même en 24 h : Dijon passe du jour à la nuit, le Soleil se lève à l'est, l'ombre d'un bâton tourne (cadran solaire).","motsCles":["rotation","jour et nuit","Soleil","ombre","gnomon","cadran solaire","est","ouest"]} */
(function(){
const R={}; let manActive=false, manH=12;
const C={sun:"#F5B82E",ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",bl:"#2563A8",red:"#C0392B",oc:"#4A90D9",land:"#5DAA5B"};
const EX=500, EY=450, ER=190, SX=120, SY=450, SR=70;      // Terre (vue de dessus) et Soleil
const PX=880, PY=90, PW=680, PH=670;                       // panneau de droite
const TX0=150, TX1=830, TY=792;                            // frise des 24 heures
const LAT=47.32*Math.PI/180;                               // latitude de Dijon
const GS=110;                                              // hauteur du bâton (px) pour le plan
const rad=d=>d*Math.PI/180;
function mix(c1,c2,k){ const p=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16)); const A=p(c1),B=p(c2); return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,"0")).join(""); }
/* position du Soleil vu de Dijon un jour d'équinoxe (heure solaire h) */
function sunPos(h){ const H=rad(15*(h-12)); const sa=Math.cos(LAT)*Math.cos(H); const alt=Math.asin(sa);
  const sinAz=Math.max(-1,Math.min(1,Math.sin(H)/Math.max(.05,Math.cos(alt)))); const az=Math.asin(sinAz); // az : depuis le sud, positif vers l'ouest
  return {alt,az}; }
function shadow(h){ const p=sunPos(h); const L=1/Math.tan(Math.max(.2,p.alt)); return {L,az:p.az,alt:p.alt}; }
const hm=(h,full)=>{ let x=((h%24)+24)%24; const hh=Math.floor(x), mm=Math.round((x-hh)*60); return full&&mm?hh+" h "+String(mm).padStart(2,"0"):(mm===60?hh+1:hh)+" h"; };

Anim.run({
  titre:"Jour et nuit : la Terre tourne sur elle-même",
  sousTitre:"Sciences et technologie · CM1-CM2 · La Terre dans l'espace",
  matiere:"sciences", badge:"Sciences", manipDes:5, manipJusqua:5,
  accroche:"Pourquoi fait-il jour, puis nuit ? Qui bouge : le Soleil ou la Terre ?",
  init(a){
    const {el}=a;
    /* ---------- Soleil et rayons ---------- */
    const L0=a.layer("L0"); R.L0=L0;
    R.rays=[-150,-100,-50,0,50,100,150].map(dy=>{ const x2=EX-Math.sqrt(ER*ER-dy*dy)-8; return el("line",{x1:SX+SR+10,y1:EY+dy,x2,y2:EY+dy,stroke:C.sun,"stroke-width":5,"stroke-linecap":"round","stroke-dasharray":"18 14"},L0); });
    R.sunG=el("g",{},L0); el("circle",{cx:SX,cy:SY,r:SR+22,fill:C.sun,opacity:.28},R.sunG); el("circle",{cx:SX,cy:SY,r:SR,fill:C.sun,stroke:"#E39A0B","stroke-width":4},R.sunG);
    el("text",{x:SX,y:SY+SR+50,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#8A5A00",text:"Soleil"},R.sunG);
    R.sunNote=el("g",{},L0); a.label(R.sunNote,130,625,"Le Soleil\nne bouge pas",{size:24,stroke:C.or,color:"#8A4A0E"});
    /* ---------- Terre vue de dessus (au-dessus du pôle Nord) ---------- */
    const E=a.layer("E"); R.E=E;
    el("circle",{cx:EX,cy:EY,r:ER,fill:C.oc},E);
    R.rot=el("g",{},E);
    [.33,.66].forEach(f=>el("circle",{cx:EX,cy:EY,r:ER*f,fill:"none",stroke:"#fff","stroke-opacity":.35,"stroke-width":2},R.rot));
    for(let i=0;i<12;i++){ const al=rad(i*30); el("line",{x1:EX,y1:EY,x2:EX+ER*Math.cos(al),y2:EY-ER*Math.sin(al),stroke:"#fff","stroke-opacity":.3,"stroke-width":2},R.rot); }
    const blob=(ang,rr,s,seed)=>{ const cx=EX+rr*ER*Math.cos(rad(ang)), cy=EY-rr*ER*Math.sin(rad(ang)); let d=""; for(let k=0;k<9;k++){ const t=k/9*Math.PI*2, q=s*(.7+.5*Math.abs(Math.sin(k*1.7+seed))); d+=(k?"L":"M")+(cx+q*Math.cos(t)).toFixed(1)+","+(cy+q*Math.sin(t)).toFixed(1); } el("path",{d:d+"Z",fill:C.land,stroke:"#3E7F3C","stroke-width":2,"stroke-linejoin":"round"},R.rot); };
    blob(180,.68,42,1); blob(120,.55,50,2); blob(40,.6,55,3); blob(250,.5,46,4); blob(320,.78,38,5); blob(80,.85,30,6); blob(205,.2,26,7);
    R.pin=el("g",{},R.rot); el("circle",{cx:EX-.68*ER,cy:EY,r:15,fill:"none",stroke:"#fff","stroke-width":3},R.pin); el("circle",{cx:EX-.68*ER,cy:EY,r:8,fill:C.red,stroke:"#fff","stroke-width":2},R.pin);
    R.pole=el("circle",{cx:EX,cy:EY,r:6,fill:"#fff",stroke:C.ink,"stroke-width":2},E);
    R.night=el("path",{d:`M${EX},${EY-ER} A${ER},${ER} 0 0 1 ${EX},${EY+ER} Z`,fill:"#0B1433","fill-opacity":.62},E);
    el("circle",{cx:EX,cy:EY,r:ER,fill:"none",stroke:"#2B4A78","stroke-width":4},E);
    R.eNote=el("text",{x:EX,y:95,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468",text:"Vue de dessus, au-dessus du pôle Nord"},E);
    R.chips=el("g",{},E); a.label(R.chips,EX-70,EY-ER-112,"Côté jour",{size:24,stroke:"#E39A0B",color:"#8A5A00",fill:"#FFF6D8"}); a.label(R.chips,EX+110,EY-ER-112,"Côté nuit",{size:24,stroke:"#2B4A78",color:"#fff",fill:"#1B2A55"});
    // flèche de rotation (sens inverse des aiguilles d'une montre)
    const P=(al,r)=>[EX+r*Math.cos(rad(al)),EY-r*Math.sin(rad(al))];
    const A1=P(105,ER+34), A2=P(235,ER+34);
    R.rotA=a.arrow(E,`M${A1[0]},${A1[1]} A${ER+34},${ER+34} 0 0 0 ${A2[0]},${A2[1]}`,{color:C.or,w:8,head:3.2});
    R.rotT=el("g",{},E); a.label(R.rotT,165,195,"La Terre tourne\nd'ouest en est",{size:26,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    // étiquette Dijon (suit le point)
    R.dij=el("g",{},E); R.dijL=el("line",{stroke:C.red,"stroke-width":3},R.dij); a.label(R.dij,0,0,"Dijon",{size:26,w:100,h:44,stroke:C.red,color:C.red}); R.dijChip=R.dij.lastChild;
    /* ---------- frise des 24 heures ---------- */
    const T=a.layer("T"); R.T=T; const hx=h=>TX0+(TX1-TX0)*h/24;
    el("rect",{x:TX0,y:TY-14,width:TX1-TX0,height:28,rx:6,fill:"#FFE08A",stroke:C.ink,"stroke-width":2},T);
    el("rect",{x:TX0,y:TY-14,width:hx(6)-TX0,height:28,rx:6,fill:"#1B2A55"},T); el("rect",{x:hx(18),y:TY-14,width:TX1-hx(18),height:28,rx:6,fill:"#1B2A55"},T);
    [0,6,12,18,24].forEach(h=>el("text",{x:hx(h),y:TY+50,"text-anchor":"middle","font-size":24,fill:C.ink,"font-weight":700,text:h+" h"},T));
    el("text",{x:TX0,y:TY+92,"font-size":22,fill:"#4A5468",text:"Une journée de 24 h (heure solaire, jour d'équinoxe : exemple)"},T);
    R.cur=el("g",{},T); el("path",{d:"M0,-16 L-12,-34 L12,-34Z",fill:C.red},R.cur); el("line",{x1:0,y1:-16,x2:0,y2:16,stroke:C.red,"stroke-width":4},R.cur);
    R.curT=el("g",{},R.cur); a.label(R.curT,0,-62,"12 h",{size:26,w:116,h:40,stroke:C.red,color:C.red}); R.curTxt=R.curT.lastChild.lastChild;
    R.hx=hx;
    /* ---------- panneau « ciel vu de Dijon » ---------- */
    const S=a.layer("S"); R.S=S;
    el("rect",{x:PX,y:PY,width:PW,height:PH,rx:16,fill:"#fff",stroke:"#C9CED8","stroke-width":3},S);
    el("text",{x:PX+PW/2,y:PY+44,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Le ciel vu de Dijon (on regarde vers le sud)"},S);
    const SKY={x:PX+20,y:PY+66,w:PW-40,h:450}, HZ=SKY.y+SKY.h; R.hz=HZ;
    R.sky=el("rect",{x:SKY.x,y:SKY.y,width:SKY.w,height:SKY.h,fill:"#9BD0F5"},S);
    R.gnd=el("rect",{x:SKY.x,y:HZ,width:SKY.w,height:PY+PH-20-HZ,fill:"#2F6B3A"},S);
    const cx=PX+PW/2, AMP=285, LL=480; R.cx=cx; R.AMP=AMP; R.LL=LL;
    let d=""; for(let h=6;h<=18.001;h+=.25){ const p=sunPos(h); d+=(d?"L":"M")+(cx+AMP*Math.sin(p.az)).toFixed(1)+","+(HZ-LL*Math.sin(Math.max(0,p.alt))).toFixed(1); }
    R.path=el("path",{d,fill:"none",stroke:"#fff","stroke-width":4,"stroke-dasharray":"4 12","stroke-linecap":"round","stroke-opacity":.9},S);
    // maisons et arbre (décor)
    const dec=el("g",{opacity:.9},S); [[SKY.x+70,60,70],[SKY.x+470,70,60]].forEach(([x,w,h])=>{ el("rect",{x,y:HZ-h,width:w,height:h,fill:"#8C6A4F"},dec); el("path",{d:`M${x-8},${HZ-h} L${x+w/2},${HZ-h-34} L${x+w+8},${HZ-h}Z`,fill:"#A8431F"},dec); });
    el("rect",{x:cx+160,y:HZ-52,width:12,height:52,fill:"#6B4A2F"},dec); el("circle",{cx:cx+166,cy:HZ-70,r:34,fill:"#3E7F3C"},dec);
    R.sunS=el("g",{},S); el("circle",{r:56,fill:C.sun,opacity:.3},R.sunS); el("circle",{r:36,fill:C.sun,stroke:"#E39A0B","stroke-width":4},R.sunS);
    [["EST",SKY.x+95],["SUD",cx],["OUEST",SKY.x+SKY.w-110]].forEach(([n,x])=>{ const t=el("text",{x,y:HZ+62,"text-anchor":"middle","font-size":32,"font-weight":800,fill:"#fff",text:n},S); if(n==="EST") R.est=t; if(n==="OUEST") R.ouest=t; });
    R.lever=el("g",{},S); a.label(R.lever,PX+215,PY+140,"Le Soleil se lève\nà l'EST",{size:28,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.coucher=el("g",{},S); a.label(R.coucher,PX+PW-215,PY+140,"Il se couche\nà l'OUEST",{size:28,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.midi=el("g",{},S); a.label(R.midi,cx,PY+112,"Le plus haut : au SUD, à midi",{size:26,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    /* ---------- panneau « sol vu de dessus » : le bâton et son ombre ---------- */
    const Q=a.layer("Q"); R.Q=Q;
    el("rect",{x:PX,y:PY,width:PW,height:PH,rx:16,fill:"#fff",stroke:"#C9CED8","stroke-width":3},Q);
    el("text",{x:PX+PW/2,y:PY+44,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"Le sol vu de dessus : l'ombre d'un bâton"},Q);
    const DC=[cx,PY+370]; R.DC=DC; R.BX=cx; R.BY=DC[1]+50;
    R.dial=el("circle",{cx:DC[0],cy:DC[1],r:240,fill:"#F1E6CF",stroke:"#B9A77C","stroke-width":4},Q);
    el("clipPath",{id:"dialclip"},Q).appendChild(el("circle",{cx:DC[0],cy:DC[1],r:238}));
    R.dirs=[]; [["N",DC[0],DC[1]-240+34],["E",DC[0]+240-30,DC[1]+9],["O",DC[0]-240+30,DC[1]+9]].forEach(([n,x,y])=>R.dirs.push(el("text",{x,y,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#7A6A44",text:n},Q)));
    R.tip=el("path",{fill:"none",stroke:C.red,"stroke-width":4,"stroke-dasharray":"2 10","stroke-linecap":"round"},Q);
    R.marks=[9,10,11,12,13,14,15].map(h=>{ const g=el("g",{},Q); el("circle",{r:9,fill:C.red,stroke:"#fff","stroke-width":2},g); el("text",{"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#7A1D12",text:h+" h",stroke:"#F1E6CF","stroke-width":5,"paint-order":"stroke"},g); g._h=h; return g; });
    R.ray=el("line",{stroke:C.sun,"stroke-width":4,"stroke-dasharray":"10 8"},Q);
    R.shad=el("line",{stroke:"#3A3F4B","stroke-width":16,"stroke-linecap":"round","stroke-opacity":.6,"clip-path":"url(#dialclip)"},Q);
    el("circle",{cx:R.BX,cy:R.BY,r:11,fill:C.ink,stroke:"#fff","stroke-width":3},Q);
    R.baton=el("g",{},Q); el("circle",{cx:PX+34,cy:PY+110,r:11,fill:C.ink,stroke:"#fff","stroke-width":3},R.baton); el("text",{x:PX+54,y:PY+118,"font-size":24,"font-weight":700,fill:C.ink,text:"= bâton (gnomon)"},R.baton);
    R.sunQ=el("g",{},Q); el("circle",{r:30,fill:C.sun,opacity:.35},R.sunQ); el("circle",{r:20,fill:C.sun,stroke:"#E39A0B","stroke-width":3},R.sunQ);
    R.qT=el("text",{x:cx,y:PY+PH-18,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink},Q);
    R.qNote=el("text",{x:cx,y:PY+88,"text-anchor":"middle","font-size":24,"font-weight":600,fill:"#4A5468",text:"Jour d'équinoxe (exemple), hauteur du bâton : 1"},Q);
    /* ---------- MANIPULATION : curseur de l'heure ---------- */
    a.manip.innerHTML=`Heure : <input type="range" id="mH" min="0" max="24" step="0.5" value="12" aria-label="Heure de la journée"> <b id="mHt" style="min-width:72px">12 h</b> <button data-h="0">Minuit</button> <button data-h="6">6 h</button> <button data-h="12">Midi</button> <button data-h="18">18 h</button>`;
    const sl=a.manip.querySelector("#mH"); sl.oninput=()=>{ manActive=true; manH=+sl.value; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ manActive=true; manH=+b.dataset.h; a.redraw(); });
    /* ---------- idée fausse + synthèse ---------- */
    R.myth=a.layer("myth"); R.mc=a.myth(R.myth,PX,PY+70,PW,"C'est le Soleil qui tourne autour de la Terre.","C'est la Terre qui tourne sur elle-même en 24 h. Le Soleil nous semble bouger, comme le paysage qui défile quand on est dans un train.");
    R.ph1=a.photo(a.layer("ph1"),{id:"s-e1-globe-lampe",x:PX+80,y:PY+390,w:440,h:230,cap:"Un globe éclairé par une lampe",rot:-2});
    R.syn=a.layer("syn"); el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},R.syn);
    el("text",{x:800,y:78,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},R.syn);
    R.pts=[["La Terre tourne sur elle-même en 24 heures, d'ouest en est.",C.bl],["Le Soleil éclaire toujours une moitié de la Terre : face au Soleil, c'est le jour ; de l'autre côté, c'est la nuit.",C.or],["Pour nous, le Soleil se lève à l'est et se couche à l'ouest ; son mouvement apparent fait tourner l'ombre : c'est le principe du cadran solaire.",C.gr]].map(([tx,c],i)=>{
      const g=el("g",{},R.syn); const y=140+i*210; el("rect",{x:60,y,width:900,height:170,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:120,cy:y+85,r:34,fill:c},g); el("text",{x:120,y:y+98,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:i+1},g);
      const t=el("text",{x:180,y:y+62,"font-size":28,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,50,1.2); return g; });
    R.ph2=a.photo(R.syn,{id:"s-e1-cadran-solaire",x:1050,y:200,w:440,h:300,cap:"Un cadran solaire",rot:2});
  },
  reset(a){ [R.L0,R.E,R.T,R.S,R.Q,R.myth,R.syn,R.ph1,R.ph2].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Le Soleil éclaire la moitié de la Terre", duree:8000,
    legende:"Le Soleil éclaire toujours la moitié de la Terre : c'est le jour de ce côté, et la nuit de l'autre côté. Dijon est ici du côté du jour.",
    voix:"Le Soleil envoie sa lumière vers la Terre. Il éclaire toujours la moitié de la Terre : de ce côté, c'est le jour. De l'autre côté, la lumière n'arrive pas : c'est la nuit. Ici, Dijon est du côté du jour.",
    anim(t,a){ const s=a.seg; pose(a,{h:12,e:s(t,0,.2),rays:s(t,.1,.3),night:s(t,.3,.5),chips:s(t,.5,.65),pin:s(t,.65,.8),ph1:s(t,.7,.9),tl:0}); } },
  { titre:"La Terre tourne sur elle-même", duree:12000,
    legende:"La Terre tourne sur elle-même : un tour complet dure 24 heures. Dijon passe du jour à la nuit, puis revient au jour. Le Soleil, lui, ne bouge pas.",
    voix:"Mais la Terre tourne sur elle-même, comme une toupie. Un tour complet dure vingt-quatre heures. Regardons Dijon : à midi, elle fait face au Soleil. Puis elle s'éloigne et entre dans l'ombre : c'est le soir, puis la nuit. Après un tour entier, Dijon revient face au Soleil : c'est de nouveau le jour. Pendant ce temps, le Soleil, lui, ne bouge pas.",
    anim(t,a){ const s=a.seg; const h=12+24*s(t,.05,.95,true); pose(a,{h,e:1,rays:1,night:1,chips:1,pin:1,rotA:s(t,0,.1),sky:s(t,0,.1),tl:s(t,0,.1),sunNote:s(t,.5,.6)*(1-s(t,.9,1)),lever:0,coucher:0}); } },
  { titre:"Le Soleil se lève à l'est", duree:9000,
    legende:"La Terre tourne d'ouest en est : le matin, Dijon arrive vers le Soleil par le côté est. Voilà pourquoi le Soleil se lève à l'est, monte vers le sud et se couche à l'ouest.",
    voix:"Regardons le matin de plus près. La Terre tourne vers l'est, c'est-à-dire d'ouest en est. Le matin, Dijon sort de la nuit et arrive face au Soleil. Vu de Dijon, le Soleil apparaît à l'est, au bord de l'horizon. Il monte dans le ciel, il est le plus haut au sud à midi, puis il redescend et se couche à l'ouest.",
    anim(t,a){ const s=a.seg; const h=4+16*s(t,.05,.95,true); pose(a,{h,e:1,rays:1,night:1,chips:1,pin:1,rotA:1,sky:1,tl:1,lever:s(t,.2,.3)*(1-s(t,.45,.5)),midi:s(t,.5,.55)*(1-s(t,.65,.7)),coucher:s(t,.75,.85),est:s(t,.1,.2)}); } },
  { titre:"Le bâton et son ombre", duree:11000,
    legende:"Plantons un bâton dans le sol. Son ombre est toujours de l'autre côté du Soleil. Quand le Soleil se déplace, l'ombre tourne ; elle est la plus courte quand le Soleil est le plus haut.",
    voix:"Plantons un bâton dans le sol. Vu de dessus, son ombre est toujours à l'opposé du Soleil. Le matin, l'ombre est longue et pointe vers l'ouest. À mesure que le Soleil monte, l'ombre raccourcit. À midi, le Soleil est le plus haut : l'ombre est la plus courte. Puis elle s'allonge de nouveau et tourne vers l'est.",
    anim(t,a){ const s=a.seg; const h=9+6*s(t,.1,.95,true); pose(a,{h,e:1,rays:1,night:1,chips:1,pin:1,tl:1,plan:s(t,0,.1),hide:s(t,0,.1)}); } },
  { titre:"Un cadran solaire", duree:10000,
    legende:"On marque la place du bout de l'ombre chaque heure. Le lendemain, il suffit de regarder où est l'ombre pour lire l'heure : on a fabriqué un cadran solaire !",
    voix:"Marquons la place du bout de l'ombre à chaque heure. Neuf heures, dix heures, onze heures, midi, et ainsi de suite. Le lendemain, il suffit de regarder où se trouve l'ombre pour lire l'heure : on a fabriqué un cadran solaire. Attention : sur un cadran, midi solaire n'est pas tout à fait midi à notre montre.",
    anim(t,a){ const s=a.seg; const h=9+6*s(t,.05,.85,true); pose(a,{h,e:1,rays:1,night:1,chips:1,pin:1,tl:1,plan:1,marks:h,qT:s(t,.88,.96)}); } },
  { titre:"À vous : tournez la journée", duree:16000,
    legende:"Le curseur fait tourner la Terre, heure par heure. À vous : déplacez-le, regardez Dijon passer du jour à la nuit et l'ombre du bâton tourner.",
    voix:"À vous de jouer ! Avec le curseur, faites tourner la Terre heure par heure. Regardez Dijon passer du jour à la nuit, et l'ombre du bâton qui tourne et change de longueur. À quelle heure est-elle la plus courte ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02) manActive=false; const h=manActive?manH:12*s(t,.1,.92,true); pose(a,{h,man:1,e:1,rays:1,night:1,chips:1,pin:1,rotA:1,tl:1,plan:1,marks:15}); const sl=document.getElementById("mH"), tx=document.getElementById("mHt"); if(sl&&!manActive) sl.value=Math.round(h*2)/2; if(tx) tx.textContent=hm(h,true); } },
  { titre:"Idée fausse : le Soleil tourne autour de la Terre ?", duree:10000,
    legende:"On croit souvent que le Soleil tourne autour de la Terre. En réalité, le Soleil ne bouge pas ici : c'est la Terre qui tourne sur elle-même, et cela nous donne l'impression que le Soleil se déplace.",
    voix:"Beaucoup de gens pensent que le Soleil tourne autour de la Terre. C'est ce que l'on croit voir, car depuis le sol, le Soleil semble traverser le ciel. Mais en réalité, c'est la Terre qui tourne sur elle-même. C'est comme dans un train : on a l'impression que le paysage défile, alors que c'est nous qui avançons.",
    anim(t,a){ const s=a.seg; const h=12+24*s(t,.1,.95,true); pose(a,{h,e:1,rays:1,night:1,chips:1,pin:1,rotA:1,tl:1,sunNote:s(t,.1,.2),myth:s(t,.15,.3),pulse:t>.3&&t<.95}); } },
  { titre:"À retenir", duree:9000,
    legende:"Trois idées : la Terre tourne sur elle-même en 24 h ; un côté éclairé, un côté dans la nuit ; le Soleil semble se lever à l'est, et son mouvement apparent fait tourner les ombres.",
    voix:"À retenir. Un : la Terre tourne sur elle-même en vingt-quatre heures, d'ouest en est. Deux : le Soleil éclaire toujours une moitié de la Terre, c'est le jour. L'autre moitié est dans la nuit. Trois : pour nous, le Soleil se lève à l'est et se couche à l'ouest, et son mouvement apparent fait tourner les ombres. C'est le principe du cadran solaire.",
    anim(t,a){ const s=a.seg; pose(a,{syn:1}); R.pts.forEach((g,i)=>a.op(g,s(t,.1+i*.22,.3+i*.22))); a.op(R.ph2,s(t,.75,.95)); } },
  ]
});
function pose(a,o){
  const d=k=>o[k]||0, op=a.op;
  op(R.syn,d("syn")); if(o.syn){ [R.L0,R.E,R.T,R.S,R.Q,R.myth,R.ph1].forEach(e=>op(e,0)); return; }
  op(R.syn,0); op(R.ph2,0);
  const h=o.h===undefined?12:o.h;
  op(R.L0,1); op(R.E,d("e")); op(R.ph1,d("ph1"));
  R.rays.forEach((r,i)=>{ op(r,d("rays")); r.style.strokeDashoffset=-(h*40)%32; });
  op(R.sunG,d("e")); op(R.night,d("night")); op(R.chips,d("chips")); op(R.pin,d("pin")); op(R.dij,d("pin")); op(R.pole,d("e"));
  op(R.rotA,d("rotA")); op(R.rotT,d("rotA")); op(R.sunNote,d("sunNote")); op(R.eNote,d("e"));
  // rotation de la Terre : h=12 -> Dijon face au Soleil (à gauche)
  R.rot.setAttribute("transform",`rotate(${-(h-12)*15} ${EX} ${EY})`);
  const al=rad(180+(h-12)*15), rp=.68*ER, px=EX+rp*Math.cos(al), py=EY-rp*Math.sin(al), lx=EX+(ER+52)*Math.cos(al), ly=EY-(ER+52)*Math.sin(al);
  a.set(R.dijL,{x1:px,y1:py,x2:EX+(ER+30)*Math.cos(al),y2:EY-(ER+30)*Math.sin(al)});
  setChip(a,R.dij,lx,ly);
  // frise des 24 h
  op(R.T,d("tl")); a.tr(R.cur,R.hx(((h%24)+24)%24),TY); R.curTxt.textContent=hm(h,o.man);
  // ciel
  const P=sunPos(h), altd=P.alt*180/Math.PI, k=Math.max(0,Math.min(1,(altd+6)/12));
  op(R.S,d("sky")); R.sky.setAttribute("fill",mix("#101A3A","#9BD0F5",k)); R.gnd.setAttribute("fill",mix("#12281A","#2F6B3A",k));
  const sx=R.cx+R.AMP*Math.sin(P.az), sy=R.hz-R.LL*Math.sin(Math.max(0,P.alt)); a.tr(R.sunS,sx,sy); op(R.sunS,altd>=-1?1:0);
  op(R.lever,d("lever")); op(R.coucher,d("coucher")); op(R.midi,d("midi")); R.est.setAttribute("fill",d("est")>.5?C.sun:"#fff");
  // plan du bâton
  op(R.Q,d("plan")); if(d("plan")>0){ op(R.S,o.hide!==undefined?1-o.hide:0); }
  const man=!!o.man, night=man&&P.alt<=0.01, kd=man?Math.max(0,Math.min(1,(altd+4)/10)):1;
  const sh=shadow(man?h:Math.max(8.5,Math.min(15.5,h))), bx=R.BX, by=R.BY, len=sh.L*GS, tx=bx+len*Math.sin(sh.az), ty=by-len*Math.cos(sh.az);
  a.set(R.shad,{x1:bx,y1:by,x2:tx,y2:ty}); const SRr=170, sxq=bx-SRr*Math.sin(sh.az), syq=by+SRr*Math.cos(sh.az); a.tr(R.sunQ,sxq,syq); a.set(R.ray,{x1:sxq,y1:syq,x2:bx,y2:by});
  op(R.shad,night?0:1); op(R.sunQ,night?0:1); op(R.ray,night?0:1);
  R.dial.setAttribute("fill",mix("#2C3552","#F1E6CF",kd)); R.dirs.forEach(t=>t.setAttribute("fill",kd>.5?"#7A6A44":"#E8EDF7")); 
  R.qT.textContent=d("qT")?"L'ombre donne l'heure : cadran solaire":night?"Nuit : pas de Soleil, donc pas d'ombre":(man&&altd<12)?"Soleil très bas : ombre très longue":(len<GS*1.3?"Soleil haut : ombre courte":"Soleil bas : ombre longue"); R.qT.setAttribute("fill",d("qT")?C.gr:night?"#4A5468":C.or);
  // marques d'heures et trace du bout de l'ombre
  const mh=d("marks"); let dd=""; R.marks.forEach(g=>{ const s2=shadow(g._h), mx=bx+s2.L*GS*Math.sin(s2.az), my=by-s2.L*GS*Math.cos(s2.az); const ux=Math.sin(s2.az), uy=-Math.cos(s2.az); a.tr(g,mx,my); const tt=g.lastChild; const off=(g._h%2?72:42); tt.setAttribute("x",ux*off); tt.setAttribute("y",uy*off+8); op(g,mh>=g._h-.001&&o.marks!==undefined?1:0); });
  for(let hh=9;hh<=Math.min(15,mh||0)+.001;hh+=.25){ const s3=shadow(hh); dd+=(dd?"L":"M")+(bx+s3.L*GS*Math.sin(s3.az)).toFixed(1)+","+(by-s3.L*GS*Math.cos(s3.az)).toFixed(1); } if(!dd) dd="M0,0"; R.tip.setAttribute("d",dd); op(R.tip,mh?1:0);
  op(R.qT,d("plan")); op(R.qNote,d("plan"));
  // idée fausse
  op(R.myth,d("myth")); if(o.pulse) a.cls(R.mc.faux,"pulse",true); else a.cls(R.mc.faux,"pulse",false);
  if(d("myth")>0){ op(R.S,0); op(R.Q,0); }
}
function setChip(a,g,x,y){ const c=g.lastChild; c.setAttribute("transform",`translate(${x},${y})`); }
})();
