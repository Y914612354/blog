---
title: spring-boot集成ElasticSearch使用QueryBuilder常用示例
date: 2020-03-25
tags:
  - swagger
categories:
  - 后端
---

介绍一下大家熟知的ElasticSearch
<!-- more -->

## 什么是es

es是全文搜索，属于最常见的需求，开源的 Elasticsearch （以下简称 es）是目前全文搜索引擎的首选。
它可以快速地储存、搜索和分析海量数据。维基百科、Stack Overflow、Github 都采用它。

## spring-boot中使用es

ElasticSearch索引方式

ElasticSearch有两种索引方式：分别为数字和字符串
数字
```
{
    "type": "long"
}
```
字符串
```
{
    "type": "text",
    "fields": {
        "keyword": {
            "type": "keyword",
            "ignore_above": 256
        }
    }
}
```

精确查询
数字：
单个
```java
QueryBuilder qb1 = QueryBuilders.termQuery("${fieldName}", "${fieldValue}");
```
批量
```java
QueryBuilder qb1 = QueryBuilders.termsQuery("${fieldName}", "${fieldValues}");
```
字符串：
单个
```java
QueryBuilder qb1 = QueryBuilders.termQuery("${fieldName}.keyword", "${fieldValue}");
```
批量
```java
QueryBuilder qb1 = QueryBuilders.termsQuery("${fieldName}.keyword", "${fieldValues}");
```
模糊查询
数字查询都为精确查询
字符串
```java
QueryBuilder qb1 = QueryBuilders.moreLikeThisQuery(new String[]{"${fieldName}"}, new String[]{"${fieldValue}"}, null);
```
范围查询
数字
闭区间查询
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").from(${fieldValue1}).to(${fieldValue2});
```
开区间查询
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").from(${fieldValue1}, false).to(${fieldValue2}, false);
```
大于
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").gt(${fieldValue});
```
大于等于
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").gte(${fieldValue});
```
小于
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").lt(${fieldValue});
```
小于等于
```java
QueryBuilder qb1 = QueryBuilders.rangeQuery("${fieldName}").lte(${fieldValue});
```
多条件查询

```java
QueryBuilder qb1 = QueryBuilders.moreLikeThisQuery(new String[]{"${fieldName1}"}, new String[]{"${fieldValue1}"}, null);
QueryBuilder qb2 = QueryBuilders.rangeQuery("${fieldName2}").gt("${fieldValue2}");
QueryBuilder qb3 = QueryBuilders.boolQuery().must(qb1).must(qb2);
```
方法说明

使用QueryBuilder：
- termQuery("key", obj) 完全匹配
- termsQuery("key", obj1, obj2..) 一次匹配多个值
- matchQuery("key", Obj) 单个匹配, field不支持通配符, 前缀具高级特性
- multiMatchQuery("text", "field1", "field2"..); 匹配多个字段, field有通配符忒行
- matchAllQuery(); 匹配所有文件 组合查询：：
- must(QueryBuilders) : AND：
- mustNot(QueryBuilders): NOT：
- should: : OR：

高亮查询
```java
    /**
     * 对结果设置高亮显示
     */
    public void testHighLighted() {
        /*  5.0 版本后的高亮设置
         * client.#().#().highlighter(hBuilder).execute().actionGet();
        HighlightBuilder hBuilder = new HighlightBuilder();
        hBuilder.preTags("<h2>");
        hBuilder.postTags("</h2>");
        hBuilder.field("user");        // 设置高亮显示的字段
        */
        // 加入查询中
        SearchResponse response = client.prepareSearch("blog")
            .setQuery(QueryBuilders.matchAllQuery())
            .addHighlightedField("user")        // 添加高亮的字段
            .setHighlighterPreTags("<h1>")
            .setHighlighterPostTags("</h1>")
            .execute().actionGet();

        // 遍历结果, 获取高亮片段
        SearchHits searchHits = response.getHits();
        for(SearchHit hit:searchHits){
            System.out.println("String方式打印文档搜索内容:");
            System.out.println(hit.getSourceAsString());
            System.out.println("Map方式打印高亮内容");
            System.out.println(hit.getHighlightFields());

            System.out.println("遍历高亮集合，打印高亮片段:");
            Text[] text = hit.getHighlightFields().get("title").getFragments();
            for (Text str : text) {
                System.out.println(str.string());
            }
        }
    }
}
```
moreLikeThisQuery
```java
/**
     * moreLikeThisQuery: 实现基于内容推荐, 支持实现一句话相似文章查询
     * {   
        "more_like_this" : {   
        "fields" : ["title", "content"],   // 要匹配的字段, 不填默认_all
        "like_text" : "text like this one",   // 匹配的文本
        }   
    }     
    percent_terms_to_match：匹配项（term）的百分比，默认是0.3
    min_term_freq：一篇文档中一个词语至少出现次数，小于这个值的词将被忽略，默认是2
    max_query_terms：一条查询语句中允许最多查询词语的个数，默认是25
    stop_words：设置停止词，匹配时会忽略停止词
    min_doc_freq：一个词语最少在多少篇文档中出现，小于这个值的词会将被忽略，默认是无限制
    max_doc_freq：一个词语最多在多少篇文档中出现，大于这个值的词会将被忽略，默认是无限制
    min_word_len：最小的词语长度，默认是0
    max_word_len：最多的词语长度，默认无限制
    boost_terms：设置词语权重，默认是1
    boost：设置查询权重，默认是1
    analyzer：设置使用的分词器，默认是使用该字段指定的分词器
     */
    @Test
    public void testMoreLikeThisQuery() {
        QueryBuilder queryBuilder = QueryBuilders.moreLikeThisQuery("user")
                            .like("kimchy");
//                            .minTermFreq(1)         //最少出现的次数
//                            .maxQueryTerms(12);        // 最多允许查询的词语
        searchFunction(queryBuilder);
    }
```


