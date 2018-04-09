package com.luter.extjs.module.sys.controller;

import com.luter.extjs.entity.sys.TSRole;
import com.luter.extjs.entity.sys.TSRoleUser;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.shiro.endecrypt.UserEndecrypUtils;
import com.luter.extjs.util.ext.ExtDataModel;
import com.luter.extjs.util.ext.ExtPager;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.dao.ConditionQuery;
import com.luter.extjs.util.dao.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Table;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/user")
public class UserController {

    @Autowired
    BaseService ss;

    @GetMapping("/list")
    public Object list(HttpServletRequest request, ExtPager pager) {
        String username_query = ServletRequestUtils.getStringParameter(request, "username", "");
        ConditionQuery query = new ConditionQuery();
        if (StringUtils.isNotEmpty(username_query)) {
            query.add(Restrictions.like("username", username_query, MatchMode.ANYWHERE));
        }
        OrderBy orderBy = pager.getOrder();
        List<TSUser> objs = ss.listPageByConditionQueryInOrderWithOffset(TSUser.class, query, orderBy, pager.getStart(), pager.getLimit());
        int count = ss.getCountByConditionQuery(TSUser.class, query);
        return new ExtDataModel<>().ok(count, objs);
    }

    @GetMapping("/get")
    public Object get(HttpServletRequest request, TSUser obj) {
        TSUser user = ss.get(TSUser.class, obj.getId());
        if (null == user) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个用户");
        }
        return new ExtDataModel<>().ok("", user);
    }

    @PostMapping("/add")
    @Transactional
    public Object add(HttpServletRequest request, TSUser obj) {
        if (StringUtils.isEmpty(obj.getUsername())) {
            return ResponseEntity.status(500).body("用户名不能为空");
        }
        if (StringUtils.isEmpty(obj.getPassword())) {
            return ResponseEntity.status(500).body("密码不能为空");
        }
        TSUser user = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password(obj.getUsername(), obj.getPassword());
        user.setGender(obj.getGender());
        ss.save(user);
        String[] roles = ServletRequestUtils.getStringParameters(request, "roles");
        if (null != roles && roles.length > 0) {
            for (int i = 0; i < roles.length; i++) {
                TSRole role = ss.get(TSRole.class, roles[i]);
                if (null != role) {
                    String sql = "select count(*) from " + TSRoleUser.class.getAnnotation(Table.class).name()
                            + " where role = '" + role.getId() + "' and user ='" + user.getId() + "'";
                    if (!ss.exist(sql)) {
                        TSRoleUser roleUser = new TSRoleUser();
                        roleUser.setRole(role);
                        roleUser.setUser(user);
                        ss.save(roleUser);
                    }

                }

            }
        }
        return new ExtDataModel<>().ok("添加成功");
    }

    @PostMapping("/update")
    public Object update(HttpServletRequest request, TSUser obj) {
        TSUser user = ss.get(TSUser.class, obj.getId());
        if (null == user) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个用户");
        }
        user.setUsername(obj.getUsername());
        user.setGender(obj.getGender());
        user.setLocked(obj.getLocked());
        ss.updateEntitie(user);
        return new ExtDataModel<>().ok("修改成功");
    }

    @PostMapping("/delete")
    public Object delete(HttpServletRequest request, TSUser obj) {
        TSUser user = ss.get(TSUser.class, obj.getId());
        if (null == user) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个用户");
        }
        ss.delete(user);
        return new ExtDataModel<>().ok("删除成功");
    }
}
