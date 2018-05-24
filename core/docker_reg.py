#! -*- encoding: utf-8 -*-
import requests
from PIL import Image
from io import StringIO
import pytesseract
import sys
import time
import urllib2 as urllib
import io

headers = {
    "Host": "proxy.mimvp.com",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cookie": "PHPSESSID=hgh849u2mrla3sms4frepc0hn5"
}


ES_ADDRESS = "http://10.194.165.27:8200/_bulk"

def es_guanku(total_url):
    print "es_guanku: ", len(total_url)
    final_data = ""
    for ip_port in total_url:
        data = '{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"ip_port": "%s", "country": "china", "from":"mimvp","can_use":true,"use_count":0,"fail_count":0,"insert_time": "%s"}\n'%(ip_port,ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
        final_data += data

    import re
    resp = requests.post(ES_ADDRESS,data=final_data)
    pattern = re.compile(r'DocumentAlreadyExistsException')
    exist_list = re.findall(pattern,resp.content.decode('utf-8'))

    print "afterall: ", len(total_url)
    print('[mimvp]：获得新的ip数：' + str(len(total_url)-len(exist_list)) + '/' + str(len(total_url)) + '\t' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))

import traceback
def recognize(ip_url):
    try:
        ip = ip_url.split('----')[0]
        url = ip_url.split('----')[1][:-1]
        r = requests.get(url,headers=headers)
        i = Image.open(io.BytesIO(r.content))
        port = pytesseract.image_to_string(i, config='outputbase digits')
        return ip+':'+port
    except :
        traceback.print_exc()
        print 'err'
        return ""
    

def parse():
    total_url = []
    for line in sys.stdin:
        # 识别端口
        ip_port = recognize(line)
        if ip_port != "":
            total_url.append(ip_port)

    print "parse: ", len(total_url)
    es_guanku(total_url)

    

if __name__ == '__main__':
    parse()









