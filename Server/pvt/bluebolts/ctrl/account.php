<?php
/**	Account: used for user account management
*
*	@author	David Wipperfurth
*	@dated	2010-05-19
*/

require_once('base.php');
class Account extends Base{

	//temporarily set salt here
	public $salt = "I Like Pie.";

	function __construct(){
		parent::__construct();
	}
	
	function index(){
		$this->login();
	}
	
	function login($data=null){
		$this->redirect('/page/load/login');
	}
	
	function logout(){
		session_destroy();
		$this->_redirect('page/load/login');
	}
	
	function logUserIn(){
		$this->_returnAjaxObj($this->_logUserIn($this->_getAjaxObj()));
	}
	function _logUserIn($args){
		if(!$args->userName) return array('error'=>'No UserName.');
		if(!$args->password) return array('error'=>'No Password.');
		
		$args->userName = mysql_escape_string($args->userName);
		$args->password = sha1($this->salt.$args->password);
		
		$query = ' SELECT u.*, up.preferences '
		       . ' FROM bbcore_users u '
			   . ' LEFT JOIN bbcore_user_preferences up ON up.userID = u.userID '
			   . ' WHERE u.userName = "%1$s" '  //since the concept of logging on to an account is not developed from that of logging onto to platform, defaultAccountID is used for platform authentication permissions
			   . ' LIMIT 1 ';
		$user = $this->db->query($query, $args->userName);
		$user = $user[0];
		if(!$user) return array('error'=>'Bad UserName or Password.');
		//var_dump($user);
		//var_dump($args);
		
		if($user['password'] != $args->password) return array('error'=>'Bad UserName or Password.');
		if($user['validated'] == null) return array('error'=>'User is Un-Validated.');
		
		$this->_logAction($user['userID'], 'account', 'logUserIn', $args);
		
		$profile = json_decode($user['preferences']);
		
		$query = ' SELECT ur.permissions '
		       . ' FROM bbcore_user_roles ur '
			   . ' WHERE ur.roleID = %1$d '
			   . ' LIMIT 1 ';
		$permissions = $this->db->query($query, $user['roleID']);
		if($permissions) $permissions = $permissions[0];
		
		$_SESSION['userID'] = $user['userID'];
		$_SESSION['userName'] = $args->userName;
		$_SESSION['roleID'] = $user['roleID'];
		$_SESSION['permissions'] = json_decode($permissions['permissions'], true);
		
		return true;
	}
	
	function _logUserInAsGuest(){
		$args->userName = 'Guest';
		$args->password = 'D4R5Tgvc;23!18K$';
		return $this->_logUserIn($args);
	}
	
	function _createGuest(){
		$args->userName = 'Guest';
		$args->password = 'D4R5Tgvc;23!18K$';
		$args->password2 = 'D4R5Tgvc;23!18K$';
		$args->email = 'e@mail.net';
		$args->roleID = 1;
		return $this->_createUser($args);
	}
	
	function _valRegInfo($args){
		require_once(self::ROOT_PVT."lib/RegEx_helper.php");

		//Check email
		$result = preg_match(VALID_EMAIL, $args->email);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_EMAIL)");
		if($result===0) return array('error'=>'Invalid E-Mail Address');
		
		//Check user name
		$result = preg_match(VALID_USER_NAME, $args->userName);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_USER_NAME)");
		if($result===0) return array('error'=>'Invalid Username');
		
		//Check password
		$result = preg_match(VALID_PASSWORD, $args->password);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_PASSWORD)");
		if($result===0) return array('error'=>'Invalid Password');
		if($args->password != $args->password2) return array('error'=>'Miss-Matched Passwords');
		
		return array('error'=>null);
	}
	
	function createUser(){
		$args = $this->_getAjaxObj();
		$args->roleID = 2;	//prevents clients from specifying thier role
		$this->_returnAjaxObj($this->_createUser($args));
	}
	function _createUser($args){
		require_once(self::ROOT_PVT."libs/regex_helper.php");

		//Check email
		if(!$args->email) $args->email = 'e@mail.net';
		$result = preg_match(VALID_EMAIL, $args->email);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_EMAIL)");
		if($result===0) return array('error'=>'Invalid E-Mail Address');
		
		//Check user name
		if(!$args->userName) return array('error'=>'Missing UserName');
		$result = preg_match(VALID_USER_NAME, $args->userName);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_USER_NAME)");
		if($result===0) return array('error'=>'Invalid Username');
		
		//Check password
		if(!$args->password) return array('error'=>'Missing Password');
		$result = preg_match(VALID_PASSWORD, $args->password);
		if($result===false) throw new Exception("Bad Regular Expression(VALID_PASSWORD)");
		if($result===0) return array('error'=>'Invalid Password');
		if($args->password != $args->password2) return array('error'=>'Miss-Matched Passwords');
		
		//check roleID
		if(!$args->roleID) $args->roleID = 2;
		
		//if(!$this->_checkPermission("users","create","roleID", $args->roleID)) return false;
		
		$args->password = sha1($this->salt.$args->password);
		$query = 'INSERT INTO bbcore_users(userName, password, email, roleID) VALUES("%1$s", "%2$s", "%3$s", %4$d)';
		$result = $this->db->query($query, $args->userName, $args->password, $args->email, $args->roleID);
		if(!$result) return array('error'=>'Username Already Taken');

		$args->userID = $this->db->insertID;
		$args->password2 = null;
		$args->password = null;
		
		$this->_logAction($args->userID, 'account', 'addUser', $args);
		
		return $args;
	}
}
?>