/* META {"id":"geo-B5-ville-campagne-peri-urbain","matiere":"geographie","annee":"B","periode":1,"theme":"Découper, mesurer, se déplacer dans les territoires","resume":"Autour de Dijon : centre-ville, banlieue, périurbain, campagne ; trajets domicile-travail et étalement urbain, un continuum.","motsCles":["ville","campagne","périurbain","banlieue","étalement urbain","domicile-travail","Dijon","continuum"]} */
//@data france
(function(){
const F=FRANCE, R={}; let yr=1950, touched=false;
const C={cen:"#B03A2E",ban:"#F39C4A",per:"#F7DC6F",cam:"#A9D98C",ink:"#1E2430",grey:"#4A5468",am:"#2563A8",pm:"#E07A1F"};
const DJ=F.communes.find(c=>c.nom==="Dijon").c;
const K=3.4, TX=470-DJ[0]*K, TY=485-DJ[1]*K;
const T=p=>[TX+p[0]*K,TY+p[1]*K];
const dist=c=>Math.hypot(c.c[0]-DJ[0],c.c[1]-DJ[1]);
const zone=d=>d<=0.5?0:d<=45?1:d<=90?2:3;           // 0 centre, 1 banlieue, 2 périurbain, 3 campagne
const ZC=[C.cen,C.ban,C.per,C.cam];
const ZN=["Centre-ville","Banlieue","Périurbain","Campagne"];
// année (schéma) à laquelle une commune devient « urbanisée » : plus elle est loin, plus c'est tard
const uyear=d=>1940+d*.9;
const ucol=u=>u<1960?"#7A2E1D":u<1980?"#C0392B":u<2000?"#F39C4A":"#F7DC6F";
const FLOWS=["Genlis","Gevrey-Chambertin","Fleurey-sur-Ouche","Arc-sur-Tille","Fénay","Messigny-et-Vantoux","Chenôve","Quetigny","Talant"];
const cdot=(a,v)=>{ a.op(R.cdot,v); a.op(R.cdotL,v); };
Anim.run({
  titre:"Ville, périurbain, campagne autour de Dijon",
  sousTitre:"Géographie · CM1-CM2 · Thème 1 : découper, mesurer, se déplacer dans les territoires",
  matiere:"geographie", badge:"Géographie",
  accroche:"Vit-on soit en ville, soit à la campagne ? Regardons autour de Dijon.",
  manipDes:3, manipJusqua:3,
  init(a){
    const {el}=a;
    // ---------- carte réelle des communes autour de Dijon ----------
    const mp=a.layer("map"); R.mp=mp;
    const cp=el("clipPath",{id:"b5clip"},mp); el("rect",{x:40,y:100,width:860,height:770,rx:16},cp);
    el("rect",{x:40,y:100,width:860,height:770,rx:16,fill:"#EEF2E8",stroke:"#9FB8CC","stroke-width":3},mp);
    const mg=el("g",{"clip-path":"url(#b5clip)"},mp); const mi=el("g",{transform:`translate(${TX},${TY})scale(${K})`},mg);
    R.cm=F.communes.filter(c=>dist(c)<=215).map(c=>{ const p=el("path",{d:c.d,fill:"#EEF2E8",stroke:"#7F8C6F","stroke-width":.8/K,"stroke-linejoin":"round"},mi); p._c=c; p._d=dist(c); p._z=zone(dist(c)); p._u=uyear(dist(c)); return p; });
    R.dijP=R.cm.find(p=>p._c.nom==="Dijon");
    R.cdot=el("g",{},mp); { const q=T(DJ); el("circle",{cx:q[0],cy:q[1],r:9,fill:C.ink,stroke:"#fff","stroke-width":3},R.cdot); R.cdotQ=q; }
    el("text",{x:470,y:858,"text-anchor":"middle","font-size":22,"font-style":"italic",fill:C.grey,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:"Communes réelles autour de Dijon ; zones et couleurs : schéma."},mp);
    // ---------- 1. légende des zones ----------
    const s1=a.layer("s1"); R.s1=s1;
    R.zc=ZN.map((n,i)=>{ const g=el("g",{},s1); const y=130+i*125; el("rect",{x:940,y,width:620,height:104,rx:16,fill:"#fff",stroke:ZC[i],"stroke-width":5},g); el("rect",{x:956,y:y+16,width:44,height:72,rx:8,fill:ZC[i],stroke:C.ink,"stroke-width":2},g);
      el("text",{x:1020,y:y+46,"font-size":32,"font-weight":800,fill:C.ink,text:n},g); el("text",{x:1020,y:y+82,"font-size":24,fill:C.grey,text:["Immeubles serrés, commerces, tramway","Immeubles et maisons, la ville continue","Maisons avec jardin, lotissements, voiture","Villages, champs, forêts, peu de monde"][i]},g); return g; });
    el("text",{x:940,y:662,"font-size":26,"font-weight":700,fill:C.ink,text:"Plus on s'éloigne du centre…"},s1);
    el("text",{x:940,y:700,"font-size":26,fill:C.ink,text:"… moins il y a d'habitants par km²."},s1);
    // ---------- 2. coupe du centre à la campagne ----------
    const s2=a.layer("s2"); R.s2=s2; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s2);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Schéma en coupe : du centre-ville à la campagne"},s2);
    const ZX=[40,420,800,1180,1560]; el("rect",{x:40,y:100,width:1520,height:360,fill:"#E3F1FA"},s2);
    R.cz=[0,1,2,3].map(i=>{ const g=el("g",{},s2); el("rect",{x:ZX[i],y:100,width:ZX[i+1]-ZX[i],height:360,fill:ZC[i],"fill-opacity":.13},g); return g; });
    // sol
    R.gr=el("g",{},s2); el("rect",{x:40,y:460,width:1520,height:30,fill:"#8A7B5E"},R.gr); el("rect",{x:1180,y:460,width:380,height:30,fill:"#7BAE5A"},R.gr); el("rect",{x:800,y:460,width:380,height:30,fill:"#9BC476"},R.gr);
    const bld=(g,x,w,h0,col)=>{ const h=h0*.58; el("rect",{x,y:460-h,width:w,height:h,fill:col,stroke:C.ink,"stroke-width":2.5},g); for(let yy=460-h+14;yy<440;yy+=30) for(let xx=x+8;xx<x+w-14;xx+=24) el("rect",{x:xx,y:yy,width:12,height:16,fill:"#CFE6F5",stroke:C.ink,"stroke-width":1},g); };
    const house=(g,x,col)=>{ el("rect",{x,y:424,width:58,height:36,fill:col,stroke:C.ink,"stroke-width":2.5},g); el("path",{d:`M${x-6},424 L${x+29},394 L${x+64},424Z`,fill:"#C0583B",stroke:C.ink,"stroke-width":2.5},g); el("rect",{x:x+22,y:438,width:14,height:22,fill:"#8A5A2B"},g); };
    const tree=(g,x,s)=>{ el("rect",{x:x-3,y:460-26*s,width:6,height:26*s,fill:"#6B4A2B"},g); el("circle",{cx:x,cy:460-34*s,r:16*s,fill:"#4F9A4B",stroke:"#2F6B2C","stroke-width":2},g); };
    R.sc=[0,1,2,3].map(i=>{ const g=el("g",{},s2);
      if(i===0){ [[60,70,250,"#E9C9A0"],[132,60,300,"#D9B78C"],[194,66,220,"#EAD2B0"],[262,70,330,"#CBA77D"],[334,66,260,"#E3C39B"]].forEach(([x,w,h,c])=>bld(g,x,w,h,c));
        el("rect",{x:60,y:470,width:340,height:8,fill:C.ink},g); const tr=el("g",{},g); el("rect",{x:150,y:430,width:130,height:34,rx:8,fill:"#2563A8",stroke:C.ink,"stroke-width":2.5},tr); [160,188,216,244].forEach(x=>el("rect",{x,y:438,width:18,height:12,fill:"#E6F0FA"},tr)); el("line",{x1:215,y1:430,x2:215,y2:412,stroke:C.ink,"stroke-width":3},tr); }
      if(i===1){ [[440,70,170,"#E3C39B"],[516,66,130,"#EAD2B0"],[590,70,150,"#D9B78C"]].forEach(([x,w,h,c])=>bld(g,x,w,h,c)); house(g,680,"#F4E3C7"); house(g,750,"#F2D9B0"); tree(g,665,1); tree(g,745,.8); }
      if(i===2){ [830,925,1020,1100].forEach((x,k)=>house(g,x,["#F4E3C7","#F6D58A","#F4E3C7","#E9B58A"][k])); [905,1005,1090,1165].forEach((x,k)=>tree(g,x,.9)); const car=el("g",{},g); el("rect",{x:872,y:446,width:34,height:12,rx:4,fill:C.car||"#C0392B",stroke:C.ink,"stroke-width":1.5},car); }
      if(i===3){ el("rect",{x:1210,y:400,width:80,height:60,fill:"#C9553A",stroke:C.ink,"stroke-width":2.5},g); el("path",{d:"M1200,400 L1250,368 L1300,400Z",fill:"#7A3B2A",stroke:C.ink,"stroke-width":2.5},g); el("rect",{x:1300,y:380,width:26,height:80,fill:"#D8D8D8",stroke:C.ink,"stroke-width":2.5},g); [1350,1410,1470,1530].forEach(x=>tree(g,x,1.25)); el("rect",{x:1210,y:476,width:330,height:4,fill:"#BFB08A"},g); }
      return g; });
    // pictogrammes de densité (points = habitants, exemple)
    R.dn=[48,24,9,2].map((n,i)=>{ const g=el("g",{},s2); const x0=ZX[i]+30; for(let k=0;k<n;k++) el("circle",{cx:x0+(k%12)*29+((Math.floor(k/12))%2)*10,cy:182+Math.floor(k/12)*26,r:9,fill:ZC[i]==="#F7DC6F"?"#C7A800":ZC[i],stroke:C.ink,"stroke-width":1.5},g); return g; });
    R.dt=el("text",{x:800,y:140,"text-anchor":"middle","font-size":26,"font-weight":700,fill:C.ink,text:"Habitants sur un même carré de terrain (exemple) :"},s2);
    R.zl=ZN.map((n,i)=>{ const g=el("g",{},s2); const cx=(ZX[i]+ZX[i+1])/2; el("rect",{x:ZX[i]+8,y:500,width:ZX[i+1]-ZX[i]-16,height:76,rx:12,fill:"#fff",stroke:ZC[i],"stroke-width":4},g); el("text",{x:cx,y:534,"text-anchor":"middle","font-size":30,"font-weight":800,fill:C.ink,text:n},g); el("text",{x:cx,y:564,"text-anchor":"middle","font-size":22,fill:C.grey,text:["immeubles serrés","immeubles et maisons","maisons, jardins","champs, villages"][i]},g); return g; });
    R.cont=el("g",{},s2); a.arrow(R.cont,"M120,616 L1480,616",{color:"#7A8696",w:8,head:3}); { const q=a.label(R.cont,800,616,"un continuum : on passe peu à peu de la ville à la campagne",{size:26,stroke:"#7A8696",color:C.ink}); }
    // ---------- 3. domicile-travail ----------
    const s3=a.layer("s3"); R.s3=s3;
    R.clk=el("g",{},s3); R.clkT=el("text",{x:80,y:170,"font-size":54,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":8,"paint-order":"stroke"},R.clk); R.clkS=el("text",{x:80,y:214,"font-size":30,"font-weight":800,stroke:"#fff","stroke-width":7,"paint-order":"stroke"},R.clk);
    R.fl=FLOWS.map(nm=>{ const c=F.communes.find(x=>x.nom===nm); const a0=T(c.c), b0=T(DJ); const mx=(a0[0]+b0[0])/2, my=(a0[1]+b0[1])/2; const nx=-(b0[1]-a0[1]), ny=b0[0]-a0[0]; const nl=Math.hypot(nx,ny); const cx=mx+nx/nl*40, cy=my+ny/nl*40;
      const dIn=`M${a0[0]},${a0[1]} Q${cx},${cy} ${b0[0]-(b0[0]-cx)*.1},${b0[1]-(b0[1]-cy)*.1}`; const dOut=`M${b0[0]+(cx-b0[0])*.12},${b0[1]+(cy-b0[1])*.12} Q${cx},${cy} ${a0[0]},${a0[1]}`;
      const gi=a.arrow(s3,dIn,{color:C.am,w:6,head:3.2}), go=a.arrow(s3,dOut,{color:C.pm,w:6,head:3.2});
      const dots=[0,1,2].map(()=>el("circle",{r:7,fill:"#fff",stroke:C.ink,"stroke-width":2},s3)); const dots2=[0,1,2].map(()=>el("circle",{r:7,fill:"#fff",stroke:C.ink,"stroke-width":2},s3));
      const lab=el("text",{x:a0[0],y:a0[1]+(a0[1]>485?32:-14),"text-anchor":"middle","font-size":22,"font-weight":700,fill:C.ink,stroke:"#fff","stroke-width":5,"paint-order":"stroke",text:nm},s3);
      return {gi,go,dots,dots2,lab,pi:gi.path,po:go.path}; });
    R.pn3=el("g",{},s3);
    [["Le matin",C.am,"On part de chez soi (périurbain, banlieue)","vers le centre : emplois, écoles, commerces."],["Le soir",C.pm,"On rentre chez soi,","du centre vers l'extérieur."]].forEach(([h,col,l1,l2],i)=>{ const g=el("g",{},R.pn3); const y=150+i*190; el("rect",{x:940,y,width:620,height:160,rx:16,fill:"#fff",stroke:col,"stroke-width":5},g); el("text",{x:970,y:y+48,"font-size":34,"font-weight":800,fill:col,text:h},g); el("text",{x:970,y:y+92,"font-size":25,fill:C.ink,text:l1},g); el("text",{x:970,y:y+128,"font-size":25,fill:C.ink,text:l2},g); R["pn3_"+i]=g; });
    R.pn3b=el("g",{},s3); el("rect",{x:940,y:540,width:620,height:200,rx:16,fill:"#FFF8E8",stroke:"#C9A14A","stroke-width":4},R.pn3b);
    { const t=el("text",{x:970,y:590,"font-size":27,"font-weight":700,fill:C.ink},R.pn3b); ["Beaucoup d'emplois sont au centre,","beaucoup de logements sont loin :","ce sont les déplacements","domicile-travail (souvent en voiture)."].forEach((l,i)=>el("tspan",{x:970,dy:i?38:0,text:l},t)); }
    // ---------- 4. étalement (manipulation) ----------
    const s4=a.layer("s4"); R.s4=s4;
    R.yT=el("text",{x:80,y:180,"font-size":84,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":10,"paint-order":"stroke"},s4);
    R.lg4=el("g",{},s4); [["#7A2E1D","avant 1960"],["#C0392B","de 1960 à 1980"],["#F39C4A","de 1980 à 2000"],["#F7DC6F","après 2000"]].forEach(([c,t],i)=>{ const y=170+i*76; el("rect",{x:960,y,width:50,height:50,rx:8,fill:c,stroke:C.ink,"stroke-width":2},R.lg4); el("text",{x:1030,y:y+36,"font-size":30,"font-weight":700,fill:C.ink,text:t},R.lg4); });
    el("text",{x:940,y:130,"font-size":28,"font-weight":800,fill:C.ink,text:"Quand la commune devient « ville » (schéma)"},R.lg4);
    R.tx4=el("g",{},s4); el("rect",{x:940,y:500,width:620,height:240,rx:16,fill:"#FFF8E8",stroke:"#C9A14A","stroke-width":4},R.tx4); { const t=el("text",{x:970,y:552,"font-size":28,"font-weight":700,fill:C.ink},R.tx4); ["La zone bâtie s'étend de plus en plus","loin du centre : c'est l'étalement urbain.","Schéma : les dates sont des exemples,","pas des dates réelles."].forEach((l,i)=>el("tspan",{x:970,dy:i?42:0,text:l},t)); }
    R.tl=el("g",{},s4); { el("line",{x1:960,y1:790,x2:1540,y2:790,stroke:C.ink,"stroke-width":5},R.tl); [1950,1970,1990,2020].forEach(v=>{ const x=960+(v-1950)/70*580; el("line",{x1:x,y1:780,x2:x,y2:800,stroke:C.ink,"stroke-width":4},R.tl); el("text",{x,y:834,"text-anchor":"middle","font-size":24,fill:C.grey,text:v},R.tl); }); R.tm=el("circle",{cx:960,cy:790,r:15,fill:C.ban,stroke:C.ink,"stroke-width":4},R.tl); }
    // ---------- 5. synthèse ----------
    const s5=a.layer("s5"); R.s5=s5; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},s5);
    el("text",{x:800,y:56,"text-anchor":"middle","font-size":36,"font-weight":800,fill:C.ink,text:"Ville ou campagne ? Un continuum"},s5);
    R.bar=ZN.map((n,i)=>{ const g=el("g",{},s5); const x=60+i*385; el("rect",{x,y:110,width:350,height:150,rx:18,fill:ZC[i],stroke:C.ink,"stroke-width":4},g); el("text",{x:x+175,y:172,"text-anchor":"middle","font-size":34,"font-weight":800,fill:C.ink,text:n},g); el("text",{x:x+175,y:218,"text-anchor":"middle","font-size":26,fill:C.ink,text:["très dense","dense","peu dense","très peu dense"][i]},g); return g; });
    R.ar5=el("g",{},s5); a.arrow(R.ar5,"M80,296 L1520,296",{color:"#7A8696",w:8,head:3}); el("text",{x:800,y:350,"text-anchor":"middle","font-size":28,"font-weight":700,fill:C.ink,text:"De moins en moins d'habitants par km², de plus en plus de nature ; de plus en plus de voiture"},R.ar5);
    R.myth=el("g",{},s5); a.myth(R.myth,120,420,1360,"On vit soit en ville, soit à la campagne.","Entre les deux, il y a la banlieue et le périurbain : beaucoup d'habitants y vivent. Du centre aux champs, on passe peu à peu d'un paysage à l'autre : c'est un continuum.");
    R.cdotL=a.layer("dijl"); a.label(R.cdotL,R.cdotQ[0]+66,R.cdotQ[1]-58,"Dijon",{size:26,stroke:C.ink,color:C.ink});
    // ---------- photos ----------
    const ph=a.layer("photos");
    R.ph1=a.photo(ph,{id:"g-b5-dijon-aerienne",x:150,y:650,w:270,h:135,cap:"Dijon vu du ciel",rot:-2});
    R.ph2=a.photo(ph,{id:"g-b5-lotissement",x:930,y:650,w:270,h:135,cap:"Un lotissement vu du ciel",rot:2});
    // manipulation
    a.manip.innerHTML=`Année : <input type="range" id="mY" min="1950" max="2020" step="5" value="1950"> <span id="mYv">1950</span>`;
    document.getElementById("mY").oninput=e=>{ yr=+e.target.value; touched=true; a.redraw(); };
    R.mY=document.getElementById("mY"); R.mYv=document.getElementById("mYv");
  },
  reset(a){ [R.mp,R.s1,R.s2,R.s3,R.s4,R.s5,R.myth,R.ph1,R.ph2,R.cdot,R.cdotL,R.pn3,R.pn3b,R.tx4,R.tl,R.lg4,R.clk,...R.zc,...R.fl.map(f=>f.lab)].forEach(e=>a.op(e,0)); R.fl.forEach(f=>{ a.op(f.gi,0); a.op(f.go,0); f.dots.concat(f.dots2).forEach(d=>a.op(d,0)); }); R.cm.forEach(p=>{ p.setAttribute("fill","#EEF2E8"); p.setAttribute("fill-opacity",1); }); },
  etapes:[
  { titre:"Autour de Dijon : quatre zones", duree:12000,
    legende:"Autour de Dijon, on passe peu à peu du centre-ville à la banlieue, au périurbain, puis à la campagne. Plus on s'éloigne, moins il y a d'habitants au km².",
    voix:"Voici Dijon et les communes autour. Au centre, le centre-ville : immeubles serrés, commerces, tramway. Autour, la banlieue : des immeubles et des maisons, la ville continue. Plus loin, le périurbain : des maisons avec jardin, des lotissements, où l'on prend surtout la voiture. Et encore plus loin, la campagne : des villages, des champs et des forêts. Plus on s'éloigne du centre, moins il y a d'habitants sur un kilomètre carré.",
    anim(t,a){ const s=a.seg; a.op(R.mp,1); a.op(R.s1,1); cdot(a,s(t,.02,.1)); const sp=[[.1,.22],[.24,.42],[.44,.62],[.64,.82]];
      R.cm.forEach(p=>{ const z=p._z; p.setAttribute("fill",ZC[z]); p.setAttribute("fill-opacity",.85*s(t,sp[z][0],sp[z][1])); }); R.zc.forEach((g,i)=>a.op(g,s(t,sp[i][0]-.02,sp[i][0]+.1))); } },
  { titre:"Une coupe : un continuum", duree:12000,
    legende:"Vu de côté, le paysage change peu à peu : immeubles serrés au centre, maisons avec jardin plus loin, champs et villages ensuite. Il n'y a pas de frontière nette.",
    voix:"Regardons le paysage vu de côté, du centre-ville jusqu'à la campagne. Au centre, des immeubles serrés et un tramway. Puis des immeubles et des maisons. Ensuite, des maisons avec jardin, ce que l'on appelle des lotissements. Enfin, des champs et des fermes. Remarquez : il n'y a pas de frontière nette. On passe peu à peu de la ville à la campagne : c'est un continuum.",
    anim(t,a){ const s=a.seg; a.op(R.mp,0); a.op(R.s1,0); cdot(a,0); a.op(R.s2,s(t,0,.08)); R.cz.forEach((g,i)=>a.op(g,s(t,.05+i*.12,.15+i*.12))); R.sc.forEach((g,i)=>{ const v=s(t,.1+i*.14,.25+i*.14); a.op(g,v); a.tr(g,0,(1-v)*40); }); a.op(R.dt,s(t,.55,.65)); R.dn.forEach((g,i)=>a.op(g,s(t,.58+i*.05,.68+i*.05))); R.zl.forEach((g,i)=>a.op(g,s(t,.65+i*.05,.75+i*.05))); a.op(R.cont,s(t,.85,.95)); a.op(R.ph1,s(t,.8,.92)); a.op(R.ph2,s(t,.84,.96)); } },
  { titre:"Aller travailler : matin et soir", duree:14000,
    legende:"Le matin, beaucoup d'habitants du périurbain et de la banlieue vont travailler vers le centre. Le soir, ils repartent vers l'extérieur : ce sont les déplacements domicile-travail.",
    voix:"Regardons les déplacements d'une journée. Le matin, beaucoup d'habitants de la banlieue et du périurbain partent travailler vers le centre, où se trouvent beaucoup d'emplois. Le soir, ils repartent dans l'autre sens, vers leur domicile. On appelle cela les déplacements domicile-travail. Dans le périurbain, ils se font souvent en voiture.",
    anim(t,a){ const s=a.seg; a.op(R.s2,0); a.op(R.ph1,0); a.op(R.ph2,0); a.op(R.mp,1); cdot(a,1); a.op(R.s3,1); R.cm.forEach(p=>{ p.setAttribute("fill",ZC[p._z]); p.setAttribute("fill-opacity",.4); });
      const mor=s(t,.04,.4), eve=s(t,.52,.9); const clock=t<.46?7+2*s(t,.04,.4,true):17+2*s(t,.52,.9,true); R.clkT.textContent=Math.floor(clock)+" h "+String(Math.round((clock%1)*60)).padStart(2,"0"); R.clkS.textContent=t<.46?"Le matin : vers le centre":"Le soir : vers l'extérieur"; R.clkS.setAttribute("fill",t<.46?C.am:C.pm); a.op(R.clk,s(t,0,.04));
      a.op(R.pn3,1); a.op(R.pn3_0,s(t,.04,.14)); a.op(R.pn3_1,s(t,.5,.6)); a.op(R.pn3b,s(t,.9,.98));
      R.fl.forEach((f,i)=>{ a.op(f.lab,s(t,.02+i*.02,.12+i*.02)); const vi=mor, vo=eve; const showIn=t<.46, showOut=t>=.46;
        a.op(f.gi,showIn&&vi>0?1:0); a.draw(f.pi,vi); a.op(f.go,showOut&&vo>0?1:0); a.draw(f.po,vo);
        f.dots.forEach((d,k)=>{ const ph=((mor*2.2)+k/3+i*.13)%1; if(showIn&&vi>0&&vi<1){ const q=a.along(f.pi,ph*vi); d.setAttribute("cx",q.x); d.setAttribute("cy",q.y); a.op(d,1);} else a.op(d,0); });
        f.dots2.forEach((d,k)=>{ const ph=((eve*2.2)+k/3+i*.13)%1; if(showOut&&vo>0&&vo<1){ const q=a.along(f.po,ph*vo); d.setAttribute("cx",q.x); d.setAttribute("cy",q.y); a.op(d,1);} else a.op(d,0); }); }); } },
  { titre:"À vous : l'étalement urbain", duree:12000,
    legende:"À vous : déplacez le curseur des années et regardez la zone bâtie s'étendre autour de Dijon. C'est l'étalement urbain (schéma : les années sont des exemples).",
    voix:"À vous de jouer ! Déplacez le curseur des années, de mille neuf cent cinquante à deux mille vingt. Regardez : la zone bâtie s'étend de plus en plus loin autour de Dijon. Les maisons, les lotissements et les routes gagnent la campagne. On appelle cela l'étalement urbain. Attention, c'est un schéma : les années sont données à titre d'exemple.",
    anim(t,a){ const s=a.seg; if(t<.03) touched=false; a.op(R.s3,0); a.op(R.mp,1); cdot(a,1); a.op(R.s4,1); const Y=touched?yr:Math.round((1950+70*s(t,.1,.8,true))/5)*5;
      R.cm.forEach(p=>{ const on=p._u<=Y+1e-6; p.setAttribute("fill",on?ucol(p._u):"#EEF2E8"); p.setAttribute("fill-opacity",on?.9:1); });
      R.yT.textContent=Y; R.mYv.textContent=Y; R.mY.value=Y; a.op(R.lg4,s(t,.05,.15)); a.op(R.tx4,s(t,.2,.3)); a.op(R.tl,s(t,.05,.15)); R.tm.setAttribute("cx",960+(Y-1950)/70*580); } },
  { titre:"Synthèse", duree:11000,
    legende:"Entre la ville et la campagne, il y a la banlieue et le périurbain. On passe peu à peu de l'un à l'autre : c'est un continuum. La ville s'étale et on se déplace de plus en plus.",
    voix:"Pour résumer : entre la ville et la campagne, il y a la banlieue et le périurbain. On passe peu à peu de l'une à l'autre : c'est un continuum. Et quand la ville s'étale, les habitants se déplacent de plus en plus pour aller travailler.",
    anim(t,a){ const s=a.seg; a.op(R.s4,0); a.op(R.mp,0); cdot(a,0); a.op(R.s5,s(t,0,.1)); R.bar.forEach((g,i)=>{ const v=s(t,.1+i*.1,.22+i*.1); a.op(g,v); a.tr(g,0,(1-v)*30); }); a.op(R.ar5,s(t,.5,.62)); a.op(R.myth,s(t,.68,.82)); a.cls(R.myth.faux,"pulse",t>.82&&t<1); } },
  ]
});
})();
