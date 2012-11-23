/**	Storable:  This class defines base behavior for classes that get loaded from a DB or from other
*	locations with variable un-known parameters.
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/

(function(){
	//declare namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	object	infoObject	StorableConstructor param
	*/
	BBC.Storable = function(infoObject){
		this.StorableConstructor(infoObject);
	};
	
	//extends from Object
	BBC.Storable.prototype = new Object();

	//constructor declaration
	BBC.Storable.prototype.constructor = BBC.Storable;

	//static methods
	
	//memebers

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.Storable.prototype.StorableConstructor = function(infoObject){
		if(!infoObject) infoObject = new Object();
		this.parseInfo(infoObject);
	}
		
	//private methods (please don't call?)
	/**	Parse Info:  used to interogate widget specific paramater object, and populate member variables.
	*
	*	@param	Object	infoObject	an associative list of variables to parse through
	*/
	BBC.Storable.prototype.parseInfo = function(infoObject){
		if(!infoObject) return false;
		for(var key in infoObject){
			if(infoObject[key] && infoObject[key].indexOf instanceof Function && infoObject[key].length > 1){ 
				try{
					infoObject[key] = jQuery.json.decode(infoObject[key]);
				}catch(e){
					error(e);
				}
			}
			this[key] = infoObject[key];
		}
	}

})();