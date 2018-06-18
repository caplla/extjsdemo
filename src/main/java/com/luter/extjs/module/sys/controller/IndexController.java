package com.luter.extjs.module.sys.controller;

import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

@Controller
@Slf4j
public class IndexController extends BaseController {

    @Autowired
    BaseService ss;

    @GetMapping({"", "/", "/index"})
    public String index(ModelMap modelMap, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            modelMap.put("user", ss.getCurrentUser());
            modelMap.putAll(getSysConfig());
            return "index";
        }
        redirectAttributes.addFlashAttribute("message", "请登录");
        return "redirect:login";
    }

    @GetMapping("/login")
    public String toLogin(ModelMap modelMap,HttpServletRequest request, RedirectAttributes redirectAttributes) {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            return "redirect:index";
        }
        modelMap.putAll(getSysConfig());
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
            return ResponseUtils.ok("成功");
        }
        throw new UnauthorizedException("请登录啊");
    }

    @PostMapping("/logout")
    @ResponseBody
    public Object logout(HttpServletRequest request) {
        Subject subject = SecurityUtils.getSubject();
        if (subject.isAuthenticated()) {
            subject.logout();
        }
        return ResponseUtils.ok("成功");
    }
}

