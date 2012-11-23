/**	Login Component:  This class creates a small login/logout form
*
*	@author		David Wipperfurth
*	@group		BlueSolutions
*	@dated		2010-05-22
*/
(function(){
	//Declare Namespace
	var BBC = NameSpace('BlueBoltCore');
	var P = NameSpace('Plugins.LoginComp');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*	@param	object	infoObject	StorableConstructor param
	*/
	P.LoginComp = function(containerID, infoObject){
		this.ReceiverConstructor('LoginComp');
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ComponentConstructor();
		this.LoginCompConstructor();
	}

	//extends
	P.LoginComp.prototype = join(new BBC.Receiver(), new BBC.Component());

	//constructor declaration
	P.LoginComp.prototype.constructor = P.LoginComp;

	//static methods

	//memebers
	P.LoginComp.prototype.classes = '';
	P.LoginComp.prototype.redirect = ROOT_URL+'page/load/home';
	
	//private members (please don't access?)

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	P.LoginComp.prototype.LoginCompConstructor = function(){
		this.content = this.genLogin();
		BBC.User.ready(this.checkUserType, this);
		
		//alert(this.content);
		
		var pageAssoc = window.location.pathname.split('/').pop();
		if(pageAssoc!='' && pageAssoc!='login') this.redirect = ROOT_URL+'page/load/'+pageAssoc;
	}
	
	P.LoginComp.prototype.checkUserType = function(){
		if(BBC.User.roleID > 1){
			this.content = this.genLogout();
			this.render();
		}
	}
	
	P.LoginComp.prototype.logUserIn = function(userName, password, submit){
		var cur = this;
		var callBack = function(json){ cur.cb_logUserIn(json) };
		var args = new Object();
		args.userName = userName.find('input').val();
		args.password = password.find('input').val();
		
		//alert(jQuery.json.encode(args));
		
		jQuery.ajax({
			url: ROOT_URL+'account/logUserIn',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.LoginComp.prototype.cb_logUserIn = function(json){
		if(!json || json.error){
			//alert(this.redirect);
			jQuery(this.container+' .bbp-lic-error').show();
		}else{
			window.location = this.redirect;
		}
	}
	
	P.LoginComp.prototype.parseInfo = function(infoObject){
		if(!infoObject) return false;
		if(!infoObject.parameters) return false;
		var params = jQuery.json.decode(infoObject.parameters);
		
		if(params.classes) this.classes = params.classes;
	}
	
	P.LoginComp.prototype.genLogin = function(){
		var container = jQuery("<div class='rowItem "+this.classes+"'></div>");
		var form = jQuery("<form action=''></form>").appendTo(container);
		var userName = jQuery("<div>Username: <input type='text' name='userName' /></div>").appendTo(form);
		var password = jQuery("<div>Password: <input type='password' name='password' /></div>").appendTo(form); 
		var errorMessage = jQuery("<div class='bbp-lic-error-box'></div>");
		var error = jQuery("<span class='bbp-lic-error'>Invalid username or password</span>").hide();
		errorMessage.append(error);
		errorMessage.appendTo(form);
		var submit = jQuery("<div><input style='font-family:inherit;font-size:inherit;' class='bbp-lic-login ui-state-default ui-corner-all' type='submit' name='bbp-lic-login' value='login' /></div>").appendTo(form);
		var cur = this;
		form.submit(function(e){ cur.logUserIn(userName, password, this); return false;});
		jQuery.createButton({name:'bbp-lic-register',contents:"<span style='padding:2px 4px;'>Register</span>",action:function(){window.location = ROOT_URL+'page/load/register'}}).appendTo(submit);
		
		return container;
	}
	
	P.LoginComp.prototype.genLogout = function(){
		var container = jQuery("<div class='rowItem "+this.classes+"'></div>");
		jQuery("<div>Hello, "+BBC.User.userName+"</div>").appendTo(container);
		jQuery("<div><a href='"+ROOT_URL+'account/logout'+"'>logout</a></div>").appendTo(container);
		//jQuery.createButton({name:'bbp-lic-logout',contents:"<span style='padding:2px 4px;'>Logout</span>",action:function(){window.location = ROOT_URL+'account/logout';}}).appendTo(container);
		
		return container;
	}
	
})();