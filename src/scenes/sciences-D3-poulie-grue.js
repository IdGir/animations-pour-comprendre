/* META {"id":"sciences-D3-poulie-grue","matiere":"sciences","annee":"connexe","periode":1,"theme":"Mouvement, objets techniques : les poulies","resume":"La poulie fixe change la direction de la force ; la poulie mobile et le palan divisent l'effort mais obligent à tirer plus de corde ; lien avec le puits et la grue à écureuil des cathédrales.","motsCles":["poulie","palan","moufle","grue","effort","charge","corde","puits","cathédrale"]} */
(function(){
let R={}, E=null, a=null;
let mode=1, spin=0; // manipulation : montage choisi (0 fixe, 1 mobile, 2 palan) ; temps écoulé dans l'étape (ms)
const KM=3; // indice de l'étape de manipulation
const cyc=ms=>{ const x=(ms/3400)%2, v=x<1?x:2-x; return Math.max(0,Math.min(1,(v-.12)/.76)); }; // va-et-vient 0 -> 1 -> 0 avec petites pauses
const C={ink:"#1E2430",gris:"#5A6478",ch:"#C0392B",ef:"#2E8B57",or:"#E07A1F",blue:"#2563A8",piv:"#4A5468",wood:"#C58B4B",woodD:"#8A5A2B",rope:"#8A6A3A"};
const f2=v=>v.toFixed(2).replace(".",",");
const f1=v=>(Math.round(v*10)/10).toString().replace(".",",");
const f0=v=>Math.round(v).toString();
const panel=(parent,x,y,w,h,col)=>E("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||"#D6DBE4","stroke-width":3},parent);
const txt=(parent,x,y,s,o)=>{ o=o||{}; return E("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.color||C.ink,"text-anchor":o.anchor||"start",text:s,stroke:o.halo?"#fff":null,"stroke-width":o.halo?5:null,"paint-order":o.halo?"stroke":null},parent); };
function pulley(parent,r){ const g=E("g",{},parent); const body=E("g",{},g); E("circle",{r,fill:"#E9ECF2",stroke:C.piv,"stroke-width":7},body); for(let i=0;i<6;i++){ const t=i/6*Math.PI; E("line",{x1:-(r-8)*Math.cos(t),y1:-(r-8)*Math.sin(t),x2:(r-8)*Math.cos(t),y2:(r-8)*Math.sin(t),stroke:"#9AA3B2","stroke-width":4},body); } E("circle",{cx:r*.75,cy:0,r:6,fill:C.or},body); E("circle",{r:9,fill:C.piv},g); g.body=body; return g; }
function setP(g,x,y,deg){ g.setAttribute("transform",`translate(${x},${y})`); g.body.setAttribute("transform",`rotate(${deg})`); }
function crate(parent,txtc){ const g=E("g",{},parent); E("rect",{x:-55,y:0,width:110,height:100,rx:6,fill:"#E8B7B0",stroke:C.ch,"stroke-width":4},g); E("line",{x1:-55,y1:0,x2:55,y2:100,stroke:C.ch,"stroke-width":3,opacity:.4},g); E("line",{x1:55,y1:0,x2:-55,y2:100,stroke:C.ch,"stroke-width":3,opacity:.4},g); const t=txt(g,0,62,txtc,{size:32,w:800,color:C.ch,anchor:"middle",halo:1}); g.t=t; return g; }
function rope(parent,w){ return E("path",{fill:"none",stroke:C.rope,"stroke-width":w||8,"stroke-linecap":"round","stroke-linejoin":"round"},parent); }
function hand(parent){ const g=E("g",{},parent); E("circle",{r:17,fill:"#F2C79C",stroke:C.ink,"stroke-width":3},g); return g; }
function ceil(parent,x1,x2,y){ E("rect",{x:x1,y:y-14,width:x2-x1,height:24,fill:"#B8BEC8",stroke:C.piv,"stroke-width":3},parent); for(let x=x1+12;x<x2;x+=28) E("line",{x1:x,y1:y-14,x2:x-14,y2:y-30,stroke:"#9AA3B2","stroke-width":3},parent); }
function ground(parent){ E("rect",{x:0,y:760,width:1600,height:140,fill:"#E3E7EC"},parent); E("line",{x1:0,y1:760,x2:1600,y2:760,stroke:"#B8BEC8","stroke-width":5},parent); }
function effArrow(g,x,y,len){ g.path.setAttribute("d",`M${x},${y} L${x},${y+len}`); }
function vals(parent,title,col,n){ const g=E("g",{},parent); panel(g,960,110,600,560,col||"#D6DBE4"); txt(g,990,162,title,{size:30,w:800}); txt(g,990,342,"brins qui portent la charge : "+n,{size:26,color:C.or}); return g; }
function bar(parent,x,y,w,h,col){ return E("rect",{x,y,width:w,height:h,rx:8,fill:col},parent); }

// ---- dessins des trois montages, pour une avancée u (0 -> 1) : la charge monte de u mètre
const DEG=180/Math.PI;
function dFixed(u){ const rise=100*u, ctop=660-rise, yh=960-ctop;
  a.set(R.rope1,{d:`M352,${ctop} L352,170 A48,48 0 0 1 448,170 L448,${yh}`}); setP(R.pu1,400,170,rise/48*DEG);
  R.cr1.setAttribute("transform",`translate(352,${ctop})`); R.h1.setAttribute("transform",`translate(448,${yh})`);
  effArrow(R.ef1,498,yh,66); a.set(R.eft1,{x:520,y:yh+54,text:"effort : 20 kg"});
  R.v1c.textContent="corde tirée : "+f2(rise/100)+" m"; R.v1d.textContent="charge monte de : "+f2(rise/100)+" m"; }
function dMobile(u){ const rise=100*u, my=580-rise, yh=300+2*rise;
  a.set(R.rope2,{d:`M352,80 L352,${my} A48,48 0 0 0 448,${my} L448,170 A48,48 0 0 1 544,170 L544,${yh}`});
  setP(R.fp2,496,170,rise*2/48*DEG); setP(R.mp2,400,my,-rise/48*DEG);
  a.set(R.hk2,{x1:400,y1:my+48,x2:400,y2:my+80}); R.cr2.setAttribute("transform",`translate(400,${my+80})`); R.h2.setAttribute("transform",`translate(544,${yh})`);
  effArrow(R.ef2,594,yh,33); a.set(R.eft2,{x:616,y:yh+30,text:"effort : 10 kg"});
  R.n2a.setAttribute("transform",`translate(352,${(80+my)/2})`); R.n2b.setAttribute("transform",`translate(448,${(my+170)/2})`);
  R.v2c.textContent="corde tirée : "+f2(2*rise/100)+" m"; R.v2d.textContent="charge monte de : "+f2(rise/100)+" m"; }
function dPalan(u){ const rise=100*u, by=570-rise, yh=300+4*rise;
  a.set(R.rope3,{d:`M312,175 L312,${by} A36,36 0 0 0 384,${by} L384,215 A36,36 0 0 1 456,215 L456,${by} A36,36 0 0 0 528,${by} L528,215 A36,36 0 0 1 600,215 L600,${yh}`});
  setP(R.pu3[0],420,215,rise*2/36*DEG); setP(R.pu3[1],564,215,rise*2/36*DEG); setP(R.bp3[0],348,by,-rise/36*DEG); setP(R.bp3[1],492,by,-rise/36*DEG);
  a.set(R.bar3,{y:by+42}); a.set(R.hk3,{y1:by+66,y2:by+90}); R.cr3.setAttribute("transform",`translate(420,${by+90})`); R.h3.setAttribute("transform",`translate(600,${yh})`);
  effArrow(R.ef3,650,yh,17); a.set(R.eft3,{x:672,y:yh+26,text:"effort : 5 kg"});
  const ys=[(175+by)/2,(by+215)/2,(215+by)/2,(by+215)/2], xs=[312,384,456,528]; R.n3.forEach((g,i)=>g.setAttribute("transform",`translate(${xs[i]},${ys[i]})`));
  R.v3c.textContent="corde tirée : "+f2(4*rise/100)+" m"; R.v3d.textContent="charge monte de : "+f2(rise/100)+" m"; }

Anim.run({
  titre:"Les poulies : changer de direction, forcer moins",
  sousTitre:"Sciences et technologie · CM1-CM2 · Mouvement et objets techniques",
  matiere:"sciences", badge:"Sciences",
  accroche:"Comment les bâtisseurs de cathédrales levaient-ils des pierres si lourdes ?",
  manipDes:KM, manipJusqua:KM,
  init(api){
    a=api; E=a.el;
    // ================= S1 poulie fixe
    const L1=a.layer("p1"); R.L1=L1; ground(L1); ceil(L1,230,670,80);
    E("line",{x1:400,y1:80,x2:400,y2:122,stroke:C.piv,"stroke-width":10},L1);
    R.rope1=rope(L1); R.pu1=pulley(L1,48); setP(R.pu1,400,170,0);
    R.cr1=crate(L1,"20 kg"); R.h1=hand(L1); R.ef1=a.arrow(L1,"M0,0 L0,10",{color:C.ef,w:12,head:3}); R.eft1=txt(L1,0,0,"",{size:28,w:800,color:C.ef,halo:1});
    R.dir1=E("g",{},L1); a.arrow(R.dir1,"M500,196 L500,284",{color:C.or,w:8,head:3.2}); a.arrow(R.dir1,"M285,500 L285,330",{color:C.or,w:8,head:3.2}); txt(R.dir1,535,230,"on tire",{size:26,color:C.or,halo:1}); txt(R.dir1,535,262,"vers le bas…",{size:26,color:C.or,halo:1}); txt(R.dir1,60,260,"…la charge",{size:26,color:C.or,halo:1}); txt(R.dir1,60,292,"monte",{size:26,color:C.or,halo:1});
    R.v1=vals(L1,"Poulie fixe",C.blue,1);
    R.v1a=txt(R.v1,990,225,"charge : 20 kg",{size:30,color:C.ch}); R.v1b=txt(R.v1,990,285,"effort : 20 kg",{size:30,color:C.ef});
    R.v1c=txt(R.v1,990,398,"",{size:28}); R.v1d=txt(R.v1,990,445,"",{size:28});
    R.v1e=E("g",{},R.v1); R.v1e1=E("text",{x:990,y:510,"font-size":26,"font-weight":700,fill:C.blue},R.v1e); a.wrap(R.v1e1,"La poulie fixe change seulement la direction de la force : elle ne diminue pas l'effort.",34);
    // ================= S2 poulie mobile
    const L2=a.layer("p2"); R.L2=L2; ground(L2); ceil(L2,230,670,80);
    R.rope2=rope(L2); R.fp2=pulley(L2,48); setP(R.fp2,496,170,0); E("line",{x1:496,y1:80,x2:496,y2:122,stroke:C.piv,"stroke-width":10},L2);
    R.mp2=pulley(L2,48); R.hk2=E("line",{stroke:C.piv,"stroke-width":8},L2); R.cr2=crate(L2,"20 kg");
    R.h2=hand(L2); R.ef2=a.arrow(L2,"M0,0 L0,10",{color:C.ef,w:12,head:3}); R.eft2=txt(L2,0,0,"",{size:28,w:800,color:C.ef,halo:1});
    R.n2=E("g",{},L2); R.n2a=E("g",{},R.n2); R.n2b=E("g",{},R.n2);
    [R.n2a,R.n2b].forEach((g,i)=>{ E("circle",{r:22,fill:C.or,stroke:"#fff","stroke-width":3},g); txt(g,0,9,String(i+1),{size:26,w:800,color:"#fff",anchor:"middle"}); });
    R.t2s=E("g",{},L2); txt(R.t2s,200,330,"2 brins portent",{size:26,color:C.or,anchor:"end",halo:1}); txt(R.t2s,200,362,"la charge",{size:26,color:C.or,anchor:"end",halo:1});
    R.v2=vals(L2,"Poulie mobile",C.blue,2);
    R.v2a=txt(R.v2,990,225,"charge : 20 kg",{size:30,color:C.ch}); R.v2b=txt(R.v2,990,285,"effort : 10 kg",{size:30,color:C.ef});
    R.v2c=txt(R.v2,990,398,"",{size:28}); R.v2d=txt(R.v2,990,445,"",{size:28});
    R.v2e=E("g",{},R.v2); txt(R.v2e,990,500,"2 brins × 10 kg = 20 kg",{size:28,color:C.or}); txt(R.v2e,990,550,"effort 2 fois plus petit",{size:28,color:C.ef}); txt(R.v2e,990,600,"mais 2 fois plus de corde",{size:28,color:C.ch});
    // ================= S3 palan
    const L3=a.layer("p3"); R.L3=L3; ground(L3); ceil(L3,250,660,80);
    E("line",{x1:455,y1:80,x2:455,y2:130,stroke:C.piv,"stroke-width":10},L3);
    E("rect",{x:290,y:130,width:330,height:45,rx:8,fill:"#C9CFDA",stroke:C.piv,"stroke-width":4},L3);
    R.rope3=rope(L3); R.pu3=[pulley(L3,36),pulley(L3,36)]; setP(R.pu3[0],420,215,0); setP(R.pu3[1],564,215,0);
    R.bb3=E("g",{},L3); R.bp3=[pulley(L3,36),pulley(L3,36)]; R.bar3=E("rect",{x:300,width:240,height:24,rx:6,fill:"#C9CFDA",stroke:C.piv,"stroke-width":4},L3); R.hk3=E("line",{x1:420,x2:420,stroke:C.piv,"stroke-width":8},L3);
    R.cr3=crate(L3,"20 kg"); R.h3=hand(L3); R.ef3=a.arrow(L3,"M0,0 L0,10",{color:C.ef,w:12,head:3}); R.eft3=txt(L3,0,0,"",{size:28,w:800,color:C.ef,halo:1});
    R.n3=[1,2,3,4].map(i=>{ const g=E("g",{},L3); E("circle",{r:20,fill:C.or,stroke:"#fff","stroke-width":3},g); txt(g,0,8,String(i),{size:24,w:800,color:"#fff",anchor:"middle"}); return g; });
    R.v3=vals(L3,"Palan : 2 poulies en haut, 2 en bas",C.blue,4);
    R.v3a=txt(R.v3,990,225,"charge : 20 kg",{size:30,color:C.ch}); R.v3b=txt(R.v3,990,285,"effort : 5 kg",{size:30,color:C.ef});
    R.v3c=txt(R.v3,990,398,"",{size:28}); R.v3d=txt(R.v3,990,445,"",{size:28});
    R.v3e=E("g",{},R.v3); txt(R.v3e,990,500,"4 brins × 5 kg = 20 kg",{size:28,color:C.or}); txt(R.v3e,990,550,"effort 4 fois plus petit",{size:28,color:C.ef}); txt(R.v3e,990,600,"mais 4 fois plus de corde",{size:28,color:C.ch});
    R.ph3=a.photo(L3,{id:"s-d3-moufle",x:730,y:130,w:200,h:134,cap:"",rot:0,size:20});
    // ================= S4 puits + grue
    const L4=a.layer("p4"); R.L4=L4; panel(L4,40,95,520,715); panel(L4,580,95,600,715);
    txt(L4,300,143,"Le puits",{size:32,w:800,anchor:"middle"}); txt(L4,300,180,"une poulie fixe",{size:24,w:600,anchor:"middle",color:C.gris});
    txt(L4,880,143,"Grue à écureuil (chantier de cathédrale)",{size:28,w:800,anchor:"middle"}); txt(L4,880,180,"poulie + grande roue qui tourne",{size:24,w:600,anchor:"middle",color:C.gris});
    // puits
    E("rect",{x:200,y:440,width:200,height:260,fill:"#3A4A5E"},L4); R.wat=E("rect",{x:200,y:640,width:200,height:60,fill:"#5AA2D8",opacity:.9},L4);
    for(let r=0;r<5;r++) for(let c=0;c<3;c++){ E("rect",{x:130+c*24+(r%2)*12-12,y:440+r*52,width:22,height:50,fill:"#C9C2B4",stroke:"#8F887A","stroke-width":2},L4); E("rect",{x:400+c*24+(r%2)*12-12,y:440+r*52,width:22,height:50,fill:"#C9C2B4",stroke:"#8F887A","stroke-width":2},L4); }
    E("rect",{x:120,y:700,width:360,height:14,fill:"#8F887A"},L4);
    E("rect",{x:140,y:236,width:18,height:206,fill:C.woodD},L4); E("rect",{x:442,y:236,width:18,height:206,fill:C.woodD},L4); E("rect",{x:130,y:222,width:340,height:18,rx:4,fill:C.wood,stroke:C.woodD,"stroke-width":3},L4);
    E("line",{x1:300,y1:240,x2:300,y2:272,stroke:C.piv,"stroke-width":8},L4);
    R.rope4=rope(L4,7); R.pu4=pulley(L4,36); setP(R.pu4,300,300,0);
    R.bk=E("g",{},L4); E("path",{d:"M-34,0 L34,0 L26,50 L-26,50 Z",fill:"#9AA3B2",stroke:C.ink,"stroke-width":3},R.bk); E("path",{d:"M-30,0 Q0,-26 30,0",fill:"none",stroke:C.ink,"stroke-width":3},R.bk); R.bkt=txt(R.bk,0,38,"10 kg",{size:19,w:800,color:C.ink,anchor:"middle"});
    R.h4=hand(L4); R.ef4=a.arrow(L4,"M0,0 L0,10",{color:C.ef,w:10,head:3}); R.eft4=txt(L4,300,788,"effort pour tirer : 10 kg",{size:26,w:800,anchor:"middle",color:C.ef});
    txt(L4,300,752,"seau d'eau : 10 litres = 10 kg",{size:24,w:700,anchor:"middle",color:C.ch});
    // grue
    const WX=760, WY=520, WR=150, DR=30; R.WX=WX; R.WY=WY; R.DR=DR;
    E("line",{x1:1110,y1:700,x2:1110,y2:210,stroke:C.woodD,"stroke-width":16},L4); E("line",{x1:1110,y1:210,x2:990,y2:210,stroke:C.woodD,"stroke-width":12},L4); E("line",{x1:1110,y1:340,x2:1040,y2:210,stroke:C.woodD,"stroke-width":8},L4);
    E("rect",{x:600,y:700,width:560,height:14,fill:"#8F887A"},L4);
    E("line",{x1:760,y1:520,x2:700,y2:700,stroke:C.woodD,"stroke-width":12},L4); E("line",{x1:760,y1:520,x2:820,y2:700,stroke:C.woodD,"stroke-width":12},L4);
    R.wheel=E("g",{},L4); R.wheelB=E("g",{},R.wheel); E("circle",{r:WR,fill:"#F6EBDD",stroke:C.woodD,"stroke-width":12},R.wheelB); E("circle",{r:WR-24,fill:"none",stroke:C.woodD,"stroke-width":5},R.wheelB);
    for(let i=0;i<12;i++){ const t=i/12*Math.PI; E("line",{x1:-(WR-6)*Math.cos(t),y1:-(WR-6)*Math.sin(t),x2:(WR-6)*Math.cos(t),y2:(WR-6)*Math.sin(t),stroke:C.wood,"stroke-width":6},R.wheelB); }
    E("circle",{cx:WR-12,cy:0,r:9,fill:C.or,stroke:"#fff","stroke-width":2},R.wheelB);
    R.drum=E("g",{},L4); R.drumB=E("g",{},R.drum); E("circle",{r:DR,fill:"#DDBB8A",stroke:C.woodD,"stroke-width":5},R.drumB); E("line",{x1:0,y1:0,x2:DR-4,y2:0,stroke:C.woodD,"stroke-width":4},R.drumB);
    R.man=E("g",{},L4); R.manL1=E("line",{stroke:C.ink,"stroke-width":10,"stroke-linecap":"round"},R.man); R.manL2=E("line",{stroke:C.ink,"stroke-width":10,"stroke-linecap":"round"},R.man); R.manB=E("g",{},R.man); E("line",{x1:0,y1:-56,x2:0,y2:0,stroke:"#2563A8","stroke-width":20,"stroke-linecap":"round"},R.manB); E("line",{x1:0,y1:-44,x2:-30,y2:-26,stroke:"#2563A8","stroke-width":9,"stroke-linecap":"round"},R.manB); E("circle",{cx:-2,cy:-78,r:16,fill:"#F2C79C",stroke:C.ink,"stroke-width":3},R.manB);
    R.rope4b=rope(L4,6); R.pu4b=pulley(L4,30); setP(R.pu4b,1000,244,0); E("line",{x1:1000,y1:210,x2:1000,y2:244,stroke:C.piv,"stroke-width":6},L4);
    R.st=E("g",{},L4); E("rect",{x:-45,y:0,width:90,height:66,rx:4,fill:"#CFC8BA",stroke:"#8F887A","stroke-width":4},R.st); E("line",{x1:-45,y1:22,x2:45,y2:22,stroke:"#8F887A","stroke-width":2},R.st); E("line",{x1:0,y1:22,x2:0,y2:66,stroke:"#8F887A","stroke-width":2},R.st);
    R.tour=txt(L4,880,757,"",{size:24,w:700,color:C.or,anchor:"middle"});
    R.mgr=txt(L4,880,788,"l'ouvrier marche dans la roue : il force peu",{size:22,w:600,color:C.gris,anchor:"middle"});
    R.ph4=a.photo(L4,{id:"s-d3-grue-ecureuil",x:1215,y:125,w:330,h:220,cap:"Une grue à écureuil",rot:2,size:22});
    R.ex4=E("g",{},L4); panel(R.ex4,1200,440,360,295,C.or); txt(R.ex4,1220,485,"Exemple chiffré",{size:26,w:800,color:C.or}); txt(R.ex4,1220,530,"roue : rayon 2 m",{size:24,w:600}); txt(R.ex4,1220,565,"tambour : rayon 0,4 m",{size:24,w:600}); txt(R.ex4,1220,610,"pierre : 150 kg",{size:26,color:C.ch}); R.ex4e=txt(R.ex4,1220,655,"effort : 30 kg",{size:28,w:800,color:C.ef}); txt(R.ex4,1220,700,"5 fois moins !",{size:26,w:800,color:C.ef});
    // ================= S5 comparaison
    const L5=a.layer("p5"); R.L5=L5; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},L5);
    const cols=["sans poulie","poulie fixe","poulie mobile","palan (4 brins)"], vals_=[[20,20,20,20],[20,20,10,5],[1,1,2,4]], rowC=[C.ch,C.ef,C.or], cx0=480, dx=290; R.bars=[]; R.bt=[];
    cols.forEach((c,i)=>txt(L5,cx0+i*dx,60,c,{size:28,w:800,anchor:"middle"}));
    [["Poids de la charge","(ne change jamais)","kg"],["Effort à fournir","(il diminue)","kg"],["Corde à tirer","(pour monter de 1 m)","m"]].forEach((r,k)=>{
      const base=[285,520,755][k]; txt(L5,40,base-95,r[0],{size:28,w:800,color:rowC[k]}); txt(L5,40,base-62,r[1],{size:24,w:600,color:C.gris}); E("line",{x1:360,y1:base,x2:1560,y2:base,stroke:"#B8BEC8","stroke-width":3},L5);
      vals_[k].forEach((v,i)=>{ const h=k<2?v*5.5:v*30; const b=bar(L5,cx0+i*dx-55,base-h,110,h,rowC[k]); b._h=h; b._base=base; const tt=txt(L5,cx0+i*dx,base-h-12,"",{size:28,w:800,anchor:"middle",color:rowC[k]}); R.bars.push([k,i,v,b,tt]); }); });
    R.cmp1=E("g",{},L5); a.label(R.cmp1,1380,110,"toujours 20 kg !",{size:28,stroke:C.ch,color:C.ch});
    // ================= synthèse
    const sy=a.layer("syn"); R.syn=sy; E("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    txt(sy,800,70,"À retenir",{size:38,w:800,anchor:"middle"});
    R.pts=[["1","Poulie fixe : elle change la direction de la force, pas son intensité.",C.blue],["2","Poulie mobile, palan : l'effort est divisé par le nombre de brins, mais il faut tirer plus de corde.",C.ef],["3","La charge pèse toujours pareil : c'est l'effort qui diminue.",C.ch]].map(([n,t,c],i)=>{
      const g=E("g",{},sy); E("rect",{x:150,y:110+i*105,width:1300,height:88,rx:16,fill:"#fff",stroke:c,"stroke-width":4},g); E("circle",{cx:205,cy:154+i*105,r:28,fill:c},g); E("text",{x:205,y:166+i*105,"text-anchor":"middle","font-size":34,"font-weight":800,fill:"#fff",text:n},g);
      E("text",{x:255,y:164+i*105,"font-size":26,"font-weight":700,fill:C.ink,text:t},g); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,150,450,1300,"Avec une poulie, la charge devient plus légère.","Non : la charge pèse toujours 20 kg. C'est l'effort qu'on doit fournir qui diminue, parce qu'on tire plus de corde.");
    // manipulation : choix du montage ; la charge monte et descend en boucle tant qu'on est dans l'étape
    const NOMS=["Poulie fixe","Poulie mobile","Palan (4 brins)"];
    a.manip.innerHTML='Montage : '+NOMS.map((n,i)=>`<button data-m="${i}" class="${i===mode?"sel":""}">${n}</button>`).join(" ");
    a.manip.querySelectorAll("button").forEach(b=>b.onclick=()=>{ mode=+b.dataset.m; spin=0; a.manip.querySelectorAll("button").forEach(x=>x.classList.toggle("sel",x===b)); a.redraw(); });
    let last=performance.now();
    setInterval(()=>{ const now=performance.now(), dt=Math.min(now-last,100); last=now; if(a.step()===KM){ spin+=dt; a.redraw(); } },40);
  },
  reset(a){ [R.L1,R.L2,R.L3,R.L4,R.L5,R.syn,R.myth,R.dir1,R.v1e,R.v2e,R.v3e,R.t2s,R.n2,R.ph3,R.ph4,R.ex4,R.cmp1,R.tour,R.mgr].forEach(e=>a.op(e,0)); R.n3.forEach(g=>a.op(g,0)); R.pts.forEach(g=>a.op(g,0)); R.bars.forEach(([k,i,v,b,tt])=>{ a.op(b,0); a.op(tt,0); }); },
  etapes:[
  { titre:"La poulie fixe", duree:12000,
    legende:"Avec une poulie fixe, on tire la corde vers le bas et la charge monte. Elle change la direction de la force, mais l'effort reste le même : 20 kg pour 20 kg.",
    voix:"Voici une poulie fixe : elle est accrochée au plafond et ne bouge pas. Une corde passe sur la poulie. D'un côté, une caisse de vingt kilos. De l'autre, je tire vers le bas, et la caisse monte. La poulie fixe change la direction de la force, c'est pratique. Mais regardez : pour soulever vingt kilos, il me faut un effort de vingt kilos. Et si je tire un mètre de corde, la caisse monte d'un mètre.",
    anim(t,a){ const s=a.seg; a.op(R.L1,1); dFixed(s(t,.28,.85,true));
      a.op(R.ef1,s(t,.1,.2)); a.op(R.eft1,s(t,.12,.22)); a.op(R.dir1,s(t,.35,.5)); a.op(R.v1,s(t,.05,.15)); a.op(R.v1e,s(t,.8,.95)); } },
  { titre:"La poulie mobile", duree:13000,
    legende:"Avec une poulie mobile, la charge est portée par 2 brins de corde. Chaque brin porte la moitié : l'effort tombe à 10 kg. Mais pour monter la charge de 1 m, il faut tirer 2 m de corde.",
    voix:"Maintenant, la poulie est mobile : elle monte avec la caisse. Un bout de la corde est attaché au plafond, l'autre passe sur une poulie fixe pour que je tire vers le bas. Deux brins de corde portent la caisse : chaque brin supporte la moitié du poids, soit dix kilos. Mon effort n'est plus que de dix kilos ! Mais regardez la corde : pour monter la caisse d'un mètre, je dois tirer deux mètres de corde.",
    anim(t,a){ const s=a.seg; a.op(R.L2,1); a.op(R.L1,1-s(t,0,.1)); dMobile(s(t,.28,.88,true));
      a.op(R.ef2,s(t,.1,.2)); a.op(R.eft2,s(t,.12,.22)); a.op(R.n2,s(t,.15,.28)); a.op(R.t2s,s(t,.15,.28)); a.op(R.v2,s(t,.05,.15)); a.op(R.v2e,s(t,.8,.95)); } },
  { titre:"Le palan : plusieurs poulies", duree:15000,
    legende:"Un palan combine des poulies fixes et mobiles. Ici, 4 brins portent la charge : l'effort tombe à 5 kg. Mais pour monter la charge de 1 m, il faut tirer 4 m de corde.",
    voix:"Pour forcer encore moins, on combine plusieurs poulies : c'est un palan, ou moufle. Ici, deux poulies en haut qui ne bougent pas, deux poulies en bas qui montent avec la caisse. Quatre brins de corde portent la charge : chacun ne supporte que cinq kilos. Mon effort est de cinq kilos seulement ! Mais pour monter la caisse d'un mètre, je dois tirer quatre mètres de corde.",
    anim(t,a){ const s=a.seg; a.op(R.L3,1); a.op(R.L2,1-s(t,0,.1)); dPalan(s(t,.3,.9,true));
      a.op(R.ef3,s(t,.1,.2)); a.op(R.eft3,s(t,.12,.22)); R.n3.forEach((g,i)=>a.op(g,s(t,.12+i*.05,.22+i*.05))); a.op(R.v3,s(t,.05,.15)); a.op(R.v3e,s(t,.82,.95)); a.op(R.ph3,s(t,.55,.75)); } },
  { titre:"À vous : choisissez le montage", duree:6000,
    legende:"À vous : choisissez un montage (poulie fixe, poulie mobile ou palan) et regardez la charge monter. Combien de corde faut-il tirer ? Quel effort faut-il fournir ?",
    voix:"À vous ! Avec les boutons, choisissez un montage : poulie fixe, poulie mobile ou palan. Regardez la caisse monter. Combien de corde faut-il tirer pour la monter d'un mètre ? Et quel effort faut-il fournir ? Comparez les trois montages. Prenez votre temps.",
    anim(t,a){ const s=a.seg; const L=[R.L1,R.L2,R.L3];
      L.forEach((l,i)=>a.op(l,i===mode?(mode===2?1:s(t,0,.12)):(i===2?1-s(t,0,.12):0)));
      const u=cyc(spin); a.op(R.ph3,0);
      if(mode===0){ dFixed(u); a.op(R.ef1,1); a.op(R.eft1,1); a.op(R.dir1,1); a.op(R.v1,1); a.op(R.v1e,1); }
      else if(mode===1){ dMobile(u); a.op(R.ef2,1); a.op(R.eft2,1); a.op(R.n2,1); a.op(R.t2s,1); a.op(R.v2,1); a.op(R.v2e,1); }
      else { dPalan(u); a.op(R.ef3,1); a.op(R.eft3,1); R.n3.forEach(g=>a.op(g,1)); a.op(R.v3,1); a.op(R.v3e,1); } } },
  { titre:"Le puits et la grue des cathédrales", duree:14000,
    legende:"Au puits, une poulie fixe renvoie la corde vers le bas. Sur un chantier de cathédrale, la grue à écureuil associe une poulie et une grande roue : l'ouvrier qui marche dedans soulève des pierres très lourdes en forçant peu.",
    voix:"Les poulies servent depuis très longtemps. Au puits, une poulie fixe permet de remonter un seau de dix kilos en tirant vers le bas. Sur les chantiers des cathédrales, au Moyen Âge, on utilisait la grue à écureuil. Un ouvrier marche à l'intérieur d'une grande roue. La roue fait tourner un petit tambour sur lequel s'enroule la corde, qui passe sur une poulie et soulève la pierre. Plus la roue est grande par rapport au tambour, moins l'ouvrier a besoin de forcer. Dans l'exemple, la roue est cinq fois plus grande que le tambour : cent cinquante kilos de pierre se soulèvent avec trente kilos d'effort.",
    anim(t,a){ const s=a.seg; a.op(R.L4,1); [R.L1,R.L2,R.L3].forEach((l,i)=>a.op(l,i===mode?1-s(t,0,.1):0)); const u=s(t,.2,.9,true);
      // puits : 2 m = 120 px
      const pulled=120*u; const bt=610-pulled; const yh=340+pulled;
      a.set(R.rope4,{d:`M264,${bt} L264,300 A36,36 0 0 1 336,300 L336,${yh}`}); setP(R.pu4,300,300,pulled/36*180/Math.PI); R.bk.setAttribute("transform",`translate(264,${bt})`); R.h4.setAttribute("transform",`translate(336,${yh})`);
      effArrow(R.ef4,372,yh,33);
      // grue : 1 tour de roue en sens inverse des aiguilles
      const th=-360*u; R.wheelB.setAttribute("transform",`rotate(${th})`); R.wheel.setAttribute("transform",`translate(${R.WX},${R.WY})`); R.drum.setAttribute("transform",`translate(${R.WX},${R.WY})`); R.drumB.setAttribute("transform",`rotate(${th})`);
      const rise=R.DR*2*Math.PI*u; const sty=635-rise; // 1 tour de tambour = 188 px = 2,5 m (75 px par mètre)
      a.set(R.rope4b,{d:`M${R.WX},${R.WY-R.DR} L1000,214 A30,30 0 0 1 1030,244 L1030,${sty}`}); R.st.setAttribute("transform",`translate(1030,${sty})`);
      // ouvrier qui marche dans la roue
      const ph=u*Math.PI*14, mx=R.WX-44, my=R.WY+86, sw=Math.sin(ph)*24; R.manB.setAttribute("transform",`translate(${mx},${my})`);
      a.set(R.manL1,{x1:mx,y1:my,x2:mx+sw,y2:my+54}); a.set(R.manL2,{x1:mx,y1:my,x2:mx-sw,y2:my+54});
      a.op(R.ph4,s(t,.55,.75)); a.op(R.ex4,s(t,.6,.75)); R.tour.textContent=f1(u)+" tour de roue : la pierre monte de "+f1(rise/75)+" m"; a.op(R.tour,s(t,.2,.3)); a.op(R.mgr,s(t,.3,.4)); } },
  { titre:"Comparons : la charge ne change pas", duree:15000,
    legende:"Le poids de la charge reste 20 kg dans tous les cas. Ce qui diminue, c'est l'effort : 20, 20, 10, puis 5 kg. Mais la corde à tirer augmente : 1, 1, 2, puis 4 m (en théorie, sans frottements).",
    voix:"Comparons. Première ligne : le poids de la charge. C'est toujours vingt kilos, avec ou sans poulie. La charge ne devient jamais plus légère ! Deuxième ligne : l'effort. Sans poulie ou avec une poulie fixe, vingt kilos. Avec une poulie mobile, dix. Avec un palan à quatre brins, cinq seulement. Troisième ligne : la corde à tirer pour monter d'un mètre. Un mètre, un mètre, deux mètres, quatre mètres. Plus on divise l'effort, plus il faut tirer de corde. Ces valeurs sont théoriques : on a oublié les frottements.",
    anim(t,a){ const s=a.seg; a.op(R.L5,1); a.op(R.L4,1-s(t,0,.06));
      R.bars.forEach(([k,i,v,b,tt])=>{ const g=s(t,[.04,.34,.64][k]+i*.035,[.2,.5,.8][k]+i*.035); const h=(k<2?v*5.5:v*30)*g; a.set(b,{y:b._base-h,height:Math.max(.1,h)}); a.op(b,g>0?1:0); a.set(tt,{y:b._base-h-12,text:(k<2?f0(v*g):f0(v*g))+(k<2?" kg":" m")}); a.op(tt,g>0.05?1:0); });
      a.op(R.cmp1,s(t,.26,.34)); } },
  { titre:"Synthèse", duree:10000,
    legende:"Poulie fixe : on change de direction. Poulie mobile ou palan : on force moins, mais on tire plus de corde. La charge, elle, pèse toujours pareil.",
    voix:"Pour retenir. La poulie fixe change la direction de la force. La poulie mobile et le palan divisent l'effort par le nombre de brins, mais il faut tirer plus de corde. Attention : une poulie ne rend pas la charge plus légère. La charge pèse toujours pareil, c'est l'effort qui diminue.",
    anim(t,a){ const s=a.seg; a.op(R.L5,1-s(t,0,.08)); a.op(R.syn,s(t,0,.1)); R.pts.forEach((g,i)=>a.op(g,s(t,.08+i*.12,.18+i*.12))); a.op(R.myth,s(t,.55,.7)); } },
  ]
});
})();
