package com.luter.extjs.base.controller;

import com.luter.extjs.entity.sys.TSUser;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

public abstract class BaseController {
    public TSUser getCurrentUser() {
        TSUser user = null;
        Subject subject = SecurityUtils.getSubject();
        if (null != subject.getPrincipal()) {
            user = (TSUser) subject.getPrincipal();
        }
        return user;
    }
}
