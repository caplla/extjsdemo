package com.luter.extjs.security.shiro.session;


import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionIdGenerator;

import java.io.Serializable;

@Slf4j
public class SessionIDGenerator implements SessionIdGenerator {
    public String session_prefix;

    public String getSession_prefix() {
        return session_prefix;
    }

    public void setSession_prefix(String session_prefix) {
        this.session_prefix = session_prefix;
    }

    @Override
    public Serializable generateId(Session session) {
        String sid = "session_" + getSession_prefix() +"|"+ java.util.UUID.randomUUID().toString();
        log.info("产生sessionID:" + sid);
        return sid;
    }
}
