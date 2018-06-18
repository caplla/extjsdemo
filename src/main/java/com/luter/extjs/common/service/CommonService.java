package com.luter.extjs.common.service;


import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.common.util.OrderBy;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.model.DataModel;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public  interface CommonService {
    <T> T get(Class<T> entityName, Serializable id);

    <T> void save(T entity);

    <T> void saveOrUpdate(T entity);

    <T> void delete(T entity);

    <T> void deleteEntityById(Class entityName, Serializable id);

    <T> void deleteAllEntitie(Collection<T> entities);

    <T> void updateEntitie(T entity);

    <T> int countAll(Class<T> entityClass);

    <T> List<T> findListbySql(String query, Class<T> entity);

    <T> int getCountByConditionQuery(Class<T> entityClass, ConditionQuery query);

    <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);

    <T> List<T> loadAll(final Class<T> entityClass);

    <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value);

    <T> DataModel<T> listPageByConditionQuery(Class entityClass, ConditionQuery query, ExtPager pager);

    <T> List<T> listPageByConditionQueryInOrderWithOffset(Class<T> entityClass, ConditionQuery query, OrderBy orderBy, final int offset, final int pageSize);
    <T> List<T> listByConditionQuery(Class<T> entityClass, ConditionQuery query);
    Boolean exist(String sql);

    <T> Boolean exist(Class<T> entityClass, String propertyName, Object value);

    List<Map<String, Object>> listBySQL(String sql);

    List<Map<String, Object>> listPageBySQLwithOffset(String sql, int start, int limit);

    List<Map<String, Object>> listPageBySQLwithPageNo(String sql, int pageNo, int pageSize);
    public Integer executeHQL(String hql);
}
