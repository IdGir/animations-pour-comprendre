/* META {"id":"histoire-C4-guerre-cent-ans-jeanne-arc","matiere":"histoire","annee":"connexe","periode":1,"theme":"connexe","resume":"La guerre de Cent Ans (1337-1453) : 116 ans mais pas sans arrêt, le royaume partagé de 1429, Jeanne d'Arc (Orléans, Reims, Compiègne, Rouen) et la reconquête jusqu'à Castillon (manipulation : un curseur d'année qui fait évoluer la carte).","motsCles":["guerre de Cent Ans","Jeanne d'Arc","Orléans","Reims","Charles VII","Édouard III","Azincourt","Castillon","trêve","royaume partagé","Moyen Âge"]} */
//@data france1429
(function(){
const F=FRANCE1429, V=F.villes;
const C={ink:"#1E2430",paper:"#FBF6EE",sea:"#DCEBF5",land:"#F5EFE2",fr:"#2F6DB5",ang:"#C0392B",bg:"#7B4FA3",or:"#E07A1F",ok:"#2E8B57",gray:"#4A5468"};
let R={}, a0, YEAR=1429;
const L=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// projection latitude / longitude -> repère de la carte (ajustement quadratique sur les villes de la carte)
const KX=[169.127078,97.011904,5.40358,-0.96034,0.004736,-0.033827], KY=[3913.168494,1.921017,-73.825272,-0.010518,-0.324004,-0.02406];
const LL=(la,lo)=>{ const q=[1,lo,la,lo*la,lo*lo,la*la]; return [q.reduce((s,v,i)=>s+v*KX[i],0), q.reduce((s,v,i)=>s+v*KY[i],0)]; };
const PD=pts=>"M"+pts.map(p=>LL(p[0],p[1]).map(v=>v.toFixed(1)).join(" ")).join("L")+"Z";
const PT={Vaucouleurs:LL(48.6,5.667),Blois:LL(47.586,1.335),Patay:LL(48.05,1.69),Beaurevoir:LL(49.99,3.2),Crotoy:LL(50.22,1.62)};
// vues de la carte : s = échelle, (cx,cy) point de la carte placé en (tx,ty) à l'écran
const ZA={s:1,cx:440,cy:372,tx:465,ty:400}, Z4={s:2.4,cx:505,cy:320,tx:465,ty:400}, Z6={s:3,cx:460,cy:185,tx:465,ty:400};
const PZ=(Z,p)=>[Z.tx+Z.s*(p[0]-Z.cx), Z.ty+Z.s*(p[1]-Z.cy)];
function setZ(Z){ R.inner.setAttribute("transform",`translate(${Z.tx-Z.s*Z.cx},${Z.ty-Z.s*Z.cy}) scale(${Z.s})`); }
// périodes de trêve ou de paix (dates approximatives)
const TRUCES=[[1347,1355],[1360,1369],[1389,1415],[1444,1449]];
const inTruce=y=>TRUCES.some(t=>y>=t[0]&&y<=t[1]);
// événements (pour le curseur d'année)
const EV=[
 [1337,"Philippe VI confisque la Guyenne au roi d'Angleterre."],
 [1340,"Édouard III prend le titre de roi de France."],
 [1346,"Bataille de Crécy : victoire des Anglais."],
 [1347,"Édouard III prend Calais."],
 [1348,"La peste noire frappe le royaume de France."],
 [1356,"Bataille de Poitiers : le roi Jean II est capturé."],
 [1360,"Traité de Brétigny : le roi d'Angleterre reçoit un grand sud-ouest et Calais."],
 [1369,"Charles V reprend la guerre et reconquiert des terres."],
 [1380,"Mort de Charles V : aux Anglais, il reste Calais et la côte de Guyenne."],
 [1396,"Une trêve de 28 ans est signée entre les deux rois."],
 [1415,"Bataille d'Azincourt : grande défaite française."],
 [1418,"Paris est prise par les Bourguignons."],
 [1419,"Le duc de Bourgogne est assassiné : son fils s'allie aux Anglais."],
 [1420,"Traité de Troyes : Henri V d'Angleterre doit hériter du trône de France."],
 [1422,"Mort de Charles VI : Charles VII et Henri VI se disputent la couronne."],
 [1429,"Jeanne d'Arc délivre Orléans (8 mai) ; Charles VII est sacré à Reims (17 juillet)."],
 [1430,"Jeanne d'Arc est capturée devant Compiègne (23 mai)."],
 [1431,"Jeanne d'Arc est brûlée à Rouen (30 mai)."],
 [1435,"Traité d'Arras : le duc de Bourgogne quitte l'alliance anglaise."],
 [1436,"Charles VII reprend Paris."],
 [1444,"Trêve de Tours entre la France et l'Angleterre."],
 [1449,"La guerre reprend : Charles VII attaque la Normandie."],
 [1450,"Bataille de Formigny : la Normandie est reprise."],
 [1451,"Bordeaux et Bayonne se rendent à Charles VII."],
 [1452,"Les Anglais reviennent à Bordeaux (octobre)."],
 [1453,"Castillon (juillet), puis Bordeaux (octobre) : la guerre s'arrête, sans traité. Calais reste anglaise."]];
const LAYERS=()=>[R.fond,R.map,R.band,R.o1,R.o3,R.o4,R.o5,R.o6,R.o7,R.p1,R.p3,R.p4,R.p5,R.p6,R.p7,R.s2,R.myth2,R.s8,R.ph4,R.ph5,R.hi1];
function only(a,...ls){ LAYERS().forEach(e=>a.op(e,0)); ls.forEach(e=>a.op(e,1)); }
function txt(p,x,y,s,o){ o=o||{}; const t=a0.el("text",{x,y,"text-anchor":o.anchor||"middle","font-size":o.size||26,"font-weight":o.weight||800,fill:o.fill||C.ink,stroke:o.stroke===undefined?"#fff":o.stroke,"stroke-width":o.sw||5,"paint-order":"stroke"},p); t.textContent=s; return t; }
function crown(p,x,y,s,col){ const g=a0.el("g",{transform:`translate(${x},${y}) scale(${s})`},p); a0.el("path",{d:"M-26,12 L-30,-14 L-14,-2 L0,-20 L14,-2 L30,-14 L26,12Z",fill:col||"#F2C230",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g); return g; }
function pin(g,Z,p,text,o){ o=o||{}; const q=PZ(Z,p); const gg=a0.el("g",{transform:`translate(${q[0]},${q[1]})`},g);
  a0.el("circle",{r:o.r||9,fill:o.fill||"#fff",stroke:o.stroke||C.ink,"stroke-width":3.5},gg);
  if(text){ text.split("\n").forEach((ln,i)=>{ const t=a0.el("text",{x:o.dx===undefined?16:o.dx,y:(o.dy||0)+8+i*26,"text-anchor":o.anchor||"start","font-size":i?22:(o.size||26),"font-weight":i?700:800,fill:i?(o.c2||C.gray):C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke"},gg); t.textContent=ln; }); }
  return gg; }
function route(g,Z,pts,col,w){ const d="M"+pts.map(p=>PZ(Z,p).map(v=>v.toFixed(1)).join(" ")).join("L"); const gg=a0.el("g",{},g);
  const h=a0.el("path",{d,fill:"none",stroke:"#fff","stroke-width":(w||8)+6,"stroke-linecap":"round","stroke-linejoin":"round"},gg);
  const l=a0.el("path",{d,fill:"none",stroke:col,"stroke-width":w||8,"stroke-linecap":"round","stroke-linejoin":"round"},gg); gg.h=h; gg.l=l; return gg; }
function drawRoute(a,r,t){ a.draw(r.h,t); a.draw(r.l,t); }
function card(p,x,y,w,h,date,text,col,fs){ fs=fs||28; const g=a0.el("g",{},p);
  a0.el("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col,"stroke-width":4},g); a0.el("rect",{x,y,width:14,height:h,rx:7,fill:col},g);
  a0.el("text",{x:x+34,y:y+46,"font-size":36,"font-weight":800,fill:col,text:date},g);
  const t=a0.el("text",{x:x+34,y:y+92,"font-size":fs,"font-weight":600,fill:C.ink},g); a0.wrap(t,text,Math.floor((w-60)/(fs*.52)),1.25); return g; }
function jeanne(p){ const g=a0.el("g",{},p); a0.el("line",{x1:0,y1:0,x2:0,y2:-42,stroke:C.ink,"stroke-width":4,"stroke-linecap":"round"},g); a0.el("path",{d:"M0,-42 L30,-34 L0,-24Z",fill:"#fff",stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"},g); a0.el("circle",{r:14,fill:C.or,stroke:"#fff","stroke-width":4},g); return g; }
// zones de la carte selon l'année
function setState(y,noEncl){
  const ang=(y<=1450||y===1452)?1:0, aq=y<1360?0:(y<=1368?1:clamp(1-(y-1368)/11,0,1)), cal=y>=1347?1:0;
  const nw=y<1417?0:(y<=1435?clamp((y-1416)/3,0,1):0), norm=(y>=1436&&y<=1448)?1:(y===1449?.5:0);
  const bg=(y>=1419&&y<=1434)?1:0, bgp=y>=1435?1:0;
  const o=(e,v)=>{ e.setAttribute("opacity",v); e.style.display=v<=0.001?"none":""; };
  o(R.zAq,aq); o(R.zAng,ang); o(R.zNorm,norm); o(R.zNw,nw); o(R.zBg,bg*Math.max(.001,1)); o(R.zBgp,bgp); o(R.zEncl,(!noEncl&&y>=1419&&y<=1434)?1:0); o(R.zCal,cal);
}
function bandAt(y,big,sub){ a0.tr(R.cur,R.X(y),0); R.bandY.textContent=big; R.bandS.textContent=sub||""; }

Anim.run({
  titre:"La guerre de Cent Ans et Jeanne d'Arc",
  sousTitre:"Histoire · CM1-CM2 · Le Moyen Âge et la fin du Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Une guerre de cent ans, sans jamais s'arrêter ? Et que fait une jeune paysanne au milieu des rois ?",
  manipDes:6, manipJusqua:6,
  init(a){
    a0=a; const {el}=a;
    // ===== fond + carte
    R.fond=a.layer("fond"); el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},R.fond);
    const defs=el("defs",{},a.svg); const cp=el("clipPath",{id:"terreC4"},defs); el("path",{d:F.land},cp);
    const cv=el("clipPath",{id:"vpC4"},defs); el("rect",{x:30,y:30,width:870,height:740,rx:14},cv); a.svg.insertBefore(defs,a.svg.firstChild);
    const map=a.layer("map"); R.map=map; const mc=el("g",{"clip-path":"url(#vpC4)"},map);
    el("rect",{x:-2000,y:-2000,width:6000,height:5000,fill:C.sea},mc);
    R.inner=el("g",{},mc); el("path",{d:F.land,fill:C.land,stroke:"#B8AC93","stroke-width":1.2,"vector-effect":"non-scaling-stroke"},R.inner);
    const zg=el("g",{"clip-path":"url(#terreC4)"},R.inner);
    const zp=(d,fill,op,stroke,extra)=>el("path",Object.assign({d,fill,"fill-opacity":op,stroke:stroke||"#33415C","stroke-width":2,"vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},extra||{}),zg);
    zp(F.zones.FR,"#7FA6E6",.5,"#33518F");
    R.zAq=zp(PD([[47.1,-3],[47.0,0.3],[46.6,1.4],[46.2,2.0],[45.5,2.3],[44.5,3.0],[44.0,3.0],[43.7,2.2],[43.2,1.6],[42.9,0.9],[42.9,-3]]),"#E06A5E",.5,"#8E2A20",{"stroke-dasharray":"7 5"});
    R.zAng=zp(F.zones.ANGG,"#E06A5E",.66,"#8E2A20");
    R.zNorm=zp(PD([[50.3,1.3],[49.8,1.8],[49.3,1.85],[49.0,1.6],[48.75,1.2],[48.6,0.7],[48.4,0.1],[48.4,-0.8],[48.55,-1.5],[48.9,-2.1],[50.3,-2.1]]),"#E06A5E",.66,"#8E2A20");
    R.zNw=zp(F.zones.ANGN,"#E06A5E",.66,"#8E2A20");
    R.zBg=el("g",{},zg); ["BOURGS","BOURGN"].forEach(k=>el("path",{d:F.zones[k],fill:"#A07CC8","fill-opacity":.62,stroke:"#4F2F78","stroke-width":2,"vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},R.zBg));
    R.zBgp=el("g",{},zg); ["BOURGS","BOURGN"].forEach(k=>el("path",{d:F.zones[k],fill:"#C9B8E3","fill-opacity":.4,stroke:"#4F2F78","stroke-width":2,"stroke-dasharray":"8 6","vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},R.zBgp));
    R.zEncl=el("circle",{cx:637.5,cy:272,r:8,fill:"#2F6DB5","fill-opacity":.85,stroke:"#fff","stroke-width":2,"vector-effect":"non-scaling-stroke"},zg);
    R.zCal=el("circle",{cx:V.Calais[0],cy:V.Calais[1],r:7,fill:"#E06A5E","fill-opacity":.9,stroke:"#8E2A20","stroke-width":2,"vector-effect":"non-scaling-stroke"},R.inner);
    R.hi1=el("path",{d:F.zones.ANGG,fill:"none",stroke:C.or,"stroke-width":6,"vector-effect":"non-scaling-stroke","stroke-linejoin":"round"},R.inner);
    el("rect",{x:30,y:30,width:870,height:740,rx:14,fill:"none",stroke:"#B8AC93","stroke-width":3},map);
    txt(map,48,757,"Carte simplifiée",{size:22,anchor:"start",weight:700,fill:C.gray});
    // ===== bande des dates (en bas)
    const bd=a.layer("bande"); R.band=bd; el("rect",{x:0,y:786,width:1600,height:114,fill:"#F7F1E6"},bd); el("line",{x1:0,y1:786,x2:1600,y2:786,stroke:"#B8AC93","stroke-width":3},bd);
    const X=y=>200+(y-1337)/116*1300; R.X=X;
    TRUCES.forEach(t=>el("rect",{x:X(t[0]),y:830,width:X(t[1])-X(t[0]),height:32,rx:5,fill:"#BFE3CD",stroke:"#2E8B57","stroke-width":2},bd));
    el("rect",{x:X(1337),y:840,width:X(1453)-X(1337),height:12,rx:4,fill:"none"},bd); el("line",{x1:X(1337),y1:846,x2:X(1453),y2:846,stroke:C.ink,"stroke-width":4},bd);
    [1337,1350,1375,1400,1425,1453].forEach(y=>{ el("line",{x1:X(y),y1:836,x2:X(y),y2:856,stroke:C.ink,"stroke-width":3},bd); el("text",{x:X(y),y:886,"text-anchor":"middle","font-size":22,fill:C.gray,text:String(y)},bd); });
    el("rect",{x:300,y:797,width:26,height:16,rx:3,fill:"#BFE3CD",stroke:"#2E8B57","stroke-width":2},bd); el("text",{x:336,y:812,"font-size":22,fill:C.gray,text:"trêve ou paix (dates approximatives)"},bd);
    R.bandY=el("text",{x:100,y:840,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.fr},bd); R.bandS=el("text",{x:100,y:872,"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.gray},bd);
    R.cur=el("g",{},bd); el("path",{d:"M0,822 L0,868",stroke:C.ang,"stroke-width":5},R.cur); el("path",{d:"M-13,812 L13,812 L0,828Z",fill:C.ang},R.cur);

    // ===== étape 1 : 1337, deux rois
    R.o1=a.layer("o1"); R.p1=a.layer("p1");
    const lp=PZ(ZA,V.Londres), pp=PZ(ZA,V.Paris), bp=PZ(ZA,V.Bordeaux);
    R.cL=el("g",{},R.o1); crown(R.cL,lp[0],lp[1]-34,1.1,"#F2C230"); pin(R.cL,ZA,V.Londres,null,{fill:C.ang});
    R.cLl=a.label(R.cL,lp[0]-185,lp[1]+4,"Édouard III\nroi d'Angleterre",{size:25,fill:"#fff",stroke:C.ang,w:290,h:84});
    R.cP=el("g",{},R.o1); crown(R.cP,pp[0],pp[1]-34,1.1,"#F2C230"); pin(R.cP,ZA,V.Paris,null,{fill:C.fr});
    R.cPl=a.label(R.cP,pp[0]+175,pp[1]+4,"Philippe VI\nroi de France",{size:25,fill:"#fff",stroke:C.fr,w:270,h:84});
    R.cG=el("g",{},R.o1); pin(R.cG,ZA,V.Bordeaux,null,{fill:C.ang});
    R.cGl=a.label(R.cG,bp[0]+245,bp[1]+62,"La Guyenne : terre tenue par\nle roi d'Angleterre, vassal du roi de France",{size:24,fill:"#FFF1EE",stroke:C.ang,w:540,h:88});
    R.arr1=a.arrow(R.o1,`M${lp[0]+20},${lp[1]+36} C${lp[0]+70},${lp[1]+120} ${pp[0]-80},${pp[1]-100} ${pp[0]-8},${pp[1]-44}`,{color:C.or,w:7,head:4,dash:"14 10"});
    R.c1=[card(R.p1,940,45,630,215,"1337","Philippe VI confisque la Guyenne, que le roi d'Angleterre tenait comme vassal.",C.ang),
          card(R.p1,940,275,630,215,"1340","Édouard III, petit-fils de Philippe le Bel par sa mère, prend le titre de roi de France.",C.or),
          card(R.p1,940,505,630,215,"La guerre","Deux rois veulent la même couronne : c'est le début de la guerre.",C.ink)];

    // ===== étape 2 : frise 1337-1453 et idée fausse
    const g2=a.layer("frise"); R.s2=g2; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},g2);
    txt(g2,800,72,"La guerre de Cent Ans",{size:46,stroke:C.paper});
    R.cnt=txt(g2,800,128,"De 1337 à 1453 : 116 ans",{size:40,fill:C.ang,stroke:C.paper});
    const FX=y=>100+(y-1337)/116*1400, FY=330;
    TRUCES.forEach((t,i)=>{ if(!R.fb) R.fb=[]; R.fb.push(el("rect",{x:FX(t[0]),y:FY-18,width:FX(t[1])-FX(t[0]),height:36,rx:6,fill:"#BFE3CD",stroke:C.ok,"stroke-width":3},g2)); });
    R.fl=el("path",{d:`M${FX(1337)},${FY} L${FX(1453)},${FY}`,stroke:C.ink,"stroke-width":6,"stroke-linecap":"round"},g2);
    [1350,1400,1450].forEach(y=>{ el("line",{x1:FX(y),y1:FY+20,x2:FX(y),y2:FY+34,stroke:C.ink,"stroke-width":3},g2); el("text",{x:FX(y),y:FY+62,"text-anchor":"middle","font-size":22,fill:C.gray,text:String(y)},g2); });
    const EVF=[[1337,"1337","Début",410,"start",C.ink],[1346,"","Crécy 1346",265,"middle",C.ang],[1356,"","Poitiers 1356",205,"middle",C.ang],[1360,"","Brétigny 1360",410,"middle",C.ok],[1415,"","Azincourt 1415",265,"middle",C.ang],[1420,"","Troyes 1420",410,"middle",C.bg],[1429,"","Orléans 1429",205,"middle",C.fr],[1453,"1453","Castillon 1453",265,"end",C.fr]];
    R.fe=EVF.map(e=>{ const g=el("g",{},g2); const x=FX(e[0]); const up=e[3]<FY; el("line",{x1:x,y1:FY,x2:x,y2:up?e[3]+8:e[3]-28,stroke:e[5],"stroke-width":3},g);
      el("circle",{cx:x,cy:FY,r:11,fill:e[5],stroke:"#fff","stroke-width":3},g);
      const t=el("text",{x:e[4]==="start"?x-8:(e[4]==="end"?x+8:x),y:e[3],"text-anchor":e[4],"font-size":26,"font-weight":800,fill:e[5],stroke:C.paper,"stroke-width":6,"paint-order":"stroke"},g); t.textContent=e[2]; return g; });
    el("rect",{x:100,y:476,width:30,height:20,rx:4,fill:"#BFE3CD",stroke:C.ok,"stroke-width":3},g2); el("text",{x:142,y:494,"font-size":24,"font-weight":600,fill:C.gray,text:"périodes de trêve ou de paix (dates approximatives, selon les historiens)"},g2);
    R.myth2=a.layer("myth2"); a.myth(R.myth2,150,545,1300,"« La guerre de Cent Ans, ce sont cent ans de combats sans arrêt. »","Elle dure 116 ans, avec de longues trêves : on se bat par périodes. Le nom « guerre de Cent Ans » a été donné bien plus tard par les historiens.");

    // ===== étape 3 : 1429, un royaume partagé
    R.o3=a.layer("o3"); R.p3=a.layer("p3");
    [["Londres",V.Londres,-16,"end"],["Calais",V.Calais,16,"start"],["Paris",V.Paris,16,"start"],["Rouen",V.Rouen,-16,"end"],["Reims",V.Reims,16,"start"],["Chinon",V.Chinon,-16,"end"],["Bordeaux",V.Bordeaux,-16,"end"]].forEach(c=>pin(R.o3,ZA,c[1],c[0],{dx:c[2],anchor:c[3]}));
    const op3=PZ(ZA,V.Orleans); R.siege=el("g",{},R.o3); el("circle",{cx:op3[0],cy:op3[1],r:28,fill:"none",stroke:C.ang,"stroke-width":6,"stroke-dasharray":"9 7"},R.siege); pin(R.o3,ZA,V.Orleans,"Orléans\nassiégée",{dx:18,dy:-6,c2:C.ang});
    R.zl=[a.label(R.o3,330,285,"Anglais",{size:26,fill:"#fff",stroke:C.ang,w:140,h:48}),a.label(R.o3,665,440,"Bourguignons",{size:26,fill:"#fff",stroke:C.bg,w:210,h:48}),a.label(R.o3,330,655,"Anglais",{size:26,fill:"#fff",stroke:C.ang,w:140,h:48}),a.label(R.o3,570,570,"Charles VII",{size:26,fill:"#fff",stroke:C.fr,w:200,h:48})];
    txt(R.p3,1250,95,"1429",{size:76,fill:C.fr,stroke:C.paper});
    R.lg3=[[C.fr,"#7FA6E6","Fidèle à Charles VII : le centre et le sud"],[C.ang,"#E06A5E","Tenu par les Anglais : Normandie, Paris, Guyenne, Calais"],[C.bg,"#A07CC8","Terres du duc de Bourgogne, allié des Anglais"]].map((r,i)=>{ const g=el("g",{},R.p3); const y=150+i*105; el("rect",{x:940,y,width:630,height:92,rx:14,fill:"#fff",stroke:r[0],"stroke-width":4},g); el("rect",{x:962,y:y+22,width:52,height:48,rx:8,fill:r[1],stroke:r[0],"stroke-width":3},g); const t=el("text",{x:1034,y:y+40,"font-size":27,"font-weight":700,fill:C.ink},g); a.wrap(t,r[2],34,1.2); return g; });
    R.note3=el("g",{},R.p3); el("rect",{x:940,y:480,width:630,height:250,rx:14,fill:"#FFF8E6",stroke:C.or,"stroke-width":4},R.note3);
    { const t=el("text",{x:966,y:526,"font-size":29,"font-weight":600,fill:C.ink},R.note3); a.wrap(t,"Charles VII n'est pas encore sacré.\nHenri VI, un enfant de 7 ans, est roi d'Angleterre ; pour les Anglais et leurs alliés, il est aussi roi de France (traité de Troyes, 1420).",36,1.3); }

    // ===== étape 4 : Jeanne, de Domrémy à Orléans
    R.o4=a.layer("o4"); R.p4=a.layer("p4");
    { const Z=Z4; R.rA=route(R.o4,Z,[V.Domremy,PT.Vaucouleurs,V.Auxerre,V.Gien,V.Chinon],C.or,8); R.rB=route(R.o4,Z,[V.Chinon,PT.Blois,V.Orleans],C.or,8);
      pin(R.o4,Z,V.Domremy,"Domrémy",{dx:-16,dy:12,anchor:"end"}); pin(R.o4,Z,PT.Vaucouleurs,"Vaucouleurs",{dx:-16,dy:-10,anchor:"end"});
      pin(R.o4,Z,V.Auxerre,"Auxerre",{dx:0,dy:36,anchor:"middle"}); pin(R.o4,Z,V.Gien,"Gien",{dx:0,dy:36,anchor:"middle"}); pin(R.o4,Z,V.Chinon,"Chinon",{dx:0,dy:-34,anchor:"middle"}); pin(R.o4,Z,PT.Blois,"Blois",{dx:0,dy:36,anchor:"middle"});
      const o=PZ(Z,V.Orleans); R.ring4=el("circle",{cx:o[0],cy:o[1],r:26,fill:"none",stroke:C.ok,"stroke-width":7},R.o4); pin(R.o4,Z,V.Orleans,"Orléans\n8 mai 1429",{dx:-18,dy:-22,anchor:"end",c2:C.ok});
      const e=PZ(Z,[637.5,272]); R.encl4=a.label(R.o4,e[0]-20,e[1]-95,"Domrémy et Vaucouleurs :\nfidèles à Charles VII",{size:22,fill:"#fff",stroke:C.fr,w:300,h:76});
      R.jj4=jeanne(R.o4); }
    R.k4=[["Février 1429","Jeanne, une jeune paysanne d'environ 17 ans, part de Vaucouleurs. Elle traverse des régions ennemies jusqu'à Chinon."],["Mars 1429","À Chinon, elle est reçue par Charles VII. Elle dit avoir reçu la mission de délivrer Orléans."],["8 mai 1429","À Orléans, les Anglais lèvent le siège, après près de sept mois."]].map(c=>{ const g=el("g",{},R.p4); el("rect",{x:940,y:385,width:630,height:365,rx:16,fill:"#fff",stroke:C.or,"stroke-width":5},g); el("text",{x:972,y:446,"font-size":40,"font-weight":800,fill:C.or,text:c[0]},g); const t=el("text",{x:972,y:500,"font-size":32,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],33,1.3); return g; });

    // ===== étape 5 : Loire, Reims, Paris
    R.o5=a.layer("o5"); R.p5=a.layer("p5");
    { const Z=Z4; R.rC=route(R.o5,Z,[V.Orleans,V.Gien,V.Auxerre,V.Troyes,V.Chalons,V.Reims],C.or,8); R.rD=route(R.o5,Z,[V.Reims,V.Compiegne,V.Paris],C.ang,7); R.rD.l.setAttribute("stroke-dasharray","14 10");
      pin(R.o5,Z,V.Orleans,"Orléans",{dx:-16,dy:18,anchor:"end"}); pin(R.o5,Z,V.Gien,"Gien",{dx:0,dy:36,anchor:"middle"}); pin(R.o5,Z,V.Auxerre,"Auxerre",{dx:0,dy:36,anchor:"middle"}); pin(R.o5,Z,V.Troyes,"Troyes",{dx:16,dy:6}); pin(R.o5,Z,V.Chalons,"Châlons",{dx:16,dy:6});
      const r=PZ(Z,V.Reims); crown(R.o5,r[0],r[1]-38,1.1,"#F2C230"); R.reims5=pin(R.o5,Z,V.Reims,"Reims\n17 juillet 1429",{dx:20,dy:-4,anchor:"start",c2:C.ok,r:11,fill:C.ok});
      const pa=PZ(Z,V.Paris); pin(R.o5,Z,V.Paris,"Paris\n8 sept. 1429",{dx:-18,dy:-4,anchor:"end",c2:C.ang}); R.x5=el("g",{transform:`translate(${pa[0]},${pa[1]})`},R.o5); el("line",{x1:-16,y1:-16,x2:16,y2:16,stroke:C.ang,"stroke-width":8,"stroke-linecap":"round"},R.x5); el("line",{x1:16,y1:-16,x2:-16,y2:16,stroke:C.ang,"stroke-width":8,"stroke-linecap":"round"},R.x5);
      const pt=PZ(Z,PT.Patay); R.pat5=el("g",{transform:`translate(${pt[0]},${pt[1]})`},R.o5); el("circle",{r:13,fill:C.ok,stroke:"#fff","stroke-width":4},R.pat5);
      R.lp5=a.label(R.o5,258,330,"Jargeau, Meung, Beaugency, Patay\njuin 1429 : victoires",{size:23,fill:"#E8F6EE",stroke:C.ok,w:440,h:84});
      R.jj5=jeanne(R.o5); }
    R.k5=[["Juin 1429","Victoires sur la Loire : Jargeau, Meung, Beaugency, puis Patay le 18 juin."],["17 juillet 1429","Charles VII est sacré roi dans la cathédrale de Reims, comme les rois de France avant lui."],["8 septembre 1429","L'attaque de Paris échoue : la ville reste aux Anglais et aux Bourguignons."]].map((c,i)=>{ const col=i===2?C.ang:C.ok; const g=el("g",{},R.p5); el("rect",{x:940,y:385,width:630,height:365,rx:16,fill:"#fff",stroke:col,"stroke-width":5},g); el("text",{x:972,y:446,"font-size":40,"font-weight":800,fill:col,text:c[0]},g); const t=el("text",{x:972,y:500,"font-size":32,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],33,1.3); return g; });

    // ===== étape 6 : Compiègne et Rouen
    R.o6=a.layer("o6"); R.p6=a.layer("p6");
    { const Z=Z6; R.rE=route(R.o6,Z,[V.Compiegne,PT.Beaurevoir,V.Arras,PT.Crotoy,V.Rouen],C.ang,8);
      pin(R.o6,Z,V.Compiegne,"Compiègne\n23 mai 1430",{dx:16,dy:2,c2:C.ang,r:11,fill:C.ang}); pin(R.o6,Z,PT.Beaurevoir,"Beaurevoir",{dx:16,dy:0}); pin(R.o6,Z,V.Arras,"Arras",{dx:-16,dy:0,anchor:"end"}); pin(R.o6,Z,PT.Crotoy,"Le Crotoy",{dx:-16,dy:0,anchor:"end"});
      pin(R.o6,Z,V.Rouen,"Rouen\n30 mai 1431",{dx:-18,dy:6,anchor:"end",c2:C.ang,r:11,fill:C.ink}); pin(R.o6,Z,V.Calais,"Calais",{dx:16,dy:0}); pin(R.o6,Z,V.Paris,"Paris",{dx:16,dy:0});
      R.jj6=jeanne(R.o6); }
    R.c6=[card(R.p6,940,45,630,165,"23 mai 1430","Capturée devant Compiègne par les Bourguignons.",C.ang),card(R.p6,940,222,630,165,"Fin 1430","Vendue aux Anglais, elle est conduite à Rouen.",C.ang),card(R.p6,940,399,630,165,"30 mai 1431","Brûlée à Rouen, après un procès. Elle a environ 19 ans.",C.ink),card(R.p6,940,576,630,165,"1456","Un nouveau procès annule sa condamnation.",C.ok)];

    // ===== étape 7 : curseur d'année
    R.o7=a.layer("o7"); R.p7=a.layer("p7");
    [["Londres",V.Londres,-16,"end"],["Calais",V.Calais,16,"start"],["Paris",V.Paris,16,"start"],["Rouen",V.Rouen,-16,"end"],["Orléans",V.Orleans,16,"start"],["Reims",V.Reims,16,"start"],["Bordeaux",V.Bordeaux,-16,"end"]].forEach(c=>pin(R.o7,ZA,c[1],c[0],{dx:c[2],anchor:c[3]}));
    R.yr7=txt(R.p7,1250,150,"1429",{size:120,fill:C.fr,stroke:C.paper,sw:8});
    R.bd7=el("g",{},R.p7); R.bd7r=el("rect",{x:1000,y:182,width:500,height:50,rx:25,fill:"#fff",stroke:C.ang,"stroke-width":4},R.bd7); R.bd7t=el("text",{x:1250,y:217,"text-anchor":"middle","font-size":27,"font-weight":800,fill:C.ang,text:""},R.bd7);
    el("rect",{x:940,y:258,width:630,height:300,rx:16,fill:"#fff",stroke:C.or,"stroke-width":4},R.p7); el("text",{x:966,y:298,"font-size":24,"font-weight":700,fill:C.gray,text:"Dernier événement connu"},R.p7);
    R.ev7y=el("text",{x:966,y:352,"font-size":38,"font-weight":800,fill:C.or},R.p7); R.ev7t=el("text",{x:966,y:402,"font-size":29,"font-weight":600,fill:C.ink},R.p7);
    [[C.fr,"#7FA6E6","Fidèle au roi de France"],[C.ang,"#E06A5E","Tenu par les Anglais"],[C.bg,"#A07CC8","Terres du duc de Bourgogne"]].forEach((r,i)=>{ const y=585+i*56; el("rect",{x:950,y:y,width:44,height:36,rx:7,fill:r[1],stroke:r[0],"stroke-width":3},R.p7); el("text",{x:1010,y:y+28,"font-size":26,"font-weight":600,fill:C.ink,text:r[2]},R.p7); });

    // ===== étape 8 : synthèse
    const sg=a.layer("synthese"); R.s8=sg; el("rect",{x:0,y:0,width:1600,height:900,rx:14,fill:C.paper},sg);
    R.sc8=[["Une longue guerre","De 1337 à 1453 : 116 ans, mais avec de longues trêves. Deux rois, celui de France et celui d'Angleterre, veulent la même couronne.",C.fr],["Un tournant : 1429","Le royaume est partagé. Avec Jeanne d'Arc, Orléans est délivrée (8 mai) et Charles VII est sacré à Reims (17 juillet). Jeanne est brûlée à Rouen en 1431.",C.or],["Une fin sans traité","Après 1435, le roi de France reprend Paris, la Normandie, puis la Guyenne. La guerre s'arrête à Castillon en 1453 ; Calais reste anglaise.",C.ok]].map((c,i)=>{ const g=el("g",{},sg); const y=110+i*230; el("rect",{x:80,y,width:1440,height:200,rx:18,fill:"#fff",stroke:c[2],"stroke-width":5},g); el("rect",{x:80,y,width:340,height:200,rx:18,fill:c[2]},g); const tt=el("text",{x:250,y:y+100,"text-anchor":"middle","font-size":36,"font-weight":800,fill:"#fff"},g); a.wrap(tt,c[0],14,1.2); tt.querySelectorAll("tspan").forEach(s=>s.setAttribute("x",250)); tt.setAttribute("text-anchor","middle"); const t=el("text",{x:460,y:y+78,"font-size":29,"font-weight":600,fill:C.ink},g); a.wrap(t,c[1],56,1.3); return g; });
    // ===== photos
    const lph=a.layer("photos");
    R.ph4=a.photo(lph,{id:"h-c4-jeanne-darc-fauquembergue",x:1010,y:42,w:330,h:215,cap:"Jeanne d'Arc, dessin de 1429",rot:-1.5,size:21});
    R.ph5=a.photo(lph,{id:"h-c4-reims-cathedrale",x:1010,y:42,w:330,h:215,cap:"La cathédrale de Reims",rot:1.5,size:21});
    // manipulation : curseur d'année
    a.manip.innerHTML=`Année : <input type="range" id="mY" min="1337" max="1453" step="1" value="${YEAR}" aria-label="Année"> <b id="mYv">${YEAR}</b>`;
    const sl=a.manip.querySelector("#mY"), lb=a.manip.querySelector("#mYv");
    sl.oninput=()=>{ YEAR=+sl.value; lb.textContent=YEAR; a.redraw(); };
  },
  reset(a){ LAYERS().forEach(e=>a.op(e,0)); a.op(R.hi1,0); setZ(ZA); setState(1337); },
  etapes:[
  { titre:"1337 : deux rois, une couronne", duree:12000,
    legende:"En 1337, le roi de France Philippe VI confisque la Guyenne, tenue par le roi d'Angleterre Édouard III. Celui-ci réclame ensuite la couronne de France : la guerre commence.",
    voix:"Nous sommes en mille trois cent trente-sept. Le roi de France, Philippe six, confisque la Guyenne. C'est une région du sud-ouest, que le roi d'Angleterre, Édouard trois, tenait comme vassal du roi de France. Quelques années plus tard, en mille trois cent quarante, Édouard trois, petit-fils de Philippe le Bel par sa mère, prend le titre de roi de France. Deux rois veulent la même couronne : la guerre commence.",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o1,R.p1); setZ(ZA); setState(1337); bandAt(1337,"1337","");
      a.op(R.cL,s(t,.03,.13)); a.op(R.cP,s(t,.03,.13)); a.op(R.cG,s(t,.16,.26));
      a.op(R.hi1,s(t,.18,.28)*(.65+.35*Math.sin(t*70))); a.op(R.cGl,s(t,.2,.3));
      R.c1.forEach((g,i)=>{ const v=s(t,[.2,.5,.78][i],[.32,.62,.9][i]); a.op(g,v); a.tr(g,(1-v)*60,0); });
      a.op(R.arr1,s(t,.5,.6)); a.draw(R.arr1.path,s(t,.5,.72)); } },
  { titre:"Cent seize ans, mais pas sans arrêt", duree:16000,
    legende:"La guerre dure de 1337 à 1453, soit 116 ans, mais pas sans arrêt : les périodes de combats alternent avec de longues trêves.",
    voix:"On l'appelle la guerre de Cent Ans, mais elle dure en réalité cent seize ans, de mille trois cent trente-sept à mille quatre cent cinquante-trois. Et on ne se bat pas tout le temps ! Sur la frise, les zones vertes sont des périodes de trêve ou de paix. Entre les grandes batailles, Cressi, Poitiers, Azaincour, puis Castillon, il y a de longues pauses. Le nom de guerre de Cent Ans a été donné bien plus tard, par les historiens.",
    anim(t,a){ const s=a.seg; only(a,R.s2);
      a.draw(R.fl,s(t,.03,.2,true)); a.op(R.cnt,s(t,.05,.15));
      R.fe.forEach((g,i)=>{ a.op(g,s(t,.12+i*.045,.2+i*.045)); });
      R.fb.forEach((r,i)=>a.op(r,s(t,.3+i*.05,.38+i*.05)));
      a.op(R.myth2,s(t,.68,.84)); a.cls(R.myth2.faux,"pulse",t>.88); } },
  { titre:"1429 : un royaume partagé", duree:13000,
    legende:"En 1429, le royaume est partagé : les Anglais tiennent la Normandie, Paris et la Guyenne, le duc de Bourgogne est leur allié, et Charles VII garde le centre et le sud.",
    voix:"Voici le royaume de France en mille quatre cent vingt-neuf. En rouge, les régions tenues par les Anglais : la Normandie, Paris et la Guyenne. En violet, les terres du duc de Bourgogne, qui est l'allié des Anglais. En bleu, les régions fidèles à Charles sept, qui n'est pas encore sacré. Henri six, un enfant de sept ans, est roi d'Angleterre, et pour les Anglais et leurs alliés, aussi roi de France. Et la ville d'Orléans est assiégée.",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o3,R.p3); setZ(ZA); setState(1429); bandAt(1429,"1429","");
      R.zl.forEach((g,i)=>a.op(g,s(t,[.18,.3,.42,.54][i],[.28,.4,.52,.64][i])));
      R.lg3.forEach((g,i)=>{ const v=s(t,[.1,.3,.5][i],[.22,.42,.62][i]); a.op(g,v); a.tr(g,(1-v)*60,0); });
      a.op(R.note3,s(t,.7,.84)); a.op(R.siege,s(t,.64,.76)*(.6+.4*Math.sin(t*80))); } },
  { titre:"Jeanne d'Arc : de Domrémy à Orléans", duree:16000,
    legende:"Jeanne, jeune paysanne d'environ 17 ans, part de Vaucouleurs, rencontre Charles VII à Chinon, puis arrive à Orléans, dont les Anglais lèvent le siège le 8 mai 1429.",
    voix:"Jeanne est une jeune paysanne d'environ dix-sept ans, née à Domrémi, en Lorraine. Elle dit avoir reçu la mission d'aider le roi Charles sept. En février mille quatre cent vingt-neuf, elle part de Vaucouleurs et traverse des régions tenues par les ennemis jusqu'à Chinon, où elle est reçue par Charles sept. Elle rejoint ensuite Orléans, assiégée. Le huit mai mille quatre cent vingt-neuf, les Anglais lèvent le siège.",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o4,R.p4,R.ph4); setZ(Z4); setState(1429);
      const pA=s(t,.06,.46,true), pB=s(t,.5,.74,true); drawRoute(a,R.rA,pA); drawRoute(a,R.rB,pB);
      const q=pB>0?a.along(R.rB.l,pB):a.along(R.rA.l,pA); a.tr(R.jj4,q.x,q.y); a.op(R.jj4,s(t,.03,.08));
      a.op(R.encl4,s(t,.03,.12)*(1-s(t,.3,.36))); a.op(R.ring4,s(t,.76,.86)*(.6+.4*Math.sin(t*90)));
      R.k4.forEach((g,i)=>a.op(g,i===0?s(t,.04,.1)*(1-s(t,.46,.5)):(i===1?s(t,.46,.52)*(1-s(t,.74,.78)):s(t,.76,.82))));
      a.op(R.ph4,s(t,.03,.12));
      bandAt(1429+L(1/12,4/12,t),"1429",t<.5?"févr.-mars":"mars-mai"); } },
  { titre:"Patay et le sacre de Reims", duree:15000,
    legende:"En juin 1429, l'armée royale gagne sur la Loire, notamment à Patay. Charles VII est sacré à Reims le 17 juillet ; l'attaque de Paris, le 8 septembre, échoue.",
    voix:"Après Orléans, l'armée du roi libère d'autres villes au bord de la Loire, puis gagne la bataille de Patè, le dix-huit juin. Ensuite, Jeanne conduit Charles sept vers Rinss, à travers des régions tenues par les Bourguignons. Troa et Châlons ouvrent leurs portes. Le dix-sept juillet mille quatre cent vingt-neuf, Charles sept est sacré à Rinss, dans la cathédrale, comme les rois de France avant lui. Mais l'attaque de Paris, le huit septembre, échoue.",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o5,R.p5,R.ph5); setZ(Z4); setState(1429,1);
      a.op(R.lp5,s(t,.04,.12)); a.op(R.pat5,s(t,.06,.14));
      const pC=s(t,.2,.62,true), pD=s(t,.7,.86,true); drawRoute(a,R.rC,pC); drawRoute(a,R.rD,pD);
      const q=pD>0?a.along(R.rD.l,pD):a.along(R.rC.l,pC); a.tr(R.jj5,q.x,q.y); a.op(R.jj5,s(t,.16,.22));
      a.op(R.reims5,s(t,.58,.66)); a.op(R.x5,s(t,.86,.94));
      R.k5.forEach((g,i)=>a.op(g,i===0?s(t,.04,.1)*(1-s(t,.24,.3)):(i===1?s(t,.56,.62)*(1-s(t,.68,.72)):s(t,.82,.88))));
      a.op(R.ph5,s(t,.56,.66)*(1-s(t,.68,.72)));
      bandAt(t<.3?1429.45:(t<.66?1429.55:1429.7),"1429",t<.3?"juin":(t<.7?"juillet":"sept.")); } },
  { titre:"Compiègne et Rouen (1430-1431)", duree:15000,
    legende:"Le 23 mai 1430, Jeanne est capturée devant Compiègne par les Bourguignons, qui la vendent aux Anglais. Jugée à Rouen, elle est brûlée le 30 mai 1431.",
    voix:"Mais la guerre continue. Le vingt-trois mai mille quatre cent trente, Jeanne est capturée devant Compiègne par les Bourguignons. Ils la vendent aux Anglais, qui la conduisent à Rouan. Après un long procès, Jeanne est condamnée et brûlée le trente mai mille quatre cent trente et un, sur la place du Vieux-Marché. Elle avait environ dix-neuf ans. En mille quatre cent cinquante-six, un nouveau procès annule cette condamnation.",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o6,R.p6); setZ(Z6); setState(1429,1);
      const p=s(t,.1,.7,true); drawRoute(a,R.rE,p); const q=a.along(R.rE.l,p); a.tr(R.jj6,q.x,q.y); a.op(R.jj6,s(t,.06,.12));
      R.c6.forEach((g,i)=>{ const v=s(t,[.06,.4,.62,.84][i],[.18,.52,.74,.96][i]); a.op(g,v); a.tr(g,(1-v)*60,0); });
      bandAt(L(1430.4,1431.4,p),"1430-31",""); } },
  { titre:"À vous : l'année sur la carte", duree:9000,
    legende:"Déplacez le curseur entre 1337 et 1453 : la carte montre les terres tenues par les Anglais, et la frise indique les périodes de trêve.",
    voix:"À vous de jouer ! Déplacez le curseur pour changer l'année, de mille trois cent trente-sept à mille quatre cent cinquante-trois. Regardez la carte : les terres tenues par les Anglais, en rouge, changent. En mille quatre cent vingt-neuf, elles sont très étendues. En mille quatre cent cinquante-trois, il ne reste que Calais. Regardez aussi la frise : l'année choisie est-elle une période de trêve ?",
    anim(t,a){ const s=a.seg; only(a,R.fond,R.map,R.band,R.o7,R.p7); setZ(ZA); setState(YEAR);
      R.yr7.textContent=String(YEAR); bandAt(YEAR,String(YEAR),inTruce(YEAR)?"trêve":"");
      const tr=inTruce(YEAR); R.bd7r.setAttribute("stroke",tr?C.ok:C.ang); R.bd7r.setAttribute("fill",tr?"#E8F6EE":"#FDECEA"); R.bd7t.setAttribute("fill",tr?"#14532D":"#7A1D12"); R.bd7t.textContent=tr?"Période de trêve ou de paix":"Période de combats";
      let e=EV[0]; EV.forEach(v=>{ if(v[0]<=YEAR) e=v; }); R.ev7y.textContent=String(e[0]); a.wrap(R.ev7t,e[1],36,1.25);
      a.op(R.p7,s(t,.04,.16)); } },
  { titre:"Synthèse", duree:12000,
    legende:"Une guerre de 116 ans, avec des trêves ; un tournant en 1429 avec Jeanne d'Arc ; une fin sans traité de paix, à Castillon, en 1453.",
    voix:"Pour résumer : la guerre de Cent Ans dure cent seize ans, de mille trois cent trente-sept à mille quatre cent cinquante-trois, avec de longues trêves. En mille quatre cent vingt-neuf, le royaume est partagé. Jeanne d'Arc aide Charles sept : Orléans est délivrée, et le roi est sacré à Rinss. Après mille quatre cent trente-cinq, le roi de France reprend Paris, la Normandie, puis la Guyenne. La guerre s'arrête à Castillon, en mille quatre cent cinquante-trois, sans traité de paix.",
    anim(t,a){ const s=a.seg; only(a,R.s8); R.sc8.forEach((g,i)=>{ const v=s(t,.05+i*.28,.2+i*.28); a.op(g,v); a.tr(g,(1-v)*70,0); }); } },
  ]
});
})();
