/* META {"id":"histoire-A5-croisades","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des rois francs aux … / vie religieuse et savoir","resume":"Les croisades (1095-1291) : l'appel de 1095, les grands itinéraires, la création des États latins du Proche-Orient et des conséquences qui ne sont pas seulement militaires (échanges, produits, savoirs).","motsCles":["croisades","Jérusalem","États latins","Urbain II","Vézelay","commerce","Venise","Gênes","Orient"]} */
//@data europe
(function(){
const E=EUROPE;
const C={sea:"#DCEBF5",land:"#F5EFE2",ac:"#A8431F",ink:"#1E2430",gr:"#2E8B57",bl:"#2563A8",pr:"#7A3E9D",or:"#E07A1F",rd:"#C0392B"};
const el=(...x)=>Anim.H.el(...x);
const V={Clermont:[533,397],"Vézelay":[550,356],Venise:[695,418],"Gênes":[633,442],Marseille:[566,464],"Aigues-Mortes":[545,455],Messine:[756,602],Acre:[1177,678],Damiette:[1119,725],Tunis:[647,636],"Jérusalem":[1187,706],Antioche:[1176,591],"Édesse":[1221,552],Tripoli:[1182,636],Constantinople:[1010,504],"Chypre":[1129,635]};
const CITY={Clermont:[9,6,"start"],"Vézelay":[9,-7,"start"],Venise:[-7,-7,"end"],"Gênes":[-8,-6,"end"],Marseille:[-8,9,"end"],"Aigues-Mortes":[-4,25,"middle"],Messine:[8,-8,"start"],Acre:[-8,-2,"end"],Damiette:[-8,7,"end"],Tunis:[8,15,"start"],"Jérusalem":[-8,10,"end"],Antioche:[-8,-4,"end"],Constantinople:[-8,-10,"end"]};
const RT={c1:[[533,397],[631,363],[691,346],[765,348],[840,430],[898,478],[1010,504],[1026,516],[1048,528],[1093,568],[1176,591],[1182,661],[1187,706]],
 c2:[[550,356],[693,328],[765,348],[840,430],[898,478],[1010,504],[1048,528],[1093,568],[1177,678]],
 c3:[[[550,356],[563,401],[566,464]],[[566,464],[614,466],[660,484],[702,541],[734,572],[756,602]],[[756,602],[817,643],[936,681],[1087,682],[1166,679]]],
 c4:[[695,418],[712,440],[752,480],[812,554],[829,606],[896,647],[948,612],[961,564],[963,536],[992,513],[1010,504]],
 c7:[[545,455],[577,509],[589,550],[624,607],[675,647],[746,671],[853,705],[979,686],[1129,635],[1119,725]],
 c8:[[545,455],[573,511],[610,575],[642,620],[647,636]]};
const TR=[[[1166,679],[1087,682],[936,675],[896,647],[829,606],[812,554],[752,480],[712,440],[695,418]],[[1166,679],[1087,682],[936,681],[817,643],[756,602],[734,572],[702,541],[660,484],[633,442]],[[1119,725],[979,690],[853,705],[746,671],[675,647],[624,607],[589,550],[577,509],[566,464]]];
const CRO=[["c1","1re croisade","1096-1099",C.rd,1096,1099,[1026,516]],["c2","2e croisade","1147-1149",C.or,1147,1149,[1093,568]],["c3","3e croisade","1189-1192",C.bl,1189,1192,[756,602]],["c4","4e croisade","1202-1204",C.pr,1202,1204,[829,606]],["c7","7e croisade","1248-1254",C.gr,1248,1254,[1129,635]],["c8","8e croisade","1270",C.ac,1270,1270,[647,636]]];
const ET=[ // États latins : [nom, début, fin, couleur, points, étiquette [x,y,ancre], ville]
 ["Jérusalem",1099,1291,"#C0392B","1170,726 1195,727 1194,698 1187,670 1173,663 1170,699",[1166,700,"end"],["Royaume de","Jérusalem"]],
 ["Tripoli",1109,1289,"#E07A1F","1173,663 1187,670 1195,647 1191,624 1177,625 1176,644",[1170,642,"end"],["Comté de","Tripoli"]],
 ["Antioche",1098,1268,"#7A3E9D","1177,625 1191,624 1197,603 1186,577 1172,573 1167,583 1172,608",[1163,596,"end"],["Principauté","d'Antioche"]],
 ["Édesse",1098,1144,"#2E8B57","1204,572 1229,570 1242,549 1232,534 1212,537 1200,552",[1198,553,"end"],["Comté","d'Édesse"]]];
const EVT=[[1095,"Au concile de Clermont, le pape Urbain II appelle à partir vers Jérusalem."],[1096,"Les premiers croisés se mettent en route."],[1098,"Les croisés fondent les États latins d'Édesse et d'Antioche."],[1099,"Les croisés prennent Jérusalem, au prix d'une guerre très violente."],[1109,"Le comté de Tripoli est fondé : il y a maintenant quatre États latins."],[1144,"Édesse est reprise par des princes musulmans."],[1146,"À Vézelay, Bernard de Clairvaux prêche la deuxième croisade."],[1147,"Départ de la deuxième croisade."],[1187,"Saladin reprend Jérusalem."],[1189,"Troisième croisade : les rois de France et d'Angleterre partent (de Vézelay en 1190)."],[1204,"Quatrième croisade : les croisés prennent Constantinople, ville chrétienne."],[1229,"Jérusalem revient aux chrétiens par un traité."],[1244,"Jérusalem est de nouveau perdue."],[1248,"Saint Louis part en Égypte (septième croisade)."],[1268,"Antioche tombe aux mains des Mamelouks, des princes musulmans d'Égypte."],[1270,"Saint Louis meurt à Tunis pendant la huitième croisade."],[1289,"Tripoli est conquise par les Mamelouks."],[1291,"Saint-Jean-d'Acre tombe : c'est la fin des États latins."]];
const R={}; let yr=1140, touched=false;
const evAt=y=>{ let e=EVT[0]; EVT.forEach(x=>{ if(x[0]<=y) e=x; }); return e; };
const jerCh=y=>(y>=1099&&y<1187)||(y>=1229&&y<1244);

function smooth(pts){ let d="M"+pts[0][0]+","+pts[0][1]; for(let i=0;i<pts.length-1;i++){ const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
  d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`; } return d; }
function croise(p,s){ const g=el("g",{},p); const k=el("g",{transform:`scale(${s||1})`},g); el("path",{d:"M-7,-9 H7 V2 Q7,9 0,12 Q-7,9 -7,2Z",fill:"#fff",stroke:C.ink,"stroke-width":1.6,"stroke-linejoin":"round"},k); el("path",{d:"M0,-6 V7 M-4,-1 H4",stroke:C.rd,"stroke-width":2.6,"stroke-linecap":"round"},k); return g; }
function goods(p,kind){ const g=el("g",{},p); if(kind===0){ el("path",{d:"M-6,6 Q-8,-2 -3,-6 L3,-6 Q8,-2 6,6Z",fill:"#B07A3A",stroke:C.ink,"stroke-width":1.3},g); el("path",{d:"M-3,-6 L3,-6",stroke:C.ink,"stroke-width":1.6},g); }
  if(kind===1){ el("path",{d:"M-6,6 L0,-8 L6,6Z",fill:"#fff",stroke:C.ink,"stroke-width":1.3},g); }
  if(kind===2){ el("rect",{x:-7,y:-5,width:14,height:11,rx:5,fill:"#C4452C",stroke:C.ink,"stroke-width":1.3},g); el("path",{d:"M-7,0 H7",stroke:"#F2C230","stroke-width":1.5},g); } return g; }
function person(p,col,s){ const g=el("g",{},p); const k=el("g",{transform:`scale(${s||1})`},g); el("path",{d:"M-14,0 L-10,-36 L10,-36 L14,0Z",fill:col,stroke:C.ink,"stroke-width":2.2,"stroke-linejoin":"round"},k); el("circle",{cx:0,cy:-46,r:10,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.2},k); return g; }

Anim.run({
  titre:"Les croisades",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge : l'Occident et l'Orient (1095-1291)",
  matiere:"histoire", badge:"Histoire", manipDes:4, manipJusqua:4,
  accroche:"Pourquoi des chevaliers et des pèlerins sont-ils partis vers Jérusalem ? Qu'est-ce que cela a changé ?",
  init(a){
    const defs=el("defs",{},a.svg);
    const cp=el("clipPath",{id:"zoneA5"},defs); el("rect",{x:20,y:20,width:980,height:740,rx:14},cp);
    const map=a.layer("carte"); R.map=map;
    const vp=el("g",{"clip-path":"url(#zoneA5)"},map);
    el("rect",{x:0,y:0,width:1600,height:900,fill:C.sea},vp);
    const inner=el("g",{transform:"translate(-604.5,-321.6) scale(1.33)"},vp); R.inner=inner;
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":.8},inner);
    const T=(x,y,txt,o,par)=>el("text",Object.assign({x,y,"font-size":17,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":4,"paint-order":"stroke",text:txt},o||{}),par||inner);
    R.reg=[T(640,318,"Occident chrétien",{"text-anchor":"middle",fill:"#2F5DA8","font-size":17}),T(950,458,"Empire byzantin",{"text-anchor":"middle",fill:C.pr,"font-size":17})];
    // routes
    R.rt={}; R.len={};
    ["c1","c2","c4","c7","c8"].forEach(k=>{ const col=CRO.find(c=>c[0]===k)[3]; R.rt[k]=[el("path",{d:smooth(RT[k]),fill:"none",stroke:col,"stroke-width":5,"stroke-linecap":"round","stroke-linejoin":"round"},inner)]; });
    R.rt.c3=RT.c3.map(pts=>el("path",{d:smooth(pts),fill:"none",stroke:C.bl,"stroke-width":5,"stroke-linecap":"round","stroke-linejoin":"round"},inner));
    // routes commerciales (étape 6)
    R.tr=TR.map(pts=>el("path",{d:smooth(pts),fill:"none",stroke:"#6B4A2B","stroke-width":3.5,"stroke-linecap":"round","stroke-dasharray":"2 9"},inner));
    R.gd=[]; TR.forEach((_,i)=>[0,1,2].forEach(k=>{ R.gd.push({i,k,g:goods(inner,k)}); }));
    // villes
    R.city={}; Object.keys(CITY).forEach(n=>{ const p=V[n], l=CITY[n]; const g=el("g",{},inner); el("circle",{cx:p[0],cy:p[1],r:4.6,fill:"#fff",stroke:C.ink,"stroke-width":2},g); T(p[0]+l[0],p[1]+l[1],n,{"text-anchor":l[2]},g); R.city[n]=g; });
    // Jérusalem en étoile
    R.jer=el("g",{},inner); el("path",{d:"M0,-12 L3.5,-4 L12,-3 L5.5,3 L7.5,11.5 L0,7 L-7.5,11.5 L-5.5,3 L-12,-3 L-3.5,-4Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":1.6},R.jer); R.jer.setAttribute("transform",`translate(${V["Jérusalem"][0]},${V["Jérusalem"][1]})`);
    R.pulse=el("circle",{cx:V.Clermont[0],cy:V.Clermont[1],r:12,fill:"none",stroke:C.rd,"stroke-width":3},inner);
    R.appel=T(V.Clermont[0]+9,V.Clermont[1]+26,"1095 : l'appel du pape",{"text-anchor":"start","font-size":17},inner);
    // têtes de colonne + pastilles
    R.head=croise(inner,1.5);
    R.badge=CRO.map(c=>{ const g=el("g",{},inner); g.setAttribute("transform",`translate(${c[6][0]},${c[6][1]})`); el("circle",{r:11,fill:c[3],stroke:"#fff","stroke-width":2.4},g); el("text",{y:6,"text-anchor":"middle","font-size":15,"font-weight":800,fill:"#fff",text:c[1][0]},g); return g; });
    // légende marchandises
    R.leg=el("g",{},map); el("rect",{x:40,y:690,width:850,height:56,rx:10,fill:"#fff",stroke:"#D6DBE4","stroke-width":2,opacity:.95},R.leg);
    el("text",{x:58,y:726,"font-size":24,"font-weight":700,fill:"#4A5468",text:"Produits d'Orient (exemples) :"},R.leg);
    [["épices",0,440],["sucre",1,610],["tissus",2,740]].forEach(([n,k,x])=>{ const g=goods(R.leg,k); g.setAttribute("transform",`translate(${x},718) scale(1.9)`); el("text",{x:x+28,y:726,"font-size":24,"font-weight":700,fill:C.ink,text:n},R.leg); });
    // ===== encart Proche-Orient =====
    const ins=a.layer("inset"); R.ins=ins;
    const cpi=el("clipPath",{id:"insetA5"},defs); el("rect",{x:1040,y:70,width:540,height:400,rx:12},cpi);
    el("text",{x:1310,y:52,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.ac,text:"Zoom : le Proche-Orient (schéma simplifié)"},ins);
    const ig=el("g",{"clip-path":"url(#insetA5)"},ins);
    el("rect",{x:1040,y:70,width:540,height:400,fill:C.sea},ig);
    const ii=el("g",{transform:"translate(-1438.5,-1179) scale(2.3)"},ig);
    el("path",{d:E.land,fill:C.land,stroke:"#B8AC93","stroke-width":.6},ii);
    { const mt=el("text",{x:1112,y:660,"text-anchor":"middle","font-size":9.6,"font-style":"italic",fill:"#6F96B8"},ii); el("tspan",{x:1112,text:"Mer"},mt); el("tspan",{x:1112,dy:11,text:"Méditerranée"},mt); }
    R.st=ET.map(s=>{ const g=el("g",{},ii); const pg=el("polygon",{points:s[4],fill:s[3],"fill-opacity":.6,stroke:s[3],"stroke-width":1.4,"stroke-linejoin":"round"},g);
      const t=el("text",{x:s[5][0],y:s[5][1],"text-anchor":s[5][2],"font-size":9.6,"font-weight":800,fill:s[3],stroke:"#fff","stroke-width":2.4,"paint-order":"stroke"},g); el("tspan",{x:s[5][0],text:s[6][0]},t); el("tspan",{x:s[5][0],dy:11,text:s[6][1]},t); g.pg=pg; g.t=t; g.s=s; return g; });
    R.ic={}; [["Jérusalem",1187,706,5,"start"],["Acre",1177,678,5,"start"],["Tripoli",1182,636,5,"start"],["Antioche",1176,591,5,"start"],["Édesse",1221,552,5,"start"]].forEach(([n,x,y,dy,an])=>{ const g=el("g",{},ii); const c=el("circle",{cx:x,cy:y,r:3.6,fill:"#fff",stroke:C.ink,"stroke-width":1.6},g); el("text",{x:x+6,y:y+dy,"text-anchor":an,"font-size":9.6,"font-weight":700,fill:C.ink,stroke:"#fff","stroke-width":2.4,"paint-order":"stroke",text:n},g); g.c=c; R.ic[n]=g; });
    el("rect",{x:1040,y:70,width:540,height:400,rx:12,fill:"none",stroke:"#B8C6D4","stroke-width":3},ins);
    R.insTxt=el("text",{x:1310,y:500,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink},ins);
    R.jTxt=el("text",{x:1310,y:534,"text-anchor":"middle","font-size":24,"font-weight":700},ins);
    // ===== panneau =====
    const pan=a.layer("panneau"); R.pan=pan;
    const card=(parent,x,y,w,h,col,titre,txt,n)=>{ const g=el("g",{},parent); el("rect",{x,y,width:w,height:h,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},g); el("rect",{x,y,width:14,height:h,rx:5,fill:col},g); el("text",{x:x+36,y:y+42,"font-size":28,"font-weight":800,fill:col===C.gr?"#14532D":C.ink,text:titre},g); const t=el("text",{x:x+36,y:y+78,"font-size":25,"font-weight":600,fill:C.ink},g); a.wrap(t,txt,n||34,1.2); return g; };
    R.p1=[card(pan,1040,70,540,150,C.rd,"1095 : l'appel de Clermont","Le pape Urbain II appelle les chrétiens d'Occident à partir vers Jérusalem."),
          card(pan,1040,250,540,150,C.or,"Jérusalem, ville sainte","Importante pour les chrétiens, les juifs et les musulmans."),
          card(pan,1040,430,540,150,C.pr,"Une demande d'aide","L'empereur byzantin voulait de l'aide contre les Turcs seldjoukides.")];
    R.p2=el("g",{},pan); el("text",{x:1060,y:80,"font-size":32,"font-weight":800,fill:C.rd,text:"1re croisade (1096-1099)"},R.p2);
    R.b2=["Chevaliers, soldats et pèlerins partent, avec une croix sur leurs vêtements.","Ils traversent l'Europe, puis l'Empire byzantin, puis la Turquie actuelle.","En juillet 1099, ils prennent Jérusalem : la guerre est très violente."].map((s,i)=>{ const g=el("g",{},R.p2); const y=130+i*140; el("circle",{cx:1075,cy:y+24,r:22,fill:C.rd},g); el("text",{x:1075,y:y+33,"text-anchor":"middle","font-size":26,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:1115,y:y+22,"font-size":27,"font-weight":600,fill:C.ink},g); a.wrap(t,s,31,1.25); return g; });
    R.p3=el("g",{},pan);
    R.pV=a.photo(pan,{id:"h-a4-vezelay-basilique",x:1140,y:80,w:300,h:200,cap:"Vézelay (Yonne)",rot:-1});
    const v1=el("text",{x:1050,y:400,"font-size":24,"font-weight":700,fill:C.ink},R.p3); a.wrap(v1,"1146 : Bernard de Clairvaux y prêche la 2e croisade. 1190 : Philippe Auguste et Richard Cœur de Lion en partent pour la 3e.",42,1.25);
    R.rows=CRO.map((c,i)=>{ const g=el("g",{},R.p3); const y=505+i*43; el("circle",{cx:1062,cy:y+12,r:15,fill:c[3]},g); el("text",{x:1062,y:y+19,"text-anchor":"middle","font-size":20,"font-weight":800,fill:"#fff",text:c[1][0]},g); el("text",{x:1090,y:y+20,"font-size":24,"font-weight":700,fill:C.ink,text:c[1]+" : "+c[2]},g); return g; });
    R.p4=el("g",{},pan); const t4=el("text",{x:1050,y:515,"font-size":24,"font-weight":700,fill:C.ink},R.p4); a.wrap(t4,"Les croisés fondent des États « latins » : Édesse et Antioche (1098), Jérusalem (1099), Tripoli (1109).",42,1.25);
    R.pK=a.photo(pan,{id:"h-a5-krak-chevaliers",x:70,y:440,w:300,h:200,cap:"Krak des Chevaliers (Syrie)",rot:1});
    R.p5=el("g",{},pan); el("rect",{x:1040,y:560,width:540,height:240,rx:14,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.p5);
    R.yBig=el("text",{x:1075,y:640,"font-size":64,"font-weight":800,fill:C.ac},R.p5); R.yTxt=el("text",{x:1075,y:690,"font-size":25,"font-weight":600,fill:C.ink},R.p5);
    a.manip.innerHTML=`Année : <input type="range" id="mY" min="1095" max="1291" step="1" value="1140"> <b id="mYv">1140</b> &nbsp; <button data-y="1099">1099</button><button data-y="1147">1147</button><button data-y="1187">1187</button><button data-y="1204">1204</button><button data-y="1270">1270</button><button data-y="1291">1291</button>`;
    const gid=id=>document.getElementById(id);
    gid("mY").oninput=e=>{ yr=+e.target.value; touched=true; a.redraw(); };
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ yr=+b.dataset.y; touched=true; gid("mY").value=yr; a.redraw(); });
    // étape 6
    R.p6=el("g",{},pan);
    R.c6=[card(R.p6,1040,70,540,250,C.rd,"Conséquences militaires","États latins ; ordres militaires (Templiers, Hospitaliers) ; grands châteaux, comme le Krak des Chevaliers.",35),
          card(R.p6,1040,350,540,420,C.gr,"Mais aussi des échanges","Le commerce se développe, avec Venise, Gênes et Marseille. Des produits d'Orient arrivent en Europe : épices, sucre, tissus. Des idées et des savoirs circulent.",35)];
    // ===== synthèse =====
    const sy=a.layer("synthese"); R.sy=sy;
    R.myth=a.myth(sy,60,60,720,"Les croisades n'ont eu que des conséquences militaires.","Elles ont aussi développé le commerce, fait circuler des produits (épices, sucre, tissus) et des savoirs, et changé les relations entre l'Occident et l'Orient.");
    el("text",{x:850,y:96,"font-size":30,"font-weight":800,fill:C.ac,text:"À retenir"},sy);
    R.syP=["En 1095, le pape appelle les chrétiens d'Occident à partir vers Jérusalem : c'est le début des croisades, qui durent jusqu'en 1291.","Les croisés fondent des États latins au Proche-Orient. Ils tombent peu à peu : en 1291, Saint-Jean-d'Acre est perdue.","Ce sont des guerres violentes, mais aussi des contacts : commerce, produits et savoirs circulent."].map((p,i)=>{ const g=el("g",{},sy); const y=130+i*190; el("circle",{cx:880,cy:y+30,r:24,fill:C.ac},g); el("text",{x:880,y:y+40,"text-anchor":"middle","font-size":28,"font-weight":800,fill:"#fff",text:String(i+1)},g); const t=el("text",{x:925,y:y+24,"font-size":29,"font-weight":600,fill:C.ink},g); a.wrap(t,p,38,1.25); return g; });
    R.fr=a.frise(a.svg,{x:120,y:842,w:1360,debut:1080,fin:1310,ticks:[1100,1150,1200,1250,1300],events:[{id:"e1095",d:1095,label:"1095 l'appel",color:C.rd},{id:"e1099",d:1099,label:"1099 Jérusalem prise",color:C.rd,up:true},{id:"e1187",d:1187,label:"1187 Jérusalem perdue",color:C.bl},{id:"e1204",d:1204,label:"1204 Constantinople",color:C.pr,up:true},{id:"e1270",d:1270,label:"1270 Tunis",color:C.ac},{id:"e1291",d:1291,label:"1291 Acre",color:"#555",up:true}]});
  },
  reset(a){
    const all=[R.map,R.ins,R.pan,R.p1[0],R.p1[1],R.p1[2],R.p2,R.p3,R.p4,R.p5,R.p6,R.pV,R.pK,R.sy,R.myth,R.fr,R.pulse,R.appel,R.jer,R.head,R.leg,...R.reg,...Object.values(R.city),...Object.values(R.rt).flat(),...R.tr,...R.gd.map(g=>g.g),...R.badge,...R.b2,...R.rows,...R.c6,...R.syP];
    all.forEach(e=>a.op(e,0)); a.op(R.map,1); a.op(R.fr,1); Object.values(R.fr.events).forEach(e=>a.op(e,0)); R.fr.at(1095,"");
    Object.values(R.rt).flat().forEach(p=>{ p.setAttribute("stroke-width",5); });
  },
  etapes:[
  { titre:"1095 : l'appel de Clermont", duree:10000,
    legende:"En 1095, à Clermont, le pape Urbain II appelle les chrétiens d'Occident à partir vers Jérusalem, une ville sainte pour les chrétiens, les juifs et les musulmans. Ce sont les croisades.",
    voix:"En l'an mille quatre-vingt-quinze, à Clermont, en Auvergne, le pape Urbain deux appelle les chrétiens d'Occident à partir vers Jérusalem. Jérusalem est une ville sainte pour les chrétiens, mais aussi pour les juifs et les musulmans. L'empereur byzantin, à Constantinople, avait aussi demandé de l'aide contre les Turcs. C'est le début de ce qu'on appellera les croisades.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.reg[0],s(t,.1,.25)); a.op(R.reg[1],s(t,.55,.7)); a.op(R.city.Clermont,s(t,.15,.3)); a.op(R.pulse,s(t,.2,.3)); a.cls(R.pulse,"pulse",t>.3); a.op(R.appel,s(t,.25,.4));
      a.op(R.city.Constantinople,s(t,.55,.7)); a.op(R.jer,s(t,.4,.55)); a.op(R.city["Jérusalem"],s(t,.4,.55)); a.op(R.fr.events.e1095,s(t,.2,.3)); R.fr.at(1095,"");
      R.p1.forEach((g,i)=>{ const v=s(t,.2+i*.22,.4+i*.22); a.op(g,v); a.tr(g,(1-v)*60,0); }); a.op(R.pan,1); } },
  { titre:"1096-1099 : la première croisade", duree:11000,
    legende:"Des chevaliers, des soldats et des pèlerins marchent des mois à travers l'Europe et la Turquie actuelle. En juillet 1099, ils prennent Jérusalem. Cette guerre est très violente.",
    voix:"La première croisade part en mille quatre-vingt-seize. Chevaliers, soldats et pèlerins portent une croix sur leurs vêtements : c'est pour cela qu'on les appelle les croisés. Ils marchent des mois à travers l'Europe, passent par Constantinople, traversent la Turquie actuelle, puis arrivent à Jérusalem. Ils la prennent en juillet mille quatre-vingt-dix-neuf. Cette guerre est très violente.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.reg[0],1-s(t,0,.15)); a.op(R.reg[1],1-s(t,0,.15)); a.op(R.appel,1-s(t,0,.1)); a.cls(R.pulse,"pulse",false); a.op(R.pulse,1-s(t,0,.1));
      a.op(R.city.Clermont,1); a.op(R.city.Constantinople,1); a.op(R.jer,1); a.op(R.city["Jérusalem"],1); R.p1.forEach(g=>a.op(g,1-s(t,0,.1))); a.op(R.fr.events.e1095,1);
      const u=s(t,.1,.88,true); const p=R.rt.c1[0]; a.op(p,1); a.draw(p,u); const q=a.along(p,u); a.op(R.head,s(t,.05,.12)*(1-s(t,.92,.98))); a.tr(R.head,q.x,q.y-10);
      a.op(R.badge[0],s(t,.35,.45)); a.op(R.p2,s(t,.05,.15)); R.b2.forEach((g,i)=>a.op(g,s(t,.1+i*.3,.25+i*.3)));
      R.fr.at(a.lerp(1095,1099,u),""); a.op(R.fr.events.e1099,s(t,.88,.96)); } },
  { titre:"1147-1270 : d'autres croisades", duree:13000,
    legende:"Il y aura d'autres croisades, par terre ou par mer : en 1146, Bernard de Clairvaux prêche la deuxième à Vézelay. Elles partent aussi de Marseille, de Venise ou d'Aigues-Mortes.",
    voix:"Les croisés ne reprendront pas Jérusalem définitivement, et d'autres croisades suivent. En mille cent quarante-six, à Vézelé, en Bourgogne, Bernard de Clairvaux prêche la deuxième croisade. La troisième part aussi de Vézelé, en mille cent quatre-vingt-dix. La quatrième part de Venise. Saint Louis, roi de France, part d'Aigues-Mortes, vers l'Égypte puis vers Tunis. Au total, on compte huit croisades principales.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.p2,1-s(t,0,.08)); R.b2.forEach(g=>a.op(g,0)); a.op(R.jer,1); a.op(R.fr.events.e1095,1); a.op(R.fr.events.e1099,1);
      const p1=R.rt.c1[0]; a.op(p1,.35); a.draw(p1,1); p1.setAttribute("stroke-width",3.5); a.op(R.badge[0],1);
      Object.keys(R.city).forEach(n=>a.op(R.city[n],["Clermont","Constantinople","Jérusalem"].includes(n)?1:0));
      const order=["c2","c3","c4","c7","c8"], wnd=[[.04,.22],[.22,.4],[.4,.56],[.56,.76],[.76,.92]];
      let head=null;
      order.forEach((k,i)=>{ const paths=R.rt[k]; paths.forEach(p=>{ if(!p._len) p._len=p.getTotalLength(); }); const T=paths.reduce((x,p)=>x+p._len,0); const u=s(t,wnd[i][0],wnd[i][1],true); let before=0;
        paths.forEach(p=>{ const local=Math.max(0,Math.min(1,(u*T-before)/p._len)); a.op(p,u>0?.95:0); a.draw(p,local); if(local>0&&local<1) head=a.along(p,local); before+=p._len; });
        a.op(R.badge[CRO.findIndex(c=>c[0]===k)],s(t,wnd[i][1]-.04,wnd[i][1])); });
      a.op(R.head,head?1:0); if(head) a.tr(R.head,head.x,head.y-10);
      const cityOn={c2:["Vézelay"],c3:["Vézelay","Messine","Acre"],c4:["Venise"],c7:["Aigues-Mortes","Damiette"],c8:["Tunis"]};
      order.forEach((k,i)=>{ if(t>=wnd[i][0]) cityOn[k].forEach(n=>a.op(R.city[n],1)); });
      a.op(R.p3,s(t,.04,.14)); a.op(R.pV,s(t,.06,.2)); R.rows.forEach((g,i)=>{ const st=i===0?0:wnd[i-1][0]; a.op(g,i===0?1:s(t,st,st+.08)); });
      const yv=a.lerp(1099,1270,s(t,.04,.92)); R.fr.at(yv,""); ["e1187","e1204","e1270"].forEach((id,i)=>a.op(R.fr.events[id],s(t,[.3,.5,.9][i],[.38,.58,.97][i]))); } },
  { titre:"Les États latins", duree:11000,
    legende:"En Orient, les croisés fondent des États « latins » : Édesse et Antioche (1098), Jérusalem (1099), Tripoli (1109). Ils y construisent de grands châteaux.",
    voix:"En Orient, les croisés fondent des États qu'on appelle États latins. Édesse et Antioche en mille quatre-vingt-dix-huit, le royaume de Jérusalem en mille quatre-vingt-dix-neuf, puis le comté de Tripoli en mille cent neuf. Ils construisent de grands châteaux, comme le Krak des Chevaliers, en Syrie.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); R.fr.at(1109,"");
      Object.keys(R.city).forEach(n=>a.op(R.city[n],["Clermont","Constantinople","Jérusalem","Acre","Antioche"].includes(n)?s(t,0,.1):0)); a.op(R.jer,1);
      Object.values(R.rt).flat().forEach(p=>{ a.op(p,.18); a.draw(p,1); p.setAttribute("stroke-width",3.5); }); R.badge.forEach(b=>a.op(b,0)); a.op(R.head,0);
      a.op(R.p3,1-s(t,0,.1)); a.op(R.pV,1-s(t,0,.1)); R.rows.forEach(g=>a.op(g,0));
      a.op(R.ins,s(t,.05,.2)); [0,1,2,3].forEach(i=>{ const j=[3,2,0,1][i]; const g=R.st[j]; const v=s(t,.25+i*.15,.4+i*.15); a.op(g,v); g.pg.setAttribute("fill-opacity",.6); });
      ["Jérusalem","Acre","Tripoli","Antioche","Édesse"].forEach(n=>a.op(R.ic[n],s(t,.2,.35))); R.ic["Jérusalem"].c.setAttribute("fill","#fff");
      R.insTxt.textContent=""; R.jTxt.textContent=""; a.op(R.p4,s(t,.7,.85)); a.op(R.pK,s(t,.78,.95)); ["e1099","e1187"].forEach((id,i)=>a.op(R.fr.events[id],1)); a.op(R.fr.events.e1095,1); a.op(R.fr.events.e1204,1); a.op(R.fr.events.e1270,1); } },
  { titre:"À vous : choisissez l'année", duree:7000,
    legende:"À vous : déplacez le curseur ou touchez une année. Quels États latins existent ? Qui tient Jérusalem ? Que se passe-t-il cette année-là ? Regardez la frise.",
    voix:"À vous de jouer. Déplacez le curseur pour choisir une année entre mille quatre-vingt-quinze et mille deux cent quatre-vingt-onze. Regardez quels États latins existent, qui tient Jérusalem, et ce qui se passe cette année-là. Prenez votre temps, puis continuez.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.pan,1); a.op(R.p4,1-s(t,0,.1)); a.op(R.pK,1-s(t,0,.1)); a.op(R.p5,s(t,0,.15)); a.op(R.ins,1); a.op(R.jer,1);
      let y; if(touched) y=yr; else { y=Math.round(a.lerp(1095,1140,s(t,.1,.85))); const sl=document.getElementById("mY"); if(sl) sl.value=y; }
      const yv=document.getElementById("mYv"); if(yv) yv.textContent=y;
      Object.keys(R.city).forEach(n=>a.op(R.city[n],["Clermont","Constantinople","Jérusalem","Acre","Antioche"].includes(n)?1:0));
      R.st.forEach(g=>{ const s0=g.s; const on=y>=s0[1], over=y>s0[2]; a.op(g,on?1:0); g.pg.setAttribute("fill",over?"#9AA3B5":s0[3]); g.pg.setAttribute("stroke",over?"#6B7385":s0[3]); g.pg.setAttribute("fill-opacity",over?.35:.6); g.t.setAttribute("fill",over?"#6B7385":s0[3]); });
      const n=ET.filter(e=>y>=e[1]&&y<=e[2]).length; R.insTxt.textContent=n+" État"+(n>1?"s":"")+" latin"+(n>1?"s":"")+" en "+y; a.op(R.ic["Jérusalem"],1); a.op(R.ic.Acre,1); a.op(R.ic.Tripoli,1); a.op(R.ic.Antioche,1); a.op(R.ic["Édesse"],1);
      const ch=jerCh(y); R.jTxt.textContent="Jérusalem : "+(y<1099?"tenue par des princes musulmans":ch?"aux mains des croisés":"tenue par des princes musulmans"); R.jTxt.setAttribute("fill",ch?"#C0392B":"#4A5468"); R.ic["Jérusalem"].c.setAttribute("fill",ch?"#C0392B":"#fff");
      R.yBig.textContent=y; R.yTxt.textContent=""; a.wrap(R.yTxt,evAt(y)[1],40,1.25); R.yTxt.setAttribute("y",690);
      let act=null; CRO.forEach(c=>{ if(y>=c[4]&&y<=c[5]) act=c[0]; });
      Object.keys(R.rt).forEach(k=>R.rt[k].forEach(p=>{ a.op(p,k===act?1:.15); a.draw(p,1); p.setAttribute("stroke-width",k===act?7:3.5); }));
      R.badge.forEach((b,i)=>a.op(b,1)); a.op(R.city.Clermont,1); a.op(R.city.Constantinople,1);
      ["Vézelay","Venise","Aigues-Mortes","Marseille","Tunis","Damiette","Messine"].forEach(n=>a.op(R.city[n],0));
      R.fr.at(y,""); ["e1095","e1099","e1187","e1204","e1270","e1291"].forEach(id=>a.op(R.fr.events[id],1)); } },
  { titre:"Les conséquences : aussi des échanges", duree:12000,
    legende:"Les croisades ont des conséquences militaires, mais aussi des échanges : le commerce de Venise, de Gênes et de Marseille se développe, et des produits d'Orient arrivent en Europe.",
    voix:"Les croisades ont des conséquences militaires : des États latins, des ordres de moines soldats, de grands châteaux. Mais elles ont aussi développé les échanges. Des bateaux relient l'Orient à Venise, à Gênes et à Marseille. Ils rapportent des épices, du sucre, des tissus. Des idées et des savoirs circulent aussi entre l'Orient et l'Occident.",
    anim(t,a){ const s=a.seg; a.op(R.map,1); a.op(R.fr,1); a.op(R.ins,1-s(t,0,.12)); a.op(R.p5,1-s(t,0,.12)); a.op(R.pan,1); a.op(R.p6,s(t,.05,.2)); a.op(R.jer,1);
      Object.values(R.rt).flat().forEach(p=>{ a.op(p,.14); a.draw(p,1); p.setAttribute("stroke-width",3.5); }); R.badge.forEach(b=>a.op(b,0));
      ["Clermont","Jérusalem","Constantinople","Antioche"].forEach(n=>a.op(R.city[n],0)); ["Acre","Damiette","Venise","Gênes","Marseille"].forEach(n=>a.op(R.city[n],s(t,.1,.25))); a.op(R.jer,s(t,.1,.25)===0?1:1);
      R.c6.forEach((g,i)=>{ a.op(g,s(t,.1+i*.25,.25+i*.25)); }); R.tr.forEach(p=>{ a.op(p,s(t,.2,.3)); p.style.strokeDasharray="2 9"; p.style.strokeDashoffset=0; p.style.display=t<.2?"none":""; }); a.op(R.leg,s(t,.25,.35));
      R.gd.forEach(g=>{ const p=R.tr[g.i]; if(!p._len) p._len=p.getTotalLength(); const f=((t-.25)*1.8+g.k*.14+g.i*.05)%1; const on=t>.25&&f>=0; const q=a.along(p,Math.max(0,Math.min(1,f))); a.op(g.g,on?1:0); a.tr(g.g,q.x,q.y-2,1.3); });
      R.fr.at(1291,""); ["e1095","e1099","e1187","e1204","e1270","e1291"].forEach(id=>a.op(R.fr.events[id],1)); } },
  { titre:"Idée fausse et synthèse", duree:11000,
    legende:"Non, les croisades n'ont pas eu que des conséquences militaires : elles ont aussi fait circuler des produits, des idées et des savoirs entre l'Orient et l'Occident.",
    voix:"Retenons l'essentiel. Une idée fausse : les croisades n'auraient eu que des conséquences militaires. En réalité, elles ont aussi développé le commerce, fait circuler des produits comme les épices, le sucre et les tissus, ainsi que des savoirs. À partir de mille quatre-vingt-quinze, des chrétiens d'Occident partent vers Jérusalem. Ils fondent des États latins, qui tombent peu à peu : en mille deux cent quatre-vingt-onze, Saint-Jean-d'Acre est perdue. Ce sont des guerres violentes, mais aussi des contacts entre l'Orient et l'Occident.",
    anim(t,a){ const s=a.seg; a.op(R.map,1-s(t,0,.12)); a.op(R.pan,1-s(t,0,.12)); a.op(R.fr,1); a.op(R.sy,1); a.op(R.myth,s(t,.1,.25)); a.cls(R.myth.faux,"pulse",t>.25&&t<.4);
      R.syP.forEach((g,i)=>{ const v=s(t,.35+i*.17,.5+i*.17); a.op(g,v); a.tr(g,(1-v)*50,0); }); ["e1095","e1099","e1187","e1204","e1270","e1291"].forEach(id=>a.op(R.fr.events[id],1)); R.fr.at(1291,""); a.op(R.fr.cursor,0); } },
  ]
});
})();
