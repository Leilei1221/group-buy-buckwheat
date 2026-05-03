import asyncio
from playwright.async_api import async_playwright
import os

ORIGIN_URL = "https://h29lzx.1shop-app.com/fpuu4o0917"

IMAGES = [
    ("p01", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/LWx9yMqPlG7Jk6m8lEpb1wO7/"),
    ("p02", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/DPq15dgL3PqvrOp9lrBbJ2am/"),
    ("p03", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/rAW85emGlnz81MQnlyok6vBL/"),
    ("p04", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/g1JZGpdVYBmBkXAnN0onavMR/"),
    ("p05", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/BoQZq74kYmWo9E4nl5PMywAK/"),
    ("p06", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/LWx9yMqPlG7Jk6ozlEpb1wO7/"),
    ("p07", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/o4a0bwXWNWb4rA5jlGgE1yzv/"),
    ("p08", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/wAjo1QaDle489ExZ390xLGMJ/"),
    ("p09", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/Gr1Lb8a63ZLXkvwQNEAXx24D/"),
    ("p10", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/nMRpQ02P3XERD5Zolr7BkJaE/"),
    ("p11", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/w560gEeAlo0914xKNOqrx1ab/"),
    ("p12", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/LWx9yMqPlG7Jk40vlEpb1wO7/"),
    ("p13", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/41brG7JDYpJQo7adlxW5ywvg/"),
    ("p14", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/v5zx6meKY4vkm7AZl0DVkLyo/"),
    ("p15", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/DPq15dgL3Pqvr8vRlrBbJ2am/"),
    ("p16", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/BW4907rb3bPQ9V6VNQGK6kwy/"),
    ("p17", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/dqpOVABK32K8d17XlrkRwEv7/"),
    ("p18", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/Xno5Qb1D3Mwax5ADN67ZWPv9/"),
    ("p19", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/7b8Wmjk2l5nmdyZ9NvD1VZrP/"),
    ("p20", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/xWLzk147Y7GwdyQdYV8mGo9O/"),
    ("p21", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/Kyg9vWx8NyKy1VQX3GJP14Zm/"),
    ("p22", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/0nMRz1wGlRwLrqagNV9Kjv6E/"),
    ("p23", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/0nMRz1wGlRVJxzDMlV9Kjv6E/"),
    ("p24", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/Kyg9vWx8NyKKVyyG3GJP14Zm/"),
    ("p25", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/j7m6e8BLYJAmky7MNaG5RKMX/"),
    ("p26", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/v5zx6meKY4zPd5Bbl0DVkLyo/"),
    ("p27", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/rAW85emGlnzzmpBZlyok6vBL/"),
    ("p28", "https://img.1shop.tw/Q8Zzy1eojALkqZO0qDpx739K/A7dLy5pv31nVdkWrlXg0QzKr/"),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        print("載入原始頁面...")
        await page.goto(ORIGIN_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        os.makedirs("images", exist_ok=True)
        for name, cdn_url in IMAGES:
            out_path = f"images/{name}.avif"
            img_url = cdn_url + "original-2.jpg.avif"
            try:
                resp = await context.request.get(img_url, headers={"Referer": "https://1shop-app.com/"})
                if resp.status == 200:
                    data = await resp.body()
                    with open(out_path, "wb") as f:
                        f.write(data)
                    print(f"✓ {name} ({len(data)//1024}KB)")
                else:
                    # fallback: original jpg
                    img_url2 = cdn_url + "original-2.jpg"
                    resp2 = await context.request.get(img_url2, headers={"Referer": "https://1shop-app.com/"})
                    if resp2.status == 200:
                        data = await resp2.body()
                        out_path2 = f"images/{name}.jpg"
                        with open(out_path2, "wb") as f:
                            f.write(data)
                        print(f"✓ {name} jpg fallback ({len(data)//1024}KB)")
                    else:
                        print(f"✗ {name} status={resp.status}")
            except Exception as e:
                print(f"✗ {name} error: {e}")

        await browser.close()
        print("完成！")

asyncio.run(main())
