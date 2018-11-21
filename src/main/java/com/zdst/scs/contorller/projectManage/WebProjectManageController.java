package com.zdst.scs.contorller.projectManage;

import javax.servlet.http.HttpServletRequest;

import com.zdst.scs.dto.projectManage.ProjectDTO;
import com.zdst.scs.entity.PlistFile;
import com.zdst.scs.entity.Project;
import com.zdst.scs.entity.User;
import com.zdst.scs.service.projectManage.WebProjectManageService;
import com.zdst.scs.supper.ResultObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


/**
 * @author 作者: zhangnan
 * @version 2018.10.9 项目管理
 * 
 */
@Controller
@RequestMapping("/projectManage")
public class WebProjectManageController {
	private static final Logger logger = LoggerFactory.getLogger(WebProjectManageController.class);

	@Autowired
    private WebProjectManageService webProjectManageService;

	/**
	 * 新增项目信息
	 * @param request
	 * @param project
	 */
	@RequestMapping(value = "/filterPermission/addProject", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject addProject(HttpServletRequest request,@RequestBody Project project) {
        ResultObject rs;
		try {
			User user = (User) request.getSession().getAttribute("user");
			project.setCreateUserID(user.getId());
			UUID FileId = UUID.randomUUID();
			project.setProjectKey(FileId.toString().replace("-", ""));
			rs = webProjectManageService.addProject(project);
		} catch (Exception e) {
			logger.error("添加项目信息出错",e);
			rs = ResultObject.getFailResult("添加项目信息失败");
		}
		return rs;
	}

	/**
	 * 添加plist文件信息  不用
	 * @param request
	 * @param plistFile
	 */
	@RequestMapping(value = "/filterPermission/addPlistFile", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject addPlistFile(HttpServletRequest request, @RequestBody PlistFile plistFile) {
		ResultObject rs;
		try {
			rs = webProjectManageService.addPlistFile(plistFile);
		} catch (Exception e) {
			logger.error("添加plist文件出错",e);
			rs = ResultObject.getFailResult("添加plist文件出错");
		}
		return rs;
	}

	/**
	 * 项目列表
	 * @param request
	 * @param projectDto
	 */
	@RequestMapping(value = "/filterPermission/projectList", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject projectList(HttpServletRequest request,ProjectDTO projectDto) {
		ResultObject result;
		try {
			result = webProjectManageService.projectList(projectDto);
		} catch (Exception e) {
			logger.error("获取项目列表异常", e);
			result = ResultObject.getFailResult("获取项目列表异常");
		}
		return result;
	}

	@RequestMapping(value = "/filterPermission/queryProject", method = RequestMethod.GET)
	@ResponseBody
	public ResultObject queryProject(HttpServletRequest request, @RequestParam("id") Long id) {
		ResultObject resultObject;
		try {
			resultObject = webProjectManageService.queryProject(id);
		} catch (Exception e) {
			logger.error("查询项目异常", e);
			resultObject = ResultObject.getFailResult("查询项目异常");
		}
		return resultObject;
	}
	/**
	 * 编辑项目信息
	 * @param request
	 * @param project
	 */
	@RequestMapping(value = "/filterPermission/updateProject", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject updateProject(HttpServletRequest request, @RequestBody Project project) {
		ResultObject rs = webProjectManageService.updateProject(project);
		return rs;
	}

	@RequestMapping(value = "/filterPermission/delete/{projectId}", method = RequestMethod.DELETE, produces = "application/json")
	@ResponseBody
	public ResultObject projectDetail(HttpServletRequest request,@PathVariable("projectId") Long projectId) {
		ResultObject resultObject = null;
		try {
			resultObject = webProjectManageService.delete(projectId);
		} catch (Exception e) {
			logger.error("删除出错", e);
		}
		return resultObject;
	}
	
	@RequestMapping(value = "/filterPermission/queryDetail", method = RequestMethod.GET)
	@ResponseBody
	public ResultObject projectHistory(HttpServletRequest request,@RequestParam("projectId") Long projectId) {
		ResultObject resultObject;
		try {
			resultObject = webProjectManageService.queryProject(projectId);
		} catch (Exception e) {
			logger.error("查询项目详情异常", e);
			resultObject = ResultObject.getFailResult("查询项目详情异常");
		}
		return resultObject;
	}
	
	@RequestMapping(value = "/filterPermission/versionRecord", method = RequestMethod.GET)
	@ResponseBody
	public ResultObject versionRecord(HttpServletRequest request,@RequestParam("id") Long projectId,@RequestParam("type") int type) {
		ResultObject resultObject;
		try {
			resultObject = webProjectManageService.versionRecord(projectId,type);
		} catch (Exception e) {
			logger.error("查询项目详情异常", e);
			resultObject = ResultObject.getFailResult("查询项目详情异常");
		}
		return resultObject;
	}

}