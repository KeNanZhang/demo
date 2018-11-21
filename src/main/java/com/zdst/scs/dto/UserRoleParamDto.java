package com.zdst.scs.dto;

import com.zdst.scs.supper.BaseDTO;

/**
 * Created by lxh on 2018/10/22.
 */
public class UserRoleParamDto extends BaseDTO {
    /**
     * 账号名
     */
    private String account;

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }
}
