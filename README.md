# Proxy_pool_spider
```
调用方法：用spider下面的./start_proxy.sh启动抓取程序
```
## 版本v1.0：
存在bug：存在抓完之后结束不了的现象，会导致数据丢失.
原因分析：解析数据是使用管道来做的，会导致 打开文件太多 的错误，需要转成js系统调用python来解析
