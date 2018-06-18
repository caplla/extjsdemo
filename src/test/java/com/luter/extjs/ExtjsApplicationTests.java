package com.luter.extjs;


import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.entity.sys.TSUser;
import com.luter.extjs.security.shiro.endecrypt.UserEndecrypUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest
public class ExtjsApplicationTests {

    @Autowired
    BaseService ss;

    @Test
    public void contextLoads() {

        TSUser user = UserEndecrypUtils.CreateUserWithUsernameAndMD5Password("admin","aaaaaa");
        user.setReserved(true);
        ss.save(user);
    }

}
