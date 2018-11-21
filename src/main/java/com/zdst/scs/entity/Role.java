package com.zdst.scs.entity;

import java.util.Date;

public class Role {
    /**
     * id
     */
    private Long id;

    /**
     * 角色名称
     */
    private String name;

    /**
     * 描述
     */
    private String description;

    /**
     * 创建用户id
     */
    private Long createuserid;

    /**
     * 创建时间
     */
    private Date createtime;

    /**
     * 状态(1:可用 0:禁用)
     */
    private Byte status;

    /**
     * id
     * @return id id
     */
    public Long getId() {
        return id;
    }

    /**
     * id
     * @param id id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 角色名称
     * @return name 角色名称
     */
    public String getName() {
        return name;
    }

    /**
     * 角色名称
     * @param name 角色名称
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * 描述
     * @return description 描述
     */
    public String getDescription() {
        return description;
    }

    /**
     * 描述
     * @param description 描述
     */
    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    /**
     * 创建用户id
     * @return createUserID 创建用户id
     */
    public Long getCreateuserid() {
        return createuserid;
    }

    /**
     * 创建用户id
     * @param createuserid 创建用户id
     */
    public void setCreateuserid(Long createuserid) {
        this.createuserid = createuserid;
    }

    /**
     * 创建时间
     * @return createTime 创建时间
     */
    public Date getCreatetime() {
        return createtime;
    }

    /**
     * 创建时间
     * @param createtime 创建时间
     */
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    /**
     * 状态(1:可用 0:禁用)
     * @return status 状态(1:可用 0:禁用)
     */
    public Byte getStatus() {
        return status;
    }

    /**
     * 状态(1:可用 0:禁用)
     * @param status 状态(1:可用 0:禁用)
     */
    public void setStatus(Byte status) {
        this.status = status;
    }
}