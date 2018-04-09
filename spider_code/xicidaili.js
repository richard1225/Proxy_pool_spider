'use strict';

const puppeteer = require('puppeteer'); //引入puppeteer库.

(async() => {

    const browser = await puppeteer.launch(); //用指定选项启动一个Chromium浏览器实例。

    const page = await browser.newPage(); //创建一个页面.
    try{
        await page.goto('http://www.xicidaili.com/nt'); //到指定页面的网址.
        await page.screenshot({path: '../screen/xicidaili1.png'}); //截图并保存到当前路径，名称为page1.png.

        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelector("#ip_list")
            return TBODY.innerText;
        });

        console.log(proxy_str);
        await page.waitFor(3000)

        await page.goto('http://www.xicidaili.com/nn'); //到指定页面的网址.
        await page.screenshot({path: '../screen/xicidaili2.png'}); //截图并保存到当前路径，名称为page1.png.

        const str_2 = await page.evaluate(() => {
            const TBODY = document.querySelector("#ip_list")
            return TBODY.innerText;
        });
        console.log(str_2);
    }catch (err) {
        console.log("[ERROR]: xicidaili.js")
    }
    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();
