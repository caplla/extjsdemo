# extjs6.2.0示例项目
>后端采用spring boot +hibernate+themeleaf等实现。数据库用mysql

##### 去这里看文档：http://docs.sencha.com/extjs/6.2.0/classic/Ext.html
##### 访问：http://localhost:10000/tree/index


##### extjs 使用自己打包的webjars，在jars目录下。直接包含进去或者自己mvn add到本地库再引用都可以。

>mvn install:install-file  -Dfile=/xxx/jars/extjs-6.2.0.jar 
-DgroupId=com.luter -DartifactId=extjs -Dversion=6.2.0 -Dpackaging=jar  -DgeneratePom=true -DcreateChecksum=true


###下一步：实现token登录、 实现RBAC权限，并且功能菜单动态。