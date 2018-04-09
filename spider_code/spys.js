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
        await page.goto('http://spys.one/free-proxy-list/CN/'); //到指定页面的网址.
        await page.screenshot({path: '../screen/spys.png'}); //截图并保存到当前路径，名称为page1.png.

        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.select('#xpp', '5') // 选择展示500个站点
        await navresponse   // 等待页面加载
        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelectorAll("table")[1]
            return TBODY.innerText;
        });

        console.log(proxy_str);
    }catch (err) {
        console.log("[ERROR]: spys.js")
    }

    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();