package com.luter.extjs.base.exception;


public class LuterException extends RuntimeException {

    public LuterException(String message) {
        super(message);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    /**
     * The Code.
     */
    private int code;

    /**
     * Instantiates a new Api exception.
     *
     * @param code the code
     */
    public LuterException(int code) {
        this.code = code;
    }

    /**
     * Instantiates a new Api exception.
     *
     * @param message the message
     * @param cause   the cause
     * @param code    the code
     */
    public LuterException(String message, Throwable cause, int code) {
        super(message, cause);
        this.code = code;
    }

    /**
     * Instantiates a new Api exception.
     *
     * @param code    the code
     * @param message the message
     */
    public LuterException(int code, String message) {
        super(message);
        this.code = code;
    }
}
