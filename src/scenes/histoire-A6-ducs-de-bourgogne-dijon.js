/* META {"id":"histoire-A6-ducs-de-bourgogne-dijon","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des rois francs aux … / vie religieuse et savoir","resume":"Les ducs Valois de Bourgogne (1363-1477) : Dijon, le palais des ducs, la chartreuse de Champmol, les Hospices de Beaune, et l'État bourguignon qui grandit puis disparaît à la mort de Charles le Téméraire.","motsCles":["ducs de Bourgogne","Dijon","Philippe le Hardi","Charles le Téméraire","Hospices de Beaune","Champmol","Nicolas Rolin","frise"]} */
//@data europe
(function(){
const E=EUROPE;
const C={ink:"#1E2430",ac:"#A8431F",fr:"#2F5DA8",hab:"#C9962B",gr:"#6B7385"};
const el=(...x)=>Anim.H.el(...x);
const DUKES=[["Philippe le Hardi",1363,1404,"#A8431F","Philippe II"],["Jean sans Peur",1404,1419,"#7A3E9D"],["Philippe le Bon",1419,1467,"#2563A8"],["Charles le Téméraire",1467,1477,"#C0392B"]];
// [id, année, couleur, tracé, étiquette[lignes], position, ancre, couleur finale]
const Z=[
 ["duche",1363,"#A8431F","M541.9,344.2L556.3,338.4L575.9,345.8L580.7,356.5L577.2,373.9L567.5,390.6L556.4,394.5L546.9,385.6L539.9,372L538.6,356.5Z",["Duché de","Bourgogne"],[556,378],"middle",C.fr],
 ["comte",1384,"#E07A1F","M580.7,348.8L594.3,348.9L605.1,361.4L602.3,373.8L588.8,387.8L579.4,385.6L578,374L581.3,359.1Z",["Comté de Bourgogne","(Franche-Comté)"],[607,376],"start",C.hab],
 ["flandre",1384,"#2563A8","M529.8,277.2L539.9,263.3L555.4,256.4L566.1,260.4L562.9,272.8L555.4,280.8L546.5,286L536.7,285.9Z",["Flandre,","Artois"],[542,260],"middle",C.hab],
 ["brabant",1430,"#2E8B57","M555.4,280.8L562.9,272.8L566.1,260.4L576.1,256.5L590,260.6L591.6,276.1L582,290.4L570.1,294.1L560.2,294.2Z",["Brabant,","Hainaut"],[573,278],"start",C.hab],
 ["hollande",1433,"#7A3E9D","M557.1,255.4L568,245.2L572.9,230.4L580.4,219.8L589.2,224.6L585.4,244.7L581.1,254.5L571.1,258.4Z",["Hollande,","Zélande"],[573,238],"middle",C.hab],
 ["picardie",1435,"#B7791F","M525.3,295.7L545,297.3L552.1,286.7L536.7,285.9L529.8,277.2L523.6,285.2Z",["Picardie"],[537,293],"middle",C.fr],
 ["luxembourg",1443,"#5A4636","M588.1,310.1L601.2,311.4L601.1,294.9L589.8,293.7Z",["Luxembourg"],[603,304],"start",C.hab],
 ["gueldre",1473,"#C0392B","M585.8,255L602.4,247.8L600.7,265.5L591.1,265.8Z",["Gueldre"],[604,258],"start",C.hab],
 ["lorraine",1475,"#6B7385","M581.3,327.3L606.7,324.6L610.7,336.4L601.5,344.5L586.3,344.3Z",["Lorraine"],[612,336],"start",C.gr]];
const VL={Dijon:[571.3,362.6,4,-3,"start"],Beaune:[567,369.7,-4,8,"end"],Bruxelles:[570.2,272.4,-5,-2,"end"],Lille:[548.9,275.3,-5,4,"end"],Paris:[531.2,318.1,-5,-4,"end"],Nancy:[594.1,330.1,-9,-8,"end"],Besançon:[587.8,366.3,5,-4,"start"],Amsterdam:[583.3,235,5,4,"start"]};
const EVT=[[1363,"Philippe le Hardi reçoit le duché de Bourgogne."],[1369,"Il épouse Marguerite de Flandre."],[1383,"Il fonde la chartreuse de Champmol, près de Dijon."],[1384,"Marguerite hérite de la Flandre, de l'Artois et de la Franche-Comté."],[1404,"Mort de Philippe le Hardi : Jean sans Peur devient duc."],[1419,"Jean sans Peur est assassiné : Philippe le Bon devient duc."],[1430,"Le Brabant revient au duc par héritage. Hainaut, Hollande et Zélande suivent en 1433."],[1435,"Par le traité d'Arras, le duc obtient des villes de la Somme."],[1443,"Nicolas Rolin fonde les Hospices de Beaune. Le duc achète le Luxembourg."],[1467,"Mort de Philippe le Bon : Charles le Téméraire devient duc."],[1473,"Charles conquiert la Gueldre ; il occupe la Lorraine en 1475."],[1477,"Charles meurt devant Nancy. Louis XI rattache le duché de Bourgogne au royaume de France."]];
const R={}; let yr=1450, touched=false;
const dukeAt=y=>DUKES.find(d=>y>=d[1]&&y<d[2])||DUKES[3];
const evAt=y=>{ let e=EVT[0]; EVT.forEach(x=>{ if(x[0]<=y) e=x; }); return e; };
const hex=(c,d,f)=>{ const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)); const a=p(c),b=p(d); return "#"+a.map((v,i)=>Math.round(v+(b[i]-v)*f).toString(16).padStart(2,"0")).join(""); };
function star(p,s){ const g=el("g",{},p); el("path",{d:"M0,-12 L3.5,-4 L12,-3 L5.5,3 L7.5,11.5 L0,7 L-7.5,11.5 L-5.5,3 L-12,-3 L-3.5,-4Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":1.4,transform:`scale(${s})`},g); return g; }
// carte : état des zones à l'année y (f = 0..1, bascule 1477)
function zones(a,y,showAll){ const f=a.seg(y,1476.5,1478.5,true); let n=0;
  R.z.forEach((g,i)=>{ const s=Z[i]; const v=showAll?1:a.seg(y,s[1]-.5,s[1]+2,true); a.op(g,v); if(v>=.99) n++; g.pg.setAttribute("fill",hex(s[2],s[7],f)); g.pg.setAttribute("stroke",hex(s[2],s[7],f)); });
  return n; }

