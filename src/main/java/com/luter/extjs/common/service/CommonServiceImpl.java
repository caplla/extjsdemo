package com.luter.extjs.common.service;


import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.common.util.OrderBy;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.model.DataModel;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.math.BigInteger;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional
public abstract class CommonServiceImpl implements CommonService {
    static final int DEFAULT_PAGE_SIZE = 100;
    static final int DEFAULT_PAGE_NO = 1;
    static final int DEFAULT_OFFSET = 0;//从第几个记录开始
    @PersistenceContext
    private EntityManager em;

    private Session getSession() {
        return em.unwrap(Session.class);
    }

    @Override
    public <T> T get(Class<T> entityName, Serializable id) {
        if (null == id || id.equals(null) || id.equals("")) {
            return null;
        }
        return entityName.cast(getSession().get(entityName, id));
    }

    @Override
    public <T> void save(T entity) {
        getSession().save(entity);
        getSession().flush();
    }

    @Override
    public <T> void saveOrUpdate(T entity) {
        getSession().saveOrUpdate(entity);
        getSession().flush();
    }

    @Override
    public <T> void delete(T entity) {
        getSession().delete(getSession().merge(entity));
        getSession().flush();
    }

    @Override
    public <T> void deleteEntityById(Class entityName, Serializable id) {
        Object aT = get(entityName, id);
        if (null != aT) {
            getSession().delete(aT);
            getSession().flush();
        } else {
            log.error("Object that to delete is not found.");
        }
    }

    @Override
    public <T> void deleteAllEntitie(Collection<T> entities) {
        for (Object entity : entities) {
            getSession().delete(getSession().merge(entity));
        }
        getSession().flush();
    }

    @Override
    public <T> void updateEntitie(T entity) {
        getSession().update(entity);
        getSession().flush();
    }

    @Override
    public <T> int countAll(Class<T> entityClass) {
        String HQL_COUNT_ALL = " select count(*) from  " + entityClass.getSimpleName();
        Long total = aggregate(HQL_COUNT_ALL);
        return total.intValue();
    }

    @Override
    public <T> int getCountByConditionQuery(Class<T> entityClass, ConditionQuery query) {
        Criteria criteria = getSession().createCriteria(entityClass);
        query.build(criteria);
        int recordCount = Integer.parseInt((criteria.setProjection(Projections
                .rowCount()).uniqueResult()).toString());
        criteria.setProjection(null);
        return recordCount;
    }

    @Override
    public <T> List<T> findListbySql(String query, Class<T> entity) {
        Query querys = getSession().createSQLQuery(query).addEntity(entity);
        return querys.list();
    }

    @Override
    public <T> List<T> findByProperty(Class<T> entityClass, String propertyName, Object value) {
        return createCriteria(entityClass, Restrictions.eq(propertyName, value)).list();
    }

    @Override
    public <T> List<T> loadAll(Class<T> entityClass) {
        return createCriteria(entityClass).list();
    }

    @Override
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        Assert.hasText(propertyName, "propertyName不能为空");
        return (T) createCriteria(entityClass, Restrictions.eq(propertyName, value)).uniqueResult();
    }

    @Override
    public <T> List<T> listPageByConditionQueryInOrderWithOffset(Class<T> entityClass, ConditionQuery query, OrderBy orderBy, int offset, int pageSize) {
        Criteria criteria = getSession().createCriteria(entityClass);
        query.build(criteria);
        orderBy.build(criteria);
        offset = offset < DEFAULT_OFFSET ? DEFAULT_OFFSET : offset;
        pageSize = pageSize < 0 || pageSize > DEFAULT_PAGE_SIZE ? DEFAULT_PAGE_SIZE : pageSize;
        criteria.setFirstResult(offset);
        criteria.setMaxResults(pageSize);
        return criteria.list();
    }

    @Override
    public Boolean exist(String sql) {
        SQLQuery query = getSession().createSQLQuery(sql);
        BigInteger count = (BigInteger) query.uniqueResult();
        return count.intValue() > 0 ? true : false;
    }

    @Override
    public <T> Boolean exist(Class<T> entityClass, String propertyName, Object value) {
        List<T> t = findByProperty(entityClass, propertyName, value);
        return (null != t && t.size() > 0);
    }


    @Override
    public List<Map<String, Object>> listBySQL(String sql) {
        SQLQuery sqlQuery = getSession().createSQLQuery(sql);
        sqlQuery.setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP);
        return sqlQuery.list();
    }

    @Override
    public List<Map<String, Object>> listPageBySQLwithOffset(String sql, int start, int limit) {
        start = start < 0 ? 0 : start;
        limit = (limit < 0 || limit > DEFAULT_PAGE_SIZE) ? DEFAULT_PAGE_SIZE : limit;
        SQLQuery sqlQuery = getSession().createSQLQuery(sql);
        sqlQuery.setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP);
        sqlQuery.setFirstResult(start);
        sqlQuery.setMaxResults(limit);
        return sqlQuery.list();
    }

    @Override
    public List<Map<String, Object>> listPageBySQLwithPageNo(String sql, int pageNo, int pageSize) {
        pageNo = pageNo < 1 ? 1 : pageNo;
        pageSize = (pageSize < 0 || pageSize > DEFAULT_PAGE_SIZE) ? DEFAULT_PAGE_SIZE : pageSize;
        int start = (pageNo - 1) * pageSize;
        SQLQuery sqlQuery = getSession().createSQLQuery(sql);
        sqlQuery.setResultTransformer(CriteriaSpecification.ALIAS_TO_ENTITY_MAP);
        sqlQuery.setFirstResult(start);
        sqlQuery.setMaxResults(pageSize);
        return sqlQuery.list();
    }

    @Override
    public <T> DataModel<T> listPageByConditionQuery(Class entityClass, ConditionQuery query, ExtPager pager) {
        int start = pager.getStart();
        int size = pager.getLimit();
        start = start < 0 ? 0 : start;
        size = (size < 0 || size > DEFAULT_PAGE_SIZE) ? DEFAULT_PAGE_SIZE : size;
        OrderBy orderBy = pager.getOrder();
        List<T> data = listPageByConditionQueryInOrderWithOffset(entityClass, query, orderBy, start, size);
        int total = getCountByConditionQuery(entityClass, query);
        DataModel<T> dataModel = new DataModel<>().ok(data, total);
        return dataModel;
    }

    private <T> Criteria createCriteria(Class<T> entityClass, Criterion... criterions) {
        Criteria criteria = getSession().createCriteria(entityClass);
        for (Criterion c : criterions) {
            criteria.add(c);
        }
        return criteria;
    }

    private void setParameters(Query query, Object[] paramlist) {
        if (null != paramlist) {
            for (int i = 0; i < paramlist.length; i++) {
                if (paramlist[i] instanceof Date) {
                    query.setTimestamp(i, (Date) paramlist[i]);
                } else {
                    query.setParameter(i, paramlist[i]);
                }
            }
        }
    }

    private <T> T aggregate(final String hql, final Object... paramlist) {
        Query query = getSession().createQuery(hql);
        setParameters(query, paramlist);
        return (T) query.uniqueResult();

    }
    @Override
    public <T> List<T> listByConditionQuery(Class<T> entityClass, ConditionQuery query) {
        Criteria criteria = getSession().createCriteria(entityClass);
        query.build(criteria);
        return criteria.list();
    }

    @Override
    public Integer executeHQL(String hql) {
        Query query = getSession().createQuery(hql);
        Object result = query.executeUpdate();
        return result == null ? 0 : ((Integer) result).intValue();
    }
}
