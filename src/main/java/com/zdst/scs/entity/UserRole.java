package com.zdst.scs.entity;

import java.util.Date;

public class UserRole {
    /**
     * 
     */
    private Long id;

    /**
     * 用户id
     */
    private Long userid;

    /**
     * 角色id
     */
    private Long roleid;

    /**
     * 创建的用户id
     */
    private Long createuserid;

    /**
     * 创建时间
     */
    private Date createtime;

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
     * 用户id
     * @return userID 用户id
     */
    public Long getUserid() {
        return userid;
    }

    /**
     * 用户id
     * @param userid 用户id
     */
    public void setUserid(Long userid) {
        this.userid = userid;
    }

    /**
     * 角色id
     * @return roleID 角色id
     */
    public Long getRoleid() {
        return roleid;
    }

    /**
     * 角色id
     * @param roleid 角色id
     */
    public void setRoleid(Long roleid) {
        this.roleid = roleid;
    }

    /**
     * 创建的用户id
     * @return createUserID 创建的用户id
     */
    public Long getCreateuserid() {
        return createuserid;
    }

    /**
     * 创建的用户id
     * @param createuserid 创建的用户id
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
}