import asyncio, glob
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for f in sorted(glob.glob('build/*.html')):
            pg=await b.new_page(viewport={'width':1280,'height':800}); errs=[]
            pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto('file:///home/claude/anim/'+f); await pg.wait_for_timeout(200)
            await pg.click('#overlay'); await pg.evaluate("document.getElementById('sp').value=6; document.getElementById('sp').dispatchEvent(new Event('input'))")
            await pg.wait_for_timeout(2500); st=await pg.evaluate('[__anim.S.k,__anim.S.t.toFixed(2),__anim.S.playing]')
            await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(300); await pg.keyboard.press('ArrowLeft'); await pg.wait_for_timeout(300); await pg.keyboard.press('Space'); await pg.keyboard.press('r')
            dots=await pg.query_selector_all('.dot'); await dots[-1].click(); await pg.wait_for_timeout(400)
            print(f.split('/')[-1], st, 'ERR' if errs else 'ok', errs[:3]); await pg.close()
        await b.close()
asyncio.run(main())
