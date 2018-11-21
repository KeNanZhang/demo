package com.zdst.scs.contorller.api;

import com.zdst.scs.dto.api.AppVersionDTO;
import com.zdst.scs.dto.api.VersionParam;
import com.zdst.scs.service.api.AppVersionService;
import com.zdst.scs.supper.ResultObject;
import io.swagger.annotations.ApiOperation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/appVersion")
public class AppVersionController {
	
	private static final Logger logger = LoggerFactory.getLogger(AppVersionController.class);

	@Autowired
	private AppVersionService appVersionService;
	
	@ApiOperation(value = "验证版本信息", notes = "验证版本信息", response = AppVersionDTO.class)
	@RequestMapping(value = "/validateVersion", method = RequestMethod.POST)
	public ResultObject validateVersion(HttpServletRequest request, @RequestBody VersionParam versionParam) {
		ResultObject resultObject = new ResultObject();
		try {
			resultObject = appVersionService.validateVersion(request,versionParam);
		} catch (Exception e) {
			logger.error("验证版本信息异常", e);
			resultObject.fail("验证版本信息异常");
		}
		return resultObject;
	}
}