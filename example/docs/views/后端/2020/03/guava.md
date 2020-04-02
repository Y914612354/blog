---
title: guava基本操作
date: 2020-04-2
tags:
  - guava
categories:
  - 后端
---

Java的集合数据类型不好用，今天写一下guava的数据类型
<!-- more -->


## 不可变集合
```java
// 因为不可变，所以变量名大写了
ImmutableSet<String> FRUITS = ImmutableSet.of("apple", "watermelon", "cherry", "mango");
// 尝试删除
FRUITS.remove("apple");
```
这样会将抛出java.lang.UnsupportedOperationException异常：

### 创建不可变集合
**直接用of**
```java
ImmutableList<String> of = ImmutableList.of("v1", "v2", "v3", "v4");
ImmutableMap<String, String> item = ImmutableMap.of("k1", "v1", "k2", "v2", "k3", "v3", "k4", "v4", "k5", "v5");
```
**copyof**
```java
Map<String,String> hashMap = new HashMap<>(10);
hashMap.put("l1","v1");

ImmutableMap<String, String> hasMap = ImmutableMap.copyOf(hashMap);
```
**builder**

## 说明
```java
Map<String, String> map = Maps.newHashMap();
ImmutableMap<String, String> immutableMap = ImmutableMap.<String, String>builder()
                .putAll(map)
                .put("k1", "v1")
                .build();

List<String> list = Lists.newArrayList();
ImmutableList<String> immutableList = ImmutableList.<String>builder()
                .addAll(list)
                .build();
```
也可以用Java 8 Stream中创建不可变集合：
```java
List<String> list = Arrays.asList("a", "b", "c");
List<String> immutableList = list.stream()
        .collect(collectingAndThen(toList(), ImmutableList::copyOf));

System.out.println(immutableList.getClass()); // class com.google.common.collect.RegularImmutableList
```
使用Guava提供的收集器：
```java
List<String> list = Arrays.asList("a", "b", "c");
List<String> immutableList = list.stream()
        .collect(ImmutableList.toImmutableList());

System.out.println(immutableList.getClass()); // class com.google.common.collect.RegularImmutableList
```
**不可变集合优点**
1. 当对象被不可信的库调用时，不可变形式是安全的；
2. 不可变对象被多个线程调用时，不存在竞态条件问题
3. 不可变集合不需要考虑变化，因此可以节省时间和空间。所有不可变的集合都比它们的可变形式有更好的内存利用率（分析和测试细节）；
4. 不可变对象因为有固定不变，可以作为常量来安全使用。

## 新集合类型
Guava提供了许多JDK没有的集合类型。
**RangeSet**
RangeSet一组不相连的、非空的区间，基本实现为TreeRangeSet，看个RangeSet的例子：

```java
RangeSet<Integer> rangeSet = TreeRangeSet.create();
rangeSet.add(Range.closed(1, 10));
System.out.println(rangeSet); // [[1..10]]

rangeSet.add(Range.closedOpen(11, 15));
System.out.println(rangeSet); // 不相连区间 [[1..10], [11..15)]

rangeSet.add(Range.closedOpen(15, 20));
System.out.println(rangeSet); // 相连区间 [[1..10], [11..20)]

rangeSet.add(Range.openClosed(0, 0));
System.out.println(rangeSet); // 空区间 [[1..10], [11..20)]

rangeSet.remove(Range.open(5, 10)); 
System.out.println(rangeSet); // 区间分割 [[1..5], [10..10], [11..20)]

```

