/* META {"id":"histoire-A1c-roman-gothique","matiere":"histoire","annee":"A","periode":1,"theme":"Le Moyen Âge : des églises romanes aux cathédrales gothiques","resume":"Pourquoi les cathédrales gothiques sont hautes et lumineuses : croisée d'ogives, arcs-boutants, vitraux.","motsCles":["art roman","art gothique","voûte","croisée d'ogives","arc-boutant","vitrail","Vézelay"]} */
(function(){
let R={}, fen=0.15; // taille des fenêtres (manipulation)
const C={stone:"#E4D6BC",stoneD:"#8C7A5B",roof:"#7A4A2E",glass:"#9FD3F0",light:"#FFE07A",force:"#C0392B",ok:"#2E8B57",or:"#E07A1F",ink:"#1E2430"};
const GY=760, RX=400, GX=1170;
function romanPaths(T,cx){ cx=cx||RX; const ri=150, ro=150+T, y=480;
  return { wl:`M${cx-ri-T},${y} L${cx-ri},${y} L${cx-ri},${GY} L${cx-ri-T},${GY}Z`, wr:`M${cx+ri},${y} L${cx+ri+T},${y} L${cx+ri+T},${GY} L${cx+ri},${GY}Z`,
    v:`M${cx-ro},${y} A${ro},${ro} 0 0 1 ${cx+ro},${y} L${cx+ri},${y} A${ri},${ri} 0 0 0 ${cx-ri},${y}Z`,
    roof:`M${cx-ro-30},${y-6} L${cx},${y-ro-80} L${cx+ro+30},${y-6}Z`,
    cl:`M${cx-ri-T-42},${560} L${cx-ri-T},${540} L${cx-ri-T},${GY} L${cx-ri-T-42},${GY}Z`, cr:`M${cx+ri+T+42},${560} L${cx+ri+T},${540} L${cx+ri+T},${GY} L${cx+ri+T+42},${GY}Z`,
    force:`M${cx},${y-ri-T/2} A${ri+T/2},${ri+T/2} 0 0 0 ${cx-ri-T/2},${y} L${cx-ri-T/2},${GY}` };
}
function drawRoman(a,T,win,tilt,cx){
    cx=cx||RX; const p=romanPaths(T,cx); a.set(R.rWl,{d:p.wl}); a.set(R.rWr,{d:p.wr}); a.set(R.rV,{d:p.v}); a.set(R.rRoof,{d:p.roof}); a.set(R.rCl,{d:p.cl}); a.set(R.rCr,{d:p.cr}); a.set(R.rPath,{d:p.force}); a.set(R.rIn,{d:`M${cx-150},${GY} L${cx-150},480 A150,150 0 0 1 ${cx+150},480 L${cx+150},${GY}Z`}); R.rIn.setAttribute("transform",`translate(0,${tilt*7})`); R.rPath._len=undefined;
    const h=20+win*190, w=Math.max(14,T*0.45);
    R.rWin.forEach((r,i)=>a.set(r,{x:i?cx+150+T/2-w/2:cx-150-T/2-w/2,y:640-h/2,width:w,height:h}));
    R.rRays.forEach((r,i)=>{ const sg=i?1:-1, x=cx+sg*150; a.set(r,{d:`M${x},${640-h/2} L${x},${640+h/2} L${cx-sg*40},${GY} L${cx-sg*40-sg*h*.6},${GY}Z`}); });
    const tl=`rotate(${-tilt},${cx-150-T},${GY})`, tr=`rotate(${tilt},${cx+150+T},${GY})`;
    R.rWl.setAttribute("transform",tl); R.rCl.setAttribute("transform",tl); R.rWin[0].setAttribute("transform",tl);
    R.rWr.setAttribute("transform",tr); R.rCr.setAttribute("transform",tr); R.rWin[1].setAttribute("transform",tr);
    R.rV.setAttribute("transform",`translate(0,${tilt*7})`); R.rRoof.setAttribute("transform",`translate(0,${tilt*7})`);
    a.set(R.rCrack,{d:`M${cx-8},${480-150-T-4} l10,22 l-12,16 l12,18 l-8,20 M${cx-150-T*.5},600 l14,18 l-10,14 l12,16`});
    R.gauge[0].bar.setAttribute("width",Math.max(4,216*(0.08+win*0.5)));
  }
Anim.run({
  titre:"Art roman et art gothique : le secret des voûtes",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire",
  accroche:"Pourquoi les églises gothiques sont-elles si hautes et si lumineuses ?",
  manipDes:5, manipJusqua:5,
  init(a){
    const {el}=a; const L=a.layer("base");
    el("rect",{x:0,y:GY,width:1600,height:140,fill:"#D9CDB3"},L); el("line",{x1:0,y1:GY,x2:1600,y2:GY,stroke:C.stoneD,"stroke-width":3},L);
    // ROMAN
    const rg=el("g",{},L); R.rg=rg; const st={fill:C.stone,stroke:C.stoneD,"stroke-width":3,"stroke-linejoin":"round"};
    R.rRoof=el("path",Object.assign({},st,{fill:C.roof}),rg);
    const dfs=el("defs",{},a.svg); el("rect",{x:0,y:0,width:1600,height:GY},el("clipPath",{id:"cIn"},dfs));
    R.rIn=el("path",{fill:"#FFF9EE"},el("g",{"clip-path":"url(#cIn)"},rg));
    R.rLight=el("g",{},rg); R.rRays=[0,1].map(i=>el("path",{fill:C.light,opacity:.55},R.rLight));
    R.rCl=el("path",st,rg); R.rCr=el("path",st,rg);
    R.rWl=el("path",st,rg); R.rWr=el("path",st,rg); R.rV=el("path",st,rg);
    R.rWin=[0,1].map(()=>el("rect",{fill:C.glass,stroke:"#4A7FA0","stroke-width":2,rx:8},rg));
    R.rCrack=el("path",{fill:"none",stroke:C.force,"stroke-width":5,"stroke-linejoin":"round"},rg);
    R.rT=el("text",{x:RX,y:105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#7A4A2E"},L);
    R.rSub=el("text",{x:RX,y:140,"text-anchor":"middle","font-size":22,fill:"#4A5468"},L);
    // forces
    R.fArrows=el("g",{},L);
    R.fDown=a.arrow(R.fArrows,"M400,250 L400,330",{color:C.force,w:8});
    R.fSideL=a.arrow(R.fArrows,"M260,470 L170,470",{color:C.force,w:8}); R.fSideR=a.arrow(R.fArrows,"M540,470 L630,470",{color:C.force,w:8});
    R.fLab=el("text",{x:400,y:240,"text-anchor":"middle","font-size":24,"font-weight":800,fill:C.force,text:"poids de la voûte"},R.fArrows);
    R.fLab2=el("text",{x:400,y:540,"text-anchor":"middle","font-size":24,"font-weight":700,fill:C.force},R.fArrows); a.wrap(R.fLab2,"elle pousse aussi\nsur les côtés",99,1.2);
    R.rPath=el("path",{fill:"none",stroke:"none"},L); R.rDots=[...Array(10)].map(()=>el("circle",{r:8,fill:C.force},L));
    R.gauge=[RX,GX].map(x=>{ const g=el("g",{},L); el("text",{x:x-150,y:842,"font-size":22,"font-weight":700,fill:C.ink,text:"Lumière"},g); el("rect",{x:x-50,y:822,width:220,height:26,rx:13,fill:"#fff",stroke:C.ink,"stroke-width":2},g); const b=el("rect",{x:x-48,y:824,width:0,height:22,rx:11,fill:"#F2C230"},g); g.bar=b; return g; });
    R.gW=el("g",{},L); el("text",{x:RX-150,y:806,"font-size":22,"font-weight":700,fill:C.ink,text:"Fenêtres"},R.gW); el("rect",{x:RX-50,y:784,width:220,height:26,rx:13,fill:"#fff",stroke:C.ink,"stroke-width":2},R.gW);
    R.gW.bar=el("rect",{x:RX-48,y:786,width:0,height:22,rx:11,fill:"#4A8FC0"},R.gW); R.gW.val=el("text",{x:RX+184,y:806,"font-size":22,"font-weight":700,fill:"#2E5A8A"},R.gW);
    // GOTHIQUE
    const gg=el("g",{},L); R.gg=gg; const cx=GX;
    el("path",Object.assign({},st,{fill:C.roof,d:`M${cx-190},336 L${cx},90 L${cx+190},336Z`}),gg);
    el("path",{d:`M${cx-162},${GY} L${cx-162},330 Q${cx-162},205 ${cx},158 Q${cx+162},205 ${cx+162},330 L${cx+162},${GY}Z`,fill:"#FFF9EE"},gg);
    [-1,1].forEach(sg=>el("path",{d:`M${cx+sg*174},516 L${cx+sg*300},568 L${cx+sg*300},${GY} L${cx+sg*174},${GY}Z`,fill:"#FFF9EE"},gg));
    R.gLight=el("g",{},gg); R.gRays=[[-1],[1]].map(()=>el("path",{fill:C.light,opacity:.55},R.gLight));
    [-1,1].forEach(sg=>{
      el("path",Object.assign({},st,{d:`M${cx+sg*174},500 L${cx+sg*320},560 L${cx+sg*320},574 L${cx+sg*174},516Z`,fill:C.roof}),gg); // toit bas-côté
      el("rect",Object.assign({},st,{x:sg<0?cx-320:cx+300,y:560,width:20,height:200}),gg); // mur bas-côté
      el("rect",Object.assign({},st,{x:sg<0?cx-390:cx+350,y:420,width:40,height:340}),gg); // culée
      el("path",Object.assign({},st,{d:`M${cx+sg*395},422 L${cx+sg*370},360 L${cx+sg*345},422Z`}),gg); // pinacle
      el("rect",Object.assign({},st,{x:sg<0?cx-174:cx+150,y:330,width:24,height:430}),gg); // pilier
    });
    R.gGlass=[-1,1].map(sg=>{ const g=el("g",{},gg); const x=sg<0?cx-174:cx+150; el("rect",{x,y:350,width:24,height:140,fill:"#5B8FD0"},g); for(let i=0;i<5;i++) el("rect",{x:x+3,y:354+i*27,width:18,height:22,fill:["#C0392B","#2E6BC0","#E0B12A","#2E8B57","#7B3F98"][i]},g); el("rect",{x:sg<0?cx-320:cx+300,y:600,width:20,height:110,fill:"#5B8FD0"},g); return g; });
    el("path",Object.assign({},st,{d:`M${cx-174},330 Q${cx-174},196 ${cx},146 Q${cx+174},196 ${cx+174},330 L${cx+150},330 Q${cx+150},214 ${cx},170 Q${cx-150},214 ${cx-150},330Z`}),gg);
    R.arcs=[-1,1].map(sg=>el("path",{d:`M${cx+sg*350},440 Q${cx+sg*262},372 ${cx+sg*174},356`,fill:"none",stroke:C.stoneD,"stroke-width":20,"stroke-linecap":"round"},gg));
    R.arcsIn=[-1,1].map(sg=>el("path",{d:`M${cx+sg*350},440 Q${cx+sg*262},372 ${cx+sg*174},356`,fill:"none",stroke:C.stone,"stroke-width":13,"stroke-linecap":"round"},gg));
    R.gT=el("text",{x:GX,y:60,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#2E5A8A",text:"Église gothique"},L);
    R.gSub=el("text",{x:GX,y:820,"text-anchor":"middle","font-size":22,fill:"#4A5468"},L);
    R.gPaths=[-1,1].map(sg=>el("path",{d:`M${cx},160 Q${cx+sg*162},210 ${cx+sg*162},342 Q${cx+sg*262},380 ${cx+sg*370},426 L${cx+sg*370},${GY}`,fill:"none",stroke:"none"},L));
    R.gDots=[...Array(16)].map(()=>el("circle",{r:8,fill:C.force},L));
    R.abLab=el("g",{},L); a.label(R.abLab,GX-330,300,"arc-boutant",{size:24,stroke:C.or,color:C.or}); a.arrow(R.abLab,`M${GX-330},322 Q${GX-300},360 ${GX-270},378`,{color:C.or,w:4});
    R.culLab=el("g",{},L); a.label(R.culLab,GX+440,560,"culée",{size:24,stroke:C.or,color:C.or}); a.arrow(R.culLab,`M${GX+440},538 L${GX+400},520`,{color:C.or,w:4});
    // croisée d'ogives (vue d'en haut)
    const og=el("g",{},L); R.og=og; const ox=GX, oy=500;
    el("rect",{x:ox-230,y:oy-230,width:460,height:460,rx:16,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},og);
    el("text",{x:ox,y:oy-190,"text-anchor":"middle","font-size":26,"font-weight":800,fill:C.ink,text:"Croisée d'ogives (vue d'en dessous)"},og);
    el("rect",{x:ox-150,y:oy-140,width:300,height:300,fill:"#F1E7D2",stroke:C.stoneD,"stroke-width":3},og);
    R.ogD=[`M${ox-150},${oy-140} L${ox+150},${oy+160}`,`M${ox+150},${oy-140} L${ox-150},${oy+160}`].map(d=>el("path",{d,stroke:C.stoneD,"stroke-width":12,fill:"none"},og));
    [[-150,-140],[150,-140],[150,160],[-150,160]].forEach(([dx,dy])=>el("circle",{cx:ox+dx,cy:oy+dy,r:20,fill:C.stoneD},og));
    el("text",{x:ox,y:oy+212,"text-anchor":"middle","font-size":22,fill:"#4A5468",text:"le poids glisse le long des nervures jusqu'aux 4 piliers"},og);
    R.ogP=[[-150,-140],[150,-140],[150,160],[-150,160]].map(([dx,dy])=>el("path",{d:`M${ox},${oy+10} L${ox+dx},${oy+dy}`},og));
    R.ogDots=[...Array(12)].map(()=>el("circle",{r:9,fill:C.force},og));
    // comparaison
    R.cmp=a.layer("cmp"); const T=[["","Roman (XIe-XIIe s.)","Gothique (dès 1140)"],["Arc","en plein cintre","brisé, en pointe"],["Murs","très épais","fins, piliers + vitraux"],["Lumière","plutôt sombre","très lumineux"],["Hauteur","basse","très haute"],["Près de nous","Vézelay (Yonne)","Notre-Dame de Dijon"]];
    el("rect",{x:300,y:40,width:1000,height:470,rx:18,fill:"#fff",stroke:"#D6DBE4","stroke-width":3},R.cmp);
    T.forEach((r,i)=>{ r.forEach((c,j)=>el("text",{x:[330,610,970][j],y:96+i*78,"font-size":i===0?28:26,"font-weight":i===0||j===0?800:600,fill:j===1?"#7A4A2E":j===2?"#2E5A8A":C.ink,text:c},R.cmp)); if(i) el("line",{x1:320,y1:60+i*78,x2:1280,y2:60+i*78,stroke:"#E6E9EF","stroke-width":2},R.cmp); });
    el("path",{d:"M850,182 A20,20 0 0 1 890,182",fill:"none",stroke:"#7A4A2E","stroke-width":6,"stroke-linecap":"round"},R.cmp);
    el("path",{d:"M1208,182 Q1208,160 1228,146 Q1248,160 1248,182",fill:"none",stroke:"#2E5A8A","stroke-width":6,"stroke-linecap":"round","stroke-linejoin":"round"},R.cmp);
    // photos « Dans la réalité » (encarts libres)
    const lp=a.layer("photos");
    R.pVz=a.photo(lp,{id:"h-a1c-vezelay-nef",x:880,y:130,w:560,h:380,cap:"La nef romane de Vézelay (Yonne)",rot:2});
    R.pSens=a.photo(lp,{id:"h-a1c-sens-voute",x:1090,y:28,w:340,h:140,cap:"Cathédrale de Sens (Yonne)",rot:-2});
    R.myth=a.layer("myth"); a.myth(R.myth,300,540,1000,"Les églises gothiques sont plus hautes parce qu'on avait des pierres plus solides.","C'est la façon de répartir le poids qui change : les ogives et les arcs-boutants portent la voûte, donc les murs peuvent devenir des vitraux.");
    R.status=[RX,GX].map(x=>el("text",{x,y:884,"text-anchor":"middle","font-size":26,"font-weight":800},L));
    a.manip.innerHTML=`Agrandir les fenêtres : <input type="range" id="mF" min="0" max="100" value="15"> <span id="mFv">petites</span>`;
    document.getElementById("mF").oninput=e=>{ fen=e.target.value/100; document.getElementById("mFv").textContent=fen<.35?"petites":fen<.7?"moyennes":"immenses"; a.redraw(); };
  },
  reset(a){
    [R.fArrows,R.rCl,R.rCr,R.rCrack,R.rLight,R.gg,R.gT,R.gSub,...R.gDots,R.abLab,R.culLab,R.og,R.cmp,R.myth,...R.rDots,R.gauge[0],R.gauge[1],R.gW,R.pVz,R.pSens,...R.status].forEach(e=>a.op(e,0)); a.cls(R.rCrack,"pulse",false);
    a.op(R.rg,1); a.tr(R.rg,0,0); a.op(R.rT,1); a.op(R.rSub,1); R.rT.textContent="Une voûte en pierre"; R.rSub.textContent="vue en coupe"; a.set(R.rT,{x:RX}); a.set(R.rSub,{x:RX});
    drawRoman(a,26,0,0,800); a.tr(R.rg,0,0); R.fArrows.setAttribute("transform","translate(400,0)");
  },
  etapes:[
  { titre:"Le problème : une voûte pousse", duree:9000,
    legende:"Une voûte en pierre est très lourde. Son poids pousse vers le bas… mais aussi vers les côtés. Avec des murs trop fins, ils s'écartent et la voûte s'effondre !",
    voix:"Au Moyen Âge, on veut couvrir les églises avec des voûtes en pierre, qui ne brûlent pas. Mais une voûte en pierre est très lourde. Son poids pousse vers le bas, et aussi vers les côtés. Si les murs sont trop fins, ils s'écartent… et la voûte s'effondre !",
    anim(t,a){ const s=a.seg; a.set(R.rT,{x:800}); a.set(R.rSub,{x:800}); a.op(R.fArrows,s(t,.15,.3)); a.draw(R.fDown.path,s(t,.15,.3)); a.draw(R.fSideL.path,s(t,.35,.5)); a.draw(R.fSideR.path,s(t,.35,.5)); a.op(R.fLab2,s(t,.4,.5));
      const tilt=6*s(t,.55,.85); drawRoman(a,26,0,tilt,800); a.op(R.rCrack,s(t,.7,.75)); a.cls(R.rCrack,"pulse",t>.75);
      a.op(R.status[0],s(t,.85,.95)); a.set(R.status[0],{x:800,fill:C.force}); R.status[0].textContent="Les murs trop fins s'écartent"; } },
  { titre:"La solution romane", duree:10000,
    legende:"Solution romane (XIe-XIIe siècles) : des murs très épais et des contreforts. Ils résistent à la poussée, mais on ne peut y percer que de petites fenêtres.",
    voix:"Première solution, celle de l'art roman, aux onzième et douzième siècles : on construit des murs très épais, renforcés à l'extérieur par des contreforts. Le poids de la voûte descend dans ces murs jusqu'au sol. Mais pour ne pas affaiblir le mur, on n'y perce que de petites fenêtres.",
    anim(t,a){ const s=a.seg; a.cls(R.rCrack,"pulse",false); a.op(R.fArrows,1-s(t,0,.1)); a.op(R.status[0],1-s(t,0,.1)); a.op(R.rCrack,0); const m=s(t,0,.3); const cx=a.lerp(800,RX,m); a.set(R.rT,{x:cx}); a.set(R.rSub,{x:cx}); R.rT.textContent="Église romane"; R.rSub.textContent="murs épais, voûte en plein cintre";
      const T=a.lerp(26,70,s(t,.25,.5)); drawRoman(a,T,s(t,.55,.7)*0.12,0,cx); a.op(R.rCl,s(t,.4,.55)); a.op(R.rCr,s(t,.4,.55));
      R.rDots.forEach((d,i)=>{ const v=s(t,.6,.7); a.op(d,v); const q=a.along(R.rPath,((t*2.5)+i/10)%1); a.set(d,{cx:q.x,cy:q.y}); }); } },
  { titre:"Conséquence : un intérieur sombre", duree:7000,
    legende:"Avec de petites fenêtres, peu de lumière entre : l'intérieur d'une église romane est souvent sombre et massif, avec des arcs ronds. Exemple près de chez nous : la basilique de Vézelay.",
    voix:"Conséquence : avec ces petites fenêtres, peu de lumière entre. L'intérieur d'une église romane est souvent sombre et massif, avec des arcs ronds, qu'on appelle des arcs en plein cintre. Un bel exemple en Bourgogne : la basilique de Vézlé, construite au douzième siècle.",
    anim(t,a){ const s=a.seg; a.set(R.rT,{x:RX}); a.set(R.rSub,{x:RX}); R.rT.textContent="Église romane"; R.rSub.textContent="murs épais, voûte en plein cintre"; drawRoman(a,70,.12,0,RX); a.op(R.rCl,1); a.op(R.rCr,1);
      a.op(R.rLight,s(t,.1,.4)); a.op(R.pVz,s(t,.4,.55)); a.op(R.gauge[0],s(t,.3,.45)); R.gauge[0].bar.setAttribute("width",Math.max(4,216*(0.08+.12*.5)*s(t,.35,.7))); } },
  { titre:"La croisée d'ogives", duree:9000,
    legende:"Vers 1140 apparaît l'art gothique. Sa première invention : la croisée d'ogives. Deux arcs en croix concentrent le poids de la voûte sur 4 piliers.",
    voix:"Vers mille cent quarante apparaît l'art gothique. Première invention : la croisée d'ogives. Deux arcs de pierre se croisent sous la voûte. Le poids glisse le long de ces nervures et se concentre sur quatre piliers. Les murs entre les piliers n'ont presque plus rien à porter !",
    anim(t,a){ const s=a.seg; drawRoman(a,70,.12,0,RX); a.op(R.rCl,1); a.op(R.rCr,1); a.op(R.rLight,1); a.op(R.gauge[0],1);
      a.op(R.pVz,1-s(t,0,.12)); a.op(R.pSens,s(t,.5,.65)); a.op(R.og,s(t,.1,.25)); R.ogD.forEach(d=>a.draw(d,s(t,.2,.45)));
      R.ogDots.forEach((d,i)=>{ const v=s(t,.4,.5); a.op(d,v); const q=a.along(R.ogP[i%4],((t*1.6)+Math.floor(i/4)/3)%1); a.set(d,{cx:q.x,cy:q.y}); }); } },
  { titre:"Les arcs-boutants", duree:11000,
    legende:"Deuxième invention : les arcs-boutants. Ils conduisent la poussée vers des culées, à l'extérieur. Les murs ne portent plus : on les remplace par de grands vitraux.",
    voix:"Deuxième invention : les arcs-boutants. Ce sont des arcs de pierre posés à l'extérieur. Ils récupèrent la poussée de la voûte et la conduisent vers de gros piliers, les culées, jusqu'au sol. Les murs n'ont plus besoin d'être épais : on peut les remplacer par d'immenses vitraux. L'église devient très haute et très lumineuse.",
    anim(t,a){ const s=a.seg; drawRoman(a,70,.12,0,RX); a.op(R.rCl,1); a.op(R.rCr,1); a.op(R.rLight,1); a.op(R.gauge[0],1);
      a.op(R.pSens,1-s(t,0,.12)); a.op(R.og,1-s(t,0,.15)); a.op(R.gg,s(t,.1,.3)); a.op(R.gT,s(t,.1,.3)); R.gSub.textContent="";
      a.cls(R.arcs[0],"glow",t>.3&&t<.7); a.cls(R.arcs[1],"glow",t>.3&&t<.7);
      a.op(R.abLab,s(t,.3,.4)); a.op(R.culLab,s(t,.4,.5));
      R.gDots.forEach((d,i)=>{ const v=s(t,.35,.45); a.op(d,v); const q=a.along(R.gPaths[i%2],((t*2)+Math.floor(i/2)/8)%1); a.set(d,{cx:q.x,cy:q.y}); });
      R.gGlass.forEach(g=>a.op(g,s(t,.6,.75))); a.op(R.gLight,s(t,.7,.9)); R.gRays.forEach((r,i)=>{ const sg=i?1:-1; a.set(r,{d:`M${GX+sg*162},350 L${GX+sg*162},490 L${GX-sg*60},${GY} L${GX-sg*260},${GY}Z`}); });
      a.op(R.gauge[1],s(t,.75,.85)); R.gauge[1].bar.setAttribute("width",216*.95*s(t,.8,1)); } },
  { titre:"À vous : agrandissez les fenêtres !", duree:6000,
    legende:"À vous : déplacez le curseur pour agrandir les fenêtres de l'église romane, et regardez ce qui change. Au-delà d'un certain point, son mur se fend ; l'église gothique, elle, tient bon grâce à ses arcs-boutants.",
    voix:"À vous ! Avec le curseur, agrandissez les fenêtres de l'église romane, et regardez ce qui change. Le mur s'affaiblit, et finit par se fendre. L'église gothique, elle, a déjà de grands vitraux et pourtant elle tient bon, car ce sont les arcs-boutants et les piliers qui portent la voûte. Quand vous avez fini, appuyez sur Continuer.",
    anim(t,a){ const s=a.seg; a.op(R.gg,1); a.op(R.gT,1); a.op(R.rCl,1); a.op(R.rCr,1); a.op(R.rLight,1); a.op(R.gauge[0],1); a.op(R.gauge[1],1); a.op(R.gW,s(t,0,.1));
      const w=t<1?a.lerp(.12,Math.max(fen,.12),s(t,.2,.6)):Math.max(fen,.12); const bad=w>.45; const tilt=bad?(w-.45)*9:0; drawRoman(a,70,w,tilt,RX); a.op(R.rCrack,bad?1:0); a.cls(R.rCrack,"pulse",bad&&t>=1);
      R.gW.bar.setAttribute("width",Math.max(4,216*Math.min(w,1))); R.gW.val.textContent=w<.3?"petites":w<.6?"moyennes":"immenses";
      R.gGlass.forEach(g=>a.op(g,1)); a.op(R.gLight,1); R.gRays.forEach((r,i)=>{ const sg=i?1:-1; a.set(r,{d:`M${GX+sg*162},350 L${GX+sg*162},490 L${GX-sg*60},${GY} L${GX-sg*260},${GY}Z`}); }); R.gauge[1].bar.setAttribute("width",216*.95);
      R.gDots.forEach((d,i)=>{ a.op(d,1); const q=a.along(R.gPaths[i%2],((performance.now()/4000)+Math.floor(i/2)/8)%1); a.set(d,{cx:q.x,cy:q.y}); });
      a.op(R.status[0],s(t,.55,.65)); a.set(R.status[0],{x:RX,fill:bad?C.force:C.ok}); R.status[0].textContent=bad?"Le mur se fend !":"Le mur tient";
      a.op(R.status[1],s(t,.55,.65)); a.set(R.status[1],{fill:C.ok}); R.status[1].textContent="L'église gothique tient"; } },
  { titre:"Synthèse : roman ou gothique ?", duree:9000,
    legende:"Roman : murs épais, arcs ronds, intérieur sombre. Gothique : ogives, arcs-boutants, arcs brisés, immenses vitraux. Exemples : Vézelay (roman), Notre-Dame de Dijon (gothique).",
    voix:"Récapitulons. L'art roman : des murs épais, des arcs ronds, un intérieur sombre. L'art gothique : la croisée d'ogives, les arcs-boutants, des arcs brisés en pointe et d'immenses vitraux. Près de chez nous, Vézlé est une église romane, et Notre-Dame de Dijon, construite au treizième siècle, est une église gothique.",
    anim(t,a){ const s=a.seg; a.op(R.rg,1-s(t,0,.2)); a.op(R.rT,1-s(t,0,.2)); a.op(R.rSub,0); [...R.rDots,...R.gDots,R.abLab,R.culLab,R.rCl,R.rCr,R.rLight,R.rCrack,...R.gauge,R.gW,...R.status].forEach(e=>a.op(e,1-s(t,0,.15))); a.op(R.gg,0); a.op(R.gT,0); a.op(R.cmp,s(t,.1,.3)); a.op(R.myth,s(t,.6,.75)); a.cls(R.myth.faux,"pulse",t>.75&&t<1); } },
  ],
  after(a,k){ if(k===5&&!window.__animLoop){ window.__animLoop=true; const loop=()=>{ if(window.__anim&&window.__anim.S.k===5&&window.__anim.S.t>=1) a.redraw(); window.__animLoop=window.__anim&&window.__anim.S.k===5; if(window.__animLoop) requestAnimationFrame(loop); }; requestAnimationFrame(loop); } }
});
})();
