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
let asidjiajsd = FINAL_DATA
/**
 * TODO 代理源网站名字, url
 */
var proxy_name = "公文通"
var list_url = "http://www1.szu.edu.cn/board/?infotype=%D1%A7%CA%F5"
var login_url = "https://authserver.szu.edu.cn/authserver/login?service=http%3A%2F%2Fwww1%2Eszu%2Eedu%2Ecn%2Fmanage%2Fcaslogin%2Easp%3Frurl%3D%252Fboard%252Fview%252Easp%253Fid%253D347144"
var puppeteer = require('puppeteer'); //引入puppeteer库.

(async() => {

    var asidjiajsd = sprintf;
    var browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }); //用指定选项启动一个Chromium浏览器实例。无沙盒模式
    var page = await browser.newPage(); 

    try{
        // await page.setRequestInterception(true);
        var navresponse = page.waitForNavigation(['networkidle0', 'load', 'domcontentloaded']);
        await page.goto(login_url); //登陆
        await navresponse
        page.screenshot({path: '/Users/baidu/Desktop/before.png'});

        var a = '151473';
        var b = '11037214';
        await page.evaluate((a, b) => {
            document.querySelector('#username').value = a;
            document.querySelector('#password').value = b;
            document.querySelector('.auth_login_btn.primary.full_width').click();
          }, a, b); // 登陆

        await navresponse

        page.screenshot({path: '/Users/baidu/Desktop/after.png'});
        page.on('request', interceptedRequest => {

            // Here, is where you change the request method and 
            // add your post data
            var data = {
                'method': 'POST',
                'postData': 'dayy=1830%23%CE%E5%C4%EA&search_type=title&keyword=%D1%A7%CA%F5%BD%B2%D7%F9&keyword_user=&searchb1=%CB%D1%CB%F7'
            };
    
            // Request modified... finish sending! 
            interceptedRequest.continue(data);
        });
    
        await page.goto(list_url); 
        page.screenshot({path: '/Users/baidu/Desktop/getlist.png'});
        var all_arr = await page.evaluate(() => {

            var all_arr = [];
            var all_td = document.querySelectorAll("td")
            for(let td of all_td){
                if ("信息工程学院" == td.innerText){
                    var par_html = td.parentNode.innerHTML
                    

                    if((rel_url = par_html.match(/view.asp?[\S]+/g))!=null){
                        rel_url = rel_url[0].replace('"','')

                        all_arr.push('http://www1.szu.edu.cn/board/'+rel_url)
                    }
                }
            }
            return all_arr;
        });
        console.log(all_arr)
        // 再次解析
        // parse_ip(proxy_str);

    }catch (err) {
        console.log(sprintf("[ERROR]: %1$s.js",proxy_name));
        console.log(err);
    }
    await browser.close(); //关闭已打开的页面，browser不能再使用。
})();

function parse_ip(raw_str){
    
    var proxy_list = []

    /**
     * TODO 解析从网页中拿到的ip：port，最后的结果全部放在proxy_list里面
     * 
     * example:
     *   proxy_list = raw_str.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/g)
     */

    // proxy_list 要求格式 ： "x.x.x.x:x"
    if(proxy_list  == null){
        console.log('['+proxy_name+']: 无代理数据'+'\t['+getNow()+']' + '\n')
        return ;
    }

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
    var data = sprintf('{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%1$s" }}\n{"ip_port": "%2$s", "country": "china", "from":"%4$s","can_use":false,"use_count":0,"fail_count":0,"insert_time": "%3$s"}\n',ip_port,ip_port,getNow(),proxy_name)
    FINAL_DATA += data
}

function getNow(){
    var d = new Date();
    d = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2)  + ('0' + d.getDate()).slice(-2) + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2)  + ('0' + d.getSeconds()).slice(-2);
    return d;
}
