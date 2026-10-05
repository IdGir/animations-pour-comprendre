/* META {"id":"histoire-B2-feodalite-pyramide","matiere":"histoire","annee":"B","periode":1,"theme":"Le Moyen Âge : seigneurs, chevaliers, villes… (la société féodale)","resume":"Le roi donne des fiefs à de grands seigneurs, qui en donnent à leur tour à des chevaliers : l'hommage et la fidélité lient chacun à celui qui le protège, et les paysans sont à la base.","motsCles":["féodalité","seigneur","vassal","fief","hommage","fidélité","protection","chevalier","paysans"]} */
(function(){
/* ---- bibliothèque : personnage articulé (vue de profil, tourné vers la droite) ---- */
const FL={torso:120,neck:16,head:27,th:95,sh:90,ua:62,fa:56,foot:32};
const dirv=d=>{const r=d*Math.PI/180;return [-Math.sin(r),Math.cos(r)];};   // membre : 0 = vers le bas, négatif = vers l'avant (+x)
const upv=d=>{const r=d*Math.PI/180;return [Math.sin(r),-Math.cos(r)];};    // tronc : 0 = vers le haut, positif = penché vers l'avant
const addv=(p,v,l)=>[p[0]+v[0]*l,p[1]+v[1]*l];
const POSE0={torso:0,head:0,th1:0,sh1:0,th2:4,sh2:0,ua1:8,fa1:-28,ua2:-6,fa2:-30,ax:0};
const pose=o=>Object.assign({},POSE0,o);
function mixPose(A,B,t){const o={};for(const k in A)o[k]=A[k]+((B[k]!==undefined?B[k]:A[k])-A[k])*t;return o;}
function fk(p){
  const d1=dirv(p.th1),e1=dirv(p.sh1),P={};
  if(p.hip) P.hip=[p.hip[0],p.hip[1]]; else P.hip=[p.ax-(d1[0]*FL.th+e1[0]*FL.sh),0];
  P.k1=addv(P.hip,d1,FL.th); P.a1=addv(P.k1,e1,FL.sh); P.t1=addv(P.a1,dirv(p.sh1-90),FL.foot);
  const d2=dirv(p.th2),e2=dirv(p.sh2);
  P.k2=addv(P.hip,d2,FL.th); P.a2=addv(P.k2,e2,FL.sh); P.t2=addv(P.a2,dirv(p.sh2-90),FL.foot);
  P.sh=addv(P.hip,upv(p.torso),FL.torso);
  P.hd=addv(P.sh,upv(p.torso+(p.head||0)),FL.neck+FL.head);
  P.e1=addv(P.sh,dirv(p.ua1),FL.ua); P.w1=addv(P.e1,dirv(p.fa1),FL.fa);
  P.e2=addv(P.sh,dirv(p.ua2),FL.ua); P.w2=addv(P.e2,dirv(p.fa2),FL.fa);
  if(!p.hip){
    const RR={hip:24,k1:18,a1:14,t1:13,k2:18,a2:14,t2:13,sh:30,hd:29,e1:12,w1:11,e2:12,w2:11}; let low=-1e9;
    for(const k in RR) low=Math.max(low,P[k][1]+RR[k]);
    for(const k in P) P[k]=[P[k][0],P[k][1]-low];
  }
  return P;
}
const SEGP={th1:["hip","k1"],sh1:["k1","a1"],f1:["a1","t1"],th2:["hip","k2"],sh2:["k2","a2"],f2:["a2","t2"],torso:["hip","sh"],ua1:["sh","e1"],fa1:["e1","w1"],ua2:["sh","e2"],fa2:["e2","w2"]};
const SEGORDER=["th2","sh2","f2","ua2","fa2","torso","th1","sh1","f1","ua1","fa1"];
const SW={torso:54,th:34,sh:27,ua:21,fa:18,f:20};
const swOf=s=>SW[s.replace(/[12]$/,"")];
/* o.layers : [{name,fill,stroke,grow,dash,dashCol,flat,head:(g)=>{}}] ; o.base = couleurs de base {tunic,hose,skin} */
function makeFig(a,parent,o){
  const el=a.el; const g=el("g",{},parent); const fig={g,layers:{},lines:{},joints:{}};
  const spec=o.layers;
  const lay=[];
  spec.forEach(L=>{
    const lg=el("g",{},g); fig.layers[L.name]=lg; const lines=[]; const heads=el("g",{},lg);
    const mk=(seg,w,col,extra)=>{ const ln=el("line",Object.assign({stroke:col,"stroke-width":w,"stroke-linecap":"round",fill:"none"},extra||{}),lg); lines.push({seg,ln}); return ln; };
    const grow=L.grow||0, col=ev=>typeof L.fill==="function"?L.fill(ev):L.fill;
    if(L.flat){
      SEGORDER.forEach(s=>mk(s,swOf(s)+grow+(L.stroke?5:0),L.stroke));
      SEGORDER.forEach(s=>{ if(L.skip&&L.skip.includes(s)) return; mk(s,swOf(s)+grow,col(s)); });
    } else {
      SEGORDER.forEach(s=>{ if(L.stroke) mk(s,swOf(s)+grow+4,L.stroke); mk(s,swOf(s)+grow,col(s)); if(L.dash) mk(s,Math.max(4,swOf(s)+grow-8),L.dashCol||"#555",{"stroke-dasharray":L.dash,opacity:.65}); });
    }
    if(L.flat&&L.dash) SEGORDER.forEach(s=>mk(s,Math.max(4,swOf(s)+grow-10),L.dashCol||"#555",{"stroke-dasharray":L.dash,opacity:.55}));
    const hd=el("g",{},heads); if(L.head) L.head(hd);
    const hands=L.hands?el("g",{},lg):null; const hh=[];
    if(L.hands){ [1,2].forEach(i=>{ hh.push(el("circle",{r:L.hands,fill:L.handCol||"#F1C9A5",stroke:L.handStroke||"#1E2430","stroke-width":2.5},hands)); }); }
    lay.push({lines,hd,hh,L});
  });
  fig.update=function(p,x,y,s,flip){
    const P=fk(p); fig.P=P; fig.p=p;
    g.setAttribute("transform",`translate(${x},${y}) scale(${(flip?-1:1)*s},${s})`);
    lay.forEach(l=>{
      l.lines.forEach(({seg,ln})=>{ const [A,B]=SEGP[seg]; ln.setAttribute("x1",P[A][0]); ln.setAttribute("y1",P[A][1]); ln.setAttribute("x2",P[B][0]); ln.setAttribute("y2",P[B][1]); });
      l.hd.setAttribute("transform",`translate(${P.hd[0]},${P.hd[1]}) rotate(${p.torso+(p.head||0)})`);
      l.hh.forEach((h,i)=>{ const w=P["w"+(i+1)]; h.setAttribute("cx",w[0]); h.setAttribute("cy",w[1]); });
    });
    return P;
  };
  return fig;
}
const SKIN="#F1C9A5";
function baseLayer(tunic,hose,o){ o=o||{};
  return {name:"base",flat:true,stroke:"#1E2430",hands:11,handCol:SKIN,
    fill:s=>/^th|^sh[12]|^f/.test(s)?hose:(s==="torso"||/^ua/.test(s)?tunic:(o.sleeve||tunic)),
    head:g=>{ a_el("circle",{r:27,fill:SKIN,stroke:"#1E2430","stroke-width":2.5},g); a_el("circle",{cx:11,cy:-4,r:3.5,fill:"#1E2430"},g);
      if(o.hat==="crown"){ a_el("path",{d:"M-22,-22 L-24,-52 L-10,-36 L0,-58 L10,-36 L24,-52 L22,-22Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":2.5},g); }
      else if(o.hat==="cap"){ a_el("path",{d:"M-27,-6 A27,27 0 0 1 27,-6 L27,-14 A27,27 0 0 0 -27,-14Z",fill:o.hatCol||"#6B3FA0",stroke:"#1E2430","stroke-width":2.5},g); a_el("rect",{x:-27,y:-16,width:54,height:10,rx:4,fill:o.hatCol||"#6B3FA0",stroke:"#1E2430","stroke-width":2.5},g); }
      else if(o.hat==="hair"){ a_el("path",{d:"M-26,-4 A27,27 0 0 1 26,-8 L8,-18 Q-8,-14 -22,-8Z",fill:o.hatCol||"#5B3A1E",stroke:"#1E2430","stroke-width":2},g); }
      else if(o.hat==="coif"){ a_el("path",{d:"M-28,6 A28,28 0 1 1 28,6 L14,-4 L14,-14 Q0,-20 -14,-14 L-14,6Z",fill:o.hatCol||"#E9E2D0",stroke:"#1E2430","stroke-width":2.5},g); }
    }};
}
var a_el=(t,at,p)=>Anim.H.el(t,at,p);
let R={}, A=null;
const C={roi:"#6B3FA0",gs:"#2563A8",ch:"#B03A2E",pay:"#8C6D46",or:"#E07A1F",gr:"#2E8B57",ink:"#1E2430",gold:"#D4A017",red:"#C0392B",gris:"#4A5468"};
const K=[640,195], GS=[[400,370],[640,370],[880,370]], CH=[[330,545],[470,545],[570,545],[710,545],[810,545],[950,545]], CHP=[0,0,1,1,2,2];
const PAYY=718, PAYX=[-42,0,42];
function T(p,x,y,s,o){o=o||{};return A.el("text",{x,y,"font-size":o.size||24,"font-weight":o.w||700,fill:o.col||C.ink,"text-anchor":o.anchor||"middle",text:s},p);}
function TL(p,x,y,lines,o){o=o||{};const sz=o.size||24;const t=A.el("text",{x,y,"font-size":sz,"font-weight":o.w||600,fill:o.col||C.ink,"text-anchor":o.anchor||"start"},p);lines.split("\n").forEach((l,i)=>A.el("tspan",{x,dy:i?sz*1.28:0,text:l},t));return t;}
/* petit bonhomme d'icône */
function person(p,col,s,o){ o=o||{}; const g=A.el("g",{},p); const q=A.el("g",{transform:`scale(${s})`},g);
  A.el("path",{d:"M-15,-40 L15,-40 L21,0 L-21,0Z",fill:col,stroke:C.ink,"stroke-width":2.4},q);
  A.el("circle",{cx:0,cy:-52,r:13,fill:"#F1C9A5",stroke:C.ink,"stroke-width":2.4},q);
  if(o.crown) A.el("path",{d:"M-13,-60 l-2,-16 l8,8 l7,-12 l7,12 l8,-8 l-2,16Z",fill:"#F2C230",stroke:"#8A6A00","stroke-width":2},q);
  if(o.helm){ A.el("path",{d:"M-14,-54 A14,14 0 0 1 14,-54 L14,-48 L-14,-48Z",fill:"#B9C2CC",stroke:C.ink,"stroke-width":2.2},q); A.el("path",{d:"M0,-66 q10,-8 18,0 q-6,2 -10,8",fill:C.red,stroke:C.ink,"stroke-width":1.5},q); }
  if(o.coronet) A.el("path",{d:"M-12,-62 l2,-8 l5,6 l5,-8 l5,8 l5,-6 l2,8Z",fill:"#C9D1DA",stroke:C.ink,"stroke-width":2},q);
  if(o.hat) A.el("path",{d:"M-18,-60 Q0,-76 18,-60Z",fill:"#C9B07A",stroke:C.ink,"stroke-width":2},q);
  if(o.shield){ A.el("path",{d:"M10,-34 L30,-34 L30,-18 Q30,-6 20,0 Q10,-6 10,-18Z",fill:"#fff",stroke:C.ink,"stroke-width":2.2},q); A.el("path",{d:"M20,-34 L20,0 M10,-22 L30,-22",stroke:C.ch,"stroke-width":3},q); }
  g._s=s; return g; }
function house(p,x,y,s,col){ const g=A.el("g",{transform:`translate(${x},${y}) scale(${s||1})`},p); A.el("rect",{x:-18,y:-22,width:36,height:22,fill:col||"#EADBC0",stroke:C.ink,"stroke-width":2.2},g); A.el("path",{d:"M-23,-22 L0,-42 L23,-22Z",fill:"#A8431F",stroke:C.ink,"stroke-width":2.2},g); return g; }
/* jetons qui circulent */
function tokFief(p){ const g=A.el("g",{},p); A.el("rect",{x:-20,y:-12,width:40,height:26,rx:4,fill:"#9BD08A",stroke:"#2E6B3A","stroke-width":3},g); A.el("path",{d:"M-8,-12 L-8,-34 L14,-27 L-8,-20",fill:C.red,stroke:C.ink,"stroke-width":2},g); A.el("line",{x1:-8,y1:-12,x2:-8,y2:-36,stroke:C.ink,"stroke-width":3},g); return g; }
function tokShield(p){ const g=A.el("g",{},p); A.el("path",{d:"M-18,-20 L18,-20 L18,0 Q18,16 0,24 Q-18,16 -18,0Z",fill:"#CFE0F7",stroke:C.gs,"stroke-width":3.5},g); A.el("path",{d:"M0,-20 L0,24 M-18,-4 L18,-4",stroke:C.gs,"stroke-width":3.5},g); return g; }
function tokSword(p){ const g=A.el("g",{transform:"rotate(45)"},p); A.el("rect",{x:-4,y:-26,width:8,height:42,fill:"#DDE3EA",stroke:C.ink,"stroke-width":2.5},g); A.el("path",{d:"M-4,-26 L0,-36 L4,-26Z",fill:"#DDE3EA",stroke:C.ink,"stroke-width":2.5},g); A.el("rect",{x:-14,y:14,width:28,height:7,rx:2,fill:"#8A6A00",stroke:C.ink,"stroke-width":2.5},g); A.el("rect",{x:-3,y:21,width:6,height:12,fill:"#6B4524",stroke:C.ink,"stroke-width":2},g); return g; }
function tokBubble(p){ const g=A.el("g",{},p); A.el("path",{d:"M-24,-18 Q-24,-26 -16,-26 L16,-26 Q24,-26 24,-18 L24,2 Q24,10 16,10 L-4,10 L-14,22 L-12,10 L-16,10 Q-24,10 -24,2Z",fill:"#EBDDF7",stroke:C.roi,"stroke-width":3},g); [-12,0,12].forEach(x=>A.el("circle",{cx:x,cy:-8,r:3.5,fill:C.roi},g)); return g; }
function tokSack(p){ const g=A.el("g",{},p); A.el("path",{d:"M-18,14 Q-24,-14 -8,-24 L8,-24 Q24,-14 18,14Z",fill:"#E8D3A2",stroke:"#8A6A3A","stroke-width":3},g); A.el("path",{d:"M-8,-24 L0,-32 L8,-24",fill:"none",stroke:"#8A6A3A","stroke-width":3},g); return g; }
function tokScroll(p){ const g=A.el("g",{},p); A.el("rect",{x:-26,y:-16,width:52,height:32,rx:6,fill:"#F7ECC8",stroke:"#8A6A00","stroke-width":3},g); A.el("rect",{x:-30,y:-20,width:10,height:40,rx:5,fill:"#E3CF93",stroke:"#8A6A00","stroke-width":2.5},g); A.el("rect",{x:20,y:-20,width:10,height:40,rx:5,fill:"#E3CF93",stroke:"#8A6A00","stroke-width":2.5},g); [-6,4,14].forEach(y=>A.el("line",{x1:-14,y1:y-4,x2:14,y2:y-4,stroke:"#8A6A00","stroke-width":2},g)); A.el("circle",{cx:0,cy:12,r:6,fill:C.red},g); return g; }
function panel(p,x,y,w,h,title,col){ const g=A.el("g",{},p); A.el("rect",{x,y,width:w,height:h,rx:16,fill:"#fff",stroke:col||C.or,"stroke-width":3.5},g); if(title) T(g,x+w/2,y+44,title,{size:30,w:800,col:col||C.or}); return g; }
const frac=v=>v-Math.floor(v);
/* ---- manipulation : choisir un personnage de la pyramide ---- */
let sel="ch";
const ROLES={
 roi:{nom:"Le roi",col:"#6B3FA0",band:0,btn:"Le roi",
  doit:["Protéger ses vassaux et rendre la justice.","Leur donner des fiefs."],
  recoit:["La fidélité de ses grands vassaux.","Leur aide militaire : des soldats pour son armée.","Leurs conseils."]},
 gs:{nom:"Un grand seigneur",col:"#2563A8",band:1,btn:"Un grand seigneur",
  doit:["Au roi : fidélité, aide militaire et conseils.","À ses chevaliers : un fief et sa protection."],
  recoit:["Du roi : un fief et sa protection.","De ses chevaliers : fidélité et aide militaire."]},
 ch:{nom:"Un chevalier",col:"#B03A2E",band:2,btn:"Un chevalier",
  doit:["À son seigneur : fidélité et aide militaire (il combat à cheval).","Aux paysans de son domaine : sa protection."],
  recoit:["Un fief et la protection de son seigneur.","Des paysans : des redevances et des corvées."]},
 pay:{nom:"Un paysan",col:"#8C6D46",band:3,btn:"Un paysan",
  doit:["Au seigneur du domaine : des redevances (une part de la récolte, un peu d'argent) et des corvées (du travail gratuit)."],
  recoit:["Sa protection.","Le droit de cultiver une terre pour nourrir sa famille."]}
};
const RK=["roi","gs","ch","pay"];
function pick(k){ sel=k; RK.forEach(r=>{ const b=document.getElementById("pB_"+r); if(b) b.classList.toggle("sel",r===k); }); if(A) A.redraw(); }
Anim.run({
  titre:"La société féodale : seigneurs, vassaux et fiefs",
  sousTitre:"Histoire · CM1-CM2 · Thème 1 : le Moyen Âge",
  matiere:"histoire", badge:"Histoire", manipDes:5, manipJusqua:5,
  accroche:"Comment le roi gouverne-t-il un grand royaume ? Il partage…",
  init(a){
    A=a; const {el}=a;
    /* ---- étape 1 : le royaume ---- */
    const kd=a.layer("royaume"); R.kd=kd;
    el("path",{d:"M120,260 Q200,140 420,170 Q700,100 980,170 Q1300,150 1480,300 Q1560,520 1440,700 Q1200,830 900,780 Q600,840 330,770 Q110,700 90,500Z",fill:"#E4EFCF",stroke:"#8DA66A","stroke-width":4},kd);
    T(kd,800,92,"Un grand royaume, vers l'an 1000",{size:34,w:800});
    const kg=el("g",{transform:"translate(230,470)"},kd);
    el("rect",{x:-90,y:-120,width:180,height:120,fill:"#D9CCB3",stroke:"#8C7A5B","stroke-width":4},kg); [-90,-50,-10,30,60].forEach(x=>el("rect",{x,y:-138,width:30,height:20,fill:"#D9CCB3",stroke:"#8C7A5B","stroke-width":3},kg));
    el("path",{d:"M-24,0 L-24,-52 Q0,-84 24,-52 L24,0Z",fill:"#3A3F4A"},kg);
    const kp=person(kd,C.roi,1.9,{crown:true}); a.tr(kp,230,640,1);
    T(kd,230,700,"le roi",{size:28,w:800,col:C.roi});
    const VL=[[520,260],[700,200],[900,250],[1130,215],[1350,300],[480,420],[640,560],[820,420],[1000,520],[1230,440],[1400,560],[560,700],[880,690],[1150,680]];
    R.vil=VL.map(([x,y])=>house(kd,x,y,1.1)); R.vlines=VL.map(([x,y])=>el("path",{d:`M290,520 L${x},${y-18}`,fill:"none",stroke:C.red,"stroke-width":3,"stroke-dasharray":"10 8"},kd));
    R.msg=el("g",{},kd); person(R.msg,C.or,.8); R.msgT=el("g",{},kd); a.label(R.msgT,0,0,"des jours de route",{size:24,stroke:C.or,color:"#8A4A0E"});
    R.k1=el("g",{},kd); a.label(R.k1,800,840,"Le roi ne peut pas tout commander seul : c'est trop grand, trop loin.",{size:28,stroke:C.red,color:C.red,fill:"#FDECEA"});
    /* ---- pyramide ---- */
    const bg=a.layer("bandes"); R.bg=bg;
    R.bands=[]; [[70,210,"#F5EFFA","Le roi"],[280,170,"#EAF1FA","Grands\nseigneurs"],[450,175,"#FBECE9","Seigneurs\nchevaliers"],[625,200,"#F4EDE2","Paysans"]].forEach(([y,h,c,t],bi)=>{ R.bands.push([y,h]); const br=el("rect",{x:20,y,width:1040,height:h,fill:c,stroke:"#D6DBE4","stroke-width":2},bg); br.style.cursor="pointer"; br.onclick=()=>pick(["roi","gs","ch","pay"][bi]); TL(bg,36,y+h/2+(t.includes("\n")?-4:10),t,{size:24,w:800,col:C.gris}); });
    const py=a.layer("pyramide"); R.py=py;
    R.links=[]; R.lkG=el("g",{},py);
    const mkLink=(x1,y1,x2,y2,col,w,dash)=>{ const p=el("path",{d:`M${x1},${y1} L${x2},${y2}`,fill:"none",stroke:col,"stroke-width":w,"stroke-dasharray":dash||null},R.lkG); return p; };
    R.lkGS=GS.map(g=>mkLink(K[0],K[1]+12,g[0],g[1]-92,"#8E7FA8",5));
    R.lkCH=CH.map((c,i)=>{ const g=GS[CHP[i]]; return mkLink(g[0],g[1]+12,c[0],c[1]-84,"#8E7FA8",5); });
    R.lkPay=[]; CH.forEach((c,i)=>PAYX.forEach(dx=>R.lkPay.push(mkLink(c[0],c[1]+12,c[0]+dx,PAYY-68,"#B5A58A",3,"6 6"))));
    R.king=person(py,C.roi,1.45,{crown:true}); a.tr(R.king,K[0],K[1],1);
    R.gs=GS.map(g=>{ const p=person(py,C.gs,1.25,{coronet:true}); a.tr(p,g[0],g[1],1); return p; });
    R.ch=CH.map(c=>{ const p=person(py,C.ch,1.15,{helm:true,shield:true}); a.tr(p,c[0],c[1],1); return p; });
    R.pay=[]; CH.forEach(c=>PAYX.forEach(dx=>{ const p=person(py,C.pay,.95,{hat:true}); a.tr(p,c[0]+dx,PAYY,1); R.pay.push(p); }));
    /* parcelles (fiefs) posées à côté des seigneurs */
    R.fiefs=GS.map(g=>{ const f=tokFief(py); return f; });
    /* jetons qui circulent */
    const tk=a.layer("jetons"); R.tk=tk;
    const mkTk=(f,n)=>[...Array(n)].map(()=>f(tk));
    R.tFiefDown=[...GS.map(()=>tokFief(tk)),...CH.map(()=>tokFief(tk))];
    R.tSwordUp=[...GS.map(()=>tokSword(tk)),...CH.map(()=>tokSword(tk))];
    R.tShield=CH.map(()=>tokShield(tk)); R.tSack=CH.map(()=>tokSack(tk));
    R.scroll=tokScroll(tk);
    /* panneau vocabulaire (étape 2) */
    const vo=a.layer("vocab"); R.vo=vo; panel(vo,1090,90,490,520,"Le vocabulaire",C.roi);
    R.voI=[["Seigneur","celui qui donne un fief\net protège son vassal",C.gs],["Vassal","celui qui reçoit un fief\net jure d'être fidèle",C.ch],["Fief","une terre (avec ses paysans)\nconfiée au vassal",C.gr]].map((v,i)=>{ const g=el("g",{},vo); const y=160+i*148; T(g,1120,y+20,v[0],{size:30,w:800,col:v[2],anchor:"start"}); TL(g,1120,y+60,v[1],{size:24}); return g; });
    /* ---- étape 3 : la cérémonie ---- */
    const ce=a.layer("ceremonie"); R.ce=ce;
    el("rect",{x:20,y:70,width:1040,height:790,rx:14,fill:"#F6F0E4",stroke:"#D6DBE4","stroke-width":2},ce);
    el("rect",{x:20,y:700,width:1040,height:160,fill:"#D9CDB4"},ce);
    el("path",{d:"M60,700 L60,260 Q60,150 170,150 Q280,150 280,260 L280,700Z",fill:"#E9DFCB",stroke:"#8C7A5B","stroke-width":3},ce);
    el("path",{d:"M800,700 L800,260 Q800,150 910,150 Q1020,150 1020,260 L1020,700Z",fill:"#E9DFCB",stroke:"#8C7A5B","stroke-width":3},ce);
    el("path",{d:"M400,150 L640,100 L880,150 L880,185 L400,185Z",fill:C.roi,opacity:.9},ce);
    T(ce,640,174,"Dans la grande salle du château",{size:24,w:800,col:"#fff"});
    R.lord=makeFig(a,ce,{layers:[baseLayer("#2F5FA8","#4A5468",{hat:"crown"})]});
    R.vass=makeFig(a,ce,{layers:[baseLayer("#B03A2E","#4A5468",{hat:"hair"})]});
    R.cLab=[["Le vassal s'agenouille",430,650],["Hommage : les mains jointes dans celles du seigneur",540,580],["Serment de fidélité sur des reliques",720,560],["Investiture : un objet représente le fief",300,470]];
    R.relic=el("g",{},ce); el("rect",{x:-34,y:-22,width:68,height:44,rx:6,fill:"#F2C230",stroke:"#8A6A00","stroke-width":3.5},R.relic); el("path",{d:"M-34,-22 L0,-46 L34,-22Z",fill:"#E0AD1F",stroke:"#8A6A00","stroke-width":3.5},R.relic); el("rect",{x:-6,y:-12,width:12,height:24,fill:"#8A6A00"},R.relic); el("rect",{x:-14,y:-4,width:28,height:8,fill:"#8A6A00"},R.relic);
    R.relicT=el("g",{},ce); R.clod=el("g",{},ce); el("path",{d:"M-24,10 Q-24,-14 0,-16 Q24,-14 24,10Z",fill:"#7A5A3A",stroke:C.ink,"stroke-width":3},R.clod); el("path",{d:"M-6,-16 Q-10,-30 -2,-34 Q-6,-24 2,-26 Q6,-30 8,-18",fill:"none",stroke:"#2E8B57","stroke-width":3.5},R.clod);
    R.glow=el("circle",{r:46,fill:"none",stroke:C.or,"stroke-width":6},ce);
    R.phL=el("g",{},ce);
    const PH=["Il s'agenouille devant son seigneur.","Hommage : il met ses mains jointes dans les siennes.","Fidélité : il jure sur des reliques ou la Bible.","Investiture : le seigneur lui remet un objet qui représente le fief (une motte de terre…)."];
    R.ph=PH.map((s,i)=>{ const g=el("g",{},ce); const y=545+i*0; return g; });
    const cl=a.layer("cerlist"); R.cl=cl; panel(cl,1090,520,490,340,null,C.roi);
    R.clI=PH.map((s,i)=>{ const g=el("g",{},cl); const y=560+i*76; el("circle",{cx:1122,cy:y+8,r:17,fill:C.roi},g); T(g,1122,y+16,String(i+1),{size:22,w:800,col:"#fff"}); const t=el("text",{x:1150,y:y+4,"font-size":22,"font-weight":600,fill:C.ink},g); a.wrap(t,s,33,1.2); return g; });
    R.photo1=a.photo(cl,{id:"h-b2-hommage",x:1110,y:98,w:430,h:300,cap:"Un hommage : mains jointes (enluminure)",rot:1.5});
    /* ---- étape 4 : ce qui circule entre les deux ---- */
    const du=a.layer("duo"); R.du=du;
    el("rect",{x:20,y:70,width:1560,height:790,rx:14,fill:"#FBF6EE",stroke:"#D6DBE4","stroke-width":2},du);
    el("rect",{x:20,y:760,width:1560,height:100,fill:"#E6DCC6"},du);
    R.duoL=makeFig(a,du,{layers:[baseLayer("#2F5FA8","#4A5468",{hat:"crown"})]});
    R.duoR=makeFig(a,du,{layers:[baseLayer("#B03A2E","#4A5468",{hat:"hair"})]});
    T(du,260,845,"le seigneur",{size:30,w:800,col:C.gs}); T(du,1340,845,"son vassal",{size:30,w:800,col:C.ch});
    R.pDown=el("path",{d:"M420,560 Q800,740 1180,560",fill:"none",stroke:C.gr,"stroke-width":6,"stroke-linecap":"round"},du);
    R.pUp=el("path",{d:"M1180,330 Q800,150 420,330",fill:"none",stroke:C.red,"stroke-width":6,"stroke-linecap":"round"},du);
    R.heads=el("g",{},du);
    [[M=>[1180,330,420,330,800,240],0]].forEach(()=>{});
    R.dTop=el("g",{},du); T(R.dTop,800,120,"Le vassal donne :",{size:30,w:800,col:C.red}); R.dTopL=[["sa fidélité (il a juré)"],["son aide militaire"],["ses conseils"]];
    R.dTopTxt=T(du,800,172,"sa fidélité, son aide militaire (souvent une quarantaine de jours par an), ses conseils",{size:24,w:600}); 
    R.dBot=T(du,800,790,"Le seigneur donne : un fief et sa protection",{size:30,w:800,col:C.gr});
    R.dTok=[tokSword(du),tokBubble(du),tokSword(du),tokBubble(du)]; R.dTokB=[tokFief(du),tokShield(du),tokFief(du),tokShield(du)];
    R.dLabUp=[["aide militaire",900,205],["conseil",640,205]]; R.dLabDown=[["fief",640,655],["protection",960,655]];
    R.dLU=R.dLabUp.map(([s,x,y])=>{ const g=el("g",{},du); a.label(g,x,y,s,{size:24,stroke:C.red,color:C.red}); return g; });
    R.dLD=R.dLabDown.map(([s,x,y])=>{ const g=el("g",{},du); a.label(g,x,y,s,{size:24,stroke:C.gr,color:C.gr}); return g; });
    /* ---- étape 5 : légende des flux ---- */
    const lg=a.layer("legende"); R.lg=lg; panel(lg,1090,90,490,760,"Qui donne quoi ?",C.roi);
    R.lgI=[[tokFief,"fief : une terre"],[tokShield,"protection"],[tokSword,"aide militaire"],[tokSack,"redevances et\ncorvées des paysans"]].map(([f,s],i)=>{ const g=el("g",{},lg); const y=190+i*100; const ic=f(g); a.tr(ic,1150,y+14,1.25); TL(g,1210,y+(s.includes("\n")?6:16),s,{size:24}); return g; });
    R.lgN=el("g",{},lg); a.label(R.lgN,1335,640,"Les paysans ne sont pas\ndes vassaux : pas d'hommage,\nmais des redevances\net des corvées.",{size:24,stroke:C.pay,color:"#5A4A30",w:440,fill:"#FBF3E2"});
    /* ---- étape 6 : l'ordre du roi ---- */
    const od=a.layer("ordre"); R.od=od; panel(od,1090,90,490,760,"Un ordre du roi…",C.roi);
    R.odI=["Le roi donne un ordre à ses grands vassaux.","Chaque grand seigneur le transmet à ses propres vassaux.","Chaque chevalier le transmet aux paysans de son domaine."].map((s,i)=>{ const g=el("g",{},od); const y=190+i*190; el("circle",{cx:1128,cy:y+8,r:20,fill:C.roi},g); T(g,1128,y+17,String(i+1),{size:26,w:800,col:"#fff"}); const t=el("text",{x:1164,y:y+6,"font-size":26,"font-weight":600,fill:C.ink},g); a.wrap(t,s,23,1.25); return g; });
    R.odBox=el("g",{},od); a.label(R.odBox,1335,790,"Le roi n'a de lien direct\nqu'avec ses grands vassaux.",{size:24,stroke:C.or,color:"#8A4A0E",fill:"#FFF3E3",w:450});
    R.chain=[[K[0],K[1]-40],[GS[1][0],GS[1][1]-45],[CH[2][0],CH[2][1]-45],[CH[2][0],PAYY-92]];
    /* ---- étape 6 : manipulation (choisir un personnage) ---- */
    R.hiB=R.bands.map(([y,h])=>el("rect",{x:20,y,width:1040,height:h,fill:"none",stroke:C.or,"stroke-width":8,"pointer-events":"none"},bg));
    R.rk={roi:[R.king],gs:R.gs,ch:R.ch,pay:R.pay};
    RK.forEach(r=>R.rk[r].forEach(g=>{ g.style.cursor="pointer"; g.onclick=()=>pick(r); }));
    const pc=a.layer("choix"); R.pc=pc; panel(pc,1090,90,490,760,"Qui doit quoi ?",C.roi);
    R.pcName=T(pc,1335,196,"",{size:38,w:800});
    el("rect",{x:1110,y:220,width:450,height:250,rx:12,fill:"#FDECEA",stroke:C.red,"stroke-width":3},pc); T(pc,1130,254,"Il doit donner :",{size:26,w:800,col:C.red,anchor:"start"},pc);
    R.pcDoit=el("text",{x:1130,y:292,"font-size":24,"font-weight":600,fill:C.ink},pc);
    el("rect",{x:1110,y:486,width:450,height:344,rx:12,fill:"#E8F6EE",stroke:C.gr,"stroke-width":3},pc); T(pc,1130,520,"Il reçoit en échange :",{size:26,w:800,col:C.gr,anchor:"start"},pc);
    R.pcRec=el("text",{x:1130,y:558,"font-size":24,"font-weight":600,fill:C.ink},pc);
    a.manip.innerHTML="Choisis un personnage : "+RK.map(r=>`<button id="pB_${r}"${r===sel?' class="sel"':""}>${ROLES[r].btn}</button>`).join("");
    RK.forEach(r=>{ document.getElementById("pB_"+r).onclick=()=>pick(r); });
    /* ---- synthèse ---- */
    const sy=a.layer("synthese"); R.sy=sy; el("rect",{x:0,y:0,width:1600,height:900,fill:"#fff"},sy);
    T(sy,800,80,"La société féodale : l'essentiel",{size:36,w:800});
    const ic1=g=>{ el("path",{d:"M-34,-34 L34,-34 L34,0 Q34,34 0,48 Q-34,34 -34,0Z",fill:"#CFE0F7",stroke:C.gs,"stroke-width":5},g); el("path",{d:"M0,-34 L0,48 M-34,-6 L34,-6",stroke:C.gs,"stroke-width":5},g); };
    const ic2=g=>{ el("path",{d:"M-52,10 Q-30,-24 0,-8 L0,22 Q-30,30 -52,10Z",fill:"#F1C9A5",stroke:C.ink,"stroke-width":4},g); el("path",{d:"M52,10 Q30,-24 0,-8 L0,22 Q30,30 52,10Z",fill:"#F7D9BC",stroke:C.ink,"stroke-width":4},g); el("path",{d:"M-12,-6 L12,-6",stroke:C.ink,"stroke-width":4},g); };
    const ic3=g=>{ [[0,-30,C.roi],[-26,0,C.gs],[26,0,C.gs],[-52,30,C.ch],[0,30,C.ch],[52,30,C.ch]].forEach(([x,y,c])=>el("circle",{cx:x,cy:y,r:13,fill:c,stroke:C.ink,"stroke-width":2.5},g)); el("path",{d:"M0,-30 L-26,0 M0,-30 L26,0 M-26,0 L-52,30 M-26,0 L0,30 M26,0 L0,30 M26,0 L52,30",stroke:C.ink,"stroke-width":2.5,fill:"none"},g); };
    R.sy3=[[ic1,"Protection contre service","Le seigneur donne un fief\net protège ; le vassal\nlui reste fidèle et l'aide."],[ic2,"Un lien par l'hommage","Mains jointes, serment,\nremise d'un objet :\nle lien est public et solennel."],[ic3,"Une chaîne de liens","Le roi, de grands seigneurs,\ndes chevaliers, puis\nles paysans qui travaillent."]].map((f,i)=>{ const g=el("g",{},sy); const x=290+i*510; el("rect",{x:x-230,y:120,width:460,height:320,rx:18,fill:"#FBF6EE",stroke:"#A8431F","stroke-width":3},g); const ig=el("g",{transform:`translate(${x},205)`},g); f[0](ig); T(g,x,305,f[1],{size:28,w:800,col:"#A8431F"}); TL(g,x,345,f[2],{size:23,w:500,anchor:"middle"}); return g; });
    R.myth=a.layer("myth"); a.myth(R.myth,120,500,1360,"Le roi commande directement tous les habitants du royaume.","Le roi est lié à ses grands vassaux ; ceux-ci le sont à leurs chevaliers, qui commandent les paysans. Chacun obéit d'abord à son propre seigneur. (Schéma simplifié : un seigneur pouvait être vassal de plusieurs seigneurs.)");
  },
  reset(a){ [R.kd,R.bg,R.py,R.tk,R.vo,R.ce,R.cl,R.du,R.lg,R.od,R.sy,R.myth,R.msg,R.msgT,R.k1,R.photo1,R.pc,...R.hiB].forEach(e=>a.op(e,0)); R.vil.forEach(e=>a.op(e,1)); R.tk.querySelectorAll(":scope>g").forEach(g=>a.op(g,0)); R.lkGS.forEach(l=>{l.setAttribute("stroke","#8E7FA8");l.setAttribute("stroke-width",5);}); },
  etapes:[
  { titre:"Un royaume trop grand", duree:8000,
    legende:"Vers l'an 1000, le royaume est grand, les routes sont lentes et peu sûres. Le roi ne peut pas commander lui-même tous les villages.",
    voix:"Vers l'an mille, le royaume est très grand, et les routes sont lentes et peu sûres. Le roi ne peut pas commander lui-même tous les villages : un message met des jours à arriver, et il y a trop de monde à gouverner.",
    anim(t,a){ const s=a.seg; a.op(R.kd,1); R.vlines.forEach((l,i)=>a.draw(l,s(t,.08+i*.03,.2+i*.03))); const mv=s(t,.45,.92,true); const to=[1400,560]; a.op(R.msg,s(t,.45,.5)); a.tr(R.msg,a.lerp(290,to[0],mv),a.lerp(520,to[1]-18,mv)+0,1); a.op(R.msgT,s(t,.5,.6)); a.tr(R.msgT,900,860-0,1); R.msgT.setAttribute("transform","translate(1050,430)"); a.op(R.k1,s(t,.78,.92)); } },
  { titre:"Le roi donne un fief", duree:9000,
    legende:"Le roi confie des terres, les fiefs, à quelques grands seigneurs. En échange, ceux-ci lui promettent fidélité et aide : ce sont ses vassaux.",
    voix:"Alors le roi partage. Il confie des terres, qu'on appelle des fiefs, à quelques grands seigneurs. En échange, ces grands seigneurs lui promettent fidélité et aide : ils deviennent ses vassaux.",
    anim(t,a){ const s=a.seg; a.op(R.kd,1-s(t,0,.08)); a.op(R.bg,s(t,.04,.12)); a.op(R.py,s(t,.04,.12)); R.pay.forEach(p=>a.op(p,0)); R.ch.forEach(p=>a.op(p,0)); R.lkCH.forEach(l=>a.op(l,0)); R.lkPay.forEach(l=>a.op(l,0)); a.op(R.king,s(t,.08,.16));
      GS.forEach((g,i)=>{ const st=.14+i*.17; a.draw(R.lkGS[i],s(t,st,st+.08)); a.op(R.gs[i],s(t,st+.12,st+.2)); const f=R.fiefs[i]; const p=s(t,st+.04,st+.2); const x=a.lerp(K[0]+34,g[0]+62,p), y=a.lerp(K[1]-40,g[1]-28,p)-Math.sin(p*Math.PI)*60; a.tr(f,x,y,1); a.op(f,s(t,st+.04,st+.07)); });
      a.op(R.vo,s(t,.6,.7)); R.voI.forEach((g,i)=>a.op(g,s(t,.62+i*.1,.7+i*.1))); } },
  { titre:"L'hommage", duree:11000,
    legende:"Pour devenir vassal, il faut un hommage : à genoux, il met ses mains jointes dans celles du seigneur, jure fidélité, puis reçoit un objet qui représente le fief.",
    voix:"Pour devenir vassal, on fait l'hommage. Le futur vassal s'agenouille, il met ses mains jointes dans celles de son seigneur, puis il jure d'être fidèle, souvent sur des reliques. Enfin, le seigneur lui remet un objet qui représente le fief, par exemple une motte de terre.",
    anim(t,a){ const s=a.seg; a.op(R.bg,1-s(t,0,.08)); a.op(R.py,1-s(t,0,.08)); a.op(R.vo,1-s(t,0,.08)); a.op(R.ce,s(t,0,.1)); a.op(R.cl,s(t,.05,.12)); a.op(R.photo1,s(t,.12,.3));
      const G=800, SC=1.15;
      // vassal : marche, s'agenouille
      const stand=pose({ua1:10,fa1:-30}), kneel=pose({torso:14,th1:-92,sh1:2,th2:8,sh2:84,ua1:-98,fa1:-96,ua2:-100,fa2:-96});
      const walk=s(t,.0,.2), kn=s(t,.22,.34); const walkBob=Math.abs(Math.sin(walk*Math.PI*6))*3*(1-kn);
      const pv=mixPose(stand,kneel,kn); pv.ax=a.lerp(150,500,walk);
      const PV=R.vass.update(pv,0,G-walkBob,SC,false); R.vass.g.setAttribute("transform",`translate(0,${G-walkBob}) scale(${SC},${SC})`);
      // seigneur (debout, face au vassal, bras tendus)
      const pl=pose({torso:-3,ua1:-62,fa1:-98,ua2:-70,fa2:-100,th2:4,ax:0});
      const PL=R.lord.update(pl,0,G,SC,true);
      // place le seigneur pour que ses mains rencontrent celles du vassal (fin du pas 'kneel')
      const kv=fk(Object.assign({},kneel,{ax:500})); const lv=fk(pl);
      const wx=kv.w1[0]*SC; const lx=wx+lv.w1[0]*SC-6;
      R.lord.g.setAttribute("transform",`translate(${lx},${G}) scale(${-SC},${SC})`);
      // mains jointes : halo
      const hx=wx, hy=G+kv.w1[1]*SC; a.op(R.glow,s(t,.4,.46)*(1-s(t,.62,.7))); a.set(R.glow,{cx:hx+6,cy:hy}); a.cls(R.glow,"pulse",true);
      // reliques
      const rp=s(t,.6,.68); a.op(R.relic,rp); a.tr(R.relic,hx+10,hy-80-(1-rp)*40,1.1); a.op(R.clod,0);
      const cp=s(t,.78,.88); a.op(R.clod,cp); a.tr(R.clod,hx+10,hy-60+(1-cp)*30-20,1.5);
      a.op(R.relic,rp*(1-s(t,.74,.78)));
      R.clI.forEach((g,i)=>a.op(g,s(t,[.22,.4,.58,.76][i],[.3,.48,.66,.84][i]))); } },
  { titre:"Ce que chacun donne", duree:10000,
    legende:"Le lien va dans les deux sens : le seigneur donne un fief et sa protection ; le vassal donne sa fidélité, son aide militaire et ses conseils.",
    voix:"Le lien va dans les deux sens. Le seigneur donne un fief et sa protection. Le vassal, lui, donne sa fidélité, son aide militaire, et ses conseils. C'est un échange : la protection contre le service.",
    anim(t,a){ const s=a.seg; a.op(R.ce,1-s(t,0,.08)); a.op(R.cl,1-s(t,0,.08)); a.op(R.photo1,0); a.op(R.du,s(t,.02,.1));
      const G=800,SC=1.2; const P0=pose({ua1:-60,fa1:-80,ua2:-10,fa2:-40}); R.duoL.update(P0,260,G,SC,false); R.duoR.update(pose({ua1:-60,fa1:-80,ua2:-10,fa2:-40}),1340,G,SC,true);
      a.draw(R.pUp,s(t,.1,.35)); a.draw(R.pDown,s(t,.4,.65));
      R.dTopTxt.setAttribute("opacity",s(t,.15,.3)); R.dBot.setAttribute("opacity",s(t,.45,.6));
      R.dLU.forEach((g,i)=>a.op(g,s(t,.2+i*.05,.3+i*.05))); R.dLD.forEach((g,i)=>a.op(g,s(t,.5+i*.05,.6+i*.05)));
      const ph=(i,n,t0)=>{ const u=s(t,t0,1,true)*2.2; return Math.max(0,Math.min(1,frac(u+i/n))); };
      const on=s(t,.3,.34); R.dTok.forEach((tk,i)=>{ const p=ph(i,4,.3); const q=a.along(R.pUp,1-p); a.tr(tk,q.x,q.y,1.3); a.op(tk,on*(p>0&&p<1?1:0)); });
      const on2=s(t,.6,.64); R.dTokB.forEach((tk,i)=>{ const p=ph(i,4,.6); const q=a.along(R.pDown,p); a.tr(tk,q.x,q.y,1.3); a.op(tk,on2*(p>0&&p<1?1:0)); }); } },
  { titre:"La chaîne : jusqu'aux paysans", duree:11000,
    legende:"Le grand seigneur donne à son tour des fiefs à des chevaliers. Au bas, les paysans travaillent la terre : ils paient des redevances et font des corvées.",
    voix:"À son tour, le grand seigneur donne des fiefs à des chevaliers, qui lui promettent aide et fidélité. Tout en bas, les paysans travaillent la terre. Ils ne sont pas des vassaux : ils ne font pas d'hommage, mais ils paient des redevances et font des corvées pour le seigneur qui les protège.",
    anim(t,a){ const s=a.seg; a.op(R.du,1-s(t,0,.08)); a.op(R.bg,s(t,.0,.1)); a.op(R.py,s(t,0,.1)); a.op(R.tk,1); a.op(R.king,1); GS.forEach((g,i)=>{a.op(R.gs[i],1); a.draw(R.lkGS[i],1); a.op(R.fiefs[i],1); a.tr(R.fiefs[i],g[0]+62,g[1]-28,1);});
      R.ch.forEach((p,i)=>{ const st=.12+i*.05; a.op(p,s(t,st,st+.08)); a.draw(R.lkCH[i],s(t,st-.02,st+.06)); });
      R.pay.forEach((p,i)=>a.op(p,s(t,.4+Math.floor(i/3)*.03,.48+Math.floor(i/3)*.03))); R.lkPay.forEach((l,i)=>a.draw(l,s(t,.4+Math.floor(i/3)*.03,.5+Math.floor(i/3)*.03)));
      a.op(R.lg,s(t,.5,.6)); R.lgI.forEach((g,i)=>a.op(g,s(t,.52+i*.06,.6+i*.06))); a.op(R.lgN,s(t,.82,.92));
      const f=a.seg(t,.52,1,true)*3; const ph=(o)=>frac(f+o);
      // jetons nobles
      const hop=(tokD,tokU,ia,ib,ci,o)=>{ };
      GS.forEach((g,i)=>{ const p=ph(i*.3); const x1=K[0],y1=K[1]-30,x2=g[0],y2=g[1]-80; a.tr(R.tFiefDown[i],a.lerp(x1,x2,p),a.lerp(y1,y2,p),1); a.op(R.tFiefDown[i],a.seg(t,.52,.56)); const q=ph(i*.3+.5); a.tr(R.tSwordUp[i],a.lerp(x2,x1,q)+16,a.lerp(y2,y1,q),.9); a.op(R.tSwordUp[i],a.seg(t,.52,.56)); });
      CH.forEach((c,i)=>{ const g=GS[CHP[i]]; const p=ph(.15+i*.13); const x1=g[0],y1=g[1]-20,x2=c[0],y2=c[1]-75; a.tr(R.tFiefDown[3+i],a.lerp(x1,x2,p),a.lerp(y1,y2,p),.85); a.op(R.tFiefDown[3+i],a.seg(t,.56,.6)); const q=ph(.5+i*.13); a.tr(R.tSwordUp[3+i],a.lerp(x2,x1,q)+14,a.lerp(y2,y1,q),.8); a.op(R.tSwordUp[3+i],a.seg(t,.56,.6));
        const p2=ph(.3+i*.09); const ay=c[1]+14, by=PAYY-70; a.tr(R.tShield[i],c[0]-20,a.lerp(ay,by,p2),.8); a.op(R.tShield[i],a.seg(t,.6,.64)); const q2=ph(.7+i*.09); a.tr(R.tSack[i],c[0]+22,a.lerp(by+6,ay+4,q2),.8); a.op(R.tSack[i],a.seg(t,.6,.64)); }); } },
  { titre:"À vous : qui doit quoi ?", duree:7000,
    legende:"À vous : cliquez sur un personnage de la pyramide (ou sur un bouton) pour voir ce qu'il doit donner et ce qu'il reçoit en échange. Comparez le chevalier et le paysan.",
    voix:"À vous de jouer ! Choisissez un personnage de la pyramide : le roi, un grand seigneur, un chevalier ou un paysan. Regardez ce qu'il doit donner, et ce qu'il reçoit en échange. Comparez le chevalier et le paysan. Prenez votre temps.",
    anim(t,a){ const s=a.seg; a.op(R.bg,1); a.op(R.py,1); a.op(R.lg,1-s(t,0,.06)); a.op(R.tk,1); R.tk.querySelectorAll(":scope>g").forEach(g=>a.op(g,0));
      a.op(R.king,1); GS.forEach((g,i)=>{ a.op(R.gs[i],1); a.draw(R.lkGS[i],1); a.op(R.fiefs[i],1); a.tr(R.fiefs[i],g[0]+62,g[1]-28,1); }); R.ch.forEach((p,i)=>{a.op(p,1);a.draw(R.lkCH[i],1);}); R.pay.forEach(p=>a.op(p,1)); R.lkPay.forEach(l=>a.draw(l,1));
      const v=s(t,.05,.2); a.op(R.pc,v); const role=ROLES[sel];
      RK.forEach(r=>R.rk[r].forEach(g=>a.op(g,r===sel?1:1-.7*v))); R.hiB.forEach((h,i)=>a.op(h,i===role.band?v:0));
      if(R.shown!==sel){ R.shown=sel; R.pcName.setAttribute("fill",role.col); R.pcName.textContent=role.nom; a.wrap(R.pcDoit,role.doit.map(x=>"• "+x).join("\n"),31,1.22); a.wrap(R.pcRec,role.recoit.map(x=>"• "+x).join("\n"),31,1.22); } } },
  { titre:"Un ordre qui passe par chacun", duree:10000,
    legende:"Un ordre du roi passe d'abord par ses grands vassaux, puis par leurs chevaliers, puis arrive aux paysans. Le roi n'est lié directement qu'à ses grands vassaux.",
    voix:"Suivons un ordre du roi. Il le donne à ses grands vassaux. Chaque grand seigneur le transmet à ses propres vassaux, les chevaliers. Chaque chevalier le transmet enfin aux paysans de son domaine. Le roi n'a donc de lien direct qu'avec ses grands vassaux.",
    anim(t,a){ const s=a.seg; a.op(R.bg,1); a.op(R.py,1); a.op(R.lg,0); a.op(R.pc,1-s(t,0,.06)); R.hiB.forEach(h=>a.op(h,0)); a.op(R.od,s(t,.02,.1)); a.op(R.tk,1); R.tk.querySelectorAll(":scope>g").forEach(g=>a.op(g,0));
      a.op(R.king,1); GS.forEach((g,i)=>{ a.op(R.gs[i],1); a.draw(R.lkGS[i],1); a.op(R.fiefs[i],1); a.tr(R.fiefs[i],g[0]+62,g[1]-28,1); }); R.ch.forEach((p,i)=>{a.op(p,1);a.draw(R.lkCH[i],1);}); R.pay.forEach(p=>a.op(p,1)); R.lkPay.forEach(l=>a.draw(l,1));
      R.lkGS.forEach(l=>{ l.setAttribute("stroke",C.or); l.setAttribute("stroke-width",8); });
      const hop=[[.1,.4],[.45,.72],[.75,.98]]; const pts=R.chain; let x=pts[0][0],y=pts[0][1];
      for(let i=0;i<3;i++){ const p=s(t,hop[i][0],hop[i][1]); if(p>0){ x=a.lerp(pts[i][0],pts[i+1][0],p); y=a.lerp(pts[i][1],pts[i+1][1],p); } }
      if(t<.1){ x=pts[0][0]+60; y=pts[0][1]; } a.tr(R.scroll,x,y,1.3); a.op(R.scroll,s(t,.02,.08));
      R.odI.forEach((g,i)=>a.op(g,s(t,[.1,.45,.75][i],[.2,.55,.85][i]))); a.op(R.odBox,s(t,.88,.97)); } },
  { titre:"Synthèse", duree:11000,
    legende:"Protection contre service : un fief donné, la fidélité promise. Le roi, des grands seigneurs, des chevaliers, des paysans : un réseau de liens, pas des ordres directs du roi à tous.",
    voix:"Retenons trois idées. Un : le seigneur donne un fief et protège, le vassal reste fidèle et l'aide. Deux : le lien se fait par l'hommage, un geste solennel, devant témoins. Trois : la société forme une chaîne de liens, du roi aux paysans. Non, le roi ne commande pas directement tout le monde.",
    anim(t,a){ const s=a.seg; a.op(R.bg,1-s(t,0,.08)); a.op(R.py,1-s(t,0,.08)); a.op(R.od,1-s(t,0,.08)); a.op(R.tk,0); a.op(R.sy,s(t,0,.1)); R.sy3.forEach((f,i)=>{ const v=s(t,.1+i*.14,.24+i*.14); a.op(f,v); a.tr(f,0,(1-v)*40); }); a.op(R.myth,s(t,.62,.78)); a.cls(R.myth.faux,"pulse",t>.8&&t<1); } },
  ]
});
})();
