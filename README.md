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