查看RangeSet的范围跨度：
```java
RangeSet<Integer> rangeSet = TreeRangeSet.create();
rangeSet.add(Range.closed(1, 10));
rangeSet.add(Range.closedOpen(11, 15));

Range<Integer> span = rangeSet.span();
System.out.println(span.lowerEndpoint().intValue()); // 1
System.out.println(span.upperEndpoint().intValue()); // 15
```
从已有的RangeSet获取一个子范围RangeSet：
```java
RangeSet<Integer> numberRangeSet = TreeRangeSet.create();

numberRangeSet.add(Range.closed(0, 2));
numberRangeSet.add(Range.closed(3, 5));
numberRangeSet.add(Range.closed(5, 8));
RangeSet<Integer> numberSubRangeSet = numberRangeSet.subRangeSet(Range.closed(4, 14));

System.out.println(numberRangeSet); // [[0..2], [3..8]]
System.out.println(numberSubRangeSet); // [[4..8]]
```
获取除了RangeSet范围外的RangeSet：
```java
RangeSet<Integer> numberRangeSet = TreeRangeSet.create();

numberRangeSet.add(Range.closed(0, 2));
numberRangeSet.add(Range.closed(3, 5));
numberRangeSet.add(Range.closed(6, 8));
RangeSet<Integer> numberRangeComplementSet = numberRangeSet.complement();

System.out.println(numberRangeSet); // [[0..2], [3..5], [6..8]]
System.out.println(numberRangeComplementSet); // [(-∞..0), (2..3), (5..6), (8..+∞)]
```
判断一个RangeSet是否和另一个范围有交集：
```java
RangeSet<Integer> numberRangeSet = TreeRangeSet.create();

numberRangeSet.add(Range.closed(0, 2));
numberRangeSet.add(Range.closed(3, 10));
numberRangeSet.add(Range.closed(15, 18));

System.out.println(numberRangeSet); // [[0..2], [3..10], [15..18]]
System.out.println(numberRangeSet.intersects(Range.closed(4, 17))); // true
```
遍历RangeSet的范围区间：
```java
RangeSet<Integer> numberRangeSet = TreeRangeSet.create();

numberRangeSet.add(Range.closed(0, 2));
numberRangeSet.add(Range.closed(3, 10));
numberRangeSet.add(Range.closed(15, 18));

Set<Range<Integer>> ranges = numberRangeSet.asRanges();
ranges.forEach(System.out::print); // [0..2][3..10][15..18]
```
从RangeSet中获取包含某个值的访问区间：
```java
RangeSet<Integer> numberRangeSet = TreeRangeSet.create();

numberRangeSet.add(Range.closed(0, 2));
numberRangeSet.add(Range.closed(3, 10));
numberRangeSet.add(Range.closed(15, 18));

System.out.println(numberRangeSet.rangeContaining(7)); // [3..10]
```
### RangeMap
RangeMap是一组不相连的、非空的区间与指定值的映射，基本实现为TreeRangeMap光这样说有点抽象，看些例子:


```java
RangeMap<Integer, String> rangeMap = TreeRangeMap.create();
rangeMap.put(Range.closed(1, 10), "foo");
System.out.println(rangeMap); // [[1..10]=foo]

rangeMap.put(Range.open(3, 6), "bar");
System.out.println(rangeMap); // [[1..3]=foo, (3..6)=bar, [6..10]=foo]

rangeMap.put(Range.open(10, 20), "eoo");
System.out.println(rangeMap); // [[1..3]=foo, (3..6)=bar, [6..10]=foo, (10..20)=eoo]

rangeMap.remove(Range.closed(5, 11));
System.out.println(rangeMap); // [[1..3]=foo, (3..5)=bar, (11..20)=eoo]
```
从RangeMap中获取一个Entry：
```java
RangeMap<Integer, String> rangeMap = TreeRangeMap.create();

rangeMap.put(Range.closed(0, 2), "foo");
rangeMap.put(Range.closed(3, 5), "bar");
rangeMap.put(Range.closed(6, 8), "eoo");
Map.Entry<Range<Integer>, String> entry = rangeMap.getEntry(7);

System.out.println(entry.getKey()); // [6..8]
System.out.println(entry.getValue()); // eoo
```
剩下的操作和RangeSet差不多。

### BiMap
BiMap是一种特殊的，双向映射的Map，可以确保不会出现重复的值并且我们总是可以安全地通过key获取到value。BiMap的基本实现为HashBiMap。

看看例子：
```java
BiMap<String, String> biMap = HashBiMap.create();
biMap.put("k1", "v1");
biMap.put("k2", "v2");
biMap.put("k3", "v3");
System.out.println(biMap); // {k1=v1, k2=v2, k3=v3}

BiMap<String, String> inverse = biMap.inverse();
System.out.println(inverse); // {v1=k1, v2=k2, v3=k3}
```
通过inverse可以得到值，键映射的BiMap。

往BiMap里添加重复的值将会报错：
```java
BiMap<String, String> biMap = HashBiMap.create();
biMap.put("k1", "v1");
biMap.put("k2", "v2");
biMap.put("k3", "v1");
```
如果非要添加重复的值的话，可以用forcePut方法：
```java
BiMap<String, String> biMap = HashBiMap.create();
biMap.put("k1", "v1");
biMap.put("k2", "v2");
biMap.forcePut("k3", "v1");
System.out.println(biMap); // {k2=v2, k3=v1}
```

