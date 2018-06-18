package com.luter.extjs.module.sys.controller;


import com.luter.extjs.base.aop.SysLog;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.TSLog;
import com.luter.extjs.utils.data.MyDateUtils;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@Slf4j
@RequestMapping("/sys/log")
public class LogController extends BaseController {
    @Autowired
    private BaseService ss;

    @PostMapping("/list")
    @SysLog
    public Object list(HttpServletRequest request, ExtPager pager) {
        String username = ServletRequestUtils.getStringParameter(request, "query", "");
        String startString = ServletRequestUtils.getStringParameter(request, "start_time", "");
        String endString = ServletRequestUtils.getStringParameter(request, "end_time", "");
        ConditionQuery query = new ConditionQuery();
        if (StringUtils.isNotEmpty(username)) {
            query.add(Restrictions.or(
                    Restrictions.like("username", username, MatchMode.ANYWHERE)
            ));
        }
        if (StringUtils.isNotEmpty(startString) && StringUtils.isNotEmpty(endString)) {
            query.add(Restrictions.between("request_time", MyDateUtils.strToDateLong(startString),
                    MyDateUtils.strToDateLong(endString)));
        }
        return ss.listExtPage(TSLog.class, query, pager);
    }


    @PostMapping("/delete/batch")
    @SysLog
    public Object deleteBatch(HttpServletRequest request, TSLog obj) {
        String idss[] = ServletRequestUtils.getStringParameters(request, "ids");
        if (null != idss && idss.length > 0) {
            for (int i = 0; i < idss.length; i++) {
                ss.executeHQL("delete TSLog  where id ='" + idss[i] + "'");
            }
        }
        log.info("没有要删除的日志IDS");
        return ResponseUtils.ok("删除成功");
    }
}
