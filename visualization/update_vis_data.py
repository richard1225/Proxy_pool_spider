#!-*- encoding:utf-8 -*-
import re
import json
import time
import requests
import datetime
import maxminddb
import traceback
import IPLocate

print "loading ip database..."
GeoDB = IPLocate.IP()
GeoDB.load_dat("data/IP_trial_2018M05_single_WGS84.dat")
print "Finished!"

# @param data
TOTAL = "http://10.194.165.27:8200/weixin_seeds/proxy/_search?size=50000&sort=insert_time:desc"
CAN_USE = "http://10.194.165.27:8200/weixin_seeds/proxy/_search?q=can_use:true&size=50000&sort=insert_time:desc"

def down_load(url):
    """
        @return String ES原始数据
    """
    resp = requests.get(url)
    return resp.content

def get_geo(ip_str):
    """
        @param ip_str str模式的ip
    """
    province = "NoProvince"
    try:
        ip_dic = GeoDB.locate_ip(ip_str)
        province = ip_dic[6]
        if "黑龙江" not in province and "内蒙古" not in province:
            province = province[:6]
        else :
            province = province[:9]
    except:
        pass
    return province

def convert_ip(raw_str):
    pattern = re.compile("[\d]+\.[\d]+\.[\d]+\.[\d]+")
    result = re.findall(pattern,raw_str)
    ip_list = list(set(result))

    Province_dict = {}
    for ip in ip_list:
        prov = get_geo(ip)
        if prov not in Province_dict:
            Province_dict[prov] = 1
        else:
            Province_dict[prov] += 1
    return Province_dict
    

def parse(raw_str):
    """
        @param String ES原始数据
        @return dict 按日期分类的各数据源的抓取量
    """
    result = {} # { "date1" :{"from1":count1, ...}, ...} 
    sum_result = {}
    all_from = set()
    out_put = ""

    mjson = json.loads(raw_str)
    hits = mjson['hits']['hits']
    for hit in hits:
        source = hit['_source']
        mydate = source["insert_time"][:-6] 
        from_s = source['from']
        all_from.add(from_s)
        if mydate not in result:
            result[mydate] = {from_s:1}
        else:
            if from_s not in result[mydate]:
                result[mydate][from_s] = 1
            else:
                result[mydate][from_s] += 1

        # 处理总和
        if from_s not in sum_result:
            sum_result[from_s] = 1
        else:
            sum_result[from_s] += 1
        
    all_from = list(all_from)


    # 把没有数据的用0补上
    for mydate in result:
        one_day_data = result[mydate]
        for fr in all_from:
            if fr not in one_day_data:
                result[mydate][fr] = 0
    
    out_put += json.dumps(sum_result)
    out_put += "-*-*-*-*"
    out_put += json.dumps(result)
    now_t = datetime.datetime.now()
    now_str = datetime.date.strftime(now_t,"%Y-%m-%d %H:%M:%S")
    out_put += "-*-*-*-*"+now_str
    out_put += "-*-*-*-*"+json.dumps(all_from)
    return out_put


def sortedDictValues3(adict): 
    return [ v for v in sorted(adict.values())]

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

if __name__ == "__main__":
    # 把更新内容写入文件，方便读写
    total = parse(down_load(TOTAL))
    with open("data/update_total_ip.data",'w') as f:
        f.write(total)
    print "total_ip done"
    total = parse(down_load(CAN_USE))
    with open("data/update_can_use_ip.data",'w') as f:
        f.write(total)

    with open("data/map_total.data", 'w') as f:
        f.write(json.dumps(convert_ip(down_load(TOTAL)),ensure_ascii=False))

    with open("data/map_can_use.data", 'w') as f:
        f.write(json.dumps(convert_ip(down_load(CAN_USE)),ensure_ascii=False))


