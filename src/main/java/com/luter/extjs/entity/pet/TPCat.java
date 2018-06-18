package com.luter.extjs.entity.pet;

import com.luter.extjs.entity.base.BaseEntity;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "t_pet_cat")
@Data
@EqualsAndHashCode(callSuper = true)
@FieldDefaults(level = AccessLevel.PRIVATE)//默认private类型字段
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Accessors(chain = true)//链式调用
public class TPCat extends BaseEntity implements Serializable {
    String name;
    Integer age;
}
