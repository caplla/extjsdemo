package com.luter.extjs.util.json;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JacksonUtils {
    /**
     * The constant DEFAULT_DATE_FORMAT.
     */
    private static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    /**
     * The constant mapper.
     */
    private static ObjectMapper mapper;

    static {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
        mapper = new ObjectMapper();
        mapper.setDateFormat(dateFormat);
    }

    /**
     * Map to jon string.
     *
     * @param object the object
     * @return the string
     */
    public static String mapToJon(Object object) {
        if (mapper == null) {
            mapper = new ObjectMapper();
        }
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();

        }
        return null;
    }

    /**
     * List to jon string.
     *
     * @param list the list
     * @return the string
     */
    public static String ListToJon(List list) {
        if (mapper == null) {
            mapper = new ObjectMapper();
        }
        try {
            return mapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {

            e.printStackTrace();

        }
        return null;
    }

    /**
     * Object to json string.
     *
     * @param object the object
     * @return the string
     */
    public static String objectToJson(Object object) {
        if (mapper == null) {
            mapper = new ObjectMapper();
        }

        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();

        }
        return null;
    }

    public static <T> T mapToPojo(Map map, Class<T> clazz) {
        return mapper.convertValue(map, clazz);
    }

    public static <T> T jsonToObject(String jsonArrayStr, Class<T> clazz) {
        try {
            return mapper.readValue(jsonArrayStr, clazz);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static <T> List<T> jsonToObjectList(String jsonArrayStr, Class<T> clazz) {
        List<Map<String, Object>> list;
        try {
            list = mapper.readValue(jsonArrayStr,
                    new TypeReference<List<T>>() {
                    });
            List<T> result = new ArrayList<>();
            for (Map<String, Object> map : list) {
                result.add(mapToPojo(map, clazz));
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }


        return null;
    }


}
