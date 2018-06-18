package com.luter.extjs.utils.web;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {
    public static void info(HttpServletRequest request) {
        if (null != request) {
            StringBuilder params = new StringBuilder();
            int index = 0;
            for (Object param : request.getParameterMap().keySet()) {
                params.append((index++ == 0 ? "" : "&") + param + "=");
                params.append(request.getParameter((String) param));
            }
            System.out.println("==================***********请求日志**************=================");
            System.out.println("访问URI:" + request.getRequestURI());
            System.out.println("请求参数:" + params.toString());
            System.out.println("User-Agent:" + request.getHeader("User-Agent"));
            System.out.println("浏览器类型:" + BrowserUtils.checkBrowse(request));
            System.out.println("Request Method:" + request.getMethod());
            System.out.println("Request Method:" + request.getMethod());
            System.out.println("==================***********请求日志**************=================");

        }
    }
}
