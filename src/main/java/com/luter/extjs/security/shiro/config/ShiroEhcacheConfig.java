package com.luter.extjs.security.shiro.config;


import com.luter.extjs.security.service.SecurityService;
import com.luter.extjs.security.shiro.endecrypt.RetryLimitHashedCredentialsMatcher;
import com.luter.extjs.security.shiro.filter.PermsAuthorizationFilter;
import com.luter.extjs.security.shiro.listener.LuterSessionListener;
import com.luter.extjs.security.shiro.realm.UserRealm;
import com.luter.extjs.security.shiro.session.SessionIDGenerator;
import com.luter.extjs.utils.json.JacksonUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.session.SessionListener;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.filter.DelegatingFilterProxy;

import javax.annotation.Resource;
import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
@Slf4j
public class ShiroEhcacheConfig {
    @Resource
    SecurityService ss;
    static String shiro_session_prefix = "luter";

    @Bean(name = "lifecycleBeanPostProcessor")
    public static LifecycleBeanPostProcessor getLifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();
        defaultAdvisorAutoProxyCreator.setProxyTargetClass(true);
        return defaultAdvisorAutoProxyCreator;

    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
        filterRegistration.setFilter(new DelegatingFilterProxy("shiroFilter"));
        filterRegistration.setEnabled(true);
        filterRegistration.addUrlPatterns("/*");
        filterRegistration.setDispatcherTypes(DispatcherType.REQUEST);
        return filterRegistration;
    }

    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shirFilter() {
        log.info("开始设置shiro............");
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        shiroFilterFactoryBean.setSecurityManager(securityManager());
        Map<String, Filter> filters = new LinkedHashMap<>();
        filters.put("perms", new PermsAuthorizationFilter());
        filters.put("anon", new AnonymousFilter());
        shiroFilterFactoryBean.setFilters(filters);//注册自定义的拦截器
        shiroFilterFactoryBean.setLoginUrl("/login");
        shiroFilterFactoryBean.setSuccessUrl("/index");
        shiroFilterFactoryBean.setUnauthorizedUrl("/login");
        //拦截器.
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        Map<String, String> dbperm = ss.loadFilterChainDefinitions();
        log.info("加载到的权限:{}", JacksonUtil.mapToJon(dbperm));
        filterChainDefinitionMap.putAll(dbperm);
        //这玩意必须在最后面
        filterChainDefinitionMap.put("/**", "anon");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }

    @Bean(name = "securityManager")
    public DefaultWebSecurityManager securityManager() {
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setRealm(userRealm());
        manager.setSessionManager(sessionManager());
        return manager;
    }


    @Bean
    public DefaultWebSessionManager sessionManager() {
        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
        sessionManager.setGlobalSessionTimeout(43200000 * 10);//120小时
        sessionManager.getSessionIdCookie().setHttpOnly(true);
        sessionManager.setSessionValidationSchedulerEnabled(true);
        sessionManager.setDeleteInvalidSessions(true);
        sessionManager.setSessionIdCookie(sessionIdCookie());
        sessionManager.setSessionIdCookieEnabled(true);
        sessionManager.setSessionDAO(sessionDAO());
        List<SessionListener> listeners = new ArrayList<>();
        listeners.add(new LuterSessionListener());
        sessionManager.setSessionListeners(listeners);
        return sessionManager;
    }

    @Bean
    public SimpleCookie sessionIdCookie() {
        SimpleCookie simpleCookie = new SimpleCookie();
        simpleCookie.setName("luter_token");
        return simpleCookie;
    }

    @Bean
    public EnterpriseCacheSessionDAO sessionDAO() {
        EnterpriseCacheSessionDAO redisSessionDAO = new EnterpriseCacheSessionDAO();
        redisSessionDAO.setSessionIdGenerator(sessionIDGenerator());
        return redisSessionDAO;
    }

    @Bean(name = "sessionIDGenerator")
    public SessionIDGenerator sessionIDGenerator() {
        SessionIDGenerator sessionIDGenerator = new SessionIDGenerator();
        sessionIDGenerator.setSession_prefix(shiro_session_prefix);
        return sessionIDGenerator;
    }

    @Bean(name = "userRealm")
    @DependsOn(value = "lifecycleBeanPostProcessor")
    public UserRealm userRealm() {
        UserRealm myShiroRealm = new UserRealm();
        myShiroRealm.setCredentialsMatcher(retryLimitHashedCredentialsMatcher());
        myShiroRealm.setCachingEnabled(false);//禁止用户权限的缓存，每次用户操作都会重读数据库
        return myShiroRealm;
    }

    @Bean
    public RetryLimitHashedCredentialsMatcher retryLimitHashedCredentialsMatcher() {
        RetryLimitHashedCredentialsMatcher r = new RetryLimitHashedCredentialsMatcher();
        r.setHashAlgorithmName("md5");
        r.setHashIterations(100);//密码加密了几次?
        r.setStoredCredentialsHexEncoded(true);
        return r;
    }

    @Bean
    @ConditionalOnMissingBean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager());
        return authorizationAttributeSourceAdvisor;
    }

}
