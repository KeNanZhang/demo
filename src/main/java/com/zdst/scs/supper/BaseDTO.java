package com.zdst.scs.supper;

/**
 * Created by lxh on 2018/9/4.
 */
public class BaseDTO {
    protected int pageNum = 1;
    protected String createTime;
    protected String updateTime;
    protected Integer createUserID;
    protected Integer updateUserID;

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getCreateUserID() {
        return createUserID;
    }

    public void setCreateUserID(Integer createUserID) {
        this.createUserID = createUserID;
    }

    public Integer getUpdateUserID() {
        return updateUserID;
    }

    public void setUpdateUserID(Integer updateUserID) {
        this.updateUserID = updateUserID;
    }

    @Override
    public String toString() {
        return "BaseDTO{" +
                "pageNum=" + pageNum +
                ", createTime=" + createTime +
                ", updateTime=" + updateTime +
                ", createUserID=" + createUserID +
                ", updateUserID=" + updateUserID +
                '}';
    }
}
