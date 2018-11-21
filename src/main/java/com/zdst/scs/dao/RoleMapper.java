package com.zdst.scs.dao;

import com.zdst.scs.entity.Role;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper {
    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(Role record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(Role record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    Role selectByPrimaryKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(Role record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(Role record);
}