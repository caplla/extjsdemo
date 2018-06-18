package com.luter.extjs.security.service;


import com.luter.extjs.entity.sys.TSResource;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.repo.ResourceRepository;
import com.luter.extjs.security.repo.UserReposiroty;
import com.luter.extjs.security.shiro.filter.PermsAuthorizationFilter;
import com.luter.extjs.utils.json.JacksonUtil;
import com.luter.extjs.utils.web.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.filter.mgt.DefaultFilterChainManager;
import org.apache.shiro.web.filter.mgt.PathMatchingFilterChainResolver;
import org.apache.shiro.web.servlet.AbstractShiroFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.Filter;

@Slf4j
@Service
public class SecurityServiceImpl implements SecurityService {

    @Autowired
    UserReposiroty userReposiroty;

    @Autowired
    ResourceRepository resourceRepository;

    @Override
    public TSUser findUserByUsername(String username) {
        return userReposiroty.findTSUserByUsername(username);
    }

    @Override
    public List<TSResource> getAllPerms() {
        return resourceRepository.getAllPerms();
    }

    @Override
    public List<TSResource> getUsersPerms(String uid) {
        return resourceRepository.getUserPerms(uid);
    }

    @Override
    public Map<String, String> loadFilterChainDefinitions() {
        // 权限控制map.从数据库获取
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        List<TSResource> resourcesList = resourceRepository.getAllPerms();
        if (null != resourcesList && resourcesList.size() > 0) {
            log.info("获取系统所有权限，总数:{},现在开始导入权限...", resourcesList.size());
            for (TSResource tsPerm : resourcesList) {
                if (StringUtils.isNotEmpty(tsPerm.getUri()) && StringUtils.isNotEmpty(tsPerm.getPerm())) {
                    log.info("获取到的系统权限,名称:{},URI:{},perms:{}", tsPerm.getName(), tsPerm.getUri(), tsPerm.getPerm());
                    String permission = "authc,perms[" + tsPerm.getPerm() + "]";
                    String uri = tsPerm.getUri().startsWith("/") ? tsPerm.getUri() : "/" + tsPerm.getUri();
                    filterChainDefinitionMap.put(uri, permission);
                }
            }

        } else {
            log.warn("数据库中没有配置任何权限>>.....");
        }
        filterChainDefinitionMap.put("/static/**", "anon");
        filterChainDefinitionMap.put("/favicon.ico", "anon");
        filterChainDefinitionMap.put("/**", "anon");
        return filterChainDefinitionMap;
    }

    @Override
    public void updatePermission() {
        ShiroFilterFactoryBean shiroFilterFactoryBean = SpringUtil.getBean(ShiroFilterFactoryBean.class);
        if (null == shiroFilterFactoryBean) {
            log.error("shiroFilterFactoryBean获取失败...");
            return;
        }
        synchronized (shiroFilterFactoryBean) {
            log.info("开始重载shiro的权限filter定义...");
            AbstractShiroFilter shiroFilter;
            try {
                shiroFilter = (AbstractShiroFilter) shiroFilterFactoryBean.getObject();
            } catch (Exception e) {
                throw new RuntimeException(
                        "获取shiro filter定义参数异常!");
            }
            PathMatchingFilterChainResolver filterChainResolver = (PathMatchingFilterChainResolver) shiroFilter.getFilterChainResolver();
            DefaultFilterChainManager manager = (DefaultFilterChainManager) filterChainResolver.getFilterChainManager();
            // 清空老的权限控制
            manager.getFilterChains().clear();//这个就把权限拦截器清理了
            //把自定义拦截加入
            Map<String, Filter> filters = new LinkedHashMap<>();
            filters.put("anon", new AnonymousFilter());
            filters.put("perms", new PermsAuthorizationFilter());
            shiroFilterFactoryBean.setFilters(filters);
            shiroFilterFactoryBean.getFilterChainDefinitionMap().clear();//这个把perms清理了
            log.info("after clear:{}", JacksonUtil.mapToJon(shiroFilterFactoryBean.getFilterChainDefinitionMap()));
            Map<String, String> data = loadFilterChainDefinitions();
            log.info("数据库里的权限:{}", JacksonUtil.mapToJon(data));
            // 重新构建生成
            manager.getFilterChains().remove("/**");
            shiroFilterFactoryBean.setFilterChainDefinitionMap(data);
            Map<String, String> chains = shiroFilterFactoryBean.getFilterChainDefinitionMap();
            for (Map.Entry<String, String> entry : chains.entrySet()) {
                String url = entry.getKey();
                String chainDefinition = entry.getValue().trim().replace(" ", "");
                log.info("权限添加:url:{},chain:{}", url, chainDefinition);
                manager.createChain(url, chainDefinition);
            }
            manager.createChain("/**", "anon");
            log.info("重新载入shiro权限成功，当前权限:{}", JacksonUtil.mapToJon(shiroFilterFactoryBean.getFilterChainDefinitionMap()));
        }
    }
}
