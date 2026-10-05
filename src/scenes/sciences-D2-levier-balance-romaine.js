/* META {"id":"sciences-D2-levier-balance-romaine","matiere":"sciences","annee":"connexe","periode":1,"theme":"Mouvement, objets techniques : le levier","resume":"Un levier (pivot, charge, effort) permet de soulever une lourde charge avec moins d'effort si le bras est long, mais la main parcourt plus de distance ; balance romaine et balançoire.","motsCles":["levier","pivot","effort","charge","bras de levier","brouette","balance romaine","équilibre"]} */
(function(){
let R={}, E=null, a=null;
let xP=1, spin=0; // manipulation : distance pivot–charge (m) ; temps écoulé dans l'étape de manipulation (ms)
const KM=2, M0=70, MS=190, MY=540, MLEN=4; // étape de manip ; planche de 4 m : x0, px par mètre, hauteur, longueur (m)
const C={piv:"#4A5468",ch:"#C0392B",ef:"#2E8B57",wood:"#C58B4B",woodD:"#8A5A2B",ink:"#1E2430",gris:"#5A6478",blue:"#2563A8",or:"#E07A1F"};
const f1=v=>(Math.round(v*10)/10).toString().replace(".",",");
const f0=v=>Math.round(v).toString();
const f2=v=>(Math.round(v*100)/100).toString().replace(".",",");
const fm=v=>Math.round(v).toLocaleString("fr-FR");
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const rotP=(x,y,deg)=>{ const r=deg*Math.PI/180; return [x*Math.cos(r)-y*Math.sin(r), x*Math.sin(r)+y*Math.cos(r)]; };
const panel=(parent,x,y,w,h,col)=>E("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},parent);
const txt=(parent,x,y,s,o)=>{ o=o||{}; return E("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.color||C.ink,"text-anchor":o.anchor||"start",text:s,stroke:o.halo?"#fff":null,"stroke-width":o.halo?5:null,"paint-order":o.halo?"stroke":null},parent); };
const ar=(parent,col,w)=>a.arrow(parent,"M0,0 L0,10",{color:col,w:w||10,head:3});
function setArrow(g,x1,y1,x2,y2){ g.path.setAttribute("d",`M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)}`); }
// dimension : trait horizontal avec petits repères et texte
function dim(parent,x1,x2,y,label,col,size){ const g=E("g",{},parent); E("line",{x1,y1:y,x2,y2:y,stroke:col,"stroke-width":4},g); E("line",{x1,y1:y-12,x2:x1,y2:y+12,stroke:col,"stroke-width":4},g); E("line",{x1:x2,y1:y-12,x2,y2:y+12,stroke:col,"stroke-width":4},g);
  txt(g,(x1+x2)/2,y+34,label,{size:size||24,color:col,anchor:"middle"}); return g; }
function person(parent,s,col){ const g=E("g",{},parent); E("rect",{x:-20*s,y:-75*s,width:40*s,height:75*s,rx:12*s,fill:col,stroke:"#fff","stroke-width":2},g); E("circle",{cx:0,cy:-95*s,r:20*s,fill:"#F2C79C",stroke:C.ink,"stroke-width":2},g); return g; }

// ---------- levier horizontal commun (étapes 1, 2, 6)
const PX=430, PY=560;
function bar(){ }

Anim.run({
  titre:"Le levier : soulever lourd en forçant moins",
  sousTitre:"Sciences et technologie · CM1-CM2 · Mouvement et objets techniques",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment soulever une charge très lourde avec un petit effort ?",
  manipDes:KM, manipJusqua:KM,
  init(api){
    a=api; E=a.el;
    // ================= levier de base
    const LV=a.layer("lev"); R.LV=LV;
    E("line",{x1:0,y1:PY+120,x2:1600,y2:PY+120,stroke:"#B8BEC8","stroke-width":6},LV);
    R.plankG=E("g",{},LV); R.plankR=E("rect",{x:-150,y:-12,width:760,height:24,rx:5,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.plankG);
    R.crate=E("g",{},R.plankG); E("rect",{x:-155,y:-112,width:110,height:100,rx:6,fill:"#E8B7B0",stroke:C.ch,"stroke-width":4},R.crate); E("line",{x1:-155,y1:-112,x2:-45,y2:-12,stroke:C.ch,"stroke-width":3,opacity:.5},R.crate); E("line",{x1:-45,y1:-112,x2:-155,y2:-12,stroke:C.ch,"stroke-width":3,opacity:.5},R.crate);
    R.crateT=txt(R.crate,-100,-50,"60 kg",{size:30,w:800,anchor:"middle",color:C.ch,halo:1});
    E("path",{d:`M${PX-55},${PY+120} L${PX+55},${PY+120} L${PX},${PY+14} Z`,fill:C.piv,stroke:"#2E3644","stroke-width":3,"stroke-linejoin":"round"},LV);
    // flèches
    R.aEff=ar(LV,C.ef,14); R.aCh=ar(LV,C.ch,12);
    R.tEff=txt(LV,0,0,"",{size:30,w:800,color:C.ef,halo:1});
    // étiquettes vocabulaire
    R.lP=E("g",{},LV); a.label(R.lP,PX,PY+190,"pivot",{size:28,stroke:C.piv,color:C.piv}); a.arrow(R.lP,`M${PX},${PY+168} L${PX},${PY+90}`,{color:C.piv,w:5,head:3});
    R.lC=E("g",{},LV); a.label(R.lC,235,PY-250,"charge",{size:28,stroke:C.ch,color:C.ch}); a.arrow(R.lC,`M265,${PY-226} L310,${PY-150}`,{color:C.ch,w:5,head:3});
    R.lE=E("g",{},LV);
    // cotes
    R.dCh=dim(LV,PX-100,PX,PY+175,"bras de la charge : 1 m",C.ch,24);
    R.dEf=E("g",{},LV); R.dEfLine=E("line",{x1:PX,y1:PY+235,x2:PX+100,y2:PY+235,stroke:C.ef,"stroke-width":4},R.dEf); R.dEfA=E("line",{x1:PX,y1:PY+223,x2:PX,y2:PY+247,stroke:C.ef,"stroke-width":4},R.dEf); R.dEfB=E("line",{x1:PX+100,y1:PY+223,x2:PX+100,y2:PY+247,stroke:C.ef,"stroke-width":4},R.dEf); R.dEfT=txt(R.dEf,PX+50,PY+282,"",{size:24,color:C.ef,anchor:"middle"});
    // panneau de droite (étapes 1, 2, 6)
    R.pn=E("g",{},LV); panel(R.pn,1130,110,430,430);
    R.pnT=txt(R.pn,1160,160,"",{size:28,w:800});
    R.pn1=E("g",{},R.pn); R.pn1a=txt(R.pn1,1160,225,"pivot",{size:30,color:C.piv}); R.pn1b=txt(R.pn1,1160,325,"charge",{size:30,color:C.ch}); R.pn1c=txt(R.pn1,1160,425,"effort",{size:30,color:C.ef});
    E("text",{x:1160,y:260,"font-size":22,"font-weight":600,fill:C.gris,text:"le point qui ne bouge pas"},R.pn1); E("text",{x:1160,y:360,"font-size":22,"font-weight":600,fill:C.gris,text:"ce qu'on veut soulever"},R.pn1); E("text",{x:1160,y:460,"font-size":22,"font-weight":600,fill:C.gris,text:"la force que je fournis"},R.pn1);
    R.pn2=E("g",{},R.pn); R.v1=txt(R.pn2,1160,230,"",{size:28,color:C.ch}); R.v2=txt(R.pn2,1160,290,"",{size:28,color:C.ef}); R.v3=txt(R.pn2,1160,360,"",{size:34,w:800,color:C.ef});
    R.gaugeBG=E("rect",{x:1160,y:405,width:370,height:34,rx:17,fill:"#fff",stroke:C.ink,"stroke-width":2},R.pn2); R.gauge=E("rect",{x:1162,y:407,width:0,height:30,rx:15,fill:C.ef},R.pn2);
    R.gl=txt(R.pn2,1160,478,"",{size:22,color:C.gris,w:600},R.pn2);
    R.pn3=E("g",{},R.pn); R.w1=txt(R.pn3,1160,230,"",{size:30,w:800,color:C.ef}); R.w2=txt(R.pn3,1160,264,"",{size:22,w:600,color:C.gris}); R.w3=txt(R.pn3,1160,335,"",{size:28,w:800,color:C.ef}); R.w4=txt(R.pn3,1160,390,"",{size:28,w:800,color:C.ch}); R.w5=txt(R.pn3,1160,455,"",{size:26,w:700,color:C.ink}); R.w6=txt(R.pn3,1160,500,"",{size:26,w:700,color:C.ink});
    R.ph1=a.photo(LV,{id:"s-d2-brouette",x:1190,y:575,w:300,h:200,cap:"Une brouette",rot:2});
    // ================= MANIPULATION : on déplace le pivot sous une planche de 4 m
    const LM=a.layer("lm"); R.LM=LM;
    E("line",{x1:0,y1:MY+120,x2:1600,y2:MY+120,stroke:"#B8BEC8","stroke-width":6},LM);
    R.mPiv=E("g",{},LM); E("path",{d:"M-55,"+(MY+120)+" L55,"+(MY+120)+" L0,"+(MY+14)+" Z",fill:C.piv,stroke:"#2E3644","stroke-width":3,"stroke-linejoin":"round"},R.mPiv); a.label(R.mPiv,0,MY+158,"pivot",{size:26,stroke:C.piv,color:C.piv});
    R.mPl=E("g",{},LM); R.mPlR=E("rect",{y:-12,height:24,rx:5,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.mPl);
    R.mCr=E("g",{},R.mPl); E("rect",{x:-52,y:-112,width:104,height:100,rx:6,fill:"#E8B7B0",stroke:C.ch,"stroke-width":4},R.mCr); E("line",{x1:-52,y1:-112,x2:52,y2:-12,stroke:C.ch,"stroke-width":3,opacity:.5},R.mCr); E("line",{x1:52,y1:-112,x2:-52,y2:-12,stroke:C.ch,"stroke-width":3,opacity:.5},R.mCr); txt(R.mCr,0,-50,"60 kg",{size:30,w:800,anchor:"middle",color:C.ch,halo:1});
    R.mEnd=E("circle",{r:9,fill:C.ef,stroke:"#fff","stroke-width":3},R.mPl);
    R.mAr=a.arrow(LM,"M0,0 L0,10",{color:C.ef,w:14,head:3}); R.mAt=txt(LM,0,0,"",{size:34,w:800,color:C.ef,anchor:"end",halo:1});
    R.mD1=E("g",{},LM); R.mD2=E("g",{},LM);
    const mdim=(g,col)=>{ const l=E("line",{stroke:col,"stroke-width":4},g), a1=E("line",{y1:-12,y2:12,stroke:col,"stroke-width":4},g), a2=E("line",{y1:-12,y2:12,stroke:col,"stroke-width":4},g), t=txt(g,0,34,"",{size:26,color:col,anchor:"middle"}); return {l,a1,a2,t}; };
    R.mDa=mdim(R.mD1,C.ch); R.mDb=mdim(R.mD2,C.ef);
    R.mP=E("g",{},LM); panel(R.mP,950,110,610,640,C.ef); txt(R.mP,980,162,"Combien faut-il forcer ?",{size:30,w:800});
    R.m1=txt(R.mP,980,225,"",{size:28,color:C.ch}); R.m2=txt(R.mP,980,275,"",{size:28,color:C.ch}); R.m3=txt(R.mP,980,325,"",{size:28,color:C.ef});
    E("line",{x1:980,y1:355,x2:1530,y2:355,stroke:"#D6DBE4","stroke-width":3},R.mP);
    R.m4=txt(R.mP,980,420,"",{size:38,w:800,color:C.ef}); R.m5=txt(R.mP,980,470,"",{size:26,w:600,color:C.gris});
    E("rect",{x:980,y:505,width:540,height:34,rx:17,fill:"#fff",stroke:C.ink,"stroke-width":2},R.mP); R.mG=E("rect",{x:982,y:507,width:0,height:30,rx:15,fill:C.ef},R.mP);
    E("line",{x1:980+162,y1:495,x2:980+162,y2:548,stroke:C.ch,"stroke-width":4},R.mP); txt(R.mP,980+162,578,"charge : 60 kg",{size:22,color:C.ch,anchor:"middle"});
    R.m6=E("text",{x:980,y:640,"font-size":28,"font-weight":800,fill:C.ink},R.mP);
    // ================= étape 3 : exemples
    const L3=a.layer("s3"); R.L3=L3; const PY3=95; panel(L3,40,PY3,750,640); panel(L3,810,PY3,750,640);
    txt(L3,415,PY3+48,"La brouette",{size:32,w:800,anchor:"middle"}); txt(L3,1185,PY3+48,"Le pied-de-biche",{size:32,w:800,anchor:"middle"});
    // brouette
    const bx=70, by=PY3+360; R.bb=E("g",{},L3);
    E("line",{x1:40,y1:by+60,x2:790,y2:by+60,stroke:"#B8BEC8","stroke-width":5},R.bb);
    E("path",{d:`M${bx+90},${by-110} L${bx+370},${by-110} L${bx+330},${by-20} L${bx+130},${by-20} Z`,fill:"#E9ECF2",stroke:C.ink,"stroke-width":4,"stroke-linejoin":"round"},R.bb);
    E("path",{d:`M${bx+60},${by-12} L${bx+390},${by-70}`,stroke:C.woodD,"stroke-width":12,"stroke-linecap":"round"},R.bb);
    E("circle",{cx:bx+80,cy:by,r:58,fill:"none",stroke:C.ink,"stroke-width":14},R.bb); E("circle",{cx:bx+80,cy:by,r:12,fill:C.piv},R.bb);
    E("circle",{cx:bx+245,cy:by-150,r:42,fill:"#E8B7B0",stroke:C.ch,"stroke-width":4},R.bb); txt(R.bb,bx+245,by-140,"45 kg",{size:24,w:800,color:C.ch,anchor:"middle"});
    ar(R.bb,C.ch,10).path.setAttribute("d",`M${bx+245},${by-240} L${bx+245},${by-196}`);
    ar(R.bb,C.ef,10).path.setAttribute("d",`M${bx+390},${by+50} L${bx+390},${by-45}`);
    R.bbP=E("g",{},R.bb); a.label(R.bbP,bx+80,by+130,"pivot",{size:24,stroke:C.piv,color:C.piv});
    txt(R.bb,bx+420,by-140,"effort",{size:26,color:C.ef}); txt(R.bb,bx+420,by-110,"15 kg",{size:34,w:800,color:C.ef});
    dim(R.bb,bx+80,bx+245,by+175,"50 cm",C.ch,24); dim(R.bb,bx+80,bx+390,by+240,"150 cm",C.ef,24);
    txt(R.bb,415,PY3+88,"bras de l'effort 3 fois plus long que celui de la charge",{size:22,w:600,anchor:"middle",color:C.gris});
    // pied-de-biche
    const cx=830; R.pb=E("g",{},L3); const gy=PY3+400;
    E("rect",{x:cx+10,y:gy,width:710,height:56,fill:"#D9B98A",stroke:C.woodD,"stroke-width":3},R.pb);
    E("rect",{x:cx+90-7,y:gy-34,width:14,height:34,fill:"#7B8494",stroke:C.ink,"stroke-width":2},R.pb); E("rect",{x:cx+90-18,y:gy-42,width:36,height:9,rx:3,fill:"#7B8494",stroke:C.ink,"stroke-width":2},R.pb); E("line",{x1:cx+90,y1:gy,x2:cx+90,y2:gy+50,stroke:"#7B8494","stroke-width":10},R.pb);
    E("path",{d:`M${cx+82},${gy-22} L${cx+170},${gy-2} L${cx+650},${gy-140}`,fill:"none",stroke:"#5A6478","stroke-width":16,"stroke-linejoin":"round","stroke-linecap":"round"},R.pb);
    E("circle",{cx:cx+170,cy:gy-2,r:11,fill:C.piv,stroke:"#fff","stroke-width":3},R.pb);
    ar(R.pb,C.ch,10).path.setAttribute("d",`M${cx+82},${gy-150} L${cx+82},${gy-62}`);
    txt(R.pb,cx+82,gy-190,"le clou résiste",{size:22,w:800,color:C.ch,anchor:"middle"}); txt(R.pb,cx+82,gy-168,"comme 60 kg",{size:22,w:800,color:C.ch,anchor:"middle"});
    ar(R.pb,C.ef,10).path.setAttribute("d",`M${cx+650},${gy-250} L${cx+650},${gy-160}`);
    txt(R.pb,cx+620,gy-275,"effort : 10 kg",{size:30,w:800,color:C.ef,anchor:"middle"});
    R.pbP=E("g",{},R.pb); a.label(R.pbP,cx+250,gy+130,"pivot",{size:24,stroke:C.piv,color:C.piv}); a.arrow(R.pbP,`M${cx+235},${gy+108} L${cx+175},${gy+14}`,{color:C.piv,w:4,head:3});
    dim(R.pb,cx+90,cx+170,gy+95,"5 cm",C.ch,24); dim(R.pb,cx+170,cx+650,gy+170,"30 cm",C.ef,24);
    txt(R.pb,1185,PY3+88,"bras de l'effort 6 fois plus long : 60 kg ÷ 6 = 10 kg",{size:22,w:600,anchor:"middle",color:C.gris});
    // ================= étape 4 : balançoire
    const L4=a.layer("s4"); R.L4=L4; const SX=800, SY=600, S=130; R.SX=SX; R.SY=SY; R.S=S;
    E("line",{x1:0,y1:SY+120,x2:1600,y2:SY+120,stroke:"#B8BEC8","stroke-width":6},L4);
    E("path",{d:`M${SX-60},${SY+120} L${SX+60},${SY+120} L${SX},${SY+14} Z`,fill:C.piv,stroke:"#2E3644","stroke-width":3,"stroke-linejoin":"round"},L4);
    R.sw=E("g",{},L4); E("rect",{x:-3.2*S,y:-11,width:6.4*S,height:22,rx:5,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.sw);
    for(let m=-3;m<=3;m++){ if(!m) continue; E("line",{x1:m*S,y1:11,x2:m*S,y2:24,stroke:C.woodD,"stroke-width":3},R.sw); E("text",{x:m*S,y:50,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.gris,text:Math.abs(m)+" m"},R.sw); }
    R.pAd=person(L4,1.15,C.blue); R.pK1=person(L4,.85,C.or); R.pK2=person(L4,.7,C.Cc||"#2E8B57");
    R.b4l=E("g",{},L4); panel(R.b4l,170,120,500,190,C.blue); txt(R.b4l,200,165,"adulte : 60 kg à 1 m du pivot",{size:24,color:C.blue}); R.e4l=txt(R.b4l,200,230,"",{size:40,w:800,color:C.blue}); txt(R.b4l,200,282,"poids × distance",{size:24,w:600,color:C.gris});
    R.b4r=E("g",{},L4); panel(R.b4r,930,120,500,190,C.or); R.t4r=txt(R.b4r,960,165,"",{size:24,color:C.or}); R.e4r=txt(R.b4r,960,230,"",{size:40,w:800,color:C.or}); txt(R.b4r,960,282,"poids × distance",{size:24,w:600,color:C.gris});
    R.eq4=E("g",{},L4); a.label(R.eq4,800,380,"équilibre : 60 = 60",{size:34,stroke:C.ef,color:C.ef,fill:"#E8F6EE"});
    // ================= étape 5 : balance romaine
    const L5=a.layer("s5"); R.L5=L5; const BX=420, BY=330, K=9; R.BX=BX; R.BY=BY; R.K=K;
    R.ring=E("g",{},L5); E("line",{x1:BX,y1:BY,x2:BX,y2:180,stroke:C.piv,"stroke-width":6},R.ring); E("circle",{cx:BX,cy:166,r:20,fill:"none",stroke:C.piv,"stroke-width":8},R.ring);
    R.beam=E("g",{},L5); E("rect",{x:-120,y:-10,width:1020,height:20,rx:5,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.beam);
    for(let k=1;k<=10;k++){ E("line",{x1:k*10*K,y1:10,x2:k*10*K,y2:26,stroke:C.woodD,"stroke-width":4},R.beam); E("text",{x:k*10*K,y:58,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:String(k)},R.beam); }
    E("text",{x:10*10*K+56,y:58,"font-size":24,"font-weight":700,fill:C.gris,text:"kg"},R.beam);
    E("circle",{cx:0,cy:0,r:9,fill:C.piv},R.beam);
    R.cordS=E("line",{stroke:C.piv,"stroke-width":4},L5); R.sac=E("g",{},L5); R.sacB=E("rect",{rx:18,fill:"#E8B7B0",stroke:C.ch,"stroke-width":4},R.sac); R.sacT=txt(R.sac,0,0,"?",{size:32,w:800,color:C.ch,anchor:"middle"});
    R.cordC=E("line",{stroke:C.piv,"stroke-width":4},L5); R.cur=E("g",{},L5); E("circle",{cx:0,cy:0,r:30,fill:"#3A4256",stroke:"#1E2430","stroke-width":3},R.cur); txt(R.cur,0,9,"1 kg",{size:24,w:800,color:"#fff",anchor:"middle"});
    R.lab5=E("g",{},L5); a.label(R.lab5,BX-60,BY+210,"un côté : le sac à peser",{size:24,stroke:C.ch,color:C.ch});
    R.rd=E("g",{},L5); R.rd1=txt(R.rd,80,720,"",{size:28,w:700}); R.rd2=txt(R.rd,80,770,"",{size:30,w:800,color:C.ef}); R.rd3=txt(R.rd,80,820,"",{size:24,w:600,color:C.gris});
    R.ph5=a.photo(L5,{id:"s-d2-romaine",x:1190,y:590,w:320,h:213,cap:"Une balance romaine",rot:-2});
    // ================= synthèse
    const sy=a.layer("syn"); R.syn=sy; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    txt(sy,800,70,"À retenir",{size:38,w:800,anchor:"middle"});
    R.pts=[["1","Un levier a un pivot, une charge et un effort.",C.piv],["2","Plus le bras de l'effort est long, moins il faut forcer.",C.ef],["3","On force moins, mais la main parcourt plus de distance : le levier ne fabrique pas d'énergie.",C.or]].map(([n,t,c],i)=>{
      const g=E("g",{},sy); E("rect",{x:150,y:110+i*105,width:1300,height:88,rx:16,fill:"#fff",stroke:c,"stroke-width":4},g); E("circle",{cx:205,cy:154+i*105,r:28,fill:c},g); E("text",{x:205,y:166+i*105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g);
      E("text",{x:255,y:164+i*105,"font-size":26,"font-weight":700,fill:C.ink,text:t},g); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,150,450,1300,"Un levier fabrique de la force ou de l'énergie en plus.","Non ! Il change seulement la façon de la fournir : on force moins, mais on déplace la main sur une plus grande distance.");
    a.manip.innerHTML=`Place du pivot (distance à la charge) : <input type="range" id="mX" min="0.5" max="3" step="0.25" value="${xP}" aria-label="Distance entre le pivot et la charge"> <b id="mXv" style="min-width:70px">${String(xP).replace(".",",")} m</b>`;
    document.getElementById("mX").oninput=e=>{ xP=+e.target.value; document.getElementById("mXv").textContent=String(xP).replace(".",",")+" m"; a.redraw(); };
    let last=performance.now();
    setInterval(()=>{ const now=performance.now(), dt=Math.min(now-last,100); last=now; if(a.step()===KM){ spin+=dt; a.redraw(); } },40);
  },
  reset(a){ [R.LM,R.mP,R.LV,R.L3,R.L4,R.L5,R.syn,R.myth,R.pn,R.pn1,R.pn2,R.pn3,R.lP,R.lC,R.aEff,R.aCh,R.tEff,R.dCh,R.dEf,R.ph1,R.ph5,R.bb,R.pb,R.b4l,R.b4r,R.eq4,R.lab5,R.rd,R.pAd,R.pK1,R.pK2,R.cordS,R.cordC,R.sac,R.cur].forEach(e=>a.op(e,0));
    R.pts.forEach(g=>a.op(g,0)); },
  etapes:[
  { titre:"Pivot, charge, effort", duree:9000,
    legende:"Un levier est une barre qui tourne autour d'un pivot. On pousse d'un côté (l'effort) pour soulever la charge de l'autre côté.",
    voix:"Voici un levier : une barre rigide qui peut tourner autour d'un point fixe, le pivot. D'un côté, il y a la charge, c'est ce qu'on veut soulever : ici, une caisse de soixante kilos. De l'autre côté, on appuie : c'est l'effort. Quand je pousse la barre vers le bas, la charge monte.",
    anim(t,a){ const s=a.seg; a.op(R.LV,1); a.op(R.pn,s(t,.08,.2)); a.op(R.pn1,1); a.op(R.pn2,0); a.op(R.pn3,0); R.pnT.textContent="Le vocabulaire du levier";
      a.op(R.lP,s(t,.12,.24)); a.op(R.lC,s(t,.28,.4)); a.op(R.lE,0); a.op(R.ph1,s(t,.6,.8)); a.op(R.dCh,0); a.op(R.dEf,0);
      a.set(R.plankR,{width:480}); const eps=8*s(t,.5,.9); R.eps=eps; a.set(R.plankG,{transform:`translate(${PX},${PY}) rotate(${eps})`});
      const [ex,ey]=rotP(100,-12,eps); R.crateT.textContent="60 kg";
      // effort : flèche au bout du bras (1 m)
      const x=PX+ex, y=PY+ey; const len=a.lerp(0,200,s(t,.38,.5)); setArrow(R.aEff,x,y-len,x,y-2); a.op(R.aEff,s(t,.38,.46)); R.tEff.setAttribute("x",x+26); R.tEff.setAttribute("y",y-len/2+10); R.tEff.textContent="effort"; a.op(R.tEff,s(t,.4,.5));
      const [cx,cy]=rotP(-100,-12,eps); a.op(R.aCh,0); } },
  { titre:"Allonger le bras de l'effort", duree:15000,
    legende:"Charge : 60 kg, à 1 m du pivot. Si je pousse à 1 m, il faut 60 kg d'effort. À 2 m : 30 kg. À 3 m : 20 kg. À 6 m : 10 kg seulement !",
    voix:"Gardons la même charge de soixante kilos, à un mètre du pivot. Si je pousse à un mètre du pivot, il me faut un effort de soixante kilos : aucun gain. Je recule la main : à deux mètres, trente kilos suffisent. À trois mètres, vingt kilos. Et à six mètres du pivot, dix kilos seulement ! Plus le bras de l'effort est long, moins il faut forcer.",
    anim(t,a){ const s=a.seg; a.op(R.LV,1); a.op(R.pn,1); a.op(R.pn1,0); a.op(R.pn2,1); a.op(R.pn3,0); R.pnT.textContent="Combien faut-il forcer ?";
      a.op(R.lP,1-s(t,0,.08)); a.op(R.lC,1-s(t,0,.08)); a.op(R.lE,0); a.op(R.ph1,1-s(t,0,.1)); a.op(R.dCh,s(t,.02,.12)); a.op(R.dEf,s(t,.05,.15)); a.op(R.tEff,1);
      a.set(R.plankR,{width:760}); const eps=8*(1-s(t,0,.1)); a.set(R.plankG,{transform:`translate(${PX},${PY}) rotate(${eps})`});
      // distance d(t) par paliers : 1 -> 2 -> 3 -> 6
      const d=1+1*s(t,.22,.34)+1*s(t,.42,.54)+3*s(t,.62,.78);
      const eff=60/d; const [ex,ey]=rotP(100*d,-12,eps); const x=PX+ex, y=PY+ey; const len=eff*3.3; setArrow(R.aEff,x,y-len,x,y-2); a.op(R.aEff,s(t,.1,.18));
      R.tEff.setAttribute("x",x+26); R.tEff.setAttribute("y",y-len/2+10); R.tEff.textContent=f0(eff)+" kg";
      a.set(R.dEfLine,{x2:PX+100*d}); a.set(R.dEfB,{x1:PX+100*d,x2:PX+100*d}); R.dEfT.setAttribute("x",PX+50*d); R.dEfT.textContent="bras de l'effort : "+f1(d)+" m";
      R.v1.textContent="charge : 60 kg à 1 m"; R.v2.textContent="effort à "+f1(d)+" m du pivot"; R.v3.textContent="effort : "+f0(eff)+" kg"; R.gauge.setAttribute("width",366*eff/60); R.gl.textContent="(la jauge se vide quand le bras s'allonge)";
      a.op(R.dEf,s(t,.05,.15)); } },
  { titre:"À vous : déplacez le pivot", duree:8000,
    legende:"À vous : avec le curseur, déplacez le pivot sous la planche de 4 m et regardez l'effort nécessaire pour soulever la charge de 60 kg. Plus le pivot est près de la charge, moins on force.",
    voix:"À vous ! Voici une planche de quatre mètres. À gauche, la charge de soixante kilos. À droite, la main qui pousse. Avec le curseur, déplacez le pivot, et regardez l'effort qu'il faut fournir. Plus le pivot est près de la charge, moins il faut forcer. Au milieu, à deux mètres, il faut autant d'effort que le poids de la charge : aucun gain. Et si le pivot est trop loin de la charge, il faut forcer plus que le poids ! Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.LM,s(t,0,.12)); a.op(R.LV,1-s(t,0,.12)); a.op(R.mP,s(t,.05,.2)); a.op(R.mD1,s(t,.1,.22)); a.op(R.mD2,s(t,.1,.22)); a.op(R.ph1,0);
      const y=MLEN-xP, eff=60*xP/y, px=M0+MS*xP, eps=2.4+2.4*Math.sin(spin/450);
      a.tr(R.mPiv,px,0); R.mPl.setAttribute("transform",`translate(${px},${MY}) rotate(${eps})`);
      a.set(R.mPlR,{x:-xP*MS-30,width:MLEN*MS+60}); a.tr(R.mCr,-xP*MS,0); a.set(R.mEnd,{cx:y*MS,cy:0});
      const [hx,hy]=rotP(y*MS,-12,eps), len=clamp(eff*1.15+18,34,215); setArrow(R.mAr,px+hx,MY+hy-len,px+hx,MY+hy-3); R.mAt.setAttribute("x",px+hx-26); R.mAt.setAttribute("y",MY+hy-len/2+10); R.mAt.textContent=fm(eff)+" kg";
      const d1=MY+190, d2=MY+250, x0=M0, x2=M0+MLEN*MS;
      a.set(R.mDa.l,{x1:x0,x2:px,y1:d1,y2:d1}); a.set(R.mDa.a1,{x1:x0,x2:x0,y1:d1-12,y2:d1+12}); a.set(R.mDa.a2,{x1:px,x2:px,y1:d1-12,y2:d1+12}); R.mDa.t.setAttribute("x",(x0+px)/2); R.mDa.t.setAttribute("y",d1+34); R.mDa.t.textContent="bras de la charge : "+f2(xP)+" m";
      a.set(R.mDb.l,{x1:px,x2:x2,y1:d2,y2:d2}); a.set(R.mDb.a1,{x1:px,x2:px,y1:d2-12,y2:d2+12}); a.set(R.mDb.a2,{x1:x2,x2:x2,y1:d2-12,y2:d2+12}); R.mDb.t.setAttribute("x",(px+x2)/2); R.mDb.t.setAttribute("y",d2+34); R.mDb.t.textContent="bras de l'effort : "+f2(y)+" m";
      R.m1.textContent="charge : 60 kg"; R.m2.textContent="bras de la charge : "+f2(xP)+" m"; R.m3.textContent="bras de l'effort : "+f2(y)+" m";
      R.m4.textContent="effort : "+fm(eff)+" kg"; R.m5.textContent="60 × "+f2(xP)+" ÷ "+f2(y)+" = "+f1(eff);
      R.mG.setAttribute("width",Math.min(536,eff*2.7));
      const v=Math.abs(xP-2)<.01?["Bras égaux : aucun gain.",C.ink]:xP<2?["Bras de l'effort plus long : on force moins !",C.ef]:["Bras de l'effort plus court : on force plus !",C.ch];
      a.wrap(R.m6,v[0],32); R.m6.setAttribute("fill",v[1]); R.m4.setAttribute("fill",v[1]); } },
  { titre:"Brouette et pied-de-biche", duree:11000,
    legende:"La brouette et le pied-de-biche sont des leviers. Avec la brouette, 45 kg se soulèvent avec 15 kg d'effort. Avec le pied-de-biche, un clou qui résiste comme 60 kg s'arrache avec 10 kg.",
    voix:"Les leviers sont partout. Dans une brouette, le pivot est l'axe de la roue. La charge est près de la roue, à cinquante centimètres, et les mains sont tout au bout des bras, à un mètre cinquante. Quarante-cinq kilos se soulèvent avec seulement quinze kilos d'effort. Avec un pied-de-biche, le clou est à cinq centimètres du pivot et la main à trente centimètres : six fois plus loin. Pour un clou qui résiste comme soixante kilos, dix kilos d'effort suffisent.",
    anim(t,a){ const s=a.seg; a.op(R.L3,1); a.op(R.LM,1-s(t,0,.1)); a.op(R.LV,0); a.op(R.bb,s(t,.05,.2)); a.op(R.pb,s(t,.5,.65)); } },
  { titre:"La balançoire : poids × distance", duree:13000,
    legende:"Sur une balançoire, un adulte de 60 kg à 1 m équilibre un enfant de 30 kg à 2 m, ou de 20 kg à 3 m : 60 × 1 = 30 × 2 = 20 × 3.",
    voix:"Sur une balançoire, un adulte de soixante kilos est assis à un mètre du pivot. Un enfant de trente kilos, à un mètre aussi, est trop léger : la balançoire penche du côté de l'adulte. Éloignons l'enfant : à deux mètres du pivot, la balançoire est en équilibre ! Soixante fois un égale trente fois deux. Un enfant de vingt kilos, assis à trois mètres, équilibre aussi l'adulte : vingt fois trois égale soixante.",
    anim(t,a){ const s=a.seg; a.op(R.L4,1); a.op(R.L3,0); a.op(R.pAd,s(t,0,.1)); a.op(R.b4l,s(t,.05,.15)); a.op(R.b4r,s(t,.05,.15));
      // enfant 1 (30 kg) glisse de 1 m à 2 m ; puis enfant 2 (20 kg) à 3 m
      const d1=1+1*s(t,.25,.55); const w2=s(t,.68,.78); const w1=1-w2;
      const m=30*w1+20*w2, dd=d1*w1+3*w2; const torque=m*dd; const eps=clamp(0.35*(torque-60),-14,14);
      a.set(R.sw,{transform:`translate(${R.SX},${R.SY}) rotate(${eps})`});
      const place=(g,s_,k,w)=>{ const [px,py]=rotP(s_*R.S,-11,eps); g.setAttribute("transform",`translate(${R.SX+px},${R.SY+py})`); };
      place(R.pAd,-1,1); place(R.pK1,d1,1); place(R.pK2,3,1);
      a.op(R.pK1,s(t,.1,.2)*w1); a.op(R.pK2,w2);
      R.e4l.textContent="60 × 1 = 60"; R.t4r.textContent=w2>.5?"enfant : 20 kg à 3 m du pivot":"enfant : 30 kg à "+f1(d1)+" m du pivot";
      R.e4r.textContent=w2>.5?"20 × 3 = 60":("30 × "+f1(d1)+" = "+f0(30*d1));
      a.op(R.eq4,Math.abs(eps)<.3?s(t,.55,.62)*(1-s(t,.62,.68))+s(t,.8,.88):0); } },
  { titre:"La balance romaine", duree:17000,
    legende:"Sur la balance romaine, un seul poids de 1 kg glisse le long de la règle. Plus le sac est lourd, plus il faut éloigner le poids du pivot pour équilibrer : 3 kg à 30 cm, 5 kg à 50 cm, 8 kg à 80 cm.",
    voix:"La balance romaine est un levier à bras inégaux. Le sac à peser est accroché près du pivot, à dix centimètres. De l'autre côté, un seul poids d'un kilo glisse le long d'une règle graduée. On le déplace jusqu'à ce que la barre soit bien horizontale. Pour un sac de trois kilos, le poids doit être à trente centimètres. Pour cinq kilos, à cinquante centimètres. Pour huit kilos, à quatre-vingts centimètres. Un petit poids équilibre une grosse charge, en s'éloignant du pivot !",
    anim(t,a){ const s=a.seg; a.op(R.L5,1); a.op(R.L4,0); a.op(R.ph5,s(t,.75,.9)); a.op(R.rd,s(t,.03,.12)); a.op(R.lab5,s(t,.02,.1)); a.op(R.sac,1); a.op(R.cur,1); a.op(R.cordS,1); a.op(R.cordC,1);
      // charge M(t) et position du curseur d(t) en cm
      const M=3+2*s(t,.37,.42)+3*s(t,.66,.71); const d=30*s(t,.06,.26)+20*s(t,.42,.6)+30*s(t,.71,.9);
      const delta=M*10-d; const eps=-clamp(delta*0.22,-14,14);
      a.set(R.beam,{transform:`translate(${R.BX},${R.BY}) rotate(${eps})`});
      const [hx,hy]=rotP(-10*R.K,0,eps); const [cx,cy]=rotP(d*R.K,0,eps);
      const w=48+7*M, hh=w*1.05; const hxw=R.BX+hx, hyw=R.BY+hy+10;
      a.set(R.cordS,{x1:hxw,y1:hyw,x2:hxw,y2:hyw+50}); a.set(R.sacB,{x:hxw-w/2,y:hyw+50,width:w,height:hh}); a.set(R.sacT,{x:hxw,y:hyw+50+hh/2+11});
      const cxw=R.BX+cx, cyw=R.BY+cy+10; a.set(R.cordC,{x1:cxw,y1:cyw,x2:cxw,y2:cyw+34}); R.cur.setAttribute("transform",`translate(${cxw},${cyw+34+30})`);
      const bal=Math.abs(delta)<.8; R.sacT.textContent=bal?f0(M)+" kg":"? kg";
      R.rd1.textContent="Le poids de 1 kg est à "+f0(d)+" cm du pivot";
      R.rd2.textContent=bal?"Barre horizontale : le sac pèse "+f0(M)+" kg":"La barre penche : on continue de glisser le poids…";
      R.rd3.textContent=bal?"1 kg × "+f0(d)+" cm = "+f0(M)+" kg × 10 cm":"";
      R.rd2.setAttribute("fill",bal?C.ef:C.or); } },
  { titre:"On force moins… mais on parcourt plus", duree:12000,
    legende:"Avec un bras 3 fois plus long, la main force 3 fois moins (20 kg au lieu de 60 kg), mais elle descend de 60 cm pour que la charge ne monte que de 20 cm.",
    voix:"Attention : le levier ne donne rien pour rien. Ici, le bras de l'effort est trois fois plus long que celui de la charge. Je force trois fois moins : vingt kilos au lieu de soixante. Mais regardez : ma main descend de soixante centimètres pour que la caisse monte seulement de vingt centimètres. J'ai gagné en force, mais j'ai perdu en distance. Le levier ne fabrique ni force, ni énergie : il change seulement la façon de la fournir.",
    anim(t,a){ const s=a.seg; a.op(R.LV,s(t,0,.12)); a.op(R.L5,1-s(t,0,.12)); a.op(R.pn,1); a.op(R.pn1,0); a.op(R.pn2,0); a.op(R.pn3,1); R.pnT.textContent="Force et distance";
      a.op(R.lP,0); a.op(R.lC,0); a.op(R.lE,0); a.op(R.ph1,0); a.op(R.dCh,0); a.op(R.dEf,0); a.op(R.tEff,1); a.op(R.aEff,1);
      a.set(R.plankR,{width:480}); const u=s(t,.1,.7); const eps=Math.asin(.6/3)*180/Math.PI*u; a.set(R.plankG,{transform:`translate(${PX},${PY}) rotate(${eps})`});
      const [ex,ey]=rotP(300,-12,eps); const x=PX+ex, y=PY+ey; setArrow(R.aEff,x,y-66,x,y-2); R.tEff.setAttribute("x",x+26); R.tEff.setAttribute("y",y-24); R.tEff.textContent="20 kg";
      R.w1.textContent="effort : 20 kg"; R.w2.textContent="(au lieu de 60 kg)";
      R.w3.textContent="main : descend de "+f0(60*u)+" cm"; R.w4.textContent="charge : monte de "+f0(20*u)+" cm";
      a.op(R.w5,s(t,.75,.9)); a.op(R.w6,s(t,.82,.95)); R.w5.textContent="20 × 60 = 1 200"; R.w6.textContent="60 × 20 = 1 200"; } },
  { titre:"Synthèse", duree:10000,
    legende:"Pivot, charge, effort : plus le bras de l'effort est long, moins on force, mais plus la main se déplace. Le levier ne crée pas de force.",
    voix:"Pour retenir. Un levier a un pivot, une charge et un effort. Plus le bras de l'effort est long, moins il faut forcer. Mais on ne gagne rien pour rien : la main parcourt plus de distance. Attention : un levier ne fabrique pas de force, il change seulement la façon de la fournir.",
    anim(t,a){ const s=a.seg; a.op(R.syn,s(t,0,.1)); R.pts.forEach((g,i)=>a.op(g,s(t,.08+i*.12,.18+i*.12))); a.op(R.myth,s(t,.55,.7)); } },
  ]
});
})();
