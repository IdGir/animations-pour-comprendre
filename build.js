// Assemble chaque scène en un fichier HTML autonome
const fs=require("fs"),path=require("path");
const css=fs.readFileSync("src/engine.css","utf8"), eng=fs.readFileSync("src/engine.js","utf8");
const only=process.argv.slice(2);
fs.mkdirSync("build",{recursive:true});
for(const f of fs.readdirSync("src/scenes").filter(f=>f.endsWith(".js"))){
  const name=f.replace(/\.js$/,""); if(only.length&&!only.includes(name)) continue;
  let sc=fs.readFileSync("src/scenes/"+f,"utf8");
  let data="";
  const m=sc.match(/\/\/@data\s+([\w ,]+)/);
  if(m) for(const d of m[1].split(/[ ,]+/).filter(Boolean)) data+=`const ${d.toUpperCase()}=${fs.readFileSync("data/"+d+".json","utf8")};\n`;
  const title=(sc.match(/titre:\s*"([^"]+)"/)||[])[1]||name;
  const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${css}</style><script src="../photos/credits.js"></script></head><body><script>${eng}</script><script>${data}${sc}</script></body></html>`;
  fs.writeFileSync("build/"+name+".html",html);
  console.log(name, (html.length/1024).toFixed(0)+" Ko");
}
