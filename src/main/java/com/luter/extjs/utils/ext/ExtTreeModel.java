package com.luter.extjs.utils.ext;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Extjs tree 模型
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ExtTreeModel implements Serializable {
    /**
     * ID
     */
    private String id;
    /**
     * 节点名称
     */
    private String text;
    /**
     * 是否外链
     */
    private Boolean ishref = false;
    /**
     *外链地址
     */
    private String href;
    /**
     * 是否末端树节点，可点击的节点
     */
    private Boolean leaf;
    /**
     *图标，字体图标 x-fa fa-user
     */
    private String iconCls;
    /**
     * 提示信息
     */
    private String qtip;
    /**
     * 模块
     */
    private String module;
    /**
     * 上级菜单
     */
    private String pid;
    /**
     * 是否展开
     */
    private boolean expanded = true;
    /**
     * 子节点
     */
    List<ExtTreeModel> children = new ArrayList<>();

}
