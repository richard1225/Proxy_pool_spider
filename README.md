# 简介（Introduction）

用于抓取代理, 数据来自 代理供应商 的网站, 通过解析这些网站获得的 ip:port. 并用一个验证脚本不断验证所抓到的IP, 把能够使用的标记出来.

# 快速上手（Getting Started）
## 环境准备
有两种配置环境的方式
* 本机上配置
``` 
    # 这步自行根据包管理器的类型来安装
    install nodejs 7.6+ & install yarn

    # 安装依赖
    yarn add sprintf-js & yarn add puppeteer & yarn add request

    # 运行demo
    node xicidaili.js
```
* 使用 docker 配置
```
    # 拉取镜像
    docker pull richardtt1225/proxypool

    # 生成容器运行, /home/work/yzj/core/xicidaili.js 是本地文件路径, /app/index.js 是容器里面被执行文件的路径, 要把本地文件的路径映射到容器里面的文件路径上. 通过-v 参数 /home/work/yzj/core/xicidaili.js:/app/index.js 
    # 例子如下
    docker run --rm -v /home/work/yzj/core/xicidaili.js:/app/index.js  richardtt1225/proxypool
```
* 运行结果demo:
```
    [xicidaili]：获得新的ip数：75/100	[20180613065252]
```


# 添加新的代理源
目录下有个module.js, 这是个通用模板, 复制一份模板, 完成模板里面的三个TODO即可生成新的爬虫文件

* TODO1: 爬虫名字
* TODO2: 从网页上提取出ip块 
* TODO3: 对ip块进行解析, 分解成一个个ip
