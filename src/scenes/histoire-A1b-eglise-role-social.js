/* META {"id":"histoire-A1b-eglise-role-social","matiere":"histoire","annee":"A","periode":1,"theme":"Les églises, lieux de pouvoir et de vie sociale au Moyen Âge","resume":"La dîme et les dons font de l'Église la grande aidante du Moyen Âge : hôtels-Dieu, monastères, écoles.","motsCles":["Église","dîme","hôtel-Dieu","monastère","moines copistes","Beaune"]} */
(function(){
let R={}, recolte=10; // récolte du paysan (manipulation)
const C={sky:"#EAF3FB",grass:"#CFE3B4",field:"#E9C46A",stone:"#E7DCC8",stoneD:"#9C8B6E",roof:"#9E3B22",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",ink:"#1E2430"};
function person(a,p,x,y,col,s,extra){ const g=a.el("g",{},p); a.el("circle",{cx:0,cy:-62,r:13,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2},g); a.el("path",{d:"M-16,-46 L16,-46 L22,0 L-22,0 Z",fill:col,stroke:C.ink,"stroke-width":2},g); if(extra==="baton"){a.el("line",{x1:24,y1:-50,x2:30,y2:4,stroke:"#6B4A2B","stroke-width":4},g);} if(extra==="moine"){a.el("path",{d:"M-14,-70 Q0,-84 14,-70 L14,-60 L-14,-60Z",fill:col,stroke:C.ink,"stroke-width":2},g);} a.tr(g,x,y,s||1); g._x=x; g._y=y; g._s=s||1; return g; }
const GX=i=>80+(i%5)*80, GY=i=>660+Math.floor(i/5)*58, TG={9:[935,578],19:[975,578]};
const pl=(n,m)=>n+" "+m+(n>1?"s":"");
function gerbe(a,p){ const g=a.el("g",{},p); for(let i=-3;i<=3;i++) a.el("line",{x1:0,y1:0,x2:i*4,y2:-46,stroke:"#B8860B","stroke-width":3},g); a.el("ellipse",{cx:0,cy:-44,rx:14,ry:9,fill:C.field,stroke:"#9A6B00","stroke-width":2},g); a.el("rect",{x:-9,y:-26,width:18,height:6,fill:"#7A4E12"},g); return g; }

Anim.run({
  titre:"Le rôle social de l'Église au Moyen Âge",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Au Moyen Âge, qui soigne les malades, nourrit les pauvres et fait l'école ?",
  manipDes:2, manipJusqua:2,
  init(a){
    const {el}=a; const bg=a.layer("decor");
    el("rect",{x:0,y:0,width:1600,height:560,fill:C.sky,rx:14},bg); el("path",{d:"M0,560 Q400,520 800,560 T1600,550 L1600,900 L0,900Z",fill:C.grass},bg);
    // champ
    R.champ=el("g",{},bg); el("path",{d:"M40,600 L470,590 L500,860 L20,870Z",fill:"#E2C77A",stroke:"#B39248","stroke-width":3},R.champ);
    for(let i=0;i<8;i++) el("line",{x1:40+i*58,y1:598,x2:30+i*62,y2:866,stroke:"#C9A856","stroke-width":2},R.champ);
    el("text",{x:255,y:892,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#6B5520",text:"Champ du paysan"},bg);
    // église
    const eg=el("g",{},bg); R.eglise=eg;
    el("rect",{x:600,y:380,width:240,height:200,fill:C.stone,stroke:C.stoneD,"stroke-width":3},eg);
    el("path",{d:"M585,385 L720,300 L855,385Z",fill:C.roof,stroke:"#6E2914","stroke-width":3},eg);
    el("rect",{x:790,y:250,width:80,height:330,fill:C.stone,stroke:C.stoneD,"stroke-width":3},eg);
    el("path",{d:"M780,255 L830,170 L880,255Z",fill:C.roof,stroke:"#6E2914","stroke-width":3},eg);
    el("path",{d:"M830,170 L830,130 M816,145 L844,145",stroke:C.ink,"stroke-width":5},eg);
    el("path",{d:"M690,580 L690,500 Q720,470 750,500 L750,580Z",fill:"#6B4A2B"},eg);
    el("path",{d:"M815,300 Q830,285 845,300 L845,330 L815,330Z",fill:"#45607A"},eg);
    R.cloche=el("path",{d:"M822,316 Q830,302 838,316 L841,328 L819,328Z",fill:"#C8A13A"},eg);
    el("text",{x:720,y:620,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"L'église"},bg);
    // grange de la dîme
    R.grange=el("g",{},bg); el("rect",{x:880,y:470,width:130,height:110,fill:"#C79A62",stroke:"#7A5530","stroke-width":3},R.grange); el("path",{d:"M868,475 L945,420 L1022,475Z",fill:"#8A5A2B",stroke:"#5A3A1A","stroke-width":3},R.grange); el("rect",{x:925,y:520,width:40,height:60,fill:"#5A3A1A"},R.grange);
    R.grangeT=el("text",{x:945,y:620,"text-anchor":"middle","font-size":22,"font-weight":700,fill:"#5A3A1A",text:"grange de la dîme"},R.grange);
    // maisons
    [[120,520],[300,515],[440,525]].forEach(([x,y])=>{ el("rect",{x:x-40,y,width:80,height:60,fill:"#EADBC0",stroke:"#9C8B6E","stroke-width":2},bg); el("path",{d:`M${x-50},${y+4} L${x},${y-36} L${x+50},${y+4}Z`,fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":2},bg); });
    // gerbes + paysan
    R.gerbes=[]; for(let i=0;i<20;i++){ const g=gerbe(a,bg); R.gerbes.push(g); }
    R.paysan=person(a,bg,470,800,"#8C6D46",1.3);
    R.compteur=el("g",{},bg); el("rect",{x:40,y:24,width:560,height:212,rx:14,fill:"#fff",stroke:C.or,"stroke-width":3},R.compteur);
    R.cT=el("text",{x:64,y:64,"font-size":24,"font-weight":700,fill:"#4A5468"},R.compteur);
    R.cR=el("text",{x:64,y:118,"font-size":32,"font-weight":700,fill:C.ink},R.compteur); R.cD=el("text",{x:64,y:182,"font-size":32,"font-weight":800,fill:C.or},R.compteur);
    R.bars=el("g",{},R.compteur); el("rect",{x:64,y:128,width:480,height:14,rx:7,fill:"#EEF0F4"},R.bars); el("rect",{x:64,y:194,width:480,height:14,rx:7,fill:"#EEF0F4"},R.bars);
    R.barR=el("rect",{x:64,y:128,width:0,height:14,rx:7,fill:C.ink},R.bars); R.barD=el("rect",{x:64,y:194,width:0,height:14,rx:7,fill:C.or},R.bars);
    // dîme en grange (étape de manipulation) : 1 gerbe pour 10 récoltées
    R.miniG=el("g",{},bg); R.mini=[...Array(10)].map((_,i)=>{ const g=gerbe(a,R.miniG); a.tr(g,900+i*30,404,.65); return g; });
    el("text",{x:900,y:350,"font-size":22,"font-weight":700,fill:C.or,text:"Dîme versée à l'Église :"},R.miniG);
    R.seign=el("g",{},bg); el("rect",{x:1030,y:24,width:520,height:112,rx:14,fill:"#fff",stroke:C.bl,"stroke-width":3},R.seign); el("text",{x:1056,y:70,"font-size":28,"font-weight":700,fill:C.bl,text:"+ des dons de terres"},R.seign); el("text",{x:1056,y:112,"font-size":28,"font-weight":700,fill:C.bl,text:"par les seigneurs"},R.seign);
    // hôtel-Dieu (toit vernissé type Beaune)
    const hd=el("g",{},bg); R.hd=hd;
    const defs=el("defs",{},a.svg); const pt=el("pattern",{id:"tuiles",width:36,height:24,patternUnits:"userSpaceOnUse"},defs);
    [["#C0392B",0,0],["#E0B12A",18,0],["#2E6B3E",9,12],["#1E2430",27,12]].forEach(([c,x,y])=>el("path",{d:`M${x},${y+12} L${x+9},${y} L${x+18},${y+12} L${x+9},${y+24}Z`,fill:c},pt));
    el("rect",{x:1070,y:430,width:300,height:150,fill:C.stone,stroke:C.stoneD,"stroke-width":3},hd);
    el("path",{d:"M1055,435 L1220,300 L1385,435Z",fill:"url(#tuiles)",stroke:"#5A3A1A","stroke-width":3},hd);
    for(let i=0;i<4;i++) el("rect",{x:1095+i*72,y:470,width:36,height:50,rx:16,fill:"#45607A"},hd);
    el("path",{d:"M1200,580 L1200,530 Q1220,510 1240,530 L1240,580Z",fill:"#6B4A2B"},hd);
    el("text",{x:1220,y:620,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Hôtel-Dieu"},hd);
    R.hdSub=el("text",{x:1220,y:650,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"ex. : Hospices de Beaune (1443)"},hd);
    R.visiteurs=[person(a,bg,1600,800,"#7A8AA0",1.1,"baton"),person(a,bg,1600,800,"#9AA36B",1.1),person(a,bg,1600,800,"#A07A9A",1.1)];
    R.vLab=["un pèlerin","un pauvre","un malade"].map(t=>el("text",{"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,text:t},bg));
    R.soeur=person(a,bg,1300,760,"#F4F4F4",1.2,"moine");
    R.pain=el("g",{},bg); el("ellipse",{cx:0,cy:0,rx:22,ry:13,fill:"#D9A55B",stroke:"#8A5A2B","stroke-width":2},R.pain);
    // monastère / école
    const mo=el("g",{},bg); R.mo=mo;
    el("rect",{x:1050,y:160,width:520,height:400,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},mo);
    el("text",{x:1310,y:202,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Au monastère : copier et enseigner"},mo);
    el("rect",{x:1090,y:300,width:220,height:24,fill:"#8A5A2B"},mo); el("rect",{x:1110,y:324,width:12,height:110,fill:"#8A5A2B"},mo); el("rect",{x:1280,y:324,width:12,height:110,fill:"#8A5A2B"},mo);
    R.moine=person(a,mo,1150,440,"#5A4A3A",1.2,"moine");
    el("path",{d:"M1170,296 L1210,250 L1300,250 L1260,296Z",fill:"#FFF8E6",stroke:"#9C8B6E","stroke-width":2},mo); // livre modèle incliné
    R.page=el("rect",{x:1190,y:258,width:100,height:34,fill:"#FFFDF5",stroke:"#9C8B6E"},mo);
    R.lignes=[]; for(let i=0;i<4;i++){ const l=el("line",{x1:1198,y1:266+i*7,x2:1282,y2:266+i*7,stroke:"#1E2430","stroke-width":2.4},mo); R.lignes.push(l); }
    R.plume=el("path",{d:"M0,0 L30,-36 L34,-32 Z",fill:"#F4F4F4",stroke:C.ink,"stroke-width":1.5},mo);
    R.copieT=el("text",{x:1200,y:480,"text-anchor":"middle","font-size":22,"font-weight":700,fill:"#4A5468"},mo);
    // école
    el("rect",{x:1340,y:250,width:200,height:120,rx:6,fill:"#2F4A3A",stroke:"#5A3A1A","stroke-width":6},mo);
    R.lettres=["A","B","C","D"].map((l,i)=>el("text",{x:1370+i*45,y:330,"font-size":44,"font-weight":700,fill:"#fff",text:l},mo));
    R.eleves=[person(a,mo,1370,520,"#C97B4A",.85),person(a,mo,1440,520,"#5B7FB8",.85),person(a,mo,1510,520,"#8AA05B",.85)];
    // flux
    const fl=a.layer("flux"); R.fl=fl;
    R.fDime=a.arrow(fl,"M500,660 Q690,725 870,548",{color:C.or,w:7});
    R.fHD=a.arrow(fl,"M1010,500 Q1040,470 1068,480",{color:C.gr,w:7});
    R.fMO=a.arrow(fl,"M860,300 Q960,230 1048,260",{color:C.gr,w:7});
    a.manip.innerHTML=`Récolte du paysan : <input type="range" id="mR" min="10" max="100" step="10" value="10"> <span id="mRv">10 gerbes</span>`;
    document.getElementById("mR").oninput=e=>{ recolte=+e.target.value; document.getElementById("mRv").textContent=recolte+" gerbes"; a.redraw(); };
    // photos « Dans la réalité » (encarts libres, jamais sur un élément essentiel)
    const lp=a.layer("photos");
    R.pHD=a.photo(lp,{id:"h-a1b-hospices-beaune",x:1250,y:34,w:300,h:200,cap:"Hospices de Beaune",rot:2});
    R.pMs=a.photo(lp,{id:"h-a1b-manuscrit-enlumine",x:80,y:50,w:400,h:270,cap:"Un manuscrit copié par des moines",rot:-2});
    // synthèse
    const sy=a.layer("synthese"); R.sy=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    const box=(x,y,txt,col)=>a.label(sy,x,y,txt,{size:28,stroke:col,color:col,sw:4,w:360});
    R.b1=box(300,230,"Les fidèles\n(paysans, seigneurs)",C.bl); R.b2=box(800,230,"L'Église\n(curés, évêques, moines)",C.or);
    R.b3=box(1330,90,"Soigner les malades\naccueillir les pauvres",C.gr); R.b4=box(1330,230,"Enseigner,\ncopier les livres",C.gr); R.b5=box(1330,370,"Baptiser, marier,\nenterrer",C.gr);
    R.s1=a.arrow(sy,"M485,230 L615,230",{color:C.or,w:7}); R.s1t=el("text",{x:550,y:180,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.or,text:"dîme + dons"},sy);
    R.s2=a.arrow(sy,"M985,205 L1130,100",{color:C.gr,w:6}); R.s3=a.arrow(sy,"M985,230 L1130,230",{color:C.gr,w:6}); R.s4=a.arrow(sy,"M985,255 L1130,360",{color:C.gr,w:6});
    R.s5=a.arrow(sy,"M1330,440 Q800,570 300,300",{color:C.bl,w:5,dash:"14 10"}); R.s5t=el("text",{x:800,y:545,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.bl,text:"services rendus à toute la population"},sy);
    R.myth=a.layer("myth"); a.myth(R.myth,240,610,1120,"Au Moyen Âge, c'est le roi qui fait les hôpitaux et les écoles, comme l'État aujourd'hui.","C'est surtout l'Église, payée par la dîme et les dons, qui soigne, aide les pauvres et enseigne.");
  },
  reset(a){
    [R.hd,R.mo,R.fDime,R.fHD,R.fMO,R.sy,R.myth,R.compteur,R.miniG,R.seign,R.pain,R.soeur,R.pHD,R.pMs,...R.visiteurs,...R.vLab].forEach(e=>a.op(e,0));
    a.op(R.grange,1); a.op(R.champ,1);
    R.gerbes.forEach((g,i)=>{ a.tr(g,GX(i),GY(i),1); a.op(g,i<10?1:0); a.cls(g,"glow",false); });
    a.cls(R.cloche,"pulse",false); a.cls(R.eglise,"glow",false);
  },
  etapes:[
  { titre:"Le village et son église", duree:6000,
    legende:"Au Moyen Âge, presque tout le monde est chrétien. Au centre du village, l'église est le plus grand bâtiment ; sa cloche rythme la journée.",
    voix:"Au Moyen Âge, presque tous les habitants sont chrétiens. Au centre de chaque village se trouve l'église : c'est le bâtiment le plus grand et le plus solide. Sa cloche rythme la journée, le travail et les fêtes.",
    anim(t,a){ a.cls(R.cloche,"pulse",t>.2&&t<1); a.cls(R.eglise,"glow",t>.2&&t<.8); a.tr(R.paysan,470,800,1.3); } },
  { titre:"La dîme : un dixième de la récolte", duree:11000,
    legende:"Chaque année, le paysan donne à l'Église la dîme : environ 1 gerbe sur 10. Récolte de 10 gerbes : il en donne 1. Récolte de 20 gerbes : il en donne 2 (chiffres pris en exemple).",
    voix:"Chaque année, le paysan doit donner à l'Église la dîme : environ une gerbe sur dix. Prenons un exemple. Quand il récolte dix gerbes, il en donne une. L'année suivante, la récolte est meilleure : vingt gerbes, et il en donne deux. Plus la récolte est grande, plus la dîme est grande. Les seigneurs, eux, donnent souvent des terres. Grâce à ces richesses, l'Église pourra aider la population.",
    anim(t,a){ const s=a.seg; a.op(R.compteur,s(t,0,.06)); a.op(R.bars,0); a.op(R.miniG,0);
      const B=t>=.44, fade=1-s(t,.4,.46), fA=s(t,.28,.42), f1=s(t,.70,.82), f2=s(t,.75,.87);
      R.gerbes.forEach((g,i)=>{ let o,x=GX(i),y=GY(i),f=0;
        if(!B){ o=i<10?fade:0; if(i===9) f=fA; }
        else { o=a.seg(t,.46+i*.008,.52+i*.008); if(i===9) f=f1; if(i===19) f=f2; }
        if(f>0){ x=a.lerp(x,TG[i][0],f); y=a.lerp(y,TG[i][1],f)-Math.sin(f*Math.PI)*120; }
        a.tr(g,x,y,1+(f>0?.5*Math.sin(f*Math.PI):0)); a.op(g,o); a.cls(g,"glow",f>0&&f<1); });
      a.op(R.fDime,B?1:fade); a.draw(R.fDime.path,B?s(t,.66,.72):s(t,.22,.3));
      if(!B){ R.cT.textContent="Exemple · année 1 : récolte moyenne"; R.cR.textContent="Récolte : "+pl(Math.round(a.lerp(0,10,s(t,.06,.22,true))),"gerbe"); R.cD.textContent=fA>0?"Dîme : 1 gerbe (1 sur 10)":"Dîme : ?"; }
      else { const d=(f1>=.5?1:0)+(f2>=.5?1:0); R.cT.textContent="Exemple · année 2 : bonne récolte"; R.cR.textContent="Récolte : "+pl(Math.round(a.lerp(0,20,s(t,.48,.66,true))),"gerbe"); R.cD.textContent=d?`Dîme : ${pl(d,"gerbe")} (1 sur 10)`:"Dîme : ?"; }
      a.op(R.seign,s(t,.9,.98)); } },
  { titre:"À vous : faites varier la récolte", duree:5000,
    legende:"À vous : déplacez le curseur pour changer la récolte du paysan, et regardez ce qui change. Chaque dessin de gerbe vaut 5 gerbes ; la dîme reste toujours 1 gerbe sur 10.",
    voix:"À vous ! Avec le curseur, changez la récolte du paysan, et regardez ce qui change. Plus il récolte, plus il donne à l'Église, mais c'est toujours une gerbe sur dix. Quand vous avez fini, appuyez sur Continuer.",
    anim(t,a){ const s=a.seg, N=recolte, nI=N/5, nM=N/10;
      a.op(R.compteur,1); a.op(R.bars,1); a.op(R.miniG,s(t,.1,.25)); a.op(R.fDime,1); a.draw(R.fDime.path,1);
      R.cT.textContent="Chaque dessin de gerbe = 5 gerbes"; R.cR.textContent="Récolte : "+N+" gerbes"; R.cD.textContent="Dîme : "+pl(nM,"gerbe")+" (1 sur 10)";
      R.barR.setAttribute("width",480*N/100); R.barD.setAttribute("width",480*nM/100);
      R.gerbes.forEach((g,i)=>{ a.tr(g,GX(i),GY(i),1); a.cls(g,"glow",false); a.op(g,i<nI?s(t,i*.01,.12+i*.01):0); });
      R.mini.forEach((m,i)=>a.op(m,i<nM?1:0)); } },
  { titre:"Soigner et accueillir", duree:10000,
    legende:"Avec ces richesses, l'Église construit des hôtels-Dieu : des religieuses y soignent les malades, nourrissent les pauvres et accueillent les pèlerins, gratuitement.",
    voix:"Avec ces richesses, l'Église fait construire des hôtels-Dieu, c'est-à-dire des hôpitaux. Des religieuses y soignent les malades, nourrissent les pauvres et accueillent les pèlerins, gratuitement. Près de chez nous, à Beaune, les Hospices ont été fondés en mille quatre cent quarante-trois.",
    anim(t,a){ const s=a.seg; a.op(R.compteur,1-s(t,0,.12)); a.op(R.miniG,1-s(t,0,.1)); a.op(R.pHD,s(t,.3,.45)); a.op(R.fDime,1-s(t,0,.1)); a.op(R.hd,s(t,0,.2)); a.op(R.fHD,s(t,.15,.2)); a.draw(R.fHD.path,s(t,.15,.35)); a.op(R.seign,1-s(t,0,.1));
      R.visiteurs.forEach((p,i)=>{ const v=s(t,.25+i*.12,.6+i*.12); a.op(p,v>0?1:0); const x=a.lerp(1640,1120+i*105,v); a.tr(p,x,800+Math.abs(Math.sin(v*14))*-6,1.1); a.op(R.vLab[i],s(t,.6+i*.12,.7+i*.12)); a.set(R.vLab[i],{x:1120+i*105,y:i%2?878:848}); });
      a.op(R.soeur,s(t,.35,.45)); a.tr(R.soeur,1425,790,1.2);
      const p=s(t,.75,.95); a.op(R.pain,p>0&&p<1?1:0); a.tr(R.pain,a.lerp(1400,1225,p),a.lerp(700,690,p)-Math.sin(p*Math.PI)*50); } },
  { titre:"Copier les livres, enseigner", duree:10000,
    legende:"Dans les monastères, les moines copient les livres à la main, page par page. Les écoles des monastères et des cathédrales apprennent à lire et à écrire en latin.",
    voix:"Dans les monastères, les moines recopient les livres à la main, page par page : un seul livre peut demander des mois de travail ! Sans eux, beaucoup de textes anciens auraient disparu. Les écoles des monastères et des cathédrales apprennent aussi à lire et à écrire, en latin.",
    anim(t,a){ const s=a.seg; a.op(R.pHD,1-s(t,0,.12)); a.op(R.pMs,s(t,.45,.6)); a.op(R.hd,1-s(t,0,.15)); a.op(R.fHD,1-s(t,0,.1)); R.visiteurs.concat(R.vLab,[R.soeur]).forEach(e=>a.op(e,1-s(t,0,.12)));
      a.op(R.mo,s(t,.1,.25)); a.op(R.fMO,s(t,.2,.25)); a.draw(R.fMO.path,s(t,.2,.4));
      const c=s(t,.3,.9,true); R.lignes.forEach((l,i)=>{ const v=a.clamp(c*4-i,0,1); a.draw(l,v); }); const li=Math.min(3,Math.floor(c*4)); const lv=a.clamp(c*4-li,0,1);
      a.tr(R.plume,1198+84*lv,266+li*7); R.copieT.textContent=`Copie : ${Math.round(c*100)} % d'une page`;
      R.lettres.forEach((l,i)=>a.op(l,s(t,.35+i*.1,.45+i*.1))); R.eleves.forEach((e,i)=>a.op(e,s(t,.25+i*.05,.35+i*.05))); } },
  { titre:"Synthèse : à quoi sert l'Église ?", duree:11000,
    legende:"Les fidèles donnent la dîme et des dons ; l'Église s'en sert pour soigner, aider les pauvres, enseigner et accompagner chaque vie, du baptême à l'enterrement.",
    voix:"Récapitulons. Les fidèles donnent la dîme et des dons à l'Église. L'Église s'en sert pour soigner les malades, aider les pauvres, enseigner et copier les livres. Elle accompagne aussi toute la vie des chrétiens : le baptême, le mariage, l'enterrement. Au Moyen Âge, c'est elle, et non le roi, qui joue ce rôle social.",
    anim(t,a){ const s=a.seg; a.op(R.pMs,1-s(t,0,.1)); a.op(R.mo,1); a.op(R.sy,s(t,0,.12)); a.op(R.b1,s(t,.05,.15)); a.op(R.b2,s(t,.15,.25)); a.op(R.s1,s(t,.2,.22)); a.draw(R.s1.path,s(t,.2,.3)); a.op(R.s1t,s(t,.25,.3));
      [[R.s2,R.b3],[R.s3,R.b4],[R.s4,R.b5]].forEach(([ar,b],i)=>{ a.op(ar,s(t,.3+i*.1,.32+i*.1)); a.draw(ar.path,s(t,.3+i*.1,.4+i*.1)); a.op(b,s(t,.35+i*.1,.45+i*.1)); });
      a.op(R.s5,s(t,.62,.64)); a.draw(R.s5.path,s(t,.62,.75)); a.op(R.s5t,s(t,.7,.75)); a.op(R.myth,s(t,.8,.92)); a.cls(R.myth.faux,"pulse",t>.92&&t<1); } },
  ]
});
})();
