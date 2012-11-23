<?php
/**	PostyService:  The main service for Posty DB manipulation.
*
*	@author	David Wipperfurth
*	@group	BlueSolutions
*	@dated	2010-05-22
*/

require_once(ROOT_PVT.'ctrl/base.php');

Class PostyService extends Base{

	function __construct(){
		parent::__construct();
	}
	
	/**	Create Post:  creates a post.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->parentID			The ID of the container the post belongs to.
	*	$args->userName			The userName of the user who wrote them.
	*	$args->content			The contents of the post. (required)
	*/
	function createPost(){
		$this->_returnAjaxObj($this->_createPost($this->_getAjaxObj()));
	}
	function _createPost($args){
		if(!$this->_checkPermission('edit','public')) return false;
		if(!$args->content) return false;
		if(!$args->parentID) $args->parentID = 1;
		if(!$args->userName) $args->userName = $this->_getUserName();
		
		
		$query = ' INSERT INTO '
		       . ' bbplug_posty_posts(parentID,userName,content) '
			   . ' VALUES(%1$d,"%2$s","%3$s") ';
		$result = $this->db->query($query, $args->parentID, $args->userName, $args->content);
		if(!$result) return false;
		
		$args->insertID = $this->db->insertID;
		return $args;
	}
	
	/**	Create Container:  creates a posty container.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->parentID			The ID of the container the container belongs to.
	*	$args->name				The name of the container.
	*	$args->content			The contents of the container.
	*/
	function createContainer(){
		$this->_returnAjaxObj($this->_createContainer($this->_getAjaxObj()));
	}
	function _createContainer($args){
		if(!$this->_checkPermission('plugins','Posty','container','create')) return false;
		if(!$args->parentID) $args->parentID = null;
		if(!$args->name) $args->name = '';
		if(!$args->content) $args->content = '';
		if(!$args->tags) $args->tags = $args->name;
		
		
		$query = ' INSERT INTO '
		       . ' bbplug_posty_containers(parentID,name,content,tags) '
			   . ' VALUES(%1$d,"%2$s","%3$s","%4$s") ';
		$result = $this->db->query($query, $args->parentID, $args->name, $args->content, $args->tags);
		if(!$result) return false;
		
		$args->insertID = $this->db->insertID;
		return $args;
	}
	
	/**	Update Post:  updates a post.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyContainerID	The ID of the post. (requireD)
	*	$args->parentID			The ID of the container the post belongs to.
	*	$args->userName			The userName of the user who wrote them.
	*	$args->content			The contents of the post.
	*	Note: one of the following(parentID, userName, content) must be included for the function to succeed.
	*/
	function updatePost(){
		$this->_returnAjaxObj($this->_updatePost($this->_getAjaxObj()));
	}
	function _updatePost($args){
		if(!$this->_checkPermission('plugins','Posty','post','edit')) return false;
		if(!$args->postyPostID) return false;
		$query = ' UPDATE bbplug_posty_posts pp SET ';
		if($args->parentID) $query .= ' pp.parentID = %2$d, ';
		if($args->userName) $query .= ' pp.userName = "%3$s", ';
		if($args->content) $query .= ' pp.content = "%4$s", ';
		$query = substr($query, 0, -2);
		if(substr($query, -1, 1) == 'E') return false;
		$query .= ' WHERE pp.postyPostID = %1$d ';
		
		
		$result = $this->db->query($query, $args->postyPostID, $args->parentID, $args->userName, $args->content);
		if(!$result) return false;
		
		return $args;
	}
	
	/**	Update Container:  updates a container.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyContainerID	The ID of the container. (required)
	*	$args->parentID			The ID of the container this container belongs to.
	*	$args->name				The name of the container.
	*	$args->content			The contents of the container.
	*	$args->tags				The tags for the container.
	*	Note: one of the following(parentID, name, content, tags) must be included for the function to succeed.
	*/
	function updateContainer(){
		$this->_returnAjaxObj($this->_updateContainer($this->_getAjaxObj()));
	}
	function _updateContainer($args){
		if(!$this->_checkPermission('plugins','Posty','container','edit')) return false;
		if(!$args->postyContainerID) return false;
		$query = ' UPDATE bbplug_posty_containers pc SET ';
		if($args->parentID) $query .= ' pc.parentID = %2$d, ';
		if($args->name) $query .= ' pc.name = "%3$s", ';
		if($args->content) $query .= ' pc.content = "%4$s", ';
		if($args->tags) $query .= ' pc.tags = "%5$s", ';
		$query = substr($query, 0, -2);
		if(substr($query, -1, 1) == 'E') return false;
		$query .= ' WHERE pp.postyContainerID = %1$d ';
		
		
		$result = $this->db->query($query, $args->postyContainerID, $args->parentID, $args->name, $args->content, $args->tags);
		if(!$result) return false;
		
		return $args;
	}
	
	/**	Delete Post:  deletes a post.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyPostID	The ID of the post. (required)
	*/
	function deletePost(){
		$this->_returnAjaxObj($this->_deletePost($this->_getAjaxObj()));
	}
	function _deletePost($args){
		if(!$this->_checkPermission('plugins','Posty','post','delete')) return false;
		if(!$args->postyPostID) return false;
		
		$query = ' DELETE '
		       . ' FROM bbplug_posty_posts pp '
			   . ' WHERE pp.postyPostID = %1$d ';
		$result = $this->db->query($query, $args->postyPostID);
		if(!$result) return false;
		
		return $args;
	}
	
	/**	Delete Container:  deletes a container.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyContainerID	The ID of the Container. (required)
	*/
	function deleteContainer(){
		$this->_returnAjaxObj($this->_deleteContainer($this->_getAjaxObj()));
	}
	function _deleteContainer($args){
		if(!$this->_checkPermission('plugins','Posty','container','delete')) return false;
		if(!$args->postyContainerID) return false;
		
		$query = ' DELETE '
		       . ' FROM bbplug_posty_containers pc '
			   . ' WHERE pc.postyContainerID = %1$d ';
		$result = $this->db->query($query, $args->postyContainerID);
		if(!$result) return false;
		
		return $args;
	}
	
	/**	Get Posts:  returns a set of posts.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->parentID			The ID of the container the posts belong to.
	*	$args->userName			The userName of the user who wrote them.
	*	$args->time->start		The oldest post to grab.
	*	$args->time->end		The newest post to grab.
	*	Note: at least one of the following (parentID, userName, time) must be present for the function call to succeed.
	*	$args->sort				A list of field-name/ordering pairs to sort on.
	*	Note: The possible sort fields are ('dated','userName','parentID','postyPostID') and the possible orderings are ('ASC', 'DESC')
	*	$args->limit->count		The maximum number of posts to return
	*	$args->limit->start		The first post from the top of the query begin returning results from (mostly good for paging)
	*	Note: limit->start will not work without limit->count.
	*/
	function getPosts(){
		$this->_returnAjaxObj($this->_getPosts($this->_getAjaxObj()));
	}
	function _getPosts($args){
		if(!$this->_checkPermission('view','public')) return false;
		$query = ' SELECT * '
		       . ' FROM bbplug_posty_posts pp '
			   . ' WHERE ';
		if($args->parentID) $query .= ' pp.parentID = %1$d AND ';
		if($args->userName) $query .= ' pp.userName = "%2$s" AND ';
		if($args->time){
			if($args->time->start) $query .= ' pp.dated >= "%3$s" AND ';
			if($args->time->end) $query .= ' pp.dated <= "%4$s" AND ';
		}
		$query = substr($query, 0, -4);
		if(substr($query, -1, 1) == 'H') return false;	//no condition was chosen and instead of lopping off a 'AND ', the previous line lopped-off a 'ERE ' from WHERE, making the last letter 'H'
		if($args->sort){
			$query .= ' ORDER BY ';
			foreach($args->sort as $key=>$value){
				if($value != 'DESC' && $value != 'ASC') $value = '';
				switch($key){
					case 'time': $key = 'dated';
					case 'dated': case 'userName': case 'parentID': case 'postyPostID':
						$query .= $key.' '.$value.',';
					break;
					default: break;
				}
			}
			$query = substr($query, 0, -1);
			if(substr($query, -1, 1) == 'Y') $query = substr($query, 0, -8);	//if no orders are found, remove the 'ORDER BY'
		}
		if($args->limit && $args->limit->count){
			$query .= ' LIMIT ';
			if($args->limit->start) $query .= '%5$d,';
			$query .= '%6$d ';
		}
		$results = $this->db->query($query, $args->parentID, $args->userName, $args->time->start, $args->time->end, $args->limit->start, $args->limit->count);
		
		if(!$results) return false;
		
		return $results;
	}
	
	/**	Get Containers:  returns a set of containers.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->parentID			The ID of the container the containers belong to.
	*	$args->name				The name of the container.
	*	$args->tags				A Tag search string.
	*	Note: at least one of the following (parentID, name, tags) must be present for the function call to succeed.
	*	$args->sort				A list of field-name/ordering pairs to sort on.
	*	Note: The possible sort fields are ('name','parentID','postyContainerID') and the possible orderings are ('ASC', 'DESC')
	*	$args->limit->count		The maximum number of posts to return
	*	$args->limit->start		The first container from the top of the query begin returning results from (mostly good for paging)
	*	Note: limit->start will not work without limit->count.
	*/
	function getContainers(){
		$this->_returnAjaxObj($this->_getContainers($this->_getAjaxObj()));
	}
	function _getContainers($args){
		if(!$this->_checkPermission('plugins','Posty','container','view')) return false;
		$query = ' SELECT * '
		       . ' FROM bbplug_posty_containers pc '
			   . ' WHERE ';
		if($args->parentID) $query .= ' pc.parentID = %1$d AND ';
		if($args->name) $query .= ' pc.name = "%2$s" AND ';
		if($args->tags) $query .= ' MATCH(pc.tags) AGAINST("%3$s", IN BOOLEAN MODE) AND ';
		$query = substr($query, 0, -4);
		if(substr($query, -1, 1) == 'H') return false;	//no condition was chosen and instead of lopping off a 'AND ', the previous line lopped-off a 'ERE ' from WHERE, making the last letter 'H'
		if($args->sort){
			$query .= ' ORDER BY ';
			foreach($args->sort as $key=>$value){
				if($value != 'DESC' && $value != 'ASC') $value = '';
				switch($key){
					case 'name': case 'parentID': case 'postyContainerID':
						$query .= $key.' '.$value.',';
					break;
					default: break;
				}
			}
			$query = substr($query, 0, -1);
			if(substr($query, -1, 1) == 'Y') $query = substr($query, 0, -8);	//if no orders are found, remove the 'ORDER BY'
		}
		if($args->limit && $args->limit->count){
			$query .= ' LIMIT ';
			if($args->limit->start) $query .= '%4$d,';
			$query .= '%5$d ';
		}
		
		$results = $this->db->query($query, $args->parentID, $args->name, $args->tags, $args->limit->start, $args->limit->count);
		if(!$results) return false;
		
		return $results;
	}
	
	/**	Get Post:  returns a post.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyPostID	The ID of the post. (required)
	*/
	function getPost(){
		$this->_returnAjaxObj($this->_getPost($this->_getAjaxObj()));
	}
	function _getPost($args){
		if(!$this->_checkPermission('plugins','Posty','post','view')) return false;
		if(!$args->postyPostID) return false;
		
		$query = ' SELECT * '
		       . ' FROM bbplug_posty_posts pp '
			   . ' WHERE pp.postyPostID = %1$d ';
		$result = $this->db->query($query, $args->postyPostID);
		if(!$result) return false;
		
		return $result[0];
	}
	
	/**	Get Container:  returns a container.
	*
	*	@param	object	$args	a value object containing all the arguments.  possible values are as follows:
	*	$args->postyContainerID	The ID of the Container. (required)
	*/
	function getContainer(){
		$this->_returnAjaxObj($this->_getContainer($this->_getAjaxObj()));
	}
	function _getContainer($args){
		if(!$this->_checkPermission('plugins','Posty','container','view')) return false;
		if(!$args->postyContainerID) return false;
		
		$query = ' SELECT * '
		       . ' FROM bbplug_posty_containers pc '
			   . ' WHERE pc.postyContainerID = %1$d ';
		$result = $this->db->query($query, $args->postyContainerID);
		if(!$result) return false;
		
		return $result[0];
	}
}

?>