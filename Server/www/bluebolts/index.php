<?php
	//config
	$controllerPaths = array('../pvt/bluebolts/ctrl','../pvt/bluebolts/plugins');
	define('ROOT_URL','bluebolts');
	define('ROOT_WWW','.');
	define('ROOT_PVT','../../pvt/bluebolts/');
	
	//grab request path bits
	$pathNodes = explode('/',trim($_SERVER["PATH_INFO"], '/'));
	
	//find path to controller
	$foundFile = false;
	$tempPath = '';
	$className = '';
	while( !$foundFile && ($curPath = array_shift($controllerPaths)) ){
		$tempPath = $_SERVER['DOCUMENT_ROOT'].'/'.$curPath;
		//print $tempPath.'<br />\n';
		$i = 0;
		while(!$foundFile && file_exists($tempPath)){
			$className = $pathNodes[$i];
			$tempPath .= '/'.$className;
			//print $tempPath."<br />\n";
			if(is_file($tempPath.'.php')) $foundFile = true;
			$i++;
		}
	}
	array_splice($pathNodes,0,$i);
	
	//if controller not found show error message
	if(!$foundFile){
		header("HTTP/1.0 404 Not Found");
        header("Status: 404 Not Found");
		die('Error 404: File Not Found.');
	}
	
	//create controller object and call function
	include($tempPath.'.php');
	$controller = new $className();
	$methodName = array_shift($pathNodes);
	if($methodName)	call_user_func_array(array($controller, $methodName), $pathNodes);
?>