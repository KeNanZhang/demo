package com.zdst.scs.supper;

/**
 * Created by lxh on 2018/7/24.
 */
public class ResultNoFindContent {
    /*错误码，0为成功，其他值为对应错误码*/
    private int err;
    /*错误消息，err为0时值为”OK”*/
    private String errMsg;
    /*err为0时，返回应用令牌*/
    private String token;

    public int getErr() {
        return err;
    }

    public void setErr(int err) {
        this.err = err;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    /**
     * 新增修改
     * @param status
     * @param token
     * @return
     */
    public static ResultNoFindContent getInstances(Integer status, String errMsg,String token) {
        ResultNoFindContent resultContent = initResultContents(status,errMsg,token);
        return resultContent;
    }

    /**
     * 设置返回的数据
     * @param status
     * @return
     */
    private static ResultNoFindContent initResultContents(Integer status,String errMsg, String token) {
        ResultNoFindContent resultContent = new ResultNoFindContent();
        return intResultContent(resultContent, status,errMsg, token);
    }

    /**
     *新增修改
     * @param resultContent
     * @param status
     * @param token
     * @return
     */
    private static ResultNoFindContent intResultContent(ResultNoFindContent resultContent, Integer status,String errMsg, String token) {
        if (status==1) {
            resultContent.setErr(0);
            resultContent.setErrMsg(errMsg);
            resultContent.setToken(token);
            return resultContent;
        }else{
            resultContent.setErr(1);
            resultContent.setErrMsg(errMsg);
        }
        return resultContent;
    }
}
