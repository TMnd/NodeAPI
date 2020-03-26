CREATE DATABASE  IF NOT EXISTS `smac` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `smac`;
-- MariaDB dump 10.17  Distrib 10.4.7-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smac
-- ------------------------------------------------------
-- Server version	10.1.41-MariaDB-0+deb9u1

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
-- Table structure for table `alexa_commands`
--

DROP TABLE IF EXISTS `alexa_commands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alexa_commands` (
  `ref_id_arduinos` int(11) NOT NULL,
  `alexa_command` int(11) DEFAULT NULL,
  PRIMARY KEY (`ref_id_arduinos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `arduinos`
--

DROP TABLE IF EXISTS `arduinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arduinos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(25) CHARACTER SET latin1 NOT NULL,
  `client_macaddress` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `new_changes` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_macaddress_unique` (`client_macaddress`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`joao`@`localhost`*/ /*!50003 TRIGGER arduino_createAlexa
  AFTER INSERT
  ON arduinos FOR EACH ROW
begin
/* variables */
  DECLARE tmpVar INTEGER; 
  /*SET tmpVar = (SELECT LAST_INSERT_ID());
  /* code */
  INSERT INTO alexa_commands (ref_id_arduinos,alexa_command)VALUES(NEW.id,0);
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `arduinos_config`
--

DROP TABLE IF EXISTS `arduinos_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arduinos_config` (
  `ref_id_arduino` int(11) NOT NULL,
  `master_password` varchar(255) DEFAULT NULL,
  `report_url` varchar(255) DEFAULT NULL,
  `config_url` varchar(255) DEFAULT NULL,
  `caudal_target` int(11) DEFAULT NULL,
  `report_url_subfix` varchar(255) DEFAULT NULL,
  `config_url_subfix` varchar(255) DEFAULT NULL,
  `ref_id_modelTank` int(11) DEFAULT NULL,
  PRIMARY KEY (`ref_id_arduino`),
  KEY `fk_arduinos_config_model_tank` (`ref_id_modelTank`),
  CONSTRAINT `fk_arduinos_config_arduinos` FOREIGN KEY (`ref_id_arduino`) REFERENCES `arduinos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_arduinos_config_model_tank` FOREIGN KEY (`ref_id_modelTank`) REFERENCES `model_tank` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_tank`
--

DROP TABLE IF EXISTS `model_tank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_tank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(45) NOT NULL,
  `country` varchar(45) NOT NULL,
  `sf_volume_target` int(11) DEFAULT NULL,
  `ff_volume_target` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tank_mapping`
--

DROP TABLE IF EXISTS `tank_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tank_mapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `volume` float NOT NULL,
  `waterlevel` int(11) NOT NULL,
  `ref_id_model_tank` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tank_mapping_model_tank` (`ref_id_model_tank`),
  CONSTRAINT `fk_tank_mapping_model_tank` FOREIGN KEY (`ref_id_model_tank`) REFERENCES `model_tank` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tank_mapping_oli`
--

DROP TABLE IF EXISTS `tank_mapping_oli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tank_mapping_oli` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `volume` float DEFAULT NULL,
  `waterlevel` int(11) DEFAULT NULL,
  `ref_id_model_tank` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tanl_mapping_oli_model_tank` (`ref_id_model_tank`),
  CONSTRAINT `fk_tanl_mapping_oli_model_tank` FOREIGN KEY (`ref_id_model_tank`) REFERENCES `model_tank` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `waterlevel`
--

DROP TABLE IF EXISTS `waterlevel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `waterlevel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `milliseconds` bigint(45) DEFAULT NULL,
  `realtime` datetime(3) DEFAULT NULL,
  `refill` tinyint(4) DEFAULT NULL,
  `value` decimal(45,0) DEFAULT NULL,
  `ref_arduino` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ref_arduino` (`ref_arduino`),
  CONSTRAINT `ref_arduino` FOREIGN KEY (`ref_arduino`) REFERENCES `arduinos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24735 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'smac'
--
/*!50003 DROP PROCEDURE IF EXISTS `getInsertedId_` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`joao`@`localhost` PROCEDURE `getInsertedId_`(c_n VarChar(50), c_m VarChar(50))
    NO SQL
BEGIN 
    INSERT IGNORE INTO arduinos SET client_name = c_n, client_macaddress = c_m, new_changes=0;
    SELECT LAST_INSERT_ID() as o;  
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `placeOrder` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`joao`@`localhost` PROCEDURE `placeOrder`(IN _cartId INT,IN _createdBy INT)
BEGIN

    -- insert into order
    INSERT INTO `TBL_ORDER`(`DealerId`, `OrderNo`, `CreatedBy`) VALUES ((SELECT DealerId FROM TBL_SHOPPING_CART WHERE Id =  _cartId),UNIX_TIMESTAMP(),_createdBy); 

           SELECT LAST_INSERT_ID() AS '_orderId ';


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-26 19:34:51
