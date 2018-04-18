package com.luter.extjs.entity.sys;

import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "t_s_role_user")
@Entity
@DynamicInsert
@DynamicUpdate
@Data
@EqualsAndHashCode(callSuper = false)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public class TSRoleUser extends BaseEntity implements Serializable {
    @ManyToOne()
    @JoinColumn(name = "role")
    @NotFound(action = NotFoundAction.EXCEPTION)
    private TSRole role;
    @ManyToOne()
    @JoinColumn(name = "user")
    @NotFound(action = NotFoundAction.EXCEPTION)
    private TSUser user;
}
