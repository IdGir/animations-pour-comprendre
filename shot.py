import sys, asyncio
from playwright.async_api import async_playwright
async def main(src,out,w=1600,h=900):
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':w,'height':h})
        await pg.goto('file://'+src); await pg.wait_for_timeout(400); await pg.screenshot(path=out); await b.close()
asyncio.run(main(sys.argv[1],sys.argv[2]))
