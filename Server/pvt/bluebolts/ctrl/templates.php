<?php
/**	Templates: handles template functionality
*
*	@author	David Wipperfurth
*	@dated	2010-05-19
*/

require_once('base.php');
class Templates extends Base{

	function __construct(){
		parent::__construct();
	}
	
	//test
	function index(){
		$template = 'This is my ~{madlib1}~ and ~{madlib2}~ template system.';
		$templateID = $this->_saveTemplate($template);
		$reTemplate = $this->_loadTemplate($templateID);
		$reTemplate = $reTemplate['template'];
		$args->madlib1 = 'Awesome';
		$args->madlib2 = 'nearly php_scripts identical';
		print $this->_compTemplate($reTemplate, $args);
		return true;
	}
	
	function fillDBTemplate(){
		$args = $this->_getAjaxObj();
		if(!$args->templateID) return false;
		$this->_returnAjaxObj($this->_fillDBTemplate($args->templateID, $args));
	}
	function _fillDBTemplate($templateID, $args=null){
		return $this->_execScript($this->_loadScript($templateID), $args);
	}
	
	function _compTemplate($template, $args=null){
		if(!$template) return false;
		if(!$args) $args->empty = true;
		$convFrom = array('~{', '}~');
		$convTo   = array('<?print $args->', ';?>');
		$runCode = '?>'.str_replace($convFrom, $convTo, $template).'<?;';
		ob_start();
		eval($runCode);
		$result = ob_get_contents();
		ob_end_clean();
		return $result;
	}
	
	function _loadTemplate($templateID){
		if(!$templateID) return false;
		
		$query = ' SELECT * '
		       . ' FROM bbcore_templates temp '
			   . ' WHERE temp.templateID = %1$d ';
		$result = $this->db->query($query , $templateID);
		if(!$result) return false;
		return $result[0];
	}
	
	function _saveTemplate($template, $templateID=null){
		if(!$template) return false;
		
		if($templateID){
			$query = ' UPDATE bbcore_templates temp '
			       . ' SET template = "%2$s" '
				   . ' WHERE temp.templateID = %1$d ';
			$result = $this->db->query($query , $templateID, $template);
			if(!$result) return false;
			return true;
		}else{
			$query = ' INSERT bbcore_templates '
			       . ' (template) '
				   . ' VALUES("%1$s")';
			$result = $this->db->query($query , $template);
			if(!$result) return false;
			return $this->db->insertID;
		}
	}
}
?>