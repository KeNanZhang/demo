package com.zdst.scs.contorller.file;



import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import javax.servlet.http.HttpServletRequest;

import com.zdst.scs.supper.GsonUtil;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zdst.scs.supper.ResultObject;


@RestController
@RequestMapping("/file")
public class FileController {
	
  @Value("${apiUrl}")
  private String apiUrl;

    /**
     * 保存到webapp下的uploadDir目录下
     * @param file
     * @param request
     */
  @RequestMapping(value="/uploadFiles",method=RequestMethod.POST)
  public ResultObject uploadFiles(@RequestParam("file")MultipartFile file,@RequestParam("type") int type,HttpServletRequest request){
	   ResultObject rs = null;
	   String uploadDir;//上传目录
      if(!file.isEmpty()) {
          //可以对user做一些操作如存入数据库
          //以下的代码是将文件file重新命名并存入当前项目下webapp下的目录中
          String fileRealName = file.getOriginalFilename();                   //获得原始文件名;
          /*int pointIndex = fileRealName.indexOf(".");                        //点号的位置
          String fileSuffix = fileRealName.substring(pointIndex);             //截取文件后缀
          UUID FileId = UUID.randomUUID();                        //生成文件的前缀包含连字符
          String savedFileName = FileId.toString().replace("-", "").concat(fileSuffix);       //文件存取名
          */
          if(1 == type){
                uploadDir = "uploadDir/android/";
          }else{
              if (2 == type){
                  uploadDir = "uploadDir/ios/";
              }else{
                  if (3 == type) {
                      uploadDir = "uploadDir/plist/";
                  }else{
                      uploadDir = "uploadDir/others/";
                  }
              }
          }
          String savedDir = request.getSession().getServletContext().getRealPath(uploadDir); //获取服务器指定文件存取路径
          File savedFile = new File(savedDir, fileRealName);
          boolean isCreateSuccess;
          try {
              isCreateSuccess = savedFile.createNewFile();
              if (isCreateSuccess) {

                  file.transferTo(savedFile);  //转存文件
                  rs = ResultObject.getSuccessResult("上传文件成功");
                  //Long size = file.getSize();
                  //String str = savedDir +"\\";
                  //rs.setData(str.concat(fileRealName));
                  rs.setData(uploadDir+fileRealName);
              }else{
                  rs = ResultObject.getFailResult("请修改文件名,重新上传");
              }
          } catch (IOException e) {
              e.printStackTrace();
          }
      }else{
          rs = ResultObject.getFailResult("文件不能为空");
      }
      return rs;
  }

    /**
     * 使用第三方文件服务器地址上传文件
     * @param file
     * @param request
     * @return
     */
  @RequestMapping(value="/uploadFile",method=RequestMethod.POST)
  public ResultObject uploadFile(@RequestParam("file")MultipartFile file,HttpServletRequest request){
	   ResultObject rs = ResultObject.getSuccessResult("上传文件失败");
	   String token = request.getHeader("Authorization");

	  final String remote_url = apiUrl+"/file/uploadFile";// 第三方服务器请求地址
      CloseableHttpClient httpClient = HttpClients.createDefault();
      String result;
      try {
          String fileName = file.getOriginalFilename();
          HttpPost httpPost = new HttpPost(remote_url);
          MultipartEntityBuilder builder = MultipartEntityBuilder.create();
          builder.addBinaryBody("file", file.getInputStream(), ContentType.MULTIPART_FORM_DATA, fileName);// 文件流
          //builder.addBinaryBody("file", file.getInputStream(), ContentType.APPLICATION_OCTET_STREAM, fileName);// 文件流
          //builder.addTextBody("filename", fileName);// 类似浏览器表单提交，对应input的name和value
          HttpEntity entity = builder.build();
          httpPost.setEntity(entity);
          httpPost.setHeader("Authorization",token);
          HttpResponse response = httpClient.execute(httpPost);// 执行提交
          HttpEntity responseEntity = response.getEntity();
          if (responseEntity != null) {
              // 将响应内容转换为字符串
              result = EntityUtils.toString(responseEntity, Charset.forName("UTF-8"));
              rs = GsonUtil.GsonToBean(result, ResultObject.class);
          }
      } catch (IOException e) {
          e.printStackTrace();
      } catch (Exception e) {
          e.printStackTrace();
      } finally {
          try {
              httpClient.close();
          } catch (IOException e) {
              e.printStackTrace();
          }
      }
      return rs;
  }
}
