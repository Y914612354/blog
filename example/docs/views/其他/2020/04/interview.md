---
title: 面试
date: 2020-04-02
categories:
  - 其他
tags:
  - 面试
---

总结一下最近的面试题
<!-- more -->


## 上机操作题
### 统计词频
1. 新建一个springboot工程，java 版本不限，最好java8
2. 统计当前工程下所以类型的文件，含隐藏文件
3. 统计所有非二进制文件中的单词词频
4. 只统计英文单词，即连续字母数字构成的词
5. 驼峰法TestWordCount算三个词test, word, count
6. 把Top10的单词按单词，词频，输出到控制台
7. 加分项，把包含Topl的单词的文件，按其字节大小降序排列输出

```java
package com.example.interviews;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.util.StringUtils;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 新建一个springboot工程，java 版本不限，最好java8
 *
 * @author wangjiahao
 * @date 2020/4/2
 */
@SpringBootApplication
public class InterviewsApplication {
    /**
     * 所有的文件地址
     */
    public static List<String> FILE_NAME_LIST = new ArrayList<>();
    /**
     * 用来统计类型数量
     */
    public static Map<String, Integer> TYPE_MAP = new HashMap<>(16);
    /**
     * 未处理的单词map
     */
    public static HashMap<String, Integer> UNTREATED_WORD_MAP = new HashMap<>(16);
    /**
     * 用来统计驼峰单词词频
     */
    public static Map<String, Integer> WORD_MAP = new HashMap<>(16);
    /**
     * 单词所在的文件数组
     */
    public static Map<String, List<String>> WORD_IN_FILE = new HashMap<>(16);
    /**
     * 单词所在文件的大小map
     */
    public static Map<String, Long> WORD_IN_FILE_SIZE = new HashMap<>(16);

    public static void main(String[] args) {
        //SpringApplication.run(InterviewsApplication.class, args);

        // 项目目录
        String projectPath = System.getProperty("user.dir");

        // 统计当前工程下所以类型的文件，含隐藏文件
        readFileName(TYPE_MAP, projectPath);

        // 统计所有非二进制文件中的单词词频
        findWordCount();

        // 把Top10的单词按单词，词频，输出到控制台 map排序
        List<Map.Entry<String, Integer>> topList = new ArrayList<>(WORD_MAP.entrySet());
        topList.sort((o1, o2) -> o2.getValue().compareTo(o1.getValue()));
        System.err.println("所有文件地址" + FILE_NAME_LIST);
        System.err.println("类型对应数量" + TYPE_MAP);
        System.err.println("[所有单词]" + UNTREATED_WORD_MAP);
        System.err.println("按单词，词频输出" + topList);

        // 加分项，把包含Top1的单词的文件，按其字节大小降序排列输出
        // WORD_IN_FILE.forEach((k, v) -> System.err.println(k + " = " + v));
        String s1 = topList.get(0).getKey();
        List<String> strings = WORD_IN_FILE.get(s1).stream().distinct().collect(Collectors.toList());
        for (String s : strings) {
            File file = new File(s);
            if (file.exists()) {
                WORD_IN_FILE_SIZE.put(s,file.length());
            }
        }

        ArrayList<Map.Entry<String, Long>> entries = new ArrayList<>(WORD_IN_FILE_SIZE.entrySet());
        entries.sort((o1, o2) -> o2.getValue().compareTo(o1.getValue()));
        entries.forEach(System.out::println);


    }

    /**
     * 只统计英文单词，即连续字母数字构成的词
     */
    private static void findWordCount() {
        try {
            for (String s : FILE_NAME_LIST) {
                File file = new File(s);
                // 判断是否为二进制文件
                if (!isBinary(file)) {
                    BufferedReader br = new BufferedReader(new FileReader(file));
                    //每次读取一行
                    String line;
                    //循环读入
                    StringBuilder buffer = new StringBuilder();
                    while ((line = br.readLine()) != null) {
                        // 读取每个字节
                        char[] chars = line.toCharArray();
                        for (int i = 0; i < chars.length; i++) {
                            int ascii = chars[i];
                            boolean flag = (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122) || (ascii >= 48 && ascii <= 57);
                            if (flag) {
                                buffer.append(line.substring(i, i + 1));
                            } else {
                                String key = buffer.toString();
                                buffer.setLength(0);
                                if (!StringUtils.isEmpty(key)) {
                                    if (UNTREATED_WORD_MAP.containsKey(key)) {
                                        UNTREATED_WORD_MAP.put(key, UNTREATED_WORD_MAP.get(key) + 1);
                                    } else {
                                        UNTREATED_WORD_MAP.put(key, 1);
                                    }
                                    humpWord(key, file.getPath());
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    /**
     * 驼峰单词
     * 驼峰法TestWordCount算三个词test, word, count
     *
     * @param humpStr 驼峰单词
     */
    private static void humpWord(String humpStr, String path) {
        int begin  = humpStr.substring(0, 1).toCharArray()[0];
        int last = humpStr.substring(humpStr.length() - 1).toCharArray()[0];
        if((begin < 65 || begin > 90) && (last < 97 || last > 122)){
            // 统计驼峰单词词频
            if (WORD_MAP.containsKey(humpStr)) {
                WORD_MAP.put(humpStr, WORD_MAP.get(humpStr) + 1);
            } else {
                WORD_MAP.put(humpStr, 1);
            }
            return;
        }

        // 判断非空 第一个字母大写 最后一个字段小写
        if (!StringUtils.isEmpty(humpStr)) {
            List<Integer> indexList = new ArrayList<>();
            char[] chars = humpStr.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                int ascii = chars[i];
                if (ascii >= 65 && ascii <= 90) {
                    indexList.add(i);
                }
            }
            for (int i = 0; i < indexList.size(); i++) {
                int end = i < indexList.size() - 1 ? indexList.get(i + 1) : humpStr.length();
                String word;
                if (i == 0) {
                    word = humpStr.substring(0, end);
                } else {
                    word = humpStr.substring(indexList.get(i), end);
                }
                // 统计驼峰单词词频
                if (WORD_MAP.containsKey(word)) {
                    WORD_MAP.put(word, WORD_MAP.get(word) + 1);
                } else {
                    WORD_MAP.put(word, 1);
                }
                // 单词所在的文件夹
                if (WORD_IN_FILE.containsKey(word)) {
                    List<String> strings = WORD_IN_FILE.get(word);
                    strings.add(path);
                    WORD_IN_FILE.put(word, strings);
                } else {
                    List<String> strings = new ArrayList<>();
                    strings.add(path);
                    WORD_IN_FILE.put(word, strings);
                }
            }
        }

    }

    /**
     * 判断是否是二进制
     *
     * @param file 文件
     * @return 是否是二进制
     */
    public static boolean isBinary(File file) {
        boolean isBinary = false;
        try {
            FileInputStream fin = new FileInputStream(file);
            long len = file.length();
            for (int j = 0; j < (int) len; j++) {
                int t = fin.read();
                if (t < 32 && t != 9 && t != 10 && t != 13) {
                    isBinary = true;
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isBinary;
    }

    /**
     * 读取文件名
     *
     * @param map  map
     * @param path 地址
     */
    private static void readFileName(Map<String, Integer> map, String path) {
        File file = new File(path);
        // 判断文件是否存在
        if (file.exists()) {
            // 判断是否是文件夹
            if (file.isDirectory()) {
                String[] list = file.list();
                for (String s : list) {
                    readFileName(map, path + File.separator + s);
                }
            } else {
                String name = file.getName();
                FILE_NAME_LIST.add(file.getPath());
                String key = name;
                if (name.contains(".")) {
                    int i = name.lastIndexOf('.');
                    if (-1 != i) {
                        key = name.substring(i);
                    }
                }
                if (map.containsKey(key)) {
                    map.put(key, map.get(key) + 1);
                } else {
                    map.put(key, 1);
                }
            }
        } else {
            System.err.println("文件不存在" + path);
        }
    }
}


```