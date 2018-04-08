package com.luter.extjs.entity.base;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
@Data
public abstract class BaseEntity {

    /**
     * 唯一ID,字符串
     */
    @Id
    @Column(unique = true, length = 128, nullable = false)
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    public String id;
    /**
     * 创建时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Temporal(TemporalType.TIMESTAMP)
    public Date created_at;

    /**
     * 最后一次修改时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @Temporal(TemporalType.TIMESTAMP)
    public Date update_at;

    /**
     * 备注
     */
    public String remarks;

    /**
     * 数据版本
     */
    @Version
    public int version;

    /**
     * 保存之前
     */
    @PrePersist
    public void PrePersist() {
        this.created_at = new Date();
    }

    /**
     * 保存之后
     */
    @PostPersist
    public void postPersist() {

    }

    /**
     * 更新之前
     */
    @PreUpdate
    public void preUpdate() {
        this.update_at = new Date();
    }

    /**
     * 更新之后
     */
    @PostUpdate
    public void postUpdate() {

    }

    /**
     * 删除之前
     */
    @PreRemove
    public void preRemove() {

    }

    /**
     * 删除之后
     */
    @PostRemove
    public void postRemove() {

    }

    /**
     * 加载数据后
     */
    @PostLoad
    public void postLoad() {

    }
}
