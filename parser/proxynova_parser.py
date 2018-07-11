import sys
import time
import requests

ES_ADDRESS = "http://10.194.165.27:8200/_bulk"

FINAL_DATA = ""

def es_guanku(ip_port):
    data = '{"create":{"_index":"weixin_seeds","_type":"proxy","_id":"%s" }}\n{"ip_port": "%s", "country": "china", "from":"proxynova","can_use":true,"use_count":0,"fail_count":0,"insert_time": "%s"}\n'%(ip_port,ip_port,time.strftime('%Y%m%d%H%M%S', time.localtime(time.time())))
    global FINAL_DATA
    FINAL_DATA += data
    # resp = requests.post(ES_ADDRESS,data=data)
    # print resp.content
    
for line in sys.stdin:
    if "ago" in line:
        line = line.decode("utf-8")
        import re
        ip_port =  ":".join(re.findall("[0-9]+.[0-9]+.[0-9]+.[0-9]+\t[0-9]+",line)[0].split('\t'))
        # print ip_port
        es_guanku(ip_port)
        
resp = requests.post(ES_ADDRESS,data=FINAL_DATA)
print resp.content