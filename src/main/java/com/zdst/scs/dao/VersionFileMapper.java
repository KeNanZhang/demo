package com.zdst.scs.dao;

import com.zdst.scs.entity.VersionFile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VersionFileMapper {
    /**
     * deleteByPrimaryKey 2018-10-09
     */
    int deleteByPrimaryKey(Long id);

    /**
     * insert 2018-10-09
     */
    int insert(VersionFile record);

    /**
     * insertSelective 2018-10-09
     */
    int insertSelective(VersionFile record);

    /**
     * selectByPrimaryKey 2018-10-09
     */
    VersionFile selectByPrimaryKey(Long id);

    /**
     * updateByPrimaryKeySelective 2018-10-09
     */
    int updateByPrimaryKeySelective(VersionFile record);

    /**
     * updateByPrimaryKey 2018-10-09
     */
    int updateByPrimaryKey(VersionFile record);
}