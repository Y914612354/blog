---
title: reverse-sourcemap反编译
date: 2021-01-11
tags:
  - vue
categories:
  - 前端
---

<!-- more -->

通过`reverse-sourcemap`反编译



## 描述

1. 看到一个网站，使用vue开发，而且map文件能访问到，所以想反编译一下


## 开始
1. ![浏览器找到这个东西](https://raw.githubusercontent.com/remember-5/blog/master/images/2021/01/WeChat85413c37216fb619d7c9c7f07e9da855.png)
发现这个东西用域名+ '/static/js/' + key + value 能访问到 js 文件,加上.map后缀可以访问到map文件，这个时候，我就知道离成功不远了

2. 首先把文件下载到本地，使用python

创建并格式化data.json，把以上数据放入里面
```json
{
   "1": "xxxxqee",
   "2": "zzzzdaw",
   "3": "xxxxzze",
   "4": "xxsadwq"
}
```

使用脚本，http的地方要替换成你自己的域名

```python
import json
import requests

def run():
    # 读取文件
    json_data = {}
    with open('data.json', 'r', encoding='utf8')as fp:
        json_data = json.load(fp)
    print('这是文件中的json数据：', json_data)
    print('这是读取到文件数据的数据类型：', type(json_data))

    prefix_url = "http://xxx/static/js/{key}.{value}.js"
    prefix_url_map = "http://xxx/static/js/{key}.{value}.js.map"
    for k in json_data:
        url = prefix_url.format(key=k,value=json_data[k])
        url_map = prefix_url_map.format(key=k,value=json_data[k])

        res = requests.get(url)
        with open('js/{}.{}.js'.format(k, json_data[k]), 'wb') as f:
            f.write(res.content)

        res_map = requests.get(url_map)
        with open('js/{}.{}.js.map'.format(k, json_data[k]), 'wb') as f:
            f.write(res_map.content)

if __name__ == '__main__':
    run()
```



3. 安装插件
```sh
npm i -g reverse-sourcemap
```

4. 根据map中到文件结构，创建文件夹

![文件结构](https://raw.githubusercontent.com/remember-5/blog/master/images/2021/01/WeChat470836557d799dbb781d9e024b2d8576.png)
![路径](https://raw.githubusercontent.com/remember-5/blog/master/images/2021/01/WeChata837a628ce43ce5e7f786ed3bc1a01d0.png)

5. 执行命令
编译一个文件
```shell
reverse-sourcemap -v xxx.js.map -o sourcecode
```

编译所有文件
```sh
reverse-sourcemap -v *.js.map -o sourcecode
```






