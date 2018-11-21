package com.zdst.scs.dao;

import com.zdst.scs.dto.UserRoleDto;
import com.zdst.scs.dto.UserRoleParamDto;
import com.zdst.scs.entity.UserRole;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserRoleMapper {
    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(UserRole record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(UserRole record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    UserRoleDto selectUserRoleKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(UserRole record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(UserRole record);

    /**
     * 用户列表
     */
    List<UserRoleDto> userRoleList(Map<String, Object> param);
    /**
     * 用户列表总数
     */
    int userRoleCount(Map<String, Object> param);

    UserRole selectByPrimaryKey(Long id);

    //UserId查询
    UserRole selectUserRoleUserId(long id);
}