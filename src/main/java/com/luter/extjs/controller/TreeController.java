package com.luter.extjs.controller;


import com.luter.extjs.entity.TSTree;
import com.luter.extjs.ext.ExtTreeModel;
import com.luter.extjs.service.base.BaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("/tree")
public class TreeController {

    @Autowired
    BaseService ss;

    @GetMapping("/index")
    public Object index(HttpServletRequest request) {

        return "/tree/index";
    }

    @GetMapping("/async")
    @ResponseBody
    public Object getChildByPid(HttpServletRequest request) {
        Long pid = ServletRequestUtils.getLongParameter(request, "node", -100);
        if (pid > -1) {
            List<TSTree> childs = ss.findByProperty(TSTree.class, "pid", pid);
            return ResponseEntity.ok(childs);
        }
        return ResponseEntity.status(500).body("父节点ID不对");
    }

    @GetMapping("/sync")
    @ResponseBody
    public Object getAllTheTree(HttpServletRequest request) {
        List<TSTree> all = ss.loadAll(TSTree.class);
        List<ExtTreeModel> nodes = transformer(all);
        if (null != all && all.size() > 0) {
            ExtTreeModel root = new ExtTreeModel();
            root.setId("0");//pid=0的都是顶级节点
            root.setLeaf(false);
            return ResponseEntity.ok().body(getTheTree(nodes, root));
        }
        return null;
    }

    private List<ExtTreeModel> transformer(List<TSTree> trees) {
        List<ExtTreeModel> nodes = new ArrayList<>();
        if (null != trees && trees.size() > 0) {
            for (TSTree tree : trees) {
                if (null != tree) {
                    ExtTreeModel vo = new ExtTreeModel();
                    vo.setId(tree.getId() + "");
                    vo.setQtip(tree.getQtip());
                    vo.setText(tree.getTitle());
                    vo.setHref("");
                    vo.setIconCls(" fa fa-lg red-color " + tree.getIconcls());
                    vo.setPid(tree.getPid() + "");
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
        if(root.getChildren().size()==0){
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

