#! -*- coding:utf-8 -*-
from __future__ import print_function
import re
import sys
import time
import requests
import threadpool
from Queue import Queue
print = lambda x: sys.stdout.write("%s\n" % x)

HOST = "http://10.194.165.27:8200/weixin_seeds/proxy/_search?sort=insert_time:desc&size=21000"
GK_ADDRESS = "http://10.194.165.27:8200/_bulk"
usefullq = Queue(maxsize=0)

def ok_guanku(ip_port):
    data = '{"update":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"doc":{"can_use":true,"update_time":"%s"},"upsert":{}}\n'%(ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    print (data)
    resp = requests.post(GK_ADDRESS,data=data)
    print (resp.content)
  
def bad_guanku(ip_port):
    data = '{"update":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"doc":{"can_use":false,"update_time":"%s"},"upsert":{}}\n'%(ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    resp = requests.post(GK_ADDRESS,data=data)

def request_baidu(proxy):
  try:
    resp = requests.get("http://dwz.cn/", proxies={"http": proxy}, timeout=10)
    time.sleep(0.5)
    resp = requests.get("http://dwz.cn/", proxies={"http": proxy}, timeout=10)
    time.sleep(0.5)
    resp = requests.get("http://dwz.cn/", proxies={"http": proxy}, timeout=10)
    time.sleep(0.5)
    # with lock:
    if "百度短网址" in resp.content:
      print (proxy)
      ok_guanku(proxy)
      usefullq.put(proxy)
      usefullq.task_done()
  except:
    bad_guanku(proxy)

def fetch_proxy():
  resp = requests.get(HOST)
  prolist = re.findall("[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+", resp.content)
  uniqlist = list(set(prolist))
  return uniqlist

proxy_list = fetch_proxy()
pool = threadpool.ThreadPool(200)
pool_request = threadpool.makeRequests(request_baidu, proxy_list)
[pool.putRequest(req) for req in pool_request]

print (len(proxy_list))
pool.wait()
print (usefullq.qsize())
