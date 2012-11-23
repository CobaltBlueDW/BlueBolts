<?php
/**	Page: used to load construct/send pages
*
*	@author	David Wipperfurth
*	@dated	2010-05-19
*/

require_once('base.php');
class Page extends Base{

	function __construct(){
		parent::__construct();
	}
	
	function load($pageName){
		if(!$pageName) $this->_redirect('page/load/list');
		
		$query = ' SELECT p.*, t.template '
		       . ' FROM bbcore_page_lookup pl '
			   . ' JOIN bbcore_pages p '
			   . ' JOIN bbcore_templates t ON t.templateID = p.templateID '
			   . ' WHERE pl.association = "%1$s" AND pl.roleID = %2$d '
			   . ' LIMIT 1 ';
		$result = $this->db->query($query, $pageName, $this->_getRoleID());
		if(!$result){
			if($pageName != 'list'){
				$this->_redirect('page/load/list');
			}else{
				$this->_send404();
			}
		}
		$page = $result[0];
		
		$template = file_get_contents(self::ROOT_PVT.'views/header.php',FILE_USE_INCLUDE_PATH);
		$template .= $page['template'];
		$template .= file_get_contents(self::ROOT_PVT.'views/footer.php',FILE_USE_INCLUDE_PATH);
		//print $template;
		//var_dump($page);
		
		require_once('theme.php');
		$theme = new Theme();
		if($this->_getUserID()){
			$theme = $theme->_getUsersTheme();
		}else{
			$temp->themeID = 1;
			$theme = $theme->_getThemeByID($temp);
		}
		$page['styles'] = array_merge((array)json_decode($page['styles']), (array)json_decode($theme['content']));
		$page['scripts'] = json_decode($page['scripts']);
		$page['metaData'] = json_decode($args['metaData']);
		
		require_once('templates.php');
		$templater = new Templates();
		print $templater->_compTemplate($template, $page);
		
		return;
	}
	
	function loadPageData($pageName){
		header("Cache-Control: no-cache");
		$this->_returnAjaxObj($this->_loadPageData($pageName));
	}
	
	function _loadPageData($pageName){
		//echo $pageAssoc;
		if(!$pageName) $pageName = "home";
		
		$query = ' SELECT p.* '
		       . ' FROM bbcore_page_lookup pl '
			   . ' JOIN bbcore_pages p on p.pageID = pl.pageID '
			   . ' WHERE pl.association = "%1$s" AND pl.roleID = %2$d '
			   . ' LIMIT 1 ';
		$page = $this->db->query($query, $pageName, $this->_getRoleID());
		if(!$page) return false;
		return $page[0];
	}
	
	function getPages(){
		$this->_returnAjaxObj($this->_getPages($this->_getAjaxObj()));
	}
	function _getPages($args){
		if(!$args->roleID) $args->roleID = $this->_getRoleID();
		if(!$args->accountID) $args->accountID = $this->_getAccountID();
		
		$query = ' SELECT pl.pageID, pl.association '
			   . ' FROM bbcore_page_lookup pl '
			   . ' WHERE pl.roleID = %1$d ';
		$pages = $this->db->query($query, $this->_getRoleID());
		if(!$pages) return false;
		
		return $pages;
	}
}
?>