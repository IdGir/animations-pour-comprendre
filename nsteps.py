import asyncio,glob,os,json
from playwright.async_api import async_playwright
async def main():
    out={}
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        for f in sorted(glob.glob('build/*.html')):
            await pg.goto('file://'+os.path.abspath(f)); await pg.wait_for_timeout(150)
            out[os.path.basename(f)[:-5]]=await pg.evaluate('[__anim.N,document.title]')
        await b.close()
    json.dump(out,open('/tmp/nsteps.json','w'),ensure_ascii=False)
asyncio.run(main())
