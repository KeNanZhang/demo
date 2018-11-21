package com.zdst.scs.contorller.versionManage;

import com.zdst.scs.dto.versionManage.VersionRecordDTO;
import com.zdst.scs.entity.Project;
import com.zdst.scs.entity.VersionFile;
import com.zdst.scs.entity.VersionRecord;
import com.zdst.scs.service.projectManage.WebProjectManageService;
import com.zdst.scs.service.versionManage.WebVersionManageService;
import com.zdst.scs.supper.ResultObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
/**
 * @author 作者: zhangnan
 * @version 2018.10.17 项目管理
 * 
 */
@Controller
@RequestMapping("/versionManage")
public class WebVersionManageController {
	private static final Logger logger = LoggerFactory.getLogger(WebVersionManageController.class);

	@Autowired
	private WebProjectManageService webProjectManageService;
	@Autowired
	private WebVersionManageService webVersionManageService;
	/**
	 * 版本列表
	 * @param request
	 * @param versionRecordDTO
	 */
	@RequestMapping(value = "/filterPermission/versionList", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject versionList(HttpServletRequest request,VersionRecordDTO versionRecordDTO) {
		ResultObject result;
		try {
			result = webVersionManageService.versionList(versionRecordDTO);
		} catch (Exception e) {
			logger.error("获取火灾调查列表异常", e);
			result = ResultObject.getFailResult("获取火灾调查列表异常");
		}
		return result;
	}
	/**
	 * 版本
	 * @param request
	 * @param versionId
	 */
	@RequestMapping(value = "/filterPermission/queryVersion", method = RequestMethod.GET)
	@ResponseBody
	public ResultObject versionList(HttpServletRequest request,@RequestParam("versionId") Long versionId) {
		ResultObject result;
		try {
			result = webVersionManageService.queryById(versionId);
		} catch (Exception e) {
			logger.error("异常", e);
			result = ResultObject.getFailResult("查询版本信息异常");
		}
		return result;
	}
	/**
	 * 添加versionFile文件信息
	 * @param request
	 * @param versionFile
	 */
	@RequestMapping(value = "/filterPermission/addVersionFile", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject addVersionFile(HttpServletRequest request, @RequestBody VersionFile versionFile) {
		ResultObject result;
		try {
			result = webVersionManageService.addVersionFile(versionFile);
		} catch (Exception e) {
			logger.error("异常", e);
			result = ResultObject.getFailResult("文件版本添加异常");
		}
		return result;
	}
	/**
	 * 添加versionRecord文件信息
	 * @param request
	 * @param versionRecord
	 */
	@RequestMapping(value = "/filterPermission/addVersionRecord", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject addVersionRecord(HttpServletRequest request, @RequestBody VersionRecord versionRecord) {
		ResultObject result;
		try {
			result = webVersionManageService.addVersionRecord(versionRecord);
		} catch (Exception e) {
			logger.error("添加版本信息异常", e);
			result = ResultObject.getFailResult("文件版本添加异常");
		}
		return result;
	}
	/**
	 * 添加versionRecord文件信息
	 * @param request
	 * @param versionRecord
	 */
	@RequestMapping(value = "/filterPermission/updateVersionRecord", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject updateVersionRecord(HttpServletRequest request, @RequestBody VersionRecord versionRecord) {
		ResultObject result;
		try {
			result = webVersionManageService.updateVersionRecord(versionRecord);
		} catch (Exception e) {
			logger.error("添加版本信息异常", e);
			result = ResultObject.getFailResult("文件版本添加异常");
		}
		return result;
	}
	/**
	 * ios下载页面信息
	 * @param request
	 * @param project
	 */
	@RequestMapping(value = "/filterPermission/queryIosInfo", method = RequestMethod.POST)
	@ResponseBody
	public ResultObject queryIosInfo(HttpServletRequest request, @RequestBody Project project) {
		ResultObject result;
		try {
			result = webVersionManageService.queryIosInfo(project);
		} catch (Exception e) {
			logger.error("查询ios版本信息异常", e);
			result = ResultObject.getFailResult("查询ios版本信息异常");
		}
		return result;
	}
	//ios下载
	@RequestMapping(value = "/filterPermission/iosDownLoad/{projectKey}", method = RequestMethod.GET)
	public void appDownLoad(HttpServletRequest request, HttpServletResponse response,@PathVariable("projectKey")String projectKey) {
		Project project = webProjectManageService.queryByProjectKey(projectKey);
		//查询versionRecord
		ResultObject resultObject = webVersionManageService.queryById(project.getIosVersionRecordID());
		VersionRecordDTO versionRecordDTO = (VersionRecordDTO) resultObject.getData();
		//查询versionFile 安装包文件地址
		VersionFile versionFile = webVersionManageService.queryVersionFileById(versionRecordDTO.getVersionFileID());
		String url = versionFile.getFilePath();
		download(url,request,response);
	}
	//app下载
	@RequestMapping(value = "/filterPermission/appDownLoad/{recordId}", method = RequestMethod.GET)
	public void appDownLoad(HttpServletRequest request, HttpServletResponse response,@PathVariable("recordId")Long recordId) {
		ResultObject resultObject = webVersionManageService.queryById(recordId);
		VersionRecordDTO versionRecordDTO = (VersionRecordDTO) resultObject.getData();
		VersionFile versionFile = webVersionManageService.queryVersionFileById(versionRecordDTO.getVersionFileID());
		String url = versionFile.getFilePath();
		download(url,request,response);
	}

	public String download(String filePath, HttpServletRequest request, HttpServletResponse response) {
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			//获取文件名
			String fileName = filePath.substring(filePath.lastIndexOf("/")+1);
			response.setCharacterEncoding("utf-8");
			response.setContentType("application/octet-stream");
			//response.setContentType("application/force-download");
			//处理下载弹出框名字的编码问题
			response.setHeader("Content-Disposition", "attachment;fileName="
					+ new String( fileName.getBytes("gb2312"), "ISO8859-1" ));
			//获取文件的下载路径
			String path = request.getSession().getServletContext().getRealPath(filePath);
			//利用输入输出流对文件进行下载
			InputStream inputStream = new FileInputStream(new File(path));
			//设置文件大小
			response.setHeader("Content-Length", String.valueOf(inputStream.available()));

			bis = new BufferedInputStream(inputStream);//构造读取流
			bos = new BufferedOutputStream(response.getOutputStream());//构造输出流
			byte[] buff = new byte[1024];
			int bytesRead;
			//每次读取缓存大小的流，写到输出流
			while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
				bos.write(buff, 0, bytesRead);
			}
			response.flushBuffer();//将所有的读取的流返回给客户端

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try{
				if(null != bis){
					bis.close();
				}
				if(null != bos){
					bos.close();
				}
			}catch(IOException e){
				System.out.println("下载文件失败,"+"文件路径:"+filePath+e);
				logger.error("文件下载失败!", e);
			}
		}
		//  返回值要注意，要不然就出现下面这句错误！
		//java+getOutputStream() has already been called for this response
		return null;
	}

}