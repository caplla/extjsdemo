package com.luter.extjs.base.service;

import com.luter.extjs.common.service.CommonServiceImpl;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.sys.TSLog;
import com.luter.extjs.entity.sys.TSRole;
import com.luter.extjs.entity.sys.TSRoleUser;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.json.JacksonUtil;
import com.luter.extjs.utils.web.BrowserUtils;
import com.luter.extjs.utils.web.RequestIpUtils;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.subject.Subject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.Table;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Slf4j
@Transactional
@Service
public class BaseServiceImpl extends CommonServiceImpl implements BaseService {
    @Override
    public TSUser getCurrentUser() {
        TSUser user = null;
        Subject subject = SecurityUtils.getSubject();
        if (null != subject.getPrincipal()) {
            user = (TSUser) subject.getPrincipal();
        }
        return user;
    }


    @Override
    public TSUser getCurrentUser(boolean fromDB) {
        TSUser user = getCurrentUser();
        if (null != user) {
            TSUser dbuser = get(TSUser.class, user.getId());
            if (null != dbuser) {
                setUserRolesData(dbuser);
                return dbuser;
            } else {
                log.error("用户:{},在session中存在，但是在数据库中没找到,强制登出", user.getId());
                Subject subject = SecurityUtils.getSubject();
                subject.logout();
                throw new UnauthenticatedException("请登录");
            }

        }
        return user;
    }

    @Override
    public TSUser setUserRolesData(TSUser dbuser) {
        if (null != dbuser) {
            log.debug("从数据库获取当前登录用户:{}", JacksonUtil.objectToJson(dbuser));
            String sql = "select id  ,name from " + TSRole.class.getAnnotation(Table.class).name()
                    + "  where id in ( select role from " + TSRoleUser.class.getAnnotation(Table.class).name()
                    + "  where user = '" + dbuser.getId() + "')";
            List<Map<String, Object>> ids = listBySQL(sql);
            String roles = "";
            if (ids.size() > 0) {
                for (int i = 0; i < ids.size(); i++) {
                    if (i + 1 == ids.size()) {
                        roles += ids.get(i).get("id").toString();
                    } else {
                        roles += ids.get(i).get("id").toString() + ",";
                    }

                }
                dbuser.setRoles(roles);
            }
        }
        return dbuser;
    }

    @Override
    public <T> ResponseEntity listExtPage(Class<T> entityClass, ConditionQuery query, ExtPager pager) {
        return ResponseUtils.ok(
                listPageByConditionQueryInOrderWithOffset(entityClass, query, pager.getOrder(), pager.getStart(), pager.getLimit())
                , getCountByConditionQuery(entityClass, query));
    }


    @Override
    public void log(HttpServletRequest request, String logContent, boolean save) {
        this.log(request, logContent, "SYS", save);
    }


    @Override
    public void log(HttpServletRequest request, String logContent, String logType, boolean saved) {
        StringBuilder rparams = new StringBuilder();
        int index = 0;
        for (Object param : request.getParameterMap().keySet()) {
            rparams.append((index++ == 0 ? "" : "&") + param + "=");
            rparams.append(request.getParameter((String) param));
        }
        String clientIp = RequestIpUtils.getIpAddr(request);
        log.info("日志:[{}],对端IP:[{}],请求参数是:[{}],请求内容:[{}]====",
                logType, clientIp, rparams.toString(), logContent);
        if (saved) {
            TSLog log = new TSLog();
            log.setClient_ip(clientIp);
            log.setRequest_method(request.getMethod());
            log.setRequest_time(new Date());
            log.setRequest_url(request.getRequestURI());
            log.setUser_agent(request.getHeader("User-Agent"));
            log.setRequest_params(rparams.toString());
            log.setBrowser_type(BrowserUtils.checkBrowse(request));
            log.setContent(logContent);
            log.setLog_class(logType);
            TSUser user = getCurrentUser();
            if (null != user) {
                log.setUserid(user.getId());
                log.setUsername(user.getUsername());
            }
            save(log);
        }


    }
}
