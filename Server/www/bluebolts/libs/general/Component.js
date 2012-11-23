/**	Component:  The base class for all Component; a general, non-user-specific, 
*	non-situatinonal element of a page.
*
*	@author		David Wipperfurth
*	@group		BlueBoltCore
*	@dated		7/27/09
*	@updated	9/17/09
*	@version	0.3
*/
(function(){
	//Declare Namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*	@param	object	infoObject	StorableConstructor param
	*/
	BBC.Component = function(containerID, infoObject){
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ComponentConstructor();
	}

	//extends
	BBC.Component.prototype = join(new BBC.Renderable(), new BBC.Storable());

	//constructor declaration
	BBC.Component.prototype.constructor = BBC.Component;

	//static methods
	BBC.Component.newComponent = function(className, containerID, infoObject){
		//alert('new BBC.'+className+'(containerID, infoObject)');
		var Component = eval('new '+className+'(containerID, infoObject)');
		return Component;
	}

	//memebers

	//private members (please don't access?)

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.Component.prototype.ComponentConstructor = function(){
		
	}
	
	/** Save:  Saves Component specific data
	*
	*	@param	Object	data	Value object to save for this component
	*/
	BBC.Component.prototype.save = function(data){
		var cur = this;
		var callBack = function(json){cur.cb_save(json);};
		var args = new Object();
		args.instanceID = this.componentBlockID;
		args.args = data;
		
		jQuery.ajax({
			url: '/component/save',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	BBC.Component.prototype.cb_save = function(result){
		//todo
	}
	
	//private methods (please don't call?)
	
})();