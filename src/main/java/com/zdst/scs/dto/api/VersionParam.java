package com.zdst.scs.dto.api;

import io.swagger.annotations.ApiModelProperty;

public class VersionParam {
	@ApiModelProperty(value = "项目key", name = "projectKey")
	String projectKey;
	
	@ApiModelProperty(value = "app类别 1:安卓，2：ios", name = "appType")
	int appType;
	
	@ApiModelProperty(value = "版本号", name = "versionCode")
	String versionCode;

	public String getProjectKey() {
		return projectKey;
	}

	public void setProjectKey(String projectKey) {
		this.projectKey = projectKey;
	}

	public int getAppType() {
		return appType;
	}

	public void setAppType(int appType) {
		this.appType = appType;
	}

	public String getVersionCode() {
		return versionCode;
	}

	public void setVersionCode(String versionCode) {
		this.versionCode = versionCode;
	}
}
