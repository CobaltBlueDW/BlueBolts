/**	InterComm:  A method for exchanging information between objects
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/

(function(){
	//declare namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*/
	BBC.InterComm = function(){
		this.register(this, this.getHandle());
		this.createChannel(this.regChanID);
		this.createChannel(this.allChanID);
		this.createChannel(this.errorChanID);
	};
	
	//extends from Object
	BBC.InterComm.prototype = new Object();

	//constructor declaration
	BBC.InterComm.prototype.constructor = BBC.InterComm;

	//memebers
	BBC.InterComm.prototype.addressBook = {};			//registered (handle, reference) pairs
	BBC.InterComm.prototype.channels = {};				//channel arrays consisting of subscribed object reference
	BBC.InterComm.prototype.regChanID = 'registration';	//The channel name for registration broadcasts
	BBC.InterComm.prototype.allChanID = 'all';			//The channel name for addressing all registered objects
	BBC.InterComm.prototype.errorChanID = 'errors';		//The channel name for error messages

	//private members (please don't access?)

	//methods
	
	//////////////////////////////////////
	//	Inter-Object Casting methods	//
	//////////////////////////////////////
	
	/**	Register:  Gives an object a handle and stores that handle and associated
	*	object reference, to that messages can be sent to the object by other objects
	*	using the functions of this class, and a set of interface functions.
	*
	*	@param	Object	listener		The actual object to register
	*	@param	String	as				The handle/name the object wants to go by
	*	@param	Boolean	publicListing	Whether or not to get messages broadcast to the registery
	*	@return	String					The handle on success, and false otherwise.
	*/
	BBC.InterComm.prototype.register = function(listener, as, publicListing){
		if(this.addressBook[as]) return false;
		this.addressBook[as] = listener;
		
		if(publicListing || publicListing == undefined) this.subscribeTo(this.allChanID, listener);
		
		this.sendToChannel(this.regChanID, this.getHandle(), as, 'add success');
		return as;
	}
	
	/**	Force Register:  Same as register, but if the requested handle is taken
	*	instead of returning false, appends a number to the handle, registers that,
	*	and returns it.
	*
	*	@param	Object	listener	The actual object to register
	*	@param	String	as			The handle/name the object wants to go by
	*	@return	String				The handle.
	*/
	BBC.InterComm.prototype.forceRegister = function(listener, as){
		var result = '';
		if(result = this.register(listener, as)) return result;
		var num = 0;
		while(true){
			if(result = this.register(listener, as+'('+num+')')) return result;
			num++;
		}
	}
	
	/**	Remove Registration:  Removes an object from the list of registered objects.
	*
	*	@param	Object	listener	The actual object to un-register
	*	@param	String	as			The handle/name of the object
	*	@return	Boolean				True on success, and false otherwise.
	*/
	BBC.InterComm.prototype.removeRegistration = function(listener, as){
		if(!this.addressBook[as]) return false;
		if(this.addressBook[as] != listener) return false;
		this.addressBook[as] = null;
		
		this.sendToChannel(this.regChanID, this.getHandle(), as, 'remove success');
		return true;
	}
	
	/**	Get Registration List:  returns a list of all registered objects
	*
	*	@return	Array		A list of string names of registered objects
	*/
	BBC.InterComm.prototype.getRegistrationList = function(){
		var temp = new Array();
		for(var key in this.addressBook){
			temp.push(key);
		}
		
		return temp;
	}
	
	/**	Send To:  Sends a message to a registered object
	*
	*	@param	String	to		The handle of the object to send a message to
	*	@param	String	from	The handle of the sender
	*	@param	Object	message	The information being sent (which can be just about anything)
	*	@param	String	tags	A list of space-seperated words, to indicate 
	*							purpose, helpful for routing of messages
	*	@return Object			False on failure, or the return from the recipient
	*/
	BBC.InterComm.prototype.sendTo = function(to, from, message, tags){
		if(!this.addressBook[to]) return false;
		if(!tags) tags = '';
		
		if(tags.substr instanceof Function) tags = tags.split(' ');
		if(tags instanceof Array){
			var hashTags = new Object();
			for(var i=0; i < tags.length; i++){
				hashTags[tags[i]] = true;
			}
			tags = hashTags;
		}
		
		var result = false;
		try{
			result = this.addressBook[to].messageInput(from, message, tags)?true:false;
		}catch(error){
			//pevent infinite loops
			this.sendToChannel(this.errorChanID, this.getHandle(), error, 'sendTo messageInput');
			result = false;
		}
		
		return result;
	}
	
	/**	Command To:  Sends a command request to a registered object.
	*
	*	@param	String	to			The handle of the object to send a message to
	*	@param	String	from		The handle of the sender
	*	@param	String	command		The name of a command. e.g. 'getNameByUserID' or 'mkdir'
	*	@param	Object	valueObject	An associative list of arguements to send with the command/function
	*	@return Object				False on failure, or the return from the command/function
	*/
	BBC.InterComm.prototype.commandTo = function(to, from, command, valueObject){
		if(!this.addressBook[to]) return false;
		
		var result = false;
		try{
			result = this.addressBook[to].commandInput(from, command, valueObject);
		}catch(error){
			//pevent infinite loops
			this.sendToChannel(this.errorChanID, this.getHandle(), error, 'commandTo commandInput');
			result = false;
		}
		
		return result;
	}
	
	/**	Is Registered:  Returns whether or not a name is already registered to someone.
	*
	*	@param	String	name	The handle to check on
	*	@return Boolean			True on existance, or False otherwise
	*/
	BBC.InterComm.prototype.isRegistered = function(name){
		if(!this.addressBook[name]) return false;
		
		return true;
	}
	
	/**	Reverse Look-Up:  returns the handle of a given object reference
	*
	*	Note:  There is no plain 'lookUp' function, because it would be a poor
	*	programming practice.  Like a violation of privacy, that would be a
	*	violation of the communication system.  In constrast, if you already
	*	know who the object is, it is okay to give-out thier handle. (interfacing
	*	through a handle is a more secure method than through a reference)
	*
	*	@param	Object	listener	The object to get the handle of
	*	@return String				The name on existance, or False otherwise
	*/
	BBC.InterComm.prototype.reverseLookUp = function(listener){
		var name = null;
		for(var key in this.addressBook){
			if(this.addressBook[key]) name = key;
		}
		
		return name;
	}
	
	//////////////////////////////
	//	Broadcasting methods	//
	//////////////////////////////
	/**	Create Channel:  creates a channel to be broadcast to.
	*
	*	Note:  Channels are forced to all lower case.
	*
	*	Note:  This function is mostly un-nessesary, since simply trying to subscribe to an 
	*	absent channel will create it.
	*
	*	@param	String	name		The name of the channel to create
	*	@return String				False on failure, or the name of the channel otherwise.
	*/
	BBC.InterComm.prototype.createChannel = function(name){
		name = name.toLowerCase();
		if(this.channels[name]) return false;
		this.channels[name] = new Array();
		
		return name;
	}
	
	/*  Not needed and potential hazardous
	BBC.InterComm.prototype.removeChannel = function(name){
		name = name.toLowerCase();
		if(!this.channels[name]) return false;
		this.channels[name] = null;
		return true;
	}*/
	
	/**	Get Channel List:  returns a list of all channels
	*
	*	@return	Array		A list of string names of channels
	*/
	BBC.InterComm.prototype.getChannelList = function(){
		var temp = new Array();
		for(var key in this.channels){
			temp.push(key);
		}
		
		return temp;
	}
	
	/**	Subscribe To:  affiliates an object with a channel so that all messages sent over
	*	the channel get sent to the object.
	*
	*	@param	String	name		The name of the channel
	*	@param	Object	listener	The object to subscribe to the channel
	*	@return String				The name of the channel on success, or False otherwise
	*/
	BBC.InterComm.prototype.subscribeTo = function(name, listener){
		name = name.toLowerCase();
		if(!this.channels[name]) this.createChannel(name);
		for(var i=0; i<this.channels[name].length; i++){
			if(this.channels[name][i] == listener) return false;
		}
		
		//alert('Name:'+name+', To:'+this.channels[name].length+', Object:'+listener);
		this.channels[name].push(listener);
		return name;
	}
	
	/**	Unsubscribe From:  removes an object from the metaphoric mailing-list
	*
	*	@param	String	name		The name of the channel to unsubscribe from
	*	@param	Object	listener	The object to unsubscribe
	*	@return String				The name of the channel on success, or False otherwise
	*/
	BBC.InterComm.prototype.unsubscribeFrom = function(name, listener){
		name = name.toLowerCase();
		if(!this.channels[name]) return false;
		for(var i=0; i<this.channels[name].length; i++){
			if(this.channels[name][i] == listener){
				this.channels[name].slice(i,1);
				return name;
			}
		}
		
		return false;
	}
	
	/**	Send To Channel:  broadcasts a message to all objects listening to the channel
	*
	*	@param	String	name		The name of the channel to broadcast to
	*	@param	String	from		The name/handle of the object broadcasting the message
	*	@param	Object	message		The information being sent (which can be just about anything)
	*	@param	String	tags		A list of space-seperated words, to indicate 
	*								purpose, helpful for routing of messages within recipient
	*	@return Boolean				True on success, or False otherwise
	*/
	BBC.InterComm.prototype.sendToChannel = function(name, from, message, tags){
		name = name.toLowerCase();
		if(!this.channels[name]) return false;
		if(!tags) tags = '';
		
		if(tags.substr instanceof Function) tags = tags.split(' ');
		if(tags instanceof Array){
			var hashTags = new Object();
			for(var i=0; i < tags.length; i++){
				hashTags[tags[i]] = true;
			}
			tags = hashTags;
		}
		
		for(var i=0; i<this.channels[name].length; i++){
			//alert('Name:'+name+', To:'+i+', Object:'+this.channels[name][i]);
			try{
				this.channels[name][i].channelInput(from, name, message, tags);
			}catch(error){
				//pevent infinite loops
				if(name!=this.errorChanID) this.sendToChannel(this.errorChanID, this.getHandle(), error, 'sendToChannel channelInput');
			}
		}
		
		return true;
	}
	
	//////////////////////////
	//	Receiver Functions	//
	//////////////////////////
	/**	Channel Input:  called when a message is braodcast over a channel that has been subscribed to
	*
	*	@param	String	from		The name/handle of the object broadcasting the message
	*	@param	String	name		The name of the channel broadcast to
	*	@param	Object	message		The information being sent (which can be just about anything)
	*	@param	String	tags		A list of space-seperated words, to indicate 
	*								purpose, helpful for routing of messages within recipient
	*	@return Boolean				True on use, or False otherwise.  By use I mean, your object 
	*								properly routed the message, and found the message useful in some way
	*/
	BBC.InterComm.prototype.channelInput = function(from, name, message, tags){
		//ignore
		return false;
	}
	
	/**	Message Input:  called when a message is sent directly to an object
	*
	*	@param	String	from		The name/handle of the object broadcasting the message
	*	@param	Object	message		The information being sent (which can be just about anything)
	*	@param	String	tags		A list of space-seperated words, to indicate 
	*								purpose, helpful for routing of messages within recipient
	*	@return Boolean				True on use, or False otherwise.  By use I mean, your object 
	*								properly routed the message, and found the message useful in some way
	*/
	BBC.InterComm.prototype.messageInput = function(from, message, tags){
		//ignore
		return false;
	}
	
	/**	Command Input:  called when a command request is sent directly to an object
	*
	*	@param	String	from		The name/handle of the object broadcasting the message
	*	@param	String	command		The name/indicator of the command/function to requesting execution
	*	@param	Object	valueObject	An associative list of arguements being sent with the command/function
	*	@return Object				False on failure, or the return from the command/function
	*/
	BBC.InterComm.prototype.commandInput = function(from, command, valueObject){
		//ignore
		return false;
	}
	
	/**	Get Handle:  used to directly obtain the name/handle an object is currently going by
	*
	*	@return String				The name/handle of the object if exists, or False otherwise
	*/
	BBC.InterComm.prototype.getHandle = function(){
		return 'InterComm';
	}
	
	//private methods (please don't call?)
	
	//singleton behavior
	BBC.InterComm = new BBC.InterComm();
})();