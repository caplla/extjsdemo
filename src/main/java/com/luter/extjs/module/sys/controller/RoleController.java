package com.luter.extjs.module.sys.controller;


import com.luter.extjs.base.aop.SysLog;
import com.luter.extjs.base.config.R;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.*;
import com.luter.extjs.security.service.SecurityService;
import com.luter.extjs.security.shiro.realm.UserRealm;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.ext.ExtTreeModelExtend;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Table;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/sys/role")
public class RoleController extends BaseController {


    @Autowired
    private BaseService ss;


    @Autowired
    SecurityService securityService;

    @Autowired
    UserRealm userRealm;

    @PostMapping("/users")
    @SysLog
    public Object listRoleUsers(HttpServletRequest request) {
        String roleid = ServletRequestUtils.getStringParameter(request, "roleid", "");
        String sql = "select * from " + TSUser.class.getAnnotation(Table.class).name()
                + " where id in (select user from " + TSRoleUser.class.getAnnotation(Table.class).name()
                + " where role='" + roleid
                + "') ";
        return ResponseUtils.ok(ss.listBySQL(sql));
    }

    @PostMapping("/list/all")
    @SysLog
    public Object listAll(HttpServletRequest request, ExtPager pager) {
        String sql = "select id,name,remarks from " + TSRole.class.getAnnotation(Table.class).name();
        return ss.listBySQL(sql);
    }

    @PostMapping("/del/user")
    @SysLog
    public Object deleteRoleUser(HttpServletRequest request) {

        String roleid = ServletRequestUtils.getStringParameter(request, "roleid", null);
        String userid = ServletRequestUtils.getStringParameter(request, "userid", null);
        if (null == roleid || null == userid) {

            return ResponseUtils.fail("角色或者用户信息错误");
        }
        String hql = "delete from TSRoleUser where user =" + userid + " and role  =" + roleid;
        int o = ss.executeHQL(hql);
        return ResponseUtils.ok("处理成功");
    }

    @PostMapping("/list")
    @SysLog
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        return ss.listExtPage(TSRole.class, query, pager);
    }

    @PostMapping("/add")
    @SysLog
    public Object add(HttpServletRequest request, TSRole obj) {
        if (StringUtils.isEmpty(obj.getName())) {
            return ResponseUtils.fail("请输入角色名称");
        }
        if (ss.exist(TSRole.class, "name", obj.getName())) {
            return ResponseUtils.fail("角色名称已经存在，请修改");
        }
        ss.save(obj);
        return ResponseUtils.ok("添加成功");
    }

    @PostMapping("/update")
    @SysLog
    public Object update(HttpServletRequest request, TSRole obj) {
        TSRole record = ss.get(TSRole.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        record.setName(obj.getName());
        record.setRemarks(obj.getRemarks());
        ss.updateEntitie(record);
        return ResponseUtils.ok("修改成功", record);
    }

    @PostMapping("/view")
    @SysLog
    public Object view(HttpServletRequest request, TSRole obj) {
        TSRole record = ss.get(TSRole.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        return ResponseUtils.ok(record);
    }

    @PostMapping("/delete")
    @SysLog
    public Object delete(HttpServletRequest request, TSRole obj) {
        TSRole record = ss.get(TSRole.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }
        ss.delete(record);
        return ResponseUtils.ok("数据删除成功", record);
    }

    @PostMapping("/auth/tree")
    @SysLog
    public Object getAuthTree(HttpServletRequest request) {
        String roleid = ServletRequestUtils.getStringParameter(request, "roleid", "");
        String sql = "select * from " + TSResource.class.getAnnotation(Table.class).name()
                + " where id in( select resource from " + TSRoleResource.class.getAnnotation(Table.class).name()
                + " where role = '" + roleid + "' )";
        List<TSResource> resources = ss.findListbySql(sql, TSResource.class);
        log.info("角色:{},资源总数:{}", roleid, resources.size());
        List<TSResource> resourcesAll = ss.loadAll(TSResource.class);
        List<ExtTreeModelExtend> nodes = RoleAuthtransformer(resources, resourcesAll);
        ExtTreeModelExtend root = new ExtTreeModelExtend();
        root.setId("0");
        root.setLeaf(false);
        root.setExpanded(true);
        return getTheTree(nodes, root);
    }

    @PostMapping("/auth/save")
    @SysLog
    public Object SaveRoleAuthData(HttpServletRequest request) {
        String roleid = ServletRequestUtils.getStringParameter(request, "roleid", null);
        String ids = ServletRequestUtils.getStringParameter(request, "ids", null);
        TSRole role = ss.get(TSRole.class, roleid);
        if (null == role) {
            return ResponseUtils.fail("请指定角色");
        }
        if (null == ids || ids.length() < 1) {
            return ResponseUtils.fail("权限为空,请选择权限");
        }
        String[] idsString = ids.split(",");
        String delHql = "delete from TSRoleResource where role = '" + role.getId()+"'";
        ss.executeHQL(delHql);
        for (int i = 0; i < idsString.length; i++) {
            ss.save(new TSRoleResource().setResource(idsString[i]).setRole(role.getId()));
        }
        userRealm.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
        return ResponseUtils.ok("授权成功");
    }

    public boolean containsid(final List<TSResource> list, final String id) {
        return list.stream().filter(o -> o.getId().equals(id)).findFirst().isPresent();
    }

    /**
     * @param resources 角色拥有的资源
     * @param all       系统所有资源
     * @return
     */
    private List<ExtTreeModelExtend> RoleAuthtransformer(List<TSResource> resources, List<TSResource> all) {
        List<ExtTreeModelExtend> nodes = new ArrayList<>();
        if (null != all && all.size() > 0) {
            for (TSResource fuc : all) {
                ExtTreeModelExtend vo = new ExtTreeModelExtend();
                vo.setId(fuc.getId());
                vo.setLeaf(fuc.getRes_type().equalsIgnoreCase(R.resourceType.perm));
                vo.setQtip(fuc.getTip());
                vo.setText(fuc.getName());
                vo.setIconCls(fuc.getIcon());
                vo.setPid(fuc.getPid());
                vo.setChecked(containsid(resources, fuc.getId()));
                nodes.add(vo);
            }
        }
        return nodes;

    }

    private ExtTreeModelExtend getTheTree(List<ExtTreeModelExtend> allNodes, ExtTreeModelExtend root) {
        List<ExtTreeModelExtend> fucList = getChilds(allNodes, root);
        if (fucList != null && fucList.size() > 0) {
            List<ExtTreeModelExtend> children = new ArrayList<>();
            for (ExtTreeModelExtend d : fucList) {
                ExtTreeModelExtend t = getTheTree(allNodes, d);
                children.add(t);
            }
            root.setChildren(fucList);
        }
        return root;

    }

    private List<ExtTreeModelExtend> getChilds(List<ExtTreeModelExtend> allNodes, ExtTreeModelExtend root) {
        List<ExtTreeModelExtend> childs = new ArrayList<>();
        if (!allNodes.isEmpty()) {
            for (ExtTreeModelExtend m : allNodes) {
                if (m.getPid().equalsIgnoreCase(root.getId())) {
                    childs.add(m);
                }
            }
        }
        return childs;
    }

}
