-- MySQL dump 10.13  Distrib 26.7.0, for macos15 (arm64)
--
-- Host: localhost    Database: digital_grades
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_classes`
--

DROP TABLE IF EXISTS `academic_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_classes` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `professor_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjfvx8t88dmouwpt4onrmwbohv` (`professor_id`),
  CONSTRAINT `FKjfvx8t88dmouwpt4onrmwbohv` FOREIGN KEY (`professor_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_classes`
--

/*!40000 ALTER TABLE `academic_classes` DISABLE KEYS */;
INSERT INTO `academic_classes` VALUES ('51ce6b7b-f574-44c1-ba3f-a91aeb560471','2025–2026','Bankai Class','Active','1e9ced14-1c4f-4edf-bba3-f08e4ad3dea5'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','2025–2026','Math','Active','acff3ea4-ba81-4fe5-84fd-693594ef75c0'),('c8902728-1722-42c5-866f-36afcb6dbbc7','L2','English','Active','c5e1bb73-cbb1-4dbb-a7e7-900c66f89c45'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','L3','Arab','Active','ae2c15b1-2873-429b-a4af-3d552421ed08');
/*!40000 ALTER TABLE `academic_classes` ENABLE KEYS */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `detail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES ('0c2dd245-9ffb-4b05-85eb-0c462a0dd366','2026-08-31 10:50:24.865000','math was created and assigned to hamoud ahmed','Class created','blue'),('26beb5f6-81b6-492d-a642-8fdd7853983b','2026-08-31 11:53:37.096300','math test · Math','Grade form approved','green'),('275ec454-b68d-4f7f-9c3a-0599d6806425','2026-08-31 10:50:32.447000','math was updated.','Class updated','blue'),('2fd7b099-62ba-4f36-b199-cc3a21f0ae98','2026-08-29 21:33:17.305000','Form 1 · algo','Grade form approved','green'),('33757e71-b78a-429e-9b20-e7aef0c2c3ba','2026-08-29 21:32:52.359000','Form 1 · algo submitted by mokhtar ba','Grade form awaiting approval','purple'),('34624d5d-3a51-43cb-80b4-58fede19aa5c','2026-08-29 15:10:12.205000','peter parker was added to the portal','Professor account created','green'),('36fc9116-1c10-4671-911b-b67adc28b9bb','2026-08-29 16:20:14.621000','Algorithmique (L2) assigned to mokhtar ba','Class assigned','blue'),('3e0c2b3c-ba94-4e72-99a7-7c5ba1eaf2c7','2026-08-31 10:43:14.398000','aisha ahmed was added to the portal','Student account created','blue'),('47b214b8-eacd-4ff5-9986-6872aa0140c1','2026-08-29 15:45:39.169000','abderahman (Student) was removed from the portal.','User account deleted','blue'),('498c8477-96c2-48aa-9a78-b0089f68b0e9','2026-08-31 13:56:34.067374','English exam · English','Grade form approved','green'),('4cdfd748-ffff-4faf-9dc3-73377023d867','2026-08-29 16:19:38.192000','mokhtar ba was added to the portal','Professor account created','green'),('536127c6-d87f-44a2-82ba-31b11ec0e34a','2026-08-29 15:38:09.871000','Prof. Ahmed Mohamed (Professor) was removed from the portal. 1 class is now unassigned.','User account deleted','blue'),('5f342149-941c-443c-af97-ee97af6cf1db','2026-08-29 18:06:59.544000','Algorithmique (L2) was removed from the portal.','Class deleted','blue'),('71d841f7-1f9b-4235-ad93-7ab94771ea1a','2026-08-29 15:30:53.445000','Fatou Ndiaye (Student) was removed from the portal','User account deleted','blue'),('7b607c8b-8512-4e0d-88d9-ecbaad8ded35','2026-09-03 23:50:37.717457','Arab exam · Arab','Grade form approved','green'),('a2793828-b813-4a35-b953-eedb1e35a246','2026-08-29 18:07:31.893000','algo was created and assigned to mokhtar ba','Class created','blue'),('b853a90c-6216-4c5c-bcc2-0daaea6e50d2','2026-08-31 11:52:47.293236','math test · Math submitted by hero','Grade form awaiting approval','purple'),('c126a048-a185-4e2a-babc-0d8d8ea8a728','2026-08-29 15:46:10.376000','peter parker (Professor) was removed from the portal.','User account deleted','blue'),('d14fc954-620a-4bb6-bca1-dd682b78fe5e','2026-08-29 16:33:27.803000','Midterm Exam · Algorithmique (L2)','Grade form approved','green'),('d4595b77-1dd4-4fb9-a57f-dd2e86e0c402','2026-08-31 10:44:05.952000','peter parker was added to the portal','Student account created','blue'),('e2f35980-6f3c-4456-b553-9a242ce33787','2026-08-29 16:32:52.809000','abderahman ba was added to the portal','Student account created','blue'),('e577bfa3-4b34-4fca-b6ba-f2209dfdcd3f','2026-08-31 10:44:35.148000','hamoud ahmed was added to the portal','Professor account created','green'),('e926ebbc-d1c6-47d1-a189-386e1f61ef08','2026-08-29 21:31:38.275000','algo was updated.','Class updated','blue'),('eeff7b97-2e4d-4dbb-b2ba-fa2a0db65925','2026-08-31 11:18:57.000000','adam ahmad was added to the portal','Student account created','blue'),('ef4f8904-ab57-48eb-ab88-8a22dc1f5f95','2026-09-03 23:50:15.844216','Arab exam · Arab submitted by ahmedou brahim','Grade form awaiting approval','purple'),('fc45b5e0-8768-47f5-aa93-6477a7ff42c9','2026-08-31 13:56:18.790610','English exam · English submitted by aizen','Grade form awaiting approval','purple');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;

