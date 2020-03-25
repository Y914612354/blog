---
title: rsa对接口的内容加密解密
date: 2020-03-25
tags:
  - spring
categories:
  - 后端
---

企业开发中，很多公司要求数据加密，今天就解决一下数据加密的问题
<!-- more -->

## 什么是rsa


## springboot中使用rsa

自行安装`lombok`等插件

添加相应依赖
```xml
 <dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
</dependency>
```


创建`annotation`目录

创建`Decrypt`
```java
import java.lang.annotation.*;

/**
 * @author wangjiahao
 * @date 2020/3/23
 **/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Decrypt{

}
```



创建`EnableSecurity`

```java
import com.inisfree.zone.aop.EncryptRequestBodyAdvice;
import com.inisfree.zone.aop.EncryptResponseBodyAdvice;
import com.inisfree.zone.configure.SecretKeyConfig;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

/**
 * @author wangjiahao
 * @date 2020/3/23
 **/
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
@Import({SecretKeyConfig.class,
        EncryptResponseBodyAdvice.class,
        EncryptRequestBodyAdvice.class})
public @interface EnableSecurity{

}


```
创建`Encrypt`
```java
import java.lang.annotation.*;

/**
 * @author wangjiahao
 * @date 2020/3/23
 **/
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Encrypt{

}

```

创建`aop`目录

创建以下文件

```java
import com.inisfree.zone.utils.Base64Util;
import com.inisfree.zone.utils.RSAUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

/**
 * @author wangjiahao
 * @date 2020/3/23
 **/
@Slf4j
public class DecryptHttpInputMessage implements HttpInputMessage {

    private HttpHeaders headers;

    private InputStream body;

    public DecryptHttpInputMessage(HttpInputMessage inputMessage, String privateKey, String charset, boolean showLog) throws Exception {

        if (StringUtils.isEmpty(privateKey)) {
            throw new IllegalArgumentException("privateKey is null");
        }

        this.headers = inputMessage.getHeaders();
        String content = new BufferedReader(new InputStreamReader(inputMessage.getBody()))
                .lines().collect(Collectors.joining(System.lineSeparator()));
        String decryptBody;
        if (content.startsWith("{")) {
            log.info("Unencrypted without decryption:{}", content);
            decryptBody = content;
        } else {
            StringBuilder json = new StringBuilder();
            content = content.replaceAll(" ", "+");

            if (!StringUtils.isEmpty(content)) {
                String[] contents = content.split("\\|");
                for (String value : contents) {
                    value = new String(RSAUtil.decrypt(Base64Util.decode(value), privateKey), charset);
                    json.append(value);
                }
            }
            decryptBody = json.toString();
            if(showLog) {
                log.info("Encrypted data received：{},After decryption：{}", content, decryptBody);
            }
        }
        this.body = new ByteArrayInputStream(decryptBody.getBytes());
    }

    @Override
    public InputStream getBody(){
        return body;
    }

    @Override
    public HttpHeaders getHeaders() {
        return headers;
    }
}
```

```java
import com.inisfree.zone.annotation.Decrypt;
import com.inisfree.zone.configure.SecretKeyConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdvice;

import java.lang.reflect.Type;

/**
 * @author wangjiahao
 * @date 2020/3/23
 **/
@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class EncryptRequestBodyAdvice  implements RequestBodyAdvice {

    private boolean encrypt;

    private final SecretKeyConfig secretKeyConfig;

    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        if (methodParameter.getMethod().isAnnotationPresent(Decrypt.class) && secretKeyConfig.isOpen()) {
            encrypt = true;
        }
        return encrypt;
    }

    @Override
    public Object handleEmptyBody(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        return body;
    }

    @Override
    public HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter, Type targetType,
                                           Class<? extends HttpMessageConverter<?>> converterType){
        if (encrypt) {
            try {
                return new DecryptHttpInputMessage(inputMessage, secretKeyConfig.getPrivateKey(), secretKeyConfig.getCharset(),secretKeyConfig.isShowLog());
            } catch (Exception e) {
                log.error("Decryption failed", e);
            }
        }
        return inputMessage;
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType,
                                Class<? extends HttpMessageConverter<?>> converterType) {
        return body;
    }
}
```





