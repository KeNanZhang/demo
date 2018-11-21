package com.zdst.scs.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class Project {
    /**
     * 
     */
    private Long id;

    /**
     * 项目名称
     */
    private String name;

    /**
     * 自动生成的key
     */
    private String projectKey;

    /**
     * 项目描述
     */
    private String description;

    /**
     * 是否需要android版本
     */
    private Byte isAndroid;

    /**
     * 安卓包名
     */
    private String androidPackage;

    /**
     * 是否需要ios版本
     */
    private Byte isIOS;

    /**
     * ios包名
     */
    private String iosPackage;

    /**
     * ios的plist文件地址
     */
    private String plistAddress;

    /**
     * 创建时间
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createTime;

    /**
     * 状态(1:可用 0:禁用)
     */
    private Byte status;

    /**
     * 创建用户id
     */
    private Long createUserID;

    /**
     * 最新版本记录id
     */
    private Long versionRecordID;

    private Long iosVersionRecordID;

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

    /**
     * 项目名称
     * @return name 项目名称
     */
    public String getName() {
        return name;
    }

    /**
     * 项目名称
     * @param name 项目名称
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }

    /**
     * 项目描述
     * @return description 项目描述
     */
    public String getDescription() {
        return description;
    }

    /**
     * 项目描述
     * @param description 项目描述
     */
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public String getAndroidPackage() {
        return androidPackage;
    }

    public void setAndroidPackage(String androidPackage) {
        this.androidPackage = androidPackage;
    }

    public Byte getIsIOS() {
        return isIOS;
    }

    public void setIsIOS(Byte isIOS) {
        this.isIOS = isIOS;
    }

    public String getIosPackage() {
        return iosPackage;
    }

    public void setIosPackage(String iosPackage) {
        this.iosPackage = iosPackage;
    }


    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Long getCreateUserID() {
        return createUserID;
    }

    public void setCreateUserID(Long createUserID) {
        this.createUserID = createUserID;
    }

    public Long getVersionRecordID() {
        return versionRecordID;
    }

    public void setVersionRecordID(Long versionRecordID) {
        this.versionRecordID = versionRecordID;
    }

    public Byte getIsAndroid() {

        return isAndroid;
    }

    public void setIsAndroid(Byte isAndroid) {
        this.isAndroid = isAndroid;
    }

    public String getPlistAddress() {
        return plistAddress;
    }

    public void setPlistAddress(String plistAddress) {
        this.plistAddress = plistAddress;
    }

    public Long getIosVersionRecordID() {
        return iosVersionRecordID;
    }

    public void setIosVersionRecordID(Long iosVersionRecordID) {
        this.iosVersionRecordID = iosVersionRecordID;
    }
}