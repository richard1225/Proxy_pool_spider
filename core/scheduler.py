#!-*- encoding:utf-8 -*-
import re
import sys
import subprocess

# 使用docker或者直接用node

Method = 'node'

class Scheduler:
    def __init__(self, normal_list=[]):
        self.normal_list = normal_list

    def handle_spider(self):
        # 首先处理特殊的爬虫，如需要图片识别的
        mimvp = subprocess.Popen((Method, 'mimvp'),stdout=subprocess.PIPE)
        output = subprocess.check_output(('python','recognize_img.py'), stdin=mimvp.stdout)
        mimvp.wait()
        print output

        # 处理常规爬虫
        for sp_name in self.normal_list:
            spider_output = subprocess.check_output((Method, sp_name))
            mimvp.wait()
            print spider_output

if __name__ == '__main__':
    # 读取爬虫文件名
    with open("spider_names.txt") as f:
        raw = f.read()
    # 支持使用#号进行注释
    names = filter(None,"\n".join(re.split("#[\S\s]+\n*",raw)).split('\n'))

    scheduler = Scheduler(names)
    scheduler.handle_spider()