package com.luter.extjs.module.sys.controller;

import com.luter.extjs.entity.base.BaseEntity;
import com.luter.extjs.util.ext.ExtDataModel;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

@Controller
@Slf4j
public class IndexController extends BaseEntity {

    @GetMapping({"", "/", "/index"})
    public String index(HttpServletRequest request, RedirectAttributes redirectAttributes) {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            return "index";
        }
        redirectAttributes.addFlashAttribute("message", "请登录");
        return "redirect:login";
    }

    @GetMapping("/login")
    public String toLogin(HttpServletRequest request) {
        return "login";
    }

    @PostMapping("/login")
    @ResponseBody
    public Object login(HttpServletRequest request) {
        String username = ServletRequestUtils.getStringParameter(request, "username", "");
        String password = ServletRequestUtils.getStringParameter(request, "password", "");
        UsernamePasswordToken token = new UsernamePasswordToken(username, password);
        Subject subject = SecurityUtils.getSubject();
        log.info("开始执行登录.......");
        subject.login(token);
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isAuthenticated()) {
            return new ExtDataModel<>().ok("ok");
        }
        throw  new UnauthorizedException("请登录");
    }

    @PostMapping("/logout")
    @ResponseBody
    public Object logout(HttpServletRequest request) {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            subject.logout();
        }
        return "ok";
    }

}
