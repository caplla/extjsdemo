package com.luter.extjs.module.sys.controller;

import com.luter.extjs.base.config.R;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.entity.sys.*;
import com.luter.extjs.security.shiro.realm.UserRealm;
import com.luter.extjs.util.ext.*;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.dao.ConditionQuery;
import com.luter.extjs.util.dao.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Table;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/resource")
public class ResourceController extends BaseController {
    @Autowired
    BaseService ss;

    @Autowired
    UserRealm userRealm;

    @GetMapping("/list")
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        OrderBy orderBy = pager.getOrder();
        List<TSResource> objs = ss.listPageByConditionQueryInOrderWithOffset(TSResource.class, query, orderBy, pager.getStart(), pager.getLimit());
        int count = ss.getCountByConditionQuery(TSResource.class, query);
        return new ExtDataModel<>().ok(count, objs);
    }

    @GetMapping("/tree/async")
    public Object asyncTree(HttpServletRequest request) {
        String pid = ServletRequestUtils.getStringParameter(request, "node", "");
        if (null!=pid) {
            List<TSResource> childs = ss.findByProperty(TSResource.class, "pid", pid);
            return ResponseEntity.ok(childs);
        }
        return ResponseEntity.status(500).body("父节点ID不对");
    }

    @PostMapping("/get")
    public Object get(HttpServletRequest request, TSResource obj) {
        TSResource data = ss.get(TSResource.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        return new ExtDataModel<>().ok("", data);
    }

    @PostMapping("/create")
    public Object create(HttpServletRequest request, TSResource obj) {
        ss.save(obj);
        return new ExtDataModel<>().ok("添加成功");
    }

    @PostMapping("/update")
    public Object update(HttpServletRequest request, TSResource obj) {
        TSResource data = ss.get(TSResource.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        ss.updateEntitie(data);
        return new ExtDataModel<>().ok("修改成功");
    }

    @PostMapping("/delete")
    public Object delete(HttpServletRequest request, TSResource obj) {
        TSResource data = ss.get(TSResource.class, obj.getId());
        if (null == data) {
            return new ExtDataModel<>().fail(10000, "对不起，没找到这个角色");
        }
        ss.delete(data);
        return new ExtDataModel<>().ok("删除成功");
    }

    @PostMapping("/AuthRoleResource")
    public Object AuthRoleResource(HttpServletRequest request) {
        String menuids = ServletRequestUtils.getStringParameter(request, "ids",
                "");
        String roleid = ServletRequestUtils.getStringParameter(request,
                "role", "");
        if (StringUtils.isEmpty(menuids)) {
            return ResponseEntity.status(500).body(new ExtDataModel<>().fail("权限为空，不做处理"));
        }
        if (StringUtils.isEmpty(roleid)) {
            return ResponseEntity.status(500).body(new ExtDataModel<>().fail("请选择角色"));
        }
        TSRole role = ss.get(TSRole.class, roleid);
        if (role == null) {
            return ResponseEntity.status(500).body(new ExtDataModel<>().fail("请选择角色"));
        }
        String dd = menuids.replace("[", "").replace("]", "");
        if (StringUtils.isEmpty(dd)) {
            List<TSRoleResource> rm = ss.findByProperty(TSRoleResource.class,
                    "role.id", roleid);
            if (rm != null && rm.size() > 0) {
                for (TSRoleResource aaa : rm) {
                    ss.delete(aaa);
                }
            }
            return ResponseEntity.ok(new ExtDataModel<>().ok("授权成功,该角色被设置为：不具有任何系统使用权限。"));
        } else {
            String a[] = dd.split(",");
            if (a.length > 0) {
                List<TSRoleResource> rm = ss.findByProperty(
                        TSRoleResource.class, "role.id", roleid);
                if (rm != null && rm.size() > 0) {
                    for (TSRoleResource aaa : rm) {
                        ss.delete(aaa);
                    }
                    for (String c : a) {
                        TSRoleResource rolem = new TSRoleResource();
                        TSResource cmTsMenu = ss.get(TSResource.class, c.replace("\"", "").replace("\"", ""));
                        if (cmTsMenu != null) {
                            rolem.setResource(cmTsMenu);
                            rolem.setRole(role);
                            ss.saveOrUpdate(rolem);
                        } else {
                            log.info("resource为空");
                        }
                    }
                } else {
                    for (String c : a) {
                        TSRoleResource rolem = new TSRoleResource();
                        TSResource cmTsMenu = ss.get(TSResource.class, c
                                .replace("\"", "").replace("\"", ""));
                        if (cmTsMenu != null) {
                            rolem.setResource(cmTsMenu);
                            rolem.setRole(role);
                            ss.saveOrUpdate(rolem);
                        } else {
                            log.info("resource为空");
                        }
                    }
                }
                userRealm.clearCachedAuthorizationInfo(SecurityUtils.getSubject().getPrincipals());
                return ResponseEntity.ok(new ExtDataModel<>().ok("授权成功"));

            } else {
                return ResponseEntity.status(500).body(new ExtDataModel<>().fail("权限项为空，不做授权"));
            }
        }

    }

    @GetMapping("/getSysUserTreeData")
    public Object getSysUserTreeData(HttpServletRequest request) {
        TSUser user = getCurrentUser();
        if (null == user) {
            throw new UnauthorizedException("请登录");
        }
        String sql = "select * from " + TSResource.class.getAnnotation(Table.class).name()
                + " where id in (select resource from " + TSRoleResource.class.getAnnotation(Table.class).name()
                + " where role in (select role from " + TSRoleUser.class.getAnnotation(Table.class).name()
                + " where user='" + user.getId() + "'))";
        log.info(sql);
        List<TSResource> all = ss.findListbySql(sql, TSResource.class);
        List<ExtTreeModel> nodes = transformer(all);
        ExtTreeModel root = new ExtTreeModel();
        root.setId("0");//pid=0的都是顶级节点
        root.setLeaf(false);
        return ResponseEntity.ok().body(getTheTree(nodes, root));
    }

    @GetMapping("/getAuthTreeData")
    public Object getAuthTreeData(HttpServletRequest request) {

        String roleid = ServletRequestUtils.getStringParameter(request,
                "role", "");
        log.info("获取用户权限树,角色:{}", roleid);
        List<TSRoleResource> roleResources = ss.findByProperty(TSRoleResource.class,
                "role.id", roleid);
        log.info("角色的权限共有:{}个", roleResources.size());
        List<TSResource> all = ss.loadAll(TSResource.class);
        List<ExtAsyncTreeModel> nodes = RoleAuthtransformer(roleResources, all);
        ExtAsyncTreeModel root = new ExtAsyncTreeModel();
        root.setId("0");
        root.setText("资源权限树");
        root.setLeaf(false);
        root.setExpanded(false);
        return getTheTree(nodes, root);
    }

    //授权树
    private List<ExtAsyncTreeModel> RoleAuthtransformer(List<TSRoleResource> resources, List<TSResource> all) {
        List<ExtAsyncTreeModel> nodes = new ArrayList<>();
        List<TSResource> authList = new ArrayList<>();
        if (!resources.isEmpty()) {
            for (TSRoleResource ru : resources) {
                authList.add(ru.getResource());
            }
        }
        if (null != all && all.size() > 0) {
            for (TSResource fuc : all) {
                ExtAsyncTreeModel vo = new ExtAsyncTreeModel();
                vo.setId(fuc.getId());
                if (StringUtils.isNotEmpty(fuc.getRes_type()) && StringUtils.equalsIgnoreCase(fuc.getRes_type(), R.resourceType.perm)) {
                    vo.setLeaf(true);
                    vo.setExpanded(false);
                } else {
                    vo.setLeaf(false);
                    vo.setExpanded(true);
                }
                vo.setQtip(fuc.getRemarks());
                vo.setText(fuc.getName());
                vo.setIconCls(" fa fa-lg  " + fuc.getIconCls());
                vo.setPid(fuc.getPid());
                vo.setChecked(authList.contains(fuc));
                nodes.add(vo);

            }
        }
        return nodes;

    }

    private ExtAsyncTreeModel getTheTree(List<ExtAsyncTreeModel> allNodes, ExtAsyncTreeModel root) {
        if (!root.isLeaf()) {
            List<ExtAsyncTreeModel> fucList = getChilds(allNodes, root);
            if (fucList != null && fucList.size() > 0) {
                List<ExtAsyncTreeModel> children = new ArrayList<>();
                for (ExtAsyncTreeModel d : fucList) {
                    ExtAsyncTreeModel t = getTheTree(allNodes, d);
                    children.add(t);
                }
                root.setChildren(fucList);
            }
        }
        return root;

    }

    private List<ExtAsyncTreeModel> getChilds(List<ExtAsyncTreeModel> allNodes, ExtAsyncTreeModel root) {
        List<ExtAsyncTreeModel> childs = new ArrayList<>();
        if (!allNodes.isEmpty()) {
            for (ExtAsyncTreeModel m : allNodes) {
                if (m.getPid().equalsIgnoreCase(root.getId())) {
                    childs.add(m);
                }
            }
        }
        return childs;
    }

    //菜单树
    private List<ExtTreeModel> transformer(List<TSResource> trees) {
        List<ExtTreeModel> nodes = new ArrayList<>();
        if (null != trees && trees.size() > 0) {
            for (TSResource tree : trees) {
                if (null != tree) {
                    ExtTreeModel vo = new ExtTreeModel();
                    vo.setText(tree.getName());
                    vo.setId(tree.getId() + "");
                    vo.setQtip(tree.getQtip());
                    vo.setHref("");
                    vo.setIconCls(" fa fa-lg red-color " + tree.getIconCls());
                    vo.setPid(tree.getPid() + "");
                    vo.setLeaf(tree.getRes_type().equalsIgnoreCase(R.resourceType.module));
                    vo.setModule_id(tree.getModule_id());
                    nodes.add(vo);
                }

            }
        }
        return nodes;

    }

    private ExtTreeModel getTheTree(List<ExtTreeModel> allNodes, ExtTreeModel root) {
        if (!root.isLeaf()) {
            List<ExtTreeModel> fucList = getChilds(allNodes, root);
            if (fucList != null && fucList.size() > 0) {
                List<ExtTreeModel> children = new ArrayList<>();
                for (ExtTreeModel d : fucList) {
                    ExtTreeModel t = getTheTree(allNodes, d);
                    children.add(t);
                }
                root.setChildren(fucList);
            }
        }
        return root;

    }

    private List<ExtTreeModel> getChilds(List<ExtTreeModel> allNodes, ExtTreeModel root) {
        List<ExtTreeModel> childs = new ArrayList<>();
        if (!allNodes.isEmpty()) {
            for (ExtTreeModel m : allNodes) {
                if (m.getPid().equalsIgnoreCase(root.getId())) {
                    childs.add(m);
                }
            }
        }
        return childs;
    }

}
