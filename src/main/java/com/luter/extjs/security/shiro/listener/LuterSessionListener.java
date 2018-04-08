package com.luter.extjs.security.shiro.listener;


import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.session.Session;

import javax.validation.constraints.NotNull;

@Slf4j
public class LuterSessionListener implements org.apache.shiro.session.SessionListener {
    private static final String SESSION_NAME = "";

    public void onStart(Session session) {
        log.info("session开始:{}", session.getId());
    }

    public void onStop(@NotNull final Session session) {
        log.info("session {} 被停止，从缓存中删除", session.getId());
    }

    public void onExpiration(@NotNull final Session session) {
        log.info("session {} 过期了，被停止，从缓存中删除", SESSION_NAME + session.getId());
    }
}
