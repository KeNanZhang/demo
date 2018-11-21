package com.zdst.scs.entity;

import java.util.Date;

public class PlistFile {
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

    /**
     * 文件路径
     * @return filePath 文件路径
     */
    public String getFilePath() {
        return filePath;
    }

    /**
     * 文件路径
     * @param filePath 文件路径
     */
    public void setFilePath(String filePath) {
        this.filePath = filePath == null ? null : filePath.trim();
    }

    /**
     * 文件类型（1-android版本文件   2-ios版本文件  3-ios的plist文件）
     * @return fileType 文件类型（1-android版本文件   2-ios版本文件  3-ios的plist文件）
     */
    public Byte getFileType() {
        return fileType;
    }

    /**
     * 文件类型（1-android版本文件   2-ios版本文件  3-ios的plist文件）
     * @param fileType 文件类型（1-android版本文件   2-ios版本文件  3-ios的plist文件）
     */
    public void setFileType(Byte fileType) {
        this.fileType = fileType;
    }

    /**
     * 创建时间
     * @return createTime 创建时间
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * 创建时间
     * @param createTime 创建时间
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}