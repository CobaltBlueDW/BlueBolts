/**	JavaScriptExtensions:  A set of functions to extend the functionality of
*	Javascript to make it closer to a full featured language.
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/

//Not in a namespace
var ERROR_ALERT_LEVEL = 1;
var ERROR_THROW_LEVEL = 100;

var Scripts = {};
/**	Script Info:  An object used to load and monitor the loading of dynamically loaded JavaScript files
*/
ScriptInfo = function(scriptPath, loadWaitTime){
	var self = this;
	this.loaded = false;
	this.respondList = [];
	this.location = scriptPath;
	this.callAll = function(){
		for(var i=0; i<this.respondList.length; i++){
			this.respondList[i](self);
		}
	}
	this.DOM = document.createElement('script');
	this.DOM.parent = this;
	this.DOM.setAttribute('type', 'text/javascript');
	this.DOM.setAttribute('src', scriptPath);
	this.DOM.onreadystatechange = function(){
		//alert(this.readyState);
        if(this.readyState == 'complete' || this.readyState == 'loaded'){
			clearTimeout(this.parent.clock);
			this.parent.loaded = true;
			this.onreadystatechange = null;
			this.onload = null;
			this.parent.timeOut = null;
			this.parent.callAll();
        }
    }
    this.DOM.onload = function(){
		//alert('onload called');
		clearTimeout(this.parent.clock);
        this.parent.loaded = true;
		this.onreadystatechange = null;
		this.onload = null;
		this.parent.timeOut = null;
		this.parent.callAll();
    }
	this.timeOut = function(){
		//alert('timeOut called');
		self.loaded = "true";	//air quotes ;)		Note: if(loaded) will be true, but if(loaded==true) will be false
		self.DOM.onreadystatechange = null;
		self.DOM.onload = null;
		self.timeOut = null;
		self.callAll();
	}
	if(!loadWaitTime) loadWaitTime = 5000;	//5 seconds
	this.clock = setTimeout(this.timeOut, loadWaitTime);
}

/**	Create Name Space:  Attempts to create a new namespace of the given path.
*	The difference between this and 'NameSpace' is this function returns false
*	if the namespace already exists.
*	Note: If part of the namespace already exists. e.g. if 'cooking' (for example) 
*	already exists, but 'cooking.units' and 'cooking.units.cups' do not, the call
*	"createNameSpace('cooking.units.cups')" would create the 'units' and 'cups' sub-domains
*	and return a reference to the deepest namespace, 'cooking.units.cups'.
*
*	@param	string	path	A period delimited class/namespace path to create. e.g. 'cooking.units.cups'
*	@return	object			A reference to the namespace if created, and False, if namespace already exists.
*/
function createNameSpace(path){
	if(!path) throw new Exception('function "createNameSpace" requires at least 1 argument "path".');
	var path = path.split(".");
	var curNS = window;
	var unDef = true;

	for(var i=0; i<path.length; i++){
		if(typeof curNS[path[i]] == "undefined"){
			curNS[path[i]] = new Object();
		}else{
			unDef = false;
		}
		curNS = curNS[path[i]];
	}
	
	if(unDef){
		return curNS;
	}else{
		return false;
	}
}

/**	Get Name Space:  Finds and returns a namespace if it exists.
*
*	@param	string	path	A period delimiter class/namespace path to aquire. e.g. 'cooking.units.cups'
*	@return	object			A reference to the namespace if found, and False, if namespace does not exist.
*/
function getNameSpace(path){
	if(!path) throw new Exception('function "getNameSpace" requires at least 1 argument "path".');
	var path = path.split(".");
	var curNS = window;

	for(var i=0; i<path.length; i++){
		if(typeof curNS[path[i]] != "undefined"){
			curNS = curNS[path[i]];
		}else{
			return false;
		}
	}
	
	return curNS;
}

/**	Name Space:  returns the given namespace.  If it doesn't exist it creates it.
*
*	@param	string	path	A period delimiter class/namespace path to create. e.g. 'cooking.units.cups'
*	@return	object			A reference to the namespace if created, and False, if namespace already exists.
*/
function NameSpace(path){
	if(!path) throw new Exception('function "NameSpace" requires at least 1 argument "path".');
	var path = path.split(".");
	var curNS = window;

	for(var i=0; i<path.length; i++){
		if(typeof curNS[path[i]] == "undefined"){
			//alert(path[i]);
			curNS[path[i]] = new Object();
		}
		curNS = curNS[path[i]];
	}
	
	return curNS;
}

