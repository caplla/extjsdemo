package com.luter.extjs.service.base;


import com.luter.extjs.util.dao.ConditionQuery;
import com.luter.extjs.util.dao.OrderBy;
import com.luter.extjs.util.ext.ExtDataModel;
import com.luter.extjs.util.ext.ExtPager;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@Transactional
public class BaseServiceImpl implements BaseService {
    static final int DEFAULT_PAGE_SIZE = 20;
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
        Assert.hasText(propertyName, "propertyName不能为空");
        return createCriteria(entityClass, Restrictions.eq(propertyName, value)).list();
    }

    @Override
    public <T> List<T> loadAll(Class<T> entityClass) {
        return createCriteria(entityClass).list();
    }

    @Override
    public <T> T findUniqueByProperty(Class<T> entityClass, String propertyName, Object value) {
        return null;
    }

    @Override
    public <T> List<T> listPageByConditionQueryInOrderWithOffset(Class<T> entityClass, ConditionQuery query, OrderBy orderBy, int offset, int pageSize) {
        Criteria criteria = getSession().createCriteria(entityClass);
        query.build(criteria);
        orderBy.build(criteria);
        offset = offset < DEFAULT_OFFSET ? DEFAULT_OFFSET : offset;
        pageSize = pageSize < 1 || pageSize > DEFAULT_PAGE_SIZE ? DEFAULT_PAGE_SIZE : pageSize;
        log.info("pageSize:" + pageSize + ",offset:" + offset);
        criteria.setFirstResult(offset);
        criteria.setMaxResults(pageSize);
        return criteria.list();
    }

    @Override
    public <T> ExtDataModel<T> listPageByConditionQuery(Class entityClass, ConditionQuery query, ExtPager pager) {
        int start = pager.getStart();
        int size = pager.getLimit();
        start = start < 0 ? 0 : start;
        size = (size < 1 || size > DEFAULT_PAGE_SIZE) ? DEFAULT_PAGE_SIZE : size;
        OrderBy orderBy = pager.getOrder();
        List<T> data = listPageByConditionQueryInOrderWithOffset(entityClass, query, orderBy, start, size);
        int total = getCountByConditionQuery(entityClass, query);
        ExtDataModel<T> dataModel = new ExtDataModel<>().ok(total, data);
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
}
