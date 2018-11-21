package com.zdst.scs.service.projectManage;

import com.zdst.scs.dto.projectManage.ProjectDTO;
import com.zdst.scs.entity.PlistFile;
import com.zdst.scs.entity.Project;
import com.zdst.scs.supper.ResultObject;


/**
 * @author 作者: zhangnan
 * @version 2018.10.9 项目管理
 * 
 */
public interface WebProjectManageService {
        /**
         * 新增项目  添加ios plist文件信息,并返回id
         * @param plistFile plist文件信息
         */
        ResultObject addPlistFile(PlistFile plistFile);

        /**
         * 新增项目
         * @param project 项目信息
         */
        ResultObject addProject(Project project);

        /**
         * 项目列表
         * @param projectDto 用来条件搜索的实体
         */
        ResultObject projectList(ProjectDTO projectDto);

        /**
         * 根据项目id查找项目信息
         * @param id project的id
         */
        ResultObject queryProject(Long id);

        /**
         * 编辑项目信息
         * @param project 更新project信息
         */
        ResultObject updateProject(Project project);

        /**
         * 删除项目
         * @param projectId 项目id
         */
        ResultObject delete(Long projectId);

        /**
         * 根据项目id和安装包类型查找版本信息
         * @param projectId 项目id
         * @param type app类型 1安卓 2ios
         */
        ResultObject versionRecord(Long projectId, int type);

        /**
         * ios文件下载  查询项目信息
         * @param projectKey 项目key 唯一
         */
        Project queryByProjectKey(String projectKey);

}