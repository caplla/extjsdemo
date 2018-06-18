package com.luter.extjs.utils.data;

import org.apache.commons.lang3.StringUtils;

import java.util.Date;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * 这里写说明
 *
 * @auther Luter.in
 * @date Created on 2018-05-09
 */
public class ValidateUtils {
    /**
     * Gets random number.
     *
     * @param length the length
     * @return the random number
     */
    public static String getRandomNumber(int length) {
        String code = "";
        Random r = new Random(new Date().getTime());
        for (int i = 0; i < length; i++) {
            code = code + r.nextInt(10);
        }

        return code;
    }


    /**
     *判断是不是合法手机号
     *
     * @param mobile 手机号
     * @return 是则返回true，不是返回false
     */
    public static boolean isMobile(String mobile) {
        if (StringUtils.isNotEmpty(mobile)) {
            Pattern p = Pattern
                    .compile("^1[345678]\\d{9}$");
            Matcher m = p.matcher(mobile);
            return m.matches();
        }
        return false;
    }

    /**
     * Is email boolean.
     *
     * @param email the email
     * @return the boolean
     */
    public static Boolean isEmail(String email) {
        if (StringUtils.isNotEmpty(email)) {
            String check = "^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
            Pattern regex = Pattern.compile(check);
            Matcher matcher = regex.matcher(email);
            return matcher.matches();
        }
        return false;

    }

    /**
     * Is password boolean.
     *
     * @param password the password
     * @return the boolean
     */
    public static boolean isPassword(String password) {
        if (StringUtils.isNotEmpty(password)) {
            Pattern p = Pattern
                    .compile("^[a-zA-Z]\\w{5,17}$");
            Matcher m = p.matcher(password);
            return m.matches();
        }
        return false;
    }

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     */
    public static void main(String[] args) {

        if (isMobile("17700230022")) {
            System.out.println("手机号码");
        } else {
            System.out.println("不是手机号码");
        }
    }
}
