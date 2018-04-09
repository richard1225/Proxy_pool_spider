'use strict';

const puppeteer = require('puppeteer'); //引入puppeteer库.

(async() => {

    const browser = await puppeteer.launch({
        args: [
            '--proxy-server=http://127.0.0.1:1087', // 设置墙外代理
        ]
    }); //用指定选项启动一个Chromium浏览器实例。

    const page = await browser.newPage(); //创建一个页面.
    try{
        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.goto('https://www.proxydocker.com/en/proxylist/search?port=All&type=HTTP&anonymity=All&country=China&city=All&state=All&need=All'); //到指定页面的网址.
        await page.screenshot({path: '../screen/proxydocker.png'}); //截图并保存到当前路径

        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelectorAll("tbody")[0]
            return TBODY.innerText;
        });

        console.log(proxy_str);

        for(var i = 0; i<6; i++){

            await page.waitFor(5000);
            await page.evaluate(() => {
                document.querySelectorAll(".page-link")[1].click()
            });
            await page.evaluate(_ => {
                window.scrollBy(0, 100);
            });
            await page.screenshot({path: '../screen/proxydocker'+i+'.png'}); //截图并保存到当前路径
            await page.waitForNavigation()
            const proxy_str = await page.evaluate(() => {
                const TBODY = document.querySelectorAll("tbody")[0]
                return TBODY.innerText;
            });
    
            console.log(proxy_str);
        }

    }catch (err) {
        console.log("[ERROR]: proxydocker.js")
    }
    

    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();