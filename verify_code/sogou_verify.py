#!-*- encoding:utf-8 -*-
import wechatsogou

ws_api = wechatsogou.WechatSogouAPI(timeout=5, captcha_break_time=1,proxies={
    "http": "127.0.0.1:1087",
})

print 'nuaa-jjyzyz' in ws_api.get_gzh_info('南航继教院青年志愿者')['wechat_id']
