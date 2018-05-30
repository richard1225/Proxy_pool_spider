#!-*- encoding:utf-8 -*-
import web

urls = (
    "/", "index"
)

render = web.template.render('template/')

import json
class index:
    def GET(self):
        with open("data/update_total_ip.data") as f:
            total_data = f.read()
        
        with open("data/update_can_use_ip.data") as f:
            can_use_data = f.read()

        total_data = total_data.replace("\n","")
        can_use_data = can_use_data.replace("\n","")

        with open("data/map_total.data") as f:
            map_total = f.read()
        
        with open("data/map_can_use.data") as f:
            map_can_use = f.read()

        return render.visual(total_data,can_use_data, map_total, map_can_use)

if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()