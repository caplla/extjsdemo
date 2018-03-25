package com.luter.extjs.ext;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class ExtTreeModel implements Serializable {
    /*树节点id*/
    private String id;
    /*树节点名称*/
    private String text;
    /*树节点url*/
    private String href;
    /*是否是叶子节点 */
    private boolean leaf;
    /*树节点的样式*/
    private String iconCls;
    private String qtip;
    //父节点ID
    private String pid;
    List<ExtTreeModel> children = new ArrayList<>();

}
