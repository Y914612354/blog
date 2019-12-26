---
title: Java初始化List数据
date: 2018-08-15
tags:
  - java
categories:
  - 后端
---

List 是 Java 开发中经常会使用的集合，你们知道有哪些方式可以初始化一个 List 吗？这其中不缺乏一些坑，今天栈长我给大家一一普及一下。

<!-- more -->

## 常规方式

这种就是我们平常用的最多最平常的方式了，没什么好说的，后面缺失的泛型类型在 JDK 7 之后就可以不用写具体的类型了，改进后会自动推断类型。

```
List<String> languages = new ArrayList<>();
languages.add("Java");
languages.add("PHP");
languages.add("Python");
System.out.println(languages);
```

## Arrays 工具类

```
List<String> jdks = asList("JDK6", "JDK8", "JDK10");
System.out.println(jdks);

```

注意，上面的 asList 是 Arrays 的静态方法，这里使用了静态导入。这种方式添加的是不可变的 List, 即不能添加、删除等操作，需要警惕。。

```
import static java.util.Arrays.asList;
```

如果要可变，那就使用 ArrayList 再包装一下，如下面所示。

```
List<String> numbers = new ArrayList<>(Arrays.asList("1", "2", "3"));
numbers.add("4");
System.out.println(numbers);
```

包装一下，这就是可变的 ArrayList 了。
3、Collections 工具类

```
List<String> apples = Collections.nCopies(3, "apple");
System.out.println(apples);
```

这种方式添加的是不可变的、复制某个元素 N 遍的工具类，以上程序输出：

```
[apple, apple, apple]
```

老规则，如果要可变，使用 ArrayList 包装一遍。

```
List<String> dogs = new ArrayList<>(Collections.nCopies(3, "dog"));
dogs.add("dog");
System.out.println(dogs);

```

还有初始化单个对象的 List 工具类，这种方式也是不可变的，集合内只能有一个元素，这种也用得很少啊。

```
List<String> cat = Collections.singletonList("cat");
System.out.println(cat);
```

还有一个创建空 List 的工具类，没有默认容量，节省空间，但不知道实际工作中有什么鸟用。

```
List<String> cat = Collections.emptyList("cat");
```

4、匿名内部类

```
List<String> names = new ArrayList<>() {{
    add("Tom");
    add("Sally");
    add("John");
}};
System.out.println(names);
```

这种使用了匿名内部类的方式，一气喝成，是不是很高大上？栈长我曾经也使用过这种方式，不过我觉得这种看似高级，实现也没什么卵用。
5、JDK8 Stream

```
List<String> colors = Stream.of("blue", "red", "yellow").collect(toList());
System.out.println(colors);
```

Stream 是 JDK 8 推出来的新概念，比集合还要更强大，还可以和集合互相转换。
上面同样使用了静态导入：

```
import static java.util.stream.Collectors.toList;
```

关于 Stream 的一系列教程，可以在 Java 技术栈微信公众号后台回复关键字：新特性。
6、JDK 9 List.of

```
List<String> cups = List.of("A", "B", "C");
System.out.println(cups);
```

这是 JDK 9 里面新增的 List 接口里面的静态方法，同样也是不可变的。
