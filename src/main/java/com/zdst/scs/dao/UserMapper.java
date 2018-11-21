package com.zdst.scs.dao;

import com.zdst.scs.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(User record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(User record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    User selectByPrimaryKey(Long id);
    /**
     * selectByPrimaryKey 2018-10-09
     */
    User selectByPrimaryAccount(String account);
    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(User record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(User record);
}