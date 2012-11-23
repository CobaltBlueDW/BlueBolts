/**	Receiver:  This class defines the behaviors of receivers (objects that can communicate using the InterComm)
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/

(function(){
	//declare namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	handle	ReceiverConstructor param
	*/
	BBC.Receiver = function(handle){
		this.ReceiverConstructor(handle);
	};
	
	//extends from Object
	BBC.Receiver.prototype = new Object();

	//constructor declaration
	BBC.Receiver.prototype.constructor = BBC.Receiver;

	//static methods
	
	//memebers
	BBC.Receiver.prototype.handle = '';

	//methods
	
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.Receiver.prototype.ReceiverConstructor = function(handle){
		if(!handle) handle = 'receiver';
		this.handle = BBC.InterComm.forceRegister(this, handle);
	}
	
	//////////////////////////
	//	Receiver Functions	//
	//////////////////////////
	/**	Channel Input:  interface function	*/
	BBC.Receiver.prototype.channelInput = function(from, name, message, tags){
		//ignore
		return false;
	}
	
	/**	Message Input:  interface function	*/
	BBC.Receiver.prototype.messageInput = function(from, message, tags){
		//ignore
		return false;
	}
	
	/**	Command Input:  interface function	*/
	BBC.Receiver.prototype.commandInput = function(from, command, valueObject){
		//ignore
		return false;
	}
	
	/**	Get Handle:  interface function	*/
	BBC.Receiver.prototype.getHandle = function(){
		return this.handle;
	}

})();