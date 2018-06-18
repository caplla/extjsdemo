package com.luter.extjs.module.pet.controller;

import com.luter.extjs.base.aop.SysLog;
import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.base.service.BaseService;
import com.luter.extjs.common.util.ConditionQuery;
import com.luter.extjs.entity.pet.TPCat;
import com.luter.extjs.utils.ext.ExtPager;
import com.luter.extjs.utils.web.ResponseUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@Slf4j
@RequestMapping("/pet/cat")
public class CatController extends BaseController {
    @Autowired
    private BaseService ss;

    @PostMapping("/list")
    @SysLog(content = "查看列表")
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        return ss.listExtPage(TPCat.class, query, pager);
    }

    @PostMapping("/add")
    @SysLog(content = "新增")
    public Object add(HttpServletRequest request, TPCat obj) {
        ss.save(obj);
        return ResponseUtils.ok("添加成功");
    }

    @PostMapping("/update")
    @SysLog(content = "修改")
    public Object update(HttpServletRequest request, TPCat obj) {
        TPCat record = ss.get(TPCat.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }
        record.setAge(obj.getAge());
        record.setName(obj.getName());
        record.setRemarks(obj.getRemarks());
        ss.updateEntitie(record);
        return ResponseUtils.ok("修改成功", record);
    }

    @PostMapping("/view")
    @SysLog(content = "根据ID查看")
    public Object view(HttpServletRequest request, TPCat obj) {
        TPCat record = ss.get(TPCat.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:查找的数据不存在");
        }

        return ResponseUtils.ok(record);
    }

    @PostMapping("/delete")
    @SysLog(content = "删除")
    public Object delete(HttpServletRequest request, TPCat obj) {
        TPCat record = ss.get(TPCat.class, obj.getId());
        if (null == record) {
            return ResponseUtils.fail("错误:要修改的数据不存在");
        }
        ss.delete(record);
        return ResponseUtils.ok("数据删除成功", record);
    }
}
