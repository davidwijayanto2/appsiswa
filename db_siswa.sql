-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_siswa
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dkelasactual`
--

DROP TABLE IF EXISTS `dkelasactual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dkelasactual` (
  `idDKelasActual` int(11) NOT NULL AUTO_INCREMENT,
  `idHKelasActual` int(11) NOT NULL,
  `idSiswa` int(11) NOT NULL,
  `totalNilai` int(11) DEFAULT NULL,
  PRIMARY KEY (`idDKelasActual`),
  KEY `dKelasActual_idHKelasActual_fkey` (`idHKelasActual`),
  KEY `dKelasActual_idSiswa_fkey` (`idSiswa`),
  CONSTRAINT `dKelasActual_idHKelasActual_fkey` FOREIGN KEY (`idHKelasActual`) REFERENCES `hkelasactual` (`idHKelasActual`) ON UPDATE CASCADE,
  CONSTRAINT `dKelasActual_idSiswa_fkey` FOREIGN KEY (`idSiswa`) REFERENCES `siswa` (`idSiswa`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dkelasactual`
--

LOCK TABLES `dkelasactual` WRITE;
/*!40000 ALTER TABLE `dkelasactual` DISABLE KEYS */;
INSERT INTO `dkelasactual` VALUES (2,7,1,NULL),(3,8,1,NULL);
/*!40000 ALTER TABLE `dkelasactual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guru`
--

DROP TABLE IF EXISTS `guru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guru` (
  `idGuru` int(11) NOT NULL AUTO_INCREMENT,
  `namaGuru` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenisKelamin` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noHP` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusGuru` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idGuru`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guru`
--

LOCK TABLES `guru` WRITE;
/*!40000 ALTER TABLE `guru` DISABLE KEYS */;
INSERT INTO `guru` VALUES (1,'David Wijayanto','babatan','L','0811121',1),(5,'jessica','surabaya','P','081313123',1),(6,'patricia','surabaya','P','08131313',1);
/*!40000 ALTER TABLE `guru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hkelasactual`
--

DROP TABLE IF EXISTS `hkelasactual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hkelasactual` (
  `idHKelasActual` int(11) NOT NULL AUTO_INCREMENT,
  `idKelas` int(11) NOT NULL,
  `idGuru` int(11) NOT NULL,
  `avgNilaiKelas` int(11) DEFAULT NULL,
  `statusHKelasActual` int(11) NOT NULL DEFAULT 1,
  `tahunAjaran` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idHKelasActual`),
  KEY `hKelasActual_idKelas_fkey` (`idKelas`),
  KEY `hKelasActual_idGuru_fkey` (`idGuru`),
  CONSTRAINT `hKelasActual_idGuru_fkey` FOREIGN KEY (`idGuru`) REFERENCES `guru` (`idGuru`) ON UPDATE CASCADE,
  CONSTRAINT `hKelasActual_idKelas_fkey` FOREIGN KEY (`idKelas`) REFERENCES `kelas` (`idKelas`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hkelasactual`
--

LOCK TABLES `hkelasactual` WRITE;
/*!40000 ALTER TABLE `hkelasactual` DISABLE KEYS */;
INSERT INTO `hkelasactual` VALUES (7,1,5,NULL,1,'2022/2023'),(8,4,6,NULL,1,'2023/2024');
/*!40000 ALTER TABLE `hkelasactual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kelas`
--

DROP TABLE IF EXISTS `kelas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kelas` (
  `idKelas` int(11) NOT NULL AUTO_INCREMENT,
  `namaKelas` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusKelas` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idKelas`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kelas`
--

LOCK TABLES `kelas` WRITE;
/*!40000 ALTER TABLE `kelas` DISABLE KEYS */;
INSERT INTO `kelas` VALUES (1,'X-1',1),(2,'X-2',1),(3,'X-3',1),(4,'XI-1',1),(5,'XI-2',1),(6,'XI-3',1),(7,'XII-1',1),(8,'XII-2',1),(9,'XII-3',1);
/*!40000 ALTER TABLE `kelas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matapelajaran`
--

DROP TABLE IF EXISTS `matapelajaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matapelajaran` (
  `idMataPelajaran` int(11) NOT NULL AUTO_INCREMENT,
  `namaMataPelajaran` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusMataPelajaran` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idMataPelajaran`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matapelajaran`
--

LOCK TABLES `matapelajaran` WRITE;
/*!40000 ALTER TABLE `matapelajaran` DISABLE KEYS */;
INSERT INTO `matapelajaran` VALUES (1,'Fisika',1),(2,'Matematika',1),(3,'Biologi',1),(4,'Kimia',1),(5,'Bahasa Inggris',1);
/*!40000 ALTER TABLE `matapelajaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nilaimatpel`
--

DROP TABLE IF EXISTS `nilaimatpel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nilaimatpel` (
  `idNilai` int(11) NOT NULL AUTO_INCREMENT,
  `idMataPelajaran` int(11) NOT NULL,
  `idDKelasActual` int(11) NOT NULL,
  `nilai` int(11) DEFAULT NULL,
  PRIMARY KEY (`idNilai`),
  KEY `nilaiMatPel_idMataPelajaran_fkey` (`idMataPelajaran`),
  KEY `nilaiMatPel_idDKelasActual_fkey` (`idDKelasActual`),
  CONSTRAINT `nilaiMatPel_idDKelasActual_fkey` FOREIGN KEY (`idDKelasActual`) REFERENCES `dkelasactual` (`idDKelasActual`) ON UPDATE CASCADE,
  CONSTRAINT `nilaiMatPel_idMataPelajaran_fkey` FOREIGN KEY (`idMataPelajaran`) REFERENCES `matapelajaran` (`idMataPelajaran`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nilaimatpel`
--

LOCK TABLES `nilaimatpel` WRITE;
/*!40000 ALTER TABLE `nilaimatpel` DISABLE KEYS */;
INSERT INTO `nilaimatpel` VALUES (6,1,2,NULL),(7,2,2,NULL),(8,3,2,NULL),(9,5,2,NULL),(10,1,3,NULL),(11,2,3,NULL),(12,3,3,NULL),(13,5,3,NULL),(14,4,3,NULL);
/*!40000 ALTER TABLE `nilaimatpel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siswa`
--

DROP TABLE IF EXISTS `siswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siswa` (
  `idSiswa` int(11) NOT NULL AUTO_INCREMENT,
  `namaSiswa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alamat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenisKelamin` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noHP` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photoProfile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statusSiswa` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idSiswa`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siswa`
--

LOCK TABLES `siswa` WRITE;
/*!40000 ALTER TABLE `siswa` DISABLE KEYS */;
INSERT INTO `siswa` VALUES (1,'david wijayanto','surabaya','L','081112333',NULL,1),(2,'joachim','surabaya','L','08131313111',NULL,1);
/*!40000 ALTER TABLE `siswa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idSiswa` int(11) DEFAULT NULL,
  `idGuru` int(11) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `user_email_key` (`email`),
  KEY `user_idSiswa_idGuru_idx` (`idSiswa`,`idGuru`),
  KEY `user_idGuru_fkey` (`idGuru`),
  CONSTRAINT `user_idGuru_fkey` FOREIGN KEY (`idGuru`) REFERENCES `guru` (`idGuru`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_idSiswa_fkey` FOREIGN KEY (`idSiswa`) REFERENCES `siswa` (`idSiswa`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@gmail.com','$2b$10$./mncgFsPSV3rLOHkgJlceOM0PbOyX8uBrcusaNROTEXZj6bVQvru',NULL,1),(2,'davidwijayanto2@gmail.com','$2b$10$kqfcyMMc0oon18T9fdpQYuag/vGcrHGIZQCoJz9s6DUkstVasIu82',1,NULL),(5,'davidwijayanto3@gmail.com','$2b$10$0l5W.s3oUcA/2fMIOP0Dn.87Ho9st82Zad4YTQY9dq93b3t6KaGF6',NULL,5),(6,'davidwijayanto7@gmail.com','$2b$10$.Y./ZA8Xsi82/FaPyA6XeuHeFBwvOjVBtYDqZjKwDcTHFEMielL3u',NULL,6),(7,'davidwijayanto5@gmail.com','$2b$10$pqAgp7JrlufgMAxptXJ3LOOYCkb4yArR307Rh1C3Ar3B099Hcw6gq',2,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-22 17:31:47
