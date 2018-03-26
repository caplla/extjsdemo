package com.luter.extjs.ext;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;


@Data
@EqualsAndHashCode(callSuper = false)
public class ExtTreeModelExtend extends ExtTreeModel implements Serializable {
    private boolean checked;
}
