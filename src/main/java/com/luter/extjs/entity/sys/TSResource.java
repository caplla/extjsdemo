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
import java.io.Serializable;

/**
 * The type Ts resource.
 */
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "t_sys_resource")
@Data
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(value = {"hibernateLazyInitializer"})
public class TSResource extends BaseEntity implements Serializable {
    /**
     * 名字
     */
    private String name;
    /**
     * perm的uri,这个只针对本系统的perm类型
     */
    private String uri;
    /**
     * 提示，鼠标悬停后显示，也可作为其他提示方式使用
     */
    private String tip;
    /**
     * 上级ID
     */
    private String pid;
    /**
     * 图标
     */
    private String icon;
    /**
     * 权限标志位，shiro使用，比如:user:add
     */
    private String perm;
    /**
     * 是否系统保留权限，也就是不能删除不能改的。
     */
    private Boolean reversed;
    /**
     * 是否是外部html链接，主要用来在iframe里加载其他html类型页面
     */
    private Boolean ishref;
    /**
     * 外部链接地址
     */
    private String href;
    /**
     * 模块ID，当res_type=1的时候有效，代表的是左键菜单里一项
     */
    private String module;
    /**
     * @see com.luter.extjs.base.config.R
     */
    private String res_type;


}