### Table
Table是一个包含行，列和单元格的集合类型，行和列组成有序键对。

创建一个HashBasedTable（内部使用LinkedHashMap）：
```java
Table<String, String, Integer> hashBasedTable = HashBasedTable.create();
```
如果需要对table的行和列按照自然顺序或者提供的排序规则进行排序的话，可以创建一个TreeBasedTable：
```java
Table<String, String, Integer> treeBasedTable = TreeBasedTable.create();
```
如果事先知道行和列的值，并且table大小是固定的话，可以使用ArrayTable：
```java
List<String> row = Lists.newArrayList("r1", "r2");
List<String> column = Lists.newArrayList("c1", "c2", "c3");
Table<String, String, Integer> arrayTable = ArrayTable.create(row, column);
System.out.println(arrayTable); // {r1={c1=null, c2=null, c3=null}, r2={c1=null, c2=null, c3=null}}
```
上面例子创建了一个两行三列的table。

创建不可变table：
```java
Table<String, String, String> immutableTable = ImmutableTable.<String, String, String> builder()
        .put("r1", "c1", "hello")
        .build();
```
通过行和列获取单元格的值：
```java
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

System.out.println(hashBasedTable); // {r1={c1=hello, c2=world}, r2={c1=good, c2=bye}}

String v1 = hashBasedTable.get("r1", "c1");
String v2 = hashBasedTable.get("r2", "c3");

System.out.println(v1); // hello
System.out.println(v2); // null
```
我们可以检测table是否包含某个行键，某个列键，某个值和某个行和列组合的键：
```java
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

boolean b1 = hashBasedTable.contains("r1", "c2"); // true
boolean b2 = hashBasedTable.containsColumn("c3"); // false
boolean b3 = hashBasedTable.containsRow("r2"); // true
boolean b4 = hashBasedTable.containsValue("world"); // true
```
通过行和列删除单元格，返回被删除的值：
```java
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

String removeValue = hashBasedTable.remove("r1", "c1");

System.out.println(removeValue); // hello
System.out.println(hashBasedTable); // {r1={c2=world}, r2={c1=good, c2=bye}}
```
我们可以通过行或列得到一个Map，如果通过行得到Map，那么Map的键为列值，Map的值为对应单元格的值，光说有点抽象，看个例子：
```java
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

Map<String, String> c2Map = hashBasedTable.column("c2");
Map<String, String> r1Map = hashBasedTable.row("r1");

System.out.println(c2Map); // {r1=world, r2=bye}
System.out.println(r1Map); // {c1=hello, c2=world}
System.out.println(c2Map.get("r1")); // world
```
我们还可以单独获取所有行或者所有列组成的Map：
```java
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

Map<String, Map<String, String>> columnMap = hashBasedTable.columnMap();
Map<String, Map<String, String>> rowMap = hashBasedTable.rowMap();

System.out.println(columnMap); // {c1={r1=hello, r2=good}, c2={r1=world, r2=bye}}
System.out.println(rowMap); // {r1={c1=hello, c2=world}, r2={c1=good, c2=bye}}
```
获取所有行键、列键或者值的集合：
```
Table<String, String, String> hashBasedTable = HashBasedTable.create();
hashBasedTable.put("r1", "c1", "hello");
hashBasedTable.put("r1", "c2", "world");
hashBasedTable.put("r2", "c1", "good");
hashBasedTable.put("r2", "c2", "bye");

Set<String> rowKeySet = hashBasedTable.rowKeySet();
Set<String> columnKeySet = hashBasedTable.columnKeySet();
Set<Table.Cell<String, String, String>> cells = hashBasedTable.cellSet();

System.out.println(rowKeySet); // [r1, r2]
System.out.println(columnKeySet); // [c1, c2]
System.out.println(cells); // [(r1,c1)=hello, (r1,c2)=world, (r2,c1)=good, (r2,c2)=bye]
```
### Multiset
Multiset和java.util.set类似，不过Mutiset可以添加重复的值：
```java
HashMultiset<String> hashMultiset = HashMultiset.create();
hashMultiset.add("are you ok?");
hashMultiset.add("are you ok?");
hashMultiset.add("are you ok?");

System.out.println(hashMultiset); // [are you ok? x 3]

hashMultiset.remove("are you ok?");
System.out.println(hashMultiset); // [are you ok? x 2]

hashMultiset.setCount("are you ok?", 10); // 直接设置元素个数
System.out.println(hashMultiset); // [are you ok? x 10]
```
在并发环境下，我们可以使用ConcurrentHashMultiset，它的add和remove方法是线程安全的。唯一值得注意的是，在并发环境下使用setCount方法时候，需使用下面这种方式：