--
-- Table structure for table `app_users`
--

DROP TABLE IF EXISTS `app_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_users` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('Administrator','Professor','Student') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4vj92ux8a2eehds1mdvmks473` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_users`
--

/*!40000 ALTER TABLE `app_users` DISABLE KEYS */;
INSERT INTO `app_users` VALUES ('09ebac07-2688-4fb5-995c-6a22d6dbc323','alvaro@student.edu','alvaro','684f37898d4dcf0cd234391037ce033f:a078cc98de32541adb180c4de40a7ddb8b0bd1bf22a6814b3f52ed8c1473d8ce699dc99e070ed2af5b02e9d79f2315d060a0ece676b8decca84d934908d5ef57','Student','Active'),('149f82b3-b37d-4a93-8d9b-dc6446ea7f0b','steve@student.edu','steve','3001d5dc798d89206f0501058edca2cd:81ed140fe57b97743d14d8d2bdb0a96c2e7d1a775017fb91402da77c2ef0c48074769a0c96a7865d497d526fec61d83ad0fa7b79cb87ca344522a9f9fd90af5c','Student','Active'),('1e9ced14-1c4f-4edf-bba3-f08e4ad3dea5','zeus@university.edu','zeus','6fa346b4c06ead736aa7192a04575bd0:60436aff7e96752a8a90a9000833a6e7f669dafb54b7aa82c134ac7c95e3e469ccea5e6c57749e6d459dc8800ca7c588870f04aea4c07e994b6eb964d78627ee','Professor','Active'),('3d3eca75-d381-4b5b-a554-276500a54e04','neymar@student.edu','neymar','8d8d201c757e46e2fea7a61e4d55aa06:c814a1c8d6b1415067560e11aa7904f356c3354ccadf704a97ab15cdc7768ef205b6a29e9b9c5bc4313490b27b1c44fcbc71a04fd21e908cbdefe71a91a45f2f','Student','Active'),('48336d8d-0df0-4c93-ae41-40ff94e75d8e','messi@student.edu','messi','25b8b188d31c3b5e90ea19fa6e01e20b:dfb2c2ed32f31402176b12171e8024902663069626e0ca750ff3cafa6fdf216e5bee4973264f438584325d07b7c56e2a8a1da3ca1247740640d150678fe787bd','Student','Active'),('7c6ddbb6-9dec-432b-80d8-86dccd941537','peter@student.edu','peter','53e9e5c9e3cfe9bc108d433c799ff4b2:370eeb57c531b3cc4376649cbf234f0d49cb9c948788951e7995cb172133a03dbd2ca3c596e2dca53f767a937537aa3a52c3bb33b914b0dd180e3c61dc1ffa63','Student','Active'),('7d20fd04-4e4b-4e13-b3a1-b8a13d0d154a','cody@student.edu','cody','843f2f943110312f0d325fbcd957b1ac:6e066877aa6399a36a6b7a630bf49a294a06e7d3498cb9411e0b21c0b34f845f76f4f0a26f818a7124a156cfed6fa1adfc84ca8af1d1aaacf6f4bdfeb293c762','Student','Active'),('83484374-ecac-438d-a4ff-47d7699c2409','ronaldo@student.edu','ronaldo','58c8c4b2bd06fb06a6e37186f644a056:2ca96223c24843d4d1aceadde23d745282ec46ab1e09824fe2addf226eb4a6d53ccd3999be1c8abeb1e41d0799d544b611053c5aac954745c00a5a7e90b6f111','Student','Active'),('8928e792-6a12-4344-9984-4ac55ed1a89f','adam@student.edu','adam','75164f2ce739fd6e51bb1e668a04f278:9f79b7037118bc8c5bcd54bf5fc2703d3c424575a6fbb4b4b90bdc556a123c5bf337081b001b891446d816e45ffa72ab77ecb3692a9adacf4c0507b10f23aa47','Student','Active'),('97b3dfab-3534-4294-8516-6d2f9046b388','scorpian@student.edu','scorpian','1f75c9cc5bb64a92b2f12fbae2fc034e:b396b2b36aabaf6e06ae85b8e6c06900c51a4bf389e424a470df0ddcffbde29e8604400a2e562f4241b0fb12de7e966596558595e46449512f23c9b45238a63a','Student','Active'),('981967f9-f6bf-4229-bffa-3fca6c2eda03','kratos@student.edu','kratos','4340baaa753c42d9fa0832efba96e151:4387aef9aa092a7b262aacc9d70971b0c4602f77106cf982bf475a013f5e90323f4193db4e8ec5bee688643ff58a5197d1bb551e82b4e6acd60fce52771be712','Student','Active'),('acff3ea4-ba81-4fe5-84fd-693594ef75c0','hero@university.edu','hero','036e513ab138ace398a4524d830e86e5:0435e1e2f0377d4c1fa3c8602fafbc54cbca8c3005043f2fd541c82e2cce7c18efe8a085c75519183f1a0ed63f585d1e7e56ed49a67fec97e77e98a85237dfad','Professor','Active'),('admin-1','admin@digitalgrades.com','Admin User','ecd6c81d4366f6cbbe14f6f544e31a79:92bd62c175d05a3bb89f8cbb546e7033fcbd9801061088eff636651bfb6ccbc1dffaac47410cd8f5f09cfec91628dbc4dcaac3f4a3a76283de956f5c999ae4f4','Administrator','Active'),('ae2c15b1-2873-429b-a4af-3d552421ed08','mous@uni.com','ahmedou brahim','5263febf41d10ecc72eeadd65abbe116:ebd9dc20389090bd3f4ef083dd074ea6077e61454297501c29a53148203aca7e9ce065e23f2f1d97cd32cee4acba3e655a95fe45e52d485034fffd82c2a563fd','Professor','Active'),('c5e1bb73-cbb1-4dbb-a7e7-900c66f89c45','aizen@university.edu','aizen','f71a3d09bae5efc75f52d900982d3c8b:1149af712efbbbc669d766b7dda68d17ee6f2e25c97d423c5484dbd7319355055cdeb85b5f214c91e2d31a4b17610a269aa0a482b48a9f067d01499b71dc13b3','Professor','Active');
/*!40000 ALTER TABLE `app_users` ENABLE KEYS */;

