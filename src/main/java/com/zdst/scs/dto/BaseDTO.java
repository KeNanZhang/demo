package com.zdst.scs.dto;


import com.zdst.scs.constant.Constant;

public class BaseDTO {
	//当前页
	private Integer pageNum = 1;

	// 每页数量
	private Integer pageSize = Constant.PAGE_SIZE;
	

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getPageNum() {
		return pageNum;
	}

	public void setPageNum(Integer pageNum) {
		this.pageNum = pageNum;
	}
}
