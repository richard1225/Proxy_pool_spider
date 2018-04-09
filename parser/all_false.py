#! -*- coding:utf-8 -*-
import threadpool
import requests
from Queue import Queue
import time

HOST = "http://10.194.165.27:8200/weixin_seeds/proxy/_search?sort&size=11000&q=can_use:true"
GK_ADDRESS = "http://10.194.165.27:8200/_bulk"

def bad_guanku(ip_port):
    data = '{"update":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"doc":{"can_use":false,"update_time":"%s"},"upsert":{}}\n'%(ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    resp = requests.post(GK_ADDRESS,data=data)

def fetch_proxy():
  resp = requests.get(HOST)
  import re
  prolist = re.findall("[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+", resp.content)
  uniqlist = list(set(prolist))
  for url in uniqlist:
    bad_guanku(url)
fetch_proxy()