Anim.run({
  titre:"Les ducs de Bourgogne et Dijon",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge : une grande principauté, de 1363 à 1477",
  matiere:"histoire", badge:"Histoire", manipDes:4, manipJusqua:4,
  accroche:"Il y a six siècles, Dijon était la capitale d'un État plus vaste que la Bourgogne d'aujourd'hui. Que lui est-il arrivé ?",
  init(a){
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"zoneA6"},defs); el("rect",{x:20,y:20,width:980,height:740,rx:14},cp);
    const map=a.layer("carte"); R.map=map;
    const vp=el("g",{"clip-path":"url(#zoneA6)"},map);
    el("rect",{x:0,y:0,width:1600,height:900,fill:"#DCEBF5"},vp);
    const inner=el("g",{transform:"translate(-1697.4,-807.3) scale(3.9)"},vp); R.inner=inner;
    el("path",{d:E.land,fill:"#F5EFE2",stroke:"#B8AC93","stroke-width":.35},inner);
    const T=(x,y,txt,o,par)=>el("text",Object.assign({x,y,"font-size":5.8,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":1.5,"paint-order":"stroke",text:txt},o||{}),par||inner);
    R.fra=el("g",{},inner); T(492,350,"ROYAUME",{"font-size":6,fill:"#B8AC93","stroke-width":0,"text-anchor":"middle","letter-spacing":.6},R.fra); T(492,357,"DE FRANCE",{"font-size":6,fill:"#B8AC93","stroke-width":0,"text-anchor":"middle","letter-spacing":.6},R.fra);
    R.emp=T(668,350,"EMPIRE",{"font-size":6.5,fill:"#B8AC93","stroke-width":0,"text-anchor":"middle","letter-spacing":.8});
    R.z=Z.map(s=>{ const g=el("g",{},inner); g.pg=el("path",{d:s[3],fill:s[2],"fill-opacity":.62,stroke:s[2],"stroke-width":.9,"stroke-linejoin":"round"},g);
      const t=el("text",{x:s[5][0],y:s[5][1]-(s[4].length-1)*3.4,"text-anchor":s[6],"font-size":5.6,"font-weight":800,fill:"#fff",stroke:"#1E2430","stroke-width":1.6,"paint-order":"stroke"},g);
      s[4].forEach((l,i)=>el("tspan",{x:s[5][0],dy:i?6.4:0,text:l},t)); return g; });
    R.zlab=R.z.map(g=>g.lastChild);
    R.vil={}; Object.keys(VL).forEach(n=>{ const p=VL[n]; const g=el("g",{},inner); el("circle",{cx:p[0],cy:p[1],r:1.7,fill:"#fff",stroke:C.ink,"stroke-width":.7},g); T(p[0]+p[2],p[1]+p[3],n,{"text-anchor":p[4],"font-size":5.8,"font-weight":700},g); R.vil[n]=g; });
    R.dij=star(inner,.42); R.dij.setAttribute("transform","translate(571.3,362.6) scale(.42)"); R.dij.firstChild.setAttribute("transform","scale(1)");
    R.dijR=el("circle",{cx:571.3,cy:362.6,r:5,fill:"none",stroke:"#C0392B","stroke-width":1.3},inner);
    R.dijT=T(571.3+4,362.6+13,"Dijon, capitale",{"text-anchor":"start","font-size":6,fill:"#7A1D12"},inner);
    R.beaR=el("circle",{cx:567,cy:369.7,r:4,fill:"none",stroke:"#2E8B57","stroke-width":1.3},inner);
    R.ar=a.arrow(inner,"M571.3,364 L567.2,368",{color:"#2E8B57",w:1.2,head:3});
    R.arC=[["Nancy",[594.1,330.1]]];
    R.leg=el("g",{},map);
    // flèches 1477
    R.a77=[a.arrow(inner,"M531.2,318.1 C540,335 552,347 566,360",{color:C.fr,w:1.6,head:3.5}),a.arrow(inner,"M601,282 C616,285 632,285 650,282",{color:C.hab,w:1.6,head:3.5})];
    R.t77=[T(520,334,"Louis XI",{"text-anchor":"end","font-size":6,fill:C.fr}),T(623,291,"Habsbourg",{"text-anchor":"middle","font-size":6,fill:"#8A6A00"})];
    R.cross=el("g",{},inner); el("path",{d:"M-4,-7 V7 M-7,-3 H7",stroke:"#C0392B","stroke-width":2.2,"stroke-linecap":"round"},R.cross); R.cross.setAttribute("transform","translate(594.1,330.1)");
    R.nTxt=T(614,317.5,"5 janvier 1477 :",{"text-anchor":"start","font-size":5.6,fill:"#7A1D12"},inner); R.nTxt2=T(614,323.8,"mort de Charles",{"text-anchor":"start","font-size":5.6,fill:"#7A1D12"},inner);
    // ===== panneau =====
    const pan=a.layer("panneau"); R.pan=pan;
    // 1 les ducs
    R.p1=el("g",{},pan); el("text",{x:1300,y:66,"text-anchor":"middle","font-size":32,"font-weight":800,fill:C.ac,text:"Les ducs Valois de Bourgogne"},R.p1);
    R.d1=DUKES.map((d,i)=>{ const g=el("g",{},R.p1); const y=100+i*120; el("rect",{x:1030,y,width:550,height:102,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x:1030,y,width:16,height:102,rx:6,fill:d[3]},g);
      el("path",{d:"M-14,8 L-17,-10 L-7,0 L0,-14 L7,0 L17,-10 L14,8Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":2,transform:`translate(1085,${y+52})`},g);
      el("text",{x:1120,y:y+44,"font-size":28,"font-weight":800,fill:C.ink,text:d[0]},g); el("text",{x:1120,y:y+82,"font-size":26,"font-weight":600,fill:"#4A5468",text:"duc de "+d[1]+" à "+d[2]},g); return g; });
    const n1=el("text",{x:1030,y:620,"font-size":25,"font-weight":700,fill:C.ink},R.p1); a.wrap(n1,"Les Valois sont des princes de la famille du roi de France. En 1363, le roi Jean II donne le duché de Bourgogne à son fils Philippe.",44,1.25);
    // 2 Dijon plan + photos
    R.p2=el("g",{},pan);
    el("rect",{x:1030,y:70,width:550,height:410,rx:14,fill:"#F4EEDF",stroke:"#D6CDB5","stroke-width":3},R.p2);
    el("text",{x:1305,y:106,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ac,text:"Dijon (plan très simplifié)"},R.p2);
    el("ellipse",{cx:1390,cy:260,rx:140,ry:100,fill:"#EDE3CC",stroke:"#8A7656","stroke-width":5,"stroke-dasharray":"14 8"},R.p2);
    el("rect",{x:1352,y:222,width:70,height:50,fill:"#E7DCC8",stroke:"#8A7656","stroke-width":3},R.p2); el("rect",{x:1430,y:205,width:24,height:67,fill:"#E7DCC8",stroke:"#8A7656","stroke-width":3},R.p2); el("path",{d:"M1426,207 L1442,186 L1458,207Z",fill:"#B0492B",stroke:"#6E2914","stroke-width":3},R.p2);
    el("text",{x:1392,y:318,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ink,text:"Palais des ducs"},R.p2);
    el("rect",{x:1075,y:225,width:100,height:56,fill:"#E7DCC8",stroke:"#6B3FA0","stroke-width":4},R.p2); el("path",{d:"M1125,230 V275 M1105,248 H1145",stroke:"#8A7656","stroke-width":4,"stroke-linecap":"round"},R.p2);
    const ch=el("text",{x:1125,y:315,"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#4B2A78"},R.p2); el("tspan",{x:1125,text:"Chartreuse de"},ch); el("tspan",{x:1125,dy:28,text:"Champmol"},ch);
    el("text",{x:1390,y:410,"text-anchor":"middle","font-size":22,fill:"#8A7656",text:"remparts (pointillés)"},R.p2);
    const pn=el("text",{x:1050,y:454,"font-size":22,"font-weight":600,fill:C.ink},R.p2); a.wrap(pn,"Fondée en 1383, la chartreuse est un monastère où sont enterrés les ducs.",42,1.2);
    R.pD=a.photo(pan,{id:"h-a6-palais-ducs-dijon",x:1055,y:520,w:230,h:153,cap:"Palais des ducs",rot:-1.2});
    R.pP=a.photo(pan,{id:"h-a6-puits-de-moise",x:1330,y:520,w:230,h:153,cap:"Puits de Moïse",rot:1.2});
    // 3 acquisitions
    R.p3=el("g",{},pan); el("text",{x:1300,y:62,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ac,text:"Comment l'État grandit"},R.p3);
    const AQ=[["1363","Duché de Bourgogne","donné par le roi",0],["1384","Flandre, Artois, Franche-Comté","héritage (mariage de 1369)",1],["1430-1433","Brabant, Hollande","héritages et achat",3],["1435","Villes de la Somme","traité d'Arras",5],["1443","Luxembourg","achat",6],["1473-1475","Gueldre, Lorraine","conquêtes",7]];
    R.aq=AQ.map(([an,nom,mode,zi],i)=>{ const g=el("g",{},R.p3); const y=88+i*92; el("rect",{x:1030,y,width:550,height:80,rx:12,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x:1030,y,width:16,height:80,rx:6,fill:Z[zi][2]},g);
      el("text",{x:1064,y:y+34,"font-size":26,"font-weight":800,fill:C.ink,text:an+" · "+nom},g); el("text",{x:1064,y:y+66,"font-size":23,fill:"#4A5468",text:mode},g); return g; });
    el("text",{x:1300,y:668,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Un État riche et puissant,"},R.p3); el("text",{x:1300,y:700,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"entre la France et l'Empire."},R.p3);
    // 4 Hospices
    R.p4=el("g",{},pan);
    const rp=el("pattern",{id:"tuilesA6",width:40,height:28,patternUnits:"userSpaceOnUse"},defs);
    [["#B0332A",0,0],["#E0B12A",20,0],["#2E6B3E",10,14],["#3A2A22",30,14]].forEach(([c,x,y])=>el("path",{d:`M${x},${y+14} L${x+10},${y} L${x+20},${y+14} L${x+10},${y+28}Z`,fill:c},rp));
    el("text",{x:1300,y:62,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ac,text:"Les Hospices de Beaune (1443)"},R.p4);
    const cpr=el("clipPath",{id:"roofA6"},defs); R.roofClip=el("rect",{x:1050,y:80,width:500,height:0},cpr);
    el("rect",{x:1070,y:260,width:460,height:110,fill:"#E7DCC8",stroke:"#8A7656","stroke-width":3},R.p4);
    for(let i=0;i<5;i++) el("rect",{x:1100+i*85,y:295,width:36,height:56,rx:16,fill:"#45607A"},R.p4);
    el("path",{d:"M1040,264 L1130,110 L1470,110 L1560,264Z",fill:"#EAD8BC",stroke:"#5A3A1A","stroke-width":3},R.p4);
    R.roof=el("path",{d:"M1040,264 L1130,110 L1470,110 L1560,264Z",fill:"url(#tuilesA6)","clip-path":"url(#roofA6)",stroke:"#5A3A1A","stroke-width":3},R.p4);
    R.roofT=el("g",{},R.p4); el("text",{x:1300,y:402,"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#7A1D12",text:"toit en tuiles vernissées colorées"},R.roofT);
    const rt=el("text",{x:1050,y:450,"font-size":24,"font-weight":700,fill:C.ink},R.p4); a.wrap(rt,"Fondés en 1443 par Nicolas Rolin, chancelier du duc Philippe le Bon, et sa femme Guigone de Salins, pour soigner les pauvres malades.",44,1.25);
    R.pH=a.photo(pan,{id:"h-a6-hospices-beaune",x:1260,y:545,w:225,h:150,cap:"Les Hospices de Beaune",rot:1});
    // 5 manip
    R.p5=el("g",{},pan);
    el("rect",{x:1030,y:70,width:550,height:690,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.p5);
    R.yBig=el("text",{x:1060,y:150,"font-size":72,"font-weight":800,fill:C.ac},R.p5);
    R.dkBar=el("rect",{x:1060,y:178,width:490,height:12,rx:6},R.p5);
    R.dkName=el("text",{x:1060,y:236,"font-size":34,"font-weight":800,fill:C.ink},R.p5); R.dkSub=el("text",{x:1060,y:274,"font-size":24,fill:"#4A5468"},R.p5);
    R.evT=el("text",{x:1060,y:326,"font-size":25,"font-weight":700,fill:C.ink},R.p5);
    R.rows=Z.map((z,i)=>{ const g=el("g",{},R.p5); el("circle",{cx:1072,cy:410+i*29,r:9,fill:z[2]},g); el("text",{x:1092,y:418+i*29,"font-size":23,"font-weight":600,fill:C.ink,text:["Duché de Bourgogne","Franche-Comté","Flandre, Artois","Brabant, Hainaut","Hollande, Zélande","Picardie","Luxembourg","Gueldre","Lorraine"][i]+" · "+z[1]},g); g.dot=g.firstChild; return g; });
    R.nter=el("text",{x:1060,y:690,"font-size":26,"font-weight":800,fill:C.ink},R.p5); R.nSch=el("text",{x:1060,y:722,"font-size":22,fill:"#4A5468",text:"(schéma : contours simplifiés)"},R.p5);
    a.manip.innerHTML=`Année : <input type="range" id="mY" min="1363" max="1480" step="1" value="1450"> <b id="mYv">1450</b> &nbsp; <button data-y="1363">1363</button><button data-y="1384">1384</button><button data-y="1435">1435</button><button data-y="1467">1467</button><button data-y="1477">1477</button>`;
    const gid=id=>document.getElementById(id);
    gid("mY").oninput=e=>{ yr=+e.target.value; touched=true; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ yr=+b.dataset.y; touched=true; gid("mY").value=yr; a.redraw(); });
    // 6 : 1477
    R.p6=el("g",{},pan);
    const c6=(y,col,tt,tx,h)=>{ const g=el("g",{},R.p6); el("rect",{x:1030,y,width:550,height:h,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x:1030,y,width:16,height:h,rx:6,fill:col},g); el("text",{x:1064,y:y+40,"font-size":27,"font-weight":800,fill:C.ink,text:tt},g); const t=el("text",{x:1064,y:y+76,"font-size":24,"font-weight":600,fill:C.ink},g); a.wrap(t,tx,40,1.22); return g; };
    R.c6=[c6(70,C.fr,"Le duché revient au roi","Charles n'a pas de fils. Le roi Louis XI rattache le duché de Bourgogne au royaume de France.",190),c6(280,C.hab,"Le reste passe aux Habsbourg","Marie, fille de Charles, épouse Maximilien de Habsbourg : les Pays-Bas bourguignons quittent la France.",190),c6(490,C.gr,"Une date à retenir : 1678","La Franche-Comté ne devient française qu'en 1678.",130)];
    // ===== synthèse =====
    const sy=a.layer("synthese"); R.sy=sy;
    R.myth=a.myth(sy,60,60,720,"La Bourgogne a toujours fait partie de la France, comme aujourd'hui.","Au Moyen Âge, la Bourgogne est une principauté très puissante, dirigée par ses propres ducs. Le duché n'est rattaché au royaume de France qu'en 1477, et la Franche-Comté en 1678.");
    el("text",{x:850,y:96,"font-size":30,"font-weight":800,fill:C.ac,text:"À retenir"},sy);
    R.syP=["Les ducs Valois (1363-1477) font de Dijon un centre de pouvoir et d'art : palais, chartreuse de Champmol, Hospices de Beaune.","Par héritages, achats et conquêtes, leur État s'étend jusqu'aux Pays-Bas.","En 1477, Charles le Téméraire meurt : le duché revient au roi de France, le reste passe aux Habsbourg."].map((p,i)=>{ const g=el("g",{},sy); const y=130+i*190; el("circle",{cx:880,cy:y+30,r:24,fill:C.ac},g); el("text",{x:880,y:y+40,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:925,y:y+24,"font-size":29,"font-weight":600,fill:C.ink},g); a.wrap(t,p,38,1.25); return g; });
    R.fr=a.frise(a.svg,{x:120,y:842,w:1360,debut:1355,fin:1485,ticks:[1360,1380,1400,1420,1440,1460,1480],periodes:DUKES.map(d=>({a:d[1],b:d[2],nom:d[0]==="Charles le Téméraire"?"Charles":d[0]==="Philippe le Hardi"?"Philippe le Hardi":d[0],color:d[3]})),events:[{id:"e1363",d:1363,label:"1363",color:C.ac},{id:"e1384",d:1384,label:"1384 Flandre",color:"#2563A8"},{id:"e1443",d:1443,label:"1443 Hospices",color:"#2E8B57"},{id:"e1467",d:1467,label:"1467",color:"#C0392B"},{id:"e1477",d:1477,label:"1477 fin",color:"#1E2430"}]});
  },
  reset(a){
    [R.map,R.pan,R.p1,R.p2,R.p3,R.p4,R.p5,R.p6,R.pD,R.pP,R.pH,R.sy,R.myth,R.fr,R.dij,R.dijR,R.dijT,R.beaR,R.ar,R.cross,R.nTxt,R.nTxt2,R.roofT,...R.a77,...R.t77,...R.z,...R.d1,...R.aq,...R.rows,...R.c6,...Object.values(R.vil),...R.syP].forEach(e=>a.op(e,0));
    a.op(R.map,1); a.op(R.fr,1); Object.values(R.fr.events).forEach(e=>a.op(e,0)); R.fr.at(1363,""); a.op(R.fra,1); a.op(R.emp,1);
    R.z.forEach(g=>g.pg.setAttribute("fill-opacity",.62)); R.roofClip.setAttribute("height",0); a.cls(R.dijR,"pulse",false);
  },
  etapes:[
  { titre:"1363 : un duché pour un prince", duree:10000,
    legende:"En 1363, le roi de France Jean II donne le duché de Bourgogne à son fils Philippe le Hardi. Commence la lignée des ducs Valois, qui règnent jusqu'en 1477. Leur capitale est Dijon.",
    voix:"En mille trois cent soixante-trois, le roi de France, Jean deux, donne le duché de Bourgogne à son plus jeune fils, Philippe, qu'on appellera le Hardi. C'est le début de la lignée des ducs Valois de Bourgogne : quatre ducs se succèdent, jusqu'en mille quatre cent soixante-dix-sept. Leur ville principale est Dijon.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); R.fr.at(a.lerp(1363,1363,0),""); a.op(R.fr.events.e1363,s(t,.2,.3));
      zones(a,1363,false); a.op(R.z[0],s(t,.1,.35)); a.op(R.dij,s(t,.3,.45)); a.op(R.dijT,s(t,.35,.5)); a.op(R.vil.Paris,s(t,.4,.55)); a.op(R.vil.Dijon,0);
      a.op(R.pan,1); a.op(R.p1,s(t,.25,.4)); R.d1.forEach((g,i)=>{ const v=s(t,.3+i*.15,.45+i*.15); a.op(g,v); a.tr(g,(1-v)*60,0); }); } },
  { titre:"Dijon, une capitale", duree:11000,
    legende:"Les ducs font de Dijon une capitale digne d'un roi : le palais des ducs au centre de la ville, et, en 1383, la chartreuse de Champmol, où ils seront enterrés. On y voit le Puits de Moïse.",
    voix:"Les ducs veulent une capitale digne d'un roi. À Dijon, ils habitent le palais des ducs, au centre de la ville. En mille trois cent quatre-vingt-trois, Philippe le Hardi fonde la chartreuse de Champmol, juste à l'extérieur des remparts : un monastère où les ducs seront enterrés. On peut encore y voir le Puits de Moïse, un chef-d'œuvre de sculpture.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); zones(a,1363,false); a.op(R.z[0],1); a.op(R.dij,1); a.op(R.dijT,1); a.op(R.vil.Paris,1); R.fr.at(1383,""); a.op(R.fr.cursor,0); a.op(R.fr.events.e1363,1);
      a.op(R.p1,1-s(t,0,.1)); R.d1.forEach(g=>a.op(g,0)); a.cls(R.dijR,"pulse",t>.3); a.op(R.dijR,s(t,.1,.2)); a.op(R.pan,1); a.op(R.p2,s(t,.05,.2)); a.op(R.pD,s(t,.55,.75)); a.op(R.pP,s(t,.7,.9)); } },
  { titre:"L'État bourguignon grandit", duree:14000,
    legende:"Par héritages, achats et conquêtes, le duc règne sur de plus en plus de territoires : la Flandre et la Franche-Comté en 1384, puis le Brabant, la Hollande, le Luxembourg… jusqu'aux Pays-Bas.",
    voix:"Au fil des années, les ducs agrandissent leur État. En mille trois cent quatre-vingt-quatre, Philippe le Hardi hérite, par son mariage, de la Flandre, de l'Artois et de la Franche-Comté. Puis Philippe le Bon ajoute le Brabant, le Hainaut, la Hollande, des villes de la Somme et le Luxembourg. Charles le Téméraire conquiert encore la Gueldre et occupe la Lorraine. L'État bourguignon s'étend de la Bourgogne jusqu'à la mer du Nord.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.p2,1-s(t,0,.08)); a.op(R.pD,1-s(t,0,.08)); a.op(R.pP,1-s(t,0,.08)); a.op(R.dijR,0); a.cls(R.dijR,"pulse",false);
      const y=a.lerp(1363,1477,s(t,.05,.93,true)); zones(a,y,false); a.op(R.dij,1); a.op(R.dijT,1-s(t,0,.1)); ["Dijon","Bruxelles","Paris","Lille"].forEach(n=>a.op(R.vil[n],n==="Dijon"?0:s(t,.1,.2)));
      R.fr.at(y,""); [["e1363",1363],["e1384",1384],["e1443",1443],["e1467",1467],["e1477",1477]].forEach(([id,d])=>a.op(R.fr.events[id],y>=d-1?1:0));
      a.op(R.p3,s(t,.04,.12)); R.aq.forEach((g,i)=>{ const st=[0,1363,1384,1430,1435,1443,1473].map(v=>v); const yy=[1363,1384,1430,1435,1443,1473][i]; a.op(g,a.seg(y,yy-3,yy+3,true)); }); } },
  { titre:"1443 : les Hospices de Beaune", duree:11000,
    legende:"À Beaune, à 40 km de Dijon, Nicolas Rolin, chancelier du duc Philippe le Bon, fonde en 1443 les Hospices pour soigner les pauvres malades. Leur toit est couvert de tuiles vernissées colorées.",
    voix:"À Beaune, à une quarantaine de kilomètres de Dijon, Nicolas Rolin, le chancelier du duc Philippe le Bon, fonde en mille quatre cent quarante-trois les Hospices, pour soigner gratuitement les pauvres malades. Regarde le toit : il est couvert de tuiles vernissées, brillantes et colorées, qui forment des dessins géométriques. C'est l'un des monuments les plus célèbres de Bourgogne.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); zones(a,1445,false); a.op(R.zlab[0],0); a.op(R.fr.cursor,0); a.op(R.dij,1); a.op(R.dijT,0); ["Dijon","Bruxelles","Paris","Lille"].forEach(n=>a.op(R.vil[n],n==="Dijon"?0:1)); R.fr.at(1443,""); [["e1363",1363],["e1384",1384],["e1443",1443]].forEach(([id])=>a.op(R.fr.events[id],1));
      a.op(R.p3,1-s(t,0,.1)); R.aq.forEach(g=>a.op(g,0)); a.op(R.vil.Dijon,s(t,0,.1)); a.op(R.vil.Beaune,s(t,.1,.2)); a.op(R.beaR,s(t,.1,.2)); a.cls(R.beaR,"pulse",t>.3); a.op(R.ar,s(t,.15,.3)); a.draw(R.ar.path,s(t,.15,.3));
      a.op(R.p4,s(t,.1,.2)); R.roofClip.setAttribute("height",160*s(t,.25,.7,true)); a.op(R.roof,s(t,.22,.3)); a.op(R.roofT,s(t,.7,.85)); a.op(R.pH,s(t,.8,.95)); } },
  { titre:"À vous : choisissez l'année", duree:7000,
    legende:"À vous : déplacez le curseur d'année, de 1363 à 1480. Regardez l'État bourguignon grandir, qui est duc cette année-là, et ce qui se passe en 1477.",
    voix:"À vous de jouer. Déplacez le curseur pour choisir une année, de mille trois cent soixante-trois à mille quatre cent quatre-vingts. Regardez l'État bourguignon grandir, repérez le duc de l'année, et observez ce qui se passe en mille quatre cent soixante-dix-sept. Prenez votre temps, puis continuez.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.p4,1-s(t,0,.1)); a.op(R.pH,1-s(t,0,.1)); a.op(R.pan,1); a.op(R.p5,s(t,0,.15)); a.op(R.beaR,0); a.op(R.ar,0); a.op(R.vil.Beaune,0);
      let y; if(touched) y=yr; else { y=Math.round(a.lerp(1363,1450,s(t,.1,.85))); const sl=document.getElementById("mY"); if(sl) sl.value=y; }
      const yv=document.getElementById("mYv"); if(yv) yv.textContent=y;
      const n=zones(a,y,false); const d=dukeAt(y); const after=y>=1477;
      a.op(R.dij,1); a.op(R.dijT,0); ["Dijon","Bruxelles","Paris","Lille"].forEach(nn=>a.op(R.vil[nn],1)); a.op(R.vil.Dijon,0);
      R.yBig.textContent=y; R.dkBar.setAttribute("fill",after?C.gr:d[3]); R.dkName.textContent=after?"Plus de duc Valois":d[0]; R.dkName.setAttribute("fill",after?C.gr:d[3]); R.dkSub.textContent=after?"L'État bourguignon est partagé.":"duc de "+d[1]+" à "+d[2];
      R.evT.textContent=""; a.wrap(R.evT,evAt(y)[1],37,1.2); R.nter.textContent=after?"Duché de Bourgogne : royaume de France":"Territoires réunis : "+n+" sur "+Z.length;
      R.rows.forEach((g,i)=>{ a.op(g,.18+.82*a.seg(y,Z[i][1]-.5,Z[i][1]+2,true)); g.dot.setAttribute("fill",hex(Z[i][2],Z[i][7],a.seg(y,1476.5,1478.5,true))); }); a.op(R.cross,y>=1477?1:0); a.op(R.nTxt,y>=1477?1:0); a.op(R.nTxt2,y>=1477?1:0); a.op(R.vil.Nancy,y>=1473?1:0);
      R.fr.at(y,""); Object.keys(R.fr.events).forEach(id=>a.op(R.fr.events[id],1)); } },
  { titre:"1477 : la mort de Charles le Téméraire", duree:12000,
    legende:"Le 5 janvier 1477, Charles le Téméraire meurt devant Nancy. Le roi Louis XI rattache le duché de Bourgogne à la France ; les Pays-Bas passent aux Habsbourg. Le grand État disparaît.",
    voix:"Le cinq janvier mille quatre cent soixante-dix-sept, Charles le Téméraire meurt devant Nancy, pendant une bataille. Il n'a pas de fils. Le roi de France, Louis onze, rattache le duché de Bourgogne à son royaume. La fille de Charles, Marie, épouse Maximilien de Habsbourg, et les Pays-Bas bourguignons quittent la France. Le grand État bourguignon disparaît. La Franche-Comté, elle, ne deviendra française qu'en seize cent soixante-dix-huit.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.p5,1-s(t,0,.1)); a.op(R.pan,1); a.op(R.dij,1); a.op(R.dijT,0); ["Bruxelles","Paris","Lille","Nancy"].forEach(n=>a.op(R.vil[n],1));
      const y=a.lerp(1475,1478,s(t,.2,.7,true)); zones(a,y,false); R.z.forEach(g=>a.op(g,1)); const f=a.seg(y,1476.5,1478.5,true); R.z.forEach((g,i)=>{ g.pg.setAttribute("fill",hex(Z[i][2],Z[i][7],f)); g.pg.setAttribute("stroke",hex(Z[i][2],Z[i][7],f)); });
      a.op(R.cross,s(t,.05,.2)); a.op(R.nTxt,s(t,.1,.25)); a.op(R.nTxt2,s(t,.1,.25)); a.cls(R.cross,"pulse",t>.2&&t<.45);
      R.a77.forEach((g,i)=>{ const v=s(t,.5+i*.15,.7+i*.15); a.op(g,v); a.draw(g.path,v); a.op(R.t77[i],s(t,.62+i*.15,.75+i*.15)); });
      R.fr.at(1477,""); Object.keys(R.fr.events).forEach(id=>a.op(R.fr.events[id],1));
      a.op(R.p6,1); R.c6.forEach((g,i)=>{ const v=s(t,.25+i*.22,.4+i*.22); a.op(g,v); a.tr(g,(1-v)*60,0); }); } },
  { titre:"Idée fausse et synthèse", duree:12000,
    legende:"Non, la Bourgogne n'a pas toujours fait partie de la France comme aujourd'hui : c'était une principauté puissante, rattachée en 1477 (la Franche-Comté en 1678).",
    voix:"Retenons l'essentiel. Une idée fausse : la Bourgogne aurait toujours fait partie de la France, comme aujourd'hui. En réalité, au Moyen Âge, c'est une principauté très puissante, dirigée par ses propres ducs. Le duché n'est rattaché au royaume de France qu'en mille quatre cent soixante-dix-sept, et la Franche-Comté en seize cent soixante-dix-huit. Les ducs Valois ont fait de Dijon un grand centre de pouvoir et d'art : le palais, la chartreuse de Champmol, les Hospices de Beaune.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.12)); a.op(R.pan,1-s(t,0,.12)); a.op(R.fr,1); a.op(R.sy,1); a.op(R.myth,s(t,.1,.25)); a.cls(R.myth.faux,"pulse",t>.25&&t<.4);
      R.syP.forEach((g,i)=>{ const v=s(t,.35+i*.17,.5+i*.17); a.op(g,v); a.tr(g,(1-v)*50,0); }); Object.keys(R.fr.events).forEach(id=>a.op(R.fr.events[id],1)); R.fr.at(1477,""); a.op(R.fr.cursor,0); } },
  ]
});
})();
