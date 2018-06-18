package com.luter.extjs.utils.ext;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


/**
 * 带有选择功能的树节点，主要用在需要checkbox的树的情况下。
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ExtTreeModelExtend implements Serializable {
    /**
     * ID
     */
    private String id;
    /**
     * 文字信息
     */
    private String text;
    /**
     * 外链
     */
    private String href;
    /**
     * 是否是末端
     */
    private boolean leaf;
    /**
     * 字体图标
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
     * 上级
     */
    private String pid;
    /**
     * 子节点
     */
    List<ExtTreeModelExtend> children = new ArrayList<>();
    /**
     * 是否选中
     */
    private boolean checked;
    /**
     * 是否展开
     */
    private boolean expanded = true;
}
