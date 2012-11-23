<?php
/**	File Manager:  Controls uploading and downloading of database managed files.
*
*	@author	David Wipperfurth
*	@dated	2010-05-21
*/

require_once('Base.php');

class FileManager extends Base{

	public static $rootFilePath = "../userfiles";
	public static $allowedExtensions = array("txt", "csv", "htm", "html", "xml"
		,"css" ,"doc" ,"xls" ,"xlsx" ,"rtf" ,"ppt" ,"pdf" ,"swf" ,"flv" ,"avi"
		,"wmv" ,"mov" ,"jpg" ,"jpeg" ,"gif" ,"png");

	function __construct(){
		parent::__construct();
	}
	
	function index(){ return false; }
	
	/**	upload:  uploads a file to a share space.  This version is the one uploadify should call.  It 
	*	is setup to handle the lack of a sessions, and the use of POST variables.
	*/
	function upload($args){
		if(!$args->shareSpaceID) $args->shareSpaceID = $_REQUEST['shareSpaceID'];
		if(!$args->formName) $args->formName = 'Filedata';
		if(!$args->fileName) $args->fileName = basename($_FILES[$args->formName]['name']);
		$this->_returnAjaxObj($this->_upload($args));
		//$this->_upload($args);
	}
	function _upload($args){
		if(!file_exists(FileManager::$rootFilePath)){
			mkdir(FileManager::$rootFilePath, 0755, true);
		}
		$log = fopen(FileManager::$rootFilePath.'/log.txt', 'a+');
		
		
		if(!$args->shareSpaceID){
			fwrite($log, "shareSpaceID is not present with upload request");
			fclose($log);
			return "shareSpaceID is not present with upload request";
		}
		if(!$args->formName) $args->formName = 'Filedata';
		
		if(!is_uploaded_file($_FILES[$args->formName]['tmp_name'])){
			fwrite($log, $_FILES[$args->formName]['tmp_name'].":  is not an uploaded file");
			fclose($log);
			return $_FILES[$args->formName]['tmp_name'].":  is not an uploaded file";
		}
		
		$args->type = substr(strrchr($_FILES[$args->formName]['name'], '.'), 1);
		if(!in_array($args->type, FileManager::$allowedExtensions)){
			fwrite($log, $args->type.":  is not an allowed file type");
			fclose($log);
			return $args->type.":  is not an allowed file type";
		}
		if(!$args->fileName) $args->fileName = basename($_FILES[$args->formName]['name']);
		
		$queryString = ' INSERT bbcore_files'
		             . '(shareSpaceID, name)'
		             . ' VALUES(%1$d, "%2$s")';
		$args->result = $this->db->query($queryString, $args->shareSpaceID, $args->fileName);
		if(!$args->result){
			fwrite($log, "failed to create record");
			fclose($log);
			return "failed to create record";
		}
		$args->fileID = $this->db->insertID;
		
		$userPath = FileManager::$rootFilePath.'/'.$args->shareSpaceID;
		if(!file_exists($userPath)){
			mkdir($userPath, 0755, true);
		}
		
		$args->path = $userPath.'/'.'up'.$args->fileID;
		if(!move_uploaded_file($_FILES[$args->formName]['tmp_name'], $args->path)){
			fwrite($log, "failed to move file " . $_FILES[$args->formName]['tmp_name'] . " to " . $args->path);
			fclose($log);
			return "failed to move file " . $_FILES[$args->formName]['tmp_name'] . " to " . $args->path;
		}
		
		fwrite($log, '{"action":"upload","File":"'.'up'.$args->fileID.'","shareSpaceID":'.$args->shareSpaceID.'}');
		fclose($log);
		
		return $args;
	}
	
	function deleteFile(){
		$args = $this->_getAjaxObj();
		$this->_returnAjaxObj($this->_deleteFile($args));
	}
	function _deleteFile($args){
		if(!$args->fileID) return false;
		
		if(!file_exists(FileManager::$rootFilePath)){
			mkdir(FileManager::$rootFilePath, 0755, true);
		}
		$log = fopen(FileManager::$rootFilePath.'/log.txt', 'a+');
		
		
		$queryString = ' SELECT * '
		             . ' FROM bbcore_files f '
		             . ' WHERE f.fileID = %1$d ';
		$result = $this->db->query($queryString, $args->fileID);
		if(!$result) return false;
		$result = $result[0];
		
		$ssPath = FileManager::$rootFilePath.'/'.$result['shareSpaceID'];
		if(!file_exists($ssPath)){
			mkdir($ssPath, 0755, true);
		}
		$path = $ssPath.'/'.'up'.$args->fileID;
		
		if(!unlink($path)){
			fwrite($log, 'Failed to delete file": "'.'up'.$args->fileID.'"," for shareSpaceID":'.$result['shareSpaceID']);
			fclose($log);
			return false;
		}
		
		fwrite($log, '{"action":"delete","File":"'.'up'.$args->fileID.'","shareSpaceID":'.$result['shareSpaceID'].'}');
		fclose($log);
		
		$data->success = true;
		return $data;
	}
	function _delTree($dir){
		if(substr($dir, -1) != '/') $dir .= '/';
		$files = glob($dir.'*', GLOB_MARK|GLOB_NOSORT);
		foreach($files as $file){
			if(substr($file, -1) == '/'){
				$this->delTree($file);
			}else{
				unlink($file);
			}
		}
		
		if(is_dir($dir)) rmdir($dir);
	} 
	
	function getFileAsOwner($fileID){
		if(!$fileID){
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
			die("Error# 404: File Not Found");
		}
		
		$queryString = ' SELECT * '
		             . ' FROM bbcore_files f '
		             . ' WHERE f.fileID = %1$d AND f.userID = %2$d '
					 . ' LIMIT 1 ';
		$result = $this->db->query($queryString, $fileID, $this->_getUserID());
		
		$filePath = FileManager::$rootFilePath.'/'.$result[0]['userID'].'/up'.$result[0]['fileID'];
		if(!file_exists($filePath)){
			header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
			die("Error# 404: File Not Found (" . $filePath . ")");
		}
		
		header("Pragma: public\r\n");
		header("Expires: 0\r\n");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0\r\n");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT\r\n");
		header("Content-type: application/".substr(strrchr($result[0]['name'], '.'), 1)."\r\n");
		header("Content-Transfer-Encoding: binary\r\n");
		header("Content-length: ".filesize($filePath)."\r\n");
		//header("Content-disposition: attachment; filename="".basename($file).""");
		readfile($filePath);
	}
}

?>