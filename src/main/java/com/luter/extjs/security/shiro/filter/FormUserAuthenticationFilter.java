package com.luter.extjs.security.shiro.filter;

import com.luter.extjs.utils.model.DataModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.springframework.http.HttpStatus;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import static com.luter.extjs.utils.web.ResponseUtils.sendJsonResponse;


@Slf4j
public class FormUserAuthenticationFilter extends FormAuthenticationFilter {
    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject, ServletRequest request, ServletResponse response)
            throws Exception {
        log.info("登录成功");
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        sendJsonResponse(httpServletResponse, new DataModel("登录成功", subject.getSession().getId()));
        return true;
    }

    /**
     * 处理登入失败的方法
     */
    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        log.info("登录失败");
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        httpServletResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        sendJsonResponse(httpServletResponse, new DataModel<>().fail(500,"登录失败"));
        return false;
    }

    /**
     * 所有请求都会经过的方法。用来返回状态错误信息
     */
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        log.info("onAccessDenied：用户没登录，禁止访问");
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        sendJsonResponse(httpServletResponse, new DataModel<>().fail(401,"请登录"));
        return false;
    }

}
