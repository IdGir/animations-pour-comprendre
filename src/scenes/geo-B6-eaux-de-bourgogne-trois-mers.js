/* META {"id":"geo-B6-eaux-de-bourgogne-trois-mers","matiere":"geographie","annee":"B","periode":1,"theme":"Découper, mesurer, se déplacer dans les territoires","resume":"Selon l'endroit où elle tombe en Bourgogne, une goutte de pluie rejoint la Manche (Seine), l'Atlantique (Loire) ou la Méditerranée (Saône puis Rhône).","motsCles":["ligne de partage des eaux","bassin versant","Seine","Loire","Saône","Rhône","Morvan","Bourgogne","fleuve"]} */
//@data france
(function(){
const F=FRANCE, R={}; let sel=4, touched=false, prog=0, loopTok=0;
const C={sei:"#2563A8",loi:"#1C8A6B",rho:"#C2570C",ink:"#1E2430",grey:"#4A5468",div:"#6B3F12",sea:"#D6E8F4"};
// points (coordonnées de la carte de France, 700×700)
const PT={srcSeine:[446.5,269],chatillon:[439.1,243.9],barSeine:[429.6,227],troyes:[416.2,214.2],nogent:[389.7,201.4],montereau:[364.8,209],melun:[351.7,198],paris:[337.8,176.1],mantes:[308.7,166.8],vernon:[299,159.8],rouen:[282.5,135.5],caudebec:[266.2,129.6],havre:[242.5,132.9],
autun:[427.7,306.3],toulon:[421,327.6],digoin:[413.2,338.7],bourbonL:[403.2,329.2],decize:[388.1,315],nevers:[374.5,304.1],briare:[355.1,259.6],orleans:[316.6,241.5],blois:[290.1,262.2],tours:[260.2,275.2],saumur:[224.7,282.8],angers:[203,267.6],nantes:[155.9,282.3],stnaz:[126.1,276.3],
dijon:[461.6,280.3],stjean:[472.2,295.1],chalon:[453.7,317.4],tournus:[456.8,332.4],macon:[453.5,349.6],villefr:[448.8,371.6],lyon:[454.4,387.2],vienne:[456.7,403.5],valence:[458.6,443.8],montel:[452.4,469.3],avignon:[455.7,511],arles:[447.8,529.6],rhmouth:[459.2,551.3],
viomenil:[508.9,232.2],gray:[486.8,270.7],auxonne:[477.6,288.7],auxerre:[393.3,248.6],sens:[379.8,221.3],parayLM:[419.8,340.6],cluny:[445.3,341.5],meilly:[439,288.8],
dv1:[449.4,273.7],dv2:[456.9,259.9],langres:[474,243],dv3:[490.7,236.3],dv4:[508.8,228.8],ds1:[427.5,292.6],ds2:[413.7,303.1],ds3:[394.9,289.6],ds4:[385.6,279.4],ds5:[367.1,265.8],ds6:[344.1,241.8],dl1:[437.1,306.1],dl2:[432.8,330.2],dl3:[431,357.5],dl4:[438.6,384.8],dl5:[441.6,415.5],
tonnerre:[411.6,244.3],migennes:[390.9,237.7],montbard:[428.8,260.5],pouilly:[439,284.9],manche:[150,134],atl:[100,340],med:[477.6,589.2]};
const pts=ids=>ids.map(k=>PT[k]);
const SEINE_T=["melun","paris","mantes","vernon","rouen","caudebec","havre"], LOIRE_T=["bourbonL","decize","nevers","briare","orleans","blois","tours","saumur","angers","nantes","stnaz"], RHONE_T=["macon","villefr","lyon","vienne","valence","montel","avignon","arles","rhmouth"];
const RT={
 seine:{ids:["srcSeine","chatillon","barSeine","troyes","nogent","montereau",...SEINE_T],col:C.sei},
 loire:{ids:["autun","toulon","digoin",...LOIRE_T],col:C.loi},
 rhone:{ids:["dijon","stjean","chalon","tournus",...RHONE_T],col:C.rho},
 yonne:{ids:["auxerre","sens","montereau",...SEINE_T],col:C.sei},
 paray:{ids:["parayLM","digoin",...LOIRE_T],col:C.loi},
 cluny:{ids:["cluny","tournus",...RHONE_T],col:C.rho}};
// points de pluie de la manipulation : [bouton, route, rivières, mer, couleur]
const MAN=[["Source-Seine","seine","la Seine","la Manche",C.sei,"manche"],["Auxerre","yonne","l'Yonne, puis la Seine","la Manche",C.sei,"manche"],["Autun","loire","l'Arroux, puis la Loire","l'océan Atlantique",C.loi,"atl"],["Paray-le-Monial","paray","la Bourbince, puis la Loire","l'océan Atlantique",C.loi,"atl"],["Dijon","rhone","l'Ouche, puis la Saône et le Rhône","la mer Méditerranée",C.rho,"med"],["Cluny","cluny","la Grosne, puis la Saône et le Rhône","la mer Méditerranée",C.rho,"med"]];
const SEAS=[["manche","La Manche",C.sei],["atl","Océan\nAtlantique",C.loi],["med","Mer\nMéditerranée",C.rho]];
const Z0={s:1.05,tx:470-350*1.05,ty:490-350*1.05}, Zb={s:4.2,tx:500-440*4.2,ty:480-285*4.2}, Zm={s:1.45,tx:640-455*1.45,ty:485-370*1.45};
const lz=(A,B,k)=>({s:A.s+(B.s-A.s)*k,tx:A.tx+(B.tx-A.tx)*k,ty:A.ty+(B.ty-A.ty)*k});
const smooth=p=>{ let d=`M${p[0][0]},${p[0][1]}`; for(let i=1;i<p.length-1;i++){ const m=[(p[i][0]+p[i+1][0])/2,(p[i][1]+p[i+1][1])/2]; d+=` Q${p[i][0]},${p[i][1]} ${m[0]},${m[1]}`; } const l=p[p.length-1]; return d+` L${l[0]},${l[1]}`; };
let S={};
const hideAll=a=>{ [R.c1,R.c1b,R.c2,R.c3,R.c4,R.c5,R.c6,R.c7,R.c8,R.myth,...Object.values(R.ph)].forEach(e=>a.op(e,0)); }; // état « de scène » posé par les étapes, appliqué dans after()
Anim.run({
  titre:"Les eaux de Bourgogne : trois mers",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : découper, mesurer, se déplacer dans les territoires",
  matiere:"geographie", badge:"Géographie",
  accroche:"Une goutte de pluie tombe en Bourgogne : jusqu'à quelle mer ira-t-elle ?",
  manipDes:6, manipJusqua:6,
  init(a){
    const {el}=a;
    // ---------- cadre et carte ----------
    const mp=a.layer("map"); R.mp=mp;
    const cp=el("clipPath",{id:"b6clip"},mp); el("rect",{x:40,y:100,width:860,height:770,rx:16},cp);
    el("rect",{x:40,y:100,width:860,height:770,rx:16,fill:C.sea,stroke:"#9FB8CC","stroke-width":3},mp);
    const mg=el("g",{"clip-path":"url(#b6clip)"},mp); R.mi=el("g",{},mg); const mi=R.mi; R.sw=[];
    const reg=(parent,d,fill,stroke,w,extra)=>{ const p=el("path",Object.assign({d,fill,stroke,"stroke-linejoin":"round"},extra||{}),parent); R.sw.push([p,w]); return p; };
    F.regions.forEach(r=>reg(mi,r.d,r.code==="27"?"#FCE3C8":"#F4F1E4","#B8B39C",1.3)); R.bfc=F.regions.find(r=>r.code==="27");
    R.bfcO=reg(mi,R.bfc.d,"none","#E07A1F",3.5,{"stroke-opacity":.9});
    // relief (schéma)
    R.rel=el("g",{},mi); [[412,298,30,22,-30,"Morvan"],[462,252,32,13,38,"Plateau de Langres"]].forEach(([x,y,rx,ry,rot])=>el("ellipse",{cx:x,cy:y,rx,ry,transform:`rotate(${rot} ${x} ${y})`,fill:"#C9B38A","fill-opacity":.45},R.rel));
    // bassins (secteurs, schéma)
    const D1=pts(["meilly","dv1","dv2","langres","dv3","dv4"]), D2=pts(["meilly","ds1","ds2","ds3","ds4","ds5","ds6"]), D3=pts(["meilly","dl1","dl2","dl3","dl4","dl5"]);
    const poly=a=>"M"+a.map(p=>p.join(",")).join(" L")+"Z";
    R.sec=el("g",{},mi); [[[...D1,[580,228.8],[580,150],[320,150],[320,235],...D2.slice(1).reverse()],C.sei],[[...D1,[580,228.8],[580,440],[441.6,440],...D3.slice(1).reverse()],C.rho],[[...D3,[441.6,440],[320,440],[320,242],...D2.slice(1).reverse()],C.loi]].forEach(([p,col])=>el("path",{d:poly(p),fill:col,"fill-opacity":.2,stroke:"none"},R.sec));
    // canal de Bourgogne
    R.cn=reg(mi,smooth(pts(["migennes","tonnerre","montbard","pouilly","dijon","stjean"])),"none","#5A4A3A",3,{"stroke-dasharray":"2 5"});
    // rivières (fines)
    R.rv={}; Object.keys(RT).forEach(k=>{ R.rv[k]=reg(mi,smooth(pts(RT[k].ids)),"none","#7FB6E3",3,{"stroke-linecap":"round"}); });
    R.sau=reg(mi,smooth(pts(["viomenil","gray","auxonne","stjean"])),"none","#7FB6E3",3,{"stroke-linecap":"round"});
    // lignes de partage des eaux
    R.dv=el("g",{},mi); R.dvp=[D1,D2,D3].map(d=>reg(R.dv,smooth(d),"none",C.div,6,{"stroke-linecap":"round"}));
    // trajets (traînées)
    R.tr={}; ["seine","loire","rhone"].forEach(k=>{ R.tr[k]=reg(mi,smooth(pts(RT[k].ids)),"none",RT[k].col,8,{"stroke-linecap":"round","stroke-linejoin":"round"}); });
    R.tm={}; Object.keys(RT).forEach(k=>{ R.tm[k]=reg(mi,smooth(pts(RT[k].ids)),"none",RT[k].col,9,{"stroke-linecap":"round","stroke-linejoin":"round"}); });
    // ---------- calque des étiquettes (hors zoom) ----------
    const lb=a.layer("lab"); R.lb=lb;
    R.seaT=SEAS.map(([k,n,col])=>{ const t=el("text",{"text-anchor":"middle","font-size":28,"font-weight":800,"font-style":"italic",fill:col,stroke:"#fff","stroke-width":6,"paint-order":"stroke"},lb); t._k=k; t._l=n.split("\n"); return t; });
    R.bfcL=el("text",{"text-anchor":"middle","font-size":26,"font-weight":800,fill:"#8A3A00",stroke:"#fff","stroke-width":6,"paint-order":"stroke",text:"Bourgogne-Franche-Comté"},lb);
    // lieux
    R.pl=[["srcSeine","Source-Seine",C.sei,-16,4,"end"],["autun","Autun",C.loi,-16,30,"end"],["dijon","Dijon",C.rho,18,24,"start"]].map(([k,n,col,dx,dy,an])=>{ const g=el("g",{},lb); el("circle",{r:9,fill:col,stroke:"#fff","stroke-width":3},g); el("text",{x:dx,y:dy,"text-anchor":an,"font-size":28,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":6,"paint-order":"stroke",text:n},g); g._k=k; return g; });
    R.rl=[["Morvan",412,298,-52,-10],["Plateau de Langres",480,248,70,-30]].map(([n,x,y,dx,dy])=>{ const t=el("text",{"text-anchor":"middle","font-size":26,"font-weight":700,"font-style":"italic",fill:"#6B5A33",stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:n},lb); t._p=[x,y]; t._o=[dx,dy]; return t; });
    R.bl=[["Bassin de la Seine",[418,252],C.sei],["Bassin de la Loire",[409,322],C.loi],["Bassin du Rhône",[485,300],C.rho]].map(([n,p,col])=>{ const g=el("g",{},lb); a.label(g,0,0,n,{size:24,stroke:col,color:col}); g._p=p; return g; });
    R.dvl=el("g",{},lb); a.label(R.dvl,0,0,"ligne de partage des eaux",{size:24,stroke:C.div,color:C.div});
    R.cnl=el("g",{},lb); a.label(R.cnl,0,0,"canal de Bourgogne",{size:22,stroke:"#5A4A3A",color:"#5A4A3A"});
    // pluie
    R.rain=[["srcSeine",-70],["autun",0],["dijon",70]].map(([k,ox],i)=>{ const g=el("g",{},lb); g._k=k; g._ox=ox; const cg=el("g",{transform:`translate(${ox},0) scale(.8)`},g); el("ellipse",{cx:0,cy:-132,rx:62,ry:26,fill:"#8FA3B5",stroke:"#5F7387","stroke-width":3},cg); el("circle",{cx:-30,cy:-148,r:24,fill:"#8FA3B5",stroke:"#5F7387","stroke-width":3},cg); el("circle",{cx:12,cy:-156,r:30,fill:"#8FA3B5",stroke:"#5F7387","stroke-width":3},cg); el("ellipse",{cx:0,cy:-132,rx:60,ry:24,fill:"#8FA3B5"},cg);
      g.d=[0,1,2,3,4].map(j=>el("path",{d:"M0,-12 C8,-2 10,4 0,10 C-10,4 -8,-2 0,-12Z",fill:"#3C8DD9",stroke:"#fff","stroke-width":2},g)); return g; });
    // goutte voyageuse
    R.dr={}; ["seine","loire","rhone","man"].forEach(k=>{ const g=el("g",{},lb); el("path",{d:"M0,-30 C16,-6 20,8 0,20 C-20,8 -16,-6 0,-30Z",fill:"#3C8DD9",stroke:"#fff","stroke-width":3.5},g); el("ellipse",{cx:-5,cy:2,rx:3.5,ry:6,fill:"#fff","fill-opacity":.6,transform:"rotate(20 -5 2)"},g); R.dr[k]=g; });
    // marqueurs cliquables (manipulation)
    R.mk=MAN.map((m,i)=>{ const g=el("g",{style:"cursor:pointer"},lb); g.c=el("circle",{r:14,fill:"#fff",stroke:m[4],"stroke-width":4},g); el("text",{y:7,"text-anchor":"middle","font-size":20,"font-weight":800,fill:C.ink,text:i+1,"pointer-events":"none"},g); g.addEventListener("click",()=>choose(i)); g._k=RT[m[1]].ids[0]; g._o=[[-13,-12],[0,0],[0,0],[-10,6],[13,6],[10,-3]][i]; return g; });
    // ---------- panneau de droite ----------
    const pn=a.layer("panel"); R.pn=pn;
    const card=(x,y,w,h,col,titre,lines,fs)=>{ const g=el("g",{},pn); el("rect",{x,y,width:w,height:h,rx:18,fill:"#fff",stroke:col,"stroke-width":5},g); el("text",{x:x+24,y:y+50,"font-size":32,"font-weight":800,fill:col,text:titre},g); const t=el("text",{x:x+24,y:y+96,"font-size":fs||26,fill:C.ink},g); lines.forEach((l,i)=>el("tspan",{x:x+24,dy:i?(fs||26)*1.38:0,text:l},t)); return g; };
    R.c1=card(940,120,620,300,C.ink,"Où va l'eau de pluie ?",["Une goutte tombe en Bourgogne.","Va-t-elle toujours vers la mer","la plus proche ? Vers le sud ?","Suivons-la !"]);
    R.c1b=el("g",{},pn); SEAS.forEach(([k,n,col],i)=>{ const y=450+i*100; el("rect",{x:940,y,width:620,height:80,rx:14,fill:col,"fill-opacity":.12,stroke:col,"stroke-width":4},R.c1b); el("text",{x:970,y:y+52,"font-size":32,"font-weight":800,fill:col,text:n+" ?"},R.c1b); });
    R.c2=card(940,120,620,270,C.ink,"Trois gouttes, trois endroits",["Source-Seine, en Côte-d'Or","Autun, en Saône-et-Loire","Dijon, en Côte-d'Or","Elles tombent à quelques dizaines de km"]);
    R.c3=card(940,120,620,330,C.div,"La ligne de partage des eaux",["Une ligne de hauteurs qui sépare","les bassins versants : de chaque côté,","l'eau descend la pente dans un sens","différent. Le canal de Bourgogne la","franchit par un tunnel (Pouilly-en-Auxois)."],25);
    R.c4=card(940,120,620,300,C.sei,"La Seine → la Manche",["Elle naît à Source-Seine (Côte-d'Or),","passe à Troyes, Paris, Rouen,","puis se jette dans la Manche.","Longueur : environ 780 km."]);
    R.c5=card(940,120,620,300,C.loi,"La Loire → l'Atlantique",["La goutte d'Autun rejoint l'Arroux,","puis la Loire à Digoin. La Loire passe","à Nevers, Orléans, Tours, Nantes","et se jette dans l'océan Atlantique."]);
    R.c6=card(940,120,620,300,C.rho,"La Saône → la Méditerranée",["La goutte de Dijon rejoint l'Ouche,","puis la Saône. À Lyon, la Saône","se jette dans le Rhône, qui coule","vers la mer Méditerranée."]);
    // manip : liste de points + résultat
    R.c7=el("g",{},pn); R.ml=MAN.map((m,i)=>{ const g=el("g",{style:"cursor:pointer"},R.c7); const y=120+i*64; g.bg=el("rect",{x:940,y,width:620,height:54,rx:12,fill:"#fff",stroke:m[4],"stroke-width":3},g); el("circle",{cx:972,cy:y+27,r:17,fill:"#fff",stroke:m[4],"stroke-width":4},g); el("text",{x:972,y:y+35,"text-anchor":"middle","font-size":22,"font-weight":800,fill:C.ink,text:i+1},g); el("text",{x:1004,y:y+37,"font-size":28,"font-weight":700,fill:C.ink,text:m[0]},g); g.addEventListener("click",()=>choose(i)); return g; });
    R.res=el("g",{},R.c7); R.resR=el("rect",{x:940,y:520,width:620,height:280,rx:18,fill:"#fff","stroke-width":5},R.res); R.resT=el("text",{x:964,y:572,"font-size":32,"font-weight":800},R.res); R.resB=el("text",{x:964,y:622,"font-size":27,fill:C.ink},R.res); R.resM=el("text",{x:964,y:760,"font-size":36,"font-weight":800},R.res);
    // synthèse
    R.c8=el("g",{},pn); [["La Seine","Manche",C.sei],["La Loire","océan Atlantique",C.loi],["La Saône puis le Rhône","mer Méditerranée",C.rho]].forEach(([n,m,col],i)=>{ const y=120+i*92; el("rect",{x:940,y,width:620,height:78,rx:14,fill:col,"fill-opacity":.12,stroke:col,"stroke-width":4},R.c8); el("text",{x:964,y:y+34,"font-size":28,"font-weight":800,fill:col,text:n},R.c8); el("text",{x:964,y:y+66,"font-size":26,fill:C.ink,text:"→ "+m},R.c8); });
    R.c8b=el("text",{x:940,y:430,"font-size":26,"font-weight":700,fill:C.ink},R.c8); a.wrap(R.c8b,"La ligne de partage des eaux décide : selon le côté où tombe la pluie, la mer n'est pas la même.",42,1.3);
    R.myth=el("g",{},pn); a.myth(R.myth,940,520,620,"Les rivières coulent toutes vers le sud, vers la mer la plus proche.","Non : la Seine coule vers le nord-ouest (Manche), la Loire vers l'ouest (Atlantique), la Saône vers le sud. L'eau suit la pente, pas la direction du sud.");
    // photos
    const ph=a.layer("photos");
    R.ph={ morvan:a.photo(ph,{id:"g-b6-morvan",x:960,y:470,w:290,h:190,cap:"Le Morvan (lac des Settons)",rot:-2}), canal:a.photo(ph,{id:"g-b6-canal-bourgogne",x:960,y:500,w:290,h:190,cap:"Le canal de Bourgogne",rot:2}), seine:a.photo(ph,{id:"g-b6-source-seine",x:960,y:470,w:290,h:190,cap:"La source de la Seine",rot:-2}) };
    // manipulation (boutons)
    a.manip.innerHTML=`Point de pluie : ${MAN.map((m,i)=>`<button id="mR${i}"${i===sel?' class="sel"':''}>${i+1} · ${m[0]}</button>`).join("")}`;
    MAN.forEach((m,i)=>{ document.getElementById("mR"+i).onclick=()=>choose(i); });
    R.api=a;
    function choose(i){ sel=i; touched=true; prog=0; MAN.forEach((_,j)=>{ const b=document.getElementById("mR"+j); if(b) b.classList.toggle("sel",j===i); }); const tok=++loopTok, t0=performance.now(); const loop=now=>{ if(tok!==loopTok) return; prog=Math.min(1,(now-t0)/6500); a.redraw(); if(prog<1) requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  },
  reset(a){ S={Z:Z0,seas:0,hi:null,pl:0,rain:0,rl:0,bl:0,dv:0,sec:0,cn:0,bfc:1,rv:0,mk:0,tr:{seine:0,loire:0,rhone:0,man:0},dp:{seine:0,loire:0,rhone:0,man:0},manK:"rhone",rel:0};
    [R.pn,R.c1,R.c1b,R.c2,R.c3,R.c4,R.c5,R.c6,R.c7,R.c8,R.myth,R.res,...Object.values(R.ph)].forEach(e=>a.op(e,0)); },
  after(a,k,t){
    const Z=S.Z, s=Z.s, P=p=>[Z.tx+s*p[0],Z.ty+s*p[1]];
    R.mi.setAttribute("transform",`translate(${Z.tx},${Z.ty})scale(${s})`);
    R.sw.forEach(([p,w])=>p.setAttribute("stroke-width",w/s));
    // couches de la carte
    a.op(R.rel,S.rel); a.op(R.sec,S.sec); a.op(R.cn,S.cn); a.op(R.dv,S.dv); R.dvp.forEach(p=>{ p.setAttribute("stroke-width",(S.dvThin?3.5:6)/s); p.setAttribute("stroke-dasharray",`${14/s} ${9/s}`); });
    Object.keys(R.rv).forEach(kk=>a.op(R.rv[kk],S.rv)); a.op(R.sau,S.rv);
    Object.keys(R.tr).forEach(kk=>{ const v=S.tr[kk]; a.draw(R.tr[kk],v); a.op(R.tr[kk],v>0?1:0); });
    Object.keys(R.tm).forEach(kk=>{ const v=kk===S.manK?S.tr.man:0; a.draw(R.tm[kk],v); a.op(R.tm[kk],v>0?1:0); });
    a.op(R.bfcO,S.bfc);
    // étiquettes
    R.seaT.forEach(t2=>{ const p=P(PT[t2._k]); const fs=S.hi===t2._k?36:28; while(t2.firstChild) t2.removeChild(t2.firstChild); t2._l.forEach((l,i)=>a.el("tspan",{x:p[0],y:p[1]+i*fs*1.15,text:l},t2)); t2.setAttribute("font-size",fs); a.op(t2,S.seas); });
    { const c=P([451,262]); R.bfcL.setAttribute("x",c[0]+40); R.bfcL.setAttribute("y",c[1]-40); a.op(R.bfcL,S.bfcL||0); }
    R.pl.forEach(g=>{ const p=P(PT[g._k]); g.setAttribute("transform",`translate(${p[0]},${p[1]})`); a.op(g,S.pl); });
    R.rl.forEach(t2=>{ const p=P(t2._p); t2.setAttribute("x",p[0]+t2._o[0]); t2.setAttribute("y",p[1]+t2._o[1]); a.op(t2,S.rl); });
    R.bl.forEach(g=>{ const p=P(g._p); g.setAttribute("transform",`translate(${p[0]},${p[1]})`); a.op(g,S.bl); });
    { const p=P([463,252]); R.dvl.setAttribute("transform",`translate(${p[0]+120},${p[1]-95})`); a.op(R.dvl,S.dvl||0); const q=P([415,246]); R.cnl.setAttribute("transform",`translate(${q[0]-110},${q[1]-40})`); a.op(R.cnl,S.cn); }
    // pluie
    R.rain.forEach((g,i)=>{ const p=P(PT[g._k]); g.setAttribute("transform",`translate(${p[0]},${p[1]})`); a.op(g,S.rain>0?1:0); const ph=S.rainT||0; g.d.forEach((d,j)=>{ const f=((ph*3)+j/5)%1; d.setAttribute("transform",`translate(${g._ox*(1-f)+(j-2)*12},${-90+f*90})`); d.setAttribute("opacity",S.rain*(f<.9?1:0)); }); });
    // gouttes voyageuses
    Object.keys(R.dr).forEach(kk=>{ const pth=kk==="man"?R.tm[S.manK]:R.tr[kk], v=S.dp[kk]; if(v>0.0001){ const q=a.along(pth,Math.min(1,v)); const p=P([q.x,q.y]); R.dr[kk].setAttribute("transform",`translate(${p[0]},${p[1]-2})`); a.op(R.dr[kk],1); } else a.op(R.dr[kk],0); });
    // marqueurs
    R.mk.forEach(g=>{ const p=P(PT[g._k]); g.setAttribute("transform",`translate(${p[0]+g._o[0]},${p[1]+g._o[1]})`); a.op(g,S.mk); g.c.setAttribute("r",R.mk.indexOf(g)===sel?19:14); g.c.setAttribute("fill",R.mk.indexOf(g)===sel?"#FFF3B0":"#fff"); });
  },
  etapes:[
  { titre:"Où va la pluie de Bourgogne ?", duree:10000,
    legende:"Il pleut en Bourgogne. Où l'eau de pluie va-t-elle finir ? Vers la mer la plus proche ? Vers le sud ? Il y a trois destinations possibles : la Manche, l'Atlantique et la Méditerranée.",
    voix:"Il pleut en Bourgogne. Où va cette eau de pluie ? Vers la mer la plus proche ? Vers le sud ? Pour l'eau de Bourgogne, trois destinations sont possibles : la Manche au nord, l'océan Atlantique à l'ouest, et la mer Méditerranée au sud. Une goutte tombée en Bourgogne va-t-elle toujours au même endroit ?",
    anim(t,a){ const s=a.seg; hideAll(a); S.Z=Z0; a.op(R.mp,1); S.seas=s(t,.15,.4); S.bfcL=s(t,.05,.2); a.op(R.pn,1); a.op(R.c1,s(t,.3,.45)); a.op(R.c1b,s(t,.5,.65)); } },
  { titre:"Trois gouttes de pluie", duree:11000,
    legende:"Zoomons sur la Bourgogne. Trois gouttes tombent presque au même endroit : à Source-Seine, à Autun et à Dijon. Mais leur voyage va être très différent !",
    voix:"Zoomons sur la Bourgogne. Voici trois gouttes de pluie, qui tombent en des endroits proches : à Source-Seine, en Côte-d'Or, à Autun, en Saône-et-Loire, et à Dijon. Elles tombent à quelques dizaines de kilomètres les unes des autres. Pourtant, leur voyage va être très différent. Autour d'Autun, le Morvan, un massif de hauteurs, reçoit beaucoup de pluie : c'est un vrai château d'eau.",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=lz(Z0,Zb,s(t,0,.3)); S.seas=1-s(t,.1,.3); S.bfcL=1-s(t,0,.1); S.rel=s(t,.3,.45); S.rl=s(t,.35,.5); S.pl=s(t,.35,.5); S.rain=s(t,.45,.6); S.rainT=s(t,.5,1,true)*3; a.op(R.pn,1); a.op(R.c2,s(t,.45,.6)); a.op(R.ph.morvan,s(t,.7,.85)); } },
  { titre:"La ligne de partage des eaux", duree:12000,
    legende:"L'eau suit la pente. Une ligne de hauteurs, la ligne de partage des eaux, sépare trois bassins versants : Seine, Loire, Saône-Rhône. De chaque côté, l'eau coule dans un sens différent.",
    voix:"Pourquoi ces trois voyages différents ? Parce que l'eau descend toujours la pente. En Bourgogne, une ligne de hauteurs, qu'on appelle la ligne de partage des eaux, sépare trois bassins versants. D'un côté, le bassin de la Seine. De l'autre, celui de la Loire. Et à l'est, celui de la Saône et du Rhône. Une goutte tombée d'un côté de la ligne ne rejoint pas la même mer qu'une goutte tombée de l'autre côté. Le canal de Bourgogne traverse cette ligne, par un tunnel, à Pouilly-en-Auxois.",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=Zb; S.rel=1; S.rl=1-s(t,0,.1); S.pl=1; S.rain=1-s(t,0,.15); S.rainT=0; S.dv=s(t,.1,.35); R.dvp.forEach((p,i)=>a.draw(p,s(t,.1+i*.06,.4+i*.06))); S.dvThin=0; S.sec=s(t,.4,.6); S.bl=s(t,.55,.7); S.dvl=s(t,.4,.5); S.cn=s(t,.75,.9); a.op(R.pn,1); a.op(R.c3,s(t,.4,.55)); a.op(R.ph.canal,s(t,.78,.92)); } },
  { titre:"La goutte de Source-Seine : la Manche", duree:12000,
    legende:"La goutte de Source-Seine descend la pente vers le nord-ouest, devient la Seine, traverse Troyes, Paris et Rouen, et arrive dans la Manche : environ 780 km de voyage.",
    voix:"Suivons la goutte tombée à Source-Seine. Elle descend la pente vers le nord-ouest. Elle devient la Seine, qui passe à Troyes, à Paris, à Rouen, puis arrive dans la Manche, près du Havre. La Seine est longue d'environ sept cent quatre-vingts kilomètres.",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=lz(Zb,Zm,s(t,0,.25)); S.rel=1-s(t,0,.25); S.rl=0; S.pl=1-s(t,0,.2); S.rain=0; S.dv=1; S.dvThin=1; S.sec=1-s(t,0,.2); S.bl=1-s(t,0,.2); S.dvl=0; S.cn=1-s(t,0,.2); S.rv=s(t,.1,.3); S.seas=s(t,.2,.35);
      const p=s(t,.3,.92,true); S.tr.seine=p; S.dp.seine=p; S.hi=p>.97?"manche":null; a.op(R.pn,1); a.op(R.c4,s(t,.3,.45)); a.op(R.ph.seine,s(t,.5,.65)); } },
  { titre:"La goutte d'Autun : l'Atlantique", duree:12000,
    legende:"La goutte d'Autun va dans l'autre sens, vers l'ouest : elle rejoint la Loire, qui traverse Nevers, Orléans, Tours, Nantes, et se jette dans l'océan Atlantique.",
    voix:"Maintenant, la goutte tombée près d'Autun. Elle part dans une tout autre direction : vers l'ouest. Elle rejoint une petite rivière, l'Arrou, puis la Loire, à Digouin. La Loire passe à Nevers, à Orléans, à Tours, à Nantes, et se jette dans l'océan Atlantique. C'est le plus long fleuve de France : environ mille kilomètres.",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=Zm; S.rv=1; S.dv=1; S.dvThin=1; S.seas=1; S.tr.seine=1; S.dp.seine=0; const p=s(t,.15,.9,true); S.tr.loire=p; S.dp.loire=p; S.hi=p>.97?"atl":null; a.op(R.pn,1); a.op(R.c5,s(t,.1,.25)); } },
  { titre:"La goutte de Dijon : la Méditerranée", duree:12000,
    legende:"La goutte de Dijon part vers le sud : elle rejoint la Saône, puis le Rhône à Lyon, et arrive dans la mer Méditerranée. Trois gouttes proches, trois mers différentes !",
    voix:"Enfin, la goutte tombée à Dijon. Elle rejoint une rivière, l'Ouche, qui se jette dans la Saône. La Saône coule vers le sud et, à Lyon, elle se jette dans le Rhône. Le Rhône descend jusqu'à la mer Méditerranée. Trois gouttes tombées presque au même endroit ont fini dans trois mers différentes !",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=Zm; S.rv=1; S.dv=1; S.dvThin=1; S.seas=1; S.tr.seine=1; S.tr.loire=1; S.dp.seine=0; S.dp.loire=0; const p=s(t,.15,.9,true); S.tr.rhone=p; S.dp.rhone=p; S.hi=p>.97?"med":null; a.op(R.pn,1); a.op(R.c6,s(t,.1,.25)); } },
  { titre:"À vous : suivez une goutte", duree:10000,
    legende:"À vous : cliquez sur un point de pluie (sur la carte ou avec les boutons) et suivez la goutte jusqu'à la mer. Quelle mer va-t-elle atteindre ?",
    voix:"À vous de jouer ! Cliquez sur un point de pluie, sur la carte ou avec les boutons, et suivez la goutte jusqu'à la mer. Essayez les six points : Source-Seine, Auxerre, Autun, Paray-le-Monial, Dijon et Cluny. Dans quelle mer chaque goutte va-t-elle finir ?",
    anim(t,a){ const s=a.seg; hideAll(a); if(t<.03) touched=false; a.op(R.mp,1); S.Z=Zm; S.rv=1; S.dv=1; S.dvThin=1; S.seas=1; S.tr.seine=0; S.tr.loire=0; S.tr.rhone=0; S.mk=s(t,.05,.2);
      const m=MAN[sel]; S.manK=m[1]; const p=touched?prog:s(t,.3,.9,true); S.tr.man=p; S.dp.man=p; S.hi=p>.97?m[5]:null;
      a.op(R.pn,1); a.op(R.c7,s(t,.05,.2)); R.ml.forEach((g,i)=>g.bg.setAttribute("fill",i===sel?"#FFF3B0":"#fff")); a.op(R.res,s(t,.25,.4));
      R.resR.setAttribute("stroke",m[4]); R.resT.setAttribute("fill",m[4]); R.resT.textContent="Goutte n° "+(sel+1)+" : "+m[0]; R.resB.textContent=""; a.wrap(R.resB,"Elle descend par "+m[2]+".",40,1.3); R.resM.setAttribute("fill",m[4]); R.resM.textContent=p>.97?"→ "+m[3].replace(/^l'/,"L'").replace(/^la /,"La ")+" !":"…"; } },
  { titre:"Synthèse", duree:11000,
    legende:"Selon le côté de la ligne de partage des eaux où elle tombe, une goutte de Bourgogne va vers la Manche, l'Atlantique ou la Méditerranée. L'eau suit la pente, pas le sud.",
    voix:"Pour finir : la ligne de partage des eaux décide du voyage de la goutte. D'un côté, elle va vers la Manche par la Seine. De l'autre, vers l'océan Atlantique par la Loire. Et vers le sud, elle rejoint la Méditerranée par la Saône et le Rhône. L'eau suit la pente, et non la direction du sud !",
    anim(t,a){ const s=a.seg; hideAll(a); a.op(R.mp,1); S.Z=Zm; S.rv=1; S.dv=1; S.dvThin=0; S.seas=1; S.tr.seine=s(t,0,.1); S.tr.loire=s(t,0,.1); S.tr.rhone=s(t,0,.1); S.mk=0; a.op(R.pn,1); a.op(R.c8,s(t,.1,.25)); a.op(R.myth,s(t,.6,.78)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
