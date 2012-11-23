<?php
/**	Basse:  The base controller that all other controllers should extend from.
*
*	@author	David Wipperfurth
*	@dated	2010-05-19
*/


//prevent direct file access
if(!$foundFile){
 header('HTTP/1.0 401 Unauthorized'); 
 die();
}

//remove everything but major issues
error_reporting(E_ERROR | E_WARNING | E_PARSE);

class Base{

	const ROOT_URL = 'bluebolts';
	const ROOT_WWW = '.';
	const ROOT_PVT = '../../pvt/bluebolts/';

	protected $db;

	function __construct(){
		require_once(self::ROOT_PVT.'libs/DatabaseManager.php');
		$args->hostname = 'localhost';
		$args->username = 'bluebolts';
		$args->password = 'd$@St3rARea';
		$args->database = 'bluebolts';
		$this->db = DatabaseManager::connectAs($args);
		$this->_startSession(3600, 86400);
	}
	
	function _startSession($refresh, $timeout){
		session_set_cookie_params($timeout);
		session_start();
		if(!isset($_SESSION['session_time_stamp'])) $_SESSION['session_time_stamp'] = time();
		if($_SESSION['session_time_stamp'] + $refresh < time()){
			session_regenerate_id();
			$_SESSION['session_time_stamp'] = time();
		}
	}
	
	function _checkAuthentication(){
		if(!isset($_SESSION['userID'])){
			require_once('account.php');
			$a = new Account();
			if(!$a->_logUserInAsGuest()) $this->_htmlRedirect();
		}
	}
	
	function _checkPermission($names){
		if(!isset($_SESSION['permissions'])){
			require_once('account.php');
			$a = new Account();
			if(!$a->_logUserInAsGuest()) $this->_htmlRedirect();
		}
		
		if(!is_array($names)) $names = func_get_args();
		$path = $_SESSION['permissions'];
		foreach($names as $key => $value){
			if($path === true || $path['all'] === true) return true;
			if(!is_array($path)) return false;
			$path = $path[$value];
			if(!$path) return false;
		}
		
		return $path;
	}
	
	function _getRoleID(){
		if(!isset($_SESSION['roleID'])){
			require_once('account.php');
			$a = new Account();
			if(!$a->_logUserInAsGuest()) $this->_htmlRedirect();
		}
		return $_SESSION['roleID'];
	}
	
	function _getUserID(){
		if(!isset($_SESSION['userID'])){
			require_once('account.php');
			$a = new Account();
			if(!$a->_logUserInAsGuest()) $this->_htmlRedirect();
		}
		return $_SESSION['userID'];
	}
	
	function _getUserName(){
		if(!isset($_SESSION['userName'])){
			require_once('account.php');
			$a = new Account();
			if(!$a->_logUserInAsGuest()) $this->_htmlRedirect();
		}
		return $_SESSION['userName'];
	}
	
	function _getAjaxObj(){
		return json_decode($GLOBALS['HTTP_RAW_POST_DATA']);
	}
	
	function _returnAjaxObj($object){
		header("Content-type: application/x-json");
		print json_encode($object);
	}
	
	function _logAction($userID, $category, $action, $info){
		if(!$userID) $userID = $this->_getUserID();
		if(!$category) $category = 'general';
		if(!$action) $action = $category;
		if(!$info) $info = '';
		if(is_object($info) || is_array($info)) $info = json_encode($info);
		$queryString = ' INSERT INTO '
		             . ' bbcore_user_actions(userID, category, action, info) '
					 . ' VALUES(%1$d, "%2$s", "%3$s", "%4$s") ';
		$result = $this->db->query($queryString, $userID, $category, $action, $info);
		if($result) $result = $this->db->insertID;
		
		return $result;
	}
	
	function _htmlRedirect($message=null, $url=null){
		if(!$url) $url = '/page/load/list';
		if(!$message) $message = "Redirecting to <a href='".$url."'>this page</a>.";
		$html = "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'><html><head>"
		      . "<title>Your Page Title</title>"
			  . "<meta http-equiv='REFRESH' content='0;url=".$url."'>"
			  . "</head><body>"
			  . $message
			  . "</body></html>";
		die($html);
	}
	
	function _redirect($url){
		header('Location: http://'.$_SERVER['HTTP_HOST'].'/'.self::ROOT_URL.'/'.$url);
		exit;
	}
	
	function _send404(){
		header("HTTP/1.0 404 Not Found");
        header("Status: 404 Not Found");
		die('Error 404: File Not Found.');
	}
	
	function _send500(){
		header("HTTP/1.0 500 Internal Server Error");
        header("Status: 500 Internal Server Error");
		die('Error 500: Internal Server Error.');
	}
}
?>