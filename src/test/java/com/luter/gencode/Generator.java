package com.luter.gencode;


import lombok.extern.slf4j.Slf4j;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.app.VelocityEngine;

import java.io.File;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

/**
 * 根据数据库表的字段和字段注释，通过velocity自动产生前端和控制器层面的代码。
 * 执行之前，需要配置路径参数
 * 1、先新建一个entity ,启动程序，自动建表
 * 2、打开数据库，给每个字段添加备注
 * 3、执行代码生成
 * 4、把产生的代码拷贝到对应的目录下，把产生的模型定义复制到config.js文件的对应位置
 * 5、重启，在资源管理里添加这个模块
 * 6、刷新页面，试试看。
 */
public class Generator {
    static Connection connection = null;
    //产生的代码放哪里?绝对路径
    static String code_path = "/luter/develop/temp/gencode";
    ///模板文件的路径在哪里？也就是tpl目录的绝对路径velocity需要知道这个。
    static String tpl_base_path = "/luter/develop/jiaoshoujia/extjs/extjsdemo/src/test/java/com/luter/gencode/tpl/";

    static {
        getMySQLConnection();
    }

    public static void main(String[] args) {
        try {
            genCodes("cat", "t_pet_cat", "TPCat", "pet");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (!connection.isClosed()) {
                    connection.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }

        }
        System.exit(0);

    }


    /**
     * 批量产生extjs的代码
     *
     * @param name      the name  这个类叫啥，比如叫user ,role ,resource 小写即可,用在前端的JS中
     * @param tableName the table name  数据库里表叫啥，看数据库
     * @param className the class name  JAVA实体类名称叫啥，比如TCat
     * @param module    the module     基础模块名称叫啥？其实就是这个模块的上层目录名称。也是url的前缀
     */
    public static void genCodes(String name, String tableName, String className, String module) {
        String storePath = code_path + "/store/";
        new File(storePath).mkdir();
        String modelPath = code_path + "/model/";
        new File(modelPath).mkdir();
        String viewPath = code_path + "/view/" + module + "/" + name + "/";
        new File(viewPath).mkdirs();
        String javaPath = code_path + "/java/";
        new File(javaPath).mkdirs();
        String nameDX = name.substring(0, 1).toUpperCase() + name.substring(1);
        genCode(viewPath + nameDX + ".js", "panel.js", module, name, tableName, className);
        genCode(modelPath + nameDX + "Model.js", "model.js", module, name, tableName, className);
        genCode(storePath + nameDX + "Store.js", "store.js", module, name, tableName, className);
        genCode(viewPath + nameDX + "Add.js", "add.js", module, name, tableName, className);
        genCode(viewPath + nameDX + "Edit.js", "edit.js", module, name, tableName, className);
        genCode(viewPath + nameDX + "List.js", "list.js", module, name, tableName, className);
        genCode(code_path + "/java/" + nameDX + "Controller.java", "javaController.vm", module, name, tableName, className);
        printCode("cons.js", module, name, tableName, className);

    }


    /**
     * Gen code.
     *
     * @param saveFile        the save file
     * @param vmName          the vm name
     * @param module_name     the module name
     * @param cname           the cname
     * @param table_name      the table name
     * @param java_class_name the java class name
     */
    public static void genCode(String saveFile, String vmName, String module_name, String cname, String table_name, String java_class_name) {
        System.out.println("产生代码，模板文件：" + vmName + "," +
                "模块名称:" + module_name + ",表名称:" + table_name + ",java 类名称:" + java_class_name);
        PrintWriter pw;
        Template t;
        VelocityContext context;
        try {
            List<TableModel> models = getTableModels(table_name);
            Properties p = new Properties();
            p.setProperty(Velocity.INPUT_ENCODING, "UTF-8");
            p.setProperty(Velocity.OUTPUT_ENCODING, "UTF-8");
            p.setProperty(VelocityEngine.FILE_RESOURCE_LOADER_PATH, tpl_base_path);
            Velocity.init(p);
            t = Velocity.getTemplate(vmName, "UTF-8"); // 设置初始化数据
            context = new VelocityContext();
            String cnameDX = cname.substring(0, 1).toUpperCase()
                    + cname.substring(1);
            context.put("cname", cname);
            context.put("cnamexx", cname);
            context.put("cnamedx", cnameDX);
            context.put("modulename", module_name);
            context.put("b", models);
            context.put("java_table_name", table_name);
            context.put("java_class_name", java_class_name);
            pw = new PrintWriter(saveFile);
            t.merge(context, pw);
            pw.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        }
    }

    public static void printCode(String vmName, String module_name, String cname, String table_name, String java_class_name) {
        try {
            List<TableModel> models = getTableModels(table_name);
            Properties p = new Properties();
            p.setProperty(Velocity.INPUT_ENCODING, "UTF-8");
            p.setProperty(Velocity.OUTPUT_ENCODING, "UTF-8");
            p.setProperty(VelocityEngine.FILE_RESOURCE_LOADER_PATH, tpl_base_path);
            Velocity.init(p);
            Template t = Velocity.getTemplate(vmName, "UTF-8"); // 设置初始化数据
            VelocityContext context = new VelocityContext();
            String daxieString = cname.substring(0, 1).toUpperCase()
                    + cname.substring(1);
            context.put("cname", cname);
            context.put("cnamexx", cname.toLowerCase());
            context.put("cnamedx", daxieString);
            context.put("modulename", module_name);
            context.put("b", models);
            context.put("java_table_name", table_name);
            context.put("java_class_name", java_class_name);
            StringWriter writer = new StringWriter();

            t.merge(context, writer);
            System.out.println(writer.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static List<TableModel> getTableModels(String tableName)
            throws Exception {
        List<TableModel> models = new ArrayList<>();
        ResultSet colRet = connection.getMetaData().getColumns(null, "%", tableName,
                "%");
        while (colRet.next()) {
            String columnName = colRet.getString("COLUMN_NAME");
            String remark = colRet.getString("REMARKS");
            String type = colRet.getString("TYPE_NAME");
            TableModel a = new TableModel();
            a.setCOLUMN_NAME(columnName);
            a.setREMARKS(remark);
            a.setTYPE_NAME(type);
            models.add(a);

        }

        return models;

    }

    /**
     * 数据库连接
     */
    public static void getMySQLConnection() {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/extjs_demo_db?useInformationSchema=true", "root", "123456");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }


    }

}
