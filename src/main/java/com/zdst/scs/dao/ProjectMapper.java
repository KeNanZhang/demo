package com.zdst.scs.dao;

import com.zdst.scs.dto.projectManage.ProjectDTO;
import com.zdst.scs.entity.Project;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;
@Mapper
public interface ProjectMapper {
    /**
     * 根据条件获取项目列表
     * @param
     * @return
     */
    List<ProjectDTO> selectByParam(Map<String, Object> param);
    /**
     * 新增项目信息
     */
    int insertSelective(Project record);

    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(Project record);
    /**
     * selectByPrimaryKey 2018-10-09
     */
    Project selectByPrimaryKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(Project record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(Project record);

    /**
     * 查询project
     * @param projectKey
     * @return
     */
    Project queryByProjectKey(String projectKey);

}