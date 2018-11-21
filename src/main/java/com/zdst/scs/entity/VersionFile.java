package com.zdst.scs.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class VersionFile {
    /**
     * 
     */
    private Long id;

    /**
     * 文件路径
     */
    private String filePath;

    /**
     * 文件类型（1-android版本文件   2-ios版本文件  3-ios的plist文件）
     */
    private Byte fileType;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 
     * @return id 
     */
    public Long getId() {
        return id;
    }

    /**
     * 
     * @param id 
     */
    public void setId(Long id) {
        this.id = id;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Byte getFileType() {
        return fileType;
    }

    public void setFileType(Byte fileType) {
        this.fileType = fileType;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}