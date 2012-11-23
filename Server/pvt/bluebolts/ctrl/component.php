<?php
/**	Component:  Controls loading and management of Components
*
*	@author	David Wipperfurth
*	@dated	2010-05-21
*/

require_once('Base.php');

class Component extends Base{
	
	function __construct(){
		parent::__construct();
	}
	
	function index(){ }
	
	function loadComponentData($componentID){
		header("Cache-Control: max-age=2592000, proxy-revalidate");
		$this->_returnAjaxObj($this->_loadComponentData($componentID));
	}
	
	function _loadComponentData($componentID){
		if(!$componentID) return false;  //No good choice for default yet.
		
		$block = $this->db->query('SELECT * FROM `bbcore_component_blocks` WHERE componentBlockID = %1$d', $componentID);
		
		return $block[0];
	}
	
	function updateComponentData($componentID){
		if(!$componentID) return false;  //No good choice for default yet.
		
		$data = $GLOBALS['HTTP_RAW_POST_DATA'];
		
		$block = $this->db->query('UPDATE `bbcore_component_blocks` SET parameters="%2$s" WHERE componentBlockID = %1$d', $componentID, $data);
		
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
		
		$widgetQuery = 'UPDATE bbcore_component_blocks SET parameters = "%2$s" '
					 . 'WHERE componentBlockID=%1$d';
		$result = $this->db->query($widgetQuery, $args->instanceID, json_encode($args->args));
		
		return $result;
	}
}

?>