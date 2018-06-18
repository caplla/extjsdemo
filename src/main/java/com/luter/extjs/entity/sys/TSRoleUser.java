package com.luter.extjs.entity.sys;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "t_sys_role_user")
@Data
@EqualsAndHashCode(callSuper = false)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Accessors(chain = true)
@JsonIgnoreProperties(value = {"hibernateLazyInitializer"})
public class TSRoleUser extends BaseEntity implements java.io.Serializable {
    private static final long serialVersionUID = 7554841296624114067L;
    private String role;
    private String user;


}
