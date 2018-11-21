package com.zdst.scs.supper;

import java.io.Serializable;
import java.util.Collections;

/**
 * Created by lxh on 2018/9/4.
 */
public class ResultPage implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = 6961264706555112660L;



    public ResultPage() {
        super();
    }

    public ResultPage(int dataCount, int pageNum) {

        this.pageNum = pageNum;
        this.dataCount = dataCount;
        this.startRow = (pageNum - 1) * pageSize;
        totalPage = (dataCount + pageSize - 1) / pageSize;
    }

    public ResultPage(int dataCount, int pageNum, int pageSize) {
        this.pageSize = pageSize;

        this.pageNum = pageNum;
        this.dataCount = dataCount;
        this.startRow = (pageNum - 1) * pageSize;
        totalPage = (dataCount + pageSize - 1) / pageSize;
    }

    // 当前页
    private int pageNum;

    /**
     * 每页数量		10
     */
    private int pageSize = 5;

    /**
     * 数据总量
     */
    private Integer dataCount;

    /**
     * 总页数
     */
    private Integer totalPage;

    /**
     * 开始行
     */
    private Integer startRow;

    /**
     * 当前页数据
     */
    private Object pageData;

    public int getPageNum() {
        return pageNum;
    }

    public void setPageNum(int pageNum) {
        this.pageNum = pageNum;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public Object getPageData() {
        return pageData;
    }

    public void setPageData(Object pageData) {
        this.pageData = pageData;
    }

    public Integer getDataCount() {
        return dataCount;
    }

    public void setDataCount(Integer dataCount) {
        this.dataCount = dataCount;
    }

    public Integer getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(Integer totalPage) {
        this.totalPage = totalPage;
    }

    public Integer getStartRow() {
        return startRow;
    }

    public void setStartRow(Integer startRow) {
        this.startRow = startRow;
    }


    public static ResultPage emptyPage() {
        ResultPage page = new ResultPage(0, 0);
        page.setPageData(Collections.emptyList());
        return page;
    }
}
