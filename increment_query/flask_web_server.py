#! -*- encoding:utf-8 -*-
from flask import Flask,render_template,request
import requests
import datetime
import json


app = Flask(__name__)
import json

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    now = datetime.datetime.now()
    oneMin = datetime.timedelta(days=130)
    Before = now - oneMin

    now_time = now.strftime('%Y%m%d%H%M%S')

    bef_time = Before.strftime('%Y%m%d%H%M%S')

    Q_URL = 'http://10.194.165.27:8200/weixin_seeds/proxy/_search?q=insert_time:[%s%%20TO%%20%s]&size=50'%(bef_time, now_time)

    resp = requests.get(Q_URL)
    mjson = json.loads(resp.content)

    hits = mjson['hits']['hits']

    arr = {}
    for hit in hits:
        item = hit['_source']
        item['insert_time'] = convert_time(item['insert_time'])
        if item['insert_time'] in arr:
            arr[item['insert_time']] += 1
        else:
            arr[item['insert_time']] = 1
    
    result = []
    for key in arr:
        result.append([int(key)*1000,arr[key]])
    return json.dumps((result)).replace(' ','')

def convert_time(time_str):
    return datetime.datetime.strptime(time_str,'%Y%m%d%H%M%S').strftime('%s')

if __name__=='__main__':
    app.run(host='0.0.0.0',port=9092,debug=True)


"""保存anyproxy存在es的列表种子"""


