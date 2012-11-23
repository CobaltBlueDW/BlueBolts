/**	Login Component:  This class creates a small login/logout form
*
*	@author		David Wipperfurth
*	@group		BlueSolutions
*	@dated		2010-05-22
*/
(function(){
	//Declare Namespace
	var BBC = NameSpace('BlueBoltCore');
	var P = NameSpace('Plugins.Registrar');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*	@param	object	infoObject	StorableConstructor param
	*/
	P.Registrar = function(containerID, infoObject){
		this.ReceiverConstructor('Registrar');
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ComponentConstructor();
		this.RegistrarConstructor();
	}

	//extends
	P.Registrar.prototype = join(new BBC.Receiver(), new BBC.Component());

	//constructor declaration
	P.Registrar.prototype.constructor = P.Registrar;

	//static methods

	//memebers
	P.Registrar.prototype.classes = '';
	P.Registrar.prototype.redirect = ROOT_URL+'page/load/login';
	
	//private members (please don't access?)

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	P.Registrar.prototype.RegistrarConstructor = function(){
		this.content = this.genContent();
		//alert(this.content);
		var pageAssoc = window.location.pathname.split('/').pop();
		if(pageAssoc!='' && pageAssoc!='register') this.redirect = ROOT_URL+'page/load/'+pageAssoc;
	}
	
	P.Registrar.prototype.registerUser = function(userName, password, password2, email, submit){
		var cur = this;
		var callBack = function(json){ cur.cb_registerUser(json) };
		var args = new Object();
		args.userName = userName.find('input').val();
		args.email = email.find('input').val();
		args.password = password.find('input').val();
		args.password2 = password2.find('input').val();
		
		//alert(jQuery.json.encode(args));
		
		jQuery.ajax({
			url: ROOT_URL+'account/createUser',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.Registrar.prototype.cb_registerUser = function(json){
		if(!json || json.error){
			//alert(this.redirect);
			jQuery(this.container+' .bbp-lic-error').show();
		}else{
			window.location = this.redirect;
		}
	}
	
	P.Registrar.prototype.parseInfo = function(infoObject){
		if(!infoObject) return false;
		if(!infoObject.parameters) return false;
		var params = jQuery.json.decode(infoObject.parameters);
		
		if(params.classes) this.classes = params.classes;
	}
	
	P.Registrar.prototype.genContent = function(){
		var container = jQuery("<div class='rowItem "+this.classes+"'></div>");
		var form = jQuery("<form action=''></form>").appendTo(container);
		var userName = jQuery("<div>Username: <input type='text' name='userName' /></div>").appendTo(form);
		var email = jQuery("<div>Email(opt.): <input type='text' name='email' /></div>").appendTo(form);
		var password = jQuery("<div>Password: <input type='password' name='password' /></div>").appendTo(form); 
		var password2 = jQuery("<div>Re-Password: <input type='password' name='password2' /></div>").appendTo(form); 
		var errorMessage = jQuery("<div class='bbp-lic-error-box'></div>");
		var error = jQuery("<span class='bbp-lic-error'>Invalid username or password</span>").hide();
		errorMessage.append(error);
		errorMessage.appendTo(form);
		var submit = jQuery("<div><input style='font-family:inherit;font-size:inherit;' class='bbp-lic-login ui-state-default ui-corner-all' type='submit' name='bbp-lic-login' value='Register' /></div>").appendTo(form);
		var cur = this;
		form.submit(function(e){ cur.registerUser(userName, password, password2, email, this); return false;});
		
		return container;
	}
	
})();