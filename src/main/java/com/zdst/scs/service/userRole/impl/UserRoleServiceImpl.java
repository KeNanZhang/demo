package com.zdst.scs.service.userRole.impl;

import com.zdst.scs.dao.UserMapper;
import com.zdst.scs.dao.UserRoleMapper;
import com.zdst.scs.dto.UserRoleDto;
import com.zdst.scs.dto.UserRoleParamDto;
import com.zdst.scs.entity.User;
import com.zdst.scs.entity.UserRole;
import com.zdst.scs.service.userRole.UserRoleService;
import com.zdst.scs.supper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by lxh on 2018/10/22.
 */
@Service
public class UserRoleServiceImpl implements UserRoleService {
    @Autowired
    private UserRoleMapper userRoleMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public ResultPage userRoleList(UserRoleParamDto dto) {
        Map<String, Object> map = new HashMap<String, Object>();
        ResultPage page = null;
        try {
            if (Help.isNotNull(dto.getAccount())) {
                map.put("account", dto.getAccount());
            }
            // 查询总数
            int count = userRoleMapper.userRoleCount(map);
            page = new ResultPage(count, dto.getPageNum());
            map.put("startRow", page.getStartRow());
            map.put("pageSize", page.getPageSize());
            List<UserRoleDto> list = userRoleMapper.userRoleList(map);
            page.setPageData(list);
            page.setDataCount(count);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return page;
    }

    @Override
    public ResultObject insertUser(UserRoleDto userRoleDto){
        ResultObject resultObject = ResultObject.getSuccessResult("新增用户成功");;
        try {
            //用户
            User user = new User();
            //获得加盐值
            String salt = CryptoUtils.getSalt();
            //获取hash后的密码
            String hashPassword = CryptoUtils.getHash(userRoleDto.getPassword(),salt);
            user.setAccount(userRoleDto.getAccount());
            user.setPassword(hashPassword);
            user.setName(userRoleDto.getUserName());
            user.setStatus(userRoleDto.getStatus());
            user.setSalt(salt);
            userMapper.insertSelective(user);
            //用户角色
            UserRole userRole = new UserRole();
            userRole.setUserid(user.getId());
            userRole.setRoleid(userRoleDto.getRoleId());
            userRole.setCreateuserid(userRoleDto.getCreateUserId());
            userRoleMapper.insertSelective(userRole);
        }catch (Exception e){
            e.printStackTrace();
        }

        return resultObject;
    }
    @Override
    public ResultObject modifyUser(UserRoleDto userRoleDto){
        ResultObject resultObject = ResultObject.getSuccessResult("修改用户成功");;
        try {
            UserRole userRole = userRoleMapper.selectByPrimaryKey(userRoleDto.getId());
            //用户
            User user = new User();
            //获得加盐值
            String salt = CryptoUtils.getSalt();
            if(Help.isNotNull(userRoleDto.getPassword())){
                //获取hash后的密码
                String hashPassword = CryptoUtils.getHash(userRoleDto.getPassword(),salt);
                user.setPassword(hashPassword);
                user.setSalt(salt);
            }
            user.setAccount(userRoleDto.getAccount());
            user.setName(userRoleDto.getUserName());
            user.setStatus(userRoleDto.getStatus());
            user.setId(userRole.getUserid());
            userMapper.updateByPrimaryKeySelective(user);
            //用户角色
            userRole.setRoleid(userRoleDto.getRoleId());
            userRoleMapper.updateByPrimaryKeySelective(userRole);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultObject;
    }
    @Override
    public ResultObject deleteUser(Long id){
        ResultObject resultObject = ResultObject.getSuccessResult("删除用户成功");;
        try {
            UserRole userRole = userRoleMapper.selectByPrimaryKey(id);
            //删除用户
            userMapper.deleteByPrimaryKey(userRole.getUserid());
            //删除角色
            userRoleMapper.deleteByPrimaryKey(userRole.getId());
        }catch (Exception e){
            e.printStackTrace();
        }

        return resultObject;
    }
    @Override
    public ResultObject forbiddenUser(Long id){
        ResultObject resultObject = ResultObject.getSuccessResult("禁用用户成功");;
        try {
            UserRole userRole = userRoleMapper.selectByPrimaryKey(id);
            User user = new User();
            user.setId(userRole.getUserid());
            user.setStatus(new Long(0));
            userMapper.updateByPrimaryKeySelective(user);
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultObject;
    }
}

