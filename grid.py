import sys,glob
from PIL import Image
S='/tmp/shots'
name=sys.argv[1]
import os
SH=os.environ.get('SHOTS',S+'shots')+'/'
fs=sorted(glob.glob(SH+name+'-*.png'),key=lambda s:int(s.split('-')[-1][:-4]))
ims=[Image.open(f).resize((720,450)) for f in fs]
W=Image.new('RGB',(1440,450*((len(ims)+1)//2)),'white')
for i,im in enumerate(ims): W.paste(im,((i%2)*720,(i//2)*450))
W.save(SH+name+'-grid.png'); print(SH+name+'-grid.png')
