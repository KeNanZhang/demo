package com.zdst.scs.supper;

import java.io.Serializable;

/**
 * Created by lxh on 2018/9/4.
 */
public class ResultObject implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = -494394782736406771L;

    public static final int SUCCESS = 200;

    public static final int TOKEN_INVALID = 201;

    public static final int REFRESH_TOKEN_INVALID = 202;

    public static final int FAIL = 500;

    private int code;

    private String msg;

    private Object data;

    public static ResultObject getSuccessResult(String msg, Object data) {
        return getResultObject(msg, data, SUCCESS);
    }

    public static ResultObject getSuccessResult(String msg) {
        ResultObject result = new ResultObject();
        result.setCode(SUCCESS);
        result.setMsg(msg);
        return result;
    }

    public static ResultObject getFailResult(String msg) {
        ResultObject result = new ResultObject();
        result.setCode(FAIL);
        result.setMsg(msg);
        return result;
    }

    public static ResultObject getFailResult(String msg, Object data) {
        return getResultObject(msg, data, FAIL);
    }

    private static ResultObject getResultObject(String msg, Object data, int code) {
        ResultObject result = new ResultObject();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

    public ResultObject success(String msg){
        this.setCode(SUCCESS);
        this.setMsg(msg);
        return this;
    }

    public ResultObject success(String msg, Object data){
        this.setCode(SUCCESS);
        this.setMsg(msg);
        this.setData(data);
        return this;
    }

    public ResultObject fail(String msg){
        this.setCode(FAIL);
        this.setMsg(msg);
        return this;
    }
    public ResultObject fail(String msg, Object data){
        this.setCode(FAIL);
        this.setMsg(msg);
        this.setData(data);
        return this;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }


    public boolean isSuccess() {
        return code == SUCCESS;
    }

    public boolean isFail() {
        return code != SUCCESS;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public void setSuccess(boolean success) {
        if(success){
            this.code = SUCCESS;
        }else{
            this.code = FAIL;
        }
    }

    public void setFail(boolean fail) {
        if(fail){
            this.code = FAIL;
        }else{
            this.code = SUCCESS;
        }
    }

}
