-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema archiview
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema archiview
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `archiview` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `archiview` ;

-- -----------------------------------------------------
-- Table `archiview`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`user` ;

CREATE TABLE IF NOT EXISTS `archiview`.`user` (
  `is_auth` BIT(1) NULL DEFAULT b'0',
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `id` VARCHAR(16) NOT NULL,
  `name` VARCHAR(32) NOT NULL,
  `pw` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `introduce` TEXT NULL DEFAULT NULL,
  `profile_url` VARCHAR(255) NULL DEFAULT NULL,
  `role` ENUM('ROLE_USER', 'ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_BLOCK') NULL DEFAULT 'ROLE_USER',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UK_ob8kqyqqgmefl0aco34akdtpe` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`company`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`company` ;

CREATE TABLE IF NOT EXISTS `archiview`.`company` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 127
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`question`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`question` ;

CREATE TABLE IF NOT EXISTS `archiview`.`question` (
  `company_id` INT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK29lvjbtuqadquc7vu3ydt5tq1` (`company_id` ASC) VISIBLE,
  CONSTRAINT `FK29lvjbtuqadquc7vu3ydt5tq1`
    FOREIGN KEY (`company_id`)
    REFERENCES `archiview`.`company` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`reply`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`reply` ;

CREATE TABLE IF NOT EXISTS `archiview`.`reply` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_id` INT NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `user_id` VARCHAR(16) NULL DEFAULT NULL,
  `script` TEXT NULL DEFAULT NULL,
  `thumbnail_url` VARCHAR(255) NULL DEFAULT NULL,
  `video_url` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKlf3483md4ptkyewrkrjehfg56` (`question_id` ASC) VISIBLE,
  INDEX `FKapyyxlgntertu5okpkr685ir9` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKapyyxlgntertu5okpkr685ir9`
    FOREIGN KEY (`user_id`)
    REFERENCES `archiview`.`user` (`id`),
  CONSTRAINT `FKlf3483md4ptkyewrkrjehfg56`
    FOREIGN KEY (`question_id`)
    REFERENCES `archiview`.`question` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 58
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`comment` ;

CREATE TABLE IF NOT EXISTS `archiview`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reply_id` INT NULL DEFAULT NULL,
  `user_id` VARCHAR(16) NULL DEFAULT NULL,
  `content` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK5bnoa3klw5yvjd73egj9vljoj` (`reply_id` ASC) VISIBLE,
  INDEX `FK8kcum44fvpupyw6f5baccx25c` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK5bnoa3klw5yvjd73egj9vljoj`
    FOREIGN KEY (`reply_id`)
    REFERENCES `archiview`.`reply` (`id`),
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c`
    FOREIGN KEY (`user_id`)
    REFERENCES `archiview`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`cs_main`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`cs_main` ;

CREATE TABLE IF NOT EXISTS `archiview`.`cs_main` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`cs_sub`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`cs_sub` ;

CREATE TABLE IF NOT EXISTS `archiview`.`cs_sub` (
  `cs_main_id` INT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKiiplu6g6oihnxh767y4yenxut` (`cs_main_id` ASC) VISIBLE,
  CONSTRAINT `FKiiplu6g6oihnxh767y4yenxut`
    FOREIGN KEY (`cs_main_id`)
    REFERENCES `archiview`.`cs_main` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`cs_sub_question`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`cs_sub_question` ;

CREATE TABLE IF NOT EXISTS `archiview`.`cs_sub_question` (
  `cs_sub_id` INT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK2rf11a85872d6u7ki2f5ahthc` (`cs_sub_id` ASC) VISIBLE,
  INDEX `FKockx2vqdmjnldo6910i4deoxe` (`question_id` ASC) VISIBLE,
  CONSTRAINT `FK2rf11a85872d6u7ki2f5ahthc`
    FOREIGN KEY (`cs_sub_id`)
    REFERENCES `archiview`.`cs_sub` (`id`),
  CONSTRAINT `FKockx2vqdmjnldo6910i4deoxe`
    FOREIGN KEY (`question_id`)
    REFERENCES `archiview`.`question` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 77
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`job_main`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`job_main` ;

CREATE TABLE IF NOT EXISTS `archiview`.`job_main` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`job_sub`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`job_sub` ;

CREATE TABLE IF NOT EXISTS `archiview`.`job_sub` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_main_id` INT NULL DEFAULT NULL,
  `name` VARCHAR(64) NULL DEFAULT NULL,
  `job_subcol` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK244t1o98gc5v8ngjkcal9rhs7` (`job_main_id` ASC) VISIBLE,
  CONSTRAINT `FK244t1o98gc5v8ngjkcal9rhs7`
    FOREIGN KEY (`job_main_id`)
    REFERENCES `archiview`.`job_main` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 246
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`job_sub_question`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`job_sub_question` ;

CREATE TABLE IF NOT EXISTS `archiview`.`job_sub_question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `job_sub_id` INT NULL DEFAULT NULL,
  `question_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKd9wm66lroacyaxvk1hm0a1deh` (`job_sub_id` ASC) VISIBLE,
  INDEX `FK5ernmqeqdkfuhvw9e19t7oxeh` (`question_id` ASC) VISIBLE,
  CONSTRAINT `FK5ernmqeqdkfuhvw9e19t7oxeh`
    FOREIGN KEY (`question_id`)
    REFERENCES `archiview`.`question` (`id`),
  CONSTRAINT `FKd9wm66lroacyaxvk1hm0a1deh`
    FOREIGN KEY (`job_sub_id`)
    REFERENCES `archiview`.`job_sub` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`like`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`like` ;

CREATE TABLE IF NOT EXISTS `archiview`.`like` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reply_id` INT NULL DEFAULT NULL,
  `user_id` VARCHAR(16) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKkxw5tolf0bqp40xljxjus1gh2` (`reply_id` ASC) VISIBLE,
  INDEX `FKbkuifxltr3tlpihfqxsnok0bh` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKbkuifxltr3tlpihfqxsnok0bh`
    FOREIGN KEY (`user_id`)
    REFERENCES `archiview`.`user` (`id`),
  CONSTRAINT `FKkxw5tolf0bqp40xljxjus1gh2`
    FOREIGN KEY (`reply_id`)
    REFERENCES `archiview`.`reply` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `archiview`.`recruit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `archiview`.`recruit` ;

CREATE TABLE IF NOT EXISTS `archiview`.`recruit` (
  `company_id` INT NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `end` DATETIME(6) NOT NULL,
  `start` DATETIME(6) NOT NULL,
  `content` TEXT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKt17sunc4yqe9my1hfd236x3t8` (`company_id` ASC) VISIBLE,
  CONSTRAINT `FKt17sunc4yqe9my1hfd236x3t8`
    FOREIGN KEY (`company_id`)
    REFERENCES `archiview`.`company` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 157
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
