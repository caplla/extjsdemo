package com.luter.extjs.util.ext;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.luter.extjs.util.dao.OrderBy;
import org.hibernate.criterion.Order;
import org.thymeleaf.util.StringUtils;

import java.util.List;


/**
 * Ext的分页请求对象
 */
public class ExtPager {

    private Integer limit;
    private Integer start;
    private Integer page;
    private String sort;

    /**
     * @return the limit
     */
    public Integer getLimit() {
        if (null == limit || limit <= 0) {
            this.limit = 12;
        }
        return limit;
    }

    /**
     * @param limit the limit to set
     */
    public void setLimit(Integer limit) {

        this.limit = limit;
    }

    /**
     * @return the start
     */
    public Integer getStart() {
        if (null == start || start < 0) {
            this.start = 0;
        }
        return start;
    }

    /**
     * @param start the start to set
     */
    public void setStart(Integer start) {
        this.start = start;
    }


    public Integer getPage() {
        return page < 1 ? 1 : page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    /**
     * @return the sort
     */
    public String getSort() {
        return sort;
    }

    /**
     * @param sort the sort to set
     */
    public void setSort(String sort) {
        this.sort = sort;
    }

    public OrderBy getOrder() {

        Gson gson = new Gson();
        OrderBy ob = new OrderBy();
        List<ExtSorter> sd = gson.fromJson(this.getSort(),
                new TypeToken<List<ExtSorter>>() {
                }.getType());
        if (sd != null && sd.size() > 0) {
            for (ExtSorter s : sd) {
                if (org.apache.commons.lang3.StringUtils.isNotEmpty(s.getProperty())) {
                    if (s.getDirection().equals("DESC")
                            || s.getDirection().equals("ASC")) {
                        if (StringUtils.equals("DESC", s.getDirection())) {
                            ob.add(Order.desc(s.getProperty()));
                        } else {
                            ob.add(Order.asc(s.getProperty()));

                        }
                    }

                }

            }
        }
        return ob;
    }

    @Override
    public String toString() {
        return "ExtPager4 [limit=" + limit + ", page=" + page + ", sort="
                + sort + ", start=" + start + "]";
    }

}
