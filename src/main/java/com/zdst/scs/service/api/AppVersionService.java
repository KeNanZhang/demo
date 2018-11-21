package com.zdst.scs.service.api;

import com.zdst.scs.dto.api.VersionParam;
import com.zdst.scs.supper.ResultObject;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by zhangnan on 2018/10/29 0029.
 */
public interface AppVersionService {

    ResultObject validateVersion(HttpServletRequest request, VersionParam versionParam);
}
