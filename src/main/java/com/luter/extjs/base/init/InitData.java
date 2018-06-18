package com.luter.extjs.base.init;


import com.luter.extjs.base.config.R;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.entity.sys.*;
import com.luter.extjs.security.shiro.endecrypt.UserEndecrypUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class InitData implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    BaseService ss;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        log.info("系统启动，可以在启动过程中做一些事情，此时server已经注入");
        if (ss.countAll(TSUser.class) > 0) {
            log.info("系统存在用户，不做处理");
        } else {
            log.info("系统中没有任何用户，开始新增默认账号");
            TSUser user = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password("admin", "aaaaaa");
            user.setLocked(false);
            user.setReserved(true);
            ss.save(user);
        }

        if (ss.countAll(TSResource.class) > 0) {
            log.info("系统资源存在，不做处理");
        } else {
            log.info("系统资源为空，默认加入系统管理及其资源管理角色管理");
            TSResource sys = new TSResource();
            sys.setName("系统管理");
            sys.setPid("0");
            sys.setRes_type(R.resourceType.menu);
            sys.setTip("系统管理");
            ss.save(sys);
            TSResource res = new TSResource();
            res.setName("资源管理");
            res.setPid(sys.getId());
            res.setModule("sys.resource.Resource");
            res.setRes_type(R.resourceType.module);
            res.setTip("管理系统中的各类资源，如:菜单、操作权限等");
            ss.save(res);
            TSResource role = new TSResource();
            role.setName("角色管理");
            role.setPid(sys.getId());
            role.setModule("sys.role.Role");
            role.setRes_type(R.resourceType.module);
            role.setTip("管理系统中的角色，并且对角色授权");
            ss.save(role);
            TSResource user = new TSResource();
            user.setName("用户管理");
            user.setPid(sys.getId());
            user.setModule("sys.user.User");
            user.setRes_type(R.resourceType.module);
            user.setTip("管理系统中的账户信息");
            ss.save(user);
        }
        if (ss.countAll(TSRole.class) > 0) {
            log.info("系统角色存在，不做处理");
        } else {
            log.info("系统角色为空，默认加入开发者角色");
            TSRole role = new TSRole();
            role.setName("administrator");
            role.setReserved(true);
            ss.save(role);
        }
        if (ss.countAll(TSRoleResource.class) > 0) {
            log.info("角色已经分配了权限，不做处理");
        } else {
            log.info("开始为角色分配权限");
            TSRole role = ss.findUniqueByProperty(TSRole.class, "name", "administrator");
            log.info("角色是:{}",role);
            if (null != role) {
                List<TSResource> all = ss.loadAll(TSResource.class);
                for (TSResource resource : all) {
                    TSRoleResource roleResource = new TSRoleResource();
                    roleResource.setResource(resource.getId());
                    roleResource.setRole(role.getId());
                    ss.save(roleResource);
                }
            } else {
                log.info("没找到角色，不做处理");
            }


        }

        if (ss.countAll(TSRoleUser.class) > 0) {
            log.info("已经存在用户角色分配信息，不做处理");
        } else {
            log.info("开始为账号分配角色");
            TSRole role = ss.findUniqueByProperty(TSRole.class, "name", "administrator");
            TSUser user = ss.findUniqueByProperty(TSUser.class, "username", "admin");
            if (null == role || null == user) {
                log.error("角色或者用户没找到，不做处理");
            } else {
                TSRoleUser roleUser = new TSRoleUser();
                roleUser.setRole(role.getId());
                roleUser.setUser(user.getId());
                ss.save(roleUser);
            }

        }
    }
}
