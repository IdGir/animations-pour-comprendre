/* META {"id":"histoire-C3-imprimerie-gutenberg","matiere":"histoire","annee":"connexe","periode":1,"theme":"connexe","resume":"Copie à la main ou presse à caractères mobiles : comment Gutenberg (Mayence, vers 1450) fait imprimer des livres en série, comment on compose une ligne (manipulation : composer un mot), et comment l'imprimerie se diffuse en Europe.","motsCles":["imprimerie","Gutenberg","caractères mobiles","presse","composteur","Bible à 42 lignes","copiste","Mayence","diffusion","Moyen Âge"]} */
//@data europe
(function(){
const E=EUROPE;
const C={ink:"#1E2430",paper:"#FBF6EE",parch:"#F3E4BE",wood:"#8C5A32",woodD:"#6A4624",metal:"#8A94A6",metalD:"#4A5468",or:"#E07A1F",red:"#C0392B",ok:"#2E8B57",blue:"#2F6DB5",sea:"#DCEBF5",land:"#F5EFE2",cu:"#C27A4A"};
const SERIF="Georgia, 'Times New Roman', serif";
const LETTERS=["A","B","C","E","I","L","M","N","O","P","R","S","T","U","V"," "];
let R={}, a0, WORD="IN PRINCIPIO";
const L=(a,b,t)=>a+(b-a)*t;
function txt(p,x,y,s,o){ o=o||{}; const t=a0.el("text",{x,y,"text-anchor":o.anchor||"middle","font-size":o.size||26,"font-weight":o.weight||800,fill:o.fill||C.ink,stroke:o.stroke===undefined?"#fff":o.stroke,"stroke-width":o.sw||5,"paint-order":"stroke","font-family":o.font||null},p); t.textContent=s; return t; }
// carte (zoom sur l'Europe occidentale et centrale)
let Z={s:2.6,cx:660,cy:380,tx:800,ty:380};
const P=p=>[Z.tx+Z.s*(p[0]-Z.cx), Z.ty+Z.s*(p[1]-Z.cy)];
const VILLES=[ // [nom, x, y (projection de la carte d'Europe), année, étiquette, dx, dy, ancre]
 ["Mayence",631,300,1450,"vers 1450",18,4,"start"],["Strasbourg",620,335,1458,"vers 1458",18,6,"start"],["Cologne",612,275,1465,"vers 1465",-18,-4,"end"],
 ["Rome",696,508,1467,"1467",18,4,"start"],["Venise",695,418,1469,"1469",18,4,"start"],["Paris",531,318,1470,"1470",-18,4,"end"],
 ["Lyon",563,401,1473,"1473",-18,4,"end"],["Cracovie",819,299,1473,"1473",18,4,"start"],["Londres",502,245,1476,"1476",-18,4,"end"],["Dijon",571,363,1491,"vers 1491",-18,6,"end"]];
const LAYERS=()=>[R.s1,R.s2,R.s3,R.s4,R.s5,R.s6,R.myth2,R.map,R.lab,R.date,R.note,R.s8,R.ph1,R.ph2,R.ph3];
function only(a,...ls){ LAYERS().forEach(e=>a.op(e,0)); ls.forEach(e=>a.op(e,1)); }
// tuile de caractère (vue du dessus : lettre à l'envers)
function tile(a,p,w,h){ const g=a.el("g",{},p);
  a.el("rect",{x:-w/2,y:-h/2,width:w,height:h,rx:6,fill:"#B9C0CC",stroke:C.metalD,"stroke-width":3},g);
  a.el("rect",{x:-w/2+5,y:-h/2+5,width:w-10,height:h-10,rx:4,fill:"#8F98A8"},g);
  g.ch=a.el("text",{x:0,y:h*.2,"text-anchor":"middle","font-size":h*.62,"font-weight":800,fill:"#1E2430","font-family":SERIF,transform:"scale(-1,1)"},g);
  return g; }
function pageLines(a,p,x,y,w,n,lh,col){ for(let i=0;i<n;i++){ const ww=w*(i===n-1?.55:1); a.el("rect",{x,y:y+i*lh,width:ww,height:6,rx:3,fill:col||"#C9CED8"},p); } }

Anim.run({
  titre:"L'imprimerie de Gutenberg",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge et la fin du Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Comment faire cent livres identiques, quand chaque livre est copié à la main ?",
  manipDes:3, manipJusqua:3,
  init(a){
    a0=a; const {el}=a;
    // ===== étape 1 : copier à la main
    const g1=a.layer("copie"); R.s1=g1; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g1);
    txt(g1,800,70,"Avant 1450 : on copie les livres à la main",{size:38,stroke:C.paper});
    el("rect",{x:0,y:780,width:1600,height:120,fill:"#E9DDC4"},g1);
    // pupitre + copiste
    R.page=el("rect",{x:430,y:190,width:330,height:370,rx:6,fill:C.parch,stroke:"#B8A06A","stroke-width":4},g1);
    el("rect",{x:455,y:215,width:46,height:46,rx:4,fill:C.red},g1); el("rect",{x:462,y:222,width:32,height:32,rx:3,fill:"#F2C230"},g1);
    R.wl=[]; for(let i=0;i<13;i++){ const y=222+i*24; const x0=i<2?512:456; const w=730-x0; const line=el("rect",{x:x0,y:y,width:w,height:7,rx:3,fill:"#4A3A2A"},g1); const cover=el("rect",{x:x0,y:y-4,width:w,height:15,fill:C.parch},g1); R.wl.push({x0,w,cover}); }
    el("path",{d:"M380,590 L810,590 L790,650 L400,650Z",fill:C.wood,stroke:C.woodD,"stroke-width":4},g1); el("rect",{x:440,y:650,width:18,height:130,fill:C.woodD},g1); el("rect",{x:732,y:650,width:18,height:130,fill:C.woodD},g1);
    // copiste
    R.sc=el("g",{transform:"translate(270,780)"},g1);
    el("path",{d:"M-70,0 L-48,-190 L48,-190 L70,0Z",fill:"#7A5A3A",stroke:C.ink,"stroke-width":4,"stroke-linejoin":"round"},R.sc);
    el("circle",{cx:0,cy:-232,r:36,fill:"#F1C9A5",stroke:C.ink,"stroke-width":4},R.sc); el("path",{d:"M-34,-240 Q0,-290 34,-240 Q0,-262 -34,-240Z",fill:"#5A3A22"},R.sc);
    R.sArm=el("g",{transform:"translate(30,-160)"},R.sc); el("line",{x1:0,y1:0,x2:110,y2:-40,stroke:"#7A5A3A","stroke-width":22,"stroke-linecap":"round"},R.sArm); el("line",{x1:110,y1:-40,x2:150,y2:-110,stroke:"#fff","stroke-width":5,"stroke-linecap":"round"},R.sArm); el("circle",{cx:112,cy:-40,r:12,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2},R.sArm);
    R.l1a=a.label(g1,180,320,"Le copiste écrit\nchaque lettre à la main",{size:24,fill:"#fff",stroke:"#7A5A3A",w:320,h:92});
    R.l1b=a.label(g1,190,438,"Des fautes de copie\nsont possibles",{size:22,fill:"#fff",stroke:C.red,w:270,h:80});
    // calendrier
    R.cal=el("g",{},g1); txt(R.cal,1160,200,"Une Bible : 1 286 pages à copier",{size:28,stroke:C.paper});
    const MO=["janv.","fév.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."]; R.mo=MO.map((m,i)=>{ const x=860+(i%6)*104, y=240+Math.floor(i/6)*74; const r=el("rect",{x,y,width:92,height:58,rx:10,fill:"#fff",stroke:C.or,"stroke-width":3},R.cal); el("text",{x:x+46,y:y+38,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.ink,text:m},R.cal); return r; });
    R.pages=txt(R.cal,1160,430,"",{size:34,fill:C.red,stroke:C.paper});
    R.res=a.label(R.cal,1160,580,"Environ 1 an de travail\npour 1 seul livre",{size:34,fill:"#FFF4DC",stroke:C.red,w:560,h:130});
    R.book=el("g",{},R.cal); el("rect",{x:1070,y:660,width:180,height:100,rx:8,fill:"#7A5A3A",stroke:C.ink,"stroke-width":4},R.book); el("rect",{x:1090,y:672,width:140,height:76,rx:4,fill:"#F2C230"},R.book); el("line",{x1:1160,y1:672,x2:1160,y2:748,stroke:C.ink,"stroke-width":4},R.book);
    // ===== étape 2 : avant Gutenberg + idée fausse
    const g2=a.layer("asie"); R.s2=g2; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g2);
    txt(g2,800,66,"Gutenberg a-t-il inventé l'imprimerie ?",{size:38,stroke:C.paper});
    const fx=y=>100+(y-800)/700*1400; R.fx=fx; const FY=330;
    el("line",{x1:100,y1:FY,x2:1500,y2:FY,stroke:C.ink,"stroke-width":5},g2);
    [800,900,1000,1100,1200,1300,1400,1500].forEach(v=>{ el("line",{x1:fx(v),y1:FY-9,x2:fx(v),y2:FY+9,stroke:C.ink,"stroke-width":3},g2); el("text",{x:fx(v),y:FY+(([900,1100,1300,1500].indexOf(v)>=0)?-18:34),"text-anchor":"middle","font-size":18,fill:"#8A93A6",text:String(v)},g2); });
    R.fr=[[868,"Chine, 868\nplanches de bois gravées",true,C.red],[1040,"Chine, vers 1040\ncaractères en terre cuite",false,C.red],[1230,"Corée, vers 1230\ncaractères mobiles en métal",true,C.red],[1377,"Corée, 1377 : le Jikji,\nplus ancien livre conservé\nimprimé en caractères de métal",false,C.red],[1450,"Mayence, vers 1450\nGutenberg",true,C.blue]].map(([y,s,up,col])=>{
      const g=el("g",{},g2); el("circle",{cx:fx(y),cy:FY,r:12,fill:col,stroke:"#fff","stroke-width":3},g);
      const n=s.split("\n").length; const bh=n*29+22; const by=up?FY-90-bh/2:FY+90+bh/2; el("line",{x1:fx(y),y1:FY+(up?-12:12),x2:fx(y),y2:up?by+bh/2:by-bh/2,stroke:col,"stroke-width":3},g);
      const lb=a.label(g,fx(y),by,s,{size:22,fill:"#fff",stroke:col,w:Math.max(...s.split("\n").map(l=>l.length))*12.4+30,h:bh}); return g; });
    R.myth2=a.layer("myth2"); a.myth(R.myth2,250,560,1100,"« Gutenberg a inventé l'imprimerie. »","On imprimait déjà en Chine et en Corée, des siècles avant. Vers 1450, Gutenberg met au point en Europe un système très efficace : lettres en métal, presse et encre grasse.");
    // ===== étape 3 : fabriquer les lettres
    const g3=a.layer("lettres"); R.s3=g3; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g3);
    R.f1=a.label(g3,300,100,"1. Le poinçon, en acier,\nmarque la matrice, en cuivre",{size:23,fill:"#fff",stroke:C.metalD,w:460,h:84});
    R.f2=a.label(g3,820,100,"2. On verse du métal fondu\ndans un moule",{size:23,fill:"#fff",stroke:C.or,w:420,h:84});
    R.f3=a.label(g3,1310,100,"3. Des lettres\ntoutes identiques",{size:23,fill:"#fff",stroke:C.ok,w:340,h:84});
    // panneau 1
    R.mat=el("g",{},g3); el("rect",{x:220,y:410,width:160,height:60,rx:5,fill:C.cu,stroke:"#7A4A2A","stroke-width":4},R.mat);
    R.matE=el("text",{x:300,y:455,"text-anchor":"middle","font-size":46,"font-weight":800,fill:"#5A2F14","font-family":SERIF,text:"E"},R.mat);
    R.punch=el("g",{},g3); el("rect",{x:280,y:200,width:40,height:150,rx:4,fill:"#9AA3B2",stroke:C.metalD,"stroke-width":4},R.punch); el("rect",{x:272,y:350,width:56,height:44,rx:3,fill:"#6E7789",stroke:C.metalD,"stroke-width":4},R.punch); el("text",{x:300,y:384,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff","font-family":SERIF,transform:"translate(600,0) scale(-1,1)",text:"E"},R.punch);
    R.punchL=txt(g3,300,196,"poinçon",{size:22,weight:700,stroke:C.paper}); R.matL=txt(g3,300,505,"matrice",{size:22,weight:700,stroke:C.paper});
    // panneau 2 : moule
    R.mold=el("g",{},g3); el("rect",{x:760,y:300,width:44,height:200,fill:"#9AA3B2",stroke:C.metalD,"stroke-width":4},R.mold); el("rect",{x:836,y:300,width:44,height:200,fill:"#9AA3B2",stroke:C.metalD,"stroke-width":4},R.mold); el("rect",{x:804,y:470,width:32,height:30,fill:C.cu,stroke:"#7A4A2A","stroke-width":3},R.mold);
    R.fill=el("rect",{x:804,y:470,width:32,height:0,fill:"#F08A24"},g3);
    R.pot=el("g",{},g3); el("path",{d:"M-60,-40 L60,-40 L48,40 L-48,40Z",fill:"#4A4F5A",stroke:C.ink,"stroke-width":4,"stroke-linejoin":"round"},R.pot); el("ellipse",{cx:0,cy:-40,rx:60,ry:10,fill:"#F08A24"},R.pot);
    R.stream=el("line",{x1:820,y1:250,x2:820,y2:470,stroke:"#F08A24","stroke-width":9,"stroke-linecap":"round"},g3);
    R.moldL=txt(g3,820,545,"moule",{size:22,weight:700,stroke:C.paper});
    R.alloy=el("g",{},g3); el("rect",{x:640,y:580,width:900,height:200,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.alloy); txt(R.alloy,1090,630,"L'alliage : plomb + étain + antimoine",{size:30,stroke:"#fff"});
    [["plomb","#7F8794"],["étain","#C9CED8"],["antimoine","#3C4252"]].forEach(([n,c],i)=>{ const x=770+i*270; el("rect",{x:x-45,y:660,width:90,height:46,rx:8,fill:c,stroke:C.ink,"stroke-width":3},R.alloy); txt(R.alloy,x,740,n,{size:24,weight:700,stroke:"#fff"}); if(i<2) txt(R.alloy,x+135,694,"+",{size:40,stroke:"#fff"}); });
    // panneau 3 : pièces
    R.pcs=[...Array(8)].map((_,i)=>{ const g=el("g",{transform:`translate(${1150+i*44},0)`},g3); el("rect",{x:-17,y:300,width:34,height:96,rx:3,fill:"#B9C0CC",stroke:C.metalD,"stroke-width":3},g); el("rect",{x:-12,y:305,width:24,height:26,rx:2,fill:"#6E7789"},g); el("text",{x:0,y:327,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#fff","font-family":SERIF,transform:"scale(-1,1)",text:"E"},g); return g; });
    R.pcL=txt(g3,1310,450,"caractères mobiles",{size:24,weight:700,stroke:C.paper}); R.pcL2=txt(g3,1310,482,"(lettre en relief, à l'envers)",{size:21,weight:600,fill:"#4A5468",stroke:C.paper});
    R.arr1=a.arrow(g3,"M420,330 L640,330",{color:C.or,w:6,head:3.5}); R.arr2=a.arrow(g3,"M900,350 L1090,350",{color:C.or,w:6,head:3.5});
    // ===== étape 4 : composer (manipulation)
    const g4=a.layer("composer"); R.s4=g4; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g4);
    txt(g4,135,170,"casse",{size:26,fill:"#6A4624",stroke:C.paper}); el("text",{x:135,y:204,"text-anchor":"middle","font-size":19,fill:"#6A4624",text:"(le meuble"},g4); el("text",{x:135,y:226,"text-anchor":"middle","font-size":19,fill:"#6A4624",text:"aux lettres)"},g4);
    const CW=137,CH=84,CX0=252,CY0=118;
    el("rect",{x:CX0-8,y:CY0-8,width:CW*8+16,height:CH*2+4+16,rx:10,fill:C.wood,stroke:C.woodD,"stroke-width":4},g4);
    R.cells=LETTERS.map((l,i)=>{ const c=i%8, r=Math.floor(i/8); const x=CX0+c*CW, y=CY0+r*(CH+4); const rc=el("rect",{x:x+2,y:y+2,width:CW-4,height:CH-4,rx:6,fill:"#F6ECD2",stroke:"#B8A06A","stroke-width":3},g4); el("text",{x:x+CW/2,y:y+CH/2+16,"text-anchor":"middle","font-size":l===" "?22:46,"font-weight":800,fill:"#5A4A30","font-family":SERIF,text:l===" "?"espace":l},g4); return {rc,cx:x+CW/2,cy:y+CH/2}; });
    txt(g4,135,420,"composteur",{size:24,fill:"#4A5468",stroke:C.paper});
    el("rect",{x:216,y:352,width:1168,height:116,rx:8,fill:"#C9CED8",stroke:C.metalD,"stroke-width":5},g4); el("rect",{x:228,y:360,width:1144,height:100,rx:4,fill:"#EEF0F4",stroke:"#9AA3B2","stroke-width":2},g4); el("rect",{x:216,y:352,width:20,height:116,rx:4,fill:C.metalD},g4);
    R.tiles=[...Array(12)].map(()=>{ const t=tile(a,g4,70,94); return t; });
    R.warn=txt(g4,800,506,"Dans le composteur, les lettres sont à l'envers !",{size:24,fill:"#7A1D12",stroke:C.paper});
    R.proof=el("g",{},g4); el("rect",{x:216,y:556,width:1168,height:210,rx:10,fill:"#fff",stroke:"#B8A06A","stroke-width":4},R.proof); R.proofT=el("text",{x:800,y:690,"text-anchor":"middle","font-size":96,"font-weight":800,fill:"#1E2430","font-family":SERIF},R.proof); txt(R.proof,800,590,"Imprimé sur le papier : le mot se lit à l'endroit",{size:24,fill:"#14532D",stroke:"#fff"});
    R.counter=txt(g4,222,506,"",{size:22,anchor:"start",fill:"#4A5468",stroke:C.paper});
    // ===== étape 5 : la presse
    const g5=a.layer("presse"); R.s5=g5; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g5);
    el("rect",{x:0,y:790,width:1600,height:110,fill:"#E9DDC4"},g5);
    el("rect",{x:300,y:745,width:540,height:45,rx:6,fill:C.woodD},g5);
    [[330,360],[780,810]].forEach(([x0,x1])=>el("rect",{x:x0,y:130,width:x1-x0,height:620,fill:C.wood,stroke:C.woodD,"stroke-width":4},g5));
    el("rect",{x:315,y:130,width:510,height:56,rx:6,fill:C.wood,stroke:C.woodD,"stroke-width":4},g5);
    R.screw=el("g",{},g5); R.screwR=el("rect",{x:557,y:30,width:26,height:300,fill:"#A9A294",stroke:C.ink,"stroke-width":3},R.screw);
    R.threads=[...Array(12)].map((_,i)=>el("line",{x1:557,y1:50+i*24,x2:583,y2:62+i*24,stroke:C.ink,"stroke-width":3},R.screw));
    R.bar=el("line",{x1:420,y1:46,x2:720,y2:46,stroke:C.woodD,"stroke-width":14,"stroke-linecap":"round"},g5);
    R.platen=el("rect",{x:430,y:330,width:280,height:34,rx:6,fill:C.wood,stroke:C.woodD,"stroke-width":4},g5);
    el("rect",{x:430,y:560,width:280,height:30,rx:4,fill:C.woodD},g5);
    R.form=el("rect",{x:470,y:536,width:200,height:24,rx:3,fill:"#7A8296",stroke:C.metalD,"stroke-width":3},g5);
    R.sheet=el("rect",{x:462,y:528,width:216,height:8,rx:2,fill:"#fff",stroke:"#B8A06A","stroke-width":2},g5);
    R.ink=el("g",{},g5); el("circle",{cx:0,cy:0,r:30,fill:"#1E2430",stroke:"#000","stroke-width":3},R.ink); el("rect",{x:-8,y:-80,width:16,height:60,rx:6,fill:C.wood},R.ink);
    R.lblInk=a.label(g5,150,330,"1. On encre\nles lettres",{size:23,fill:"#fff",stroke:C.ink,w:230,h:84});
    R.lblPress=a.label(g5,150,520,"2. La presse appuie\nfort sur la feuille",{size:23,fill:"#fff",stroke:C.wood,w:270,h:84});
    R.lblPressoir=a.label(g5,560,100,"vis de bois : comme un pressoir à vin",{size:22,fill:"#fff",stroke:C.woodD,w:440,h:50});
    R.stack=el("g",{},g5); R.sheets=[0,1,2].map(i=>{ const g=el("g",{},R.stack); el("rect",{x:930+i*18,y:190-i*0,width:250,height:350,rx:4,fill:"#fff",stroke:"#B8A06A","stroke-width":3,filter:"drop-shadow(0 3px 5px rgba(0,0,0,.25))"},g); return g; });
    R.sheetT=[0,1,2].map(i=>{ const g=R.sheets[i]; const t=el("text",{x:930+i*18+125,y:250,"text-anchor":"middle","font-size":36,"font-weight":800,fill:"#1E2430","font-family":SERIF},g); pageLines(a,g,950+i*18,285,210,9,24,"#C9CED8"); return t; });
    R.cnt=txt(g5,1060,590,"",{size:30,fill:C.red,stroke:C.paper}); R.lblCopies=a.label(g5,1050,125,"3. On recommence :\nautant de copies que l'on veut",{size:23,fill:"#E8F6EE",stroke:C.ok,w:380,h:84});
    // ===== étape 6 : Bible en série
    const g6=a.layer("bible"); R.s6=g6; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g6);
    R.info=el("g",{},g6); el("rect",{x:60,y:590,width:500,height:200,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.info);
    [["La Bible à 42 lignes",34],["1 286 pages, en 2 volumes",28],["Une cinquantaine d'exemplaires",26],["encore conservés aujourd'hui",26]].forEach(([s,fs],i)=>el("text",{x:310,y:632+i*42,"text-anchor":"middle","font-size":fs,"font-weight":i?600:800,fill:i?C.ink:C.blue,text:s},R.info));
    txt(g6,1080,80,"En deux ans environ…",{size:38,stroke:C.paper});
    el("rect",{x:640,y:110,width:900,height:12,rx:6,fill:"#E1E5EC"},g6); R.timeBar=el("rect",{x:640,y:110,width:0,height:12,rx:6,fill:C.or},g6); R.timeT=txt(g6,1090,162,"",{size:26,fill:"#4A5468",stroke:C.paper});
    txt(g6,720,222,"Un copiste",{size:28,anchor:"start",fill:"#7A5A3A",stroke:C.paper}); R.cop=[0,1].map(i=>{ const g=el("g",{},g6); el("rect",{x:700+i*130,y:250,width:100,height:70,rx:6,fill:"#7A5A3A",stroke:C.ink,"stroke-width":3},g); el("rect",{x:712+i*130,y:260,width:76,height:50,rx:3,fill:"#F2C230"},g); return g; }); R.copN=txt(g6,1090,298,"",{size:30,anchor:"start",fill:"#7A5A3A",stroke:C.paper});
    txt(g6,720,402,"L'atelier de Gutenberg",{size:28,anchor:"start",fill:C.blue,stroke:C.paper});
    R.grid=[]; for(let i=0;i<180;i++){ const c=i%18, r=Math.floor(i/18); R.grid.push(el("rect",{x:700+c*30,y:430+r*30,width:24,height:26,rx:3,fill:C.blue,stroke:"#173F73","stroke-width":2},g6)); }
    R.atN=txt(g6,1300,420,"",{size:40,anchor:"end",fill:C.blue,stroke:C.paper});
    R.six=txt(g6,1090,760,"jusqu'à six presses travaillent en même temps",{size:24,weight:600,fill:"#4A5468",stroke:C.paper});
    R.ex=el("text",{x:1540,y:835,"text-anchor":"end","font-size":20,fill:"#5A6478",text:"Chiffres estimés par les historiens : environ 150 à 180 exemplaires."},g6);
    // ===== étape 7 : carte de diffusion
    const map=a.layer("map"); R.map=map;
    const defs=el("defs",{},a.svg); const cp=el("clipPath",{id:"terre"},defs); el("path",{d:E.land},cp);
    const cz=el("clipPath",{id:"zoneCarte"},defs); el("rect",{x:0,y:0,width:1600,height:760,rx:14},cz); a.svg.insertBefore(defs,a.svg.firstChild);
    map.setAttribute("clip-path","url(#zoneCarte)"); el("rect",{x:-2000,y:-2000,width:6000,height:5000,fill:C.sea},map);
    R.inner=el("g",{},map); el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":1},R.inner);
    const lab=a.layer("labels"); R.lab=lab;
    R.vl=VILLES.map(v=>{ const g=el("g",{},lab); const ring=el("circle",{r:10,fill:"none",stroke:v[0]==="Mayence"?C.red:C.blue,"stroke-width":4},g); const dot=el("circle",{r:9,fill:v[0]==="Mayence"?C.red:C.blue,stroke:"#fff","stroke-width":3},g);
      const t1=el("text",{x:v[5],y:v[6]-6,"text-anchor":v[7],"font-size":24,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},g); t1.textContent=v[0];
      const t2=el("text",{x:v[5],y:v[6]+19,"text-anchor":v[7],"font-size":22,"font-weight":700,fill:v[0]==="Mayence"?C.red:C.blue,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},g); t2.textContent=v[4];
      return {g,ring,v}; });
    const dg=a.layer("date"); R.date=dg; el("rect",{x:0,y:766,width:1600,height:134,fill:"#F7F1E6"},dg); el("line",{x1:0,y1:766,x2:1600,y2:766,stroke:"#B8AC93","stroke-width":3},dg);
    R.yr=el("text",{x:200,y:838,"text-anchor":"middle","font-size":54,"font-weight":800,fill:C.blue},dg); R.nv=el("text",{x:200,y:878,"text-anchor":"middle","font-size":23,"font-weight":700,fill:"#4A5468"},dg);
    const X=y=>420+(y-1450)/50*1140; R.X=X; el("rect",{x:X(1450),y:812,width:X(1500)-X(1450),height:30,rx:6,fill:"#E1E5EC"},dg);
    for(let y=1450;y<=1500;y+=10){ el("line",{x1:X(y),y1:806,x2:X(y),y2:848,stroke:C.ink,"stroke-width":3},dg); el("text",{x:X(y),y:882,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:String(y)},dg); }
    R.cur=el("g",{},dg); el("path",{d:"M0,800 L0,852",stroke:C.red,"stroke-width":5},R.cur); el("path",{d:"M-13,792 L13,792 L0,808Z",fill:C.red},R.cur);
    R.stat=a.label(lab,1290,610,"Vers 1500 :\nenviron 270 villes en Europe,\nprès de 20 millions de livres\n(estimations des historiens)",{size:25,fill:"#FFF4DC",stroke:C.or,w:520,h:170});
    R.note=el("text",{x:1580,y:748,"text-anchor":"end","font-size":22,fill:"#4A5468",stroke:"#fff","stroke-width":4,"paint-order":"stroke",text:"Dates des premiers ateliers, approximatives"},a.svg);
    // ===== étape 8 : synthèse
    const sg=a.layer("synthese"); R.s8=sg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},sg);
    R.sc8=[["Une invention","Vers 1450, à Mayence : des lettres mobiles en métal, une presse et une encre grasse. On ne l'a pas inventée de rien : on imprimait déjà en Asie.","#2F6DB5"],["Un gain de temps","On compose une fois, puis on imprime autant de copies que l'on veut : 150 à 180 Bibles en deux ans environ.","#E07A1F"],["Des livres partout","Vers 1500, environ 270 villes ont des imprimeurs : plus de livres, moins chers, et des idées qui circulent.","#2E8B57"]].map((c,i)=>{ const g=el("g",{},sg); const y=110+i*230; el("rect",{x:80,y,width:1440,height:200,rx:18,fill:"#fff",stroke:c[2],"stroke-width":5},g); el("rect",{x:80,y,width:340,height:200,rx:18,fill:c[2]},g); el("text",{x:250,y:y+116,"text-anchor":"middle","font-size":38,"font-weight":800,fill:"#fff",text:c[0]},g); const t=el("text",{x:460,y:y+78,"font-size":29,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],56,1.3); return g; });
    // ===== photos
    const lp=a.layer("photos");
    R.ph1=a.photo(lp,{id:"h-c3-caracteres-mobiles",x:60,y:540,w:420,h:240,cap:"Des caractères mobiles en plomb",rot:-2,size:21});
    R.ph2=a.photo(lp,{id:"h-c3-presse-gutenberg",x:1250,y:60,w:290,h:200,cap:"Une presse reconstituée",rot:2,size:21});
    R.ph3=a.photo(lp,{id:"h-c3-bible-gutenberg",x:70,y:100,w:470,h:330,cap:"Une page de la Bible de Gutenberg",rot:-1.5,size:22});
    // manipulation : composer un mot
    a.manip.innerHTML=`Composez un mot : `+LETTERS.map(l=>`<button data-l="${l===" "?"_":l}" aria-label="${l===" "?"espace":l}">${l===" "?"espace":l}</button>`).join("")+` <button data-act="back">⌫ Retirer</button><button data-act="clear">Effacer</button>`;
    a.manip.onclick=e=>{ const b=e.target.closest("button"); if(!b) return; const l=b.getAttribute("data-l"), act=b.getAttribute("data-act");
      if(act==="back") WORD=WORD.slice(0,-1); else if(act==="clear") WORD=""; else if(l&&WORD.length<12) WORD+=(l==="_"?" ":l);
      a.redraw(); };
  },
  reset(a){ LAYERS().forEach(e=>a.op(e,0)); a.op(R.note,0); Z={s:2.6,cx:660,cy:380,tx:800,ty:380}; },
  etapes:[
  { titre:"Avant 1450 : copier à la main", duree:11000,
    legende:"Avant 1450, chaque livre est copié à la main. Il faut environ un an à un copiste pour copier une Bible, et on n'obtient qu'un seul exemplaire.",
    voix:"Avant l'année mille quatre cent cinquante, en Europe, chaque livre est copié à la main par un copiste. Il écrit chaque lettre, une par une. Pour copier une Bible entière, il lui faut environ un an. Et à la fin, il n'y a qu'un seul exemplaire !",
    anim(t,a){ const s=a.seg; only(a,R.s1);
      const p=s(t,.08,.85,true); const nl=R.wl.length;
      R.wl.forEach((w,i)=>{ const v=Math.max(0,Math.min(1,p*nl-i)); w.cover.setAttribute("x",w.x0+w.w*v); w.cover.setAttribute("width",w.w*(1-v)); });
      R.sArm.setAttribute("transform",`translate(30,-160) rotate(${-8+Math.sin(t*160)*6})`);
      a.op(R.l1a,s(t,.02,.12)); a.op(R.l1b,s(t,.45,.55));
      R.mo.forEach((r,i)=>r.setAttribute("fill",p>=(i+1)/12?"#F6D9B0":"#fff"));
      R.pages.textContent="Pages copiées : "+Math.round(1286*p).toLocaleString("fr-FR").replace(/ /g," ");
      a.op(R.res,s(t,.88,.97)); a.op(R.book,s(t,.88,.97)); } },
  { titre:"Gutenberg a-t-il tout inventé ?", duree:12000,
    legende:"On imprimait déjà en Asie : planches de bois en Chine, puis caractères mobiles en Chine et en Corée. Vers 1450, Gutenberg met au point un système très efficace en Europe.",
    voix:"Gutenberg n'est pas le premier à imprimer ! En Chine, dès le neuvième siècle, on imprime avec des planches de bois gravées. Puis, en Chine et en Corée, on invente les caractères mobiles : d'abord en terre cuite, ensuite en métal. Vers mille quatre cent cinquante, à Mayence, Gutenberg met au point un système très efficace pour l'Europe : des lettres en métal, une presse et une encre grasse.",
    anim(t,a){ const s=a.seg; only(a,R.s2);
      R.fr.forEach((g,i)=>{ const v=s(t,.05+i*.14,.17+i*.14); a.op(g,v); });
      a.op(R.myth2,s(t,.78,.92)); a.cls(R.myth2.faux,"pulse",t>.9); } },
  { titre:"Fabriquer des lettres en métal", duree:13000,
    legende:"Un poinçon marque une matrice ; on y coule du métal fondu dans un moule. On obtient autant de lettres identiques que l'on veut, en plomb, étain et antimoine.",
    voix:"Comment fabriquer des lettres en métal ? D'abord, un poinçon en acier est frappé sur un bloc de cuivre : cela fait une matrice, avec la forme d'une lettre. Ensuite, on verse du métal fondu dans un moule. Le métal est un mélange de plomb, d'étain et d'antimoine. En refroidissant, il donne une lettre. On peut en fabriquer autant que l'on veut, et elles sont toutes identiques.",
    anim(t,a){ const s=a.seg; only(a,R.s3); a.op(R.ph1,s(t,.7,.9));
      a.op(R.f1,s(t,.02,.1)); a.op(R.f2,s(t,.36,.44)); a.op(R.f3,s(t,.62,.7));
      const down=s(t,.1,.2)*(1-s(t,.24,.3)); R.punch.setAttribute("transform",`translate(0,${down*52})`); a.op(R.punchL,s(t,.05,.12)); a.op(R.matL,s(t,.05,.12));
      a.op(R.matE,s(t,.2,.28)); a.op(R.arr1,s(t,.3,.36));
      // coulée
      R.pot.setAttribute("transform",`translate(885,${205}) rotate(${-24*s(t,.4,.46)*(1-s(t,.56,.6))} 0 0)`); a.op(R.pot,s(t,.36,.42));
      a.set(R.stream,{y2:L(230,470,1)}); a.op(R.stream,s(t,.44,.48)*(1-s(t,.54,.58)));
      const fh=200*s(t,.46,.56); a.set(R.fill,{y:500-fh,height:fh}); R.fill.setAttribute("x",804); R.fill.setAttribute("width",32);
      a.op(R.moldL,s(t,.36,.44)); a.op(R.arr2,s(t,.58,.64));
      R.pcs.forEach((g,i)=>a.op(g,s(t,.64+i*.035,.7+i*.035))); a.op(R.pcL,s(t,.8,.88)); a.op(R.pcL2,s(t,.84,.92));
      a.op(R.alloy,s(t,.12,.25)); } },
  { titre:"À vous : composer un mot", duree:8000,
    legende:"À vous : cliquez sur les lettres pour composer un mot dans le composteur. Regardez : les lettres sont à l'envers, mais le mot s'imprimera à l'endroit !",
    voix:"À vous de jouer ! L'imprimeur range ses lettres dans une casse. Il les prend une par une et les place dans le composteur, pour composer une ligne. Cliquez sur les lettres pour composer votre mot. Regardez : dans le composteur, les lettres sont à l'envers, mais une fois imprimé, le mot se lit à l'endroit. Prenez votre temps, puis cliquez sur Continuer.",
    anim(t,a){ const s=a.seg; only(a,R.s4);
      const n=WORD.length; const W=80; const x0=800-n*W/2+W/2;
      R.cells.forEach(c=>{ c.rc.setAttribute("stroke","#B8A06A"); c.rc.setAttribute("stroke-width",3); c.rc.setAttribute("fill","#F6ECD2"); });
      R.tiles.forEach((tl,i)=>{ if(i>=n){ a.op(tl,0); return; } const ch=WORD[i]; const ci=Math.max(0,LETTERS.indexOf(ch)); const cell=R.cells[ci];
        const p0=.06+.8*i/Math.max(n,1), p1=.06+.8*(i+1)/Math.max(n,1); const p=s(t,p0,p1);
        a.op(tl,p>0?1:0); const x=L(cell.cx,x0+i*W,p), y=L(cell.cy,410,p)-Math.sin(p*Math.PI)*0; a.tr(tl,x,y,L(.8,1,p));
        tl.ch.textContent=ch===" "?"":ch; tl.firstChild.setAttribute("fill",ch===" "?"#DDE1E8":"#B9C0CC");
        if(p>0&&p<1){ cell.rc.setAttribute("stroke",C.or); cell.rc.setAttribute("stroke-width",6); cell.rc.setAttribute("fill","#FFE7C2"); } });
      const fs=Math.max(34,Math.min(104,1040/Math.max(n,3)/.66)); R.proofT.setAttribute("font-size",fs); R.proofT.textContent=WORD.trim()?WORD:"…";
      a.op(R.proof,s(t,.84,.98)); a.op(R.warn,s(t,.2,.3)); R.counter.textContent=n+" lettre"+(n>1?"s":""); } },
  { titre:"La presse à imprimer", duree:15000,
    legende:"On encre les lettres, on pose une feuille, et la presse, comme un pressoir, appuie fort. Avec la même composition, on imprime autant de feuilles que l'on veut.",
    voix:"Une fois la ligne composée, on encre les lettres avec un tampon. On pose une feuille de papier dessus. Puis on tourne la grande barre : la vis descend et la presse, inspirée du pressoir à vin, appuie très fort sur la feuille. On lève la presse : la page est imprimée. Et avec la même composition, on recommence, autant de fois qu'on le souhaite.",
    anim(t,a){ const s=a.seg; only(a,R.s5); a.op(R.ph2,s(t,.05,.2));
      // encrage
      const e1=s(t,.04,.12), e2=s(t,.2,.28); a.op(R.ink,e1>0&&e2<1?1:0); a.tr(R.ink,L(1180,570,e1)+e2*610,496+(1-e1)*-26-e2*0);
      R.form.setAttribute("fill",s(t,.1,.18)>.5?"#1E2430":"#7A8296"); a.op(R.lblInk,s(t,.03,.1)*(1-s(t,.26,.32)));
      a.op(R.sheet,s(t,.2,.28));
      // trois cycles de pression
      const cyc=s(t,.3,.9,true)*3; const k=Math.min(2,Math.floor(cyc)); const u=cyc>=3?1:cyc-k;
      const press=t<.3?0:Math.sin(u*Math.PI); const ypl=L(330,494,Math.pow(press,.6));
      R.platen.setAttribute("y",ypl); R.screwR.setAttribute("height",ypl-30+6); R.threads.forEach((l,i)=>{ a.op(l,50+i*24<ypl-18?1:0); });
      const len=Math.cos(press*Math.PI*1.6); R.bar.setAttribute("x1",570-150*len); R.bar.setAttribute("x2",570+150*len);
      a.op(R.lblPress,s(t,.3,.38)*(1-s(t,.9,.95)));
      const done=t<.3?0:Math.min(3,k+(u>.5?1:0));
      R.sheets.forEach((g,i)=>{ a.op(g,i<done?1:0); });
      const nn=WORD.trim()?WORD:"…"; const fs=Math.min(44,220/Math.max(nn.length,3)/.66); R.sheetT.forEach(e=>{ e.textContent=nn; e.setAttribute("font-size",fs); });
      R.cnt.textContent=done?"Feuilles imprimées : "+done:""; a.op(R.cnt,done?1:0); a.op(R.lblCopies,s(t,.9,.98)); } },
  { titre:"Une Bible en série", duree:13000,
    legende:"La Bible de Gutenberg (vers 1452-1455) a 1 286 pages. En deux ans environ, l'atelier en imprime 150 à 180 exemplaires ; un copiste, lui, en aurait copié deux.",
    voix:"Voici la Bible de Gutenberg, imprimée à Mayence entre mille quatre cent cinquante-deux et mille quatre cent cinquante-cinq environ. Elle compte mille deux cent quatre-vingt-six pages, en deux volumes. Les historiens estiment que l'atelier en a imprimé entre cent cinquante et cent quatre-vingts exemplaires, en deux ans environ. Pendant ce temps, un copiste n'en aurait copié que deux.",
    anim(t,a){ const s=a.seg; only(a,R.s6); a.op(R.ph3,s(t,.04,.2));
      const m=L(0,24,s(t,.12,.92,true)); R.timeBar.setAttribute("width",900*m/24); R.timeT.textContent="Temps écoulé : "+Math.round(m)+" mois";
      R.cop.forEach((g,i)=>a.op(g,m>=12*(i+1)-.01?1:0)); const nb=Math.floor(m/12+.001); R.copN.textContent=nb?(nb+" livre"+(nb>1?"s":"")):"0 livre";
      const k=Math.round(180*s(t,.12,.92,true)); R.grid.forEach((r,i)=>a.op(r,i<k?1:0)); R.atN.textContent="≈ "+k+" livres"; a.op(R.six,s(t,.5,.6)); } },
  { titre:"L'imprimerie gagne l'Europe", duree:14000,
    legende:"De Mayence, l'imprimerie gagne Strasbourg, Cologne, Rome, Venise, Paris, Lyon, Cracovie, Londres… et Dijon vers 1491. Vers 1500, environ 270 villes ont des imprimeurs.",
    voix:"De Mayence, l'imprimerie se répand très vite. Strasbourg, puis Cologne, Rome, Venise. Paris, en mille quatre cent soixante-dix. Puis Lyon, Cracovie, Londres. En Bourgogne, à Dijon, un premier imprimeur s'installe vers mille quatre cent quatre-vingt-onze. Vers l'an mille cinq cents, environ deux cent soixante-dix villes d'Europe ont des imprimeurs, et près de vingt millions de livres ont été imprimés.",
    anim(t,a){ const s=a.seg; only(a,R.map,R.lab,R.date); a.op(R.note,1); Z={s:2.6,cx:660,cy:380,tx:800,ty:380};
      R.inner.setAttribute("transform",`translate(${Z.tx-Z.s*Z.cx},${Z.ty-Z.s*Z.cy}) scale(${Z.s})`);
      const yr=L(1448,1500,s(t,.04,.88,true)); R.yr.textContent=String(Math.round(yr)); a.tr(R.cur,R.X(Math.max(1450,yr)),0);
      let nv=0; R.vl.forEach(o=>{ const v=o.v; const q=P([v[1],v[2]]); const p=s(yr,v[3]-.5,v[3]+1.2); a.tr(o.g,q[0],q[1]); a.op(o.g,p); if(p>.5) nv++;
        const rr=10+ (1-s(yr,v[3],v[3]+6))*0 + s(yr,v[3],v[3]+5)*26; o.ring.setAttribute("r",rr); o.ring.setAttribute("stroke-opacity",p>0?1-s(yr,v[3]+1,v[3]+5):0); });
      R.nv.textContent=nv+" ville"+(nv>1?"s":"")+" avec imprimerie"; a.op(R.stat,s(t,.9,.98)); } },
  { titre:"Synthèse", duree:11000,
    legende:"Une invention (lettres mobiles en métal, presse, encre), un gain de temps énorme, et des livres qui se répandent dans toute l'Europe.",
    voix:"Pour résumer : vers mille quatre cent cinquante, à Mayence, Gutenberg met au point un système efficace avec des lettres mobiles en métal, une presse et une encre grasse. On compose une fois, puis on imprime autant de copies que l'on veut. Et l'imprimerie se répand dans toute l'Europe : plus de livres, moins chers, et des idées qui circulent.",
    anim(t,a){ const s=a.seg; only(a,R.s8); R.sc8.forEach((g,i)=>{ const v=s(t,.05+i*.28,.2+i*.28); a.op(g,v); a.tr(g,(1-v)*70,0); }); } },
  ]
});
})();
