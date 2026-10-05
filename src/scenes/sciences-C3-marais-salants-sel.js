/* META {"id":"sciences-C3-marais-salants-sel","matiere":"sciences","annee":"B","periode":1,"theme":"Matière, mélanges, eau : récupérer le sel dissous (évaporation, cristallisation)","resume":"Dans les marais salants de Guérande, le soleil et le vent évaporent l'eau de mer : le sel reste, l'eau devient de plus en plus salée jusqu'à ce que le sel cristallise.","motsCles":["marais salants","Guérande","évaporation","cristallisation","saumure","fleur de sel","gros sel","paludier","salinité","Salins-les-Bains"]} */
(function(){
const C={ink:"#1E2430",or:"#E07A1F",bl:"#2563A8",gr:"#2E8B57",red:"#C0392B",sea:"#4A90D9",seaL:"#BFE0F7",clay:"#A38B6C",clayD:"#7C6A52"};
const rnd=(i,k)=>{ const x=Math.sin(i*12.9898+k*78.233)*43758.5453; return x-Math.floor(x); };
const MANIP=3, EVM=.875;           // à la fin, 87,5 % de l'eau est partie : 35 g/L -> 280 g/L
const vfOf=ev=>1-EVM*ev, concOf=ev=>35/vfOf(ev);
const fr=v=>Math.round(v).toLocaleString("fr-FR");
let R={}, manipActive=false, sunV=60, RT=0;
// zoom : grille de particules d'eau (15 colonnes, 9 rangées)
const ZP={x:860,y:160,w:680,h:420}, SLOT=[]; for(let r=0;r<9;r++) for(let c=0;c<15;c++) SLOT.push({x:910+c*40+(r%2?20:0),y:560-r*40,r,c,i:r*15+c});
const SALT=[...Array(8)].map((_,i)=>({x:930+rnd(i,1)*540,f:.12+rnd(i,2)*.78}));
const BASIN={x0:110,x1:730,bot:640,H:280};   // bassin (schéma)

function sunG(a,p,r){ const g=a.el("g",{},p); g.rays=[...Array(12)].map((_,i)=>a.el("line",{x1:r+16,y1:0,x2:r+46,y2:0,stroke:"#F5A91F","stroke-width":7,"stroke-linecap":"round",transform:`rotate(${i*30})`},g)); g.disc=a.el("circle",{cx:0,cy:0,r,fill:"#FFC83D",stroke:"#E8A317","stroke-width":4},g); return g; }
function salt(a,p,x,y,s,col){ return a.el("rect",{x:x-s/2,y:y-s/2,width:s,height:s,fill:"#fff",stroke:col||C.or,"stroke-width":3},p); }

Anim.run({
  titre:"Du sel avec le Soleil : les marais salants",
  sousTitre:"Sciences et technologie · CM1-CM2 · Matière, mélanges, eau",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment récupère-t-on le sel qui est dissous dans l'eau de mer ?",
  manipDes:MANIP, manipJusqua:MANIP,
  init(a){
    const {el}=a, svg=a.svg;
    const defs=el("defs",{},svg); const cz=el("clipPath",{id:"c3z"},defs); el("rect",{x:ZP.x,y:ZP.y,width:ZP.w,height:ZP.h,rx:14},cz);
    const gr=el("linearGradient",{id:"c3sky",x1:0,y1:0,x2:0,y2:1},defs); el("stop",{offset:0,"stop-color":"#D5ECFA"},gr); el("stop",{offset:1,"stop-color":"#F4FAFE"},gr);
    R.title=el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink},svg);
    // ===== 1. l'eau de mer contient du sel =====
    const s1=a.layer("s1"); R.s1=s1;
    el("rect",{x:40,y:130,width:470,height:480,rx:18,fill:"url(#c3sky)",stroke:"#9AB7CC","stroke-width":3},s1);
    el("rect",{x:43,y:330,width:464,height:277,rx:16,fill:C.sea},s1); el("rect",{x:43,y:330,width:464,height:277,rx:16,fill:"#2F6FB5",opacity:.3},s1);
    R.w1=el("path",{fill:"none",stroke:"#fff","stroke-width":4,opacity:.75},s1);
    el("text",{x:275,y:200,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ink,text:"L'océan Atlantique"},s1); el("text",{x:275,y:240,"text-anchor":"middle","font-size":26,fill:"#4A5468",text:"(côte de Guérande)"},s1);
    el("text",{x:275,y:660,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.bl,text:"On goûte : c'est salé !"},s1);
    // bocal d'un litre
    R.jar=el("g",{},s1); const jx=700, jb=640, jw=230, jh=390;
    R.jarW=el("rect",{x:jx-jw/2+4,y:jb-jh*.86,width:jw-8,height:jh*.86,fill:C.seaL},R.jar);
    R.jg=[...Array(35)].map((_,i)=>salt(a,R.jar,jx-jw/2+24+rnd(i,1)*(jw-48),jb-24-rnd(i,2)*(jh*.86-44),12));
    el("path",{d:`M${jx-jw/2},${jb-jh} L${jx-jw/2},${jb} L${jx+jw/2},${jb} L${jx+jw/2},${jb-jh}`,fill:"none",stroke:"#7E9BB3","stroke-width":6,"stroke-linejoin":"round"},R.jar);
    [.25,.5,.75,1].forEach((f,i)=>el("line",{x1:jx-jw/2,y1:jb-jh*.86*f,x2:jx-jw/2+(i===3?44:26),y2:jb-jh*.86*f,stroke:"#7E9BB3","stroke-width":4},R.jar));
    el("text",{x:jx,y:jb+44,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink,text:"1 litre d'eau de mer"},R.jar);
    R.jT=el("text",{x:jx,y:jb-jh-18,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.or,text:"sel dissous (invisible)"},R.jar);
    R.pour=el("path",{d:"M450,420 Q560,330 650,300",fill:"none",stroke:C.sea,"stroke-width":12,"stroke-linecap":"round"},s1);
    // loupe
    R.lz=el("g",{},s1); const lx=1090, ly=360, lr=185; const lc=el("clipPath",{id:"c3l"},el("defs",{},R.lz)); el("circle",{cx:lx,cy:ly,r:lr-4},lc);
    el("circle",{cx:lx,cy:ly,r:lr,fill:"#F4FAFE",stroke:"#5A6478","stroke-width":6},R.lz); const li=el("g",{"clip-path":"url(#c3l)"},R.lz);
    R.lzp=[...Array(46)].map((_,i)=>{ const th=rnd(i,1)*6.283, rr=Math.sqrt(rnd(i,2))*(lr-30); const sl=i>=36; const e=sl?salt(a,li,0,0,20):el("circle",{r:14,fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":2.5},li); e.bx=lx+Math.cos(th)*rr; e.by=ly+Math.sin(th)*rr; e.sl=sl; return e; });
    el("text",{x:lx,y:ly-lr-20,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Zoom sur l'eau de mer"},R.lz);
    el("circle",{cx:lx-150,cy:ly+lr+44,r:12,fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":3},R.lz); el("text",{x:lx-130,y:ly+lr+53,"font-size":24,fill:C.ink,text:"eau"},R.lz); salt(a,R.lz,lx-20,ly+lr+44,20); el("text",{x:lx+4,y:ly+lr+53,"font-size":24,fill:C.ink,text:"sel dissous"},R.lz);
    // balance + tas de sel
    R.bal=el("g",{},s1); el("rect",{x:1310,y:640,width:250,height:96,rx:14,fill:"#E9EDF2",stroke:"#8C96A6","stroke-width":4},R.bal); el("rect",{x:1330,y:612,width:210,height:26,rx:8,fill:"#C9CFD8",stroke:"#8C96A6","stroke-width":3},R.bal);
    el("rect",{x:1346,y:660,width:178,height:56,rx:8,fill:"#1E2A20"},R.bal); R.balT=el("text",{x:1508,y:703,"text-anchor":"end","font-size":42,"font-weight":800,fill:"#7CFF8A","font-family":"Consolas,monospace"},R.bal);
    R.heap=el("path",{d:"M1370,612 Q1400,560 1435,540 Q1470,560 1500,612Z",fill:"#fff",stroke:"#9AA3B2","stroke-width":3},R.bal); R.heapI=[...Array(14)].map((_,i)=>el("rect",{x:1385+rnd(i,3)*100,y:578+rnd(i,4)*28,width:8,height:8,fill:"#fff",stroke:"#B6BECB","stroke-width":1.5,transform:`rotate(${rnd(i,5)*60} 1420 590)`},R.bal));
    R.balL=a.label(s1,1435,790,"Le sel d'1 litre d'eau de mer :\nenviron 35 g (exemple moyen)",{size:24,w:440,stroke:C.or,color:"#8A4A0E",sw:3});
    // ===== 2. le marais =====
    const s2=a.layer("s2"); R.s2=s2; s2.setAttribute("transform","translate(0,50)"); const cl=["#BFE0F7","#A9D5F2","#93CBEE","#7FC2E6","#74C6D6","#86D3C9"];
    const B=[["la mer",40,220,150,420,0],["vasière",290,240,190,360,1],["cobier",520,290,150,260,2],["fares",700,330,220,180,3],["adernes",950,350,120,140,4]];
    el("rect",{x:40,y:220,width:150,height:420,rx:14,fill:C.sea,stroke:C.bl,"stroke-width":4},s2); R.w2=el("path",{fill:"none",stroke:"#fff","stroke-width":4,opacity:.75},s2);
    el("rect",{x:190,y:408,width:110,height:44,fill:"#9CCBEF",stroke:C.bl,"stroke-width":4},s2);
    R.P2=[]; B.slice(1).forEach(([n,x,y,w,h,k])=>{ const g=el("g",{},s2); el("rect",{x,y,width:w,height:h,rx:16,fill:cl[k],stroke:C.clayD,"stroke-width":6},g); R.P2.push(g); });
    R.oe=el("g",{},s2); for(let r=0;r<3;r++) for(let c=0;c<3;c++) el("rect",{x:1100+c*70,y:340+r*62,width:56,height:48,rx:6,fill:cl[5],stroke:C.clayD,"stroke-width":4},R.oe);
    [[1070,430,1100,430]].forEach(p=>el("line",{x1:p[0],y1:p[1],x2:p[2],y2:p[3],stroke:C.clayD,"stroke-width":8},s2));
    R.flowP=el("path",{d:"M60,430 L1090,430",fill:"none"},s2); R.fd=[...Array(16)].map(()=>el("circle",{r:9,fill:"#fff",stroke:C.bl,"stroke-width":3},s2));
    R.n2=[["la mer",115,725,"eau de mer"],["vasière",385,725,"réserve d'eau\n(grandes marées)"],["cobier",595,725,"l'eau\navance"],["fares",810,725,"l'eau chauffe\net s'évapore"],["adernes",1010,725,"on alimente\nles œillets"],["œillets",1235,725,"le sel\nse forme ici"]].map(([n,x,y,t])=>{ const g=el("g",{},s2); el("text",{x,y:y-30,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink,text:n},g); const tx=el("text",{x,y:y+6,"text-anchor":"middle","font-size":24,fill:"#4A5468"},g); t.split("\n").forEach((l,j)=>el("tspan",{x,dy:j?28:0,text:l},tx)); return g; });
    R.sal0=a.label(s2,115,175,"≈ 35 g de sel\npar litre",{size:26,w:210,stroke:C.bl,color:C.bl,sw:3}); R.sal1=a.label(s2,1235,255,"250 à 280 g de sel\npar litre",{size:26,w:270,stroke:C.or,color:"#8A4A0E",sw:3});
    R.up=a.arrow(s2,"M300,168 L1120,168",{color:"#9AA3B2",w:6,head:3.2}); R.upT=el("text",{x:710,y:152,"text-anchor":"middle","font-size":28,"font-weight":800,fill:C.ink,text:"de plus en plus salée"},s2);
    R.ph2=a.photo(s2,{id:"s-c3-marais-guerande",x:1340,y:380,w:220,h:150,cap:"Marais de Guérande",size:20,rot:1.5});
    // ===== 3-4-5. le bassin =====
    const s3=a.layer("s3"); R.s3=s3;
    R.sun=sunG(a,s3,36); R.sunT=el("text",{x:620,y:262,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#8A4A0E"},s3);
    R.wind=[0,1,2].map(i=>el("path",{fill:"none",stroke:"#8FA6BC","stroke-width":5,"stroke-linecap":"round",opacity:.8},s3));
    el("text",{x:90,y:300,"font-size":24,"font-weight":700,fill:"#6B7F95",text:"vent"},s3);
    R.vap=[...Array(14)].map(()=>el("circle",{r:11,fill:"#fff","fill-opacity":.6,stroke:C.bl,"stroke-width":2.5,"stroke-dasharray":"4 3"},s3));
    R.wat=el("rect",{x:BASIN.x0,width:BASIN.x1-BASIN.x0,fill:"#8FC7EE"},s3); R.wsurf=el("line",{x1:BASIN.x0,x2:BASIN.x1,stroke:"#2F6FB5","stroke-width":4},s3);
    el("rect",{x:BASIN.x0,y:BASIN.bot,width:BASIN.x1-BASIN.x0,height:60,fill:C.clay},s3);
    el("path",{d:"M60,700 L60,380 Q60,340 90,340 L112,340 L112,700Z",fill:C.clayD},s3); el("path",{d:"M780,700 L780,380 Q780,340 750,340 L728,340 L728,700Z",fill:C.clayD},s3);
    R.gros=[...Array(46)].map((_,i)=>el("rect",{x:BASIN.x0+14+rnd(i,1)*(BASIN.x1-BASIN.x0-40),y:BASIN.bot-12-rnd(i,2)*12,width:12+rnd(i,3)*8,height:12+rnd(i,4)*6,fill:"#EDEFF2",stroke:"#9AA3B2","stroke-width":1.5},s3));
    R.fleur=el("g",{},s3); for(let i=0;i<40;i++) el("rect",{x:BASIN.x0+6+i*15.5,width:11,height:7,rx:2,fill:"#fff",stroke:"#C9CED8","stroke-width":1.5},R.fleur);
    R.lousse=el("g",{},s3); el("line",{x1:0,y1:0,x2:150,y2:-190,stroke:"#7C5A33","stroke-width":9,"stroke-linecap":"round"},R.lousse); el("rect",{x:-34,y:-4,width:68,height:12,rx:4,fill:"#B98B52",stroke:"#7C5A33","stroke-width":3},R.lousse);
    el("text",{x:420,y:734,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"un œillet vu de côté (schéma : la hauteur d'eau est très exagérée)"},s3);
    R.hint=el("text",{x:90,y:150,"font-size":28,"font-weight":800,fill:C.or},s3);
    // zoom
    R.zm=el("g",{},s3); el("rect",{x:ZP.x,y:ZP.y,width:ZP.w,height:ZP.h,rx:14,fill:"#fff",stroke:"#5A6478","stroke-width":5},R.zm); el("text",{x:ZP.x+ZP.w/2,y:ZP.y-14,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Zoom sur l'eau du bassin (schéma)"},R.zm);
    const zi=el("g",{"clip-path":"url(#c3z)"},R.zm); R.zw=el("rect",{x:ZP.x,width:ZP.w,fill:"#E3F1FB"},zi);
    R.zp=SLOT.map(s=>el("circle",{r:14,"stroke-width":2.5},zi)); R.zs=SALT.map(()=>el("rect",{fill:"#fff",stroke:C.or,"stroke-width":3},zi));
    R.zl=el("g",{},R.zm); el("circle",{cx:ZP.x+60,cy:ZP.y+ZP.h+36,r:12,fill:"#7FB8E6",stroke:"#2F6FB5","stroke-width":3},R.zl); el("text",{x:ZP.x+80,y:ZP.y+ZP.h+45,"font-size":24,fill:C.ink,text:"eau"},R.zl); el("circle",{cx:ZP.x+190,cy:ZP.y+ZP.h+36,r:12,fill:"#fff","fill-opacity":.7,stroke:C.bl,"stroke-width":3,"stroke-dasharray":"4 3"},R.zl); el("text",{x:ZP.x+210,y:ZP.y+ZP.h+45,"font-size":24,fill:C.ink,text:"vapeur d'eau"},R.zl); salt(a,R.zl,ZP.x+560,ZP.y+ZP.h+36,20); el("text",{x:ZP.x+580,y:ZP.y+ZP.h+45,"font-size":24,fill:C.ink,text:"sel"},R.zl);
    // tuiles de données
    R.tl=el("g",{},s3); const tile=(x,t)=>{ el("rect",{x,y:752,width:470,height:122,rx:16,fill:"#fff",stroke:C.ink,"stroke-width":3.5},R.tl); el("text",{x:x+20,y:788,"font-size":25,"font-weight":700,fill:"#4A5468",text:t},R.tl); };
    tile(70,"Eau restante"); tile(565,"Sel dans le bassin"); tile(1060,"Salinité (sel par litre)");
    R.tE=el("text",{x:90,y:845,"font-size":50,"font-weight":800,fill:C.bl},R.tl); R.tS=el("text",{x:585,y:845,"font-size":50,"font-weight":800,fill:C.gr},R.tl); R.tC=el("text",{x:1080,y:845,"font-size":50,"font-weight":800,fill:C.or},R.tl);
    R.tS2=el("text",{x:790,y:844,"font-size":26,"font-weight":700,fill:C.gr,text:"ne change pas !"},R.tl); R.tE2=el("text",{x:262,y:788,"font-size":22,fill:"#4A5468",text:"(exemple : 1 L au départ)"},R.tl);
    // photos étape 5 + légendes
    R.p5=el("g",{},s3); R.ph5a=a.photo(R.p5,{id:"s-c3-paludier",x:880,y:170,w:310,h:205,cap:"Un paludier au travail",size:20,rot:-1.5}); R.ph5b=a.photo(R.p5,{id:"s-c3-fleur-de-sel",x:1230,y:170,w:310,h:205,cap:"La fleur de sel",size:20,rot:1.5});
    const lg=(x,y,w,t1,t2,col)=>{ el("rect",{x,y,width:w,height:200,rx:16,fill:"#fff",stroke:col,"stroke-width":4},R.p5); el("text",{x:x+20,y:y+46,"font-size":32,"font-weight":800,fill:col,text:t1},R.p5); const tx=el("text",{x:x+20,y:y+88,"font-size":24,fill:C.ink},R.p5); a.wrap(tx,t2,Math.floor((w-40)/11.4),1.28); };
    lg(865,470,330,"Le gros sel","il se dépose au fond de l'œillet, il est gris : on le ramasse avec un râteau (le las)","#6B7683"); lg(1220,470,330,"La fleur de sel","fine couche blanche en surface, écumée avec la lousse par temps sec et venteux","#2563A8");
    // ===== 6. où est passé le sel ? =====
    const s6=a.layer("s6"); R.s6=s6; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s6);
    el("text",{x:420,y:80,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Une assiette d'eau de mer au soleil"},s6);
    R.pl=[0,1,2].map(k=>{ const g=el("g",{},s6), cx=140+k*270; g.cx=cx; g.sb=el("ellipse",{cx,cy:500,rx:124,ry:40,fill:"#F4F6F9",stroke:"#7E9BB3","stroke-width":6},g); g.w=el("ellipse",{cx,cy:500,rx:108,ry:31,fill:C.seaL},g); g.gr=[...Array(12)].map((_,i)=>el("rect",{width:10,height:10,fill:"#fff",stroke:C.or,"stroke-width":2.5},g)); g.v=[...Array(5)].map(()=>el("circle",{r:10,fill:"#fff","fill-opacity":.6,stroke:C.bl,"stroke-width":2.5,"stroke-dasharray":"4 3"},g));
      el("text",{x:cx,y:590,"text-anchor":"middle","font-size":27,"font-weight":800,fill:C.ink,text:["au départ","quelques jours après","plus tard encore"][k]},g); g.t1=el("text",{x:cx,y:632,"text-anchor":"middle","font-size":28,fill:C.bl},g); g.t2=el("text",{x:cx,y:672,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.gr},g); return g; });
    R.pSun=sunG(a,s6,34); a.tr(R.pSun,700,260);
    R.myth=a.layer("myth"); a.myth(R.myth,870,130,690,"« Le sel s'évapore avec l'eau. »","Seule l'eau s'évapore : elle part dans l'air en vapeur d'eau. Le sel, lui, reste : on retrouve toujours la même masse de sel.");
    R.fc=el("g",{},s6); el("rect",{x:870,y:500,width:690,height:300,rx:18,fill:"#F3F6FC",stroke:C.bl,"stroke-width":4},R.fc); el("text",{x:896,y:550,"font-size":30,"font-weight":800,fill:C.bl,text:"Et chez nous, en Franche-Comté ?"},R.fc); const fc=el("text",{x:896,y:596,"font-size":26,fill:C.ink},R.fc); a.wrap(fc,"À Salins-les-Bains (Jura), on tirait de l'eau très salée du sous-sol. On la chauffait dans de grandes cuves : l'eau s'évaporait et le sel cristallisait. Un tuyau de 21 km l'envoyait à la Saline royale d'Arc-et-Senans.",46,1.32);
    // ===== 7. synthèse =====
    const sy=a.layer("syn"); R.syn=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); el("text",{x:800,y:70,"text-anchor":"middle","font-size":38,"font-weight":800,fill:C.ink,text:"À retenir"},sy);
    R.sC=[["1","Le Soleil et le vent évaporent l'eau","l'eau de mer devient de la vapeur d'eau, un gaz qui part dans l'air.",C.or],["2","Le sel, lui, reste","il ne s'évapore pas : il y a de moins en moins d'eau, donc l'eau est de plus en plus salée.",C.bl],["3","Le sel se dépose en cristaux","gros sel au fond, fleur de sel en surface : le paludier les récolte.",C.gr]].map(([n,t,d,c],i)=>{ const g=el("g",{},sy), y=130+i*230; el("rect",{x:60,y,width:900,height:200,rx:18,fill:"#fff",stroke:c,"stroke-width":4},g); el("circle",{cx:128,cy:y+100,r:38,fill:c},g); el("text",{x:128,y:y+114,"text-anchor":"middle","font-size":42,"font-weight":800,fill:"#fff",text:n},g); el("text",{x:190,y:y+70,"font-size":34,"font-weight":800,fill:c,text:t},g); const tx=el("text",{x:190,y:y+118,"font-size":28,fill:C.ink},g); a.wrap(tx,d,50,1.25); return g; });
    R.synP=el("g",{},sy); R.ph7a=a.photo(R.synP,{id:"s-c3-marais-guerande",x:1050,y:150,w:430,h:270,cap:"Les marais salants de Guérande",rot:1.5}); R.ph7b=a.photo(R.synP,{id:"s-c3-fleur-de-sel",x:1090,y:520,w:350,h:220,cap:"La fleur de sel",rot:-1.5});
    // ===== manipulation =====
    a.manip.innerHTML=`Ensoleillement : <input type="range" id="c3s" min="0" max="100" step="1" value="60" aria-label="ensoleillement"> <b id="c3v" style="min-width:70px;text-align:center">60 %</b> <button data-s="0">Pas de soleil</button> <button data-s="100">Plein soleil</button>`;
    const sl=a.manip.querySelector("#c3s"); const setS=v=>{ manipActive=true; sunV=v; a.redraw(); };
    sl.oninput=()=>setS(+sl.value); a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ sl.value=b.dataset.s; setS(+b.dataset.s); });
    const loop=()=>{ if(a.step()===MANIP){ RT=performance.now()/1000; a.redraw(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  },
  reset(a){ [R.s1,R.s2,R.s3,R.s6,R.syn,R.myth,R.fc,R.zm,R.tl,R.p5,R.lousse,R.fleur,R.pour,R.balL,R.bal,R.lz,R.jar,R.heap,R.ph2,R.sal0,R.sal1,R.up,R.upT,...R.P2,R.oe,...R.n2,...R.fd,...R.pl,R.pSun,R.synP,...R.sC].forEach(e=>a.op(e,0)); R.title.textContent=""; R.hint.textContent=""; },
  etapes:[
  { titre:"L'eau de mer est salée", duree:11000,
    legende:"L'eau de mer contient du sel, dissous donc invisible : environ 35 g par litre. Si on pouvait garder seulement le sel d'un litre, on en aurait environ 35 g.",
    voix:"Quand on goûte l'eau de mer, elle est salée. Elle contient du sel, mais il est dissous : on ne le voit pas. Dans un litre d'eau de mer, il y a environ trente-cinq grammes de sel. Zoomons : l'eau et le sel sont mélangés, les petits grains de sel sont dispersés entre les particules d'eau. Comment récupérer ce sel ? Les paludiers de Guérande ont une solution.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); R.title.textContent="Le sel dissous dans l'eau de mer"; a.set(R.w1,{d:[...Array(7)].map((_,i)=>{ const x=70+i*62+Math.sin(t*20+i)*5; return `M${x},${380+(i%3)*60} q12,-12 24,0 t24,0`; }).join(" ")});
      a.op(R.pour,s(t,.05,.15)*(1-s(t,.3,.4))); R.jarW.setAttribute("height",390*.86*s(t,.12,.34)); R.jarW.setAttribute("y",640-390*.86*s(t,.12,.34)); a.op(R.jar,s(t,.1,.2)); R.jg.forEach((g,i)=>a.op(g,s(t,.34+i*.003,.4+i*.003)*(i<35?1:0)));
      a.op(R.lz,s(t,.46,.56)); R.lzp.forEach((c,i)=>{ const x=c.bx+Math.sin(t*14+i)*5, y=c.by+Math.cos(t*12+i*2)*5; if(c.sl) a.set(c,{x:x-10,y:y-10}); else a.set(c,{cx:x,cy:y}); });
      a.op(R.bal,s(t,.68,.78)); a.op(R.heap,s(t,.7,.86)); R.heapI.forEach(h=>a.op(h,s(t,.7,.86))); R.balT.textContent=Math.round(35*s(t,.7,.88))+" g"; a.op(R.balL,s(t,.86,.96)); } },
  { titre:"Un labyrinthe de bassins", duree:11000,
    legende:"À Guérande, les paludiers laissent entrer l'eau de mer à chaque grande marée. Elle avance doucement de bassin en bassin, et devient de plus en plus salée.",
    voix:"À Guérande, sur la côte atlantique, les paludiers font entrer l'eau de mer à chaque grande marée. Elle est stockée dans un grand bassin, puis elle avance doucement à travers un labyrinthe de bassins de moins en moins profonds, jusqu'aux petits bassins où se forme le sel. Au départ, un litre d'eau contient environ trente-cinq grammes de sel. À l'arrivée, il en contient entre deux cent cinquante et deux cent quatre-vingts grammes. L'eau est devenue beaucoup plus salée.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.1)); a.op(R.s2,s(t,0,.1)); R.title.textContent="Le marais salant de Guérande (vu d'en haut)";
      a.set(R.w2,{d:[...Array(3)].map((_,i)=>`M${62+Math.sin(t*20+i)*4},${280+i*110} q12,-12 24,0 t24,0 t24,0`).join(" ")}); R.P2.forEach((g,i)=>a.op(g,s(t,.1+i*.1,.2+i*.1))); a.op(R.oe,s(t,.5,.6)); R.n2.forEach((g,i)=>a.op(g,s(t,.12+i*.1,.24+i*.1)));
      const p=s(t,.1,.95,true); R.fd.forEach((d,i)=>{ const f=((p*3+i/16)%1+1)%1; const q=a.along(R.flowP,f); const on=f<p*1.08+.02; a.set(d,{cx:q.x,cy:q.y+Math.sin(i*3)*9,fill:f<.15?"#BFE0F7":"#fff"}); a.op(d,p>0&&on?1:0); });
      a.op(R.sal0,s(t,.15,.25)); a.op(R.up,s(t,.55,.7)); a.op(R.upT,s(t,.6,.7)); a.op(R.sal1,s(t,.75,.88)); a.op(R.ph2,s(t,.8,.95)); } },
  { titre:"Le Soleil et le vent évaporent l'eau", duree:12000,
    legende:"Le Soleil et le vent font évaporer l'eau : elle part dans l'air en vapeur. Mais le sel ne s'évapore pas. Il reste, avec de moins en moins d'eau : la salinité augmente.",
    voix:"Dans un petit bassin peu profond, le Soleil et le vent font évaporer l'eau. Zoomons : les particules d'eau s'échappent dans l'air sous forme de vapeur d'eau. Mais regardez les grains de sel : aucun ne part ! Le sel reste dans le bassin. Il y a de moins en moins d'eau, mais toujours la même quantité de sel. L'eau devient donc de plus en plus salée.",
    anim(t,a){ const s=a.seg; a.op(R.s2,1-s(t,0,.1)); a.op(R.ph2,0); a.op(R.s3,s(t,0,.08)); R.title.textContent="L'évaporation dans un bassin"; BAS(a,.6*s(t,.1,.98,true),t*10,1,0,0); a.op(R.zm,s(t,.05,.2)); } },
  { titre:"À vous : le curseur d'ensoleillement", duree:7000,
    legende:"À vous : déplacez le curseur d'ensoleillement. Regardez l'eau qui part, le sel qui reste et la salinité qui augmente. Que se passe-t-il avec beaucoup de soleil ?",
    voix:"À vous maintenant ! Déplacez le curseur d'ensoleillement. Avec peu de soleil, l'eau s'évapore peu. Avec beaucoup de soleil, il reste très peu d'eau. Regardez bien la quantité de sel dans le bassin, et la salinité : que remarquez-vous ? Prenez votre temps.",
    anim(t,a){ const s=a.seg; if(t<.02){ manipActive=false; sunV=60; } R.title.textContent="À vous : changez l'ensoleillement"; const v=manipActive?sunV:60;
      const sl=a.manip&&a.manip.querySelector("#c3s"), vv=a.manip&&a.manip.querySelector("#c3v"); if(sl&&!manipActive) sl.value=v; if(vv) vv.textContent=v+" %";
      BAS(a,v/100,RT*1.2+27,1,0,0,"À vous : déplacez le curseur ▼",v); } },
  { titre:"Le sel cristallise", duree:12000,
    legende:"Quand il reste très peu d'eau, elle ne peut plus garder tout le sel dissous : il se dépose en cristaux. Gros sel au fond, fleur de sel en surface, récoltée par le paludier.",
    voix:"Quand il reste très peu d'eau, elle ne peut plus garder tout le sel dissous. Le sel se dépose alors en cristaux : c'est la cristallisation. Le gros sel, gris, se forme au fond du bassin. La fleur de sel, elle, forme une fine couche blanche à la surface. Le paludier la récolte délicatement avec une grande planche, la lousse, pendant l'été, quand il fait sec et venteux.",
    anim(t,a){ const s=a.seg; R.title.textContent="La cristallisation et la récolte"; a.op(R.s3,1); BAS(a,a.lerp(.6,1,s(t,.05,.6,true)),t*10+40,1,s(t,.55,.8),s(t,.78,.98)); a.op(R.zm,1-s(t,.58,.72)); a.op(R.p5,s(t,.7,.82)); } },
  { titre:"Où est passé le sel ?", duree:12000,
    legende:"Dans une assiette d'eau de mer laissée au soleil, l'eau disparaît mais la masse de sel reste la même. Le sel ne s'évapore pas : il est resté dans l'assiette.",
    voix:"Une idée fausse très répandue dit que le sel s'évapore avec l'eau. Vérifions avec une assiette d'eau de mer laissée au soleil. Au départ, il y a deux cents millilitres d'eau, avec environ sept grammes de sel. Quelques jours plus tard, il reste la moitié de l'eau, et toujours sept grammes de sel. Plus tard, l'eau est partie, mais le sel est toujours là, en cristaux blancs. Chez nous, en Franche-Comté, on a aussi fabriqué du sel en faisant évaporer de l'eau très salée, à Salins-les-Bains.",
    anim(t,a){ const s=a.seg; a.op(R.s3,1-s(t,0,.1)); a.op(R.s6,s(t,0,.1)); R.title.textContent=""; a.op(R.pSun,s(t,0,.1)); R.pSun.rays.forEach((r,i)=>r.setAttribute("transform",`rotate(${i*30+t*60})`));
      R.pl.forEach((g,k)=>{ const lv=[1,.5,0][k]; a.op(g,s(t,.05+k*.12,.17+k*.12)); a.set(g.w,{ry:Math.max(.001,26*lv),opacity:lv>0?1:0}); const cx=g.cx; g.gr.forEach((q,i)=>{ if(k<2){ a.set(q,{x:cx-80+rnd(i,1)*160,y:492+rnd(i,2)*20,width:9,height:9,opacity:lv>0?1:0}); } else { a.set(q,{x:cx-95+i*16+rnd(i,3)*4,y:514-rnd(i,4)*10,width:14,height:11,opacity:1}); } });
        g.v.forEach((v,i)=>{ const f=((t*5+i/5)%1+1)%1; a.set(v,{cx:cx-60+i*30,cy:460-f*80}); a.op(v,k===1?(1-f)*.9:0); });
        g.t1.textContent=["eau : 200 mL","eau : 100 mL","eau : 0 mL"][k]; g.t2.textContent="sel : 7 g (exemple)"; });
      a.op(R.myth,s(t,.6,.72)); a.op(R.fc,s(t,.78,.92)); a.cls(R.myth.faux,"pulse",t>.75&&t<1); } },
  { titre:"À retenir", duree:9000,
    legende:"Le Soleil et le vent évaporent l'eau, le sel reste : la saumure devient de plus en plus salée, puis le sel cristallise.",
    voix:"À retenir. Un : le Soleil et le vent évaporent l'eau de mer, qui part dans l'air sous forme de vapeur. Deux : le sel ne s'évapore pas, il reste, et l'eau devient de plus en plus salée. Trois : le sel se dépose en cristaux, gros sel au fond et fleur de sel en surface, et le paludier les récolte.",
    anim(t,a){ const s=a.seg; a.op(R.s6,1-s(t,0,.1)); a.op(R.myth,1-s(t,0,.1)); a.op(R.fc,0); a.op(R.syn,s(t,0,.1)); R.sC.forEach((g,i)=>{ const v=s(t,.1+i*.15,.25+i*.15); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.synP,s(t,.5,.75)); } },
  ]
});
// ---- bassin : ev = fraction évaporée (0..1), clk = horloge, cr = intensité des cristaux, fl = fleur de sel, ls = lousse, pct = ensoleillement affiché
function BAS(a,ev,clk,zoomOn,fl,ls,hint,pct){
  const vf=vfOf(ev), conc=concOf(ev), lv=BASIN.H*vf, top=BASIN.bot-lv, cr=a.clamp((ev-.82)/.15,0,1);
  a.set(R.wat,{y:top,height:lv}); a.set(R.wsurf,{y1:top,y2:top});
  const sr=36+10*(pct!==undefined?pct/100:ev); R.sun.disc.setAttribute("r",sr); R.sun.rays.forEach((r,i)=>{ r.setAttribute("x1",sr+16); r.setAttribute("x2",sr+46+(pct!==undefined?pct/100*16:8)); r.setAttribute("transform",`rotate(${i*30+clk*20})`); }); a.tr(R.sun,640,190);
  R.sunT.textContent=pct!==undefined?"Ensoleillement : "+Math.round(pct)+" %":""; a.set(R.sunT,{x:90,y:196,"text-anchor":"start"});
  R.wind.forEach((w,i)=>{ const dx=((clk*60+i*90)%240); const y=270+i*28; a.set(w,{d:`M${150+dx},${y} q30,-16 60,0 t60,0`}); a.op(w,ev>0&&ev<.98?Math.sin(Math.PI*dx/240)*.9:0); });
  R.vap.forEach((c,i)=>{ const q=((clk*.45+rnd(i,1))%1+1)%1; a.set(c,{cx:BASIN.x0+30+rnd(i,2)*(BASIN.x1-BASIN.x0-60)+Math.sin(clk*3+i)*6,cy:top-12-q*(top-210>20?(top-190):30)}); a.op(c,(ev>.005&&ev<.985)?Math.sin(Math.PI*q)*.85*Math.min(1,.4+ev*3):0); });
  R.gros.forEach((g,i)=>a.op(g,i<Math.floor(46*cr)?1:0)); a.op(R.fleur,fl>0?fl:0); R.fleur.querySelectorAll("rect").forEach((r,i)=>a.set(r,{y:top-5+Math.sin(i*2)*1.5}));
  { const p=ls; a.op(R.lousse,p>.02&&p<.98?1:0); const x=a.lerp(300,640,(p*2.2)%1); a.tr(R.lousse,x,top-6+0*p,.9); R.lousse.setAttribute("transform",`translate(${x},${top-6}) scale(.9)`); }
  // zoom
  a.op(R.zm,zoomOn>0?zoomOn:0); const zh=360*vf, zt=580-zh; a.set(R.zw,{y:zt,height:580-zt});
  const near=[]; R.zs.forEach((g,i)=>{ const sz=18+16*cr, y=Math.max(580-sz/2-4,580-Math.max(.1,SALT[i].f)*zh*(1-cr)-sz/2-4*(i%2)); const yy=cr>0?580-sz/2-6-(i%2)*4:y; const x=SALT[i].x+(rnd(i,6)-.5)*30*cr; near.push([x,yy]); a.set(g,{x:x-sz/2+Math.sin(clk*3+i)*2*(1-cr),y:yy-sz/2,width:sz,height:sz,fill:cr>0?"#EDEFF2":"#fff"}); });
  R.zp.forEach((c,k)=>{ const sl=SLOT[k], evl=(1-(sl.r*40+20)/360)/EVM, u=a.clamp((ev-evl)/.05+(ev>=1?1:0)*0,0,1);
    let x=sl.x+Math.sin(clk*2.2+k*1.7)*3, y=sl.y+Math.cos(clk*1.9+k*2.3)*3; const gone=u>=1; if(u>0){ x+=Math.sin(u*8+k)*14; y-=u*(160+rnd(k,3)*60); }
    let hide=gone; if(!hide&&u===0) for(const n of near){ if(Math.hypot(n[0]-x,n[1]-y)<30){ hide=true; break; } }
    a.set(c,{cx:x,cy:y,fill:u>0?"#fff":"#7FB8E6","fill-opacity":u>0?.7:1,stroke:u>0?C.bl:"#2F6FB5","stroke-dasharray":u>0?"4 3":null}); a.op(c,hide?0:(u>0?1-u*.9:1)); });
  // tuiles
  R.tE.textContent=fr(1000*vf)+" mL"; R.tS.textContent="35 g"; R.tC.textContent=fr(conc)+" g/L";
  a.op(R.tl,1); a.op(R.tS2,1); R.hint.textContent=hint||""; }
})();
