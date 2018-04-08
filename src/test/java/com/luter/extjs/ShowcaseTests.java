package com.luter.extjs;

import com.luter.extjs.entity.showcase.TSTree;
import com.luter.extjs.service.base.BaseService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ShowcaseTests {

    @Autowired
    BaseService ss;

    @Test
    public void addTreeData() {
        TSTree tree = new TSTree();
        tree.setIconcls("fa-bars");
        tree.setPid("40f5770b-d663-46fb-a086-223afc10e681");
        tree.setTitle("爸爸");
        ss.save(tree);
    }

}
