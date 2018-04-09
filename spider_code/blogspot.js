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
        await page.goto('http://gatherproxy.com/embed/?c=China'); //到指定页面的网址.
        await page.screenshot({path: '../screen/blogspot.png'}); //截图并保存到当前路径

        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelector("table")
            return TBODY.innerText;
        });

        console.log(proxy_str);

        //////////// Transparent
        await page.waitFor(2000);
        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.select('#prx_type', 'Transparent') // 选择展示Transparent
        await page.click('#go_btn');
        await navresponse   // 等待页面加载

        const proxy_str1 = await page.evaluate(() => {
            const TBODY = document.querySelector("table")
            return TBODY.innerText;
        });

        console.log(proxy_str1);

        //////////// Elite
        await page.waitFor(2000);
        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.select('#prx_type', 'Elite') // 选择展示Transparent
        await page.click('#go_btn');
        await navresponse   // 等待页面加载

        const proxy_str2 = await page.evaluate(() => {
            const TBODY = document.querySelector("table")
            return TBODY.innerText;
        });

        console.log(proxy_str2);

        //////////// Anonymous
        await page.waitFor(2000);
        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.select('#prx_type', 'Anonymous') // 选择展示Transparent
        await page.click('#go_btn');
        await navresponse   // 等待页面加载

        const proxy_str3 = await page.evaluate(() => {
            const TBODY = document.querySelector("table")
            return TBODY.innerText;
        });

        console.log(proxy_str3);

    }catch (err) {
        console.log("[ERROR]: blogspot.js")
    }
    

    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();