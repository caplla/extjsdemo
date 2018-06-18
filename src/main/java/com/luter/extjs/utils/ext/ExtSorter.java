package com.luter.extjs.utils.ext;


public class ExtSorter {
    private String property;
    private String direction;

    /**
     * @return the property
     */
    public String getProperty() {
        return property;
    }

    /**
     * @param property the property to set
     */
    public void setProperty(String property) {
        this.property = property;
    }

    /**
     * @return the direction
     */
    public String getDirection() {
        return direction.toUpperCase();
    }

    /**
     * @param direction the direction to set
     */
    public void setDirection(String direction) {
        this.direction = direction;
    }
}
