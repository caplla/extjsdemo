package com.luter.extjs.security.service;


import com.luter.extjs.entity.sys.TSResource;
import com.luter.extjs.entity.sys.TSUser;

import java.util.List;
import java.util.Map;

public interface SecurityService {
    /**
     * 根据用户名找到唯一用户
     *
     * @param username the username
     * @return the ts user
     */
    TSUser findUserByUsername(String username);

    /**
     * 获取系统内所有权限
     *
     * @return the all perms
     */
    List<TSResource> getAllPerms();

    /**
     * 根据用户ID获取这个用户的所有权限
     *
     * @param uid the uid
     * @return the users perms
     */
    List<TSResource> getUsersPerms(String uid);

    /**
     * 加载系统权限过滤链
     *
     * @return the map
     */
    Map<String, String> loadFilterChainDefinitions();

    /**
     * 重载系统权限过滤链，在资源变化后执行，即时生效。
     */
    void updatePermission();
}
