package com.zdst.scs.dao;

import com.zdst.scs.dto.api.VersionParam;
import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.VersionRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface VersionRecordMapper {
    /**
     * 版本历史
     * @return
     */
    List<VersionRecordDTO> queryByProjectIdAndType(Map<String, Object> param);

    /**
     * 条件搜索列表
     * @param param
     * @return
     */
    List<VersionRecordDTO> selectByParam(Map<String, Object> param);

    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(VersionRecord record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(VersionRecord record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    VersionRecord selectByPrimaryKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(VersionRecord record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(VersionRecord record);

    /**
     * 更新版本表是否是最新
     * @param versionRecord
     * @return
     */
    int updateByProjectIdAndIsNew(VersionRecord versionRecord);

    /**
     * 根据项目id删除版本记录表
     * @param projectId
     * @return
     */
    int deleteByProjectId(Long projectId);

    /**
     * app验证是否需要更新
     * @param versionParam
     * @return
     */
    VersionRecordDTO validateVersion(VersionParam versionParam);
}