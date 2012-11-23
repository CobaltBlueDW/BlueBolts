/**	User:  This class holds info about the current user for use by the client side.
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
	BBC.User = function(infoObject){
		this.StorableConstructor(infoObject);
		this.UserConstructor();
	}

	//extends
	BBC.User.prototype = new BBC.Storable();

	//constructor declaration
	BBC.User.prototype.constructor = BBC.User;

	//static methods

	//memebers
	BBC.User.prototype.userID = -1;
	BBC.User.prototype.roleID = -1;
	BBC.User.prototype.accountID = -1;
	BBC.User.prototype.familyID = -1;
	BBC.User.prototype.userName = '';
	BBC.User.prototype.firstName = '';
	BBC.User.prototype.lastName = '';
	BBC.User.prototype.authTypeID = -1;
	BBC.User.prototype.birthDate = '';
	BBC.User.prototype.zipCode = '';
	BBC.User.prototype.preferences = null;
	BBC.User.prototype.permissions = null;
	BBC.User.prototype.accounts = null;
	
	BBC.User.prototype.isReady = false;
	BBC.User.prototype.toCall = null;

	//private members (please don't access?)

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.User.prototype.UserConstructor = function(){
		this.getUserInfo();
	}
	
	BBC.User.prototype.checkPermission = function(){
		if(!this.permissions) return false;
		
		names = arguments;
		var path = this.permissions;
		for(var i=0; i<names.length; i++){
			if(path === true || path['all'] === true) return true;
			if(!(path instanceof Object)) return false;
			path = path[names[i]];
			if(!path) return false;
		}
		
		return path;
	}
	
	/**	Ready:  Execute callback functions when the User object is ready.
	*
	*/
	BBC.User.prototype.ready = function(callBack, context, params){
		if(!(callBack instanceof Function)) return this.isReady;
		if(!context) context = this;
		if(this.isReady){
			callBack.call(context, params);
			return true;
		}
		if(!(this.toCall instanceof Array)) this.toCall = new Array();
		this.toCall.push({callBack:callBack, context:context, params:params});
		
		return false;
	}
	
	/**	Get User Info:  retrieves basic user information from the server
	*
	*/
	BBC.User.prototype.getUserInfo = function(){
		var saveObj = new Object();
		
		var cur = this;
		var callBack = function(json){cur.cb_getUserInfo(json);};
		jQuery.ajax({
			url: ROOT_URL+'user/getUserInfo/',
			type: 'POST',
			contentType: 'application/x-json',
			processData: false,
			data: jQuery.json.encode(saveObj),
			success: callBack,
			dataType: 'json'
		});
	}
	BBC.User.prototype.cb_getUserInfo = function(json){
		this.parseInfo(json);
		this.isReady = true;
		if(this.toCall instanceof Array && this.toCall.length > 0){
			for(var i=0; i<this.toCall.length; i++){
				this.toCall[i]['callBack'].call(this.toCall[i]['context'],this.toCall[i]['params'])
			}
		}
	}
	
	//singleton esque
	BBC.User = new BBC.User();
})();