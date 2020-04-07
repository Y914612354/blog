---
title: springboot中事物注解
date: 2020-04-07
tags:
  - java
categories:
  - 后端
---

<!-- more -->
## 什么是事务?
事务是逻辑上的一组操作，要么都执行，要么都不执行。

事务最经典也经常被拿出来说例子就是转账了。假如小明要给小红转账1000元，这个转账会涉及到两个关键操作就是：将小明的余额减少1000元，将小红的余额增加1000元。万一在这两个操作之间突然出现错误比如银行系统崩溃，导致小明余额减少而小红的余额没有增加，这样就不对了。事务就是保证这两个关键操作要么都成功，要么都要失败。

### 事物的四大特性(ACID)

![事物的四大特性](https://raw.githubusercontent.com/remember-5/blog/master/images/2020/04/1.png)


- **原子性**（Atomicity）： 事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
- **一致性**（Consistency）： 执行事务前后，数据保持一致，多个事务对同一个数据读取的结果是相同的；
- **隔离性**（Isolation）： 并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；
- **持久性**（Durability）： 一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

### 并发事务带来哪些问题?
- **脏读**（Dirty read）: 当一个事务正在访问数据并且对数据进行了修改，而这种修改还没有提交到数据库中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据是还没有提交的数据，那么另外一个事务读到的这个数据是“脏数据”，依据“脏数据”所做的操作可能是不正确的。
- **丢失修改**（Lost to modify）: 指在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在第一个事务中修改了这个数据后，第二个事务也修改了这个数据。这样第一个事务内的修改结果就被丢失，因此称为丢失修改。 例如：事务1读取某表中的数据A=20，事务2也读取A=20，事务1修改A=A-1，事务2也修改A=A-1，最终结果A=19，事务1的修改被丢失。
- **不可重复读**（Unrepeatableread）: 指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读。
- **幻读**（Phantom read）: 幻读与不可重复读类似。它发生在一个事务（T1）读取了几行数据，接着另一个并发事务（T2）插入了一些数据时。在随后的查询中，第一个事务（T1）就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读。

**不可重复读和幻读区别：**

不可重复读的重点是修改比如多次读取一条记录发现其中某些列的值被修改，幻读的重点在于新增或者删除比如多次读取一条记录发现记录增多或减少了。

事务隔离级别有哪些?MySQL的默认隔离级别是?

SQL 标准定义了四个隔离级别：

- **READ-UNCOMMITTED**(读取未提交)： 最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读。
- **READ-COMMITTED**(读取已提交)： 允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生。
- **REPEATABLE-READ**(可重复读)： 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。
- **SERIALIZABLE**(可串行化)： 最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。


| 隔离级别 | 脏读 | 不可重复读 | 幻影读 |
| -- | -- | -- | -- |
|READ-UNCOMMITTED| √ |√ |√|
|READ-COMMITTED |× |√| √|
|REPEATABLE-READ|× |× |√
|SERIALIZABLE |× |× |×|

MySQL InnoDB 存储引擎的默认支持的隔离级别是 REPEATABLE-READ（可重读）。我们可以通过SELECT @@tx_isolation;命令来查看
```sql
mysql> SELECT @@tx_isolation;
+-----------------+
| @@tx_isolation  |
+-----------------+
| REPEATABLE-READ |
+-----------------+
```



这里需要注意的是：与 SQL 标准不同的地方在于 InnoDB 存储引擎在 REPEATABLE-READ（可重读） 事务隔离级别下使用的是Next-Key Lock 锁算法，因此可以避免幻读的产生，这与其他数据库系统(如 SQL Server) 是不同的。所以说InnoDB 存储引擎的默认支持的隔离级别是 REPEATABLE-READ（可重读） 已经可以完全保证事务的隔离性要求，即达到了 SQL标准的 SERIALIZABLE(可串行化) 隔离级别。因为隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是 READ-COMMITTED(读取提交内容) ，但是你要知道的是InnoDB 存储引擎默认使用 REPEAaTABLE-READ（可重读） 并不会有任何性能损失。

InnoDB 存储引擎在 分布式事务 的情况下一般会用到 SERIALIZABLE(可串行化) 隔离级别。


## Spring Boot对事务的配置处理
在Spring boot中支持事务，首先要导入Spring boot提供的JDBC或JPA依赖：
```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-jdbc</artifactId>
   <scope>test</scope>
</dependency>
 
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-jpa</artifactId>
   <scope>test</scope>
</dependency>
```


当我们使用了spring-boot-starter-jdbc或spring-boot-starter-data-jpa依赖的时候，Spring Boot会自动默认分别注入DataSourceTransactionManager或JpaTransactionManager，
并进行一系列的事务初始化操作，所以我们不需要任何额外配置就可以用@Transactional注解进行事务的使用。
虽然在传统的工程中也可以使用@Transactional注解来申明事务，但是还是需要使用XML来配置事务管理器(DataSourceTransactionManager)。

那么大家可能会有一个疑问，因为传统工程中使用XML配置事务时，需要给DataSourceTransactionManager事务管理器配置数据源DataSource，那么Spring Boot进行自动配置的话，
Spring Boot在注入DataSourceTransactionManager事务管理器时，是如何找到我们配置的DataSource数据源的呢？
答案是Spring Boot会自动到Spring容器中寻找我们配置好的DataSource。也即是之前我们的手动操作，现在使用Spring Boot变成了自动化操作。

### 1.简单开启事务管理 @Transactional的使用
在Spring Boot中使用@Transactional注解，只需要在启动类上添加@EnableTransactionManagement注解开启事务支持

然后在访问数据库的Service方法上添加注解@Transactional注解即可：
@Transactional不仅可以注解在方法上，也可以注解在类上。当注解在类上的时候意味着此类的所有public方法都是开启事务的。如果类级别和方法级别同时使用了@Transactional注解，则使用在类级别的注解会重载方法级别的注解。

使用@Transactional注解进行事务控制时，可以在其中添加有关“隔离级别”和“传播行为”的指定：
#### (1)隔离级别
指定方法：通过使用 isolation 属性设置，@Transactional(isolation = Isolation.DEFAULT)
- **DEFAULT** ：这是默认值，表示使用底层数据库的默认隔离级别。对大部分数据库而言，通常这值就是： READ_COMMITTED 。
- **READ_UNCOMMITTED** ：该隔离级别表示一个事务可以读取另一个事务修改但还没有提交的数据。该级别不能防止脏读和不可重复读，因此很少使用该隔离级别。
- **READ_COMMITTED** ：该隔离级别表示一个事务只能读取另一个事务已经提交的数据。该级别可以防止脏读，这也是大多数情况下的推荐值。
- **REPEATABLE_READ** ：该隔离级别表示一个事务在整个过程中可以多次重复执行某个查询，并且每次返回的记录都相同。即使在多次查询之间有新增的数据满足该查询，这些新增的记录也会被忽略。该级别可以防止脏读和不可重复读。
- **SERIALIZABLE** ：所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别。


#### (2)传播行为
指定方法：通过使用 propagation 属性设置，例如：@Transactional(propagation = Propagation.REQUIRED)

- **REQUIRED** ：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。
- **SUPPORTS** ：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
- **MANDATORY** ：如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。
- **REQUIRES_NEW** ：创建一个新的事务，如果当前存在事务，则把当前事务挂起。
- **NOT_SUPPORTED** ：以非事务方式运行，如果当前存在事务，则把当前事务挂起。
- **NEVER** ：以非事务方式运行，如果当前存在事务，则抛出异常。
- **NESTED** ：如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于 REQUIRED 。


#### (3)其他参数
- **readOnly** 只读事务用于只读取但不修改数据的情形，只读事务用于特定情景下的优化，该属性用于设置当前事务是否为只读事务，设置为true表示只读，false则表示可读写，默认值为false。例如：@Transactional(readOnly=true)
- **rollbackFor** 该属性用于设置需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，则进行事务回滚。例如：指定单一异常类：@Transactional(rollbackFor=RuntimeException.class)指定多个异常类：@Transactional(rollbackFor={RuntimeException.class, Exception.class})
- **rollbackForClassName** 该属性用于设置需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，则进行事务回滚。例如：指定单一异常类名称@Transactional(rollbackForClassName=”RuntimeException”)指定多个异常类名称：@Transactional(rollbackForClassName={“RuntimeException”,”Exception”})
- **noRollbackFor** 该属性用于设置不需要进行回滚的异常类数组，当方法中抛出指定异常数组中的异常时，不进行事务回滚。例如：指定单一异常类：@Transactional(noRollbackFor=RuntimeException.class)指定多个异常类：@Transactional(noRollbackFor={RuntimeException.class, Exception.class})
- **noRollbackForClassName** 该属性用于设置不需要进行回滚的异常类名称数组，当方法中抛出指定异常名称数组中的异常时，不进行事务回滚。例如：指定单一异常类名称：@Transactional(noRollbackForClassName=”RuntimeException”)指定多个异常类名称：@Transactional(noRollbackForClassName={“RuntimeException”,”Exception”})
- **timeout** 所谓事务超时，就是指一个事务所允许执行的最长时间，如果超过该时间限制但事务还没有完成，则自动回滚事务。在 TransactionDefinition 中以 int 的值来表示超时时间，其单位是秒。
默认设置为底层事务系统的超时值，如果底层数据库事务系统没有设置超时值，那么就是none，没有超时限制。默认值为-1表示永不超时




当然，如果我们想要使用自定义的事务管理器，可以在配置类中设置自定义事务管理器，并以@Bean暴露给Spring容器：
```java
@Configuration
public class TransactionalConfiguration implements TransactionManagementConfigurer{
 
    @Resource(name="txManager1")
    private PlatformTransactionManager txManager1;
    
    // 创建事务管理器1
    @Bean(name = "txManager1")
    public PlatformTransactionManager txManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
 
    // 创建事务管理器2
    @Bean(name = "txManager2")
    public PlatformTransactionManager txManager2(EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }
    
    @Override
    public PlatformTransactionManager annotationDrivenTransactionManager() {
        return txManager1;
    }
}
```


这里配置类实现了TransactionManagementConfigurer接口，其必须实现annotationDrivenTransactionManager()方法，该方法的返回值代表在拥有多个事务管理器的情况下默认使用的事务管理器。
然后在@Transactional注解中使用value指定需要的事务管理器的名称即可(不指定的话默认使用annotationDrivenTransactionManager()方法的返回值)：
```java
@Override
// 使用value具体指定使用哪个事务管理器
@Transactional(value="txManager1")
public User findUserById(int id) {
    return userMapper.findUserById(id);
}
 
@Override
// 没有指定value，则默认使用方法 annotationDrivenTransactionManager() 返回的事务管理器
@Transactional
public User findUserById2(int id) {
    return userMapper.findUserById(id);
}
```



### 三、@Transactional注解实现原理剖析
使用@Transactional注解对某目标方法进行标注时，Spring会使用AOP代理，生成一个代理对象，该对象会根据@Transactional注解的属性配置信息，来决定是否使用TransactionInterceptor拦截器来进行
拦截。如果该方法需要使用事务控制，则需要使用TransactionInterceptor事务拦截器，对该方法进行拦截，在该目标方法执行之前创建并开启事务，然后执行目标方法，最后在目标方法执行完毕后，
根据执行情况是否出现异常，利用抽象事务管理器AbstractPlatformTransactionManager操作数据源DataSource提交或回滚事务:

![原理剖析](https://raw.githubusercontent.com/remember-5/blog/master/images/2020/04/2.png)


Spring AOP代理类有两种：
#### (1)CglibAopProxy
垃圾回收类库提供的代理类。
上图就是以CglibAopProxy为例，需要调用其内部类的 DynamicAdvisedInterceptor 的 intercept 方法来进行代理。

#### (2)JdkDynamicAopProxy
JDK提供的代理类。
需要调用其 invoke 方法来进行代理。

事务管理的框架是由抽象事务管理器AbstractPlatformTransactionManager来提供的，而具体的底层事务处理实现，由PlatformTransactionManager的具体实现类来实现，如事务管理器 DataSourceTransactionManager。
不同的事务管理器管理不同的数据资源 DataSource，比如 DataSourceTransactionManager 管理 JDBC 的 Connection。
PlatformTransactionManager，AbstractPlatformTransactionManager 及具体实现类关系下图所示：
![原理剖析](https://raw.githubusercontent.com/remember-5/blog/master/images/2020/04/3.png)

部分摘抄于https://blog.csdn.net/u013517797/java/article/details/82926410


### @Transactional事务几点注意
这里面有几点需要大家留意：
- A. 一个功能是否要事务，必须纳入设计、编码考虑。不能仅仅完成了基本功能就ok。
- B. 如果加了事务，必须做好开发环境测试（测试环境也尽量触发异常、测试回滚），确保事务生效。
- C. 以下列了事务使用过程的注意事项，请大家留意。
    - 1.不要在接口上声明@Transactional ，而要在具体类的方法上使用 @Transactional 注解，否则注解可能无效。(如果在接口、实现类或方法上都指定了@Transactional注解，则优先级顺序为方法>实现类>接口；)
    - 2.不要图省事，将@Transactional放置在类级的声明中，放在类声明，会使得所有方法都有事务。故@Transactional应该放在方法级别，不需要使用事务的方法，就不要放置事务，比如查询方法。否则对性能是有影响的。
    - 3.使用了@Transactional的方法，对同一个类里面的方法调用， @Transactional无效。比如有一个类Test，它的一个方法A，A再调用Test本类的方法B（不管B是否public还是private），但A没有声明注解事务，而B有。则外部调用A之后，B的事务是不会起作用的。（经常在这里出错）
    - 4.使用了@Transactional的方法，只能是public，@Transactional注解的方法都是被外部其他类调用才有效，故只能是public。道理和上面的有关联。故在 protected、private 或者 package-visible 的方法上使用 @Transactional 注解，它也不会报错，但事务无效。
    - 5.经过在ICORE-CLAIM中测试，效果如下：
        - A.抛出受查异常XXXException，事务会回滚。
        - B.抛出运行时异常NullPointerException，事务会回滚。
        - C.Quartz中，execute直接调用加了@Transactional方法，可以回滚；间接调用，不会回滚。（即上文3点提到的）
        - D.异步任务中，execute直接调用加了@Transactional方法，可以回滚；间接调用，不会回滚。（即上文3点提到的）
        - E.在action中加上@Transactional，不会回滚。切记不要在action中加上事务。
        - F.在service中加上@Transactional，如果是action直接调该方法，会回滚，如果是间接调，不会回滚。（即上文3提到的）
        - G.在service中的private加上@Transactional，事务不会回滚。
- D.@Transactional注解来自org.springframework.transaction.annotation包，而不是javax.transaction。
- E.对方法try-catch 对方法进行try-catch后 捕捉异常，则事物就失效了，如果既想try-catch又想事物回归怎么办呢？多个事务管理器的处理


### 二、REQUIRED与REQUIRED_NEW
上面描述的6种propagation属性配置中，最难以理解，并且容易在transaction设计时出现问题的是REQUIRED和REQURED_NEW这两者的区别。当程序在某些情况下抛出异常时，如果对于这两者不够了解，就可能很难发现而且解决问题。

下面我们给出三个场景进行分析：
场景一：
```java
ServiceA.java:
public class ServiceA {
    @Transactional
    public void callB() {
        serviceB.doSomething();
    }
}

ServiceB.java
public class ServiceB {
    @Transactional
    public void doSomething() {
        throw new RuntimeException("B throw exception");
    }
}
```

这种情况下，我们只需要在调用ServiceA.callB时捕获ServiceB中抛出的运行时异常，则transaction就会正常的rollback。

场景二
在保持场景一中ServiceB不变，在ServiceA中调用ServiceB的doSomething时去捕获这个异常，如下：
```java
public class ServiceA {
    @Transactional
    public void callB() {
        try {
            serviceB.doSomething();
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
        }
    }
}
```

这个时候，我们再调用ServiceA的callB。程序会抛出org.springframework.transaction.UnexpectedRollbackException: Transaction rolled back because it has been marked as rollback-only这样一个异常信息。原因是什么呢？
因为在ServiceA和ServiceB中的@Transactional propagation都采用的默认值：REQUREID。根据我们前面讲过的REQUIRED特性，当ServiceA调用ServiceB的时候，他们是处于同一个transaction中。如下图所示：


当ServiceB中抛出了一个异常以后，ServiceB会把当前的transaction标记为需要rollback。但是ServiceA中捕获了这个异常，并进行了处理，认为当前transaction应该正常commit。此时就出现了前后不一致，也就是因为这样，抛出了前面的UnexpectedRollbackException。

场景三
在保持场景二中ServiceA不变，修改ServiceB中方法的propagation配置为REQUIRES_NEW，如下：

```java
public class ServiceB {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void doSomething() {
        throw new RuntimeException("B throw exception");
    }
}
```

此时，程序可以正常的退出了，也没有抛出UnexpectedRollbackException。原因是因为当ServiceA调用ServiceB时，serviceB的doSomething是在一个新的transaction中执行的。如下图所示：

摘抄https://blog.csdn.net/gm371200587/java/article/details/79869449
