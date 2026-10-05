/* META {"id":"histoire-B4-ville-medievale","matiere":"histoire","annee":"B","periode":1,"theme":"Le Moyen Âge : seigneurs, chevaliers, villes… (la ville médiévale)","resume":"Une ville médiévale : remparts et portes qui protègent et contrôlent, marché au centre, métiers regroupés par rue, corporations aux règles communes, foires qui relient la ville à l'Europe (exemples : Dijon, Beaune, Provins).","motsCles":["ville","rempart","porte","marché","métiers","corporation","apprenti","compagnon","maître","foire de Champagne","Dijon","Beaune","Provins"]} */
//@data europe
(function(){
const E=EUROPE;
const C={ink:"#1E2430",or:"#E07A1F",gr:"#2E8B57",red:"#C0392B",bl:"#2563A8",roi:"#6B3FA0",gris:"#4A5468",brown:"#8C6D46",stone:"#D9CCB3",stoneD:"#7A6A50"};
let A=null, R={}, sel="tanneur";
function T(p,x,y,s,o){o=o||{};return A.el("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.col||C.ink,"text-anchor":o.anchor||"middle",text:s},p);}
function TL(p,x,y,lines,o){o=o||{};const sz=o.size||24;const t=A.el("text",{x,y,"font-size":sz,"font-weight":o.w||600,fill:o.col||C.ink,"text-anchor":o.anchor||"start"},p);lines.split("\n").forEach((l,i)=>A.el("tspan",{x,dy:i?sz*1.28:0,text:l},t));return t;}
function panel(p,x,y,w,h,title,col){ const g=A.el("g",{},p); A.el("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||C.or,"stroke-width":3.5},g); if(title) T(g,x+w/2,y+44,title,{size:30,w:800,col:col||C.or}); return g; }
function person(p,col,s,o){ o=o||{}; const g=A.el("g",{},p); const q=A.el("g",{transform:`scale(${s})`},g);
  if(o.stick){ A.el("line",{x1:20,y1:-6,x2:30,y2:-72,stroke:"#6B4524","stroke-width":4,"stroke-linecap":"round"},q); A.el("circle",{cx:31,cy:-76,r:11,fill:"#C9A36B",stroke:C.ink,"stroke-width":2.2},q); }
  A.el("path",{d:"M-15,-40 L15,-40 L21,0 L-21,0Z",fill:col,stroke:C.ink,"stroke-width":2.4},q);
  if(o.apron) A.el("path",{d:"M-11,-34 L11,-34 L15,0 L-15,0Z",fill:"#F4EEDD",stroke:C.ink,"stroke-width":2},q);
  A.el("circle",{cx:0,cy:-52,r:13,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.4},q);
  if(o.hat) A.el("path",{d:"M-18,-60 Q0,-76 18,-60Z",fill:"#C9B07A",stroke:C.ink,"stroke-width":2},q);
  if(o.cap) A.el("path",{d:"M-14,-58 Q0,-72 14,-58Z",fill:o.cap,stroke:C.ink,"stroke-width":2},q);
  if(o.basket){ A.el("path",{d:"M-34,-22 L-14,-22 L-17,-6 L-31,-6Z",fill:"#C89B5A",stroke:C.ink,"stroke-width":2},q); A.el("path",{d:"M-31,-22 Q-24,-34 -17,-22",fill:"none",stroke:"#2E8B57","stroke-width":4},q); }
  if(o.tool){ A.el("line",{x1:-24,y1:-30,x2:-24,y2:-62,stroke:"#6B4524","stroke-width":5,"stroke-linecap":"round"},q); A.el("rect",{x:-34,y:-70,width:22,height:12,rx:2,fill:"#8E98A6",stroke:C.ink,"stroke-width":2},q); }
  g._s=s; return g; }
/* ---------- géométrie du plan ---------- */
const CX=540, CY=470, RX=450, RY=335;
const rr=th=>1+.04*Math.sin(3*th+.5)+.03*Math.cos(5*th);
const W=deg=>{ const th=deg*Math.PI/180, r=rr(th); return [CX+RX*r*Math.cos(th), CY+RY*r*Math.sin(th)]; };
const GATES=[-90,-35,28,152];
const ST={ boulanger:[W(-90),[545,300],[540,430]], tisserand:[W(-35),[800,350],[640,420],[565,450]], boucher:[W(28),[800,570],[650,505],[575,478]], forgeron:[W(152),[330,590],[450,525],[510,485]], tanneur:[[250,655],[400,660],[540,655],[700,655],[830,645]] };
const LINK=[[540,515],[540,655]];
const COL={boulanger:"#E0A81F",tisserand:"#2563A8",boucher:"#C0392B",forgeron:"#4A5468",tanneur:"#8C5A2B"};
const NOMRUE={boulanger:"rue des Boulangers",tisserand:"rue des Tisserands",boucher:"rue des Bouchers",forgeron:"rue des Forgerons",tanneur:"rue des Tanneurs"};
function plen(pts){ let L=0; for(let i=1;i<pts.length;i++) L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); return L; }
function pat(pts,u){ const L=plen(pts); let d=Math.max(0,Math.min(1,u))*L; for(let i=1;i<pts.length;i++){ const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); if(d<=l||i===pts.length-1){ const f=l?Math.min(1,d/l):0; return {x:pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f,y:pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f,dx:(pts[i][0]-pts[i-1][0])/(l||1),dy:(pts[i][1]-pts[i-1][1])/(l||1)}; } d-=l; } }
const pd=pts=>"M"+pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" L");
function distSeg(px,py,a,b){ const dx=b[0]-a[0],dy=b[1]-a[1]; const l2=dx*dx+dy*dy||1; let t=((px-a[0])*dx+(py-a[1])*dy)/l2; t=Math.max(0,Math.min(1,t)); return Math.hypot(px-(a[0]+dx*t),py-(a[1]+dy*t)); }
function distPoly(px,py,pts){ let m=1e9; for(let i=1;i<pts.length;i++) m=Math.min(m,distSeg(px,py,pts[i-1],pts[i])); return m; }
function rng(seed){ return ()=>{ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const MARCHE=[465,415,150,100];
const BGP=[[440,478],[640,478],[470,402],[610,402],[470,552],[610,552]], STP=[[490,432],[540,432],[590,432],[490,498],[540,498],[590,498]];
const EGLISE=[350,290];
const SELD={
 rempart:{btn:"Rempart",nom:"Le rempart",col:"#7A6A50",role:"Un grand mur de pierre avec des tours, tout autour de la ville : il protège les habitants.",why:"Il marque la limite de la ville. On y contrôle aussi ceux qui entrent, et on peut faire payer des droits sur les marchandises."},
 porte:{btn:"Porte",nom:"Une porte de la ville",col:"#7A6A50",role:"C'est le seul passage dans le mur : paysans, marchands et charrettes entrent par là.",why:"On surveille ceux qui arrivent. La nuit, la porte se ferme."},
 marche:{btn:"Marché",nom:"La place du marché",col:"#B7791F",role:"On y vend et on y achète : grain, légumes, viande, tissus, outils…",why:"Elle est au centre, là où se rejoignent les rues venues des portes."},
 boulanger:{btn:"Boulanger",nom:"Le boulanger",col:"#B7791F",role:"Il fabrique et vend le pain, l'aliment de base.",why:"Son poids et son prix sont contrôlés : personne ne doit être trompé."},
 boucher:{btn:"Boucher",nom:"Le boucher",col:"#C0392B",role:"Il prépare et vend la viande.",why:"Les bouchers sont regroupés dans une même rue : c'est plus facile de contrôler la qualité."},
 forgeron:{btn:"Forgeron",nom:"Le forgeron",col:"#4A5468",role:"Il travaille le fer au feu : outils, clous, fers à cheval, armes.",why:"Les artisans d'un même métier s'installent dans la même rue : les clients savent où les trouver."},
 tisserand:{btn:"Tisserand",nom:"Le tisserand",col:"#2563A8",role:"Il tisse la laine pour fabriquer le drap, le tissu des vêtements.",why:"Les draps se vendent au marché, et parfois jusqu'aux foires."},
 tanneur:{btn:"Tanneur",nom:"Le tanneur",col:"#8C5A2B",role:"Il transforme les peaux d'animaux en cuir : chaussures, ceintures, sacs.",why:"Il lui faut beaucoup d'eau, et le travail sent très mauvais : il s'installe au bord de la rivière."}
};
const KEYS=["rempart","porte","marche","boulanger","boucher","forgeron","tisserand","tanneur"];
function pick(k){ sel=k; KEYS.forEach(x=>{ const b=document.getElementById("bB_"+x); if(b) b.classList.toggle("sel",x===k); }); if(A) A.redraw(); }
const MAPK=4.3, MX=592, MY=332;
const MP=(x,y)=>[540+(x-MX)*MAPK,465+(y-MY)*MAPK];
Anim.run({
  titre:"La ville médiévale : remparts, marché et métiers",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire", manipDes:4, manipJusqua:4,
  accroche:"Une ville au Moyen Âge : pourquoi un mur, un marché, une rue pour chaque métier ?",
  init(a){
    A=a; const {el}=a; const svg=a.svg;
    const defs=el("defs",{},svg); el("clipPath",{id:"clipB4"},defs).appendChild(Anim.H.el("rect",{x:20,y:70,width:1040,height:790,rx:14}));
    /* ===== PLAN DE LA VILLE ===== */
    const pl=a.layer("plan"); R.pl=pl;
    el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#DDEBC6",stroke:"#B7C99A","stroke-width":2},pl);
    [[870,100,170,60],[880,170,160,60],[40,780,140,60],[900,790,140,50],[40,300,60,100]].forEach(([x,y,w,h],i)=>el("rect",{x,y,width:w,height:h,fill:i%2?"#E9DC9A":"#EFE3A6",stroke:"#C9B96A","stroke-width":2},pl));
    R.river=el("path",{d:"M20,770 C250,690 400,775 540,735 C700,695 850,765 1060,725",fill:"none",stroke:"#8EBBE0","stroke-width":46,"stroke-linecap":"round"},pl);
    el("path",{d:"M20,770 C250,690 400,775 540,735 C700,695 850,765 1060,725",fill:"none",stroke:"#B9D7EE","stroke-width":30,"stroke-linecap":"round"},pl);
    R.rivT=T(pl,170,818,"la rivière",{size:24,w:700,col:"#2F6FA3"});
    /* rues */
    R.streets=el("g",{},pl); const stAll=[...Object.values(ST),LINK];
    R.stP=stAll.map(pts=>{ el("path",{d:pd(pts),fill:"none",stroke:"#BDAE86","stroke-width":18,"stroke-linecap":"round","stroke-linejoin":"round"},R.streets); return el("path",{d:pd(pts),fill:"none",stroke:"#EFE6CC","stroke-width":13,"stroke-linecap":"round","stroke-linejoin":"round"},R.streets); });
    /* maisons */
    const rnd=rng(7); const H=[]; const trade=Object.keys(ST);
    const addH=(x,y,tk,s)=>{ H.push({x,y,tk,s:s||1}); };
    trade.forEach(k=>{ const pts=ST[k]; const L=plen(pts); const n=Math.floor(L/40); for(let i=1;i<n;i++){ const q=pat(pts,i/n); for(const side of [-1,1]){ const x=q.x-q.dy*side*34, y=q.y+q.dx*side*34; if(Math.hypot(x-(MARCHE[0]+75),y-(MARCHE[1]+50))<130) continue; if(Math.hypot(x-EGLISE[0],y-EGLISE[1])<80) continue; if(k!=="tanneur"&&Math.hypot(x-CX,y-CY)<150) continue; if(((x-CX)/(RX*.93))**2+((y-CY)/(RY*.93))**2>1) continue; if(y>700&&k==="tanneur") continue; addH(x,y,k); } } });
    for(let gx=110;gx<1000;gx+=46) for(let gy=150;gy<800;gy+=44){ const x=gx+(rnd()-.5)*18+(Math.floor(gy/44)%2)*22, y=gy+(rnd()-.5)*14; if(((x-CX)/(RX*.9))**2+((y-CY)/(RY*.9))**2>1) continue; if(y>690) continue; if(x>MARCHE[0]-30&&x<MARCHE[0]+MARCHE[2]+30&&y>MARCHE[1]-30&&y<MARCHE[1]+MARCHE[3]+40) continue; if(Math.hypot(x-EGLISE[0],y-EGLISE[1])<85) continue;
      let ok=true; for(const pts of stAll) if(distPoly(x,y,pts)<30){ ok=false; break; } if(!ok) continue; for(const h of H) if(Math.hypot(h.x-x,h.y-y)<34){ ok=false; break; } if(ok) addH(x,y,null,.9+rnd()*.25); }
    H.sort((p,q)=>p.y-q.y);
    R.hs=H.map(h=>{ const g=el("g",{transform:`translate(${h.x.toFixed(1)},${h.y.toFixed(1)}) scale(${h.s})`},pl); el("rect",{x:-15,y:-16,width:30,height:20,fill:"#F0E2C4",stroke:"#7A6A4E","stroke-width":2},g); g.roof=el("path",{d:"M-19,-16 L0,-36 L19,-16Z",fill:"#B9A27A",stroke:"#7A6A4E","stroke-width":2},g); g._h=h; g._d=Math.hypot(h.x-CX,h.y-CY); return g; });
    /* église */
    R.egl=el("g",{transform:`translate(${EGLISE[0]},${EGLISE[1]})`},pl); el("rect",{x:-42,y:-30,width:70,height:44,fill:"#E9DFCB",stroke:"#7A6A4E","stroke-width":3},R.egl); el("path",{d:"M-48,-30 L-7,-58 L34,-30Z",fill:"#9A8A6C",stroke:"#7A6A4E","stroke-width":3},R.egl); el("rect",{x:28,y:-70,width:26,height:84,fill:"#E9DFCB",stroke:"#7A6A4E","stroke-width":3},R.egl); el("path",{d:"M24,-70 L41,-98 L58,-70Z",fill:"#9A8A6C",stroke:"#7A6A4E","stroke-width":3},R.egl); el("path",{d:"M41,-98 l0,-16 M35,-108 l12,0",stroke:C.ink,"stroke-width":3},R.egl); el("path",{d:"M-30,14 L-30,-6 Q-20,-18 -10,-6 L-10,14Z",fill:"#5A4A30"},R.egl);
    /* place du marché */
    R.place=el("g",{},pl); el("rect",{x:MARCHE[0],y:MARCHE[1],width:MARCHE[2],height:MARCHE[3],rx:10,fill:"#EBDDB8",stroke:"#B7A06A","stroke-width":3},R.place);
    R.stalls=[]; [[490,432],[540,432],[590,432],[490,498],[540,498],[590,498]].forEach(([x,y],i)=>{ const g=el("g",{transform:`translate(${x},${y})`},R.place); el("rect",{x:-19,y:-8,width:38,height:16,fill:"#fff",stroke:C.ink,"stroke-width":2},g); el("path",{d:"M-22,-8 L22,-8 L18,-22 L-18,-22Z",fill:["#C0392B","#2563A8","#E0A81F"][i%3],stroke:C.ink,"stroke-width":2},g); R.stalls.push(g); });
    R.placeT=T(pl,CX+8,CY-4,"marché",{size:24,w:800,col:"#7A5A1E"});
    /* rempart */
    const rpts=[]; for(let d=-90;d<=270;d+=6) rpts.push(W(d)); R.wallD=pd(rpts)+"Z";
    R.wallO=el("path",{d:R.wallD,fill:"none",stroke:C.stoneD,"stroke-width":20,"stroke-linejoin":"round"},pl); R.wallI=el("path",{d:R.wallD,fill:"none",stroke:C.stone,"stroke-width":12,"stroke-linejoin":"round"},pl);
    R.towers=[]; for(let d=-75;d<270;d+=30){ if(GATES.some(g=>Math.abs(((d-g+540)%360)-180)>=180-14)) continue; const q=W(d); const g=el("g",{transform:`translate(${q[0].toFixed(1)},${q[1].toFixed(1)})`},pl); el("circle",{r:22,fill:C.stone,stroke:C.stoneD,"stroke-width":4},g); el("circle",{r:11,fill:"#B7A98B",stroke:C.stoneD,"stroke-width":2},g); g._d=d; R.towers.push(g); }
    R.gates=GATES.map(d=>{ const q=W(d); const g=el("g",{transform:`translate(${q[0].toFixed(1)},${q[1].toFixed(1)})`},pl); el("rect",{x:-34,y:-30,width:68,height:60,rx:6,fill:C.stone,stroke:C.stoneD,"stroke-width":4},g); el("path",{d:"M-30,-30 l0,-10 l12,0 l0,10 M-6,-30 l0,-10 l12,0 l0,10 M18,-30 l0,-10 l12,0 l0,10",fill:C.stone,stroke:C.stoneD,"stroke-width":3},g); el("path",{d:"M-15,30 L-15,-4 Q0,-22 15,-4 L15,30Z",fill:"#2B2B2B"},g);
      g.dl=el("g",{transform:"translate(-15,0) scale(0,1)"},g); el("rect",{x:0,y:-8,width:15,height:38,fill:"#8A5A2B",stroke:C.ink,"stroke-width":2},g.dl);
      g.dr=el("g",{transform:"translate(15,0) scale(0,1)"},g); el("rect",{x:-15,y:-8,width:15,height:38,fill:"#8A5A2B",stroke:C.ink,"stroke-width":2},g.dr); g._d=d; return g; });
    R.night=el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#16264A","pointer-events":"none"},pl);
    R.moon=el("g",{},pl); el("circle",{cx:990,cy:130,r:34,fill:"#F2EAC0"},R.moon); el("circle",{cx:1004,cy:122,r:30,fill:"#16264A"},R.moon);
    R.nightL=el("g",{},pl); a.label(R.nightL,540,110,"La nuit, les portes se ferment",{size:30,stroke:"#F2EAC0",color:"#fff",fill:"#16264A"});
    R.title=TL(pl,44,106,"Plan simplifié d'une\nville médiévale",{size:26,w:800,col:"#3F5A2A"});
    /* surbrillances (manipulation) */
    R.hl={}; const hlStyle={fill:"none",stroke:C.or,"stroke-width":10,"stroke-linecap":"round","stroke-linejoin":"round","pointer-events":"none"};
    R.hl.rempart=el("path",Object.assign({d:R.wallD},hlStyle),pl);
    R.hl.porte=el("g",{},pl); GATES.forEach(d=>{ const q=W(d); el("circle",{cx:q[0],cy:q[1],r:50,fill:"none",stroke:C.or,"stroke-width":8},R.hl.porte); });
    R.hl.marche=el("rect",{x:MARCHE[0]-12,y:MARCHE[1]-34,width:MARCHE[2]+24,height:MARCHE[3]+60,rx:16,fill:"none",stroke:C.or,"stroke-width":8},pl);
    trade.forEach(k=>{ R.hl[k]=el("path",Object.assign({d:pd(ST[k])},hlStyle,{"stroke-width":78,"stroke-opacity":.45}),pl); });
    /* étiquettes des rues (étape 4) */
    R.rl={}; const RLP={boulanger:[660,190],tisserand:[850,250],boucher:[900,680],forgeron:[190,500],tanneur:[540,610]};
    trade.forEach(k=>{ const g=el("g",{},pl); a.label(g,RLP[k][0],RLP[k][1],NOMRUE[k],{size:24,stroke:COL[k],color:COL[k],sw:3}); R.rl[k]=g; });
    /* personnages du marché (étape 3) */
    R.pe=[]; trade.slice(0,4).forEach((k,i)=>{ for(let j=0;j<2;j++){ const p=person(pl,"#8C6D46",.8,{hat:true,basket:true}); p._k=k; p._j=j; p._i=i; R.pe.push(p); } });
    R.bg=BGP.map(([x,y],i)=>{ const p=person(pl,["#2563A8","#B03A2E","#2E8B57","#6B3FA0","#B7791F","#2563A8"][i],.75,{cap:"#7A5A1E"}); A.tr(p,x,y,1); return p; });
    R.coins=[...Array(6)].map(()=>{ const g=el("g",{},pl); el("circle",{r:9,fill:"#F2C230",stroke:"#8A6A00","stroke-width":3},g); return g; });
    R.goods=[...Array(6)].map(()=>{ const g=el("g",{},pl); el("path",{d:"M-12,10 Q-16,-10 -5,-14 L5,-14 Q16,-10 12,10Z",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3},g); return g; });
    R.mkL=[["Les paysans apportent leurs produits",300,200],["Les habitants achètent ce qu'ils n'ont pas",700,640]].map(([s,x,y])=>{ const g=el("g",{},pl); a.label(g,x,y,s,{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"}); return g; });
    /* clics sur le plan */
    const clk=(e,k)=>{ e.style.cursor="pointer"; e.addEventListener("click",()=>{ if(a.step()===4) pick(k); }); };
    clk(R.place,"marche"); clk(R.wallO,"rempart"); R.gates.forEach(g=>clk(g,"porte")); R.towers.forEach(g=>clk(g,"rempart"));
    trade.forEach(k=>{ R.hs.forEach(h=>{ if(h._h.tk===k) clk(h,k); }); R.stP.forEach((p,i)=>{ if(i===trade.indexOf(k)) clk(p,k); }); });
    /* photos */
    /* ---- panneaux d'explication ---- */
    const P1=a.layer("p1"); R.p1=P1; panel(P1,1090,90,490,540,"Pourquoi les villes grandissent",C.gr);
    R.p1i=[["1","De meilleures récoltes","on produit plus de nourriture"],["2","Plus d'habitants","la population augmente"],["3","On vient échanger","autour de l'église et du marché"]].map(([n,t,d],i)=>{ const g=el("g",{},P1); const y=170+i*140; el("circle",{cx:1128,cy:y+10,r:22,fill:C.gr},g); T(g,1128,y+19,n,{size:26,w:800,col:"#fff"}); T(g,1166,y+8,t,{size:27,w:800,anchor:"start"}); TL(g,1166,y+46,d,{size:23,w:500,col:C.gris}); return g; });
    const P2=a.layer("p2"); R.p2=P2; panel(P2,1090,80,490,250,"Remparts et portes",C.roi);
    TL(P2,1112,170,"• Le mur protège les habitants.\n• Les portes sont le seul passage :\n  on surveille ceux qui entrent.\n• La nuit, elles se ferment.",{size:24});
    panel(P2,1090,345,490,200,"Près de chez nous",C.or); TL(P2,1112,425,"À Dijon, après un grand incendie\n(1137), la ville s'agrandit et reçoit\nune nouvelle enceinte. À Beaune,\nremparts des XIIIe-XVe siècles.",{size:22});
    R.ph1=a.photo(P2,{id:"h-b4-provins-remparts",x:1112,y:575,w:430,h:200,cap:"Remparts de Provins",rot:1});
    const P3=a.layer("p3"); R.p3=P3; panel(P3,1090,90,490,330,"Le jour de marché",C.or);
    TL(P3,1112,176,"• Les paysans viennent vendre :\n  grain, légumes, œufs, bêtes…\n• Les habitants achètent ce qu'ils\n  ne produisent pas.\n• Le marché a lieu un jour fixé,\n  par exemple chaque semaine.",{size:24});
    const P4=a.layer("p4"); R.p4=P4; panel(P4,1090,90,490,630,"Un métier par rue",C.bl);
    R.p4i=[["boulanger","Boulangers : le pain"],["boucher","Bouchers : la viande"],["forgeron","Forgerons : le fer"],["tisserand","Tisserands : le drap"],["tanneur","Tanneurs : le cuir"]].map(([k,t],i)=>{ const g=el("g",{},P4); const y=165+i*66; el("rect",{x:1112,y:y-6,width:34,height:34,rx:6,fill:COL[k],stroke:C.ink,"stroke-width":2.5},g); T(g,1164,y+22,t,{size:26,w:700,anchor:"start"}); return g; });
    R.p4n=el("g",{},P4); a.label(R.p4n,1335,610,"À Dijon : rue des Forges,\nrue Vannerie, rue de la Verrerie…\nles noms de rues rappellent\nd'anciens métiers.",{size:22,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3",w:450});
    const P5=a.layer("p5"); R.p5=P5; panel(P5,1090,90,490,760,"Cliquez !",C.bl);
    R.p5n=T(P5,1335,196,"",{size:36,w:800});
    el("rect",{x:1110,y:222,width:450,height:250,rx:12,fill:"#EEF3FB",stroke:C.bl,"stroke-width":3},P5); T(P5,1130,256,"À quoi ça sert ?",{size:26,w:800,col:C.bl,anchor:"start"});
    R.p5r=el("text",{x:1130,y:294,"font-size":24,"font-weight":600,fill:C.ink},P5);
    el("rect",{x:1110,y:486,width:450,height:344,rx:12,fill:"#FDF3E3",stroke:C.or,"stroke-width":3},P5); T(P5,1130,520,"Pourquoi à cet endroit ?",{size:26,w:800,col:"#8A4A0E",anchor:"start"});
    R.p5w=el("text",{x:1130,y:558,"font-size":24,"font-weight":600,fill:C.ink},P5);
    a.manip.innerHTML="Cliquez sur : "+KEYS.map(k=>`<button id="bB_${k}"${k===sel?' class="sel"':""}>${SELD[k].btn}</button>`).join("");
    KEYS.forEach(k=>{ document.getElementById("bB_"+k).onclick=()=>pick(k); });
    /* ===== ÉTAPE 6 : corporations ===== */
    const s6=a.layer("corpo"); R.s6=s6; el("rect",{x:0,y:0,width:1600,height:900,fill:"#FBF6EE",rx:14},s6);
    T(s6,800,70,"Une corporation : les artisans d'un même métier",{size:36,w:800,col:"#A8431F"});
    const ST3=[["Apprenti","Il apprend le métier\nchez un maître.","#2E8B57",{cap:"#2E8B57",tool:true},1],["Compagnon","Il voyage de ville en ville\npour se perfectionner.","#2563A8",{stick:true,hat:true},1],["Maître","Il réussit son chef-d'œuvre,\npuis il ouvre son atelier.","#B03A2E",{apron:true,cap:"#B03A2E"},1]];
    R.c3=ST3.map(([n,d,col,o,sc],i)=>{ const g=el("g",{},s6); const x0=90+i*510, y0=140; el("rect",{x:x0,y:y0,width:400,height:480,rx:16,fill:"#fff",stroke:col,"stroke-width":4},g); T(g,x0+200,y0+56,n,{size:38,w:800,col}); const pp=person(g,col,[2.6,3,3.2][i],o); A.tr(pp,x0+(i===2?120:200),y0+340,1); TL(g,x0+200,y0+400,d,{size:24,w:600,anchor:"middle"}); return g; });
    R.cArr=[a.arrow(s6,"M500,380 L590,380",{color:C.or,w:8}),a.arrow(s6,"M1010,380 L1100,380",{color:C.or,w:8})];
    R.chef=el("g",{},s6); el("path",{d:"M-22,0 Q-30,-30 -14,-44 L-14,-58 L14,-58 L14,-44 Q30,-30 22,0Z",fill:"#E8B923",stroke:"#8A6A00","stroke-width":3.5},R.chef); el("path",{d:"M22,-36 Q40,-36 38,-16 Q36,-6 24,-8",fill:"none",stroke:"#8A6A00","stroke-width":4},R.chef); a.tr(R.chef,1420,350,2); R.chefT=T(s6,1405,410,"son chef-d'œuvre",{size:24,w:800,col:"#8A6A00"});
    R.rules=el("g",{},s6); a.label(R.rules,800,770,"Des maîtres élus, les jurés, vérifient\nla qualité du travail de tous.",{size:28,stroke:C.roi,color:C.roi,fill:"#F5EFFA"});
    /* ===== ÉTAPE 7 : foires ===== */
    const s7=a.layer("foires"); R.s7=s7;
    const vp=el("g",{"clip-path":"url(#clipB4)"},s7); el("rect",{x:20,y:70,width:1040,height:790,fill:"#DCEBF5"},vp);
    const inner=el("g",{transform:`translate(${540-MX*MAPK},${465-MY*MAPK}) scale(${MAPK})`},vp);
    el("path",{d:E.land,fill:"#F5EFE2",stroke:"#B8AC93","stroke-width":.3},inner);
    const IT=(x,y,s,o)=>el("text",Object.assign({x,y,"font-size":5.2,"font-weight":800,fill:C.ink,stroke:"#fff","stroke-width":1.3,"paint-order":"stroke",text:s},o||{}),inner);
    const dot=(x,y,r,f)=>el("circle",{cx:x,cy:y,r,fill:f||C.ink,stroke:"#fff","stroke-width":.6},inner);
    R.mapL=[];
    const FRs=[["Lagny",537,318.7],["Provins",545.7,327.8],["Troyes",557.8,336],["Bar-sur-Aube",568.1,339]];
    R.fl=FRs.map(([n,x,y],i)=>{ const g=el("g",{},inner); el("circle",{cx:x,cy:y,r:4.8,fill:C.or,stroke:"#fff","stroke-width":.9},g); el("text",{x,y:y+1.9,"font-size":5.4,"font-weight":800,fill:"#fff","text-anchor":"middle",text:String(i+1)},g); return g; });
    const ptsPar=[531,318]; R.par=el("g",{},inner); dot(531,318,1.6,C.ink); IT(526,314,"Paris",{"text-anchor":"end"});
    R.dij=el("g",{},inner); [[571,362.5,"Dijon",3.5,1.5,"start"],[566.7,369.6,"Beaune",-3.5,3.8,"end"]].forEach(([x,y,n,dx,dy,an])=>{ el("circle",{cx:x,cy:y,r:1.8,fill:C.red,stroke:"#fff","stroke-width":.6},R.dij); el("text",{x:x+dx,y:y+dy,"font-size":5.2,"font-weight":800,fill:C.red,stroke:"#fff","stroke-width":1.3,"paint-order":"stroke","text-anchor":an,text:n},R.dij); });
    R.fr=[]; const FP=[[553.6,261.3],[639,415.3]];
    R.fl1=a.arrow(inner,`M553.6,266 C556,285 552,305 546,321`,{color:C.bl,w:1.7,head:3.5}); R.fl2=a.arrow(inner,`M636,411 C610,385 585,355 569,343`,{color:C.gr,w:1.7,head:3.5});
    R.src=[[553.6,261.3,"Flandre","#2563A8",-1],[639,415.3,"Italie du Nord","#2E8B57",1]].map(([x,y,n,c,s])=>{ const g=el("g",{},inner); el("circle",{cx:x,cy:y,r:2.4,fill:c,stroke:"#fff","stroke-width":.7},g); el("text",{x:x+(s>0?4:-4),y:y+(s>0?-3:-3.5),"font-size":5.6,"font-weight":800,fill:c,stroke:"#fff","stroke-width":1.3,"paint-order":"stroke","text-anchor":s>0?"start":"end",text:n},g); return g; });
    R.carts=[0,1,2,3].map(i=>{ const g=el("g",{},inner); el("rect",{x:-3.4,y:-2,width:6.8,height:3.6,rx:.6,fill:i<2?"#2563A8":"#2E8B57",stroke:C.ink,"stroke-width":.5},g); el("circle",{cx:-1.8,cy:2,r:1.1,fill:"#6B4524",stroke:C.ink,"stroke-width":.3},g); el("circle",{cx:1.8,cy:2,r:1.1,fill:"#6B4524",stroke:C.ink,"stroke-width":.3},g); return g; });
    R.mapT=T(s7,540,108,"L'Europe de l'Ouest au Moyen Âge",{size:28,w:800,col:"#3F5A2A"}); R.mapT.setAttribute("stroke","#fff"); R.mapT.setAttribute("stroke-width",6); R.mapT.setAttribute("paint-order","stroke");
    R.fLab1=el("g",{},s7); a.label(R.fLab1,190,262,"draps (tissus)\nde Flandre",{size:24,stroke:"#2563A8",color:"#2563A8"}); R.fLab2=el("g",{},s7); a.label(R.fLab2,830,620,"épices, soieries\nd'Italie",{size:24,stroke:"#2E8B57",color:"#2E8B57"});
    R.fLab3=el("g",{},s7); a.label(R.fLab3,150,480,"foires de\nChampagne",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3"});
    const P7=el("g",{},s7); R.p7=P7; panel(P7,1090,80,490,300,"Les foires de Champagne",C.or);
    TL(P7,1112,160,"1 Lagny  2 Provins\n3 Troyes  4 Bar-sur-Aube\nDes marchands venus de toute\nl'Europe s'y retrouvent (XIIe-XIIIe s.).",{size:24});
    panel(P7,1090,395,490,125,null,C.gris); TL(P7,1112,435,"Les foires se suivent de ville en ville\npresque toute l'année.",{size:24});
    R.ph3=a.photo(P7,{id:"h-b4-provins-tour",x:1112,y:560,w:430,h:200,cap:"Provins, ville de foire (Tour César)",rot:-1});
    /* ===== synthèse ===== */
    const sy=a.layer("synthese"); R.sy=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy); T(sy,800,80,"La ville médiévale : l'essentiel",{size:36,w:800});
    const i1=g=>{ el("path",{d:"M-44,30 L-44,-10 L-44,-16 L-34,-16 L-34,-6 L-20,-6 L-20,-16 L-8,-16 L-8,-6 L8,-6 L8,-16 L20,-16 L20,-6 L34,-6 L34,-16 L44,-16 L44,30Z",fill:C.stone,stroke:C.stoneD,"stroke-width":4},g); el("path",{d:"M-12,30 L-12,6 Q0,-8 12,6 L12,30Z",fill:"#2B2B2B"},g); };
    const i2=g=>{ el("rect",{x:-40,y:-4,width:80,height:32,fill:"#fff",stroke:C.ink,"stroke-width":3.5},g); el("path",{d:"M-46,-4 L46,-4 L36,-26 L-36,-26Z",fill:"#C0392B",stroke:C.ink,"stroke-width":3.5},g); el("path",{d:"M-18,-4 L-12,-26 M0,-4 L0,-26 M18,-4 L12,-26",stroke:"#fff","stroke-width":5},g); };
    const i3=g=>{ [[-34,"#2E8B57"],[0,"#2563A8"],[34,"#B03A2E"]].forEach(([x,c],i)=>{ const p=person(g,c,.85+i*.18,{cap:c}); A.tr(p,x,32,1); }); };
    const i4=g=>{ el("path",{d:"M-40,10 C-20,-30 20,30 40,-10",fill:"none",stroke:C.or,"stroke-width":7,"stroke-linecap":"round"},g); el("circle",{cx:-42,cy:12,r:9,fill:C.ink},g); el("circle",{cx:42,cy:-12,r:9,fill:C.ink},g); };
    R.sy3=[[i1,"Des remparts","Ils protègent la ville ; aux\nportes, on contrôle les entrées."],[i2,"Un marché et des métiers","Une rue par métier ; les artisans\nsuivent les règles de leur corporation."],[i4,"Des foires","Elles relient la ville à des\nmarchands venus de toute l'Europe."]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:320,rx:18,fill:"#FBF6EE",stroke:"#A8431F","stroke-width":3},g); const ig=el("g",{transform:`translate(${x},205)`},g); f[0](ig); T(g,x,305,f[1],{size:28,w:800,col:"#A8431F"}); TL(g,x,345,f[2],{size:23,w:500,anchor:"middle"}); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,120,500,1360,"Au Moyen Âge, il n'y avait pas de villes : tout le monde vivait dans des villages.","La plupart des gens vivent à la campagne, mais du XIe au XIIIe siècle les villes grandissent grâce au marché et aux métiers. Paris devient la plus grande ville d'Occident.");
  },
  reset(a){
    [R.pl,R.p1,R.p2,R.p3,R.p4,R.p5,R.s6,R.s7,R.sy,R.myth,R.ph1,R.ph3,R.night,R.moon,R.nightL,R.egl,R.place,R.placeT,R.streets,R.wallO,R.wallI,R.rl.boulanger,...Object.values(R.rl),...Object.values(R.hl),...R.hs,...R.towers,...R.gates,...R.pe,...R.bg,...R.coins,...R.goods,...R.mkL,R.p4n,R.river,R.rivT,R.title].forEach(e=>a.op(e,0));
    R.gates.forEach(g=>{ g.dl.setAttribute("transform","translate(-15,0) scale(0,1)"); g.dr.setAttribute("transform","translate(15,0) scale(0,1)"); });
    R.hs.forEach(h=>h.roof.setAttribute("fill","#B9A27A"));
  },
  etapes:[
  { titre:"Une ville qui grandit", duree:8000,
    legende:"À partir du XIe siècle, les récoltes sont meilleures et il y a plus d'habitants. Autour d'une église et d'une place de marché, des rues et des maisons apparaissent : la ville grandit.",
    voix:"À partir du onzième siècle, les récoltes sont meilleures et la population augmente. Autour d'une église et d'une place de marché, des rues et des maisons apparaissent : la ville grandit.",
    anim(t,a){ const s=a.seg; a.op(R.pl,1); a.op(R.river,s(t,0,.1)); a.op(R.rivT,s(t,0,.1)); a.op(R.egl,s(t,.02,.12)); a.op(R.place,s(t,.02,.12)); a.op(R.placeT,s(t,.1,.2)); a.op(R.streets,s(t,.1,.25));
      R.stP.forEach((p,i)=>a.draw(p.previousSibling,s(t,.1+i*.02,.3+i*.02)));
      R.stP.forEach((p,i)=>a.draw(p,s(t,.1+i*.02,.3+i*.02)));
      R.hs.forEach(h=>{ const u=Math.min(1,h._d/520); a.op(h,s(t,.15+u*.6,.2+u*.6)); });
      a.op(R.p1,s(t,.3,.4)); R.p1i.forEach((g,i)=>a.op(g,s(t,.4+i*.15,.5+i*.15))); a.op(R.title,s(t,.0,.1)); } },
  { titre:"Des remparts et des portes", duree:11000,
    legende:"Pour se protéger, la ville s'entoure de remparts. Les portes sont le seul passage : on y surveille ceux qui entrent, et la nuit elles se ferment.",
    voix:"Pour se protéger, la ville s'entoure de remparts : un grand mur de pierre, avec des tours. Les portes sont le seul passage. On y surveille ceux qui arrivent, et la nuit, elles se ferment. À Dijon, après un grand incendie en onze cent trente-sept, la ville s'agrandit et reçoit une nouvelle enceinte. À Beaune, les remparts ont été construits entre le treizième et le quinzième siècle.",
    anim(t,a){ const s=a.seg; a.op(R.p1,1-s(t,0,.06)); a.op(R.p2,s(t,.05,.15)); a.op(R.ph1,s(t,.2,.32));
      a.op(R.wallO,1); a.op(R.wallI,1); a.draw(R.wallO,s(t,.05,.5)); a.draw(R.wallI,s(t,.05,.5));
      R.towers.forEach(g=>{ const u=((g._d+90)%360)/360; a.op(g,s(t,.05+u*.45,.1+u*.45)); });
      R.gates.forEach(g=>{ const u=((g._d+90+360)%360)/360; a.op(g,s(t,.1+u*.4,.16+u*.4)); });
      const c=s(t,.78,.9); R.gates.forEach(g=>{ g.dl.setAttribute("transform",`translate(-15,0) scale(${c},1)`); g.dr.setAttribute("transform",`translate(15,0) scale(${c},1)`); });
      a.op(R.night,c*.45); a.op(R.moon,c); a.op(R.nightL,s(t,.82,.92)); a.op(R.title,1-s(t,.78,.88)); } },
  { titre:"Le jour de marché", duree:10000,
    legende:"Le jour du marché, les paysans entrent par les portes avec leurs produits. Les habitants achètent ce qu'ils ne fabriquent pas : le marché fait vivre la ville.",
    voix:"Le jour du marché, la ville se réveille. Les paysans entrent par les portes avec leurs produits : du grain, des légumes, des œufs, des animaux. Ils les vendent sur la place. Les habitants, eux, achètent ce qu'ils ne produisent pas. Le marché fait vivre la ville.",
    anim(t,a){ const s=a.seg; a.op(R.p2,1-s(t,0,.08)); a.op(R.ph1,1-s(t,0,.08)); a.op(R.p3,s(t,.05,.15)); const c=1-s(t,0,.15);
      R.gates.forEach(g=>{ g.dl.setAttribute("transform",`translate(-15,0) scale(${c},1)`); g.dr.setAttribute("transform",`translate(15,0) scale(${c},1)`); }); a.op(R.night,c*.45); a.op(R.moon,c); a.op(R.nightL,0); a.op(R.title,s(t,.1,.2));
      a.op(R.wallO,1); a.op(R.wallI,1); a.draw(R.wallO,1); a.draw(R.wallI,1); R.towers.forEach(g=>a.op(g,1)); R.gates.forEach(g=>a.op(g,1));
      R.bg.forEach(g=>a.op(g,s(t,.45,.55)));
      const names=["boulanger","tisserand","boucher","forgeron"];
      R.pe.forEach(p=>{ const pts=ST[names[p._i]]; const u0=.03+p._j*.12; const v=s(t,u0,.55,true); const q=pat(pts,.88*v*(p._j?.92:1)); a.op(p,s(t,u0,u0+.04)); a.tr(p,q.x,q.y+4-Math.abs(Math.sin(v*40+p._i))*4,1); });
      const ex=s(t,.6,.64); R.coins.forEach((cn,i)=>{ const ph=((t-.6)*2.4+i/6)%1; a.op(cn,ex); a.tr(cn,a.lerp(BGP[i][0],STP[i][0],ph),a.lerp(BGP[i][1]-30,STP[i][1],ph)-Math.sin(ph*Math.PI)*34,1); });
      R.goods.forEach((g,i)=>{ const ph=((t-.6)*2.4+i/6+.5)%1; a.op(g,ex); a.tr(g,a.lerp(STP[i][0],BGP[i][0],ph),a.lerp(STP[i][1],BGP[i][1]-30,ph)-Math.sin(ph*Math.PI)*30,.8); });
      a.op(R.mkL[0],s(t,.2,.3)*(1-s(t,.55,.6))); a.op(R.mkL[1],s(t,.65,.75)); } },
  { titre:"Une rue, un métier", duree:11000,
    legende:"Les artisans d'un même métier s'installent souvent dans la même rue : les bouchers, les forgerons, les tisserands… Les noms de rues le rappellent encore aujourd'hui.",
    voix:"Les artisans d'un même métier s'installent souvent dans la même rue. Ici, la rue des boulangers, des bouchers, des forgerons, des tisserands, et près de la rivière, les tanneurs. Dans les vieilles villes, les noms de rues rappellent encore ces métiers : à Dijon, par exemple, la rue des Forges ou la rue Vannerie.",
    anim(t,a){ const s=a.seg; a.op(R.p3,1-s(t,0,.08)); R.mkL.forEach(g=>a.op(g,0)); a.op(R.p4,s(t,.03,.12)); a.op(R.title,0);
      R.pe.forEach(p=>a.op(p,0)); R.bg.forEach(p=>a.op(p,0)); R.coins.forEach(p=>a.op(p,0)); R.goods.forEach(p=>a.op(p,0));
      const keys=["boulanger","boucher","forgeron","tisserand","tanneur"];
      keys.forEach((k,i)=>{ const v=s(t,.1+i*.14,.22+i*.14); R.hs.forEach(h=>{ if(h._h.tk===k) h.roof.setAttribute("fill",mixc("#B9A27A",COL[k],v)); }); a.op(R.rl[k],s(t,.14+i*.14,.24+i*.14)); a.op(R.p4i[i],s(t,.1+i*.14,.2+i*.14)); });
      a.op(R.p4n,s(t,.85,.95)); } },
  { titre:"À vous : un bâtiment, un métier", duree:7000,
    legende:"À vous : cliquez sur un bâtiment ou un métier (sur le plan ou sur un bouton) pour savoir à quoi il sert et pourquoi il est à cet endroit. Prenez votre temps !",
    voix:"À vous de jouer ! Cliquez sur un bâtiment ou sur un métier : le rempart, une porte, la place du marché, le boulanger, le boucher, le forgeron, le tisserand, le tanneur. Regardez à quoi il sert, et pourquoi il se trouve à cet endroit. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.p4,1-s(t,0,.08)); a.op(R.p4n,0); a.op(R.title,0);
      ["boulanger","boucher","forgeron","tisserand","tanneur"].forEach(k=>{ R.hs.forEach(h=>{ if(h._h.tk===k) h.roof.setAttribute("fill",COL[k]); }); a.op(R.rl[k],(1-s(t,0,.1))); });
      const v=s(t,.1,.25); a.op(R.p5,v); Object.keys(R.hl).forEach(k=>{ a.op(R.hl[k],k===sel?v:0); a.cls(R.hl[k],"pulse",k===sel); });
      const d=SELD[sel]; if(R.shown!==sel){ R.shown=sel; R.p5n.setAttribute("fill",d.col); R.p5n.textContent=d.nom; a.wrap(R.p5r,d.role,31,1.22); a.wrap(R.p5w,d.why,31,1.22); } } },
  { titre:"Les corporations", duree:11000,
    legende:"Dans chaque métier, les artisans forment une corporation avec des règles communes : apprenti, puis compagnon, puis maître après un chef-d'œuvre. Des maîtres, les jurés, contrôlent la qualité.",
    voix:"Dans chaque métier, les artisans forment une corporation, avec des règles communes. Un jeune commence comme apprenti : il apprend chez un maître. Puis il devient compagnon, et voyage de ville en ville pour se perfectionner. Pour devenir maître, il doit réussir un chef-d'œuvre, jugé par des maîtres. Ces maîtres, qu'on appelle les jurés, vérifient aussi la qualité du travail de tous.",
    anim(t,a){ const s=a.seg; a.op(R.p5,1-s(t,0,.06)); Object.keys(R.hl).forEach(k=>a.op(R.hl[k],0)); a.op(R.pl,1-s(t,0,.08)); a.op(R.s6,s(t,0,.1));
      R.c3.forEach((g,i)=>{ const v=s(t,.1+i*.2,.24+i*.2); a.op(g,v); a.tr(g,0,(1-v)*30,1); });
      a.op(R.cArr[0],s(t,.38,.46)); a.op(R.cArr[1],s(t,.62,.7)); a.op(R.chef,s(t,.64,.74)); a.op(R.chefT,s(t,.64,.74)); a.op(R.rules,s(t,.82,.94)); } },
  { titre:"Les foires : des marchands venus de loin", duree:11000,
    legende:"Au XIIe et XIIIe siècles, les foires de Champagne réunissent des marchands venus de Flandre, d'Italie et d'ailleurs. Les foires se suivent de ville en ville presque toute l'année.",
    voix:"Certaines villes accueillent de grandes foires. Aux douzième et treizième siècles, les foires de Champagne, à Lagny, Provins, Troyes et Bar-sur-Aube, réunissent des marchands venus de toute l'Europe : de Flandre avec leurs draps, d'Italie avec des épices et des soieries. Les foires se suivent de ville en ville, presque toute l'année. Dijon et Beaune ne sont pas loin !",
    anim(t,a){ const s=a.seg; a.op(R.s6,1-s(t,0,.08)); a.op(R.pl,0); a.op(R.s7,s(t,0,.1)); a.op(R.ph3,s(t,.25,.4));
      R.fl.forEach((g,i)=>a.op(g,s(t,.08+i*.06,.16+i*.06))); R.src.forEach((g,i)=>a.op(g,s(t,.3+i*.2,.38+i*.2)));
      a.draw(R.fl1.path,s(t,.35,.55)); a.op(R.fl1,s(t,.35,.38)); a.draw(R.fl2.path,s(t,.55,.75)); a.op(R.fl2,s(t,.55,.58)); a.op(R.fLab1,s(t,.45,.55)); a.op(R.fLab2,s(t,.65,.75)); a.op(R.fLab3,s(t,.15,.25));
      R.carts.forEach((g,i)=>{ const path=i<2?R.fl1.path:R.fl2.path; const f=a.seg(t,.6,1,true)*2+(i%2)*.5; const u=f%1; const q=a.along(path,u); a.tr(g,q.x,q.y-2,1); a.op(g,s(t,.6,.64)*(i<2||t>.7?1:0)); }); } },
  { titre:"Synthèse", duree:11000,
    legende:"La ville médiévale a des remparts, un marché, des métiers organisés en corporations, et des foires qui la relient à l'Europe. Non, il y avait bien des villes !",
    voix:"Retenons trois idées. Un : les remparts protègent la ville, et aux portes on contrôle les entrées. Deux : le marché et les métiers, regroupés par rue et organisés en corporations, font vivre la ville. Trois : les foires la relient à des marchands venus de toute l'Europe. Et non, au Moyen Âge, il y avait bien des villes !",
    anim(t,a){ const s=a.seg; a.op(R.s7,1-s(t,0,.08)); a.op(R.sy,s(t,0,.1)); R.sy3.forEach((f,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(f,v); a.tr(f,0,(1-v)*40,1); }); a.op(R.myth,s(t,.62,.78)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
function mixc(c1,c2,u){ const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16)); const a=p(c1),b=p(c2); return "#"+a.map((v,i)=>Math.round(v+(b[i]-v)*u).toString(16).padStart(2,"0")).join(""); }
})();
