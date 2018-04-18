CREATE DATABASE  IF NOT EXISTS `extjs_demo_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `extjs_demo_db`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: extjs_demo_db
-- ------------------------------------------------------
-- Server version	5.6.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_s_resource`
--

DROP TABLE IF EXISTS `t_s_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_s_resource` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `icon_cls` varchar(255) DEFAULT NULL,
  `module_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `perm` varchar(255) DEFAULT NULL,
  `pid` varchar(255) DEFAULT NULL,
  `qtip` varchar(255) DEFAULT NULL,
  `res_type` varchar(255) DEFAULT NULL,
  `uri` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_s_resource`
--

LOCK TABLES `t_s_resource` WRITE;
/*!40000 ALTER TABLE `t_s_resource` DISABLE KEYS */;
INSERT INTO `t_s_resource` VALUES ('0e78663a-0b7c-44e2-96c9-4fad562c8491','2018-04-06 13:44:32',NULL,NULL,0,'fa fa-users','sys.UserController','用户管理',NULL,'70a084af-5720-4a7c-98be-d80a6c52b651','管理系统里的用户','module',NULL),('174ff8c4-bf56-4325-b228-4d34570f3c37','2018-04-09 11:35:12',NULL,NULL,0,'','','添加用户','user:add','0e78663a-0b7c-44e2-96c9-4fad562c8491',NULL,'perm','/user/add'),('2bb05bb8-36d4-4cf8-9705-9200c30644c7','2018-04-06 13:49:32',NULL,NULL,0,'fa fa-users','sys.ResourceController','权限管理',NULL,'70a084af-5720-4a7c-98be-d80a6c52b651','管理系统里的权限','module',NULL),('70a084af-5720-4a7c-98be-d80a6c52b651','2018-04-06 13:03:15',NULL,NULL,0,'fa-bars',NULL,'系统管理',NULL,'0',NULL,'menu',NULL),('73290f99-faa6-47c1-a3f0-43b63b982d46','2018-04-09 11:37:20',NULL,NULL,0,'','','锁定/解锁用户','user:lock','0e78663a-0b7c-44e2-96c9-4fad562c8491',NULL,'perm','/user/lock'),('7c50bfba-e844-4497-ad79-4ba17a6f4e7f','2018-04-06 13:43:14',NULL,NULL,0,'fa fa-bars',NULL,'ShowCase',NULL,'0',NULL,'menu',NULL),('909b5966-16d6-4434-bc60-7b22f019fd02','2018-04-06 22:01:22',NULL,NULL,0,'fa fa-tree','showcase.ComboDemoController','下拉菜单示例',NULL,'7c50bfba-e844-4497-ad79-4ba17a6f4e7f','下拉菜单示例包括三级联动','module',NULL),('a1ae176e-9572-4b7e-a3e0-845dd3f801ec','2018-04-06 13:50:46',NULL,NULL,0,'fa fa-tree','showcase.TreeController','Tree使用',NULL,'7c50bfba-e844-4497-ad79-4ba17a6f4e7f','Tree使用','module',NULL),('a490fc67-7a32-43df-ad84-22a1e849af5e','2018-04-06 13:48:48',NULL,NULL,0,'fa fa-users','sys.RoleController','角色管理',NULL,'70a084af-5720-4a7c-98be-d80a6c52b651','管理系统里的角色','module',NULL),('c4ea4eee-9455-4110-9f96-28b0e8071c92','2018-04-18 11:24:49',NULL,NULL,0,'fa fa-tree','showcase.CatController','可编辑表格',NULL,'7c50bfba-e844-4497-ad79-4ba17a6f4e7f','可编辑表格的修改和提交示例','module',NULL),('f541ef96-98c0-4ea9-81ae-be305347432f','2018-04-09 11:35:58',NULL,NULL,0,'','','修改用户信息','user:update','0e78663a-0b7c-44e2-96c9-4fad562c8491',NULL,'perm','/user/update'),('f67bbf78-01f3-4285-9fcf-9b80eb1c8889','2018-04-09 13:07:00',NULL,NULL,0,'','','查看用户列表','user:list','0e78663a-0b7c-44e2-96c9-4fad562c8491','查看用户列表','perm','/user/list');
/*!40000 ALTER TABLE `t_s_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_s_role`
--

DROP TABLE IF EXISTS `t_s_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_s_role` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `reserved` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_s_role`
--

LOCK TABLES `t_s_role` WRITE;
/*!40000 ALTER TABLE `t_s_role` DISABLE KEYS */;
INSERT INTO `t_s_role` VALUES ('20aaa211-3889-4773-aea3-c48e895dc51a','2018-04-06 13:04:19','系统管理员','2018-04-06 21:48:29',1,'admin',''),('615a338d-d5c8-4ad7-b63b-301c29da82c5','2018-04-06 14:42:47','这是客人','2018-04-06 14:51:13',1,'guest','\0'),('830ab3b8-728d-43c6-9be0-c8883f5b91cf','2018-04-06 14:50:29','这是普通用户','2018-04-06 14:51:20',1,'user','\0');
/*!40000 ALTER TABLE `t_s_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_s_role_resource`
--

DROP TABLE IF EXISTS `t_s_role_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_s_role_resource` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `resource` varchar(128) DEFAULT NULL,
  `role` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK34x7luerjfkmlq6ftinblvtmj` (`resource`),
  KEY `FKc2q3von6akb7dx7qcblxc4va5` (`role`),
  CONSTRAINT `FK34x7luerjfkmlq6ftinblvtmj` FOREIGN KEY (`resource`) REFERENCES `t_s_resource` (`id`),
  CONSTRAINT `FKc2q3von6akb7dx7qcblxc4va5` FOREIGN KEY (`role`) REFERENCES `t_s_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_s_role_resource`
--

LOCK TABLES `t_s_role_resource` WRITE;
/*!40000 ALTER TABLE `t_s_role_resource` DISABLE KEYS */;
INSERT INTO `t_s_role_resource` VALUES ('0a3bf135-df8e-4351-85bf-a21000632c0a','2018-04-18 11:25:31',NULL,NULL,0,'a1ae176e-9572-4b7e-a3e0-845dd3f801ec','20aaa211-3889-4773-aea3-c48e895dc51a'),('115cef8d-069b-437b-b99f-db5d0d9027ac','2018-04-18 11:25:31',NULL,NULL,0,'a490fc67-7a32-43df-ad84-22a1e849af5e','20aaa211-3889-4773-aea3-c48e895dc51a'),('39e7663e-ff3d-43fa-a13e-96c56862f87e','2018-04-09 11:37:40',NULL,NULL,0,'a1ae176e-9572-4b7e-a3e0-845dd3f801ec','830ab3b8-728d-43c6-9be0-c8883f5b91cf'),('3b635b76-cf5d-4dd3-8e9c-7bce595f545e','2018-04-18 11:25:31',NULL,NULL,0,'70a084af-5720-4a7c-98be-d80a6c52b651','20aaa211-3889-4773-aea3-c48e895dc51a'),('47f44458-c730-49fb-bb19-15593b9a7ad7','2018-04-18 11:25:31',NULL,NULL,0,'f541ef96-98c0-4ea9-81ae-be305347432f','20aaa211-3889-4773-aea3-c48e895dc51a'),('4c9af4ef-458a-4d7c-8060-98cab0916b6e','2018-04-06 21:31:32',NULL,NULL,0,'a490fc67-7a32-43df-ad84-22a1e849af5e','615a338d-d5c8-4ad7-b63b-301c29da82c5'),('56eee7ac-2b2b-4480-89a7-f66438651b4e','2018-04-18 11:25:31',NULL,NULL,0,'2bb05bb8-36d4-4cf8-9705-9200c30644c7','20aaa211-3889-4773-aea3-c48e895dc51a'),('578a627e-b13b-4b62-b0b6-57e43156a0f8','2018-04-09 11:37:40',NULL,NULL,0,'7c50bfba-e844-4497-ad79-4ba17a6f4e7f','830ab3b8-728d-43c6-9be0-c8883f5b91cf'),('5ec14e9e-35e7-48da-8fb7-f0cb0cb7b76d','2018-04-18 11:25:31',NULL,NULL,0,'909b5966-16d6-4434-bc60-7b22f019fd02','20aaa211-3889-4773-aea3-c48e895dc51a'),('63835db8-d488-4db3-a5dc-e9d9dba66b16','2018-04-06 21:31:32',NULL,NULL,0,'0e78663a-0b7c-44e2-96c9-4fad562c8491','615a338d-d5c8-4ad7-b63b-301c29da82c5'),('726abc2a-e41e-4ef3-aaab-b187d32f6123','2018-04-18 11:25:31',NULL,NULL,0,'7c50bfba-e844-4497-ad79-4ba17a6f4e7f','20aaa211-3889-4773-aea3-c48e895dc51a'),('85fe3ce7-80d9-49a3-9276-6661e8fb5890','2018-04-09 11:37:40',NULL,NULL,0,'909b5966-16d6-4434-bc60-7b22f019fd02','830ab3b8-728d-43c6-9be0-c8883f5b91cf'),('a140a2cb-0408-4289-8e68-b5e995b48bb4','2018-04-18 11:25:31',NULL,NULL,0,'0e78663a-0b7c-44e2-96c9-4fad562c8491','20aaa211-3889-4773-aea3-c48e895dc51a'),('a2efa9a8-3f37-4316-bf41-ff4f1deeb7d4','2018-04-18 11:25:31',NULL,NULL,0,'174ff8c4-bf56-4325-b228-4d34570f3c37','20aaa211-3889-4773-aea3-c48e895dc51a'),('ae8d4cde-5bb0-425f-80d5-c613f67d3186','2018-04-06 21:31:32',NULL,NULL,0,'2bb05bb8-36d4-4cf8-9705-9200c30644c7','615a338d-d5c8-4ad7-b63b-301c29da82c5'),('b2d3651b-f7e1-4a60-a5f9-dcff269e0c5b','2018-04-06 21:31:32',NULL,NULL,0,'70a084af-5720-4a7c-98be-d80a6c52b651','615a338d-d5c8-4ad7-b63b-301c29da82c5'),('ea95ed66-0e26-458a-a476-20683d8f1397','2018-04-18 11:25:31',NULL,NULL,0,'73290f99-faa6-47c1-a3f0-43b63b982d46','20aaa211-3889-4773-aea3-c48e895dc51a'),('f6c4b21b-9471-4559-95cb-c109c5bbcfb7','2018-04-18 11:25:31',NULL,NULL,0,'c4ea4eee-9455-4110-9f96-28b0e8071c92','20aaa211-3889-4773-aea3-c48e895dc51a'),('fb15348c-1bfb-4879-b333-bb53b065258d','2018-04-18 11:25:31',NULL,NULL,0,'f67bbf78-01f3-4285-9fcf-9b80eb1c8889','20aaa211-3889-4773-aea3-c48e895dc51a');
/*!40000 ALTER TABLE `t_s_role_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_s_role_user`
--

DROP TABLE IF EXISTS `t_s_role_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_s_role_user` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `role` varchar(128) DEFAULT NULL,
  `user` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhhtbeom0472k3xs9f1h0vsleo` (`role`),
  KEY `FK1fhunyn6hnatvsdoon4h4by9k` (`user`),
  CONSTRAINT `FK1fhunyn6hnatvsdoon4h4by9k` FOREIGN KEY (`user`) REFERENCES `t_s_user` (`id`),
  CONSTRAINT `FKhhtbeom0472k3xs9f1h0vsleo` FOREIGN KEY (`role`) REFERENCES `t_s_role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_s_role_user`
--

LOCK TABLES `t_s_role_user` WRITE;
/*!40000 ALTER TABLE `t_s_role_user` DISABLE KEYS */;
INSERT INTO `t_s_role_user` VALUES ('03534a81-58d4-42f2-9f49-b26a40feceba','2018-04-06 13:05:50',NULL,NULL,0,'20aaa211-3889-4773-aea3-c48e895dc51a','481b2b20-0d23-4334-9a9b-a7583fb64549'),('1facb63b-39ca-4aa6-87dc-0507f2fa77b8','2018-04-09 13:20:19',NULL,NULL,0,'615a338d-d5c8-4ad7-b63b-301c29da82c5','e6dcfd00-1f1f-44f3-ae03-9fc7244d4647'),('3aa34d7e-170a-47eb-aade-424af2fabe42','2018-04-09 13:20:19',NULL,NULL,0,'20aaa211-3889-4773-aea3-c48e895dc51a','e6dcfd00-1f1f-44f3-ae03-9fc7244d4647'),('49d27243-f949-4505-92d3-1cf0729d6e4c','2018-04-09 13:20:19',NULL,NULL,0,'830ab3b8-728d-43c6-9be0-c8883f5b91cf','e6dcfd00-1f1f-44f3-ae03-9fc7244d4647');
/*!40000 ALTER TABLE `t_s_role_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_s_user`
--

DROP TABLE IF EXISTS `t_s_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_s_user` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `locked` bit(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_s_user`
--

LOCK TABLES `t_s_user` WRITE;
/*!40000 ALTER TABLE `t_s_user` DISABLE KEYS */;
INSERT INTO `t_s_user` VALUES ('481b2b20-0d23-4334-9a9b-a7583fb64549','2018-04-06 13:00:31','3','\0','bf4df9af06f213df7cc69eedd96f7aa6','3556553547c97a97d9e7a0cd9576463b','2018-04-13 14:07:53','admin',3),('e6dcfd00-1f1f-44f3-ae03-9fc7244d4647','2018-04-09 13:20:19','4','','a4c3addade2de5a0984077f841fcf874','b40593656dbae833702c4eda88afedc6','2018-04-09 19:46:32','luter',21);
/*!40000 ALTER TABLE `t_s_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_showcase_cat`
--

DROP TABLE IF EXISTS `t_showcase_cat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_showcase_cat` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_showcase_cat`
--

LOCK TABLES `t_showcase_cat` WRITE;
/*!40000 ALTER TABLE `t_showcase_cat` DISABLE KEYS */;
INSERT INTO `t_showcase_cat` VALUES ('0ba8b999-4c38-4932-be4b-e177d14d2334','2018-04-18 14:59:32',NULL,NULL,0,22,'1','老王'),('71401509-f428-4cac-8f21-ef847da5eede','2018-04-18 11:40:16',NULL,NULL,0,8,'3','王宝强'),('95c60761-ac79-4fc9-81ab-10a960233942','2018-04-18 15:30:39',NULL,NULL,0,12,'2','asdads'),('9ed889d5-f86e-4d7b-adae-e6d20f7465cf','2018-04-18 15:25:52',NULL,NULL,0,2,'2','asd'),('cf0bbb24-22ac-46e6-9241-4843e64628c6','2018-04-18 15:27:26',NULL,NULL,0,12,'1',' 稍等'),('ee99619d-3f8a-41e9-a05f-185f410e94ea','2018-04-18 11:39:31',NULL,NULL,0,5,'3','马蓉'),('fd45a17e-060a-48f5-a2c0-4b0e5b0c926a','2018-04-18 14:59:32',NULL,NULL,0,23,'1','宋喆');
/*!40000 ALTER TABLE `t_showcase_cat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_showcase_tree`
--

DROP TABLE IF EXISTS `t_showcase_tree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_showcase_tree` (
  `id` varchar(128) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `update_at` datetime DEFAULT NULL,
  `version` int(11) NOT NULL,
  `iconcls` varchar(255) DEFAULT NULL,
  `pid` varchar(255) DEFAULT NULL,
  `qtip` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_showcase_tree`
--

LOCK TABLES `t_showcase_tree` WRITE;
/*!40000 ALTER TABLE `t_showcase_tree` DISABLE KEYS */;
INSERT INTO `t_showcase_tree` VALUES ('40f5770b-d663-46fb-a086-223afc10e681','2018-04-06 21:58:43',NULL,NULL,0,'fa-bars','dd85a4d4-7641-4aeb-9074-f29d1408d7f4',NULL,'爷爷'),('5f425fd2-47d3-4411-a64e-8f69a7528911','2018-04-06 21:58:09',NULL,NULL,0,'fa-bars','0',NULL,'祖母'),('a700f499-fefe-438c-8974-0d5bbbd40e0c','2018-04-06 21:59:10',NULL,NULL,0,'fa-bars','40f5770b-d663-46fb-a086-223afc10e681',NULL,'爸爸'),('dd85a4d4-7641-4aeb-9074-f29d1408d7f4','2018-04-06 21:57:40',NULL,NULL,0,'fa-bars','0',NULL,'祖父');
/*!40000 ALTER TABLE `t_showcase_tree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'extjs_demo_db'
--

--
-- Dumping routines for database 'extjs_demo_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-18 15:37:51
