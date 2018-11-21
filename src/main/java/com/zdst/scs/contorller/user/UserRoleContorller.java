package com.zdst.scs.contorller.user;

import com.zdst.scs.dao.UserRoleMapper;
import com.zdst.scs.dto.UserRoleDto;
import com.zdst.scs.dto.UserRoleParamDto;
import com.zdst.scs.entity.UserRole;
import com.zdst.scs.service.userRole.UserRoleService;
import com.zdst.scs.supper.ResultObject;
import com.zdst.scs.supper.ResultPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.zdst.scs.entity.User;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by lxh on 2018/10/22.
 */
@RestController
@RequestMapping("/userRole")
public class UserRoleContorller {
    private static final Logger logger = LoggerFactory
            .getLogger(UserRoleContorller.class);
    @Autowired
    private UserRoleService userRoleService;
    @Autowired
    private UserRoleMapper userRoleMapper;

    @RequestMapping(value = "/userRoleList",method= RequestMethod.POST)
    @ResponseBody
    public ResultObject userRoleList(HttpServletRequest request,UserRoleParamDto userRoleParamDto){
        ResultObject resultObject = ResultObject.getSuccessResult("查询列表成功");;
        try {
            ResultPage resultPage = userRoleService.userRoleList(userRoleParamDto);
            resultObject.setData(resultPage);
        }catch (Exception e){
            logger.error("查询用户列表失败", e);
        }
        return  resultObject;
    }

    @RequestMapping(value = "/inserUser",method= RequestMethod.POST)
    @ResponseBody
    public ResultObject inserUser(HttpServletRequest request,@RequestBody UserRoleDto userRoleDto){
        ResultObject resultObject = ResultObject.getSuccessResult("新增用户成功");;
        User user  = (User)request.getSession().getAttribute("user");
        try {
            userRoleDto.setCreateUserId(user.getId());
            resultObject = userRoleService.insertUser(userRoleDto);
        }catch (Exception e){
            logger.error("新增用户失败", e);
        }
        return  resultObject;
    }
    @RequestMapping(value = "/modifyUser",method= RequestMethod.POST)
    @ResponseBody
    public ResultObject modifyUser(HttpServletRequest request,@RequestBody UserRoleDto userRoleDto){
        ResultObject resultObject = ResultObject.getSuccessResult("修改用户成功");
        try {
            resultObject = userRoleService.modifyUser(userRoleDto);
        }catch (Exception e){
            logger.error("修改用户失败", e);
        }
        return  resultObject;
    }

    @RequestMapping(value = "/selectUserRoleKey",method= RequestMethod.GET)
    @ResponseBody
    public ResultObject selectUserRoleKey(HttpServletRequest request,Long id){
        ResultObject resultObject = new ResultObject();
        try {
            UserRoleDto userRoleDto = userRoleMapper.selectUserRoleKey(id);
            resultObject.setData(userRoleDto);
        }catch (Exception e){
            logger.error("查询用户列表失败", e);
        }
        return  resultObject;
    }
    @RequestMapping(value = "/deleteUser/{id}",method= RequestMethod.POST)
    @ResponseBody
    public ResultObject deleteUser(HttpServletRequest request,@PathVariable("id")Long id){
        ResultObject resultObject = new ResultObject();
        try {
            resultObject = userRoleService.deleteUser(id);
        }catch (Exception e){
            logger.error("删除用户失败", e);
        }
        return  resultObject;
    }
    @RequestMapping(value = "/forbiddenUser/{id}",method= RequestMethod.POST)
    @ResponseBody
    public ResultObject forbiddenUser(HttpServletRequest request,@PathVariable("id")Long id){
        ResultObject resultObject = new ResultObject();
        try {
            resultObject = userRoleService.forbiddenUser(id);
        }catch (Exception e){
            logger.error("禁用用户失败", e);
        }
        return  resultObject;
    }
}
