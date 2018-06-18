package com.luter.extjs.entity.sys;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "t_sys_user")
@Data
@EqualsAndHashCode(callSuper = false)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@JsonIgnoreProperties(value = {"hibernateLazyInitializer",
        "password", "salt"})
@Accessors(chain = true)
public class TSUser extends BaseEntity implements java.io.Serializable {

    private static final long serialVersionUID = 2750364996101898409L;
    /**
     * @Fields username : 用户名
     */
    private String username;
    /**
     * @Fields realname : 真实姓名
     */
    private String realname;
    /**
     * 真实姓名的拼音
     */
    private String realname_py;
    /**
     * 真实姓名的拼音首字母
     */
    private String realname_pyhd;

    /**
     * @Fields avatar : 用户头像
     */
    private String avatar;
    /**
     * @Fields password : 密码
     */
    private String password;
    /**
     * @Fields salt : 盐
     */
    private String salt;
    /**
     * @Fields locked : 是否锁定
     */
    private Boolean locked;
    private Boolean reserved;
    private String last_login_client;
    private String last_login_ip;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Temporal(TemporalType.TIMESTAMP)
    private Date last_login_time;

    @Transient
    private String roles;

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }
}
