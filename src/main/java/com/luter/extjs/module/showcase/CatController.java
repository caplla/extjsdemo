package com.luter.extjs.module.showcase;

import com.luter.extjs.base.controller.BaseController;
import com.luter.extjs.entity.showcase.TShowCaseCat;
import com.luter.extjs.service.base.BaseService;
import com.luter.extjs.util.dao.ConditionQuery;
import com.luter.extjs.util.ext.ExtDataModel;
import com.luter.extjs.util.ext.ExtPager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/showcase/cat")
public class CatController extends BaseController {

    @Autowired
    BaseService ss;

    @GetMapping("/get")
    public Object get(HttpServletRequest request) {
        return ResponseEntity.ok("");
    }

    @GetMapping("/list")
    public Object list(HttpServletRequest request, ExtPager pager) {
        ConditionQuery query = new ConditionQuery();
        return ResponseEntity.ok(ss.listPageByConditionQuery(TShowCaseCat.class, query, pager));
    }

    @PostMapping("/add")
    public Object add(HttpServletRequest request, TShowCaseCat obj) {
        ss.save(obj);
        return new ExtDataModel<>().ok("添加成功");
    }

    @PostMapping("/add/batch")
    public Object batchAdd(HttpServletRequest request, @RequestBody List<TShowCaseCat> objs) {
        //这里什么验证都没做,这是不对的.
        if (null != objs && objs.size() > 0) {
            objs.forEach(o -> ss.save(o));
            return new ExtDataModel<>().ok("添加成功");
        } else {
            return new ExtDataModel<>().ok("没有数据被添加");
        }

    }

    @PostMapping("/update")
    public Object update(HttpServletRequest request, TShowCaseCat obj) {
        return new ExtDataModel<>().ok("修改");
    }

    @PostMapping("/delete")
    public Object delete(HttpServletRequest request, TShowCaseCat obj) {
        TShowCaseCat cat = ss.get(TShowCaseCat.class, obj.getId());
        if (null != cat) {
            ss.delete(cat);
        }
        return new ExtDataModel<>().ok("删除成功");
    }
}
