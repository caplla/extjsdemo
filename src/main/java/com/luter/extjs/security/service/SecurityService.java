package com.luter.extjs.security.service;




import com.luter.extjs.entity.sys.TSResource;
import com.luter.extjs.entity.sys.TSUser;

import java.util.List;
import java.util.Map;

public interface SecurityService {
    TSUser findUserByUsername(String username);
    List<TSResource> getAllResouces();
    List<TSResource> getUsersResourceByUserId(String uid);
    Map<String, String> loadFilterChainDefinitions();
    void updatePermission();
}
