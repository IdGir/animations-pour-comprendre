# Génère de FAUSSES photos (dégradé + texte) pour tester la mise en page. Ne pas livrer.
import json,glob,os
from PIL import Image,ImageDraw
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'photos')
m=[]
for f in sorted(glob.glob(D+'/manifest.d/*.json')): m+=json.load(open(f,encoding='utf8'))
seen={}
for e in m: seen[e['id']]=e
json.dump(list(seen.values()),open(D+'/manifest.tmp','w',encoding='utf8'),ensure_ascii=False,indent=1); os.replace(D+'/manifest.tmp',D+'/manifest.json')
cr={}
for i,(id,e) in enumerate(seen.items()):
    im=Image.new('RGB',(1280,853)); d=ImageDraw.Draw(im)
    for y in range(853): d.line([(0,y),(1280,y)],fill=(90+y//9,140+(i*17)%80,200-y//10))
    d.text((60,60),id+' — '+e.get('alt',e.get('q','')),fill='white')
    if not os.path.exists(f'{D}/{id}.jpg'): im.save(f'{D}/{id}.tmp.jpg',quality=70); os.replace(f'{D}/{id}.tmp.jpg',f'{D}/{id}.jpg')
    cr[id]='Auteur test · CC BY-SA 4.0 · Wikimedia Commons'
open(D+'/credits.tmp','w').write('window.PHOTO_CREDITS='+json.dumps(cr)+';\n'); os.replace(D+'/credits.tmp',D+'/credits.js'); open(D+'/.fake','w').write('1')
print(len(seen),'fausses photos')
