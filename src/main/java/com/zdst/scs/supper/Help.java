package com.zdst.scs.supper;

import java.io.IOException;
import java.lang.reflect.Array;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * Created by lxh on 2018/9/4.
 */
public class Help {
    private static Logger logger = LoggerFactory.getLogger(Help.class);

    //计算日期向前推是负数  后是正数
    public static Date getDateAddDays(Date date, int add_days) {
        Calendar time = Calendar.getInstance();
        time.setTime(date);
        time.add(5, add_days);
        return time.getTime();
    }
    public static String callHttpServer(String json, String url) {
        String result = "";
        CloseableHttpClient httpclient = null;
        CloseableHttpResponse response = null;
        try {
            logger.info("http request :" + json);
            logger.info("http request url:" + url);
            httpclient = HttpClients.createDefault();
            HttpPost httppost = new HttpPost(url);

            httppost.setHeader("Content-Type", "text/xml; charset=utf-8");
            httppost.setHeader("Expect", "100-continue");
            httppost.setHeader("Accept-Encoding", "gzip,deflate");
            httppost.setHeader("Connection", "Keep-Alive");

            //如果json 为null，会出现异常
            if (null != json) {
                StringEntity stringEntity = new StringEntity(json, "utf-8");
                stringEntity.setContentEncoding("UTF-8");
                stringEntity.setContentType("application/json");
                httppost.setEntity(stringEntity);
            }

            response = httpclient.execute(httppost);
            HttpEntity entity = response.getEntity();

            if (entity != null) {
                int status = response.getStatusLine().getStatusCode();
                if ((status >= 200 && status < 300)) {
                    result = EntityUtils.toString(entity);
                    logger.info("RqWlwCommService!!!:{}" + result);
                    System.out.println("RqWlwCommService" + result);
                } else {
                    result = null;
                    logger.error("call http service faild status" + status);
                }
            }
        } catch (Exception ex) {
            logger.error("call http service error:{}", ex);
            result = null;
            ex.printStackTrace();
        } finally {
            if (null != response) {
                try {
                    response.close();
                } catch (IOException e) {
                    logger.error("call http service response close error:{}", e);
                    e.printStackTrace();
                }
            }
        }
        return result;
    }


    public static boolean isNull(Object object) {
        if (null == object) {
            return true;
        }
        if (object instanceof String) {
            return ("null".equals(((String) object).trim()) || "".equals(((String) object).trim()));
        } else if (object instanceof Set) {
            return ((Set) object).isEmpty();
        } else if (object instanceof Map) {
            return ((Map) object).isEmpty();
        } else if (object instanceof List) {
            return ((List) object).isEmpty();
        } else if (object.getClass().isArray()) {
            int list = Array.getLength(object);
            if (list <= 0) {
                return true;
            }
            /* update by zhm 这里有个对象类型 跟基本类型的区别 导致不能转换
             * Object[] objArray = (Object[]) object;
            if (objArray.length == 0) {
                return true;
            }*/
        }
        return false;
    }

    public static boolean isNotNull(Object object) {
        return !isNull(object);
    }


    //获取md5加密字符串
    public static String getMd5(String plainText) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(plainText.getBytes());
            byte b[] = md.digest();

            int i;

            StringBuffer buf = new StringBuffer("");
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }
            //32位加密
            return buf.toString();
            // 16位的加密
            //return buf.toString().substring(8, 24);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    //获取md5两次加密字符串
    public static String getMd5Twice(String plainText) {
        return getMd5(getMd5(plainText));
    }


    /**
     * 判断target是否存在于boss字符串中
     *
     * @param boss   (.. , .. , ..)
     * @param target (..)
     * @return
     */
    public static boolean hasContain(String boss, String target) {
        boolean flag = false;
        if (isNull(boss) || isNull(target)) {
            return flag;
        }
        if (("," + boss + ",").indexOf("," + target + ",") >= 0) {
            flag = true;
        }

        return flag;
    }

    /**
     * 判断target是否存在于boss字符串中
     *
     * @param boss          (.. , .. , ..)
     * @param target        (..)
     * @param caseSensitive 是否区分大小写
     * @return
     */
    public static boolean hasContain(String boss, String target, boolean caseSensitive) {
        boolean flag = false;
        if (isNull(boss) || isNull(target)) {
            return flag;
        }
        if (caseSensitive) {
            boss = boss.toLowerCase();
            target = target.toLowerCase();
        }
        if (("," + boss + ",").indexOf("," + target + ",") >= 0) {
            flag = true;
        }

        return flag;
    }

    /**
     * 字符串增加内容
     *
     * @param target
     * @param content
     * @param checkExsit true 排除已经存在的
     * @return
     */
    public static StringBuffer append(StringBuffer target, String content,
                                      boolean checkExsit) {
        if (checkExsit) {
            boolean flag = false;
            if (isNotNull(target)) {
                flag = hasContain(target.toString(), content);
            }
            if (!flag) {
                if (isNotNull(target)) {
                    target.append("," + content);
                } else {
                    target.append(content);
                }
            }
        } else {
            if (isNotNull(target)) {
                target.append("," + content);
            } else {
                target.append(content);
            }
        }

        return target;
    }

    /**
     * 判断对象是否存在， 如果存在返回自己， 如果不存在 返回not
     *
     * @param target
     * @param not
     * @return
     */
    public static Object exsitOrNot(Object target, Object not) {
        if (isNotNull(target)) {
            return target;
        }
        return not;
    }


    /**
     * myql模糊查询转义通配符：%和_
     * @param str
     * @return
     */
    public static String escapeStr(String str) {
        String temp = "";
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == '%' || str.charAt(i) == '_') {
                temp += "\\" + str.charAt(i);
            } else {
                temp += str.charAt(i);
            }
        }
        return temp;
    }

    /**
     * 判断是否为数字
     * @param str
     * @return
     */
    public static boolean isNumeric(String str){
        for (int i = str.length();--i>=0;){
            if (!Character.isDigit(str.charAt(i))){
                return false;
            }
        }
        return true;
    }

    /**
     * 判断字符串是否为数字和小数
     *
     * @param str
     * @return
     */
    public static boolean isNumericDouble(String str) {
        Pattern pattern = Pattern.compile("-?[0-9]+.?[0-9]+");
        Matcher isNum = pattern.matcher(str);
        if (!isNum.matches()) {
            return false;
        }
        return true;
    }
}