```java
HashMultiset<String> hashMultiset = HashMultiset.create();
hashMultiset.setCount("are you ok?", 0, 5);
hashMultiset.setCount("are you ok?", 10, 5);

System.out.println(hashMultiset); // [are you ok? x 5]
```
第一个参数为需要添加的值，第二个参数为当前Multiset里元素个数，第三个参数为需要添加的元素个数。只有第二个参数的值正确的时候，setCount才有效，所以hashMultiset.setCount("are you ok?", 10, 5)实际上是不生效的。

### Multimap
Multimap可以通过一个键映射多个值：


```java
String key = "hello";
ArrayListMultimap<String, String> multimap = ArrayListMultimap.create();
multimap.put(key, "world");
multimap.put(key, "java");

System.out.println(multimap); // {hello=[world, java]}
System.out.println(multimap.get(key)); // [world, java]
```
### ClassToInstanceMap
使用类型作为键：
```java
MutableClassToInstanceMap<Object> classToInstanceMap = MutableClassToInstanceMap.create();
classToInstanceMap.put(String.class, "hello");
classToInstanceMap.put(Integer.class, 777);
classToInstanceMap.put(Double.class, 43.96);

System.out.println(classToInstanceMap); // {class java.lang.Double=43.96, class java.lang.String=hello, class java.lang.Integer=777}
System.out.println(classToInstanceMap.get(Double.class)); // 43.96
```
### Lists、Maps&Sets
**Lists**
```java
ArrayList<String> list = Lists.newArrayList("a", "b", "c");
```
反转List：
```java
ArrayList<String> list = Lists.newArrayList("a", "b", "c");

List<String> reverse = Lists.reverse(list);
System.out.println(reverse); // [c, b, a]
```
通过字符串生成字符集合：
```java
List<Character> characters = Lists.charactersOf("mrbird");
System.out.println(characters); // [m, r, b, i, r, d]
```
将集合按照指定区块大小分区：
```java
List<String> list = Lists.newArrayList("java", "php", "go", "python", "c#", "javascript");
List<List<String>> partition = Lists.partition(list, 2);

System.out.println(partition); // [[java, php], [go, python], [c#, javascript]]
```
一个删除List中重复项的技巧：
```java
List<String> list = Lists.newArrayList("a", "p", "p", "l", "e");

ImmutableList<String> newList = ImmutableSet.copyOf(list).asList();
System.out.println(newList); // [a, p, l, e]
```
从集合中删除null值：
```java
List<String> list = Lists.newArrayList("java", null," python");

Iterables.removeIf(list, Objects::isNull);
System.out.println(list); // [java, python]
```
### Sets
通过Sets创建set：
```java
Set<Object> hashSet = Sets.newHashSet();
```
合并两个Set：
```java
Set<String> set1 = ImmutableSet.of("a", "b", "c");
Set<String> set2 = ImmutableSet.of("b", "c", "d");

Set<String> union = Sets.union(set1, set2);
System.out.println(union); // [a, b, c, d]
```
可以通过Sets.cartesianProduct()获取两个Set的笛卡尔积：
```java
Set<Character> first = ImmutableSet.of('a', 'b');
Set<Character> second = ImmutableSet.of('c', 'd');
Set<List<Character>> result = Sets.cartesianProduct(first, second);

System.out.println(result); // [[a, c], [a, d], [b, c], [b, d]]
```
获取两个Set的交集：
```java
Set<Character> first = ImmutableSet.of('a', 'b', 'c');
Set<Character> second = ImmutableSet.of('c', 'd', 'e');
Set<Character> intersection = Sets.intersection(first, second);

System.out.println(intersection); // [c]
```
获取两个Set的差集：
```java
Set<Character> first = ImmutableSet.of('a', 'b', 'c');
Set<Character> second = ImmutableSet.of('c', 'd', 'e');
Set<Character> difference = Sets.symmetricDifference(first, second);

System.out.println(difference); // [a, b, d, e]
```
Maps
通过Maps创建Map：
```java
HashMap<Object, Object> map = Maps.newHashMap();
```
创建期望大小的Map：
```java
HashMap<Object, Object> map = Maps.newHashMapWithExpectedSize(5);
```
```java

```
```java

```
```java

```
```java

```
```java

```
```java

```
## 参考链接