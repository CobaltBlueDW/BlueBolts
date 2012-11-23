<?php
/**	Content Block:  Controls loading and management of content blocks
*
*	@author	David Wipperfurth
*	@dated	2010-05-21
*/

require_once('Base.php');

class ContentBlock extends Base{
	
	function __construct(){
		parent::__construct();
	}
	
	function index(){ }
	
	function loadContentData($assoc, $userID){
		header("Cache-Control: no-cache");
		$this->_returnAjaxObj($this->_loadContentData($assoc, $userID));
	}
	
	function _loadContentData($assoc, $userID){
		if(!$userID) $userID = $this->_getUserID();
		
		$block = $this->db->query('SELECT * FROM bbcore_content_blocks WHERE userID = %1$d AND association = "%3$s"', $userID, $assoc);
		
		return $block[0];
	}
	
	function updateContentData($instanceID){
		$this->_returnAjaxObj($this->_updateContentData($instanceID, $GLOBALS['HTTP_RAW_POST_DATA']));
	}
	function _updateContentData($instanceID, $args){
		if(!$instanceID) return false;  //No good choice for default yet.
		
		$block = $this->db->query('UPDATE `bbcore_content_blocks` SET parameters="%2$s" WHERE contentBlockInstanceID = %1$d', $instanceID, $args);
		
		return $block;
	}
	
	function addContentBlock(){
		$this->_returnAjaxObj($this->_addContentBlock($this->_getAjaxObj()));
	}
	
	function _addContentBlock($args){
		if(!$args->parameters) return false;
		if(!$args->userID) $args->userID = $this->_getUserID();
		if(!$args->association) $args->association = 'genID:'+mt_rand();
		if(!$args->className) $args->className = 'HTMLContentBlock';
		$args->parameters = json_encode($args->parameters);
		
		$query = 'INSERT INTO `bbcore_content_blocks`(userID, association, className, parameters) VALUES(%1$d, "%2$s", "%3$s", "%4$s")';
		$block = $this->db->query($query , $args->userID, $args->association, $args->className, $args->parameters);
		if(!$block) return false;
		
		$args->insertID = $this->db->insertID;
		return $args;
	}
	
	function removeContentBlock(){
		$this->_returnAjaxObj($this->_removeContentBlock($this->_getAjaxObj()));
	}
	
	function _removeContentBlock($args){
		if(!$args->association) return false;
		if(!$args->userID) $args->userID = $this->_getUserID();
		
		$query = 'DELETE FROM `bbcore_content_blocks` WHERE userID=%1$d AND association="%2$s"';
		$block = $this->db->query($query , $args->userID, $args->association);
		
		return $block[0];
	}
	
	/** Save:  Saves data for a Component in its record.
	*
	*/
	function save(){
		$this->_returnAjaxObj($this->_save($this->_getAjaxObj()));
	}
	function _save($args){
		if(!$args->instanceID) return false;
		
		$widgetQuery = ' UPDATE bbcore_content_blocks SET parameters = "%2$s" '
					 . ' WHERE contentBlockInstanceID = %1$d ';
		$result = $this->db->query($widgetQuery, $args->instanceID, json_encode($args->args));
		
		return $result;
	}
}

?>