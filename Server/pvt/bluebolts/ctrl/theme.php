<?php
/**	Theme:  Controls loading and management of themes
*
*	@author	David Wipperfurth
*	@dated	2010-05-21
*/

require_once('Base.php');

class Theme extends Base{
	
	function __construct(){
		parent::__construct();
	}
	
	function index(){ }
	
	function addTheme(){
		$this->_returnAjaxObj($this->_addTheme($this->_getAjaxObj()));
	}
	function _addTheme($args){
		if(!$args->name || !$args->content) return false;
		
		$query = 'INSERT INTO bbcore_themes(name, content) VALUES("%1$s", "%2$s")';
		$result = $this->db->query($query, $args->name, $args->content);
		
		return $result[0];
	}
	
	function getThemes(){
		header("Cache-Control: max-age=2592000, proxy-revalidate");
		$this->_returnAjaxObj($this->_getThemes($this->_getAjaxObj()));
	}
	function _getThemes($args){
		$query = ' SELECT * FROM bbcore_themes ';
		$result = $this->db->query($query);
		
		return $result;
	}
	
	function getThemeByID(){
		header("Cache-Control: max-age=2592000, proxy-revalidate");
		$this->_returnAjaxObj($this->_getThemeByID($this->_getAjaxObj()));
	}
	function _getThemeByID($args){
		if(!$args->themeID) $args->themeID = 1;
		
		//var_dump($args);
		
		$query = 'SELECT * FROM bbcore_themes WHERE themeID = %1$d LIMIT 1';
		$result = $this->db->query($query, $args->themeID);
		
		//var_dump($result);
		
		return $result[0];
	}
	
	function getUsersTheme(){
		$this->_returnAjaxObj($this->_getUsersTheme($this->_getAjaxObj()));
	}
	function _getUsersTheme($args=null){
		if(!$args || $args->userID) $args->userID = $this->_getUserID();
		
		//var_dump($args->userID);
		
		$query = 'SELECT preferences FROM bbcore_user_preferences WHERE userID = %1$d LIMIT 1';
		$result = $this->db->query($query , $args->userID);
		$curpreferences = json_decode($result[0]['preferences']);
		
		if(!$curpreferences->theme){
			$theme = $this->_getThemes($args);
			return $theme[0];
		}
		
		//var_dump($curpreferences);
		
		$temp->themeID = $curpreferences->theme;
		return $this->_getThemeByID($temp);
	}
}

?>