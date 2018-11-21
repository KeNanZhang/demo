package com.zdst.scs.dto.versionManage;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.zdst.scs.dto.BaseDTO;

import java.util.Date;

public class VersionRecordDTO extends BaseDTO{
    /**
     * 
     */
    private Long id;

    /**
     * 项目id
     */
    private Long projectID;

    private String projectKey;
    /**
     * 项目名称
     */
    private String projectName;

    /**
     * 项目描述

     */
    private String description;

    /**
     * 上传app类型（1-android  2-ios）
     */
    private Byte appType;
    /**
     * 包名
     */
    private String packageName;

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
     * 上传版本用户名
     */
    private String uploadUserName;

    /**
     * 创建时间
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createTime;

    /**
     * 更新文件路径
     */
    private String filePath;
    /**
     * plist文件路径
     */
    private String plistFilePath;

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

    public String getUploadUserName() {
        return uploadUserName;
    }

    public void setUploadUserName(String uploadUserName) {
        this.uploadUserName = uploadUserName;
    }
    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getPlistFilePath() {
        return plistFilePath;
    }

    public void setPlistFilePath(String plistFilePath) {
        this.plistFilePath = plistFilePath;
    }
}