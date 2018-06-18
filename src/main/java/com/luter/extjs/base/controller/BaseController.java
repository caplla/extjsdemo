package com.luter.extjs.base.controller;

import org.springframework.ui.ModelMap;

import java.util.Calendar;

public abstract class BaseController {
    public static ModelMap getSysConfig() {
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        ModelMap prams = new ModelMap();
        prams.put("name", "Danye Extjs Demo");
        prams.put("version", "1.0.0");
        prams.put("year", year);
        prams.put("copyright", "©Danye All Right Reserved ™ ");
        prams.put("vendorname", "Danye INC © ");
        prams.put("productname", "Danye ™ ");
        return prams;
    }
}
