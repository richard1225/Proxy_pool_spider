'use strict';
/**
 * 完成3个TODO，分别是脚本名称，解析网页代码，解析响应内容成 "ip:port" 的字符串数组形式
 */

var sprintf = require('sprintf-js').sprintf
var ES_ADDRESS = "http://10.194.165.27:8200/_bulk"
var FINAL_DATA = "" 

/**
 * TODO 代理源网站名字, url
 */
var proxy_name = "mimvp"
var web_url1 = "https://proxy.mimvp.com/free.php?proxy=in_tp"
var web_url2 = "https://proxy.mimvp.com/free.php?proxy=in_hp"

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
        await page.goto(web_url1); // 跳到指定页面的网址.
        
        const proxy_list = await page.evaluate(() => {
            var total_list = []
            /**
             * TODO 解析所抓取的网页，从网页中提取出ip和端口，给后面做进一步解析
             * 
             * 以下是示例，具体解析方案请按照网页结构制定
             */
            
            const tbody = document.querySelector(".free-table.table.table-bordered.table-striped");
            var url_list = tbody.innerHTML.match(/common\/ygrandimg\.php\?id=[\S]+"/g);
            var ip_list = tbody.innerHTML.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);

            if(url_list.length == ip_list.length){
                while(url_list.length != 0){
                    url = "https://proxy.mimvp.com/"+url_list.pop();
                    total_list.push(ip_list.pop()+"----"+url.replace(/&amp;/,'&'));
                }
                
            }
            return total_list;
        });
        for (let proxy of proxy_list){
            console.log(proxy);
        }

        await page.goto(web_url2); // 跳到指定页面的网址.
        
        
        const proxy_list2 = await page.evaluate(() => {
            var total_list = []
            /**
             * TODO 解析所抓取的网页，从网页中提取出ip和端口，给后面做进一步解析
             * 
             * 以下是示例，具体解析方案请按照网页结构制定
             */
            
            const tbody = document.querySelector(".free-table.table.table-bordered.table-striped");
            var url_list = tbody.innerHTML.match(/common\/ygrandimg\.php\?id=[\S]+"/g);
            var ip_list = tbody.innerHTML.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/g);

            if(url_list.length == ip_list.length){
                while(url_list.length != 0){
                    url = "https://proxy.mimvp.com/"+url_list.pop();
                    total_list.push(ip_list.pop()+"----"+url.replace(/&amp;/,'&'));
                }
                
            }
            return total_list;
        });
        for (let proxy of proxy_list2){
            // 输出给图片识别模块识别
            console.log(proxy);
        }


    }catch (err) {
        console.log(sprintf("[ERROR]: %1$s.js",proxy_name));
        console.log(err);
    }
    await browser.close(); //关闭已打开的页面，browser不能再使用。
})();

function parse_ip(raw_str){
    
    var proxy_list = []

    /**
     *  
     * TODO 解析从网页中拿到的ip：port，最后的结果全部放在proxy_list里面
     */

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
        console.log('['+proxy_name+"]：获得新的ip数："+(proxy_list.length - response.body.match(/DocumentAlreadyExistsException/g).length)+'/'+proxy_list.length+'\t['+getNow()+']' + '\n');
        
    });
}

function append_ip_port(ip_port){
    var data = sprintf('{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%1$s" }}\n{"ip_port": "%2$s", "country": "china", "from":"%4$s","can_use":true,"use_count":0,"fail_count":0,"insert_time": "%3$s"}\n',ip_port,ip_port,getNow(),proxy_name)
    FINAL_DATA += data
}

function getNow(){
    var d = new Date();
    d = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2)  + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2)  + ('0' + d.getSeconds()).slice(-2);
    return d;
}
