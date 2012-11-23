<?php
/**	User:  Controls loading and management of user info
*
*	@author	David Wipperfurth
*	@dated	2010-05-21
*/



require_once('Base.php');

class User extends Base{
	
	function __construct(){
		parent::__construct();
	}
	
	function index(){ }
	
	function getUserInfo(){
		header("Cache-Control: no-cache");
		$this->_checkAuthentication();
		$this->_returnAjaxObj($this->_getUserInfo($this->_getAjaxObj()));
	}
	function _getUserInfo($args){
		$args->userID = $this->_getUserID();
		
		$query = ' SELECT u.userID, u.userName, ui.firstName, ui.lastName, up.preferences '
			   . ' FROM bbcore_users u '
			   . ' LEFT JOIN bbcore_user_preferences up ON up.userID = u.userID '
			   . ' LEFT JOIN bbcore_user_identities ui ON ui.userID = u.userID '
			   . ' WHERE u.userID = %1$d';
		$result = $this->db->query($query , $args->userID);
		if(!$result) return false;
		$userInfo = $result[0];
		$userInfo['preferences'] = json_decode($userInfo['preferences']);
		
		$query = ' SELECT ur.permissions '
		       . ' FROM bbcore_user_roles ur '
			   . ' WHERE ur.roleID = %1$d '
			   . ' LIMIT 1 ';
		$permissions = $this->db->query($query, $this->_getRoleID());
		if(!$permissions) return false;
		
		$userInfo['permissions'] = json_decode($permissions[0]['permissions']);
		$userInfo['roleID'] = $this->_getRoleID();
		
		return $userInfo;
	}
}
?>