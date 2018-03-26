package com.luter.extjs.exception;


import com.luter.extjs.ext.ExtDataModel;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@ControllerAdvice
public class ExceptionHandlerController {
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ResponseBody
    public Object noRequestHandlerFoundExceptionHandler(HttpServletRequest request, HttpServletResponse response, NoHandlerFoundException e) {
//        log.error("404错误发生:", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.error("用户访问URI:{},访问的资源没找到，返回HttpStatus.NOT_FOUND" +
                ",错误信息:{}", request.getRequestURI(), e.getLocalizedMessage() + e.getCause());
        return new ExtDataModel<>().fail(HttpStatus.NOT_FOUND.value(), "没找到您要访问的资源", emsg);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(value = HttpStatus.METHOD_NOT_ALLOWED)
    @ResponseBody
    public Object HttpRequestMethodNotSupportedException(HttpServletRequest request, HttpServletResponse response, HttpRequestMethodNotSupportedException e) {
//        log.info("405错误发生：", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.info("用户访问URI:{},访问方法不被支持，比如GET/POST错误，" +
                "返回HttpStatus.METHOD_NOT_ALLOWED.错误信息:{}", request.getRequestURI(), e.getLocalizedMessage() + e.getCause());
        return new ExtDataModel().fail(HttpStatus.METHOD_NOT_ALLOWED.value(), "访问方法不被支持", emsg);
    }


    @ExceptionHandler(value = {ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Object ConstraintViolationExceptionHandler(HttpServletRequest request, HttpServletResponse response, ConstraintViolationException e) {
        log.error("发生错误\n", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.error("发生内部错误，违反唯一性约束。错误代码:{},错误内容:{}", 500, emsg);
        return new ExtDataModel().fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "处理发生错误，存在重复数据，请检查", emsg);
    }

    @ExceptionHandler(value = {Exception.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Object defaultErrorHandler(HttpServletRequest request, HttpServletResponse response, Exception e) {
        log.error("发生错误\n", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.error("发生内部错误，错误代码:{},错误内容:{}", 500, emsg);
        return new ExtDataModel().fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "处理发生错误，请检查", emsg);
    }


    @ExceptionHandler(value = {LuterException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Object defaultErrorHandler(HttpServletRequest request, HttpServletResponse response, LuterException e) {
        log.error("发生错误\n", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.error("发生内部错误，错误代码:{},错误内容:{}", 500, emsg);
        return new ExtDataModel().fail(e.getCode(), "处理发生错误，请检查", emsg);
    }

    @ExceptionHandler(value = {RuntimeException.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Object RuntimeException(HttpServletRequest request, HttpServletResponse response, Exception e) {
        log.error("发生错误\n", e);
        String emsg = e.getLocalizedMessage() + "." + (null != e.getCause() ? e.getCause().getMessage() : "");
        log.error("发生内部错误，错误代码:{},错误内容:{}", 500, emsg);
        return new ExtDataModel().fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "处理发生错误，请检查", emsg);
    }

}
