spiderweb
=========

点评seo解决方案

#项目结构

## crawl 抓取器

### 作用
* 抓取具体页面的逻辑
* 处理页面事件
* 生成html数据并调用cache模块

## core

### 作用
* 核心守护进程模块
* 处理请求并分发到具体的抓取器
* 管理抓取器进程
* 并维护请求队列
* 决定从缓存还是抓取器读取

## cache
* 缓存处理模块
* 维护生命周期
* 写缓存

# 运行

## 启动
<code>
    # sh spiderweb start
</code>

## debug
<code>
    # sh spiderweb debug
</code>

## 停止
<code>
    # sh spiderweb stop
</code>

#nginx配置说明

## 部署概述
spiderweb部署在静态集群（nginx或apache）之后，与应用同级，通过静态集群判断是否爬虫而反向代理至spiderweb或者应用

## 配置示例
location / {
        resolver 8.8.8.8;
        proxy_pass http://$host$request_uri;
        if ($http_user_agent ~* "qihoobot|Baiduspider|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|Adsbot-Google|Feedfetcher-Google|Yahoo! Slurp|Yahoo! Slurp China|YoudaoBot|Sosospider|Sogou spider|Sogou web spider|MSNBot|ia_archiver|Tomato Bot") {
                proxy_pass http://seobackend?targetUrl=$scheme://$host$request_uri;

        }
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        chunked_transfer_encoding       off;
}


