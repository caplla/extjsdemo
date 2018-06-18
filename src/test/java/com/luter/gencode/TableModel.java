package com.luter.gencode;

public class TableModel {

    private String COLUMN_NAME;
    private String REMARKS;
    private String TYPE_NAME;

    /**
     * <b>Summary: </b>
     * 获取cOLUMN_NAME的值
     *
     * @return cOLUMN_NAME
     */
    public String getCOLUMN_NAME() {
        return COLUMN_NAME;
    }

    /**
     * @param cOLUMNNAME 要设置的 cOLUMN_NAME
     */
    public void setCOLUMN_NAME(String cOLUMNNAME) {
        COLUMN_NAME = cOLUMNNAME;
    }

    /**
     * <b>Summary: </b>
     * 获取rEMARKS的值
     *
     * @return rEMARKS
     */
    public String getREMARKS() {
        return REMARKS;
    }

    /**
     * @param rEMARKS 要设置的 rEMARKS
     */
    public void setREMARKS(String rEMARKS) {
        REMARKS = rEMARKS;
    }

    /**
     * <b>Summary: </b>
     * 获取tYPE_NAME的值
     *
     * @return tYPE_NAME
     */
    public String getTYPE_NAME() {
        return TYPE_NAME;
    }

    /**
     * @param tYPENAME 要设置的 tYPE_NAME
     */
    public void setTYPE_NAME(String tYPENAME) {
        TYPE_NAME = tYPENAME;
    }

    @Override
    public String toString() {
        return "TableModel{" +
                "COLUMN_NAME='" + COLUMN_NAME + '\'' +
                ", REMARKS='" + REMARKS + '\'' +
                ", TYPE_NAME='" + TYPE_NAME + '\'' +
                '}';
    }
}
