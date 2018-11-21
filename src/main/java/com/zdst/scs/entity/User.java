package com.zdst.scs.entity;

import java.util.Date;

public class User {
    /**
     * 
     */
    private Long id;

    /**
     * 用户姓名
     */
    private String name;

    /**
     * 账号
     */
    private String account;

    /**
     * 用户密码
     */
    private String password;

    /**
     * 加密字符
     */
    private String salt;

    /**
     * 电话号码
     */
    private String phone;

    /**
     * 性别
     */
    private Byte sex;

    /**
     * 出生日期
     */
    private Date birthday;

    /**
     * 创建时间
     */
    private Date createtime;

    /**
     * 状态(1:可用 0:禁用)
     */
    private Long status;

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
     * 用户姓名
     * @return name 用户姓名
     */
    public String getName() {
        return name;
    }

    /**
     * 用户姓名
     * @param name 用户姓名
     */
    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    /**
     * 账号
     * @return account 账号
     */
    public String getAccount() {
        return account;
    }

    /**
     * 账号
     * @param account 账号
     */
    public void setAccount(String account) {
        this.account = account == null ? null : account.trim();
    }

    /**
     * 用户密码
     * @return password 用户密码
     */
    public String getPassword() {
        return password;
    }

    /**
     * 用户密码
     * @param password 用户密码
     */
    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    /**
     * 加密字符
     * @return salt 加密字符
     */
    public String getSalt() {
        return salt;
    }

    /**
     * 加密字符
     * @param salt 加密字符
     */
    public void setSalt(String salt) {
        this.salt = salt == null ? null : salt.trim();
    }

    /**
     * 电话号码
     * @return phone 电话号码
     */
    public String getPhone() {
        return phone;
    }

    /**
     * 电话号码
     * @param phone 电话号码
     */
    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    /**
     * 性别
     * @return sex 性别
     */
    public Byte getSex() {
        return sex;
    }

    /**
     * 性别
     * @param sex 性别
     */
    public void setSex(Byte sex) {
        this.sex = sex;
    }

    /**
     * 出生日期
     * @return birthday 出生日期
     */
    public Date getBirthday() {
        return birthday;
    }

    /**
     * 出生日期
     * @param birthday 出生日期
     */
    public void setBirthday(Date birthday) {
        this.birthday = birthday;
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
    public Long getStatus() {
        return status;
    }

    /**
     * 状态(1:可用 0:禁用)
     * @param status 状态(1:可用 0:禁用)
     */
    public void setStatus(Long status) {
        this.status = status;
    }
}