package com.zdst.scs.service.projectManage.imp;

import com.zdst.scs.dao.*;
import com.zdst.scs.dto.projectManage.ProjectDTO;
import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.*;
import com.zdst.scs.service.projectManage.WebProjectManageService;
import com.zdst.scs.supper.Help;
import com.zdst.scs.supper.ResultObject;
import com.zdst.scs.supper.ResultPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * @author 作者: zhangnan
 * @version 2018.10.9 项目管理
 * 
 */
@Service
public class WebProjectManageServiceImp implements WebProjectManageService {
        private static final Logger logger = LoggerFactory.getLogger(WebProjectManageServiceImp.class);

        @Autowired
        private PlistFileMapper plistFileMapper;
        @Autowired
        private ProjectMapper projectMapper;
        @Autowired
        private UserMapper userMapper;
        @Autowired
        private VersionRecordMapper versionRecordMapper;

        //不用
        @Override
        public ResultObject addPlistFile(PlistFile plistFile) {
                ResultObject rs;
                int num = plistFileMapper.insert(plistFile);
                if(0 != num){
                        rs = ResultObject.getSuccessResult("添加成功");
                        rs.setData(plistFile);
                }else{
                        rs = ResultObject.getFailResult("添加失败");
                }
                return  rs;
        }

        /**
         * 项目建立成功后在版本记录中添加项目数据
         */
        @Override
        public ResultObject addProject(Project project) {
                ResultObject rs;
                project.setCreateTime(new Date());
                int num = projectMapper.insertSelective(project);
                if(0 != num){
                        /*versionRecord表中添加数据*/
                        int index = addVersionRecord(project);
                        if(0 != index){
                                rs = ResultObject.getSuccessResult("添加成功");
                                rs.setData(num);
                        }else{
                                rs = ResultObject.getFailResult("版本控制新增数据失败");
                        }
                }else{
                        rs = ResultObject.getFailResult("添加失败");
                }
                return  rs;
        }
        private int addVersionRecord(Project project){
                int index = 0;
                VersionRecord versionRecord = new VersionRecord();
                if(Help.isNotNull(project.getId())){
                        versionRecord.setProjectID(project.getId());
                }
                if(Help.isNotNull(project.getCreateUserID())){
                        versionRecord.setUploadUserID(project.getCreateUserID());
                }
                versionRecord.setCreateTime(new Date());
                if(1 == project.getIsAndroid()){
                        versionRecord.setAppType((byte)1);
                        versionRecord.setId(null);
                        index = versionRecordMapper.insertSelective(versionRecord);
                }
                if(1 == project.getIsIOS()){
                        versionRecord.setAppType((byte)2);
                        versionRecord.setId(null);
                        index = versionRecordMapper.insertSelective(versionRecord);
                }
                return index;
        }

        @Override
        public ResultObject projectList(ProjectDTO projectDto) {
                ResultObject resultObject = ResultObject.getSuccessResult("获得项目列表成功");

                Map<String, Object> paramMap = new HashMap<>();
                if(Help.isNotNull(projectDto.getCreateUserID())){
                        paramMap.put("createUserID", projectDto.getCreateUserID());
                }

                try {
                        int sum =  projectMapper.selectByParam(paramMap).size();
                        ResultPage page = new ResultPage(sum , projectDto.getPageNum());
                        if(sum > 0){
                                paramMap.put("startRow", page.getStartRow());
                                paramMap.put("pageSize", page.getPageSize());
                                List<ProjectDTO> projectList = projectMapper.selectByParam(paramMap);
                                page.setPageData(projectList);
                        }
                        resultObject.setData(page);
                } catch (Exception e) {
                        logger.debug("获得项目列表异常",e);
                        resultObject = ResultObject.getFailResult("获得项目列表成功失败");
                }
                return resultObject;
        }

        @Override
        public ResultObject queryProject(Long id) {
                ResultObject result = ResultObject.getSuccessResult("查询成功");
                try{
                        Project project =  projectMapper.selectByPrimaryKey(id);
                        ProjectDTO projectDTO = new ProjectDTO();
                        BeanUtils.copyProperties(project, projectDTO);
                        if(Help.isNotNull(projectDTO.getPlistAddress())){
                                projectDTO.setFileName(projectDTO.getPlistAddress());
                        }
                        User user = userMapper.selectByPrimaryKey(projectDTO.getCreateUserID());
                        if(Help.isNotNull(user)){
                                projectDTO.setCreateUser(user.getName());
                        }
                        result.setData(projectDTO);
                }catch (Exception e){
                        logger.debug("查询异常",e);
                        result = ResultObject.getFailResult("查询失败");
                }
                return result;
        }

