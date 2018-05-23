# Introduction
### Proxy spider

A spider program of collecting HTTP or HTTPS proxy, 'collecting' means that it do not scan ip, but scrap proxy IP from some high quality source, such as freeproxy.cn and so on.

# Usage
`cd core` and run `python scheduler.py`, before you run, you should configure `core/spider_name.txt` to specific which spider you'r gonna to run.
Also, if you want to extend more spider, just `cp core/mudule.js core/<your_spider>`, and finish 3 TODO in your spider, then you can add your spider name into `core/spider_name.txt`, after that you can run your spider in `python scheduler.py`

### Note: Please replace the ElasticSeach ip and subprocess.Popen() methord in your spider file and `scheduler.py`, or it will not be saved in your database
