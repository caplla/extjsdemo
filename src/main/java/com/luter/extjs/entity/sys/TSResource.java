package com.luter.extjs.entity.sys;

import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "t_s_resource")
@Entity
@DynamicInsert
@DynamicUpdate
@Data
@EqualsAndHashCode(callSuper = true)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class TSResource extends BaseEntity implements Serializable {
    private String pid;
    private String name;
    private String uri;
    private String perm;
    private String module_id;
    private String iconCls;
    private String res_type;
    private String qtip;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TSResource)) return false;
        if (!super.equals(o)) return false;

        TSResource resource = (TSResource) o;

        return id != null ? id.equals(resource.id) : resource.id == null;
    }

    @Override
    public int hashCode() {
        int result = super.hashCode();
        result = 31 * result + (id != null ? pid.hashCode() : 0);
        return result;
    }
}
