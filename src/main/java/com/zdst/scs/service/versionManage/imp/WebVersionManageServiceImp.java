package com.zdst.scs.service.versionManage.imp;

import com.zdst.scs.dao.*;
import com.zdst.scs.dto.api.AppVersionDTO;
import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.*;
import com.zdst.scs.service.versionManage.WebVersionManageService;
import com.zdst.scs.supper.Help;
import com.zdst.scs.supper.ResultObject;
import com.zdst.scs.supper.ResultPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author 作者: zhangnan
 * @version 2018.10.17 版本管理
 * 
 */
@Service
public class WebVersionManageServiceImp implements WebVersionManageService {
        private static final Logger logger = LoggerFactory.getLogger(WebVersionManageServiceImp.class);
        @Autowired
        private VersionRecordMapper versionRecordMapper;
        @Autowired
        private ProjectMapper projectMapper;
        @Autowired
        private UserMapper userMapper;
        @Autowired
        private VersionFileMapper versionFileMapper;

        @Override
        public ResultObject versionList(VersionRecordDTO versionRecordDTO)  {
                ResultObject resultObject = ResultObject.getSuccessResult("获得项目列表成功");

                Map<String, Object> paramMap = new HashMap<>();
                if(Help.isNotNull(versionRecordDTO.getAppType())){
                        paramMap.put("appType", versionRecordDTO.getAppType());
                }
                try {
                        int sum =  versionRecordMapper.selectByParam(paramMap).size();
                        ResultPage page = new ResultPage(sum , versionRecordDTO.getPageNum());
                        if(sum > 0){
                                paramMap.put("startRow", page.getStartRow());
                                paramMap.put("pageSize", page.getPageSize());
                                List<VersionRecordDTO> versionList = versionRecordMapper.selectByParam(paramMap);
                                for(VersionRecordDTO info : versionList){
                                        Project project = projectMapper.selectByPrimaryKey(info.getProjectID());
                                        if(Help.isNotNull(project)){
                                                info.setProjectName(project.getName());
                                        }
                                        User user = userMapper.selectByPrimaryKey(info.getUploadUserID());
                                        if(Help.isNotNull(user)){
                                                info.setUploadUserName(user.getName());
                                        }
                                }
                                page.setPageData(versionList);
                        }
                        resultObject.setData(page);
                } catch (Exception e) {
                        logger.debug("获得项目列表异常",e);
                        resultObject = ResultObject.getFailResult("获得项目列表成功失败");
                }
                return resultObject;
        }

        @Override
        public ResultObject queryById(Long versionId) {
                ResultObject resultObject = ResultObject.getSuccessResult("成功");
                try{
                        VersionRecord versionRecord = versionRecordMapper.selectByPrimaryKey(versionId);

                        VersionRecordDTO dto = new VersionRecordDTO();
                        BeanUtils.copyProperties(versionRecord, dto);

                        Project project = projectMapper.selectByPrimaryKey(dto.getProjectID());
                        if(Help.isNotNull(project)){
                                dto.setProjectName(project.getName());
                        }
                        //ios plist文件路径
                        if (2 == dto.getAppType()) {
                                if (Help.isNotNull(project.getPlistAddress())) {
                                        dto.setPlistFilePath(project.getPlistAddress());
                                }

                        }
                        VersionFile versionFile = versionFileMapper.selectByPrimaryKey(dto.getVersionFileID());
                        if (Help.isNotNull(versionFile)) {
                                dto.setFilePath(versionFile.getFilePath());
                        }
                        User user = userMapper.selectByPrimaryKey(versionRecord.getUploadUserID());
                        if(Help.isNotNull(user)){
                                dto.setUploadUserName(user.getName());
                        }

                        if(1 == dto.getAppType() && 1 == project.getIsAndroid()){
                                dto.setPackageName(project.getAndroidPackage());
                        }else{
                                if(2 == dto.getAppType() && 1 == project.getIsIOS()){
                                        dto.setPackageName(project.getIosPackage());
                                }
                        }
                        resultObject.setData(dto);
                }catch (Exception e){
                        logger.debug("版本信息异常",e);
                        resultObject = ResultObject.getFailResult("版本信息异常");
                }
                return resultObject;
        }

        @Override
        public ResultObject addVersionFile(VersionFile versionFile) {
                ResultObject rs;
                int num = versionFileMapper.insert(versionFile);
                if(0 != num){
                        rs = ResultObject.getSuccessResult("添加成功");
                        rs.setData(versionFile);
                }else{
                        rs = ResultObject.getFailResult("添加失败");
                }
                return  rs;
        }

        @Override
        public ResultObject addVersionRecord(VersionRecord versionRecord) {
                ResultObject rs;
                int num = versionRecordMapper.insertSelective(versionRecord);
                if(0 != num){
                        Project project = new Project();
                        project.setId(versionRecord.getProjectID());
                        if(1 == versionRecord.getAppType()){
                                project.setVersionRecordID(versionRecord.getId());
                        }
                        if (2 == versionRecord.getAppType()) {
                                project.setIosVersionRecordID(versionRecord.getId());
                        }
                        int index = projectMapper.updateByPrimaryKeySelective(project);

                        if(0 != index){
                                rs = ResultObject.getSuccessResult("更新成功");
                        }else{
                                rs = ResultObject.getSuccessResult("更新失败");
                        }
                        rs.setData(versionRecord);
                }else{
                        rs = ResultObject.getFailResult("添加失败");
                }
                return  rs;
        }

        @Override
        public ResultObject updateVersionRecord(VersionRecord versionRecord) {
                ResultObject rs;
                int num = versionRecordMapper.updateByPrimaryKeySelective(versionRecord);
                if(0 != num){
                        rs = ResultObject.getSuccessResult("更新成功");
                        rs.setData(num);
                }else{
                        rs = ResultObject.getFailResult("添加失败");
                }
                return  rs;
        }

        @Override
        public VersionFile queryVersionFileById(Long versionId) {
                return versionFileMapper.selectByPrimaryKey(versionId);
        }

        @Override
        public ResultObject queryIosInfo(Project dto) {
                ResultObject resultObject = null;
                try {
                        Project projectMsg = projectMapper.selectByPrimaryKey(dto.getId());
                        if (Help.isNotNull(projectMsg.getIosVersionRecordID())) {
                                VersionRecord versionRecord = versionRecordMapper.selectByPrimaryKey(projectMsg.getIosVersionRecordID());
                                VersionFile versionFile = versionFileMapper.selectByPrimaryKey(versionRecord.getVersionFileID());

                                AppVersionDTO appVersionDTO = new AppVersionDTO();
                                appVersionDTO.setVersionCode(versionRecord.getVersionCode());
                                appVersionDTO.setUpgradeInfo(versionRecord.getUpgradeInfo());
                                appVersionDTO.setCreateTime(versionFile.getCreateTime());
                                appVersionDTO.setUpdateUrl(versionFile.getFilePath());
                                appVersionDTO.setVersionName(projectMsg.getIosPackage());
                                appVersionDTO.setPlistAddress("itms-services://?action=download-manifest&url=" + projectMsg.getPlistAddress());
                                resultObject = ResultObject.getSuccessResult("查询成功");
                                resultObject.setData(appVersionDTO);
                        } else {
                                resultObject = ResultObject.getFailResult("查询版本信息错误");
                        }
                }catch (Exception e){
                        logger.error("查询失败:",e);
                }
                return resultObject;
        }
}