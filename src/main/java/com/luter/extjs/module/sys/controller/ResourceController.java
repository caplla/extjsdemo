package com.luter.extjs.module.sys.controller;


import com.luter.extjs.base.aop.SysLog;
import com.luter.extjs.base.config.R;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.TSResource;
import com.luter.extjs.entity.sys.TSRoleResource;
import com.luter.extjs.entity.sys.TSRoleUser;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.service.SecurityService;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.ext.ExtTreeModel;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/sys/resource")
public class ResourceController extends BaseController {
    @Autowired
    private BaseService ss;

    @Autowired
    SecurityService securityService;

    @PostMapping("/list")
    @SysLog
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        return ss.listExtPage(TSResource.class, query, pager);
    }

    @PostMapping("/add")
    @SysLog
    public Object add(HttpServletRequest request, TSResource obj) {
        if (obj.getRes_type().equalsIgnoreCase(R.resourceType.perm)) {
            ConditionQuery query = new ConditionQuery();
            query.add(Restrictions.or(
                    Restrictions.eq("uri", obj.getUri()),
                    Restrictions.eq("perm", obj.getPerm())

            ));
            if (ss.getCountByConditionQuery(TSResource.class, query) > 0) {
                return ResponseUtils.fail("资源路径或者权限标识重复，请检查");
            }
        }
        ss.save(obj);
        securityService.updatePermission();
        return ResponseUtils.ok("添加成功");
    }

    @PostMapping("/update")
    @SysLog
    public Object update(HttpServletRequest request, TSResource obj) {
        TSResource record = ss.get(TSResource.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        record.setIcon(obj.getIcon());
        record.setModule(obj.getModule());
        record.setName(obj.getName());
        record.setPerm(obj.getPerm());
        record.setRes_type(obj.getRes_type());
        record.setTip(obj.getTip());
        record.setUri(obj.getUri());
        record.setIshref(obj.getIshref());
        record.setHref(obj.getHref());
        ss.updateEntitie(record);
        securityService.updatePermission();
        return ResponseUtils.ok("修改成功", record);
    }

    @PostMapping("/view")
    @SysLog
    public Object view(HttpServletRequest request, TSResource obj) {
        TSResource record = ss.get(TSResource.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }

        return ResponseUtils.ok(record);
    }


    @PostMapping("/tree/sync")
    @SysLog
    public Object syncTree(HttpServletRequest request) {
        String node = ServletRequestUtils.getStringParameter(request, "node", null);
        return ResponseUtils.ok(ss.findByProperty(TSResource.class, "pid", node));
    }

    @PostMapping("/user/tree/async")
    @SysLog
    public Object asyncUserTree(HttpServletRequest request) {
        TSUser user = ss.getCurrentUser();
        if (null == user) {
            return ResponseUtils.fail(HttpStatus.UNAUTHORIZED, "请登录");
        }
        String sql = "select * from " + TSResource.class.getAnnotation(Table.class).name()
                + " where id in (select resource from " + TSRoleResource.class.getAnnotation(Table.class).name()
                + " where role  in (select role from " + TSRoleUser.class.getAnnotation(Table.class).name()
                + " where user='" + user.getId() + "' "
                + ")) and res_type<>'" + R.resourceType.perm + "'";
        List<TSResource> resources = ss.findListbySql(sql, TSResource.class);
        List<ExtTreeModel> rlist = transformer(resources);
        ExtTreeModel root = new ExtTreeModel();
        root.setId("0");
        root.setLeaf(false);
        return getTheTree(rlist, root);
    }

    private List<ExtTreeModel> transformer(List<TSResource> resources) {
        List<ExtTreeModel> nodes = new ArrayList<>();
        if (null != resources && resources.size() > 0) {
            for (TSResource resource : resources) {
                ExtTreeModel vo = new ExtTreeModel();
                vo.setLeaf(resource.getRes_type().equalsIgnoreCase(R.resourceType.module));
                vo.setId(resource.getId());
                vo.setQtip(resource.getTip());
                vo.setText(resource.getName());
                vo.setHref("");
                vo.setIconCls(" " + resource.getIcon());
                vo.setPid(resource.getPid());
                vo.setIshref(resource.getIshref());
                vo.setHref(resource.getHref());
                vo.setModule(resource.getModule());
                nodes.add(vo);

            }
        }
        return nodes;

    }

    private ExtTreeModel getTheTree(List<ExtTreeModel> allNodes, ExtTreeModel root) {
        List<ExtTreeModel> fucList = getChilds(allNodes, root);
        if (fucList != null && fucList.size() > 0) {
            List<ExtTreeModel> children = new ArrayList<>();
            for (ExtTreeModel d : fucList) {
                ExtTreeModel t = getTheTree(allNodes, d);
                children.add(t);
            }
            root.setChildren(fucList);
        }
        return root;

    }

    private List<ExtTreeModel> getChilds(List<ExtTreeModel> allNodes, ExtTreeModel root) {
        List<ExtTreeModel> childs = new ArrayList<>();
        if (!allNodes.isEmpty()) {
            for (ExtTreeModel m : allNodes) {
                if (m.getPid().equals(root.getId())) {
                    childs.add(m);
                }
            }
        }
        return childs;
    }
}
