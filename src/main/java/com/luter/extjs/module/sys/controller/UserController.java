package com.luter.extjs.module.sys.controller;


import com.luter.extjs.base.aop.SysLog;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.exception.LuterException;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.TSRole;
import com.luter.extjs.entity.sys.TSRoleUser;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.shiro.endecrypt.UserEndecrypUtils;
import com.luter.extjs.utils.data.PinyinUtil;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Table;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/sys/user")
public class UserController extends BaseController {
    @Autowired
    private BaseService ss;

    @PostMapping("/list")
    @SysLog
    public Object list(HttpServletRequest request, ExtPager pager) {
        String realname = ServletRequestUtils.getStringParameter(request, "query", null);
        ConditionQuery query = new ConditionQuery();
        if (StringUtils.isNotEmpty(realname)) {
            query.add(Restrictions.or(
                    Restrictions.like("realname", realname, MatchMode.ANYWHERE),
                    Restrictions.like("realname_py", realname, MatchMode.ANYWHERE),
                    Restrictions.like("realname_pyhd", realname, MatchMode.ANYWHERE),
                    Restrictions.like("username", realname, MatchMode.ANYWHERE)
            ));
        }
        return ss.listExtPage(TSUser.class, query, pager);
    }

    @PostMapping("/add")
    @SysLog
    public Object add(HttpServletRequest request, TSUser obj) {

        if (StringUtils.isEmpty(obj.getUsername())) {
            return ResponseUtils.badRequest("用户名不能为空");
        }
        if (ss.exist(TSUser.class, "username", obj.getUsername())) {
            return ResponseUtils.fail("该用户名已经存在，请修改");
        }
        TSUser user = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password(obj.getUsername(), obj.getPassword());
        user.setRealname(obj.getRealname());
        user.setRealname_py(PinyinUtil.getPinYin(obj.getRealname()));
        user.setRealname_pyhd(PinyinUtil.getPinYinHeadChar(obj.getRealname()));
        ss.save(user);
        return ResponseUtils.ok("添加成功");
    }

    @PostMapping("/set/role")
    @SysLog
    public Object setRole(HttpServletRequest request) {
        String[] roles = ServletRequestUtils.getStringParameters(request, "roles");
        Long userid = ServletRequestUtils.getLongParameter(request, "user", -1L);
        TSUser user = ss.get(TSUser.class, userid);
        if (null == user) {
            return ResponseUtils.fail("授权用户不存在");
        }
        if (null == roles || roles.length <= 0) {
            return ResponseUtils.fail("请选择角色");
        }
        log.info("删除已有角色");
        ConditionQuery queryExistRole = new ConditionQuery();
        queryExistRole.add(Restrictions.eq("user", user.getId()));
        ss.deleteAllEntitie(ss.listByConditionQuery(TSRoleUser.class, queryExistRole));
        for (String roleid : roles) {
            TSRole role = ss.get(TSRole.class, roleid);
            if (null != role) {
                ss.save(new TSRoleUser().setUser(user.getId()).setRole(role.getId()));
            }
        }
        return ResponseUtils.ok("授权成功，用户权限下次登录后自动生效。");
    }

    @PostMapping("/get/role")
    @SysLog
    public Object getUserRoles(HttpServletRequest request) {
        String userid = ServletRequestUtils.getStringParameter(request, "userid", null);
        String sql = "select id,name from  " + TSRole.class.getAnnotation(Table.class).name()
                + "  where id in ( select role from " + TSRoleUser.class.getAnnotation(Table.class).name()
                + "  where user = " + userid + ")";
        List<Map<String, Object>> ids = ss.listBySQL(sql);
        return ResponseUtils.ok(ids);
    }

