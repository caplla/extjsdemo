package com.luter.extjs.entity.sys;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.luter.extjs.entity.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "t_sys_log")
@Data
@EqualsAndHashCode(callSuper = true)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Accessors(chain = true)
public class TSLog extends BaseEntity implements Serializable {
    private String user_agent;
    private String request_url;
    @Lob
    @Column(name = "request_params", length = 2000)
    private String request_params;
    private String log_class;
    private String request_method;
    private String client_ip;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Temporal(TemporalType.TIMESTAMP)
    private Date request_time;
    private String browser_type;
    @Lob
    @Column(name = "content", length = 20000)
    private String content;
    private String userid;
    private String username;
}
