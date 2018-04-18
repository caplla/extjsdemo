package com.luter.extjs;

import com.luter.extjs.base.config.R;
import com.luter.extjs.entity.sys.*;
import com.luter.extjs.security.shiro.endecrypt.UserEndecrypUtils;
import com.luter.extjs.service.base.BaseService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ExtjsApplicationTests {

    @Autowired
    BaseService ss;

    @Test
    public void contextLoads() {
    }

    @Test
    public void addUser() {
        TSUser user = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password("admin", "aaaaaa");
        ss.save(user);
    }

    @Test
    public void addRole() {
        TSRole role = new TSRole();
        role.setName("admin");
        role.setRemarks("系统管理员");
        role.setReserved(true);
        ss.save(role);
    }

    @Test
    public void addRoleUser() {
        TSRole role = ss.get(TSRole.class,"20aaa211-3889-4773-aea3-c48e895dc51a");

        role.setReserved(true);
        ss.updateEntitie(role);
    }

    @Test
    public void addResource() {
        TSResource resource = new TSResource();
        resource.setName("可编辑表格");
        resource.setIconCls("fa fa-tree");
        resource.setPid("7c50bfba-e844-4497-ad79-4ba17a6f4e7f");
        resource.setRes_type(R.resourceType.module);
        resource.setModule_id("showcase.CatController");
        resource.setQtip("可编辑表格的修改和提交示例");
        ss.save(resource);
    }

    @Test
    public void addRoleResource() {
        TSResource resource = new TSResource();
        resource.setId("70a084af-5720-4a7c-98be-d80a6c52b651");
        TSRole role = new TSRole();
        role.setId("20aaa211-3889-4773-aea3-c48e895dc51a");
        TSRoleResource roleResource = new TSRoleResource();
        roleResource.setResource(resource);
        roleResource.setRole(role);
        ss.save(roleResource);
    }

    @Test
    public void addAllRoleResource() {
        TSRole role = new TSRole();
        role.setId("20aaa211-3889-4773-aea3-c48e895dc51a");
        List<TSResource> resources = ss.loadAll(TSResource.class);
        if (resources.size() > 0) {
            List<TSRoleResource> exist = ss.findByProperty(TSRoleResource.class, "role", role);
            ss.deleteAllEntitie(exist);
            for (TSResource resource : resources) {
                TSRoleResource roleResource = new TSRoleResource();
                roleResource.setRole(role);
                roleResource.setResource(resource);
                ss.save(roleResource);
            }
        }
    }
}
