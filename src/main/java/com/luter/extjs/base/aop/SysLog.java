package com.luter.extjs.base.aop;

import java.lang.annotation.*;


@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SysLog {
    /**
     * 日志内容
     *
     * @return the string
     */
    String content() default "";

    /**
     * 是否保存到数据库
     *
     * @return
     */
    boolean saved() default true;
}
