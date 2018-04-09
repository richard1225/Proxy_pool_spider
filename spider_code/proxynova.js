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
        await page.goto('https://www.proxynova.com/proxy-server-list/country-cn/'); //到指定页面的网址.
        await page.screenshot({path: '../screen/proxynova.png'}); //截图并保存到当前路径，名称为page1.png.

        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelectorAll("table")[0]
            return TBODY.innerText;
        });

        console.log(proxy_str);
    }catch (err) {
        console.log("[ERROR]: proxynova.js")
    }

    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();