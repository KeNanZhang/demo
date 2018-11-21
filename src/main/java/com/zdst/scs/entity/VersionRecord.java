package com.zdst.scs.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class VersionRecord {
    /**
     * 
     */
    private Long id;

    /**
     * 项目id
     */
    private Long projectID;

    /**
     * 上传app类型（1-android  2-ios）
     */
    private Byte appType;

    /**
     * 上传的文件id
     */
    private Long versionFileID;

    /**
     * 版本号
     */
    private String versionCode;

    /**
     * 更新的内容
     */
    private String upgradeInfo;

    /**
     * 是否强制更新(0-否  1-是)
     */
    private Byte lastForce;

    /**
     * 上传版本用户
     */
    private Long uploadUserID;

    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 是否为最新记录 1 最新 0 历史   默认为0
     */
    private int isNew;

    /**
     * 
     * @return id 
     */
    public Long getId() {
        return id;
    }

    /**
     * 
     * @param id 
     */
    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectID() {
        return projectID;
    }

    public void setProjectID(Long projectID) {
        this.projectID = projectID;
    }

    public Byte getAppType() {
        return appType;
    }

    public void setAppType(Byte appType) {
        this.appType = appType;
    }

    public Long getVersionFileID() {
        return versionFileID;
    }

    public void setVersionFileID(Long versionFileID) {
        this.versionFileID = versionFileID;
    }

    public String getVersionCode() {
        return versionCode;
    }

    public void setVersionCode(String versionCode) {
        this.versionCode = versionCode;
    }

    public String getUpgradeInfo() {
        return upgradeInfo;
    }

    public void setUpgradeInfo(String upgradeInfo) {
        this.upgradeInfo = upgradeInfo;
    }

    public Byte getLastForce() {
        return lastForce;
    }

    public void setLastForce(Byte lastForce) {
        this.lastForce = lastForce;
    }

    public Long getUploadUserID() {
        return uploadUserID;
    }

    public void setUploadUserID(Long uploadUserID) {
        this.uploadUserID = uploadUserID;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getIsNew() {
        return isNew;
    }

    public void setIsNew(int isNew) {
        this.isNew = isNew;
    }
}