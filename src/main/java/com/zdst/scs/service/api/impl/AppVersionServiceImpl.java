package com.zdst.scs.service.api.impl;

import com.zdst.scs.dao.ProjectMapper;
import com.zdst.scs.dao.VersionRecordMapper;
import com.zdst.scs.dto.api.AppVersionDTO;
import com.zdst.scs.dto.api.VersionParam;
import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.Project;
import com.zdst.scs.service.api.AppVersionService;
import com.zdst.scs.supper.Help;
import com.zdst.scs.supper.ResultObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhangnan on 2018/10/29 0029.
 */
@Service
@Transactional
public class AppVersionServiceImpl implements AppVersionService{
    @Autowired
    private VersionRecordMapper versionRecordMapper;
    @Autowired
    private ProjectMapper projectMapper;

    @Value("${downloadUrl}")
    private String downloadUrl;

    @Override
    public ResultObject validateVersion(HttpServletRequest request, VersionParam versionParam) {
        ResultObject resultObject = ResultObject.getSuccessResult("验证版本成功。");

        AppVersionDTO appVersion = new AppVersionDTO();
        //获取最新的版本信息
        VersionRecordDTO recordDTO = versionRecordMapper.validateVersion(versionParam);
        if (Help.isNotNull(recordDTO)) {
            //对比最新的版本号和客户的版本号
            if (isAppNewVersion(recordDTO.getVersionCode(),versionParam.getVersionCode())) {
                appVersion.setIsUpdate(1);
                appVersion.setVersionCode(recordDTO.getVersionCode());
                appVersion.setAppType(recordDTO.getAppType());
                appVersion.setUpgradeInfo(recordDTO.getUpgradeInfo());
                if (2 == recordDTO.getAppType()) {//ios需要返回plist文件下载地址
                    Project project = projectMapper.selectByPrimaryKey(recordDTO.getProjectID());
                    //ios跳转到下载页面
                    appVersion.setUpdateUrl(downloadUrl+"/version/api/appVersionIos.html?projectId="+project.getId());
                }else{
                    //安卓下载接口
                    appVersion.setUpdateUrl(downloadUrl+"/versionManage/filterPermission/appDownLoad/"+recordDTO.getId());
                }
                appVersion.setLastForce(recordDTO.getLastForce());
            } else {
                //不需要更新
                appVersion.setIsUpdate(0);
            }
        } else {
            appVersion.setIsUpdate(0);
        }
        resultObject.setData(appVersion);
        return resultObject;
    }
    /**
     * 判断是否为最新版本方法 将版本号根据.切分为int数组 比较
     *
     * @param localVersion 本地版本号
     * @param onlineVersion 线上版本号
     */
    private static boolean isAppNewVersion(String localVersion, String onlineVersion)
    {
        if (localVersion.equals(onlineVersion))
        {
            return false;
        }
        String[] localArray = localVersion.split("\\.");
        String[] onlineArray = onlineVersion.split("\\.");

        int length = localArray.length < onlineArray.length ? localArray.length : onlineArray.length;

        for (int i = 0; i < length; i++)
        {
            if (Integer.parseInt(onlineArray[i]) > Integer.parseInt(localArray[i]))
            {
                return false;
            }
            else if (Integer.parseInt(onlineArray[i]) < Integer.parseInt(localArray[i]))
            {
                return true;
            }
        }
        return true;
    }
}
