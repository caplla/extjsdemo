package com.luter.extjs.common.util;


import org.springframework.data.domain.Sort;

public class PageModel<T> {
    private int total;
    private Object data;
    private int currentPage;
    private int pageSize;
    private int totalPage;
    private int itemCount;
    private Sort sort;

    public PageModel(int total, Object data) {
        this.total = total;
        this.data = data;
    }

    public PageModel(int total, Object data, int currentPage, int pageSize, int totalPage, int itemCount) {
        this.total = total;
        this.data = data;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPage = totalPage;
        this.itemCount = itemCount;
    }

    public PageModel(int total, Object data, int currentPage, int pageSize, int totalPage, int itemCount, Sort sort) {
        this.total = total;
        this.data = data;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPage = totalPage;
        this.itemCount = itemCount;
        this.sort = sort;
    }

    public Sort getSort() {
        return sort;
    }

    public void setSort(Sort sort) {
        this.sort = sort;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getTotalPage() {
        return totalPage;
    }

    public void setTotalPage(int totalPage) {
        this.totalPage = totalPage;
    }


    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
}