/**	Include:  Adds a JavaScript file/library to the page.  Appends it whether it's
*	already been added or not, just like with PHP's include()/require().
*
*	@param	string	scriptPath	The path/fileName of the JavaScript file to include
*/
function include(scriptPath, callBack){
	if(!scriptPath) throw new Exception('function "include" requires at least 1 argument "scriptPath".');
	var id = scriptPath.toLowerCase();
	
	if(Scripts[id] && !Scripts[id].loaded){
		if(callBack) Scripts[id].respondList.push(callBack);
		return false;
	}

	var headTag = document.getElementsByTagName('head').item(0);
	
	var newScript = new ScriptInfo(scriptPath);
	if(callBack) newScript.respondList.push(callBack);
	Scripts[id] = newScript;
	
	headTag.appendChild(newScript.DOM);
	
	return newScript;
}

/**	Include Once:  Adds a JavaScript file/library to the page.  Appends it ONLY IF it's
*	not already included in the header, just like with PHP's include_once()/require_once().
*
*	@param	string	scriptPath	The path/fileName of the JavaScript file to include
*/
function include_once(scriptPath, callBack){
	if(!scriptPath) throw new Exception('function "include_once" requires at least 1 argument "scriptPath".');
	var id = scriptPath.toLowerCase();
	
	if(Scripts[id]){
		if(Scripts[id].loaded == true){
			if(callBack) callBack(Scripts[id]);
		}else{
			if(callBack) Scripts[id].respondList.push(callBack);
		}
		return false;
	}

	var headTag = document.getElementsByTagName('head').item(0);
	
	var newScript = new ScriptInfo(scriptPath);
	if(callBack) newScript.respondList.push(callBack);
	Scripts[id] = newScript;
	
	headTag.appendChild(newScript.DOM);
	
	return newScript;
}

/** Join:  Takes a list of Objects and returns a single object consisting of all elements of given objects
*	They are joined in the oder given, so if 2 objects have the same element, the one that appears later 
*	in the list will be the one that appears in the returned object.
*	This function can be usefull for making one object extend from multiple other objects, or joining associative arrays
*
*	@param	variable	objects		Either a list of parameters that are all objects, or a single array of objects
*	@return Object					An Object made-up of all elements of all given parameter objects
*/
function join(objects){
	if(arguments.length == 0) return false;
	var objs = arguments;
	if(arguments.length == 1 && objects instanceof Array) objs = objects;
	
	var newObj = new Object();
	for(var i=0; i<objs.length; i++){
		for(var key in objs[i]){
			newObj[key] = objs[i][key];
		}
	}
	
	return newObj;
}

/**	Error:  Used to voice an error message to the screen/log/etc.
*
*/
function error(message, level, from){
	
	if(!message) return false;
	if(!level) level = 0;
	if(message instanceof Error){
		var temp = '';
		for(var key in message){
			temp += message[key]+"\n";
		}
		message = temp;
	}
	if(!from) from = this;
	
	if(ERROR_ALERT_LEVEL <= level) alert(message);
	if(ERROR_THROW_LEVEL <= level) throw(message);
}

Date.prototype.toTimeStamp = function(){
	return this.getFullYear()+"-"+ String(100+this.getMonth()+1).substr(1)+"-"+String(100+this.getDate()).substr(1)+' '+String(100+this.getHours()).substr(1)+':'+String(100+this.getMinutes()).substr(1)+':'+String(100+this.getSeconds()).substr(1);
}
Date.fromTimeStamp = function(timestamp){
	if(timestamp.substr(4,1) != '-') return new Date(timestamp);
	return new Date(Date.parse(timestamp.substr(8,2)+' '+timestamp.substr(5,2)+' '+timestamp.substr(0,4)+' '+timestamp.substr(11,8)));
}

Array.prototype.toObject = function(){
	var out = {};
	for(var i=0; i<this.length; i++){
		out[i] = this[i];
	}
	return out;
}

/* Object.prototype.toString = function(chain){
	if(!chain) chain = [this];
	if(chain.indexOf(this)) return "...";
	chain.push(this);
	var str = '{';
	for(var key in this){
		if(!this[key]){
			str += '"'+key+'":'+this[key]+', ';
		}else if(this[key].substring instanceof Function){
			str += '"'+key+'":"'+this[key].toString()+'", ';
		}else if(this[key].toString == this.toString){
			//alert(str);
			str += '"'+key+'":'+this[key].toString(chain)+', ';
		}else{
			str += '"'+key+'":'+this[key].toString()+', ';
		}
	}
	str = str.substring(0, str.length-2);
	str += '}';
	
	return str;
} */

function setCookie(c_name,value,expiredays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=");
		if (c_start!=-1){
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		}
	}
	return "";
}

function swap(a,b){
	var temp = a;
	a = b;
	b = temp;
}
