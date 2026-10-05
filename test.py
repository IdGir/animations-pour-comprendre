import sys, asyncio, os, glob
from playwright.async_api import async_playwright
OUT=os.environ.get('SHOTS','/tmp/shots')
os.makedirs(OUT,exist_ok=True)
async def one(b,f,mid):
    name=os.path.basename(f)[:-5]; errs=[]
    pg=await b.new_page(viewport={'width':1440,'height':900})
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto('file://'+os.path.abspath(f)); await pg.wait_for_timeout(300)
    n=await pg.evaluate('__anim.N')
    for k in range(n):
        for t in ([0.5,1] if mid else [1]):
            await pg.evaluate(f'__anim.setT({k},{t})')
        await pg.screenshot(path=f'{OUT}/{name}-{k+1}.png')
    # en arrière
    for k in range(n-1,-1,-1):
        for t in [0,0.3,0.7,1]: await pg.evaluate(f'__anim.setT({k},{t})')
    # lecture réelle courte
    await pg.evaluate('__anim.restart()'); await pg.click('#bNext'); await pg.wait_for_timeout(600); await pg.click('#bNext'); await pg.wait_for_timeout(600)
    await pg.close()
    print(name, n, 'étapes', 'ERREURS:' if errs else 'OK', errs[:5])
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        files=sys.argv[1:] or sorted(glob.glob('build/*.html'))
        for f in files: await one(b,f,False)
        await b.close()
asyncio.run(main())
