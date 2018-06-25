package com.luter.extjs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.LocalEntityManagerFactoryBean;

@SpringBootApplication
public class ExtjsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExtjsApplication.class, args);
    }


}