```java
import com.alibaba.fastjson.JSON;
import com.inisfree.zone.annotation.Encrypt;
import com.inisfree.zone.configure.SecretKeyConfig;
import com.inisfree.zone.utils.Base64Util;
import com.inisfree.zone.utils.RSAUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * @author Bobby
 * @date 2019/4/9
 **/
@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class EncryptResponseBodyAdvice implements ResponseBodyAdvice<Object> {

    private boolean encrypt;
    private final SecretKeyConfig secretKeyConfig;

    private static ThreadLocal<Boolean> encryptLocal = new ThreadLocal<>();

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        encrypt = false;
        if (returnType.getMethod().isAnnotationPresent(Encrypt.class) && secretKeyConfig.isOpen()) {
            encrypt = true;
        }
        return encrypt;
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        // EncryptResponseBodyAdvice.setEncryptStatus(false);
        // Dynamic Settings Not Encrypted
        Boolean status = encryptLocal.get();
        if (null != status && !status) {
            encryptLocal.remove();
            return body;
        }
        if (encrypt) {
            String publicKey = secretKeyConfig.getPublicKey();
            try {
                String content = JSON.toJSONString(body);
                if (!StringUtils.hasText(publicKey)) {
                    throw new NullPointerException("Please configure rsa.encrypt.privatekeyc parameter!");
                }
                byte[] data = content.getBytes();
                byte[] encodedData = RSAUtil.encrypt(data, publicKey);
                String result = Base64Util.encode(encodedData);
                if(secretKeyConfig.isShowLog()) {
                    log.info("Pre-encrypted data：{}，After encryption：{}", content, result);
                }
                return result;
            } catch (Exception e) {
                log.error("Encrypted data exception", e);
            }
        }
        return body;
    }
}
```

```java
import lombok.Data;

/**
 * @author wangjiahao
 * @date 2020/3/23
 */
@Data
public class TestBean {
    private String name;
    private int age;
}
```


添加controller

```java
import com.inisfree.zone.annotation.Decrypt;
import com.inisfree.zone.annotation.Encrypt;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * @author wangjiahao
 * @date 2020/3/23
 */
@Slf4j
@RequestMapping("test")
@RestController
public class TestController {

    /**
     * 响应数据 加密
     */
    @GetMapping()
    @Encrypt
    @Decrypt
    public TestBean sendResponseEncryData() {
        TestBean testBean = new TestBean();
        testBean.setName("shuibo.cn");
        testBean.setAge(18);
        return testBean;
    }

    /**
     * 获取 解密后的 请求参数
     */
    @PostMapping()
    @Encrypt
    @Decrypt
    public String getRequestData(@RequestBody TestBean testBean) {
        return testBean.toString();
    }

}
```

创建utils文件
```java
import javax.crypto.Cipher;
import java.io.ByteArrayOutputStream;
import java.security.Key;
import java.security.KeyFactory;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * @author wangjiahao
 * @date 2020/3/23
 */
public class RSAUtil{

    /**
     * encryption algorithm RSA
     */
    public static final String KEY_ALGORITHM = "RSA";

    /**
     * RSA Maximum Encrypted Plaintext Size
     */
    private static final int MAX_ENCRYPT_BLOCK = 117;

    /**
     * RSA Maximum decrypted ciphertext size
     */
    private static final int MAX_DECRYPT_BLOCK = 256;

    /**
     * encryption
     * @param data data
     * @param publicKey publicKey
     * @return byte
     * @throws Exception Exception
     */
    public static byte[] encrypt(byte[] data, String publicKey)
            throws Exception {
        byte[] keyBytes = Base64Util.decode(publicKey);
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key publicK = keyFactory.generatePublic(x509KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.ENCRYPT_MODE, publicK);
        int inputLen = data.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache;
        int i = 0;
        // Sectional Encryption of Data
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
                cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(data, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * MAX_ENCRYPT_BLOCK;
        }
        byte[] encryptedData = out.toByteArray();
        out.close();
        return encryptedData;
    }

    /**
     * Decrypt
     * @param text text
     * @param privateKey privateKey
     * @return byte
     * @throws Exception Exception
     */
    public static byte[] decrypt(byte[] text, String privateKey)
            throws Exception {
        byte[] keyBytes = Base64Util.decode(privateKey);
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
        Key privateK = keyFactory.generatePrivate(pkcs8KeySpec);
        Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
        cipher.init(Cipher.DECRYPT_MODE, privateK);
        int inputLen = text.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache;
        int i = 0;
        // Sectional Encryption of Data
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
                cache = cipher.doFinal(text, offSet, MAX_DECRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(text, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * MAX_DECRYPT_BLOCK;
        }
        byte[] decryptedData = out.toByteArray();
        out.close();
        return decryptedData;
    }
}
```

```java
import org.apache.commons.codec.binary.Base64;

/**
 * @author wangjiahao
 * @date 2020/3/23
 */
public class Base64Util{

    /**
     * Decoding to binary
     * @param base64 base64
     * @return byte
     * @throws Exception Exception
     */
    public static byte[] decode(String base64) throws Exception {
        return Base64.decodeBase64(base64);
    }

    /**
     * Binary encoding as a string
     * @param bytes byte
     * @return String
     * @throws Exception Exception
     */
    public static String encode(byte[] bytes) throws Exception {
        return new String(Base64.encodeBase64(bytes));
    }
}
```

