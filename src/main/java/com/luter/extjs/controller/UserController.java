package com.luter.extjs.controller;

import com.luter.extjs.entity.TSUser;
import com.luter.extjs.ext.ExtDataModel;
import com.luter.extjs.ext.ExtPager;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.ConditionQuery;
import com.luter.extjs.util.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/get")
    public Object get(HttpServletRequest request, TSUser obj) {
        TSUser user = ss.get(TSUser.class, obj.getId());
        if (null == user) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个用户");
        }
        return new ExtDataModel<>().ok("", user);
    }

    @PostMapping("/create")
    public Object create(HttpServletRequest request, TSUser obj) {
        ss.save(obj);
        return new ExtDataModel<>().ok("添加成功");
    }

    @PostMapping("/update")
    public Object update(HttpServletRequest request, TSUser obj) {
        TSUser user = ss.get(TSUser.class, obj.getId());
        if (null == user) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个用户");
        }
        user.setUsername(obj.getUsername());
        user.setAge(obj.getAge());
        user.setGender(obj.getGender());
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
