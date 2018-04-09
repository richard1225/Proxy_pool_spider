'use strict';

const puppeteer = require('puppeteer'); //引入puppeteer库.
var fs = require("fs");

var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};

// load cookie
var data = fs.readFileSync('cookie');
let cookie_str = data.toString();
var cookies = cookie_str.split('; ')
// console.log(cookies)
var cookie_list = [];
cookies.forEach(function (cookie) { //解析cookie
    var cookli = cookie.split('=')
    if(cookli[0] == "__utmz"){
        cookli[1] = cookie.split('__utmz=')[1]
    }
    var dictq = {
        "domain": "www.freeproxylists.net",
        "expirationDate": (Date.now()+86400)/1000,
        "hostOnly": true,
        "httpOnly": false,
        "name": cookli[0],
        "path": "/",
        "sameSite": "no_restriction",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": cookli[1],
        "id": 10
    }
    cookie_list.push(dictq)
});

(async() => {

    const browser = await puppeteer.launch({
        args: [
            '--proxy-server=http://127.0.0.1:1087', // 设置代理
        ]
    }); //用指定选项启动一个Chromium浏览器实例。

    const page = await browser.newPage(); //创建一个页面.

    for(let i=0, len=cookie_list.length; i<len;i++){  //导入cookie到浏览器中
        await page.setCookie(cookie_list[i]);
    }

    try{
        await page.goto('http://www.freeproxylists.net/zh/cn.html'); //到指定页面的网址.
        await page.screenshot({path: '../screen/freeproxylists.png'}); //截图并保存到当前路径，名称为page1.png.


        // console.log("Sleep")
        // await sleep(3000)


        const proxy_str = await page.evaluate(() => {
            const TBODY = document.querySelector(".DataGrid tbody");
            return TBODY.innerText;
        });

        console.log(proxy_str);


        var cookie_li = await page.cookies('http://www.freeproxylists.net');
        var cookie_str = "";

        cookie_li.forEach(function (cookie) { //解析cookie
            var tmp_str = cookie['name']+"="+cookie['value']+"; ";
            cookie_str += tmp_str;
        });
        cookie_str = cookie_str.slice(0,-2)
        // console.log(cookie_str)
        fs.writeFileSync('./cookie', cookie_str);
    }catch (err) {
        console.log("[ERROR]: freeproxylists.js")
    }

    await browser.close(); //关闭已打开的页面，browser不能再使用。

})();