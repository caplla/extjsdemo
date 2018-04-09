package com.luter.extjs.security.shiro.realm;


import com.luter.extjs.entity.sys.TSResource;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.service.SecurityService;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;

@Component
@Slf4j
public class UserRealm extends AuthorizingRealm {

    @Resource
    SecurityService ss;

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        TSUser user = (TSUser) principalCollection.getPrimaryPrincipal();
        if (null == user) {
            log.error("获取用户权限失败，principal is null");
            throw new AuthorizationException("请登录后操作");
        }
        log.info("查找用户:{}拥有的权限...", user.getUsername());
        List<TSResource> perms = ss.getUsersResourceByUserId(user.getId());
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        if (null != perms && perms.size() > 0) {
            log.info("用户:{}一共有{}个权限,现在开始加入权限缓存....", user.getUsername(), perms.size());
            perms.forEach(p -> {
                info.addStringPermission(p.getPerm());
                log.info("用户:{},加入权限:{},URI:{}",user.getUsername(),p.getPerm(),p.getUri());
            });
        } else {
            log.warn("用户:{}不具备任何系统权限", user.getId());
        }
        return info;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) authenticationToken;
        String username = usernamePasswordToken.getUsername();
        log.info("开始登录,用户名:{}", username);
        TSUser user = ss.findUserByUsername(username);
        if (null == user) {
            throw new UnknownAccountException("账户不存在");
        }
        if (user.getLocked()) {
            throw new LockedAccountException("您的账户被锁定，请联系管理员");
        }
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                user, //用户
                user.getPassword(), //密码
                ByteSource.Util.bytes(user.getSalt()),//盐
                getName()  //realm name
        );// 当验证都通过后，把用户信息放在session里
//        Session session = SecurityUtils.getSubject().getSession();
//        session.setAttribute("session_user", user);
//        session.setAttribute("session", user.getId());
        return authenticationInfo;
    }

    /**
     * Clear cached authorization info.
     * 清理所有用户缓存的授权信息
     * 用户权限改变后执行
     * 比如：用户权限的增删改变
     * 用户所在角色的变化
     *
     * @param principals the principals
     */
    @Override
    public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        log.info("清理用户授权信息...");
        super.clearCachedAuthorizationInfo(principals);
    }

    /**
     * Clear cached authentication info.
     * 清理用户的认证信息，一般在在用户修改密码后，需要执行
     *
     * @param principals the principals
     */
    @Override
    public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
        log.info("清理用户身份认证信息....");
        super.clearCachedAuthenticationInfo(principals);
    }

    /**
     * Clear cache.
     *
     * @param principals the principals
     */
    @Override
    public void clearCache(PrincipalCollection principals) {
        log.info("清理shiro缓存....");
        super.clearCache(principals);
    }

    /**
     * Clear user authorization info cache.
     * 清理某个用户缓存的的权限项信息
     *
     * @param principal the principal
     */
    public void ClearUserAuthorizationInfoCache(String principal) {
        log.info("清理某个用户缓存的权限信息");
        SimplePrincipalCollection pc = new SimplePrincipalCollection();
        pc.add(principal, super.getName());
        super.clearCachedAuthorizationInfo(pc);
    }
}
