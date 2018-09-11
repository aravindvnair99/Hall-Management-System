-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 11, 2018 at 01:10 PM
-- Server version: 5.7.19
-- PHP Version: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ahms`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(1) NOT NULL,
  `date_req` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_wanted` date NOT NULL,
  `slot` int(1) NOT NULL,
  `hall` int(1) NOT NULL,
  `title` varchar(30) NOT NULL,
  `club` varchar(25) NOT NULL,
  `req` varchar(50) NOT NULL,
  `details` varchar(100) NOT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `user_id`, `date_req`, `date_wanted`, `slot`, `hall`, `title`, `club`, `req`, `details`, `status`) VALUES
(1, 1, '2025-03-17 18:30:00', '2025-03-18', 1, 1, 'Dance of Abhi', 'Abhi Club', 'Abhi', 'Abhi, dance skills', 0),
(9, 1, '2018-03-25 01:21:05', '2018-03-27', 1, 1, 'Abhi', 'Adi', 'Adi, Di', 'Muddy', 1),
(10, 2, '2018-03-25 01:25:38', '2018-03-28', 1, 1, 'Abhi', 'Adi', 'Ara', 'Abhi', 2),
(11, 1, '2018-03-25 02:03:26', '2018-03-30', 1, 1, 'tufufu', 'kbhh', 'guuigu', 'fyjvvy', 2),
(12, 1, '2018-03-25 02:04:24', '2018-03-12', 1, 1, 'to', 'Abhi', 'seee', 'wants', 0),
(13, 2, '2018-03-25 02:05:22', '2018-03-27', 1, 1, 'Raj', 'Raj', 'Raj', 'Raj', 1),
(17, 1, '2018-03-25 07:12:58', '2018-03-18', 1, 1, 'Ara', 'Ara', 'Ara', 'Ara', 0),
(18, 1, '2018-03-25 07:16:39', '2018-03-25', 1, 1, 'bvb', 'hsfs`bb', 'ui', 'bbbuibui', 0),
(19, 1, '2018-03-25 07:18:04', '2018-03-07', 1, 1, 'fdd', 'dvd', 'fdv', 'gbf', 0),
(20, 1, '2018-03-25 07:19:19', '2018-03-07', 1, 1, 'fgnfnfd', 'ghhgff', 'gdg', 'ghffhf', 0),
(21, 1, '2018-03-25 07:20:12', '2018-03-07', 1, 1, 'jknkjn', 'ghhgffbashdbshj', 'knkl', 'bhbhjbh', 0),
(22, 2, '2018-03-25 07:24:36', '2018-03-20', 1, 1, 'dgd', 'wdcd', 'dgd', 'hdhd', 0),
(23, 2, '2018-03-25 07:25:05', '2018-03-20', 1, 1, 'fhnfh', 'wsxw', 'hfh', 'fhfh', 0);

-- --------------------------------------------------------

--
-- Table structure for table `halls`
--

DROP TABLE IF EXISTS `halls`;
CREATE TABLE IF NOT EXISTS `halls` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `capacity` int(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `halls`
--

INSERT INTO `halls` (`id`, `name`, `capacity`) VALUES
(1, 'Amriteshwari Hall', 260),
(2, 'Sudhamani Hall', 120),
(3, 'Rama Hall', 75),
(4, 'Vyasa Hall', 75),
(5, 'Krishna Hall', 75),
(6, 'E-learning Hall', 75),
(7, 'Valmiki Hall', 75);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

DROP TABLE IF EXISTS `slots`;
CREATE TABLE IF NOT EXISTS `slots` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `timings` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` (`id`, `timings`) VALUES
(1, '8:10 - 9:10'),
(2, '9:10 - 10:10'),
(3, '10:35 - 11:35'),
(4, '11:35 - 12:35'),
(5, '1:30 - 2:30'),
(6, '2:30 - 3:30'),
(7, '3:30 - 4:30'),
(8, '4:30 - 5:30'),
(9, '5:30 - 6:30');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `id` int(1) NOT NULL,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `status`) VALUES
(0, 'Pending'),
(1, 'Approved'),
(2, 'Rejected');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `role`) VALUES
(1, 'Rakesh', 'rak', 'rak', 1),
(2, 'Rajesh', 'raj', 'raj', 2),
(3, 'Hruthik', 'hru', 'hru', 3);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
