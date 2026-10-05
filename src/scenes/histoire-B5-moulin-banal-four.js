/* META {"id":"histoire-B5-moulin-banal-four","matiere":"histoire","annee":"B","periode":1,"theme":"Le Moyen Âge : seigneurs, chevaliers, villes… (les banalités)","resume":"Le seigneur possède le moulin à eau et le four du village : les habitants sont obligés de les utiliser et de laisser une part en nature (les banalités). Mécanisme du moulin, exemple chiffré de la part prélevée.","motsCles":["banalités","moulin à eau","four banal","seigneur","paysans","meule","farine","part en nature","redevance"]} */
(function(){
let A=null, R={}, nSacs=48;
const C={ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",red:"#C0392B",bl:"#2563A8",roi:"#6B3FA0",gris:"#4A5468",brown:"#8C6D46",stone:"#D9CCB3",stoneD:"#7A6A50",wood:"#A9743F",woodD:"#6B4524",grain:"#E8C25A"};
const PART=16; // exemple : 1 sac sur 16
function T(p,x,y,s,o){o=o||{};return A.el("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.col||C.ink,"text-anchor":o.anchor||"middle",text:s},p);}
function TL(p,x,y,lines,o){o=o||{};const sz=o.size||24;const t=A.el("text",{x,y,"font-size":sz,"font-weight":o.w||600,fill:o.col||C.ink,"text-anchor":o.anchor||"start"},p);lines.split("\n").forEach((l,i)=>A.el("tspan",{x,dy:i?sz*1.28:0,text:l},t));return t;}
function panel(p,x,y,w,h,title,col){ const g=A.el("g",{},p); A.el("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||C.or,"stroke-width":3.5},g); if(title) T(g,x+w/2,y+44,title,{size:30,w:800,col:col||C.or}); return g; }
function person(p,col,s,o){ o=o||{}; const g=A.el("g",{},p); const q=A.el("g",{transform:`scale(${s})`},g);
  A.el("path",{d:"M-15,-40 L15,-40 L21,0 L-21,0Z",fill:col,stroke:C.ink,"stroke-width":2.4},q);
  A.el("circle",{cx:0,cy:-52,r:13,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.4},q);
  if(o.hat) A.el("path",{d:"M-18,-60 Q0,-76 18,-60Z",fill:"#C9B07A",stroke:C.ink,"stroke-width":2},q);
  if(o.crown) A.el("path",{d:"M-13,-60 l-2,-16 l8,8 l7,-12 l7,12 l8,-8 l-2,16Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":2},q);
  if(o.cap) A.el("path",{d:"M-14,-58 Q0,-72 14,-58Z",fill:o.cap,stroke:C.ink,"stroke-width":2},q);
  if(o.sack) sack(q,-22,-26,.9);
  if(o.basket){ A.el("path",{d:"M-34,-24 L-12,-24 L-15,-6 L-31,-6Z",fill:"#C89B5A",stroke:C.ink,"stroke-width":2},q); A.el("ellipse",{cx:-23,cy:-28,rx:10,ry:6,fill:"#F6E7C6",stroke:C.ink,"stroke-width":1.8},q); }
  g._s=s; return g; }
function sack(p,x,y,s,fill){ const g=A.el("g",{transform:`translate(${x},${y}) scale(${s})`},p); A.el("path",{d:"M-16,16 Q-22,-10 -8,-20 L8,-20 Q22,-10 16,16Z",fill:fill||"#E8D3A2",stroke:"#8A6A3A","stroke-width":3},g); A.el("path",{d:"M-8,-20 L0,-28 L8,-20",fill:"none",stroke:"#8A6A3A","stroke-width":3},g); return g; }
function gearPath(n,rp,h){ const p=2*Math.PI/n, rr=rp-h, rt=rp+h; const P=(r,a)=>(r*Math.cos(a)).toFixed(1)+","+(r*Math.sin(a)).toFixed(1); let d=""; for(let k=0;k<n;k++){ const a=k*p; d+=(k?" L":"M")+P(rr,a-.30*p)+" L"+P(rt,a-.17*p)+" L"+P(rt,a+.17*p)+" L"+P(rr,a+.30*p); } return d+"Z"; }
const GX1=580, GX2=700, GY=640, RP1=90, RP2=30;
Anim.run({
  titre:"Le moulin et le four du seigneur : les banalités",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire", manipDes:3, manipJusqua:3,
  accroche:"Moudre son grain, cuire son pain… et payer le seigneur ?",
  init(a){
    A=a; const {el}=a;
    /* ===== 1. la seigneurie ===== */
    const s1=a.layer("seigneurie"); R.s1=s1;
    el("rect",{x:20,y:70,width:1040,height:520,rx:14,fill:"#E6F1FA"},s1); el("rect",{x:20,y:590,width:1040,height:270,fill:"#C9DFA8"},s1);
    el("path",{d:"M20,590 Q150,420 330,590Z",fill:"#A9C98A",stroke:"#5E7F3E","stroke-width":3},s1);
    R.chat=el("g",{transform:"translate(180,470)"},s1); el("rect",{x:-70,y:-90,width:140,height:100,fill:C.stone,stroke:C.stoneD,"stroke-width":3},R.chat); el("path",{d:"M-70,-90 l0,-18 l24,0 l0,18 M-12,-90 l0,-18 l24,0 l0,18 M46,-90 l0,-18 l24,0 l0,18",fill:C.stone,stroke:C.stoneD,"stroke-width":3},R.chat); el("path",{d:"M-18,10 L-18,-26 Q0,-48 18,-26 L18,10Z",fill:"#2B2B2B"},R.chat); el("line",{x1:0,y1:-108,x2:0,y2:-160,stroke:C.ink,"stroke-width":4},R.chat); el("path",{d:"M0,-160 L50,-146 L0,-130Z",fill:C.red,stroke:C.ink,"stroke-width":2},R.chat);
    R.sg=person(s1,C.roi,1.3,{crown:true});
    R.bulle=el("g",{},s1); a.label(R.bulle,520,200,"Mon moulin et mon four :\nvous devez les utiliser !",{size:26,stroke:C.roi,color:C.roi,fill:"#F5EFFA"}); el("path",{d:"M400,226 L330,330",stroke:C.roi,"stroke-width":4,fill:"none","stroke-dasharray":"2 8","stroke-linecap":"round"},R.bulle);
    el("rect",{x:20,y:730,width:1040,height:90,fill:"#8EBBE0"},s1); el("rect",{x:20,y:745,width:1040,height:60,fill:"#B9D7EE"},s1);
    R.village=el("g",{},s1); [[80,690],[160,720]].forEach(([x,y])=>{ el("rect",{x:x,y:y-50,width:70,height:50,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":3},R.village); el("path",{d:`M${x-8},${y-50} L${x+35},${y-86} L${x+78},${y-50}Z`,fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":3},R.village); });
    T(R.village,150,775,"village",{size:24,w:700,col:"#3F5A2A"});
    /* four */
    R.fourB=el("g",{transform:"translate(470,690)"},s1); el("path",{d:"M-90,0 L-90,-40 Q-90,-120 0,-120 Q90,-120 90,-40 L90,0Z",fill:"#C9B28A",stroke:C.stoneD,"stroke-width":4},R.fourB); el("path",{d:"M-28,0 L-28,-28 Q0,-60 28,-28 L28,0Z",fill:"#2B2B2B"},R.fourB); R.fFeu=el("path",{d:"M-14,0 Q-18,-14 0,-30 Q18,-14 14,0Z",fill:"#F2A22B"},R.fourB); el("rect",{x:40,y:-170,width:30,height:70,fill:C.stone,stroke:C.stoneD,"stroke-width":3},R.fourB);
    R.fumee=[0,1,2].map(()=>el("circle",{r:14,fill:"#D8DCE2",opacity:.8},R.fourB));
    R.fourL=el("g",{},s1); a.label(R.fourL,470,820,"le four du seigneur",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    /* moulin (extérieur) */
    R.moulinB=el("g",{transform:"translate(900,690)"},s1); el("rect",{x:-100,y:-150,width:200,height:150,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":4},R.moulinB); el("path",{d:"M-116,-150 L0,-230 L116,-150Z",fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":4},R.moulinB); el("rect",{x:-24,y:-60,width:48,height:60,fill:"#5A4A30"},R.moulinB); el("rect",{x:-60,y:-118,width:34,height:34,fill:"#fff",stroke:C.ink,"stroke-width":3},R.moulinB);
    R.roue1=el("g",{transform:"translate(-118,26)"},R.moulinB); el("circle",{r:56,fill:"none",stroke:C.woodD,"stroke-width":8},R.roue1); for(let i=0;i<8;i++) el("rect",{x:46,y:-9,width:26,height:18,fill:C.wood,stroke:C.woodD,"stroke-width":2.5,transform:`rotate(${i*45})`},R.roue1); el("circle",{r:9,fill:C.woodD},R.roue1);
    R.moulinL=el("g",{},s1); a.label(R.moulinL,900,455,"le moulin du seigneur",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.walk=[]; [[C.brown,"sack"],[C.brown,"sack"],[C.brown,"sack"],["#9A6A3A","basket"],["#9A6A3A","basket"]].forEach(([c,k],i)=>{ const p=person(s1,c,.95,{hat:true,[k]:true}); R.walk.push(p); });
    const P1=a.layer("p1"); R.p1=P1; panel(P1,1090,80,490,250,"Les banalités",C.or);
    TL(P1,1112,166,"Le seigneur possède le moulin\net le four. Il oblige les habitants\nà les utiliser, et à payer.\n« Banalité » vient de « ban » :\nle pouvoir du seigneur d'obliger.",{size:22});
    R.ph1=a.photo(P1,{id:"h-b5-moulin-eau",x:1112,y:395,w:430,h:300,cap:"Un moulin à eau",rot:1});
    /* ===== 2. mécanisme du moulin ===== */
    const s2=a.layer("meca"); R.s2=s2; el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#FBF6EE",stroke:"#E3D9C4","stroke-width":2},s2);
    el("rect",{x:432,y:250,width:600,height:600,fill:"#F4EBD8",stroke:"#C9B98F","stroke-width":3,"stroke-dasharray":"14 8"},s2); T(s2,900,282,"dans le moulin (coupe)",{size:24,w:700,col:"#7A6A50"});
    R.arbre=el("line",{x1:200,y1:GY,x2:GX1,y2:GY,stroke:C.woodD,"stroke-width":18,"stroke-linecap":"round"},s2);
    R.wheel=el("g",{},s2); el("circle",{r:128,fill:"none",stroke:C.woodD,"stroke-width":12},R.wheel); for(let i=0;i<5;i++) el("line",{x1:0,y1:0,x2:0,y2:-128,stroke:C.woodD,"stroke-width":9,transform:`rotate(${i*72})`},R.wheel); for(let i=0;i<10;i++) el("rect",{x:116,y:-15,width:46,height:30,fill:C.wood,stroke:C.woodD,"stroke-width":3,transform:`rotate(${i*36})`},R.wheel); el("circle",{r:20,fill:C.woodD},R.wheel); el("circle",{cx:100,cy:0,r:9,fill:C.red},R.wheel);
    R.water=el("g",{},s2); el("rect",{x:20,y:770,width:410,height:80,fill:"#8EBBE0",opacity:.82},R.water); R.wp=[...Array(10)].map((_,i)=>el("ellipse",{rx:22,ry:5,fill:"#fff",opacity:.8},R.water));
    R.wallB=el("rect",{x:430,y:560,width:24,height:290,fill:C.stone,stroke:C.stoneD,"stroke-width":3},s2); R.wallT=el("rect",{x:430,y:250,width:24,height:240,fill:C.stone,stroke:C.stoneD,"stroke-width":3},s2);
    R.arbre2=el("line",{x1:430,y1:GY,x2:GX1,y2:GY,stroke:C.woodD,"stroke-width":18,"stroke-linecap":"round"},s2);
    R.g1=el("g",{},s2); el("path",{d:gearPath(24,RP1,9),fill:"#C99B5C",stroke:C.woodD,"stroke-width":4,"stroke-linejoin":"round"},R.g1); el("circle",{r:60,fill:"none",stroke:C.woodD,"stroke-width":3,"stroke-dasharray":"4 8"},R.g1); el("circle",{r:16,fill:C.woodD},R.g1); el("circle",{cx:56,cy:0,r:9,fill:C.red},R.g1);
    R.g2=el("g",{},s2); el("path",{d:gearPath(8,RP2,8),fill:"#C99B5C",stroke:C.woodD,"stroke-width":4,"stroke-linejoin":"round"},R.g2); el("circle",{r:8,fill:C.woodD},R.g2); el("circle",{cx:18,cy:0,r:6,fill:C.red},R.g2);
    R.arbreV=el("line",{x1:GX2,y1:GY-30,x2:GX2,y2:430,stroke:C.woodD,"stroke-width":16,"stroke-linecap":"round"},s2);
    R.meuleB=el("rect",{x:GX2-124,y:476,width:248,height:34,rx:4,fill:"#B9B3A6",stroke:"#5C574B","stroke-width":4},s2);
    R.meuleH=el("g",{},s2); el("rect",{x:GX2-124,y:434,width:248,height:34,rx:4,fill:"#CFC9BB",stroke:"#5C574B","stroke-width":4},R.meuleH); R.ticks=[...Array(9)].map(()=>el("line",{y1:438,y2:464,stroke:"#5C574B","stroke-width":5,"stroke-linecap":"round"},R.meuleH));
    R.tremie=el("g",{},s2); el("path",{d:`M${GX2-84},300 L${GX2+84},300 L${GX2+16},398 L${GX2-16},398Z`,fill:"#D8B87A",stroke:C.woodD,"stroke-width":4},R.tremie); R.gr=el("path",{d:`M${GX2-70},320 L${GX2+70},320 L${GX2+14},394 L${GX2-14},394Z`,fill:C.grain},R.tremie); el("rect",{x:GX2-10,y:398,width:20,height:22,fill:C.woodD},R.tremie);
    R.fall=[0,1,2,3].map(()=>el("circle",{r:5,fill:C.grain,stroke:"#8A6A3A","stroke-width":1.5},s2));
    R.chute=el("path",{d:`M${GX2+124},500 L${GX2+210},566 L${GX2+260},566`,fill:"none",stroke:C.woodD,"stroke-width":10,"stroke-linecap":"round","stroke-linejoin":"round"},s2);
    R.flour=[0,1,2,3,4,5].map(()=>el("circle",{r:6,fill:"#fff",stroke:"#B7B0A0","stroke-width":2},s2));
    R.sac=el("g",{transform:"translate(990,700)"},s2); R.sacB=sack(R.sac,0,0,2.6,"#F3EFE6");
    R.sacL=T(s2,990,846,"",{size:1});
    R.nums=[["1  roue à aubes",130,440,C.bl],["2  engrenage",580,520,C.or],["3  meules",840,440,C.gris],["4  trémie",900,320,C.brown],["5  farine",985,800,C.gr]].map(([s,x,y,c])=>{ const g=el("g",{},s2); a.label(g,x,y,s,{size:24,stroke:c,color:c,sw:3}); return g; });
    R.schem=T(s2,740,846,"schéma simplifié",{size:22,w:600,col:C.gris});
    const P2=a.layer("p2"); R.p2=P2; panel(P2,1090,80,490,770,"Du grain à la farine",C.or);
    R.p2i=[["1","L'eau pousse les aubes :\nla roue tourne."],["2","L'engrenage transmet le\nmouvement : la petite roue\ntourne plus vite que\nla grande."],["3","La meule du dessus tourne\nsur celle du dessous et\nécrase le grain."],["4","Le grain tombe de la trémie\npeu à peu entre les meules."],["5","La farine sort sur le côté\net tombe dans un sac."]].map(([n,t],i)=>{ const g=el("g",{},P2); const y=150+i*140; el("circle",{cx:1128,cy:y+10,r:21,fill:[C.bl,C.or,C.gris,C.brown,C.gr][i]},g); T(g,1128,y+19,n,{size:25,w:800,col:"#fff"}); TL(g,1166,y+8,t,{size:23}); return g; });
    /* ===== 3. le four banal ===== */
    const s3=a.layer("four"); R.s3=s3;
    el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#F3EAD6"},s3); el("rect",{x:20,y:700,width:1040,height:160,fill:"#D9CDB4"},s3);
    R.oven=el("g",{transform:"translate(600,700)"},s3); el("path",{d:"M-190,0 L-190,-60 Q-190,-250 0,-250 Q190,-250 190,-60 L190,0Z",fill:"#C9B28A",stroke:C.stoneD,"stroke-width":5},R.oven); for(let i=0;i<6;i++) el("path",{d:`M${-160+i*60},-20 Q${-150+i*60},-120 ${-120+i*60},-200`,fill:"none",stroke:"#B09A70","stroke-width":3},R.oven);
    el("path",{d:"M-70,0 L-70,-70 Q0,-140 70,-70 L70,0Z",fill:"#2B2B2B"},R.oven); R.feu=el("path",{d:"M-44,0 Q-52,-34 0,-76 Q52,-34 44,0Z",fill:"#F2A22B"},R.oven); R.feu2=el("path",{d:"M-24,0 Q-28,-18 0,-44 Q28,-18 24,0Z",fill:"#F2D22B"},R.oven);
    el("rect",{x:90,y:-330,width:44,height:110,fill:C.stone,stroke:C.stoneD,"stroke-width":4},R.oven); R.fum3=[0,1,2,3].map(()=>el("circle",{r:16,fill:"#D8DCE2",opacity:.8},R.oven));
    R.fournier=person(s3,"#F4EEDD",2,{cap:"#fff"});
    R.queue=[0,1,2].map(i=>person(s3,C.brown,1.7,{hat:true,basket:true}));
    R.dough=[...Array(20)].map(()=>{ const g=el("g",{},s3); el("ellipse",{rx:15,ry:11,fill:"#F6E7C6",stroke:"#8A6A3A","stroke-width":2.5},g); return g; });
    R.tab=el("g",{},s3); el("rect",{x:750,y:640,width:230,height:20,fill:C.wood,stroke:C.woodD,"stroke-width":3},R.tab); el("rect",{x:766,y:660,width:16,height:60,fill:C.woodD},R.tab); el("rect",{x:946,y:660,width:16,height:60,fill:C.woodD},R.tab);
    R.panS=el("g",{transform:"translate(930,215)"},s3); el("path",{d:"M-70,0 L70,0 L56,60 L-56,60Z",fill:"#C89B5A",stroke:C.ink,"stroke-width":3},R.panS); a.label(R.panS,0,-34,"part du seigneur",{size:22,stroke:C.roi,color:C.roi,fill:"#F5EFFA"});
    R.sgn=person(s3,C.roi,1.7,{crown:true});
    R.loaf=[...Array(20)].map((_,i)=>{ const g=el("g",{},s3); el("ellipse",{rx:16,ry:9.5,fill:"#D9A04A",stroke:"#7A4A12","stroke-width":2.5},g); el("path",{d:"M-7,-4 l4,7 M0,-6 l4,8 M7,-4 l4,7",stroke:"#7A4A12","stroke-width":2.5,fill:"none"},g); return g; });
    R.f3L=el("g",{},s3); a.label(R.f3L,860,560,"1 pain sur 20 (exemple)",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.f3F=el("g",{},s3); a.label(R.f3F,330,300,"Les habitants apportent\nleur pâte au four du seigneur",{size:24,stroke:C.gris,color:C.ink});
    const P3=a.layer("p3"); R.p3=P3; panel(P3,1090,80,490,300,"Le four banal",C.or);
    TL(P3,1112,166,"• Le seigneur a fait construire\n  un grand four.\n• Les habitants doivent y cuire\n  leur pain, et pas ailleurs.\n• Le fournier garde une petite\n  part du pain pour le seigneur.",{size:22});
    R.ph2=a.photo(P3,{id:"h-b5-four-pain",x:1112,y:420,w:430,h:300,cap:"Un four à pain ancien",rot:-1});
    /* ===== 4. manipulation : quantité de grain ===== */
    const s4=a.layer("quantite"); R.s4=s4;
    el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#FBF6EE",stroke:"#E3D9C4","stroke-width":2},s4);
    T(s4,540,118,"Le grain apporté au moulin du seigneur",{size:32,w:800,col:"#A8431F"}); T(s4,540,152,"(exemple : chaque rangée = 16 sacs)",{size:24,w:600,col:C.gris});
    R.sacks=[...Array(160)].map((_,i)=>{ const row=Math.floor(i/16), col=i%16; const g=el("g",{transform:`translate(${86+col*58},${208+row*62})`},s4); const sk=sack(g,0,0,1.25); g.sk=sk; g.pth=sk.firstChild; g._r=row; g._c=col; return g; });
    R.leg4=el("g",{},s4); el("rect",{x:60,y:800,width:30,height:28,rx:6,fill:C.grain,stroke:"#8A6A3A","stroke-width":3},R.leg4); T(R.leg4,102,822,"pour la famille",{size:24,w:700,anchor:"start"}); el("rect",{x:330,y:800,width:30,height:28,rx:6,fill:C.or,stroke:"#8A4A0E","stroke-width":3},R.leg4); T(R.leg4,372,822,"part du seigneur (exemple : 1 sac sur 16)",{size:24,w:700,anchor:"start"});
    const P4=a.layer("p4"); R.p4=P4; panel(P4,1090,80,490,770,"Le calcul",C.or);
    T(P4,1335,170,"Grain apporté",{size:28,w:700,col:C.gris}); R.cN=T(P4,1335,226,"",{size:56,w:800,col:C.ink});
    el("line",{x1:1130,y1:260,x2:1540,y2:260,stroke:"#D6DBE4","stroke-width":3},P4);
    T(P4,1335,320,"Part du seigneur",{size:28,w:700,col:"#8A4A0E"}); R.cS=T(P4,1335,376,"",{size:56,w:800,col:C.or}); R.cSd=T(P4,1335,418,"",{size:24,w:600,col:C.gris});
    el("line",{x1:1130,y1:450,x2:1540,y2:450,stroke:"#D6DBE4","stroke-width":3},P4);
    T(P4,1335,510,"Reste pour la famille",{size:28,w:700,col:"#6B5520"}); R.cF=T(P4,1335,566,"",{size:56,w:800,col:"#8A6A00"});
    R.cNote=el("g",{},P4); a.label(R.cNote,1335,730,"Exemple : la part variait\nselon les lieux et les époques.",{size:24,stroke:C.gris,color:C.ink,fill:"#F3F4F7",w:440});
    a.manip.innerHTML=`Grain à moudre : <input type="range" id="mG" min="16" max="160" step="16" value="${nSacs}"> <span id="mGv">${nSacs} sacs</span>`;
    document.getElementById("mG").oninput=e=>{ nSacs=+e.target.value; document.getElementById("mGv").textContent=nSacs+" sacs"; a.redraw(); };
    /* ===== 5. une obligation ===== */
    const s5=a.layer("obligation"); R.s5=s5;
    el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#EEF4E3"},s5); el("rect",{x:20,y:690,width:1040,height:170,fill:"#C9DFA8"},s5);
    R.maison=el("g",{transform:"translate(150,690)"},s5); el("rect",{x:-110,y:-130,width:220,height:130,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":4},R.maison); el("path",{d:"M-126,-130 L0,-220 L126,-130Z",fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":4},R.maison); el("rect",{x:-24,y:-70,width:48,height:70,fill:"#5A4A30"},R.maison);
    R.pAs=person(s5,C.brown,1.5,{hat:true});
    R.queen=el("g",{},s5); el("ellipse",{cx:0,cy:0,rx:50,ry:16,fill:"#9C968A",stroke:"#5C574B","stroke-width":4},R.queen); el("rect",{x:-50,y:-18,width:100,height:18,fill:"#B9B3A6",stroke:"#5C574B","stroke-width":4},R.queen); el("line",{x1:30,y1:-18,x2:30,y2:-54,stroke:C.woodD,"stroke-width":8,"stroke-linecap":"round"},R.queen); el("line",{x1:30,y1:-54,x2:56,y2:-54,stroke:C.woodD,"stroke-width":8,"stroke-linecap":"round"},R.queen); a.tr(R.queen,150,760,1.25);
    R.ban=el("g",{},s5); el("circle",{cx:150,cy:735,r:62,fill:"none",stroke:C.red,"stroke-width":11},R.ban); el("line",{x1:106,y1:779,x2:194,y2:691,stroke:C.red,"stroke-width":11},R.ban);
    R.banL=el("g",{},s5); a.label(R.banL,170,400,"Moudre chez soi :\nsouvent interdit",{size:26,stroke:C.red,color:C.red,fill:"#FDECEA"});
    R.mou=el("g",{transform:"translate(860,690)"},s5); el("rect",{x:-100,y:-150,width:200,height:150,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":4},R.mou); el("path",{d:"M-116,-150 L0,-230 L116,-150Z",fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":4},R.mou); el("rect",{x:-24,y:-60,width:48,height:60,fill:"#5A4A30"},R.mou); el("line",{x1:0,y1:-230,x2:0,y2:-290,stroke:C.ink,"stroke-width":4},R.mou); el("path",{d:"M0,-290 L50,-276 L0,-260Z",fill:C.red,stroke:C.ink,"stroke-width":2},R.mou);
    R.sgn5=person(s5,C.roi,1.2,{crown:true});
    R.arr5=a.arrow(s5,"M380,640 C500,560 620,560 740,640",{color:C.or,w:8,dash:"16 10"}); R.sack5=sack(s5,0,0,1.3);
    R.arr5b=a.arrow(s5,"M740,610 C640,520 480,520 350,600",{color:C.gr,w:8,dash:"16 10"}); R.sack5b=sack(s5,0,0,1.1,"#F3EFE6");
    R.l5a=el("g",{},s5); a.label(R.l5a,540,470,"on apporte le grain",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    R.l5b=el("g",{},s5); a.label(R.l5b,620,318,"on rapporte la farine, moins la part du seigneur",{size:24,stroke:C.gr,color:C.gr,fill:"#E8F6EE"});
    const P5=a.layer("p5"); R.p5=P5; panel(P5,1090,80,490,770,"Une charge lourde",C.red);
    R.p5i=[["Le seigneur fixe la règle\net le prix.",C.roi],["Moudre ou cuire chez soi\nétait souvent interdit.",C.red],["Pour le seigneur : un revenu\nrégulier, payé en nature.",C.or],["Pour les paysans : une charge\nqu'ils supportent mal.",C.brown],["Les banalités durent jusqu'à la\nRévolution française (1789).",C.gris]].map(([t,c],i)=>{ const g=el("g",{},P5); const y=150+i*130; el("rect",{x:1112,y:y-6,width:12,height:92,rx:6,fill:c},g); TL(g,1146,y+22,t,{size:24}); return g; });
    /* ===== synthèse ===== */
    const sy=a.layer("synthese"); R.sy=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); T(sy,800,80,"Les banalités : l'essentiel",{size:36,w:800});
    const i1=g=>{ el("rect",{x:-40,y:-10,width:80,height:40,fill:"#EADBC0",stroke:"#7A6A4E","stroke-width":3.5},g); el("path",{d:"M-48,-10 L0,-44 L48,-10Z",fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":3.5},g); el("circle",{cx:-52,cy:18,r:20,fill:"none",stroke:C.woodD,"stroke-width":6},g); };
    const i2=g=>{ sack(g,-30,10,1.2); sack(g,30,10,.8,"#F3EFE6"); el("path",{d:"M-6,-14 L14,-14 M8,-22 L16,-14 L8,-6",fill:"none",stroke:C.or,"stroke-width":5,"stroke-linecap":"round","stroke-linejoin":"round"},g); };
    const i3=g=>{ el("path",{d:"M-30,30 L-30,-10 L30,-10 L30,30Z",fill:"#F1C9A5",stroke:C.ink,"stroke-width":3},g); el("path",{d:"M-34,-10 Q0,-48 34,-10Z",fill:C.red,stroke:C.ink,"stroke-width":3},g); };
    R.sy3=[[i1,"Le seigneur impose","son moulin et son four :\nles habitants doivent s'en servir."],[i2,"Une part en nature","une part du grain ou du pain\nreste au seigneur (exemple : 1 sur 16)."],[i3,"Une charge mal supportée","les paysans l'acceptent mal ;\nelle dure jusqu'à la Révolution."]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:320,rx:18,fill:"#FBF6EE",stroke:"#A8431F","stroke-width":3},g); const ig=el("g",{transform:`translate(${x},205)`},g); f[0](ig); T(g,x,305,f[1],{size:28,w:800,col:"#A8431F"}); TL(g,x,345,f[2],{size:23,w:500,anchor:"middle"}); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,120,500,1360,"Au Moyen Âge, chaque famille moulait son grain gratuitement, chez elle.","Souvent, les paysans devaient aller au moulin du seigneur et lui laisser une part du grain ou de la farine. Moudre chez soi était souvent interdit : c'est la banalité.");
  },
  reset(a){ [R.s1,R.s2,R.s3,R.s4,R.s5,R.sy,R.myth,R.p1,R.p2,R.p3,R.p4,R.p5,R.ph1,R.ph2,R.bulle,R.fourL,R.moulinL,...R.walk,R.sgn,R.sgn5].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Le moulin et le four du seigneur", duree:10000,
    legende:"Dans la seigneurie, le seigneur possède le moulin et le four. Il oblige les habitants à les utiliser, et à payer : ce sont les banalités.",
    voix:"Dans la seigneurie, le seigneur possède le moulin à eau et le four. Il oblige tous les habitants à les utiliser, et à payer pour cela. Ce sont les banalités. Ce mot vient du ban, le pouvoir qu'a le seigneur de commander et d'obliger.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); a.op(R.fourB,s(t,.1,.25)); a.op(R.moulinB,s(t,.15,.3)); a.op(R.fourL,s(t,.28,.38)); a.op(R.moulinL,s(t,.3,.4)); a.tr(R.sg,330,540,1); a.op(R.sg,s(t,.4,.5)); a.op(R.bulle,s(t,.45,.58)); a.op(R.p1,s(t,.55,.68)); a.op(R.ph1,s(t,.62,.78));
      R.fumee.forEach((c,i)=>{ const u=(t*3+i/3)%1; a.set(c,{cx:55+Math.sin(u*6+i)*8,cy:-175-u*70,r:10+u*14,opacity:.8*(1-u)}); }); R.roue1.setAttribute("transform",`translate(-118,26) rotate(${-t*360})`);
      R.walk.forEach((p,i)=>{ const to=i<3?[740,700]:[470,700]; const st=i<3?[220+i*30,715]:[240+(i-3)*30,715]; const u=a.seg(t,.55+ (i%3)*.04,.98,true); const x=a.lerp(st[0],to[0]-(i<3?i*28:(i-3)*26)-40,u), y=a.lerp(st[1],to[1],u)-Math.abs(Math.sin(u*30+i))*4; a.op(p,a.seg(t,.52,.58)); a.tr(p,x,y+ (i<3?30:30),1); }); } },
  { titre:"Le moulin à eau : comment ça marche ?", duree:14000,
    legende:"L'eau fait tourner la roue ; l'engrenage fait tourner la meule du dessus ; elle écrase le grain venu de la trémie ; la farine tombe dans un sac.",
    voix:"Voyons comment marche un moulin à eau. L'eau de la rivière pousse les aubes de la roue, qui tourne. Un engrenage transmet le mouvement jusqu'à la meule : la petite roue tourne plus vite que la grande. La meule du dessus tourne sur celle du dessous. Le grain tombe de la trémie entre les deux meules, il est écrasé, et la farine sort sur le côté, dans un sac.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.06)); a.op(R.s2,s(t,0,.06)); a.op(R.p1,1-s(t,0,.06)); a.op(R.ph1,1-s(t,0,.06));
      const ang=a.seg(t,.12,1,true)*720; const th=-ang; a.set(R.wheel,{transform:`translate(200,${GY}) rotate(${th})`}); a.set(R.g1,{transform:`translate(${GX1},${GY}) rotate(${th})`}); a.set(R.g2,{transform:`translate(${GX2},${GY}) rotate(${22.5-3*th})`});
      const w=a.seg(t,.02,.14); a.op(R.wheel,w); a.op(R.water,w); R.wp.forEach((e,i)=>{ const u=((i/10)+t*3)%1; a.set(e,{cx:30+u*390,cy:790+(i%3)*18}); }); a.op(R.arbre,a.seg(t,.12,.2)); a.op(R.arbre2,a.seg(t,.18,.26)); a.op(R.wallB,a.seg(t,.16,.24)); a.op(R.wallT,a.seg(t,.16,.24));
      a.op(R.g1,a.seg(t,.22,.32)); a.op(R.g2,a.seg(t,.26,.36)); a.op(R.arbreV,a.seg(t,.3,.38)); a.op(R.meuleB,a.seg(t,.34,.42)); a.op(R.meuleH,a.seg(t,.36,.44)); a.op(R.tremie,a.seg(t,.4,.48)); a.op(R.chute,a.seg(t,.44,.5)); a.op(R.sac,a.seg(t,.46,.52)); a.op(R.sacL,a.seg(t,.48,.54)); a.op(R.schem,a.seg(t,.1,.2));
      const mphi=th*-3*Math.PI/180+0; R.ticks.forEach((tk,i)=>{ const phi=(-3*th*Math.PI/180)+i*2*Math.PI/9; const x=GX2+112*Math.sin(phi); a.set(tk,{x1:x,x2:x}); a.op(tk,Math.cos(phi)>0?1:0); });
      const run=a.seg(t,.5,.56); R.fall.forEach((c,i)=>{ const u=((t*6)+i/4)%1; a.op(c,run); a.set(c,{cx:GX2+(i%2?3:-3),cy:422+u*14}); });
      R.flour.forEach((c,i)=>{ const u=((t*4)+i/6)%1; let x,y; if(u<.45){ const k=u/.45; x=GX2+124+k*(86); y=500+k*66; } else { const k=(u-.45)/.55; x=GX2+210+k*(990-GX2-210+0); y=566+ (k<.7?0:(k-.7)/.3*80); if(k<.7){ x=GX2+210+(k/.7)*50; } else { x=GX2+260+((k-.7)/.3)*(990-GX2-260); } } a.op(c,run); a.set(c,{cx:x,cy:y}); });
      const fill=a.seg(t,.52,1,true); R.sacB.setAttribute("transform",`scale(${2.2+fill*.6})`);
      R.nums.forEach((g,i)=>a.op(g,a.seg(t,[.1,.26,.36,.44,.5][i],[.16,.32,.42,.5,.56][i]))); a.op(R.p2,a.seg(t,.08,.18)); R.p2i.forEach((g,i)=>a.op(g,a.seg(t,[.12,.28,.38,.46,.52][i],[.2,.36,.46,.54,.6][i]))); } },
  { titre:"Le four banal", duree:11000,
    legende:"Au four du seigneur, les habitants font cuire leur pain. Le fournier garde une petite part des pains pour le seigneur (ici : 1 pain sur 20, à titre d'exemple).",
    voix:"Même chose pour le four. Les habitants apportent leur pâte au four du seigneur, et pas ailleurs. Le fournier fait cuire le pain, mais il en garde une petite part pour le seigneur. Ici, par exemple, un pain sur vingt.",
    anim(t,a){ const s=a.seg; a.op(R.s2,1-s(t,0,.06)); a.op(R.p2,1-s(t,0,.06)); a.op(R.s3,s(t,0,.08)); a.op(R.p3,s(t,.05,.15)); a.op(R.ph2,s(t,.1,.22)); a.op(R.f3F,s(t,.1,.2)*(1-s(t,.35,.4)));
      const fl=.85+.15*Math.sin(t*90); R.feu.setAttribute("transform",`scale(${fl},${fl})`); R.feu2.setAttribute("transform",`scale(${1.1-fl*.1},${fl})`);
      R.fum3.forEach((c,i)=>{ const u=(t*3+i/4)%1; a.set(c,{cx:112+Math.sin(u*7+i)*8,cy:-330-u*80,r:12+u*16,opacity:.8*(1-u)}); });
      a.tr(R.fournier,430,760,1); const grp=[7,7,6]; let idx=0;
      R.queue.forEach((p,j)=>{ const t0=.15+j*.22, t1=t0+.12; const v=a.seg(t,t0,t1,true); const x=a.lerp(130+j*0,330,v)+(j*0); const done=a.seg(t,t1,t1+.04); const xx=a.lerp(150,360,v); a.op(p,a.seg(t,t0-.05,t0)*(1-a.seg(t,t1+.04,t1+.1))); a.tr(p,xx,745-(j%2)*0,1); });
      R.dough.forEach((g,i)=>{ const j=i<7?0:(i<14?1:2); const k=(j===0?i:(j===1?i-7:i-14)); const t0=.2+j*.22+k*.012; const v=a.seg(t,t0,t0+.06); const bake=a.seg(t,t0+.07,t0+.12); a.op(g,v*(1-bake)); a.tr(g,a.lerp(380,590,v),a.lerp(700,640,v)-Math.sin(v*Math.PI)*30,1); });
      R.loaf.forEach((g,i)=>{ const j=i<7?0:(i<14?1:2); const k=(j===0?i:(j===1?i-7:i-14)); const t0=.28+j*.22+k*.012; const v=a.seg(t,t0,t0+.06); const sx=a.lerp(620,772+(i%10)*20,v), sy=a.lerp(640,626-Math.floor(i/10)*17,v)-Math.sin(v*Math.PI)*40; const toS=(i===19)?a.seg(t,.82,.94):0; a.op(g,v); a.tr(g,a.lerp(sx,930,toS),a.lerp(sy,255,toS)-Math.sin(toS*Math.PI)*30,1.4); });
      a.op(R.panS,a.seg(t,.78,.86)); a.tr(R.sgn,1020,745,1); a.op(R.sgn,a.seg(t,.72,.8)); a.op(R.f3L,a.seg(t,.86,.96)); R.tab.setAttribute("opacity",1); a.op(R.tab,1); } },
  { titre:"À vous : quelle part pour le seigneur ?", duree:7000,
    legende:"À vous : déplacez le curseur pour changer la quantité de grain à moudre, et regardez la part prise par le seigneur. (Exemple : 1 sac sur 16.)",
    voix:"À vous de jouer ! Déplacez le curseur pour changer la quantité de grain à moudre. Regardez la part que prend le seigneur : ici, par exemple, un sac sur seize. Plus on apporte de grain, plus la part du seigneur est grosse. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.s3,1-s(t,0,.06)); a.op(R.p3,1-s(t,0,.06)); a.op(R.ph2,1-s(t,0,.06)); a.op(R.s4,s(t,0,.1)); a.op(R.p4,s(t,.05,.15));
      R.sacks.forEach((g,i)=>{ const on=i<nSacs; const seig=g._c===PART-1; a.op(g,on?s(t,.08+g._r*.03,.16+g._r*.03):0); g.pth.setAttribute("fill",seig?C.or:C.grain); g.pth.setAttribute("stroke",seig?"#8A4A0E":"#8A6A3A"); g.pth.setAttribute("stroke-width",seig?5:3); });
      const k=nSacs/PART; a.num(R.cN,nSacs,0," sacs"); a.num(R.cS,k,0,k>1?" sacs":" sac"); a.num(R.cF,nSacs-k,0," sacs"); R.cSd.textContent=nSacs+" ÷ 16 = "+k; } },
  { titre:"Pourquoi les paysans n'aimaient pas ça", duree:10000,
    legende:"Le seigneur fixe la règle et le prix. Moudre chez soi était souvent interdit : on devait apporter son grain au moulin du seigneur. Les paysans supportaient mal cette charge.",
    voix:"Pourquoi les paysans n'aimaient pas cela ? Le seigneur fixe la règle et le prix. Moudre son grain chez soi, avec un petit moulin à bras, était souvent interdit : il fallait apporter son grain au moulin du seigneur. Pour le seigneur, c'était un revenu régulier. Pour les paysans, une charge qu'ils supportaient mal. Les banalités ont duré jusqu'à la Révolution française.",
    anim(t,a){ const s=a.seg; a.op(R.s4,1-s(t,0,.06)); a.op(R.p4,1-s(t,0,.06)); a.op(R.s5,s(t,0,.1)); a.op(R.p5,s(t,.05,.15));
      a.tr(R.pAs,330,700,1); a.op(R.ban,s(t,.12,.22)); a.op(R.banL,s(t,.12,.22)); a.tr(R.sgn5,960,690,1); a.op(R.sgn5,s(t,.25,.32));
      const u1=s(t,.35,.55,true); const p1=a.along(R.arr5.path,u1); a.op(R.arr5,s(t,.33,.38)); a.draw(R.arr5.path,s(t,.33,.5)); a.op(R.sack5,s(t,.34,.4)*(1-s(t,.56,.6))); a.tr(R.sack5,p1.x,p1.y,1); a.op(R.l5a,s(t,.4,.5));
      const u2=s(t,.62,.85,true); const p2=a.along(R.arr5b.path,u2); a.op(R.arr5b,s(t,.6,.65)); a.draw(R.arr5b.path,s(t,.6,.78)); a.op(R.sack5b,s(t,.62,.68)); a.tr(R.sack5b,p2.x,p2.y,1); a.op(R.l5b,s(t,.7,.8));
      R.p5i.forEach((g,i)=>a.op(g,s(t,.15+i*.15,.25+i*.15))); } },
  { titre:"Synthèse", duree:11000,
    legende:"Le seigneur impose son moulin et son four ; les habitants lui laissent une part en nature ; ils supportent mal cette charge. Non, on ne moulait pas gratuitement chez soi !",
    voix:"Retenons trois idées. Un : le seigneur impose son moulin et son four, et les habitants doivent s'en servir. Deux : ils lui laissent une part du grain ou du pain, par exemple un sac sur seize. Trois : cette charge est mal supportée, et elle dure jusqu'à la Révolution. Et non, on ne moulait pas gratuitement chez soi !",
    anim(t,a){ const s=a.seg; a.op(R.s5,1-s(t,0,.08)); a.op(R.p5,1-s(t,0,.08)); a.op(R.sy,s(t,0,.1)); R.sy3.forEach((f,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(f,v); a.tr(f,0,(1-v)*40,1); }); a.op(R.myth,s(t,.62,.78)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
