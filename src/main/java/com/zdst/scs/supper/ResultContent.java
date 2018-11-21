package com.zdst.scs.supper;

/**
 * Created by lxh on 2018/7/24.
 */
public class ResultContent {
    /*错误码，0为成功，其他值为对应错误码*/
    private int err;
    /*错误消息，err为0时值为”OK”*/
    private String errMsg;
    /*err为0时，返回应用令牌*/
    private String token;
    /*返回结果*/
    private Object content;

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

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }


    public static ResultContent getInstance(Object content,String token) {
        ResultContent resultContent = initResultContent(content,token);
        return resultContent;
    }

    /**
     * 设置返回的数据
     * @param content
     * @return
     */
    private static ResultContent initResultContent(Object content,String token) {
        ResultContent resultContent = new ResultContent();
        return initResultContent(resultContent, content, token);
    }

    /**
     *
     * @param resultContent
     * @param content
     * @param token
     * @return
     */
    private static ResultContent initResultContent(ResultContent resultContent, Object content, String token) {
        int err = 1;
        if (!ObjectIsNull.isNullOrEmpty(content)) {
            resultContent.setErr(0);
            resultContent.setErrMsg("OK");
            resultContent.setToken(token);
            resultContent.setContent(content);
            return resultContent;
        }

        if (ObjectIsNull.isNullOrEmpty(content)) {
            resultContent.setErr(1);
            resultContent.setErrMsg("出错了");
        } else {
            resultContent.setErr(0);
            resultContent.setErrMsg("OK");
        }
        return resultContent;
    }
}
