---
title: python 操作 excel
date: 2019-12-25
tags:
  - python
categories:
  - 后端
---

Python 对 Excel 的读写主要有 xlrd、xlwt、xlutils、openpyxl、xlsxwriter 几种。

<!-- more -->

## 1.xlrd 主要是用来读取 excel 文件

```py
import xlrd
workbook = xlrd.open_workbook(u'有趣装逼每日数据及趋势.xls')
sheet_names= workbook.sheet_names()
for sheet_name in sheet_names:
sheet2 = workbook.sheet_by_name(sheet_name)
print
sheet_name rows = sheet2.row_values(3) # 获取第四行内容
cols = sheet2.col_values(1) # 获取第二列内容
print rows
print cols
```

## 2.xlwt 主要是用来写 excel 文件

```py
import xlwt
wbk = xlwt.Workbook()
sheet = wbk.add_sheet('sheet 1')
sheet.write(0,1,'test text')#第0行第一列写入内容
wbk.save('test.xls')
```

## 3.xlutils 结合 xlrd 可以达到修改 excel 文件目的

```py
import xlrd
from xlutils.copy import copy
workbook = xlrd.open_workbook(u'有趣装逼每日数据及趋势.xls')
workbooknew = copy(workbook)
ws = workbooknew.get_sheet(0)
ws.write(3, 0, 'changed!')
workbooknew.save(u'有趣装逼每日数据及趋势copy.xls')

```

## 4.openpyxl 可以对 excel 文件进行读写操作

```py

from openpyxl import Workbook
from openpyxl import load_workbook
from openpyxl.writer.excel import ExcelWriter

workbook_ = load_workbook(u"新歌检索失败1477881109469.xlsx")
sheetnames =workbook_.get_sheet_names() #获得表单名字
print sheetnames
sheet = workbook_.get_sheet_by_name(sheetnames[0])
print sheet.cell(row=3,column=3).value
sheet['A1'] = '47'
workbook_.save(u"新歌检索失败1477881109469_new.xlsx")
wb = Workbook()
ws = wb.active
ws['A1'] = 4
wb.save("新歌检索失败.xlsx")

```

## 5.xlsxwriter 可以写 excel 文件并加上图表

```py
import xlsxwriter

def get_chart(series):
    chart = workbook.add_chart({'type': 'line'})
    for ses in series:
        name = ses["name"]
        values = ses["values"]
        chart.add_series({
            'name': name,
            'categories': 'A2:A10',
            'values':values
        })
    chart.set_size({'width': 700, 'height': 350})
    return chart

if __name__ == '__main__':
    workbook = xlsxwriter.Workbook(u'H5应用中心关键数据及趋势.xlsx')
    worksheet = workbook.add_worksheet(u"每日PV,UV")
    headings = ['日期', '平均值']
    worksheet.write_row('A1', headings)
    index=0
    for row in range(1,10):
        for com in [0,1]:
            worksheet.write(row,com,index)
            index+=1
    series = [{"name":"平均值","values":"B2:B10"}]
    chart = get_chart(series)
    chart.set_title ({'name': '每日页面分享数据'})
    worksheet.insert_chart('H7', chart)
    workbook.close()


```
