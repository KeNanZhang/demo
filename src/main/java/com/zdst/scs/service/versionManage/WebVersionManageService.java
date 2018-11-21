package com.zdst.scs.service.versionManage;

import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.Project;
import com.zdst.scs.entity.VersionFile;
import com.zdst.scs.entity.VersionRecord;
import com.zdst.scs.supper.ResultObject;


/**
 * @author 作者: zhangnan
 * @version 2018.10.17 项目管理
 * 
 */
public interface WebVersionManageService {
        /**
         * 版本列表
         * @param versionRecordDTO 条件搜索用的实体
         */
        ResultObject versionList(VersionRecordDTO versionRecordDTO);

        /**
         * 根据id查找信息
         * @param versionId versionRecord表的id
         */
        ResultObject queryById(Long versionId);

        /**
         * 添加版本安装包上传信息
         * @param versionFile 安装包上传后versionFile表新增信息
         */
        ResultObject addVersionFile(VersionFile versionFile);

        /**
         * 添加版本记录
         * @param versionRecord 新增版本记录
         */
        ResultObject addVersionRecord(VersionRecord versionRecord);

        /**
         * 根据id更新版本记录
         * @param versionRecord 修改后的版本信息
         */
        ResultObject updateVersionRecord(VersionRecord versionRecord);

        /**
         * 根据id查找安装包上传版本的信息
         * @param versionId versionFile表的id
         * @return 返回实体
         */
        VersionFile queryVersionFileById(Long versionId);

        /**
         * ios下载页面信息查询
         * @param project project表的id
         * @return 返回文件下载页面的信息
         */
        ResultObject queryIosInfo(Project project);
}