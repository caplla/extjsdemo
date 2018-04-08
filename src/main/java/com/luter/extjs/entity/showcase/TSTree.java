package com.luter.extjs.entity.showcase;

import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "t_showcase_tree")
@Entity
@DynamicInsert
@DynamicUpdate
@Data
@EqualsAndHashCode(callSuper = false)
public class TSTree extends BaseEntity implements Serializable {
    private String title;
    private String qtip;
    private String iconcls;
    private String pid;
}
