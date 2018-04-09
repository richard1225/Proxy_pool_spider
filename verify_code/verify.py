#! -*- coding:utf-8 -*-
import threadpool
import requests
from Queue import Queue
import time

HOST = "http://10.194.165.27:8200/weixin_seeds/proxy/_search?sort&size=11000"
GK_ADDRESS = "http://10.194.165.27:8200/_bulk"
usefullq = Queue(maxsize=0)

def ok_guanku(ip_port):
    data = '{"update":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"doc":{"can_use":false,"update_time":"%s"},"upsert":{}}\n'%(ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    print data
    resp = requests.post(GK_ADDRESS,data=data)
    print resp.content
  
def bad_guanku(ip_port):
    data = '{"update":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"doc":{"can_use":false,"update_time":"%s"},"upsert":{}}\n'%(ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    resp = requests.post(GK_ADDRESS,data=data)

def request_baidu(proxy):
  try:
    resp = requests.get("http://www.baidu.com", proxies={"http": proxy}, timeout=1)
    time.sleep(0.5)
    resp = requests.get("http://www.baidu.com", proxies={"http": proxy}, timeout=1)
    time.sleep(0.5)
    resp = requests.get("http://www.baidu.com", proxies={"http": proxy}, timeout=1)
    time.sleep(0.5)
    # with lock:
    if "百度一下" in resp.content:
      print proxy
      ok_guanku(proxy)
      usefullq.put(proxy)
      usefullq.task_done()
  except:
    bad_guanku(proxy)

def fetch_proxy():
  resp = requests.get(HOST)
  import re
  prolist = re.findall("[0-9]+.[0-9]+.[0-9]+.[0-9]+:[0-9]+", resp.content)
  uniqlist = list(set(prolist))
  return uniqlist

proxy_list = fetch_proxy()
pool = threadpool.ThreadPool(20)
pool_request = threadpool.makeRequests(request_baidu, proxy_list)
[pool.putRequest(req) for req in pool_request]

print len(proxy_list)
pool.wait()
print usefullq.qsize()
