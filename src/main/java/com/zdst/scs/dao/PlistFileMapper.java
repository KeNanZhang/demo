package com.zdst.scs.dao;

import com.zdst.scs.entity.PlistFile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PlistFileMapper {
    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(PlistFile record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(PlistFile record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    PlistFile selectByPrimaryKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(PlistFile record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(PlistFile record);
}