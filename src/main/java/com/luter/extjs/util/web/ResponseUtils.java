package com.luter.extjs.util.web;


import com.luter.extjs.util.json.JacksonUtils;
import lombok.extern.log4j.Log4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 请求和响应工具类
 */
@Log4j
public class ResponseUtils {
    public static Boolean isAjax(HttpServletRequest request) {
        String headerB = request.getHeader("XMLHttpRequest");
        boolean result = (headerB != null && headerB.equalsIgnoreCase("X-Requested-With"));
        log.info("请求类型判断:XMLHttpRequest:" + headerB + ",result:" + result);
        return result;
    }

    /**
     * 判断一个请求是否是json请求
     *
     * @param request the request
     * @return the boolean
     */
    public static Boolean isJson(HttpServletRequest request) {
        String header = request.getHeader("Accept");
        String headerA = request.getHeader("Content-Type");
        String headerB = request.getHeader("XMLHttpRequest");
        boolean result = (header != null && header.contains("json")) ||
                headerA != null && headerA.contains("json") ||
                headerB != null && headerB.equalsIgnoreCase("X-Requested-With");
        log.info("请求类型判断=Accept:" + header + ",Content-Type:" + headerA + ",XMLHttpRequest:" + headerB + ",result:" + result);
        return result;
    }


    /**
     * 往客户端响应json格式消息
     *
     * @param response the response
     * @param data     the data
     */
    public static void sendJsonResponse(HttpServletResponse response, Object data) {
        String jsonStr = data instanceof String ? data.toString() : JacksonUtils.objectToJson(data);
        log.debug("send Json to clint:\n" + jsonStr);
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            writer.write(jsonStr);
            writer.flush();
            writer.close();
        } catch (IOException e1) {
            e1.printStackTrace();
        } finally {
            if (null != writer) {
                writer.close();
            }
        }
    }

}
