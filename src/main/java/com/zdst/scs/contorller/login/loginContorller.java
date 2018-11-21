package com.zdst.scs.contorller.login;

import com.zdst.scs.dao.UserMapper;
import com.zdst.scs.dao.UserRoleMapper;
import com.zdst.scs.entity.User;
import com.zdst.scs.entity.UserRole;
import com.zdst.scs.supper.CryptoUtils;
import com.zdst.scs.supper.Help;
import com.zdst.scs.supper.ResultObject;
import com.zdst.scs.supper.VerifyCodeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by lxh on 2018/11/9.
 */

/**
 * Created by lxh on 2018/10/10.
 */
@RestController
@RequestMapping("/")
public class loginContorller {
    private static final Logger logger = LoggerFactory.getLogger(loginContorller.class);

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserRoleMapper userRoleMapper;

    /**
     * 登录页面跳转
     *
     * @return
     */
    @RequestMapping(value = "/logins", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject login(Model model, @RequestParam("account") String account, @RequestParam("password") String password, @RequestParam("verifyCode") String verifyCode, HttpServletRequest request) {
        ResultObject result = new ResultObject();
        try {
            boolean verify = VerifyCodeUtil.verifyCode(verifyCode, request);
            if (!verify) {
                return result.fail("验证码错误");
            }
            User user = userMapper.selectByPrimaryAccount(account);
            if (Help.isNull(user)) {
                return result.fail("账号不存在！");
            }
            if (user.getStatus() == 0) {
                return result.fail("账号被禁用！");
            }
            request.getSession().setAttribute("user", user);
            request.getSession().setAttribute("account", account);
            request.getSession().setAttribute("name", user.getName());
            boolean hasResult = CryptoUtils.verify(user.getPassword(), password, user.getSalt());
            if (!hasResult) {
                return result.fail("密码错误！");
            } else {
                result.setData(user.getName());
                return result.success("登录成功！");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/verifyCode", method = RequestMethod.GET)
    public void verifyCode(HttpServletRequest request, HttpServletResponse response) {
        VerifyCodeUtil vCode = new VerifyCodeUtil(100, 30, 4, 10, 1);
        try {
            vCode.responseCode(request, response);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/loginUser", method = RequestMethod.GET)
    public ResultObject loginUser(HttpServletRequest request, HttpServletResponse response) {
        ResultObject resultObject = new ResultObject();
        try {
            User user = (User) request.getSession().getAttribute("user");
            UserRole userRole = userRoleMapper.selectUserRoleUserId(user.getId());
            List<String> userManage = new ArrayList<>();
            userManage.add(user.getName());
            userManage.add(String.valueOf(userRole.getRoleid()));
            resultObject.setData(userManage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultObject;
    }
}