        @Override
        public ResultObject updateProject(Project project) {
                ResultObject resultObject;
                //数据库项目信息
                Project projectMsg = projectMapper.selectByPrimaryKey(project.getId());
                //更新版本表 添加记录
                VersionRecord versionRecord = new VersionRecord();
                if(Help.isNotNull(project.getId())){
                        versionRecord.setProjectID(project.getId());
                }
                if(Help.isNotNull(project.getCreateUserID())){
                        versionRecord.setUploadUserID(project.getCreateUserID());
                }
                versionRecord.setCreateTime(new Date());
                int index = 0;
                //判断项目是否已经有安卓系统 0无,1有
                if (0 == projectMsg.getIsAndroid()) {
                        //判断是否新增安卓系统
                        if (1 == project.getIsAndroid()) {
                                versionRecord.setAppType((byte)1);
                                index = versionRecordMapper.insertSelective(versionRecord);
                        }
                }else{
                        //是否取消有安卓系统
                        if (0 == project.getIsAndroid()) {
                                versionRecord.setAppType((byte)1);
                                versionRecord.setIsNew(0);
                                index = versionRecordMapper.updateByProjectIdAndIsNew(versionRecord);
                        }
                }
                //是否有ios系统 0无, 1有
                if (0 == projectMsg.getIsIOS()) {
                        //判断是否新增ios系统
                        if (1 == project.getIsIOS()) {
                                versionRecord.setAppType((byte)2);
                                index = versionRecordMapper.insertSelective(versionRecord);
                        }
                }else{
                        //判断是否取消ios系统
                        if (0 == project.getIsIOS()) {
                                versionRecord.setAppType((byte)2);
                                versionRecord.setIsNew(0);
                                index = versionRecordMapper.updateByProjectIdAndIsNew(versionRecord);
                        }
                }

                int num = projectMapper.updateByPrimaryKeySelective(project);
                if(0 != num){
                        resultObject = ResultObject.getSuccessResult("更新成功");
                        resultObject.setData(num);
                }else{
                        resultObject = ResultObject.getFailResult("更新失败");
                }
                return resultObject;
        }

        @Override
        public ResultObject delete(Long projectId) {
                ResultObject resultObject = null;
                try{
                        int num = projectMapper.deleteByPrimaryKey(projectId);
                        int index = 0;
                        if(0 < num){
                                index = versionRecordMapper.deleteByProjectId(projectId);
                                if (0 < index) {
                                        resultObject = ResultObject.getSuccessResult("删除版本记录成功");
                                }else{
                                        resultObject = ResultObject.getFailResult("删除版本记录失败");
                                }
                        }else{
                                resultObject = ResultObject.getFailResult("删除项目记录失败");
                        }
                        resultObject.setData(index);
                }catch(Exception e){
                        logger.error("删除异常", e);
                }
                return resultObject;
        }

        @Override
        public ResultObject versionRecord(Long projectId, int type) {
                ResultObject resultObject = ResultObject.getSuccessResult("查询成功");
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("projectId",projectId);
                paramMap.put("type",type);
                try{
                        List<VersionRecordDTO> list = versionRecordMapper.queryByProjectIdAndType(paramMap);
                        if(0 != list.size()){
                                for(VersionRecordDTO info : list){
                                        /*User user = userMapper.selectByPrimaryKey(info.getUploadUserID());
                                        if(Help.isNotNull(user)){
                                                info.setUploadUserName(user.getName());
                                        }*/
                                        Project project =  projectMapper.selectByPrimaryKey(projectId);
                                        info.setProjectName(project.getName());
                                        info.setDescription(project.getDescription());
                                }
                        }
                        resultObject.setData(list);
                }catch(Exception e){
                        logger.error("查询失败 :", e);
                }
                return resultObject;
        }

        @Override
        public Project queryByProjectKey(String projectKey) {
                return projectMapper.queryByProjectKey(projectKey);
        }
}