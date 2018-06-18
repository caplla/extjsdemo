package com.luter.extjs.utils.model;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用消息返回定义
 */
@Data
public class DataModel<T> implements Serializable {
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

    private int count;

    /**
     * Instantiates a new Data model.
     */
    public DataModel() {
    }

    /**
     * 返回失败信息
     *
     * @param message the message
     * @return the data model
     */
    public DataModel fail(String message) {
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
    public DataModel fail(String message, String error) {
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
    public DataModel fail(int code, String message, String error) {
        this.success = false;
        this.code = code;
        this.message = message;
        this.error = error;
        return this;
    }

    public DataModel fail(int code, String message) {
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
    public DataModel ok(String message) {
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
    public DataModel ok(String message, T data) {
        this.success = true;
        this.message = message;
        this.data = data;
        return this;
    }

    public DataModel ok(T data, int count) {
        this.success = true;
        this.message = "success";
        this.data = data;
        this.count = count;
        return this;
    }

    /**
     * 成功返回数据
     *
     * @param data the data
     * @return the data model
     */
    public DataModel ok(T data) {
        this.success = true;
        this.message = "success";
        this.data = data;
        return this;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param message the message
     */
    public DataModel(String message) {
        this.success = true;
        this.message = message;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param message the message
     * @param data    the data
     */
    public DataModel(String message, T data) {
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
    public DataModel(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    /**
     * Instantiates a new Data model.
     *
     * @param data the data
     */
    public DataModel(T data) {
        this.success = true;
        this.data = data;
    }
}
