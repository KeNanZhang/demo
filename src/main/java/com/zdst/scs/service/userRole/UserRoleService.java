package com.zdst.scs.service.userRole;

import com.zdst.scs.dto.UserRoleDto;
import com.zdst.scs.dto.UserRoleParamDto;
import com.zdst.scs.supper.ResultObject;
import com.zdst.scs.supper.ResultPage;

/**
 * Created by lxh on 2018/10/22.
 */
public interface UserRoleService {
    /**
     * 用户列表
     */
    ResultPage userRoleList(UserRoleParamDto userRoleParamDto);
    /**
     * 新增用户
     */
    ResultObject insertUser(UserRoleDto userRoleDto);
    /**
     * 修改用户
     */
    ResultObject modifyUser(UserRoleDto userRoleDto);
    /**
     * 删除用户
     */
    ResultObject deleteUser(Long id);
    /**
     * 禁用用户
     */
    ResultObject forbiddenUser(Long id);
}
