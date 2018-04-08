package com.luter.extjs.util.ext;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class ExtAsyncTreeModel implements Serializable {
    private String id;
    private String text;
    private boolean leaf;
    private String iconCls;
    private String qtip;
    private boolean checked;
    private boolean expanded;
    private String pid;
    List<ExtAsyncTreeModel> children = new ArrayList<>();

}
