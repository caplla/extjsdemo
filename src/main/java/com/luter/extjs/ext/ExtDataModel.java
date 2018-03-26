package com.luter.extjs.ext;

import lombok.Data;
import lombok.extern.log4j.Log4j;

import java.io.Serializable;

@Data
public class ExtDataModel<T> implements Serializable {
    /**
     * The constant serialVersionUID.
     */
    private static final long serialVersionUID = -1137551930346799282L;
    /**
     * 从业务层面判断，本次操作是否成功
     */
    private boolean success = true;
    /**
     * 返回的消息
     */
    private String message = "";
    /**
     * 异常调试信息
     */
    private String error = "";
    /**
     * 系统自定义错误码
     */
    private int code = 200;
    /**
     * 携带的数据，可以是单个对象，也可以是list map 等
     */
    private T data = null;
    /**
     * 如果返回了列表数据，此类数据总数是多少?
     */
    private int total = 0;

    /**
     * Instantiates a new Data model.
     */
    public ExtDataModel() {
    }

    /**
     * 返回失败信息
     *
     * @param message the message
     * @return the data model
     */
    public ExtDataModel fail(String message) {
        this.success = false;
        this.message = message;
        return this;
    }

    /**
     * 返回失败信息
     *
     * @param message 错误提示信息
     * @param error   程序错误
     * @return the data model
     */
    public ExtDataModel fail(String message, String error) {
        this.success = false;
        this.message = message;
        this.error = error;
        return this;
    }

    /**
     * Fail data model.
     *
     * @param code    错误码,默认200
     * @param message 错误提示信息
     * @param error   程序错误
     * @return the data model
     */
    public ExtDataModel fail(int code, String message, String error) {
        this.success = false;
        this.code = code;
        this.message = message;
        this.error = error;
        return this;
    }

    public ExtDataModel fail(int code, String message) {
        this.success = false;
        this.code = code;
        this.message = message;
        return this;
    }

    /**
     * 返回成功信息
     *
     * @param message the message
     * @return the data model
     */
    public ExtDataModel ok(String message) {
        this.success = true;
        this.message = message;
        return this;
    }

    /**
     * 返回成功信息，带数据
     *
     * @param message the message
     * @param data    the data
     * @return the data model
     */
    public ExtDataModel ok(String message, T data) {
        this.success = true;
        this.message = message;
        this.data = data;
        return this;
    }

    /**
     * 成功返回数据
     *
     * @param data the data
     * @return the data model
     */
    public ExtDataModel ok(int total, T data) {
        this.success = true;
        this.message = "success";
        this.data = data;
        this.total = total;
        return this;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param message the message
     */
    public ExtDataModel(String message) {
        this.success = true;
        this.message = message;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param message the message
     * @param data    the data
     */
    public ExtDataModel(String message, T data) {
        this.message = message;
        this.success = true;
        this.data = data;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param success the success
     * @param message the message
     */
    public ExtDataModel(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param data the data
     */
    public ExtDataModel(T data) {
        this.success = true;
        this.data = data;
    }
}