--
-- Table structure for table `class_students`
--

DROP TABLE IF EXISTS `class_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_students` (
  `class_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`class_id`,`student_id`),
  KEY `FK34hp80aq5xx99rt5glr9drk0k` (`student_id`),
  CONSTRAINT `FK34hp80aq5xx99rt5glr9drk0k` FOREIGN KEY (`student_id`) REFERENCES `app_users` (`id`),
  CONSTRAINT `FK3qw2bih0rk3hc1bo3sgag7euf` FOREIGN KEY (`class_id`) REFERENCES `academic_classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_students`
--

/*!40000 ALTER TABLE `class_students` DISABLE KEYS */;
INSERT INTO `class_students` VALUES ('51ce6b7b-f574-44c1-ba3f-a91aeb560471','09ebac07-2688-4fb5-995c-6a22d6dbc323'),('c8902728-1722-42c5-866f-36afcb6dbbc7','09ebac07-2688-4fb5-995c-6a22d6dbc323'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','09ebac07-2688-4fb5-995c-6a22d6dbc323'),('51ce6b7b-f574-44c1-ba3f-a91aeb560471','149f82b3-b37d-4a93-8d9b-dc6446ea7f0b'),('c8902728-1722-42c5-866f-36afcb6dbbc7','149f82b3-b37d-4a93-8d9b-dc6446ea7f0b'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','3d3eca75-d381-4b5b-a554-276500a54e04'),('c8902728-1722-42c5-866f-36afcb6dbbc7','3d3eca75-d381-4b5b-a554-276500a54e04'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','3d3eca75-d381-4b5b-a554-276500a54e04'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','48336d8d-0df0-4c93-ae41-40ff94e75d8e'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','48336d8d-0df0-4c93-ae41-40ff94e75d8e'),('51ce6b7b-f574-44c1-ba3f-a91aeb560471','7c6ddbb6-9dec-432b-80d8-86dccd941537'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','7c6ddbb6-9dec-432b-80d8-86dccd941537'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','7d20fd04-4e4b-4e13-b3a1-b8a13d0d154a'),('51ce6b7b-f574-44c1-ba3f-a91aeb560471','83484374-ecac-438d-a4ff-47d7699c2409'),('d5189dad-89be-44b3-8d71-5e3e707f9d06','83484374-ecac-438d-a4ff-47d7699c2409'),('51ce6b7b-f574-44c1-ba3f-a91aeb560471','8928e792-6a12-4344-9984-4ac55ed1a89f'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','97b3dfab-3534-4294-8516-6d2f9046b388'),('b44422bb-3f7b-43d9-8507-7456fc1a186a','981967f9-f6bf-4229-bffa-3fca6c2eda03');
/*!40000 ALTER TABLE `class_students` ENABLE KEYS */;

--
-- Table structure for table `grade_entries`
--

DROP TABLE IF EXISTS `grade_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_entries` (
  `grade_form_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `score` double DEFAULT NULL,
  `student_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  KEY `FKrc58x00aqiy4vbj188osfmbgv` (`grade_form_id`),
  CONSTRAINT `FKrc58x00aqiy4vbj188osfmbgv` FOREIGN KEY (`grade_form_id`) REFERENCES `grade_forms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_entries`
--

/*!40000 ALTER TABLE `grade_entries` DISABLE KEYS */;
INSERT INTO `grade_entries` VALUES ('01628414-ead9-4494-9b8d-bef8372b0dc2',10,'3d3eca75-d381-4b5b-a554-276500a54e04'),('01628414-ead9-4494-9b8d-bef8372b0dc2',10,'48336d8d-0df0-4c93-ae41-40ff94e75d8e'),('01628414-ead9-4494-9b8d-bef8372b0dc2',10,'97b3dfab-3534-4294-8516-6d2f9046b388'),('01628414-ead9-4494-9b8d-bef8372b0dc2',11,'7d20fd04-4e4b-4e13-b3a1-b8a13d0d154a'),('01628414-ead9-4494-9b8d-bef8372b0dc2',12,'981967f9-f6bf-4229-bffa-3fca6c2eda03'),('af9fa5cb-0d9e-4cb2-ae2d-5d31a93b4d7b',5,'3d3eca75-d381-4b5b-a554-276500a54e04'),('af9fa5cb-0d9e-4cb2-ae2d-5d31a93b4d7b',14,'09ebac07-2688-4fb5-995c-6a22d6dbc323'),('af9fa5cb-0d9e-4cb2-ae2d-5d31a93b4d7b',12,'149f82b3-b37d-4a93-8d9b-dc6446ea7f0b'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b',13,'3d3eca75-d381-4b5b-a554-276500a54e04'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b',19,'48336d8d-0df0-4c93-ae41-40ff94e75d8e'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b',18,'7c6ddbb6-9dec-432b-80d8-86dccd941537'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b',20,'83484374-ecac-438d-a4ff-47d7699c2409'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b',19,'09ebac07-2688-4fb5-995c-6a22d6dbc323');
/*!40000 ALTER TABLE `grade_entries` ENABLE KEYS */;

--
-- Table structure for table `grade_forms`
--

DROP TABLE IF EXISTS `grade_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_forms` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `approved_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted` date DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `professor_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKejip293i8ug99fv5mdrjk7igx` (`class_id`),
  KEY `FKl37fjyt9qhr732fe972y0xcvj` (`professor_id`),
  CONSTRAINT `FKejip293i8ug99fv5mdrjk7igx` FOREIGN KEY (`class_id`) REFERENCES `academic_classes` (`id`),
  CONSTRAINT `FKl37fjyt9qhr732fe972y0xcvj` FOREIGN KEY (`professor_id`) REFERENCES `app_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_forms`
--

/*!40000 ALTER TABLE `grade_forms` DISABLE KEYS */;
INSERT INTO `grade_forms` VALUES ('01628414-ead9-4494-9b8d-bef8372b0dc2','2026-08-31 11:53:37.095201','Admin User','Approved','2026-08-31','math test','b44422bb-3f7b-43d9-8507-7456fc1a186a','acff3ea4-ba81-4fe5-84fd-693594ef75c0'),('af9fa5cb-0d9e-4cb2-ae2d-5d31a93b4d7b','2026-08-31 13:56:34.063958','Admin User','Approved','2026-08-31','English exam','c8902728-1722-42c5-866f-36afcb6dbbc7','c5e1bb73-cbb1-4dbb-a7e7-900c66f89c45'),('c95947b5-c5de-4e8b-9ad6-03d0ec52ec4b','2026-09-03 23:50:37.715709','Admin User','Approved','2026-09-03','Arab exam','d5189dad-89be-44b3-8d71-5e3e707f9d06','ae2c15b1-2873-429b-a4af-3d552421ed08');
/*!40000 ALTER TABLE `grade_forms` ENABLE KEYS */;

--
-- Dumping events for database 'digital_grades'
--

--
-- Dumping routines for database 'digital_grades'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-04  0:07:13
