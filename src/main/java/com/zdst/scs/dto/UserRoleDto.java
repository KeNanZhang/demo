package com.zdst.scs.dto;

import java.util.Date;

/**
 * Created by lxh on 2018/10/22.
 */
public class UserRoleDto {
    /**
     * 主键
     */
    private long id;
    /**
     * 账号名
     */
    private String account;
    /**
     * 账号密码
     */
    private String password;
    /**
     * 账号姓名
     */
    private String userName;
    /**
     * 用户角色
     */
    private String roleName;
    /**
     * 账号状态
     */
    private long status;
    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 创建人
     */
    private long createUserId;
    /**
     * 角色id
     * @return
     */
    private long roleId;

    public long getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(long createUserId) {
        this.createUserId = createUserId;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public long getStatus() {
        return status;
    }

    public void setStatus(long status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
