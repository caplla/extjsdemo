package com.luter.extjs.security.shiro.filter;


import com.luter.extjs.utils.model.DataModel;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter;
import org.springframework.http.HttpStatus;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class PermsAuthorizationFilter extends PermissionsAuthorizationFilter {
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws IOException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        log.error("访问:" + httpServletRequest.getRequestURI() + ",perms权限验证拒绝，开始处理");
        Subject subject = this.getSubject(request, response);
        HttpStatus status = HttpStatus.FORBIDDEN;
        String message = "您不具备访问资源地址:" + httpServletRequest.getRequestURI() + "的的权限,";
        if (subject.getPrincipal() == null) {
            status = HttpStatus.UNAUTHORIZED;
            message = "请登录后操作";
        }
        httpServletResponse.setStatus(status.value());//设置请求返回status
        ResponseUtils.sendJsonResponse(httpServletResponse, new DataModel<>().fail(status.value(), message, status.getReasonPhrase()));//返回错误消息
        return false;
    }

}
