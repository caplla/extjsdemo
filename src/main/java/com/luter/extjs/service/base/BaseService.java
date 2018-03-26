package com.luter.extjs.service.base;


import com.luter.extjs.util.ConditionQuery;
import com.luter.extjs.util.OrderBy;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

public interface BaseService {
    <T> T get(Class<T> entityName, Serializable id);

    <T> void save(T entity);

    <T> void saveOrUpdate(T entity);

    <T> void delete(T entity);

    <T> void deleteEntityById(Class entityName, Serializable id);

    <T> void deleteAllEntitie(Collection<T> entities);

    <T> void updateEntitie(T entity);

    <T> int countAll(Class<T> entityClass);

    <T> int getCountByConditionQuery(Class<T> entityClass, ConditionQuery query);

    <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value);

    <T> List<T> loadAll(final Class<T> entityClass);

    <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value);
    <T> List<T> listPageByConditionQueryInOrderWithOffset(Class<T> entityClass, ConditionQuery query, OrderBy orderBy, final int offset, final int pageSize);
}
