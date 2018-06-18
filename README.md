# DanYe Extjs Admin Panel Demo

spring boot extjs6.2.0 演示项目
---
欢迎fork、欢迎完善！
http://docs.sencha.com/extjs/6.2.0/classic/Ext.html
---






## 1、技术选型
#### 后端：
* 基础框架 spring boot 1.5.13
* 安全框架 shiro 1.4 
* 缓存：ehcache ，同时支持redis
* 根据表结构生成后端控制器、前端Extjs(类模型定义、Model、Store、Views)代码功能
#### 前端：
* 基础框架 Extjs 6.2.0，实现简单MVC动态加载模式。
* 图表:echarts2.0 
* 实现左侧菜单树+右侧内容区域布局。
* 右侧内容区域可单页切换，也可以tab切换。


## 2、当前实现功能
* RBAC权限体系，可动态加入权限项，基于shiro 的authc和perms过滤器实现。
* 用户管理功能、用户角色分配等
* 系统权限和菜单管理
* 系统访问日志、日志打印
* 代码自动生成演示示例：管理一群猫




#### 部署运行
1、fork本项目
2、配置application.properties,修改其中数据库为你的数据库信息。也可以在这里修改启动端口。
3、启动项目
4、访问：http://ip:port
5、系统启动默认会建立一个账号:admin，密码:aaaaaa，并且加入一些固定权限，留意启动日志。


###### 注意
* extjs 使用自己打包的webjars，在jars目录下。直接包含进去或者自己mvn add到本地库再引用都可以。

```
mvn install:install-file -Dfile=/xxx/jars/extjs-6.2.0.jar -DgroupId=com.luter -DartifactId=extjs -Dversion=6.2.0 -Dpackaging=jar -DgeneratePom=true -DcreateChecksum=true