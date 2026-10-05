/* META {"id":"histoire-A3-charlemagne-ecole-ecriture","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des rois francs aux … / vie religieuse et savoir","resume":"Comment Charlemagne gouverne un immense empire (comtes, missi dominici, capitulaires), pourquoi il encourage les écoles et comment la minuscule caroline a permis de recopier et de sauver les textes.","motsCles":["Charlemagne","comte","missi dominici","capitulaire","école","minuscule caroline","scriptorium","manuscrit"]} */
//@data europe
(function(){
const E=EUROPE;
const C={sea:"#DCEBF5",land:"#F5EFE2",ch:"#A8431F",chF:"#F6CDB8",ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",pr:"#6B3FA0"};
const V={Aix:[598,277],Barcelone:[501,505],Pavie:[638,422],Rome:[696,508],Ratisbonne:[693,328],Toulouse:[496,447],Tours:[498,351],Paris:[531,318],Reims:[560,312],Dijon:[571,363],Lyon:[563,401],Cologne:[612,274],Corbie:[538,292],Bordeaux:[465,410],Magdebourg:[688,249],Fulda:[655,287],SaintGall:[646,366]};
const COMTES=["Paris","Reims","Tours","Dijon","Lyon","Toulouse","Bordeaux","Pavie","Ratisbonne","Magdebourg"];
const COMTE_LAB={Paris:[-8,22,"end"],Dijon:[10,18,"start"],Toulouse:[-9,18,"end"],Pavie:[9,18,"start"],Ratisbonne:[9,20,"start"]};
const ROUTES=[{d:"M598,277 C592,310 580,340 571,363 C565,385 560,395 563,401 C540,420 510,430 496,447 C490,470 495,490 501,505",fin:"Barcelone",lab:[-10,24,"end"]},
              {d:"M598,277 C612,320 626,380 638,422",fin:"Pavie",lab:[10,26,"start"]},
              {d:"M598,277 C640,285 670,300 693,328",fin:"Ratisbonne",lab:[10,-2,"start"]}];
const R={};
const el=(...x)=>Anim.H.el(...x);

function person(p,col,kind,s){ const g=el("g",{},p); s=s||1;
  const k=el("g",{transform:`scale(${s})`},g);
  el("path",{d:kind==="maitre"||kind==="eveque"?"M-16,0 L-11,-36 L11,-36 L16,0Z":"M-12,0 L-8,-34 L8,-34 L12,0Z",fill:col,stroke:C.ink,"stroke-width":2.2,"stroke-linejoin":"round"},k);
  el("circle",{cx:0,cy:-45,r:10,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.2},k);
  if(kind==="eveque"){ el("path",{d:"M-10,-52 L0,-76 L10,-52Z",fill:"#E0B12A",stroke:C.ink,"stroke-width":2},k); el("path",{d:"M0,-72 V-58 M-5,-65 H5",stroke:C.ink,"stroke-width":2},k); }
  if(kind==="comte"){ el("path",{d:"M-10,-51 Q0,-64 10,-51Z",fill:"#2B3A55",stroke:C.ink,"stroke-width":2},k); el("path",{d:"M14,-30 L24,-6",stroke:"#555","stroke-width":4,"stroke-linecap":"round"},k); }
  if(kind==="maitre"){ el("rect",{x:8,y:-30,width:18,height:22,rx:2,fill:"#8A5A2B",stroke:C.ink,"stroke-width":2},k); el("path",{d:"M-10,-51 Q0,-60 10,-51",fill:"none",stroke:"#555","stroke-width":3},k); }
  return g; }
function tower(p){ const g=el("g",{},p); el("path",{d:"M-5,6 L-5,-4 L-3,-4 L-3,-6.5 L-1,-6.5 L-1,-4 L1,-4 L1,-6.5 L3,-6.5 L3,-4 L5,-4 L5,6Z",fill:"#8A6A4A",stroke:C.ink,"stroke-width":1},g); return g; }
function book(p,col,s){ const g=el("g",{},p); const k=el("g",{transform:`scale(${s||1})`},g); el("rect",{x:-13,y:-17,width:26,height:34,rx:2,fill:col,stroke:C.ink,"stroke-width":2.2},k); el("path",{d:"M-8,-9 H8 M-8,-3 H8 M-8,3 H8",stroke:"#fff","stroke-width":1.8,opacity:.8},k); return g; }
function scroll(p){ const g=el("g",{},p); el("rect",{x:-14,y:-9,width:28,height:18,rx:3,fill:"#FFF3CF",stroke:C.ink,"stroke-width":1.4},g); el("path",{d:"M-8,-3 H8 M-8,2 H4",stroke:"#8A6A4A","stroke-width":1.2},g); return g; }

// ----- lettres (étape 5) -----
const PHR="Karolus rex Francorum", FS=84, Y1=250, Y2=500;
const OLD=PHR.replace(/ /g,"").toUpperCase().split("");
const NEW=PHR.replace(/ /g,"").split("");
let TX=[],NX=[];
const rnd=i=>{ const x=Math.sin(i*97.31+3.7)*43758.5453; return x-Math.floor(x); };
const MSG=[["Karolus rex Francorum","Charles, roi des Francs"],["Pater noster qui es in caelis","Notre Père, qui es aux cieux"],["In principio erat Verbum","Au commencement était le Verbe"]];
let mMsg=0, mEsp=100, touched=false; const LAY={};
function layMsg(i){ if(LAY[i]) return LAY[i]; const ph=MSG[i][0], mt=R.msMeasure; const W=ch=>{ mt.textContent=ch; return mt.getComputedTextLength()||55; };
  const letters=ph.replace(/ /g,"").split(""); let x=0; const tx=[]; letters.forEach(ch=>{ tx.push(x); x+=W(ch.toUpperCase())*.74; }); const wOld=x;
  x=0; const nx=[]; const words=ph.split(" "), ul=[]; words.forEach((w,j)=>{ const st=x; w.split("").forEach(ch=>{ nx.push(x); x+=W(ch)*1.04; }); ul.push([st,x]); x+=42; }); x-=42; const wNew=x;
  const sc=Math.min(1,1360/wNew); return LAY[i]={letters,tx,nx,wOld,wNew,sc,ul,fs:100*sc,x0:800-wOld*sc/2,x1:800-wNew*sc/2}; }
function drawMs(a,v){ const L=layMsg(mMsg), e=a.ease(v), sw=a.seg(e,.35,.65,true), Y=300; const n=L.letters.length;
  R.msOld.forEach((o,i)=>{ const nw=R.msNew[i]; if(i>=n){ a.op(o,0); a.op(nw,0); return; } const j=rnd(i+mMsg*50), j2=rnd(i+40+mMsg*50), j3=rnd(i+80+mMsg*50);
    const ox=L.x0+L.tx[i]*L.sc, nxp=L.x1+L.nx[i]*L.sc, oy=Y+(j2-.5)*18, rot=(j3-.5)*24*(1-e);
    o.textContent=L.letters[i].toUpperCase(); nw.textContent=L.letters[i]; o.setAttribute("font-size",L.fs*(.86+j*.3)); nw.setAttribute("font-size",L.fs);
    const x=ox+(nxp-ox)*e, y=oy+(Y-oy)*e; o.setAttribute("x",0); o.setAttribute("y",0); nw.setAttribute("x",0); nw.setAttribute("y",0);
    a.tr(o,x,y,1,rot); a.tr(nw,x,y,1,rot); a.op(o,1-sw); a.op(nw,sw); });
  R.msUl.forEach((u,j)=>{ const w=L.ul[j]; if(!w){ a.op(u,0); return; } u.setAttribute("x1",L.x1+w[0]*L.sc); u.setAttribute("x2",L.x1+w[1]*L.sc); u.setAttribute("y1",Y+30); u.setAttribute("y2",Y+30); a.op(u,a.seg(v,.75,.95)); });
  R.msBar.setAttribute("width",Math.max(10,1000*v)); const col=v<.5?"#C0392B":v<.75?"#E07A1F":"#2E8B57"; R.msBar.setAttribute("fill",col);
  R.msVal.textContent=Math.round(v*100)+" %"; R.msVal.setAttribute("fill",col);
  R.msTr.textContent=v<.5?"Que dit ce texte ? Difficile à lire…":"Il dit : « "+MSG[mMsg][1]+" »"; R.msTr.setAttribute("fill",v<.5?"#7A1D12":"#14532D");
  R.msTr2.textContent=v<.5?"Les lettres sont serrées, les mots sont collés.":"Les mots sont séparés : on comprend tout de suite. Texte latin : « "+MSG[mMsg][0]+" »"; }


Anim.run({
  titre:"Charlemagne : gouverner, enseigner, écrire",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge : des rois francs à l'empire / vie religieuse et savoir",
  matiere:"histoire", badge:"Histoire", manipDes:5, manipJusqua:5,
  accroche:"Comment gouverner un immense empire sans téléphone ? Et pourquoi les écritures ont-elles changé ?",
  init(a){
    // ===== carte =====
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"zoneA3"},defs); el("rect",{x:20,y:20,width:980,height:740,rx:14},cp);
    const cpt=el("clipPath",{id:"terreA3"},defs); el("path",{d:E.land},cpt);
    const map=a.layer("carte"); R.map=map;
    const vp=el("g",{"clip-path":"url(#zoneA3)"},map);
    el("rect",{x:0,y:0,width:1600,height:900,fill:C.sea},vp);
    const inner=el("g",{transform:"translate(-670,-380) scale(2)"},vp); R.inner=inner;
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":1},inner);
    const zg=el("g",{"clip-path":"url(#terreA3)"},inner);
    R.emp=el("path",{d:E.charlemagne,fill:C.chF,"fill-opacity":.85,stroke:C.ch,"stroke-width":2.2},zg);
    R.empT=el("g",{},map); el("rect",{x:40,y:692,width:480,height:54,rx:10,fill:"#fff",stroke:"#D6DBE4","stroke-width":2,opacity:.94},R.empT); el("rect",{x:56,y:706,width:30,height:26,rx:5,fill:C.chF,stroke:C.ch,"stroke-width":3},R.empT); el("text",{x:100,y:727,"font-size":24,"font-weight":800,fill:C.ch,text:"Empire de Charlemagne (vers 800)"},R.empT);
    // comtés
    R.com=COMTES.map(n=>{ const g=el("g",{},inner); a.tr(g,V[n][0],V[n][1]); const ring=el("circle",{r:9,fill:"#fff",stroke:C.or,"stroke-width":1.6},g); tower(g); const ck=el("path",{d:"M-5,-1 L-1.5,3 L6,-7",fill:"none",stroke:C.gr,"stroke-width":2.6,"stroke-linecap":"round"},g); ck.setAttribute("transform","translate(10,-10)"); const l=COMTE_LAB[n]; let t=null; if(l) t=el("text",{x:l[0],y:l[1],"text-anchor":l[2],"font-size":12,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":3,"paint-order":"stroke",text:n},g); g.ck=ck; g.ring=ring; return g; });
    // routes des missi
    R.rt=ROUTES.map(r=>{ const p=el("path",{d:r.d,fill:"none",stroke:C.bl,"stroke-width":2.4,"stroke-dasharray":"6 4","stroke-linecap":"round"},inner); const f=el("text",{x:V[r.fin][0]+r.lab[0],y:V[r.fin][1]+r.lab[1],"text-anchor":r.lab[2],"font-size":12,"font-weight":800,fill:C.bl,stroke:"#fff","stroke-width":3,"paint-order":"stroke",text:r.fin==="Barcelone"?r.fin:""},inner); p.fin=f; return p; });
    // position (fraction du trajet) du passage près de chaque comté
    requestAnimationFrame(()=>{});
    R.paire=ROUTES.map(()=>{ const g=el("g",{},inner); const b=person(g,"#7A3E9D","eveque",.62); const c=person(g,"#3E5C8A","comte",.62); a.tr(b,-9,0); a.tr(c,9,0); return g; });
    // Aix
    R.aix=el("g",{},inner); a.tr(R.aix,V.Aix[0],V.Aix[1]);
    el("circle",{r:6.5,fill:C.ch,stroke:"#fff","stroke-width":2},R.aix);
    el("path",{d:"M-8,-12 L-10,-22 L-4,-17 L0,-25 L4,-17 L10,-22 L8,-12Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":1.4},R.aix);
    el("text",{x:11,y:-1,"font-size":13,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":3,"paint-order":"stroke",text:"Aix-la-Chapelle"},R.aix);
    // rouleaux (capitulaires) envoyés
    R.env=COMTES.map(()=>scroll(inner)); R.env.forEach(e=>{ e.firstChild.setAttribute("transform","scale(.6)"); });
    // abbayes + livres (étape 6)
    const ABB=[["Tours","Tours",[0,28,"middle"]],["Corbie","Corbie",[-10,-12,"end"]],["Reims","Reims",[10,-10,"start"]],["Fulda","Fulda",[10,-10,"start"]],["SaintGall","Saint-Gall",[10,16,"start"]]];
    R.abb=ABB.map(([k,n,l])=>{ const g=el("g",{},inner); a.tr(g,V[k][0],V[k][1]); el("circle",{r:9,fill:"#fff",stroke:C.pr,"stroke-width":1.8},g); el("path",{d:"M-5,5 V-2 L0,-7 L5,-2 V5Z",fill:"#E7DCC8",stroke:C.ink,"stroke-width":1},g); el("text",{x:l[0],y:l[1],"text-anchor":l[2],"font-size":12,"font-weight":800,fill:C.pr,stroke:"#fff","stroke-width":3,"paint-order":"stroke",text:n},g); return g; });
    R.rome=el("g",{},inner); a.tr(R.rome,V.Rome[0],V.Rome[1]); el("circle",{r:6,fill:C.ink,stroke:"#fff","stroke-width":2},R.rome); el("text",{x:10,y:20,"font-size":12,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":3,"paint-order":"stroke",text:"Rome (exemple)"},R.rome);
    R.orig=el("g",{},inner); book(R.orig,"#B9A06A",.8);
    R.cop=ABB.map(()=>{ const g=el("g",{},inner); book(g,"#C4452C",.55); return g; });
    R.copT=el("g",{},inner); a.tr(R.copT,V.Tours[0],V.Tours[1]); R.copTb=book(R.copT,"#C4452C",.55);
    R.legTxt=el("text",{x:44,y:742,"font-size":22,"font-weight":700,fill:"#1E2430",stroke:"#fff","stroke-width":5,"paint-order":"stroke"},map);
    // ===== panneau droit =====
    const pan=a.layer("panneau"); R.pan=pan;
    // étape 1 : un comte
    R.p1=el("g",{},pan);
    el("text",{x:1300,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ch,text:"Un comte, c'est quoi ?"},R.p1);
    const ico=[["Rend la\njustice",1110],["Lève des\nsoldats",1300],["Collecte\nles impôts",1490]];
    ico.forEach(([t,x],i)=>{ const g=el("g",{},R.p1); a.tr(g,x,200); el("circle",{r:62,fill:"#FBF1E4",stroke:"#E3D3C3","stroke-width":3},g);
      if(i===0){ el("path",{d:"M0,-38 V34 M-30,34 H30 M-36,-22 H36",stroke:C.ink,"stroke-width":5,"stroke-linecap":"round"},g); el("path",{d:"M-36,-22 L-50,10 H-22Z M36,-22 L22,10 H50Z",fill:"#E0B12A",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g); }
      if(i===1){ el("path",{d:"M-30,30 L30,-30",stroke:"#555","stroke-width":8,"stroke-linecap":"round"},g); el("path",{d:"M-6,-36 L36,-36 L36,-8 Q36,16 6,28 Q-20,10 -20,-8 L-20,-36Z",fill:"#2B3A55",stroke:C.ink,"stroke-width":3,transform:"translate(-6,6) scale(.8)"},g); }
      if(i===2){ el("circle",{r:34,fill:"#F2C230",stroke:"#8A6A00","stroke-width":4},g); el("path",{d:"M0,-20 V20 M-20,0 H20",stroke:"#8A6A00","stroke-width":6,"stroke-linecap":"round"},g); }
      const tx=el("text",{x,y:312,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink},R.p1); t.split("\n").forEach((l,j)=>el("tspan",{x,dy:j?30:0,text:l},tx)); R["ico"+i]=g; });
    R.p1i=[0,1,2].map(i=>R["ico"+i]);
    R.pAix=a.photo(pan,{id:"h-a3-aix-chapelle",x:1110,y:430,w:380,h:253,cap:"Chapelle palatine d'Aix",rot:-1});
    // étape 2 : missi
    R.p2=el("g",{},pan);
    el("text",{x:1300,y:70,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ch,text:"Les missi dominici"},R.p2);
    el("text",{x:1300,y:104,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"« envoyés du maître » : les yeux de l'empereur"},R.p2);
    const b=person(R.p2,"#7A3E9D","eveque",2.4); a.tr(b,1180,330); const c=person(R.p2,"#3E5C8A","comte",2.4); a.tr(c,1420,330);
    el("text",{x:1180,y:372,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"un évêque"},R.p2); el("text",{x:1420,y:372,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"un comte"},R.p2);
    el("text",{x:1300,y:330,"text-anchor":"middle","font-size":44,"font-weight":800,fill:C.or,text:"+"},R.p2);
    ["Ils voyagent deux par deux.","Ils contrôlent les comtes et jugent.","Ils rapportent tout à l'empereur."].forEach((s,i)=>el("text",{x:1060,y:450+i*50,"font-size":26,"font-weight":600,fill:C.ink,text:"• "+s},R.p2));
    // étape 3 : capitulaire
    R.p3=el("g",{},pan);
    el("rect",{x:1040,y:60,width:520,height:470,rx:14,fill:"#FFF3CF",stroke:"#8A6A4A","stroke-width":4},R.p3);
    el("rect",{x:1020,y:46,width:560,height:26,rx:13,fill:"#C9A86A",stroke:"#8A6A4A","stroke-width":3},R.p3); el("rect",{x:1020,y:518,width:560,height:26,rx:13,fill:"#C9A86A",stroke:"#8A6A4A","stroke-width":3},R.p3);
    el("text",{x:1300,y:116,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:"Un capitulaire"},R.p3);
    el("text",{x:1300,y:150,"text-anchor":"middle","font-size":22,fill:"#6B5430",text:"un texte de loi coupé en petits chapitres"},R.p3);
    [[1,.8],[2,.62],[3,.74],[4,.5]].forEach(([n,w],i)=>{ const y=190+i*46; el("text",{x:1070,y:y+14,"font-size":24,"font-weight":800,fill:"#6B5430",text:n}, R.p3); el("rect",{x:1110,y:y,width:w*400,height:14,rx:7,fill:"#C9B88A"},R.p3); });
    R.hl=el("g",{},R.p3); el("rect",{x:1056,y:386,width:488,height:112,rx:12,fill:"#FFE08A",stroke:C.or,"stroke-width":4},R.hl);
    el("text",{x:1075,y:424,"font-size":24,"font-weight":800,fill:C.ink,text:"Chapitre 72 (789) :"},R.hl); el("text",{x:1075,y:458,"font-size":24,"font-weight":600,fill:C.ink,text:"ouvrir des écoles près des"},R.hl); el("text",{x:1075,y:484,"font-size":24,"font-weight":600,fill:C.ink,text:"évêchés et des monastères"},R.hl);
    el("text",{x:1300,y:590,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ch,text:"Admonitio generalis, 789"},R.p3);
    el("text",{x:1300,y:626,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(« exhortation générale » de Charlemagne)"},R.p3);
    R.arr3=el("g",{},R.p3); el("text",{x:1300,y:690,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Les comtes et les évêques en reçoivent des copies,"},R.arr3); el("text",{x:1300,y:720,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"et les missi vérifient qu'on les applique."},R.arr3);
    // étape 6 : photo manuscrit + compteur
    R.p6=el("g",{},pan);
    R.pMs=a.photo(pan,{id:"h-a3-manuscrit-caroline",x:1060,y:70,w:480,h:320,cap:"Manuscrit en minuscule caroline",rot:1});
    R.cnt=el("g",{},R.p6); el("rect",{x:1040,y:520,width:520,height:150,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.cnt);
    el("text",{x:1300,y:566,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#4A5468",text:"Exemplaires du même livre"},R.cnt);
    R.cntN=el("text",{x:1300,y:636,"text-anchor":"middle","font-size":60,"font-weight":800,fill:C.ch},R.cnt);
    el("text",{x:1300,y:720,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"(schéma : exemple de diffusion d'un texte)"},R.p6);
    el("text",{x:1300,y:762,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:"Écriture lisible : on lit et on copie plus facilement."},R.p6);
    // ===== étape 4 : l'école =====
    const sc=a.layer("ecole"); R.sc=sc;
    el("text",{x:800,y:62,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ch,text:"Qui va à l'école au temps de Charlemagne ?"},sc);
    el("rect",{x:50,y:100,width:660,height:600,rx:16,fill:"#F4F1E8",stroke:"#D6CDB5","stroke-width":3},sc);
    el("rect",{x:880,y:100,width:670,height:600,rx:16,fill:"#FFF8EA",stroke:"#C9A86A","stroke-width":3},sc);
    el("text",{x:1215,y:148,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ch,text:"École d'un monastère ou d'une cathédrale"},sc);
    el("rect",{x:1000,y:180,width:300,height:130,rx:6,fill:"#2F4A3A",stroke:"#6B4A2B","stroke-width":6},sc);
    el("text",{x:1150,y:268,"text-anchor":"middle","font-size":64,"font-weight":800,fill:"#fff","font-family":"Georgia,serif",text:"a b c"},sc);
    R.maitre=person(sc,"#5A4A3A","maitre",1.6); a.tr(R.maitre,1440,470);
    el("path",{d:"M900,640 H1530",stroke:"#C9A86A","stroke-width":3},sc);
    R.bancs=[0,1,2,3,4].map(i=>{ const g=el("g",{},sc); el("rect",{x:930+i*110,y:560,width:96,height:12,rx:3,fill:"#8A5A2B"},g); const p=person(g,["#C4452C","#2563A8","#2E8B57","#B7791F","#7A3E9D"][i],"peuple",1.25); a.tr(p,978+i*110,560); return g; });
    R.foule=[]; const cols=["#8C9AB5","#9AA88C","#B59A8C","#A08CB5"];
    for(let i=0;i<40;i++){ const cx=100+(i%8)*76, cy=210+Math.floor(i/8)*92; const g=el("g",{},sc); const p=person(g,[3,12,19,26,35].includes(i)?"#E07A1F":cols[i%4],"peuple",.95); a.tr(p,cx,cy+50); g.cx=cx; g.cy=cy+50; R.foule.push(g); }
    R.elus=[3,12,19,26,35];
    R.legFoule=el("text",{x:380,y:742,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink},sc); a.wrap(R.legFoule,"La plupart des gens (paysans, artisans…) ne vont pas à l'école.",44,1.2);
    R.legEcole=el("text",{x:1215,y:742,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink},sc); a.wrap(R.legEcole,"Quelques garçons seulement : futurs prêtres, moines, aides du roi.",44,1.2);
    el("text",{x:800,y:872,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"Schéma illustratif : le nombre de personnages est un exemple, pas un chiffre réel."},sc);
    // ===== étape 5 : lettres =====
    const lt=a.layer("lettres"); R.lt=lt;
    el("text",{x:800,y:62,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ch,text:"Des lettres serrées aux lettres lisibles"},lt);
    el("text",{x:800,y:110,"text-anchor":"middle","font-size":26,fill:"#4A5468",text:"Exemple : « Karolus rex Francorum » veut dire « Charles, roi des Francs »."},lt);
    el("rect",{x:60,y:140,width:1480,height:200,rx:14,fill:"#F3E7D0",stroke:"#C9A86A","stroke-width":3},lt);
    el("rect",{x:60,y:390,width:1480,height:200,rx:14,fill:"#FFFDF6",stroke:"#C9D2E3","stroke-width":3},lt);
    el("text",{x:90,y:176,"font-size":24,"font-weight":800,fill:"#7A1D12",text:"Avant : écritures anciennes, lettres serrées, mots collés"},lt);
    el("text",{x:90,y:426,"font-size":24,"font-weight":800,fill:"#14532D",text:"Vers 800 : la minuscule caroline"},lt);
    // mesures
    const meas=el("text",{"font-size":FS,"font-family":"Georgia,'Times New Roman',serif","font-weight":700,visibility:"hidden"},lt);
    const W=ch=>{ meas.textContent=ch; return meas.getComputedTextLength()||FS*.55; };
    // ancien : lettres serrées
    let x=0; TX=[]; OLD.forEach((ch,i)=>{ TX.push(x); x+=W(ch)*.74; }); const wOld=x; const x0=800-wOld/2;
    // nouveau : espaces entre les mots
    x=0; NX=[]; const gap=FS*.42; let wi=0; const words=PHR.split(" "); const gaps=[]; words.forEach((w,j)=>{ w.split("").forEach(ch=>{ NX.push(x); x+=W(ch)*1.04; }); if(j<words.length-1){ gaps.push(x+gap/2); x+=gap; } }); const wNew=x; const x1=800-wNew/2;
    R.gapX=gaps.map(g=>x1+g);
    R.oldL=OLD.map((ch,i)=>{ const j=rnd(i), j2=rnd(i+40), j3=rnd(i+80); const t=el("text",{"font-size":FS*(.86+j*.3),"font-family":"Georgia,'Times New Roman',serif","font-weight":700,fill:"#4B2E1B"},lt); t.textContent=ch; t._o={x:x0+TX[i],y:Y1+(j2-.5)*16,r:(j3-.5)*22}; return t; });
    R.newL=NEW.map((ch,i)=>{ const t=el("text",{"font-size":FS,"font-family":"Georgia,'Times New Roman',serif","font-weight":700,fill:"#1B3B6B"},lt); t.textContent=ch; t._n={x:x1+NX[i],y:Y2}; return t; });
    // repères sous la ligne du bas
    R.call=el("g",{},lt);
    const cards=[["Des espaces\nentre les mots",R.gapX[0]],["Des lettres régulières,\nde même taille",x1+wNew*.62],["Majuscules et\nminuscules",x1+4]];
    R.cardG=cards.map(([t,tx],i)=>{ const g=el("g",{},R.call); const cx=[330,800,1270][i]; el("rect",{x:cx-205,y:660,width:410,height:96,rx:14,fill:"#fff",stroke:C.gr,"stroke-width":3},g); const tt=el("text",{x:cx,y:t.includes("\n")?700:716,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink},g); t.split("\n").forEach((l,j)=>el("tspan",{x:cx,dy:j?32:0,text:l},tt));
      const arr=a.arrow(g,`M${cx},658 C${cx},620 ${tx},640 ${tx},${Y2+28}`,{color:C.gr,w:5,head:4}); g.arr=arr; return g; });
    R.mauvais=el("g",{},lt); a.label(R.mauvais,1380,250,"Difficile\nà lire",{size:26,fill:"#FDECEA",stroke:"#C0392B",color:"#7A1D12"});
    R.bon=el("g",{},lt); a.label(R.bon,1380,495,"Facile\nà lire",{size:26,fill:"#E8F6EE",stroke:"#2E8B57",color:"#14532D"});
    // ===== étape 6 : manipulation (écarter les lettres) =====
    const ms=a.layer("manipLettres"); R.ms=ms;
    el("text",{x:800,y:62,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ch,text:"À vous : écartez les lettres !"},ms);
    el("rect",{x:60,y:100,width:1480,height:340,rx:14,fill:"#FFFDF6",stroke:"#C9A86A","stroke-width":3},ms);
    R.msOld=[]; R.msNew=[]; R.msUl=[];
    for(let i=0;i<32;i++){ const o=el("text",{"font-family":"Georgia,'Times New Roman',serif","font-weight":700,fill:"#4B2E1B"},ms); const n=el("text",{"font-family":"Georgia,'Times New Roman',serif","font-weight":700,fill:"#1B3B6B"},ms); R.msOld.push(o); R.msNew.push(n); }
    for(let i=0;i<6;i++) R.msUl.push(el("line",{stroke:C.gr,"stroke-width":6,"stroke-linecap":"round"},ms));
    R.msMeasure=el("text",{"font-size":100,"font-family":"Georgia,'Times New Roman',serif","font-weight":700,visibility:"hidden"},ms);
    el("text",{x:90,y:136,"font-size":24,"font-weight":800,fill:"#4A5468",text:"Le même texte, écrit de plus en plus lisiblement :"},ms);
    R.msBarBg=el("rect",{x:300,y:490,width:1000,height:34,rx:17,fill:"#E6E9EF",stroke:"#C9CED8","stroke-width":2},ms);
    R.msBar=el("rect",{x:300,y:490,width:10,height:34,rx:17,fill:"#C0392B"},ms);
    el("text",{x:280,y:516,"text-anchor":"end","font-size":26,"font-weight":800,fill:C.ink,text:"Lisibilité"},ms);
    el("text",{x:300,y:560,"font-size":22,fill:"#7A1D12",text:"difficile"},ms); el("text",{x:1300,y:560,"text-anchor":"end","font-size":22,fill:"#14532D",text:"facile"},ms);
    R.msVal=el("text",{x:1330,y:516,"font-size":26,"font-weight":800,fill:C.ink},ms);
    R.msTr=el("text",{x:800,y:650,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink},ms);
    R.msTr2=el("text",{x:800,y:700,"text-anchor":"middle","font-size":24,fill:"#4A5468"},ms);
    a.manip.innerHTML=`Texte : <button id="mM0" class="sel">Charles</button><button id="mM1">Prière</button><button id="mM2">Évangile</button> &nbsp; Espacement des lettres : <input type="range" id="mE" min="0" max="100" step="5" value="100"> <span id="mEv">100 %</span>`;
    const $=id=>document.getElementById(id);
    [0,1,2].forEach(i=>{ $("mM"+i).onclick=()=>{ mMsg=i; touched=true; [0,1,2].forEach(j=>$("mM"+j).classList.toggle("sel",j===i)); a.redraw(); }; });
    $("mE").oninput=e=>{ mEsp=+e.target.value; touched=true; a.redraw(); };
    // ===== synthèse =====
    const sy=a.layer("synthese"); R.sy=sy;
    R.myth=a.myth(sy,60,60,720,"Charlemagne a inventé l'école pour tous les enfants.","Charlemagne encourage la création d'écoles près des évêchés et des monastères, surtout pour former des prêtres, des moines et des aides du roi. La plupart des enfants n'y vont pas.");
    el("text",{x:850,y:96,"font-size":30,"font-weight":800,fill:C.ch,text:"À retenir"},sy);
    R.syP=["Pour gouverner un grand empire, Charlemagne s'appuie sur des comtes, des envoyés (missi dominici) et des textes écrits (capitulaires).","Il demande d'ouvrir des écoles, mais seulement une petite partie des enfants y accèdent.","La minuscule caroline est plus lisible : elle facilite la copie des livres et nous a transmis de nombreux textes de l'Antiquité."].map((p,i)=>{ const g=el("g",{},sy); const y=140+i*150; el("circle",{cx:880,cy:y+30,r:24,fill:C.ch},g); el("text",{x:880,y:y+40,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:925,y:y+24,"font-size":30,"font-weight":600,fill:C.ink},g); a.wrap(t,p,40,1.25); return g; });
    R.fr=a.frise(a.svg,{x:120,y:842,w:1360,debut:760,fin:820,ticks:[760,780,800,820],events:[{id:"e768",d:768,label:"768 roi",color:C.ch},{id:"e789",d:789,label:"789 écoles",color:C.bl,up:true},{id:"e800",d:800,label:"800 empereur",color:C.ch},{id:"e814",d:814,label:"814 mort",color:"#555",up:true}]});
    R.fr.at(768,"768");
  },
  reset(a){
    [R.map,R.pan,R.p1,R.p2,R.p3,R.p6,R.pAix,R.pMs,R.sc,R.lt,R.sy,R.fr,R.emp,R.empT,R.aix,R.rome,R.orig,R.copT,R.legTxt,R.cnt,R.call,R.mauvais,R.bon,R.hl,R.arr3,R.myth,...R.syP,...R.com,...R.rt,...R.rt.map(p=>p.fin),...R.paire,...R.env,...R.abb,...R.cop,...R.p1i,R.ms,...R.bancs,...R.cardG,...R.oldL,...R.newL].forEach(e=>a.op(e,0));
    R.com.forEach(g=>{ a.op(g.ck,0); });
    Object.values(R.fr.events).forEach(e=>a.op(e,0)); a.op(R.maitre,0);
    R.com.forEach(g=>{ g.ring.setAttribute("stroke",C.or); g.ring.setAttribute("stroke-width",1.6); });
  },
  etapes:[
  { titre:"Un empire immense, des comtes", duree:10000,
    legende:"Vers 800, l'empire de Charlemagne est immense et il n'y a ni téléphone ni route rapide. Le roi s'appuie sur des comtes : dans chaque comté, ils rendent la justice, lèvent des soldats et collectent des impôts.",
    voix:"Vers l'an huit cents, l'empire de Charlemagne est immense, et il n'existe ni téléphone, ni route rapide. Charlemagne ne peut pas être partout. Il s'appuie donc sur des comtes. Dans chaque comté, le comte rend la justice, lève des soldats et collecte les impôts. Regarde la chapelle de son palais, à Aix-la-Chapelle, où Charlemagne a installé sa capitale.",
    anim(t,a){ const s=a.seg; a.op(R.map,s(t,0,.1)); a.op(R.emp,s(t,0,.3)); a.op(R.empT,s(t,.2,.35)); a.op(R.aix,s(t,.15,.3)); a.tr(R.aix,V.Aix[0],V.Aix[1]);
      R.com.forEach((g,i)=>{ const v=s(t,.3+i*.04,.4+i*.04); a.op(g,v); }); R.com.forEach(g=>a.op(g.ck,0));
      a.op(R.pan,1); a.op(R.p1,s(t,.35,.5)); R.p1i.forEach((g,i)=>a.op(g,s(t,.4+i*.12,.55+i*.12))); a.op(R.pAix,s(t,.75,.95)); } },
  { titre:"Les missi dominici contrôlent", duree:11000,
    legende:"Pour surveiller les comtes, Charlemagne envoie des missi dominici, « envoyés du maître » : un évêque et un comte voyagent ensemble, vérifient et rapportent à l'empereur.",
    voix:"Mais qui surveille les comtes ? Charlemagne envoie des missi dominici, ce qui veut dire les envoyés du maître. Ils voyagent par deux : un évêque et un comte. Sur la carte, suis-les. Ils traversent le royaume, passent par Dijon, vérifient que les comtes font bien leur travail, jugent, puis rapportent tout à l'empereur.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.emp,1); a.op(R.empT,1-s(t,0,.1)); a.op(R.aix,1); R.com.forEach(g=>a.op(g,1));
      a.op(R.p1,1-s(t,0,.12)); R.p1i.forEach(g=>a.op(g,1-s(t,0,.12))); a.op(R.pAix,1-s(t,0,.12)); a.op(R.p2,s(t,.05,.2));
      const out=s(t,.15,.65,true), back=s(t,.75,.95,true);
      R.rt.forEach((p,i)=>{ a.op(p,s(t,.1,.2)); a.draw(p,Math.min(1,out*1.02)); a.op(p.fin,s(t,.6,.7)); a.op(R.paire[i],s(t,.12,.18)*(1-s(t,.93,.98)));
        const u=out<1?out:1-back; const q=a.along(p,Math.max(0,Math.min(1,u))); a.tr(R.paire[i],q.x,q.y+7);
      });
      R.com.forEach((g,i)=>{ const n=COMTES[i]; const P=V[n]; let best=2; R.rt.forEach((p,j)=>{ if(!p._samp){ p._samp=[]; const L=p.getTotalLength(); for(let k=0;k<=80;k++){ const q=p.getPointAtLength(L*k/80); p._samp.push([q.x,q.y]); } }
          p._samp.forEach(([x,y],k)=>{ if(Math.hypot(x-P[0],y-P[1])<14) best=Math.min(best,k/80); }); });
        a.op(g.ck,best<=1&&out>=best+.02?1:0); }); } },
  { titre:"Les capitulaires : des ordres écrits", duree:10000,
    legende:"Charlemagne fait aussi écrire ses décisions dans des capitulaires. Des copies partent vers les comtes. En 789, un texte demande d'ouvrir des écoles près des évêchés et des monastères.",
    voix:"Charlemagne ne donne pas seulement des ordres de vive voix. Il les fait écrire dans des textes appelés capitulaires, parce qu'ils sont découpés en petits chapitres. Des copies partent vers les comtes. En sept cent quatre-vingt-neuf, un de ces textes demande d'ouvrir des écoles près des évêchés et des monastères.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.emp,1); a.op(R.aix,1); R.com.forEach(g=>a.op(g,1)); R.rt.forEach(p=>{ a.op(p,1-s(t,0,.15)); a.op(p.fin,0); }); R.paire.forEach(g=>a.op(g,0));
      a.op(R.pan,1); a.op(R.p2,1-s(t,0,.1)); a.op(R.p3,s(t,0,.15)); a.op(R.arr3,s(t,.7,.85)); const h=s(t,.15,.3); a.op(R.hl,h);
      R.env.forEach((e,i)=>{ const u=s(t,.25+i*.04,.55+i*.04); const P=V[COMTES[i]]; a.op(e,u>0&&u<1?1:0); a.tr(e,a.lerp(V.Aix[0],P[0],u),a.lerp(V.Aix[1],P[1],u)-Math.sin(u*Math.PI)*14); R.com[i].ring.setAttribute("stroke",u>=1?C.gr:C.or); R.com[i].ring.setAttribute("stroke-width",u>=1?3:1.6); }); } },
  { titre:"Qui va à l'école ?", duree:10000,
    legende:"Charlemagne encourage les écoles, mais elles sont petites et réservées à quelques garçons : futurs prêtres, moines et aides du roi. La plupart des gens ne savent ni lire ni écrire.",
    voix:"Charlemagne veut des gens capables de lire et d'écrire : pour lire la Bible, mais aussi pour écrire les ordres du roi. Il encourage donc les écoles. Mais ces écoles sont petites. Elles accueillent quelques garçons, surtout de futurs prêtres, des moines, des aides du roi. La plupart des gens, paysans ou artisans, ne vont pas à l'école, et ne savent ni lire ni écrire.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.12)); a.op(R.pan,1-s(t,0,.12)); a.op(R.sc,s(t,.05,.2));
      R.foule.forEach((g,i)=>{ const k=R.elus.indexOf(i); if(k<0){ a.tr(g,0,0); return; } const u=s(t,.3+k*.1,.6+k*.1); a.op(g,u<1?1:0); a.tr(g,(870-g.cx)*u,(640-g.cy)*u-Math.sin(u*Math.PI)*10); });
      R.bancs.forEach((g,i)=>a.op(g,s(t,.45+i*.1,.55+i*.1))); a.op(R.maitre,s(t,.15,.3)); R.legFoule.setAttribute("opacity",s(t,.5,.7)); R.legEcole.setAttribute("opacity",s(t,.7,.9)); } },
  { titre:"Des lettres serrées aux lettres lisibles", duree:12000,
    legende:"Avant, on écrit en lettres serrées, sans séparer les mots : c'est difficile à lire. Autour de 800, la minuscule caroline sépare les mots et régularise les lettres.",
    voix:"Avant Charlemagne, on écrit de façons très différentes selon les régions : les lettres sont serrées, les mots sont collés. C'est difficile à lire. Dans les ateliers d'écriture des monastères, vers l'an huit cents, on met au point une écriture nouvelle : la minuscule caroline. Regarde : les lettres se séparent, les mots sont espacés, les lettres sont régulières. Nos petites lettres d'aujourd'hui en descendent.",
    anim(t,a){ const s=a.seg; a.op(R.sc,0); a.op(R.lt,s(t,0,.08));
      R.oldL.forEach((tx,i)=>{ const o=tx._o; a.op(tx,1); const fade=.45+.55*(1-s(t,.35,.6)); tx.setAttribute("opacity",fade); tx.setAttribute("x",0); tx.setAttribute("y",0); a.tr(tx,o.x,o.y,1,o.r); });
      R.newL.forEach((tx,i)=>{ const n=tx._n, o=R.oldL[i]._o; const u=s(t,.3+i*.017,.58+i*.017); a.op(tx,u>0?1:0); tx.setAttribute("x",0); tx.setAttribute("y",0); a.tr(tx,a.lerp(o.x,n.x,u),a.lerp(o.y,n.y,u),1,o.r*(1-u)); });
      a.op(R.mauvais,s(t,.15,.25)); a.op(R.bon,s(t,.7,.8)); a.op(R.call,1); R.cardG.forEach((g,i)=>{ const v=s(t,.78+i*.06,.88+i*.06); a.op(g,v); a.draw(g.arr.path,v); }); } },
  { titre:"À vous : écartez les lettres", duree:6000,
    legende:"À vous : déplacez le curseur pour écarter les lettres, et changez de texte avec les boutons. Regardez comme le texte devient lisible quand les mots sont séparés.",
    voix:"À vous de jouer. Déplacez le curseur pour écarter peu à peu les lettres. Vous pouvez aussi changer de texte avec les boutons. Regardez ce qui change : quand les lettres sont régulières et les mots séparés, le texte devient facile à lire. Prenez votre temps, puis continuez.",
    anim(t,a){ const s=a.seg; a.op(R.lt,0); a.op(R.ms,s(t,0,.1)); a.op(R.map,0); a.op(R.pan,0);
      let v; if(touched) v=mEsp/100; else { v=a.seg(t,.1,.85); const sl=document.getElementById("mE"), sv=document.getElementById("mEv"); if(sl) sl.value=Math.round(v*20)*5; if(sv) sv.textContent=Math.round(v*100)+" %"; }
      if(touched){ const sv=document.getElementById("mEv"); if(sv) sv.textContent=mEsp+" %"; }
      drawMs(a,v); } },
  { titre:"Copier pour conserver", duree:12000,
    legende:"Parce que la caroline est lisible, les moines copient beaucoup de livres : un texte copié plusieurs fois voyage d'abbaye en abbaye. Grâce à ces copies, de nombreux textes de l'Antiquité nous sont parvenus.",
    voix:"Parce que cette écriture est claire, les moines recopient beaucoup de livres dans leurs ateliers d'écriture. Un livre copié plusieurs fois voyage d'une abbaye à l'autre. Si un exemplaire se perd ou s'abîme, il en reste d'autres. Grâce à ces copies, de nombreux textes de l'Antiquité, comme ceux de Virgile ou de Cicéron, nous sont parvenus jusqu'à aujourd'hui.",
    anim(t,a){ const s=a.seg; a.op(R.lt,0); a.op(R.ms,1-s(t,0,.1)); a.op(R.map,s(t,0,.12)); a.op(R.emp,.35); a.op(R.empT,0); a.op(R.aix,0); R.com.forEach(g=>a.op(g,0)); a.op(R.pan,1); a.op(R.p1,0); a.op(R.p2,0); a.op(R.p3,0);
      a.op(R.p6,s(t,.1,.25)); a.op(R.pMs,s(t,.1,.3)); a.op(R.cnt,s(t,.1,.25));
      R.abb.forEach(g=>a.op(g,s(t,.1,.2))); a.op(R.rome,s(t,.1,.2));
      const dep=s(t,.2,.4); a.op(R.orig,s(t,.15,.22)); const T=V.Tours,Ro=V.Rome; a.tr(R.orig,a.lerp(Ro[0],T[0]-18,dep),a.lerp(Ro[1],T[1]-24,dep)-Math.sin(dep*Math.PI)*40);
      a.op(R.copT,s(t,.42,.5)); a.tr(R.copT,T[0]+18,T[1]-24); a.op(R.legTxt,s(t,.15,.25)); R.legTxt.textContent=t<.42?"Un texte antique (exemple : Virgile) arrive dans un atelier d'écriture":"Les moines recopient le livre, puis envoient les copies";
      const dest=["Tours","Corbie","Reims","Fulda","SaintGall"]; let n=1+(t>=.45?1:0);
      R.cop.forEach((g,i)=>{ const u=s(t,.55+i*.07,.75+i*.07); const q=V[dest[i]]; if(i===0){ a.op(g,0); return; } a.op(g,u>0?1:0); a.tr(g,a.lerp(T[0],q[0],u),a.lerp(T[1],q[1],u)-Math.sin(u*Math.PI)*22+ -24 ); if(u>=1) n++; });
      n=Math.min(n,6); R.cntN.textContent=String(n); } },
  { titre:"Idée fausse et synthèse", duree:11000,
    legende:"Charlemagne n'a pas inventé l'école pour tous : il a encouragé des écoles pour quelques-uns. Mais l'écriture lisible et les copies ont aidé à transmettre le savoir.",
    voix:"Retenons l'essentiel. Une idée fausse : Charlemagne aurait inventé l'école pour tous les enfants. En réalité, il encourage des écoles près des évêchés et des monastères, surtout pour former des prêtres, des moines et des aides du roi. Pour gouverner un grand empire, il s'appuie sur des comtes, des envoyés et des textes écrits. Et grâce à la minuscule caroline, les livres sont copiés et de nombreux textes de l'Antiquité sont sauvés.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.12)); a.op(R.pan,1-s(t,0,.12)); a.op(R.sy,1); a.op(R.myth,s(t,.1,.25)); a.cls(R.myth.faux,"pulse",t>.25&&t<.4);
      R.syP.forEach((g,i)=>{ const v=s(t,.35+i*.15,.5+i*.15); a.op(g,v); a.tr(g,(1-v)*50,0); });
      a.op(R.fr,1); ["e768","e789","e800","e814"].forEach((id,i)=>a.op(R.fr.events[id],s(t,.2+i*.14,.3+i*.14))); R.fr.at(a.lerp(768,814,s(t,.2,.8)),""); a.op(R.fr.cursor,0); } },
  ]
});
})();
