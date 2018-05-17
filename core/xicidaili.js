'use strict';
/**
 * 完成3个TODO，分别是脚本名称，解析网页代码，解析响应内容成 "ip:port" 的字符串数组形式
 */

var sprintf = require('sprintf-js').sprintf
var ES_ADDRESS = "http://10.194.165.27:8200/_bulk"

var web_url = "http://www.xicidaili.com/nt"
var FINAL_DATA = "" 
var proxy_name = "xicidaili" // TODO 代理源网站名字

const puppeteer = require('puppeteer'); //引入puppeteer库.

(async() => {

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }); //用指定选项启动一个Chromium浏览器实例。无沙盒模式

    const page = await browser.newPage(); //创建一个页面.
    try{
        await page.goto(web_url); //到指定页面的网址.
        // await page.screenshot({path: '../screen/xicidaili1.png'}); //截图并保存到当前路径，名称为page1.png.

        const proxy_str = await page.evaluate(() => {
            // TODO 获取网站中的ip数据，需要写解析网站的js，以下是示例
            const TBODY = document.querySelector("#ip_list");
            return TBODY.innerText;
        });
        // console.log(proxy_str)
        parse_ip(proxy_str);

    }catch (err) {
        console.log(sprintf("[ERROR]: %1$s.js",proxy_name));
        console.log(err);
    }
    await browser.close(); //关闭已打开的页面，browser不能再使用。
})();

function parse_ip(raw_str){
    // TODO 解析从网页中拿到的ip：port，最后的结果全部放在proxy_list里面
    var proxy_list = [];
    var lines = raw_str.split('\n');
    for(let line of lines){
        if(line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/i) != null){
            proxy_list.push(line.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\t[0-9]+/g))
        }
    }
    // console.log();
    guanku_es(proxy_list);
};
function guanku_es(proxy_list){
    for(let ip_port of proxy_list){
        append_ip_port(ip_port);
    }

    var request = require('request');
    FINAL_DATA = FINAL_DATA.replace(/\t/g,':')

    request({
        url: ES_ADDRESS,
        method: "POST",
        body: FINAL_DATA
    }, function (error, response, body){
        
        console.log('['+proxy_name+"]：获得新的ip数："+(proxy_list.length - response.body.match(/DocumentAlreadyExistsException/g).length)+'/'+proxy_list.length+'\t['+getNow()+']' + '\n');
        // console.log(body)
    });
}

function append_ip_port(ip_port){
    var data = sprintf('{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%1$s" }}\n{"ip_port": "%2$s", "country": "china", "from":"xicidaili","can_use":true,"use_count":0,"fail_count":0,"insert_time": "%3$s"}\n',ip_port,ip_port,getNow())
    FINAL_DATA += data
}

function getNow(){
    var d = new Date();
    d = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2)  + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2)  + ('0' + d.getSeconds()).slice(-2);
    return d;
}