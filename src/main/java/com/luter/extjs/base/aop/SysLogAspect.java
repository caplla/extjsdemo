package com.luter.extjs.base.aop;


import com.luter.extjs.base.service.BaseService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@Aspect
@Component
@Slf4j
public class SysLogAspect {

    @Autowired
    BaseService ss;

    @Pointcut("@annotation(com.luter.extjs.base.aop.SysLog)")
    public void annotationPointCut() {

    }

    @Before("annotationPointCut()")
    public void before(JoinPoint joinPoint) {
        log.debug("方法执行:{}", joinPoint.getSignature().getName());

    }

    @Around("annotationPointCut()")
    public Object Around(ProceedingJoinPoint point) throws Throwable {
        log.info("**********************全局访问日志记录开始********************");
        MethodSignature signature = (MethodSignature) point.getSignature();
        Method method = signature.getMethod();
        Class clazz = point.getTarget().getClass();
        log.info("执行类:{}\n执行方法方法:{}", clazz.toString(), method);
        SysLog asLog = method.getAnnotation(SysLog.class);
        String content = "";
        boolean saved = true;
        if (asLog != null) {
            log.info("操作:{}", asLog.content());
            content += asLog.content();
            saved = asLog.saved();
        }
        log.info("操作内容:{},保存日志:{}", content, saved);
        HttpServletRequest request = null;
        Object[] args = point.getArgs();
        Map<String, String> bodyParams = null;
        if (args != null && args.length > 0) {
            for (Object a : args) {
                if (null != a && a instanceof HttpServletRequest) {
                    request = (HttpServletRequest) a;
                }
                if (null != a && a instanceof LinkedHashMap) {
                    bodyParams = (Map<String, String>) a;
                }

            }
        }
        if (null != request && saved) {
            ss.log(request, content, "SYS", true);
        }
        log.info("**********************全局访问日志记录结束********************");
        return point.proceed();
    }

    @AfterReturning(value = "annotationPointCut()", returning = "returnValue")
    public void afterReturn(JoinPoint point, Object returnValue) {
        log.debug("@AfterReturning：模拟日志记录功能...");
        log.debug("@AfterReturning：目标方法为：" +
                point.getSignature().getDeclaringTypeName() +
                "." + point.getSignature().getName());
        log.debug("@AfterReturning：参数为：" +
                Arrays.toString(point.getArgs()));
        log.debug("@AfterReturning：返回值为：" + returnValue);
        log.debug("@AfterReturning：被织入的目标对象为：" + point.getTarget());
    }
//
//    @AfterThrowing("annotationPointCut()")
//    public void AfterThrowing(JoinPoint joinPoint) {
//
//    }
//
//    @After("annotationPointCut()")
//    public void After(JoinPoint joinPoint) {
//
//    }


}
