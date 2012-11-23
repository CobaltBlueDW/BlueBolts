<?php
	//grab all jobs that need to get done
	require_once("libraries/DatabaseManager.php");
	$connection = DatabaseManager::connectAs('default');
	$query = ' SELECT * '
	       . ' FROM bbcore_chron_jobs cj '
		   . ' WHERE cj.time <= NOW() AND cj.state = "waiting" '
		   . ' ORDER BY cj.time ASC ';
	$result = $connection->queryInsert($query);
	if(!$result) die();
	
	//mark all current jobs as 'pending'
	$query = ' UPDATE bbcore_chron_jobs cj '
	       . ' SET cj.state = "pending" '
		   . ' WHERE cj.chronJobID IN ( ';
	foreach($result as $key => $value){
		$query .= $value['chronJobID'].', ';
	}
	$query = substr($query, 0, -2);
	if(substr($query, -1, 1) == 'N') die();
	$query .= ') ';
	$result2 = $connection->queryInsert($query);
	
	//run all current jobs
	foreach($result as $key => $value){
		$pathBits = explode($value['chronJobID'], ';');		//example: './controllers/mycontroller.php;MyController;ChronFuncName'
		include_once(array_shift($pathBits[0]));
		if(class_exists($pathBits[0])){
			$pathBits[0] = new $pathBits[0]();
			try{
				$result[$key]['result'] = call_user_func_array($pathBits, json_decode($value['params']));
			}catch(Exception $e){
				$result[$key]['result'] = false;
			}
		}else{
			$result[$key]['result'] = false;
		}
	}
	
	//mark all successful jobs as 'complete' and unsuccessful jobs as 'failed'
	$queryS = ' UPDATE bbcore_chron_jobs cj '
	       . ' SET cj.state = "complete" '
		   . ' WHERE cj.chronJobID IN ( ';
	$queryF = ' UPDATE bbcore_chron_jobs cj '
	       . ' SET cj.state = "failed" '
		   . ' WHERE cj.chronJobID IN ( ';
	foreach($result as $key => $value){
		if($value['result']) $queryS .= $value['chronJobID'].', ';
		else $queryF .= $value['chronJobID'].', ';
	}
	$queryS = substr($queryS, 0, -2);
	$queryF = substr($queryF, 0, -2);
	if(substr($queryS, -1, 1) != 'N'){
		$queryS .= ') ';
		$resultS = $connection->queryInsert($queryS);
	}
	if(substr($queryF, -1, 1) != 'N'){
		$queryF .= ') ';
		$resultF = $connection->queryInsert($queryF);
	}
?>