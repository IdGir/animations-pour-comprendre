/* META {"id":"geo-B4-mobilites-transports","matiere":"geographie","annee":"B","periode":1,"theme":"Découper, mesurer, se déplacer dans les territoires","resume":"Dijon-Paris en TGV, voiture, autocar ou avion : durées (centre à centre, porte à porte) et émissions de CO₂ par passager.","motsCles":["mobilité","transports","TGV","durée","porte à porte","CO₂","empreinte carbone","Dijon","Paris"]} */
//@data france
(function(){
const F=FRANCE, R={}; let sel=0;
const C={tgv:"#2563A8",car:"#C0392B",bus:"#2E8B57",avi:"#7B3F98",ink:"#1E2430",grey:"#4A5468",ville:"#9FB8CC",att:"#F2C94C"};
// modes : voyage seul (min), segments « porte à porte » (exemples), CO₂ (kg par passager, ADEME / impactco2.fr, pour 310 km)
const M=[
 {nom:"TGV",col:C.tgv,ic:"train",main:95,co2:0.7,sub:["gare à gare"],seg:[["ville",20,"Tram ou marche jusqu'à la gare"],["att",10,"Attente sur le quai"],["main",95,"TGV Dijon → Paris"],["ville",25,"Métro dans Paris"]]},
 {nom:"Voiture",col:C.car,ic:"car",main:180,co2:40,sub:["route et autoroute"],seg:[["ville",10,"Rejoindre la voiture, sortir de la ville"],["main",180,"Route Dijon → Paris"],["att",20,"Chercher une place de stationnement"]]},
 {nom:"Autocar",col:C.bus,ic:"bus",main:230,co2:10,sub:["autocar"],seg:[["ville",15,"Aller à la gare routière"],["att",15,"Attente avant le départ"],["main",230,"Autocar Dijon → Paris"],["ville",25,"Métro dans Paris"]]},
 {nom:"Avion",col:C.avi,ic:"plane",main:45,co2:70,sub:["exemple théorique :","pas de vol régulier"],seg:[["ville",30,"Aller à l'aéroport"],["att",75,"Enregistrement, sécurité, embarquement"],["main",45,"Vol"],["att",20,"Sortie de l'avion, bagages"],["ville",45,"De l'aéroport au centre de Paris"]]}
];
M.forEach(m=>{ m.tot=m.seg.reduce((s,x)=>s+x[1],0); });
const fk=v=>v<1?String(v).replace(".",","):String(Math.round(v));
const fmt=m=>{ m=Math.round(m); if(m<60) return m+" min"; const h=Math.floor(m/60), r=m%60; return h+" h"+(r?" "+String(r).padStart(2,"0"):""); };
const LY=[260,410,560,710], PX=3.3; // lignes des courses
// pictogrammes (vers la droite, centrés)
function icon(parent,kind,col){ const g=Anim.H.el("g",{},parent), e=Anim.H.el, st={stroke:C.ink,"stroke-width":3,"stroke-linejoin":"round"};
  if(kind==="train"){ e("path",{d:"M-56,14 L-56,-16 Q-56,-24 -48,-24 L22,-24 Q50,-24 58,2 L58,14Z",fill:col,...st},g); [-44,-26,-8].forEach(x=>e("rect",{x,y:-16,width:14,height:12,fill:"#E6F0FA",stroke:C.ink,"stroke-width":2},g)); e("path",{d:"M14,-16 L32,-16 Q40,-12 44,-4 L14,-4Z",fill:"#E6F0FA",stroke:C.ink,"stroke-width":2},g); [-38,-10,22,44].forEach(x=>e("circle",{cx:x,cy:16,r:5.5,fill:C.ink},g)); }
  else if(kind==="car"){ e("path",{d:"M-52,12 L-52,-2 Q-52,-8 -44,-9 L-26,-12 L-14,-28 L22,-28 L36,-12 L48,-8 Q54,-6 54,2 L54,12Z",fill:col,...st},g); e("path",{d:"M-12,-12 L-4,-23 L8,-23 L8,-12Z M14,-12 L14,-23 L21,-23 L30,-12Z",fill:"#E6F0FA",stroke:C.ink,"stroke-width":2},g); [-28,30].forEach(x=>{ e("circle",{cx:x,cy:12,r:10,fill:C.ink},g); e("circle",{cx:x,cy:12,r:4,fill:"#ccc"},g); }); }
  else if(kind==="bus"){ e("rect",{x:-58,y:-32,width:116,height:44,rx:9,fill:col,...st},g); [-46,-26,-6,14,34].forEach(x=>e("rect",{x,y:-24,width:16,height:14,fill:"#E6F5EC",stroke:C.ink,"stroke-width":2},g)); [-34,34].forEach(x=>{ e("circle",{cx:x,cy:14,r:10,fill:C.ink},g); e("circle",{cx:x,cy:14,r:4,fill:"#ccc"},g); }); }
  else { e("path",{d:"M-8,0 L-34,-42 L-16,-42 L22,-2Z M-8,0 L-34,42 L-16,42 L22,2Z",fill:col,...st},g); e("path",{d:"M-52,-4 L-66,-28 L-52,-28 L-34,-6Z",fill:col,...st},g); e("ellipse",{cx:0,cy:0,rx:58,ry:11,fill:"#fff",...st},g); [-30,-14,2,18,34].forEach(x=>e("circle",{cx:x,cy:-1,r:2.8,fill:col},g)); e("path",{d:"M50,-8 Q60,-6 62,0 L46,0Z",fill:"#E6F0FA"},g); }
  return g; }
Anim.run({
  titre:"Se déplacer de Dijon à Paris",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : découper, mesurer, se déplacer dans les territoires",
  matiere:"geographie", badge:"Géographie",
  accroche:"Dijon-Paris : TGV, voiture, autocar ou avion ? Le plus rapide, est-ce le plus écologique ?",
  manipDes:4, manipJusqua:4,
  init(a){
    const {el}=a;
    // ---------- 1. carte ----------
    const s1=a.layer("s1"); R.s1=s1;
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Dijon → Paris : quatre façons de voyager"},s1);
    const K=5.4, tx=470-399.7*K, ty=490-228.2*K, T=p=>[(p[0]*K+tx).toFixed(1),(p[1]*K+ty).toFixed(1)];
    const cp=el("clipPath",{id:"b4clip"},s1); el("rect",{x:40,y:100,width:860,height:770,rx:16},cp);
    el("rect",{x:40,y:100,width:860,height:770,rx:16,fill:"#DCEBF5",stroke:"#9FB8CC","stroke-width":3},s1);
    const mg=el("g",{"clip-path":"url(#b4clip)"},s1); const mi=el("g",{transform:`translate(${tx},${ty})scale(${K})`},mg);
    F.regions.forEach(r=>el("path",{d:r.d,fill:"#F1F5EC",stroke:"#B8C2CC","stroke-width":1.2/K},mi)); F.deps.forEach(d=>el("path",{d:d.d,fill:"none",stroke:"#C9D2C0","stroke-width":.7/K},mi));
    const P={paris:[337.8,176.1],dijon:[461.6,280.3],combs:[347.6,189.8],lgv1:[380.8,231.6],pasilly:[417.7,255.2],montbard:[428.8,260.5],blaisy:[445.8,278.6],font:[353.4,207.6],auxerre:[393.3,248.6],avallon:[409.1,269.6],pouilly:[439,284.9]};
    const path=(ids)=>"M"+ids.map(k=>T(P[k]).join(",")).join(" L");
    const dTGV=path(["dijon","blaisy","montbard","pasilly","lgv1","combs","paris"]), dRoute=path(["dijon","pouilly","avallon","auxerre","font","paris"]);
    const pa=T(P.paris), pd=T(P.dijon); const dAvion=`M${pd[0]},${pd[1]} Q${(+pa[0]+ +pd[0])/2+30},${(+pa[1]+ +pd[1])/2+30} ${pa[0]},${pa[1]}`;
    R.rt=[["tgv",dTGV,C.tgv,""],["car",dRoute,C.car,""],["bus",dRoute,C.bus,"18 16"],["avi",dAvion,C.avi,"14 10"]].map(([k,d,col,dash],i)=>{ const g=el("g",{},mg);
      if(i!==2) el("path",{d,fill:"none",stroke:"#fff","stroke-width":11,"stroke-linecap":"round","stroke-linejoin":"round"},g);
      g.p=el("path",{d,fill:"none",stroke:col,"stroke-width":i===2?5:7,"stroke-linecap":i===2?"butt":"round","stroke-linejoin":"round",transform:i===2?"translate(7,-3)":null},g); if(dash) g.p.setAttribute("stroke-dasharray",dash); return g; });
    // villes
    [["paris","Paris",18,-20,"start"],["dijon","Dijon",0,58,"middle"]].forEach(([k,n,dx,dy,an])=>{ const p=T(P[k]); const g=el("g",{},mg); el("circle",{cx:p[0],cy:p[1],r:11,fill:C.ink,stroke:"#fff","stroke-width":4},g); el("text",{x:+p[0]+dx,y:+p[1]+dy,"text-anchor":an,"font-size":34,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":7,"paint-order":"stroke",text:n},g); });
    R.rtl=[[0,"TGV",C.tgv,.55,0,0],[1,"Voiture",C.car,.3,-80,0],[2,"Autocar",C.bus,.62,-85,0],[3,"Avion (exemple)",C.avi,.5,100,-10]].map(([i,t,col,f,dx,dy])=>{ const pth=R.rt[i].p; const L=pth.getTotalLength(); const q=pth.getPointAtLength(L*f); const g=el("g",{},s1); a.label(g,q.x+dx,q.y+dy,t,{size:24,stroke:col,color:col}); return g; });
    el("text",{x:470,y:858,"text-anchor":"middle","font-size":22,"font-style":"italic",fill:C.grey,text:"Schéma : les tracés sont approximatifs.",transform:"",opacity:1},s1);
    R.chips=el("g",{},s1); [["À vol d'oiseau : environ 260 km",110],["Par la route : environ 310 km",170]].forEach(([t,y],i)=>{ el("rect",{x:940,y:200+i*90,width:620,height:70,rx:14,fill:"#FFF8E8",stroke:"#C9A14A","stroke-width":3},R.chips); el("text",{x:970,y:246+i*90,"font-size":32,"font-weight":800,fill:C.ink,text:t},R.chips); });
    R.nb=el("g",{},s1); { const t=el("text",{x:940,y:420,"font-size":26,fill:C.grey},R.nb); ["Sur la route, il y a aussi l'autocar. Pour l'avion,","c'est un exemple : aujourd'hui, il n'y a pas de vol","régulier entre Dijon et Paris."].forEach((l,i)=>el("tspan",{x:940,dy:i?34:0,text:l},t)); }
    // ---------- 2. course (centre à centre) ----------
    const s2=a.layer("s2"); R.s2=s2; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s2);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Mesure 1 : le voyage seul, de centre à centre"},s2);
    R.clk=el("text",{x:800,y:150,"text-anchor":"middle","font-size":48,"font-weight":800,fill:C.ink},s2);
    R.lanes=M.map((m,i)=>{ const y=LY[i]; const g=el("g",{},s2); el("rect",{x:330,y:y-50,width:1000,height:100,rx:14,fill:"#F2F4F7"},g); el("line",{x1:345,y1:y,x2:1315,y2:y,stroke:"#C9CED8","stroke-width":4,"stroke-dasharray":"16 12"},g); el("line",{x1:1330,y1:y-50,x2:1330,y2:y+50,stroke:C.ink,"stroke-width":5},g);
      el("text",{x:40,y:y-2,"font-size":32,"font-weight":800,fill:m.col,text:m.nom},g); m.sub.forEach((l,j)=>el("text",{x:40,y:y+30+j*26,"font-size":22,fill:C.grey,text:l},g));
      g.ic=icon(g,m.ic,m.col); g.tt=el("text",{x:1360,y:y+13,"font-size":38,"font-weight":800,fill:m.col},g);
      g.rk=el("g",{},g); el("circle",{cx:1530,cy:y,r:26,fill:"#fff",stroke:m.col,"stroke-width":4},g.rk); g.rkt=el("text",{x:1530,y:y+11,"text-anchor":"middle","font-size":30,"font-weight":800,fill:m.col},g.rk); return g; });
    R.n2=el("text",{x:800,y:850,"text-anchor":"middle","font-size":22,fill:C.grey,text:"Durées usuelles arrondies (horaires de trains, calculateurs d'itinéraire), 2026. Avion : durée d'exemple."},s2);
    // ---------- 3. porte à porte ----------
    const s3=a.layer("s3"); R.s3=s3; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s3);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Mesure 1 bis : du pas de la porte jusqu'à l'arrivée"},s3);
    R.clk3=el("text",{x:800,y:150,"text-anchor":"middle","font-size":48,"font-weight":800,fill:C.ink},s3);
    const X0=340;
    R.bars=M.map((m,i)=>{ const y=LY[i]; const g=el("g",{},s3); el("rect",{x:X0-6,y:y-46,width:290*PX+12,height:92,rx:12,fill:"#F2F4F7"},g);
      el("text",{x:40,y:y+10,"font-size":32,"font-weight":800,fill:m.col,text:m.nom},g);
      let c=0; g.sg=m.seg.map(([k,l])=>{ const r=el("rect",{x:X0+c*PX,y:y-34,width:0,height:68,fill:k==="main"?m.col:C[k],stroke:"#fff","stroke-width":2},g); const o={r,a:c,l}; c+=l; return o; });
      g.tt=el("text",{x:X0+m.tot*PX+20,y:y+14,"font-size":38,"font-weight":800,fill:m.col},g); return g; });
    R.lg3=el("g",{},s3); [[C.ville,"dans la ville : tram, marche, métro"],[C.att,"attente, contrôles, bagages, parking"],["#6B7686","le voyage lui-même (couleur du mode)"]].forEach(([c,t],i)=>{ const x=70+i*520; el("rect",{x,y:800,width:34,height:34,fill:c,stroke:"#9AA3B2","stroke-width":1.5},R.lg3); el("text",{x:x+46,y:828,"font-size":23,fill:C.ink,text:t},R.lg3); });
    R.n3=el("text",{x:800,y:872,"text-anchor":"middle","font-size":22,fill:C.grey,text:"Durées « porte à porte » : exemples réalistes, qui varient selon les personnes et la circulation."},s3);
    // ---------- 4. empreinte CO₂ ----------
    const s4=a.layer("s4"); R.s4=s4; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s4);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Mesure 2 : l'empreinte carbone d'un voyage Dijon → Paris"},s4);
    const BY=745, SC=7; [0,20,40,60].forEach(v=>{ el("line",{x1:210,y1:BY-v*SC,x2:1480,y2:BY-v*SC,stroke:v?"#E3E7EE":C.ink,"stroke-width":v?2:4},s4); el("text",{x:195,y:BY-v*SC+8,"text-anchor":"end","font-size":24,fill:C.grey,text:v+" kg"},s4); });
    el("text",{x:210,y:128,"font-size":26,"font-weight":700,fill:C.grey,text:"kilogrammes de CO₂ émis par passager"},s4);
    R.cols=M.map((m,i)=>{ const x=420+i*290; const g=el("g",{},s4); g.r=el("rect",{x:x-75,y:BY,width:150,height:0,fill:m.col,stroke:C.ink,"stroke-width":3},g); g.v=el("text",{x,y:BY-10,"text-anchor":"middle","font-size":44,"font-weight":800,fill:m.col},g);
      el("text",{x,y:BY+40,"text-anchor":"middle","font-size":30,"font-weight":800,fill:m.col,text:m.nom},g); if(i===3) el("text",{x,y:BY+70,"text-anchor":"middle","font-size":22,fill:C.grey,text:"(exemple théorique)"},g); g.x=x; return g; });
    R.ratio=el("g",{},s4); a.label(R.ratio,1000,170,"L'avion (exemple) : environ 100 fois plus que le TGV",{size:28,stroke:C.avi,color:C.avi});
    R.n4=el("g",{},s4); el("text",{x:800,y:846,"text-anchor":"middle","font-size":22,fill:C.grey,text:"Source : ADEME, Impact CO₂ (impactco2.fr), consulté en octobre 2026. Valeurs arrondies pour 310 km."},R.n4); el("text",{x:800,y:876,"text-anchor":"middle","font-size":22,fill:C.grey,text:"Voiture thermique moyenne : 34 kg (diesel) à 43 kg (essence), on retient environ 40 kg."},R.n4);
    // ---------- 5. manip : les deux mesures ----------
    const s5=a.layer("s5"); R.s5=s5; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s5);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Les deux mesures ensemble : choisissez un moyen de transport"},s5);
    const sx=m=>250+(m-120)*4.4, sy=k=>760-k*8;
    R.gd=el("g",{},s5); el("rect",{x:250,y:sy(8),width:sx(220)-250,height:760-sy(8),fill:"#E8F6EE",stroke:"#2E8B57","stroke-width":2,"stroke-dasharray":"8 6"},R.gd); el("text",{x:262,y:sy(8)-12,"font-size":23,"font-weight":700,fill:"#14532D",text:"rapide et peu polluant"},R.gd);
    R.ax=el("g",{},s5); el("line",{x1:250,y1:760,x2:1110,y2:760,stroke:C.ink,"stroke-width":4},R.ax); el("line",{x1:250,y1:150,x2:250,y2:760,stroke:C.ink,"stroke-width":4},R.ax);
    [120,180,240,300].forEach((m,i)=>{ el("line",{x1:sx(m),y1:754,x2:sx(m),y2:766,stroke:C.ink,"stroke-width":3},R.ax); el("text",{x:sx(m),y:796,"text-anchor":"middle","font-size":24,fill:C.grey,text:(m/60)+" h"},R.ax); });
    [0,20,40,60].forEach(k=>{ el("text",{x:236,y:sy(k)+8,"text-anchor":"end","font-size":24,fill:C.grey,text:k},R.ax); });
    el("text",{x:680,y:838,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:"Durée porte à porte (exemple) →"},R.ax); el("text",{x:250,y:136,"font-size":26,"font-weight":700,fill:C.ink,text:"↑ kg de CO₂ par passager"},R.ax);
    R.pts=M.map((m,i)=>{ const x=sx(m.tot), y=sy(m.co2); const g=el("g",{},s5); g.ring=el("circle",{cx:x,cy:y,r:46,fill:"none",stroke:m.col,"stroke-width":6,"stroke-dasharray":"10 8"},g); g.dot=el("circle",{cx:x,cy:y,r:26,fill:m.col,stroke:"#fff","stroke-width":4},g); const right=i!==2; g.lb=el("text",{x:x+(right?64:-64),y:i===0?y-16:y+10,"text-anchor":right?"start":"end","font-size":30,"font-weight":800,fill:m.col,text:m.nom},g); g.x=x; g.y=y; return g; });
    R.card=el("g",{},s5); el("rect",{x:1180,y:150,width:390,height:600,rx:18,fill:"#fff",stroke:C.ink,"stroke-width":4},R.card);
    R.cn=el("text",{x:1204,y:206,"font-size":40,"font-weight":800},R.card); R.c1=el("text",{x:1204,y:262,"font-size":24,fill:C.grey},R.card); R.c1b=el("text",{x:1204,y:310,"font-size":44,"font-weight":800,fill:C.ink},R.card);
    R.c2=el("text",{x:1204,y:366,"font-size":24,fill:C.grey},R.card); R.c2b=el("text",{x:1204,y:414,"font-size":44,"font-weight":800,fill:C.ink},R.card);
    R.c3=el("text",{x:1204,y:470,"font-size":24,fill:C.grey},R.card); R.c3b=el("text",{x:1204,y:518,"font-size":44,"font-weight":800,fill:C.ink},R.card);
    R.cbar=el("g",{},R.card); R.cdet=el("text",{x:1204,y:636,"font-size":23,fill:C.ink},R.card);
    // ---------- 6. synthèse ----------
    const s6=a.layer("s6"); R.s6=s6; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s6);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Ce qu'il faut retenir"},s6);
    R.sy=[["1","Le voyage seul ne suffit pas","Il faut compter le trajet\njusqu'à la gare ou l'aéroport,\net l'attente."],["2","Sur Dijon-Paris, le TGV gagne","≈ 2 h 30 porte à porte,\net moins de 1 kg de CO₂\npar passager."],["3","Vite, mais pas écologique","L'avion (exemple) : ≈ 70 kg de CO₂\net pas plus rapide au total."]].map(([n,h,b],i)=>{ const g=el("g",{},s6); const x=60+i*505; el("rect",{x,y:100,width:470,height:310,rx:18,fill:"#F1F7F5",stroke:"#1C6E61","stroke-width":4},g); el("circle",{cx:x+46,cy:152,r:26,fill:"#1C6E61"},g); el("text",{x:x+46,y:163,"text-anchor":"middle","font-size":32,"font-weight":800,fill:"#fff",text:n},g); const th=el("text",{x:x+86,y:162,"font-size":27,"font-weight":800,fill:"#1C6E61"},g); a.wrap(th,h,22,1.1); const t=el("text",{x:x+28,y:250,"font-size":26,fill:C.ink},g); b.split("\n").forEach((l,j)=>el("tspan",{x:x+28,dy:j?40:0,text:l},t)); return g; });
    R.myth=el("g",{},s6); a.myth(R.myth,120,450,1360,"L'avion est toujours le plus rapide.","Non : sur une distance courte, le trajet jusqu'à l'aéroport, les contrôles et l'attente font perdre beaucoup de temps. Dijon-Paris : le TGV arrive avant, et pollue bien moins.");
    // ---------- photos ----------
    const ph=a.layer("photos");
    R.ph1=a.photo(ph,{id:"g-b4-tgv-dijon",x:940,y:545,w:280,h:185,cap:"Un TGV à Dijon",rot:-2});
    R.ph2=a.photo(ph,{id:"g-b4-tram-dijon",x:1270,y:545,w:280,h:185,cap:"Le tramway de Dijon",rot:2});
    // manipulation
    a.manip.innerHTML=`Moyen de transport : ${M.map((m,i)=>`<button id="mB${i}"${i===0?' class="sel"':''}>${m.nom}</button>`).join("")}`;
    M.forEach((m,i)=>{ document.getElementById("mB"+i).onclick=()=>{ sel=i; M.forEach((_,j)=>document.getElementById("mB"+j).classList.toggle("sel",j===i)); a.redraw(); }; });
  },
  reset(a){ [R.s1,R.s2,R.s3,R.s4,R.s5,R.s6,R.myth,R.ph1,R.ph2,...R.rt,...R.rtl,R.chips,R.nb,R.ratio,R.gd,R.ax,R.card,...R.pts].forEach(e=>a.op(e,0)); },
  etapes:[
  { titre:"Quatre façons de voyager", duree:11000,
    legende:"De Dijon à Paris, on peut prendre le TGV, la voiture, l'autocar ou l'avion. Ces trajets font environ 260 km à vol d'oiseau et 310 km par la route.",
    voix:"Pour aller de Dijon à Paris, plusieurs choix : le T G V, la voiture, l'autocar, ou, comme exemple, l'avion. À vol d'oiseau, il y a environ deux cent soixante kilomètres. Par la route, environ trois cent dix. Attention : aujourd'hui, il n'y a pas de vol régulier entre Dijon et Paris. L'avion est donc un exemple pour comparer.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1); R.rt.forEach((g,i)=>{ const v=s(t,.05+i*.17,.25+i*.17); a.op(g,v>0?1:0); a.draw(g.p,v); a.op(R.rtl[i],s(t,.2+i*.17,.3+i*.17)); }); a.op(R.chips,s(t,.72,.85)); a.op(R.nb,s(t,.8,.92)); a.op(R.ph1,s(t,.82,.95)); a.op(R.ph2,s(t,.86,.98)); } },
  { titre:"Mesure 1 : la course, de centre à centre", duree:12000,
    legende:"Regardons le temps du voyage seul. En vol, l'avion de l'exemple va le plus vite (45 min). Puis viennent le TGV (1 h 35), la voiture (3 h) et l'autocar (3 h 50).",
    voix:"Première mesure : le temps. Regardons le voyage seul, de centre à centre. L'avion de notre exemple est le plus rapide : quarante-cinq minutes en vol. Puis arrive le T G V, en une heure trente-cinq. La voiture met environ trois heures, et l'autocar environ trois heures cinquante.",
    anim(t,a){ const s=a.seg; a.op(R.s1,1-s(t,0,.08)); a.op(R.s2,s(t,0,.08)); a.op(R.ph1,0); a.op(R.ph2,0); const clock=230*s(t,.1,.9,true); R.clk.textContent="Horloge : "+fmt(clock);
      const order=[3,0,1,2]; M.forEach((m,i)=>{ const g=R.lanes[i]; const p=Math.min(1,clock/m.main); a.tr(g.ic,330+60+p*(1000-120),LY[i]); const done=p>=1; g.tt.textContent=done?fmt(m.main):""; a.op(g.rk,done?1:0); g.rkt.textContent=order.indexOf(i)+1; }); } },
  { titre:"Mesure 1 bis : de la porte à la porte", duree:13000,
    legende:"Mais on ne part pas du centre ! Il faut aller à la gare ou à l'aéroport, attendre, puis rejoindre sa destination. Résultat (exemple) : le TGV arrive en premier, l'avion perd sa place.",
    voix:"Mais personne ne part du centre ! Il faut aller jusqu'à la gare ou à l'aéroport, attendre, passer les contrôles, puis rejoindre sa destination. Comptons le trajet complet, de la porte à la porte. Voyez : l'avion perd beaucoup de temps avec l'aéroport et les contrôles, et c'est le T G V qui arrive en premier, en deux heures trente environ.",
    anim(t,a){ const s=a.seg; a.op(R.s2,1-s(t,0,.08)); a.op(R.s3,s(t,0,.08)); const clock=285*s(t,.1,.88,true); R.clk3.textContent="Horloge : "+fmt(clock); a.op(R.lg3,s(t,.05,.15));
      M.forEach((m,i)=>{ const g=R.bars[i]; g.sg.forEach(o=>{ const w=Math.max(0,Math.min(o.l,clock-o.a)); o.r.setAttribute("width",w*PX); }); g.tt.textContent=clock>=m.tot?fmt(m.tot):""; }); } },
  { titre:"Mesure 2 : l'empreinte carbone", duree:12000,
    legende:"Deuxième mesure : le CO₂ rejeté par passager. Le TGV : moins de 1 kg. L'autocar : 10 kg. La voiture : 40 kg. L'avion (exemple) : 70 kg, soit 100 fois plus que le TGV !",
    voix:"Deuxième mesure : les gaz à effet de serre. Pour un voyage de Dijon à Paris, un passager de T G V rejette moins d'un kilogramme de dioxyde de carbone. En autocar, environ dix kilogrammes. En voiture, environ quarante. Et en avion, dans notre exemple, environ soixante-dix : cent fois plus que le T G V !",
    anim(t,a){ const s=a.seg; a.op(R.s3,1-s(t,0,.08)); a.op(R.s4,s(t,0,.08)); M.forEach((m,i)=>{ const g=R.cols[i]; const v=s(t,.1+i*.1,.55+i*.1); const h=m.co2*7*v; g.r.setAttribute("y",745-h); g.r.setAttribute("height",h); g.v.setAttribute("y",745-h-12); g.v.textContent=v>0?"≈ "+(m.co2<1?fk(Math.max(.1,+(m.co2*v).toFixed(1))):Math.max(1,Math.round(m.co2*v)))+" kg":""; }); a.op(R.ratio,s(t,.88,.98)); } },
  { titre:"À vous : choisissez un moyen de transport", duree:9000,
    legende:"À vous : choisissez un moyen de transport avec les boutons et regardez où il se place : durée porte à porte et CO₂. Le meilleur est en bas à gauche.",
    voix:"À vous de jouer ! Choisissez un moyen de transport avec les boutons, et regardez où il se place sur le graphique. Plus un point est à gauche, plus le trajet est rapide. Plus il est bas, moins il pollue. Quel moyen de transport est à la fois rapide et peu polluant ?",
    anim(t,a){ const s=a.seg; a.op(R.s4,0); a.op(R.s5,s(t,0,.1)); a.op(R.gd,s(t,.05,.15)); a.op(R.ax,s(t,.05,.15)); M.forEach((m,i)=>{ const g=R.pts[i]; a.op(g,s(t,.15+i*.08,.3+i*.08)); const on=i===sel; g.ring.setAttribute("opacity",on?1:0); g.dot.setAttribute("r",on?32:22); g.lb.setAttribute("font-size",on?36:28); });
      const m=M[sel]; a.op(R.card,s(t,.3,.45)); R.cn.textContent=m.nom; R.cn.setAttribute("fill",m.col);
      R.c1.textContent="Voyage seul"; R.c1b.textContent=fmt(m.main); R.c2.textContent="Porte à porte (exemple)"; R.c2b.textContent=fmt(m.tot); R.c3.textContent="CO₂ par passager"; R.c3b.textContent=(m.co2<1?"moins de 1 kg":"≈ "+m.co2+" kg");
      while(R.cbar.firstChild) R.cbar.removeChild(R.cbar.firstChild); const Wc=350, sc=Wc/285; let c=0; m.seg.forEach(([k,l])=>{ a.el("rect",{x:1204+c*sc,y:560,width:l*sc,height:46,fill:k==="main"?m.col:C[k],stroke:"#fff","stroke-width":2},R.cbar); c+=l; });
      a.wrap(R.cdet,({TGV:"Barre : tram (gris-bleu), attente (jaune), TGV, métro (gris-bleu).",Voiture:"Barre : départ (gris-bleu), route, parking (jaune).",Autocar:"Barre : gare routière (gris-bleu), attente (jaune), autocar, métro (gris-bleu).",Avion:"Barre : aéroport, contrôles et bagages (jaune), vol, centre-ville."})[m.nom],27,1.25); } },
  { titre:"Synthèse", duree:11000,
    legende:"Pour comparer des transports, on mesure le temps du trajet complet et l'empreinte carbone. Sur Dijon-Paris, le TGV est à la fois rapide et peu polluant.",
    voix:"Pour résumer : pour comparer des transports, il faut mesurer le temps du trajet complet, pas seulement le voyage, et aussi les gaz à effet de serre. Sur Dijon-Paris, le T G V est à la fois rapide et peu polluant. Et l'avion n'est pas toujours le plus rapide !",
    anim(t,a){ const s=a.seg; a.op(R.s5,0); a.op(R.s6,s(t,0,.1)); R.sy.forEach((g,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.myth,s(t,.65,.8)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
