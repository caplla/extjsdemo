package com.luter.extjs.security.shiro.endecrypt;


import lombok.extern.log4j.Log4j;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;

@Log4j
public class RetryLimitHashedCredentialsMatcher extends HashedCredentialsMatcher {
    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        String username = (String) token.getPrincipal();
        log.info("开始验证用户口令,用户:" + username);
        boolean matches = super.doCredentialsMatch(token, info);
        return matches;
    }
}
