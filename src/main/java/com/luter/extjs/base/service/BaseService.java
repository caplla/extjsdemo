package com.luter.extjs.base.service;


import com.luter.extjs.common.service.CommonService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.utils.ext.ExtPager;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;

public interface BaseService extends CommonService {
    /**
     * 从缓存中获取当前登录用户
     *
     * @return the current user
     */
    TSUser getCurrentUser();

    /**
     * 获取当前登录用户
     *
     * @param fromDB 是否从数据库获取
     * @return 从数据库查到的当前登录用户
     */
    TSUser getCurrentUser(boolean fromDB);

    /**
     * 设置这个用户的角色ID
     *
     * @param dbuser the dbuser
     * @return the user roles data
     */
    TSUser setUserRolesData(TSUser dbuser);

    /**
     * List ext page list.
     *
     * @param <T>         the type parameter
     * @param entityClass the entity class
     * @param query       the query
     * @param pager       the pager
     * @return the list
     */
    <T> ResponseEntity listExtPage(Class<T> entityClass, ConditionQuery query, ExtPager pager);


    /**
     * 记录访问日志(入库可选)
     *
     * @param request    the request
     * @param logContent the log content
     * @param save       the save 是否入库？
     */
    void log(HttpServletRequest request, String logContent, boolean save);


    /**
     * 记录访问日志
     *
     * @param request    the request
     * @param logContent 日志内容
     * @param logType    日志类型
     * @param saved      是否保存到数据库？false则仅仅显示日志，true显示完毕保存到数据库
     */
    void log(HttpServletRequest request, String logContent, String logType, boolean saved);
}
