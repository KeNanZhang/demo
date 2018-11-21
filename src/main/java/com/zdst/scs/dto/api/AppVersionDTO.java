package com.zdst.scs.dto.api;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

public class AppVersionDTO {
	
	/**
	 * 是否要更新 1-要 0-不要
	 */
	@ApiModelProperty(value = "是否要更新 1-要 0-不要",name = "isUpdate")
	private int isUpdate;
	
	/**
	 * 版本号
	 */
	@ApiModelProperty(value = "版本号",name = "versionCode")
	private String versionCode;
	
	/**
	 * 版本名称
	 */
	@ApiModelProperty(value = "版本名称",name = "versionName")
	private String versionName;
	
	/**
	 * app类别 1:安卓，2：ios
	 */
	@ApiModelProperty(value = "app类别 1:安卓，2：ios",name = "appType")
	private int appType;
	
	/**
	 * 更新的描述
	 */
	@ApiModelProperty(value = "更新的描述",name = "upgradeInfo")
	private String upgradeInfo;
	
	/**
	 * 下载地址
	 */
	@ApiModelProperty(value = "下载地址",name = "updateUrl")
	private String updateUrl;
	
	/**
	 * 是否强制更新(1--是  0--否)
	 */
	@ApiModelProperty(value = "是否强制更新(1--是  0--否)",name = "lastForce")
	private int lastForce;
	/**
	 * 更新时间
	 */
	@ApiModelProperty(value = "更新时间",name = "createTime")
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	private Date createTime;
	/**
	 * plist文件地址
	 */
	@ApiModelProperty(value = "plist文件地址",name = "plistAddress")
	private String plistAddress;

	public int getIsUpdate() {
		return isUpdate;
	}

	public void setIsUpdate(int isUpdate) {
		this.isUpdate = isUpdate;
	}

	public String getVersionCode() {
		return versionCode;
	}

	public void setVersionCode(String versionCode) {
		this.versionCode = versionCode;
	}

	public String getVersionName() {
		return versionName;
	}

	public void setVersionName(String versionName) {
		this.versionName = versionName;
	}

	public int getAppType() {
		return appType;
	}

	public void setAppType(int appType) {
		this.appType = appType;
	}

	public String getUpgradeInfo() {
		return upgradeInfo;
	}

	public void setUpgradeInfo(String upgradeInfo) {
		this.upgradeInfo = upgradeInfo;
	}

	public String getUpdateUrl() {
		return updateUrl;
	}

	public void setUpdateUrl(String updateUrl) {
		this.updateUrl = updateUrl;
	}

	public int getLastForce() {
		return lastForce;
	}

	public void setLastForce(int lastForce) {
		this.lastForce = lastForce;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getPlistAddress() {
		return plistAddress;
	}

	public void setPlistAddress(String plistAddress) {
		this.plistAddress = plistAddress;
	}
}
