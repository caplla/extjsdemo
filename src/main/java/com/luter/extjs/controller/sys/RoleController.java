package com.luter.extjs.controller.sys;

import com.luter.extjs.entity.TSRole;
import com.luter.extjs.ext.ExtDataModel;
import com.luter.extjs.ext.ExtPager;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.ConditionQuery;
import com.luter.extjs.util.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/role")
public class RoleController {
    @Autowired
    BaseService ss;

    @GetMapping("/list")
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        OrderBy orderBy = pager.getOrder();
        List<TSRole> objs = ss.listPageByConditionQueryInOrderWithOffset(TSRole.class, query, orderBy, pager.getStart(), pager.getLimit());
        int count = ss.getCountByConditionQuery(TSRole.class, query);
        return new ExtDataModel<>().ok(count, objs);
    }

    @PostMapping("/get")
    public Object get(HttpServletRequest request, TSRole obj) {
        TSRole data = ss.get(TSRole.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        return new ExtDataModel<>().ok("", data);
    }

    @PostMapping("/create")
    public Object create(HttpServletRequest request, TSRole obj) {
        ss.save(obj);
        return new ExtDataModel<>().ok("添加成功");
    }

    @PostMapping("/update")
    public Object update(HttpServletRequest request, TSRole obj) {
        TSRole data = ss.get(TSRole.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        data.setName(obj.getName());
        ss.updateEntitie(data);
        return new ExtDataModel<>().ok("修改成功");
    }

    @PostMapping("/delete")
    public Object delete(HttpServletRequest request, TSRole obj) {
        TSRole data = ss.get(TSRole.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        ss.delete(data);
        return new ExtDataModel<>().ok("删除成功");
    }
}
