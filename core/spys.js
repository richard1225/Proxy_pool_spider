'use strict';
/**
 * author: Richard
 * email : yezhijie@baidu.com
 * date  : 2018/05/17
 * 
 * 完成3个TODO，分别是脚本名称，解析网页代码，解析响应内容成 "ip:port" 的字符串数组形式
 */

var sprintf = require('sprintf-js').sprintf
var ES_ADDRESS = "http://10.194.165.27:8200/_bulk"
var FINAL_DATA = "" 

var proxy_name = "spys"
var web_url = "http://spys.one/free-proxy-list/CN/"

const puppeteer = require('puppeteer'); //引入puppeteer库.

(async() => {

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--proxy-server=http://127.0.0.1:1087', // 设置墙外代理
        ]
    }); //用指定选项启动一个Chromium浏览器实例。无沙盒模式
    const page = await browser.newPage(); //创建一个页面.

    try{
        await page.goto(web_url); // 跳到指定页面的网址.
        
        const proxy_str = await page.evaluate(() => {

            
            const TBODY = document.querySelectorAll("table")[1]
            return TBODY.innerText;
        });

        // 再次解析
        parse_ip(proxy_str);

    }catch (err) {
        console.log(sprintf("[ERROR]: %1$s.js",proxy_name));
        console.log(err);
    }
    await browser.close(); //关闭已打开的页面，browser不能再使用。
})();

function parse_ip(raw_str){
    
    var proxy_list = [];
    
    proxy_list = raw_str.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/g)
    
    if(proxy_list  == null){
        console.log('['+proxy_name+']: 无代理数据'+'\t['+getNow()+']' + '\n')
        return ;
    }
    // proxy_list 要求格式 ： "x.x.x.x:x"
    guanku_es(proxy_list)
};

function guanku_es(proxy_list){
    for(let ip_port of proxy_list){
        append_ip_port(ip_port);
    }

    var request = require('request');

    // 发送post请求，灌库
    request({
        url: ES_ADDRESS,
        method: "POST",
        body: FINAL_DATA
    }, function (error, response, body){
        // console.log(response)
        console.log('['+proxy_name+"]：获得新的ip数："+(proxy_list.length - response.body.match(/DocumentAlreadyExistsException/g).length)+'/'+proxy_list.length+'\t['+getNow()+']' + '\n');
        
    });
}

function append_ip_port(ip_port){
    var data = sprintf('{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%1$s" }}\n{"ip_port": "%2$s", "country": "china", "from":"%4$s","can_use":false,"use_count":0,"fail_count":0,"insert_time": "%3$s"}\n',ip_port,ip_port,getNow(),proxy_name)
    FINAL_DATA += data
}

function getNow(){
    var d = new Date();
    d = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2)  + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2)  + ('0' + d.getSeconds()).slice(-2);
    return d;
}
