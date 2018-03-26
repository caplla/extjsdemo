package com.luter.extjs.controller.sys;

import com.luter.extjs.config.R;
import com.luter.extjs.entity.TSResource;
import com.luter.extjs.entity.TSRole;
import com.luter.extjs.entity.TSTree;
import com.luter.extjs.entity.TSUser;
import com.luter.extjs.ext.ExtDataModel;
import com.luter.extjs.ext.ExtPager;
import com.luter.extjs.ext.ExtTreeModel;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.ConditionQuery;
import com.luter.extjs.util.OrderBy;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/resource")
public class ResourceController {
    @Autowired
    BaseService ss;

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
        Long pid = ServletRequestUtils.getLongParameter(request, "node", -100);
        if (pid >= -1) {
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

    @GetMapping("/getSysUserTreeData")
    public Object getAuthTreeData(HttpServletRequest request) {
        log.info("获取权限树");
        List<TSResource> all = ss.loadAll(TSResource.class);
        List<ExtTreeModel> nodes = transformer(all);
        if (null != all && all.size() > 0) {
            ExtTreeModel root = new ExtTreeModel();
            root.setId("0");//pid=0的都是顶级节点
            root.setLeaf(false);
            return ResponseEntity.ok().body(getTheTree(nodes, root));
        }
        return null;
    }

    private List<ExtTreeModel> transformer(List<TSResource> trees) {
        List<ExtTreeModel> nodes = new ArrayList<>();
        if (null != trees && trees.size() > 0) {
            for (TSResource tree : trees) {
                if (null != tree) {
                    ExtTreeModel vo = new ExtTreeModel();
                    vo.setId(tree.getId() + "");
                    vo.setQtip(tree.getQtip());
                    vo.setText(tree.getText());
                    vo.setHref("");
                    vo.setIconCls(" fa fa-lg red-color " + tree.getIconCls());
                    vo.setPid(tree.getPid() + "");
                    vo.setModule_id(tree.getModule_id());
                    nodes.add(vo);
                }

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
            root.setLeaf(false);
        }
        if (root.getChildren().size() == 0) {
            root.setLeaf(true);
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
