/**	ContentBlock:  The base class for all Content Blocks, a manager of a 
*	section of content on a page.
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/
(function(){
	//Declare Namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*	@param	object	infoObject	StorableConstructor param
	*/
	BBC.ContentBlock = function(containerID, infoObject){
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ContentBlockConstructor();
	}

	//extends
	BBC.ContentBlock.prototype = join(new BBC.Renderable(), new BBC.Storable());

	//constructor declaration
	BBC.ContentBlock.prototype.constructor = BBC.ContentBlock;

	//static methods
	BBC.ContentBlock.newBlock = function(className, containerID, infoObject){
		//alert('new '+className+'(containerID, infoObject)');
		var navBlock = eval('new '+className+'(containerID, infoObject)');
		//alert(navBlock);
		return navBlock;
	}

	//memebers

	//private members (please don't access?)

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.ContentBlock.prototype.ContentBlockConstructor = function(){
	
	}
	
	/** Save:  Saves instance specific data for a ContentBlock
	*
	*	@param	Object	data	Value object to save for this ContentBlock
	*/
	BBC.ContentBlock.prototype.save = function(data){
		var cur = this;
		var callBack = function(json){cur.cb_save(json);};
		var args = new Object();
		args.instanceID = this.contentBlockInstanceID;
		args.args = data;
		
		jQuery.ajax({
			url: '/contentblock/save',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	BBC.ContentBlock.prototype.cb_save = function(result){
		//todo
	}
	
	//private methods (please don't call?)
	
})();