    @PostMapping("/update")
    @SysLog
    public Object update(HttpServletRequest request, TSUser obj) {
        TSUser record = ss.get(TSUser.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        record.setRealname(obj.getRealname());
        record.setRealname_py(PinyinUtil.getPinYin(obj.getRealname()));
        record.setRealname_pyhd(PinyinUtil.getPinYinHeadChar(obj.getRealname()));

        record.setRemarks(obj.getRemarks());

        ss.updateEntitie(record);
        return ResponseUtils.ok("修改成功", record);
    }

    @PostMapping("/current")
    @SysLog
    public Object currentLoginUser(HttpServletRequest request) {
        TSUser record = ss.getCurrentUser(true);
        if (null == record) {
            return ResponseUtils.fail(HttpStatus.UNAUTHORIZED, "请登录后操作");
        }
        return ResponseUtils.ok(record);
    }

    @PostMapping("/update/currentuser")
    @SysLog
    public Object updateCurrentUserInfo(HttpServletRequest request, TSUser obj) {
        TSUser record = ss.getCurrentUser(true);
        if (null == record) {
            return ResponseUtils.fail(HttpStatus.UNAUTHORIZED, "请登录后操作");
        }

        record.setRemarks(obj.getRemarks());
        ss.updateEntitie(record);
        return ResponseUtils.ok("修改成功");
    }

    @PostMapping("/lock")
    @SysLog
    public Object lock(HttpServletRequest request, TSUser obj) {
        TSUser record = ss.get(TSUser.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }
        TSUser cuser = ss.getCurrentUser();
        if (cuser.getId().equals(record.getId())) {
            return ResponseUtils.fail("锁定自己账户会导致你无法登录系统,请不要锁定自己账户~");
        }
        record.setLocked(!record.getLocked());
        ss.updateEntitie(record);
        return ResponseUtils.ok("成功");
    }

    @PostMapping("/view")
    @SysLog
    public Object view(HttpServletRequest request, TSUser obj) {
        TSUser record = ss.get(TSUser.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:数据不存在");
        }
        ss.setUserRolesData(record);
        return ResponseUtils.ok(record);
    }

    @PostMapping("/password/reset")
    @SysLog(content = "根据用户ID修改用户密码")
    public Object resetUserPasswordByUserId(HttpServletRequest request, TSUser obj) {

        TSUser record = ss.get(TSUser.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        String password1 = ServletRequestUtils.getStringParameter(request, "password1", null);
        String password2 = ServletRequestUtils.getStringParameter(request, "password2", null);
        if (null == password1 || null == password2) {
            return ResponseUtils.badRequest("请输入密码");
        }
        if (StringUtils.equals(password1, password2)) {
            return ResponseUtils.badRequest("两次输入的密码不一致，请重新输入");
        }
        TSUser passUser = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password(record.getUsername(), password1);
        record.setPassword(passUser.getPassword());
        record.setSalt(passUser.getSalt());
        ss.updateEntitie(record);
        return ResponseUtils.ok("用户:" + record.getUsername() + "的密码修改成功");
    }

    @PostMapping("/password/reset/currentuser")
    @SysLog(content = "当前登录用户修改自己的密码")
    public Object resetCurrentUserPassword(HttpServletRequest request, TSUser obj) {
        TSUser record = ss.getCurrentUser(true);
        if (null == record) {
            return ResponseUtils.fail(HttpStatus.UNAUTHORIZED, "请登录后操作");
        }
        String password = ServletRequestUtils.getStringParameter(request, "password", null);
        String password1 = ServletRequestUtils.getStringParameter(request, "password1", null);
        String password2 = ServletRequestUtils.getStringParameter(request, "password2", null);
        if (StringUtils.isEmpty(password)) {
            return ResponseUtils.badRequest("请输入原密码");
        }
        if (!UserEndecrypUtils.CheckUserMD5Password(password, record.getSalt(), record.getPassword())) {
            return ResponseUtils.badRequest("原密码错误，请重新输入。如果你忘记了原来密码，请联系系统管理员进行修改");
        }
        if (null == password1 || null == password2) {
            return ResponseUtils.badRequest("请输入密码");
        }
        if (!StringUtils.equals(password1, password2)) {
            return ResponseUtils.badRequest("两次输入的密码不一致，请重新输入");
        }
        TSUser passUser = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password(record.getUsername(), password1);
        record.setPassword(passUser.getPassword());
        record.setSalt(passUser.getSalt());
        ss.updateEntitie(record);
        return ResponseUtils.ok("密码修改成功，下次登录请使用新密码");
    }

    @PostMapping("/exist")
    @SysLog
    public Object exist(HttpServletRequest request, TSUser obj) {
        String param_name = ServletRequestUtils.getStringParameter(request, "param_name", null);
        String param_value = ServletRequestUtils.getStringParameter(request, "param_value", null);
        if (null == param_name) {
            throw new LuterException("参数错误");
        }
        return !ss.exist(TSUser.class, param_name, param_value);
    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {

    }
}
