-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 24, 2011 at 10:25 AM
-- Server version: 5.0.81
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bluebolts`
--

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_chron_jobs`
--

CREATE TABLE IF NOT EXISTS `bbcore_chron_jobs` (
  `chronJobID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(64) NOT NULL,
  `path` varchar(128) NOT NULL,
  `params` text NOT NULL,
  `time` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `state` varchar(8) NOT NULL,
  PRIMARY KEY  (`chronJobID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `bbcore_chron_jobs`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_component_blocks`
--

CREATE TABLE IF NOT EXISTS `bbcore_component_blocks` (
  `componentBlockID` int(10) unsigned NOT NULL auto_increment,
  `className` varchar(128) NOT NULL,
  `parameters` text NOT NULL,
  PRIMARY KEY  (`componentBlockID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `bbcore_component_blocks`
--

INSERT INTO `bbcore_component_blocks` (`componentBlockID`, `className`, `parameters`) VALUES
(1, 'Plugins.Posty.PostyBlog', '{"threadID":1,"roleIDs":[1,4,5]}'),
(2, 'Plugins.LoginComp.LoginComp', ''),
(3, 'Plugins.Registrar.Registrar', '');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_content_blocks`
--

CREATE TABLE IF NOT EXISTS `bbcore_content_blocks` (
  `contentBlockInstanceID` int(10) unsigned NOT NULL auto_increment,
  `userID` int(10) unsigned NOT NULL,
  `association` varchar(32) default NULL,
  `className` varchar(128) default NULL,
  `parameters` text,
  PRIMARY KEY  (`contentBlockInstanceID`),
  KEY `userID` (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `bbcore_content_blocks`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_files`
--

CREATE TABLE IF NOT EXISTS `bbcore_files` (
  `fileID` int(10) unsigned NOT NULL auto_increment,
  `userID` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `dated` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`fileID`),
  KEY `userID` (`userID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=68 ;

--
-- Dumping data for table `bbcore_files`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_groups`
--

CREATE TABLE IF NOT EXISTS `bbcore_groups` (
  `groupID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(64) default NULL,
  `groupTypeID` int(10) unsigned default NULL,
  `config` text NOT NULL,
  PRIMARY KEY  (`groupID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `bbcore_groups`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_group_members`
--

CREATE TABLE IF NOT EXISTS `bbcore_group_members` (
  `groupID` int(10) unsigned default NULL,
  `userID` int(10) unsigned default NULL,
  KEY `groupID` (`groupID`),
  KEY `memberID` (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bbcore_group_members`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_group_owners`
--

CREATE TABLE IF NOT EXISTS `bbcore_group_owners` (
  `groupOwnerID` int(11) NOT NULL auto_increment,
  `ownerID` int(11) default NULL,
  `groupID` int(11) default NULL,
  PRIMARY KEY  (`groupOwnerID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `bbcore_group_owners`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_group_types`
--

CREATE TABLE IF NOT EXISTS `bbcore_group_types` (
  `groupTypeID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(32) default NULL,
  `config` text NOT NULL,
  PRIMARY KEY  (`groupTypeID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `bbcore_group_types`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_pages`
--

CREATE TABLE IF NOT EXISTS `bbcore_pages` (
  `pageID` int(10) unsigned NOT NULL auto_increment,
  `templateID` int(10) unsigned NOT NULL,
  `title` text NOT NULL,
  `metaData` text,
  `scripts` text,
  `styles` text,
  `pageInfo` text,
  PRIMARY KEY  (`pageID`),
  KEY `templateID` (`templateID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `bbcore_pages`
--

INSERT INTO `bbcore_pages` (`pageID`, `templateID`, `title`, `metaData`, `scripts`, `styles`, `pageInfo`) VALUES
(9, 3, 'Example Page', '[{"name":"description","content":"The client''s main page."}]', NULL, NULL, '{"contentblocks":[], "components":[4]}');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_page_lookup`
--

CREATE TABLE IF NOT EXISTS `bbcore_page_lookup` (
  `roleID` int(10) unsigned default '1',
  `pageID` int(10) unsigned NOT NULL,
  `association` char(32) NOT NULL default 'home',
  KEY `roleID` (`roleID`),
  KEY `association` (`association`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bbcore_page_lookup`
--

INSERT INTO `bbcore_page_lookup` (`roleID`, `pageID`, `association`) VALUES
(1, 9, 'list'),
(2, 9, 'list');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_php_scripts`
--

CREATE TABLE IF NOT EXISTS `bbcore_php_scripts` (
  `phpScriptID` int(10) unsigned NOT NULL auto_increment,
  `code` text NOT NULL,
  PRIMARY KEY  (`phpScriptID`),
  KEY `phpScriptID` (`phpScriptID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `bbcore_php_scripts`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_plugins`
--

CREATE TABLE IF NOT EXISTS `bbcore_plugins` (
  `pluginID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(128) NOT NULL,
  `path` varchar(128) NOT NULL,
  `className` varchar(128) NOT NULL,
  `version` int(10) unsigned NOT NULL,
  `description` text NOT NULL,
  `tags` text NOT NULL,
  `info` text NOT NULL,
  PRIMARY KEY  (`pluginID`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `bbcore_plugins`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_posty_containers`
--

CREATE TABLE IF NOT EXISTS `bbcore_posty_containers` (
  `postyContainerID` int(10) unsigned NOT NULL auto_increment,
  `parentID` int(10) unsigned default NULL,
  `name` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `tags` text NOT NULL,
  PRIMARY KEY  (`postyContainerID`),
  KEY `parent` (`parentID`),
  FULLTEXT KEY `tags` (`tags`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `bbcore_posty_containers`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_posty_posts`
--

CREATE TABLE IF NOT EXISTS `bbcore_posty_posts` (
  `postyPostID` int(10) unsigned NOT NULL auto_increment,
  `parentID` int(10) unsigned NOT NULL default '1',
  `userName` varchar(32) NOT NULL,
  `dated` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `content` text NOT NULL,
  PRIMARY KEY  (`postyPostID`),
  KEY `parent` (`parentID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Dumping data for table `bbcore_posty_posts`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_ratings`
--

CREATE TABLE IF NOT EXISTS `bbcore_ratings` (
  `ratingID` int(10) unsigned NOT NULL auto_increment,
  `ratedID` int(10) unsigned NOT NULL,
  `userID` int(10) unsigned NOT NULL,
  `ratingTypeID` int(10) unsigned NOT NULL,
  `rating` int(11) NOT NULL,
  PRIMARY KEY  (`ratingID`),
  KEY `ratedID` (`ratedID`,`userID`,`ratingTypeID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `bbcore_ratings`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_rating_types`
--

CREATE TABLE IF NOT EXISTS `bbcore_rating_types` (
  `ratingTypeID` int(10) unsigned NOT NULL auto_increment,
  `ratedTableName` varchar(64) NOT NULL,
  `ratedIDName` varchar(64) NOT NULL,
  PRIMARY KEY  (`ratingTypeID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `bbcore_rating_types`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_templates`
--

CREATE TABLE IF NOT EXISTS `bbcore_templates` (
  `templateID` int(10) unsigned NOT NULL auto_increment,
  `template` text NOT NULL,
  PRIMARY KEY  (`templateID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `bbcore_templates`
--

INSERT INTO `bbcore_templates` (`templateID`, `template`) VALUES
(3, '<div style=''min-width:640px;width:80%;min-height:36px;position:relative;display:inline-block'' component=''0''></div>\r\n<div style=''text-align:center''>\r\n<table style=''min-width:640px;width:80%;min-height:90%;position:relative;display:inline-block''>\r\n<tr>\r\n<td style=''width:40%''>\r\n<div component=''1''></div>\r\n<div contentblock=''0''></div>\r\n<div contentblock=''2''></div>\r\n</td>\r\n<td style=''min-width:320px''>\r\n<div component=''2''></div>\r\n<div contentblock=''1''></div>\r\n<div contentblock=''3''></div>\r\n<div contentblock=''4''></div>\r\n<div contentblock=''5''></div>\r\n</td>\r\n</tr>\r\n</table>\r\n</div>\r\n<div style=''min-width:640px;width:80%;min-height:12px;position:relative;display:inline-block'' component=''3''></div>');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_themes`
--

CREATE TABLE IF NOT EXISTS `bbcore_themes` (
  `themeID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(32) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY  (`themeID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `bbcore_themes`
--

INSERT INTO `bbcore_themes` (`themeID`, `name`, `content`) VALUES
(1, 'sunshine', '{"jQueryUITheme":"/bluebolts/themes/sunshine/jquery-ui-1.8.1.custom.css", "bb-theme":"/bluebolts/themes/sunshine/bb-theme.css"}');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_users`
--

CREATE TABLE IF NOT EXISTS `bbcore_users` (
  `userID` int(10) unsigned NOT NULL auto_increment,
  `roleID` int(10) unsigned NOT NULL default '1',
  `userName` char(32) NOT NULL,
  `password` char(40) NOT NULL,
  `email` varchar(128) NOT NULL default '',
  `validated` timestamp NULL default NULL,
  PRIMARY KEY  (`userID`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `bbcore_users`
--

INSERT INTO `bbcore_users` (`userID`, `roleID`, `userName`, `password`, `email`, `validated`) VALUES
(1, 1, 'Guest', '74da822bddedd941736e939dae5001dae9e7c03c', 'e@mail.net', '2010-05-21 02:44:14'),
(2, 2, 'super', '25e40e2304845bf77e8d5904ee15bb89309106b7', 'e@mail.net', '2010-05-23 18:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_user_actions`
--

CREATE TABLE IF NOT EXISTS `bbcore_user_actions` (
  `userActionID` int(10) unsigned NOT NULL auto_increment,
  `userID` int(10) unsigned NOT NULL,
  `dated` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `category` varchar(16) default NULL,
  `action` varchar(16) NOT NULL,
  `info` text,
  PRIMARY KEY  (`userActionID`),
  KEY `userID` (`userID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=83 ;

--
-- Dumping data for table `bbcore_user_actions`
--

-- --------------------------------------------------------

--
-- Table structure for table `bbcore_user_identities`
--

CREATE TABLE IF NOT EXISTS `bbcore_user_identities` (
  `userID` int(10) unsigned NOT NULL,
  `firstName` varchar(64) NOT NULL,
  `lastName` varchar(64) default NULL,
  `email` varchar(128) default NULL,
  KEY `userID` (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bbcore_user_identities`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_user_preferences`
--

CREATE TABLE IF NOT EXISTS `bbcore_user_preferences` (
  `userID` int(10) unsigned NOT NULL,
  `defaultAccountID` int(10) unsigned NOT NULL,
  `preferences` text NOT NULL,
  UNIQUE KEY `userID` (`userID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bbcore_user_preferences`
--


-- --------------------------------------------------------

--
-- Table structure for table `bbcore_user_roles`
--

CREATE TABLE IF NOT EXISTS `bbcore_user_roles` (
  `roleID` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(16) NOT NULL,
  `permissions` text NOT NULL,
  PRIMARY KEY  (`roleID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `bbcore_user_roles`
--

INSERT INTO `bbcore_user_roles` (`roleID`, `name`, `permissions`) VALUES
(1, 'Guest', '{"view":{"public":true},"edit":{"public":true}}'),
(2, 'Moocher', '{"view":{"public":true},"edit":{"public":true}}');

-- --------------------------------------------------------

--
-- Table structure for table `bbplug_posty_containers`
--

CREATE TABLE IF NOT EXISTS `bbplug_posty_containers` (
  `postyContainerID` int(10) unsigned NOT NULL auto_increment,
  `parentID` int(10) unsigned default NULL,
  `name` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `tags` text NOT NULL,
  PRIMARY KEY  (`postyContainerID`),
  KEY `parent` (`parentID`),
  FULLTEXT KEY `tags` (`tags`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `bbplug_posty_containers`
--

INSERT INTO `bbplug_posty_containers` (`postyContainerID`, `parentID`, `name`, `content`, `tags`) VALUES
(1, NULL, 'Test Blog Thread', '', 'test blog thread');

-- --------------------------------------------------------

--
-- Table structure for table `bbplug_posty_posts`
--

CREATE TABLE IF NOT EXISTS `bbplug_posty_posts` (
  `postyPostID` int(10) unsigned NOT NULL auto_increment,
  `parentID` int(10) unsigned NOT NULL default '1',
  `userName` varchar(32) NOT NULL,
  `dated` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `content` text NOT NULL,
  PRIMARY KEY  (`postyPostID`),
  KEY `parent` (`parentID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `bbplug_posty_posts`
--

INSERT INTO `bbplug_posty_posts` (`postyPostID`, `parentID`, `userName`, `dated`, `content`) VALUES
(1, 1, 'tester', '2010-05-22 17:25:01', 'this is a test'),
(2, 1, 'Guest', '2010-05-22 19:07:37', '<p>\n	Okay, Now.&nbsp; Let&#39;s test this thing out.&nbsp; For realzy real this time.</p>\n');