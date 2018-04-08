package com.luter.extjs.util.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.sql.JoinType;

import java.util.*;
public class ConditionQuery {

    private List<Criterion> criterions = new ArrayList<Criterion>();

    private Map<String, String> aliasMap = new HashMap<String, String>();

    public void add(Criterion criterion) {
        criterions.add(criterion);
    }

    public void createAlias(String key, String alias) {
        aliasMap.put(key, alias);
    }

    @SuppressWarnings("unchecked")
    public void build(Criteria criteria) {
        if (!aliasMap.isEmpty()) {
            for (Iterator iterator = aliasMap.keySet().iterator(); iterator.hasNext(); ) {
                String keyString = (String) iterator.next();
                String aliasString = aliasMap.get(keyString);
                criteria.createAlias(keyString, aliasString, JoinType.LEFT_OUTER_JOIN);
            }
        }
        for (Criterion criterion : criterions) {
            criteria.add(criterion);
        }
    }


}
