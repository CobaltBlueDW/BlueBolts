/** jQuery Buttons:  A plugin for jQuery that makes the creation of jQuery-ui Themed buttons easy.
*	It currently supports regular buttons, toggle buttons, Drop-Down Menues, and Drop-Down Content.
*	Supports both functions for programmatic content construction and methods for behavior construction.
*
*	ToDo:
*	-[done]convert from parameter list to single value object
*	-[done]support jQuery contents
*	-[done]fix action inconsistancies
*	-[done]add standard events
*	-[done]layout bugs
*	-[done]fix browser specific inconsistancies
*	-[done]create better documentation
*	-[done]make method versions of the functions
*	-[done]add classing support
*	-[done]add styling support
*	-[done]add more input validation
*	-[done]add tooltip support
*	-[done]add animation support
*	-[done]add context support
*
*	@author		David Wipperfurth
*	@group		WellBe.me
*	@dated		7/20/09
*	@updated	2/22/10
*	@version	0.9
*/
(function(){	//scope for variable protection (likely not used, but still a good idea to use by default)
	/** Create Button:  produces the html/dom/javascript required for a jQuery UI Themed button
	*
	*	@example	jQuery.createButton({name:'button1', contents:'click me', action:function(e,p){alert(p+' clicked me!')}, param:'you'}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	action:(Function)		A function to be called on the click event
	*	context:(Object)		A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*	param:(Object)			An object to be passed to the action function
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createButton = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'button'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = args.name;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(args.action == undefined) args.action = true;
		
		//alert(args.name+' '+args.contents);
		if(args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' ' + args.classes;
		
		var button = jQuery("<span class='"+buttonClass+" ui-state-default ui-corner-all "+args.name+"'></span>");
		button.append(args.contents);
		if(args.css) button.css(args.css);
		if(args.tooltip) button.attr('title', args.tooltip);

		if(args.action){ 
			button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
			button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
			button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
			var callback = function(event){
				jQuery(this).trigger('button', event.data[0]);
				if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
			};
			button.bind('click', [args.name, args.context, args.action, args.param], callback);
		}
		
		return button;
	}
	/** To Button:  converts the currently selected DOM elements into jQuery UI Themed buttons
	*
	*	@example	jQuery('.my-button').toButton({name:'button1', action:function(e,p){alert(p+' clicked me!')}, param:'you'});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html.  Note: this will over-write the current contents.
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	action:(Function)		A function to be called on the click event
	*	context:(Object)		A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*	param:(Object)			An object to be passed to the action function
	*	@return jQuery			The original jQuery object
	*/
	jQuery.fn.toButton = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'button'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = null;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(args.action == undefined) args.action = true;
		
		//alert(args.name+' '+args.contents);
		if(!args.contents || args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' '+args.name+' ui-state-default ui-corner-all '+args.classes;
		this.each(function(){
			var button = jQuery(this);
			if(args.contents) button.html(args.contents);
			button.removeClass('jqb-disabled');
			button.addClass(buttonClass);
			if(args.css) button.css(args.css);
			if(args.tooltip) button.attr('title', args.tooltip);

			if(args.action){ 
				button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
				button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
				button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
				var callback = function(event){
					jQuery(this).trigger('button', event.data[0]);
					if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
				};
				button.bind('click', [args.name, args.context, args.action, args.param], callback);
			}
		});
		return this;
	}

	/** Create Toggle Button:  produces the html/dom/javascript required for a jQuery UI Themed toggle button
	*
	*	@example	jQuery.createToggleButton({name:'button2',contents:'press me',down:function(e){alert('I am down.')},up:function(e){alert('I am up.')}}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	down:(Function)			A function to be called on the down-toggle event
	*	up:(Function)			A function to be called on the up-toggle event
	*	context:(Object)		A context for which to call the up and down functions from. i.e. what the 'this' term will refer to in the functions.
	*	param:(Object)			An object to be passed to the up and down functions
	*	startDown:(Boolean)		If true, button starts in 'down' state.
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createToggleButton = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = args.name;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(args.down == undefined) args.down = true;
		if(args.up == undefined) args.up = true;
		
		//alert(args.name+' '+args.contents);
		if(args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' ' + args.classes;
		
		var button = jQuery("<span class='"+buttonClass+" ui-state-default ui-corner-all "+args.name+"'></span>");
		if(args.startDown){
			button.addClass('ui-state-active');
		}
		button.append(args.contents);
		if(args.css) button.css(args.css);
		if(args.tooltip) button.attr('title', args.tooltip);
		//button.val(null);
		
		if(args.down || args.up){ 
			button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
			var callback = function(event){
				var thisJ = jQuery(this);
				if(thisJ.hasClass('ui-state-active')){
					thisJ.removeClass('ui-state-active');
					jQuery(this).trigger('tButtonUp', event.data[0]);
					if(event.data[3] instanceof Function) event.data[3].call(event.data[1], event, event.data[4]);
				}else{
					thisJ.addClass('ui-state-active');
					jQuery(this).trigger('tButtonDown', event.data[0]);
					if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[4]);
				}
			};
			button.bind('click', [args.name, args.context, args.down, args.up, args.param], callback);
		}
		
		return button;
	}
	/** to Toggle Button:  converts the selected DOM elements into jQuery UI Themed toggle buttons
	*
	*	@example	jQuery('.my-toggle-button').toToggleButton({name:'button2',down:function(e){alert('I am down.')},up:function(e){alert('I am up.')}});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	down:(Function)			A function to be called on the down-toggle event
	*	up:(Function)			A function to be called on the up-toggle event
	*	context:(Object)		A context for which to call the up and down functions from. i.e. what the 'this' term will refer to in the functions.
	*	param:(Object)			An object to be passed to the up and down functions
	*	startDown:(Boolean)		If true, button starts in 'down' state.
	*	@return jQuery			The original jQuery object
	*/
	jQuery.fn.toToggleButton = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = null;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(args.down == undefined) args.down = true;
		if(args.up == undefined) args.up = true;
		
		//alert(args.name+' '+args.contents);
		if(!args.contents || args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' ui-state-default ui-corner-all ' + args.classes;
		
		this.each(function(){
			var button = jQuery(this);
			if(args.contents) button.html(args.contents);
			button.removeClass('jqb-disabled');
			button.addClass(buttonClass);
			if(args.css) button.css(args.css);
			if(args.tooltip) button.attr('title', args.tooltip);
			if(args.startDown) button.addClass('ui-state-active');

			if(args.down || args.up){ 
				button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
				var callback = function(event){
					var thisJ = jQuery(this);
					if(thisJ.hasClass('ui-state-active')){
						thisJ.removeClass('ui-state-active');
						jQuery(this).trigger('tButtonUp', event.data[0]);
						if(event.data[3] instanceof Function) event.data[3].call(event.data[1], event, event.data[4]);
					}else{
						thisJ.addClass('ui-state-active');
						jQuery(this).trigger('tButtonDown', event.data[0]);
						if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[4]);
					}
				};
				button.bind('click', [args.name, args.context, args.down, args.up, args.param], callback);
			}
		});
		
		return this;
	}
	

	/** Create Drop-Down Menu:  produces the html/dom/javascript required for a jQuery UI Themed drop-down menu button.
	*	When an option is selected from the drop-down list the ddSelect event will be triggered sending as the first arguement
	*	the 'name' of the option chosen.  Also, the function supplied by the action paramater will be triggered.
	*	If the action parameter for an option is set to false, the option will appear disabled, and won't be selectable.
	*
	*	@example	jQuery.createDDMenu({name:'button3',contents:'open me',list:[{name:'option1',label:'select me',icon:'ui-icon ui-icon-star',action:function(e,p){alert(p+' selected me!')},param:'you'}]}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	animation:(String)		The name of the jquery-ui animation to use for for opening the drop-down, or null/false for no animation
	*	list:(Array)			An array of menu option objects.
	*	Each menu option object can use the following parameters:
	*		name:(String)		A class and event name to give this button to be used as identification
	*		label:(String)		The options label.  default is the name field.
	*		classes:(String)	A extra classes to be applied to the item
	*		css:(Object)		A value object of CSS attributes to be added to the item
	*		icon:(String)		Class names applied to the icon area to generate an icon. e.g. 'ui-icon ui-icon-document'
	*		action:(Function)	A function to call when the option is selected.
	*		context:(Object)	A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*		param:(Object)		A value object to send to the action function
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createDDMenu = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'ddmbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = args.name;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.list) args.list = [
			{name:'new', icon:'ui-icon ui-icon-document'},
			{name:'open', icon:'ui-icon ui-icon-folder-open', action:function(){echo('opening')}},
			{name:'save', icon:'ui-icon ui-icon-disk', action:false},
			{name:'exit'}
		];
		
		//alert(args.name+' '+args.contents);
		if(args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' ' + args.classes;
		
		var container = jQuery("<span class='jqb-ddContainer "+args.name+"'></span>");
		
		var button = $jq("<span class='"+buttonClass+" ui-state-default ui-corner-all'></span>");
		button.append(args.contents);
		if(args.css) button.css(args.css);
		if(args.tooltip) button.attr('title', args.tooltip);

		button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
		button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
		button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
		
		//make body
		var ddPanel = $jq("<ul class='jqb-ddMenu ui-widget-content ui-corner-bottom ui-corner-tr'></ul>");
		for(var i=0;i<args.list.length;i++){
			if(!args.list[i].name || !args.list[i].name.indexOf) args.list[i].name = 'default';
			if(!args.list[i].label || !args.list[i].label.indexOf) args.list[i].label = args.list[i].name;
			if(!args.list[i].classes || !args.list[i].classes.indexOf) args.list[i].classes = '';
			if(!args.list[i].icon || !args.list[i].icon.indexOf) args.list[i].icon = '';
			if(args.list[i].action == undefined) args.list[i].action = true;
			if(args.list[i].action === false) args.list[i].classes += ' jqb-disabled';
			
			var item = jQuery("<li style='font-weight:normal;border: none;' class='gk-ddMenuItem "+args.list[i].classes+"'><span style='width:16px;height:16px;display:inline-block;overflow:hidden;' class='jqb-icon "+args.list[i].icon+"'></span>&nbsp;<span>"+args.list[i].label+"</span></li>");
			if(args.list[i].css) item.css(args.list[i].css);
			
			if(args.list[i].action){
				item.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
				
				var callback = function(event){
					jQuery(this).parent().parent().trigger('ddSelect', event.data[0]);
					jQuery(this).parent().hide(args.animation);
					jQuery(this).removeClass('ui-state-hover');
					if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
				};
				item.bind('click', [args.list[i].name, args.list[i].context, args.list[i].action, args.list[i].param], callback);
			}
			
			ddPanel.append(item);
		}
		ddPanel.hide();
		
		var callback = function(event){ jQuery(this).next().toggle(args.animation); };
		button.click(callback);
		
		container.append(button);
		container.append(ddPanel);
		
		return container;
	}
	/** To Drop-Down Menu:  converts the selected dom elements into jQuery UI Themed drop-down menu button.
	*	When an option is selected from the drop-down list the ddSelect event will be triggered sending as the first arguement
	*	the 'name' of the option chosen.  Also, the function supplied by the action paramater will be triggered.
	*	If the action parameter for an option is set to false, the option will appear disabled, and won't be selectable.
	*
	*	@example	jQuery('.my-dropdown-menu').toDDMenu({name:'button3',list:[{name:'option1',label:'select me',icon:'ui-icon ui-icon-star',action:function(e,p){alert(p+' selected me!')},param:'you'}]});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	animation:(String)		The name of the jquery-ui animation to use for for opening the drop-down, or null/false for no animation
	*	list:(Array)			An array of menu option objects.
	*	Each menu option object can use the following parameters:
	*		name:(String)		A class and event name to give this button to be used as identification
	*		label:(String)		The options label.  default is the name field.
	*		classes:(String)	A extra classes to be applied to the item
	*		css:(Object)		A value object of CSS attributes to be added to the item
	*		icon:(String)		Class names applied to the icon area to generate an icon. e.g. 'ui-icon ui-icon-document'
	*		action:(Function)	A function to call when the option is selected.
	*		context:(Object)	A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*		param:(Object)		A value object to send to the action function
	*	@return jQuery			The original jQuery object
	*/
	jQuery.fn.toDDMenu = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'ddmbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = null;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.list) args.list = [
			{name:'new', icon:'ui-icon ui-icon-document'},
			{name:'open', icon:'ui-icon ui-icon-folder-open', action:function(){echo('opening')}},
			{name:'save', icon:'ui-icon ui-icon-disk', action:false},
			{name:'exit'}
		];
		
		//alert(args.name+' '+args.contents);
		if(!args.contents || args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' '+args.classes;
		
		this.each(function(){
			var container = jQuery(this);
			//jQuery("<span class='jqb-ddContainer "+args.name+"'></span>");
			container.addClass('jqb-ddContainer '+args.name);
			
			var button = $jq("<span class='"+buttonClass+" ui-state-default ui-corner-all'></span>");
			if(args.contents) button.append(args.contents);
			else button.append(container.html());
			if(args.css) button.css(args.css);
			if(args.tooltip) button.attr('title', args.tooltip);

			button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
			button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
			button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
			
			//make body
			var ddPanel = $jq("<ul class='jqb-ddMenu ui-widget-content ui-corner-bottom ui-corner-tr'></ul>");
			for(var i=0;i<args.list.length;i++){
				if(!args.list[i].name || !args.list[i].name.indexOf) args.list[i].name = 'default';
				if(!args.list[i].label || !args.list[i].label.indexOf) args.list[i].label = args.list[i].name;
				if(!args.list[i].classes || !args.list[i].classes.indexOf) args.list[i].classes = '';
				if(!args.list[i].icon || !args.list[i].icon.indexOf) args.list[i].icon = '';
				if(args.list[i].action == undefined) args.list[i].action = true;
				if(args.list[i].action === false) args.list[i].classes += ' jqb-disabled';
				
				var item = jQuery("<li style='font-weight:normal;border: none;' class='gk-ddMenuItem "+args.list[i].classes+"'><span style='width:16px;height:16px;display:inline-block;overflow:hidden;' class='jqb-icon "+args.list[i].icon+"'></span>&nbsp;<span>"+args.list[i].label+"</span></li>");
				if(args.list[i].css) item.css(args.list[i].css);
				
				if(args.list[i].action){
					item.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
					
					var callback = function(event){
						jQuery(this).parent().parent().trigger('ddSelect', event.data[0]);
						jQuery(this).parent().hide(args.animation);
						jQuery(this).removeClass('ui-state-hover');
						if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
					};
					item.bind('click', [args.list[i].name, args.list[i].context, args.list[i].action, args.list[i].param], callback);
				}
				
				ddPanel.append(item);
			}
			ddPanel.hide();
			
			var callback = function(event){ jQuery(this).next().toggle(args.animation); };
			button.click(callback);
			
			container.empty();
			container.append(button);
			container.append(ddPanel);
		});
		return this;
	}
	
	/** Create Tabs:  produces the html/dom/javascript required for a jQuery UI Themed tab menu row.
	*	When an option is selected from the tab list the tab event will be triggered sending as the first arguement
	*	the 'name' of the option chosen.  Also, the function supplied by the action paramater will be triggered.
	*	If the action parameter for an option is set to false, the option will appear disabled, and won't be selectable.
	*
	*	@example	jQuery.createTabs({name:'myTabs',list:[{name:'option1',label:'select me',action:function(e,p){alert(p+' selected me!')},param:'you'}]}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	list:(Array)			An array of menu option objects.
	*	Each menu option object can use the following parameters:
	*		name:(String)		A class and event name to give this button to be used as identification
	*		label:(String)		The options label.  default is the name field.
	*		classes:(String)	A extra classes to be applied to the item
	*		css:(Object)		A value object of CSS attributes to be added to the item
	*		action:(Function)	A function to call when the option is selected.
	*		context:(Object)	A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*		param:(Object)		A value object to send to the action function
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createTabs = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tabset'+Math.floor(Math.random()*100000);
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.list) args.list = [
			{name:'new', icon:'ui-icon ui-icon-document'},
			{name:'open', icon:'ui-icon ui-icon-folder-open', action:function(){echo('opening')}},
			{name:'save', icon:'ui-icon ui-icon-disk', action:false},
			{name:'exit'}
		];
		
		var container = jQuery("<ul class='jqb-tabContainer ui-widget"+args.name+" "+args.classes+"'></span>");
		if(args.css) container.css(args.css);

		// button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
		// button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
		// button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
		
		//make body
		for(var i=0;i<args.list.length;i++){
			if(!args.list[i].name || !args.list[i].name.indexOf) args.list[i].name = 'default';
			if(!args.list[i].label || !args.list[i].label.indexOf) args.list[i].label = args.list[i].name;
			if(!args.list[i].classes || !args.list[i].classes.indexOf) args.list[i].classes = '';
			var tabClass = 'jqb-text-tab';
			if(!args.list[i].label || args.list[i].label instanceof jQuery || args.list[i].label.indexOf('<') != -1) tabClass = 'jqb-tab';
			args.list[i].classes += tabClass;
			if(!args.list[i].icon || !args.list[i].icon.indexOf) args.list[i].icon = '';
			if(args.list[i].action == undefined) args.list[i].action = true;
			if(args.list[i].action === false) args.list[i].classes += ' jqb-disabled';
			if(i==0){
				args.list[i].classes += ' ui-widget-content';
			}else{
				args.list[i].classes += ' ui-state-default';
			}
			
			var item = jQuery("<li style='font-weight:normal;' class='jqb-tab ui-corner-top "+args.list[i].classes+"'>"+args.list[i].label+"</li>");
			if(args.list[i].css) item.css(args.list[i].css);
			
			if(args.list[i].action){
				item.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
				
				var callback = function(event){
					jQuery(this).parent().trigger('tab', event.data[0]);
					jQuery(this).parent().children().removeClass('ui-widget-content').addClass('ui-state-default');
					jQuery(this).removeClass('ui-state-hover').removeClass('ui-state-default').addClass('ui-widget-content');
					if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
				};
				item.bind('click', [args.list[i].name, args.list[i].context, args.list[i].action, args.list[i].param], callback);
			}
			
			container.append(item);
		}
		
		return container;
	}
	
	/** To Tabs:  produces the html/dom/javascript required for a jQuery UI Themed tab menu row.
	*	When an option is selected from the tab list the tab event will be triggered sending as the first arguement
	*	the 'name' of the option chosen.  Also, the function supplied by the action paramater will be triggered.
	*	If the action parameter for an option is set to false, the option will appear disabled, and won't be selectable.
	*
	*	@example	jQuery.createTabs({name:'myTabs',list:[{name:'option1',label:'select me',action:function(e,p){alert(p+' selected me!')},param:'you'}]}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	list:(Array)			An array of menu option objects.
	*	Each menu option object can use the following parameters:
	*		name:(String)		A class and event name to give this button to be used as identification
	*		label:(String)		The options label.  default is the name field.
	*		classes:(String)	A extra classes to be applied to the item
	*		css:(Object)		A value object of CSS attributes to be added to the item
	*		action:(Function)	A function to call when the option is selected.
	*		context:(Object)	A context for which to call the action function from. i.e. what the 'this' term will refer to in the function.
	*		param:(Object)		A value object to send to the action function
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.fn.toTabs = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tabset'+Math.floor(Math.random()*100000);
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.list) args.list = [
			{name:'new', icon:'ui-icon ui-icon-document'},
			{name:'open', icon:'ui-icon ui-icon-folder-open', action:function(){echo('opening')}},
			{name:'save', icon:'ui-icon ui-icon-disk', action:false},
			{name:'exit'}
		];
		
		this.each(function(){
			var container = jQuery(this);
			if(args.css) container.css(args.css);
			container.addClass(args.name+" "+args.classes);
			container.empty();
			
			//make body
			for(var i=0;i<args.list.length;i++){
				if(!args.list[i].name || !args.list[i].name.indexOf) args.list[i].name = 'default';
				if(!args.list[i].label || !args.list[i].label.indexOf) args.list[i].label = args.list[i].name;
				if(!args.list[i].classes || !args.list[i].classes.indexOf) args.list[i].classes = '';
				var tabClass = 'jqb-text-tab';
				if(!args.list[i].label || args.list[i].label instanceof jQuery || args.list[i].label.indexOf('<') != -1) tabClass = 'jqb-tab';
				args.list[i].classes += tabClass;
				if(!args.list[i].icon || !args.list[i].icon.indexOf) args.list[i].icon = '';
				if(args.list[i].action == undefined) args.list[i].action = true;
				if(args.list[i].action === false) args.list[i].classes += ' jqb-disabled';
				if(i==0){
					args.list[i].classes += ' ui-widget-content';
				}else{
					args.list[i].classes += ' ui-state-default';
				}
				
				var item = jQuery("<li style='font-weight:normal;' class='jqb-tab ui-corner-top "+args.list[i].classes+"'>"+args.list[i].label+"</li>");
				if(args.list[i].css) item.css(args.list[i].css);
				
				if(args.list[i].action){
					item.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
					
					var callback = function(event){
						jQuery(this).parent().trigger('tab', event.data[0]);
						jQuery(this).parent().children().removeClass('ui-widget-content').addClass('ui-state-default');
						jQuery(this).removeClass('ui-state-hover').removeClass('ui-state-default').addClass('ui-widget-content');
						if(event.data[2] instanceof Function) event.data[2].call(event.data[1], event, event.data[3]);
					};
					item.bind('click', [args.list[i].name, args.list[i].context, args.list[i].action, args.list[i].param], callback);
				}
				
				container.append(item);
			}
		});
		
		return this;
	}

	/** Create Drop-Down Content:  produces the html/dom/javascript required for a jQuery UI Themed drop-down content button.
	*	This works much like the drop-down menu, but instead of forcing the drop-down blurb to be a menu, it allows you to fill the space with anything.
	*
	*	@example	jQuery.createDDContent({name:'button4',contents:'click me',innerContent:' you clicked me!'}).appendTo(document.body);
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	animation:(String)		The name of the jquery-ui animation to use for for opening the drop-down, or null/false for no animation
	*	innerContent:(String or jQuery)	Some contents for the drop-down window, likely some html
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createDDContent = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'ddcbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = args.name;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.innerContent) args.innerContent = jQuery('<div>Empty Message Box.</div>');
		
		//alert(args.name+' '+args.contents);
		if(args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' ' + args.classes;
		
		var container = jQuery("<span class='jqb-ddContainer "+args.name+"'></span>");
		
		var button = jQuery("<span class='"+buttonClass+" ui-state-default ui-corner-all'></span>");
		button.append(args.contents);
		if(args.css) button.css(args.css);
		if(args.tooltip) button.attr('title', args.tooltip);
		
		button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
		button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
		button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
		
		//make body
		var ddPanel = jQuery("<div class='jqb-ddMenu ui-widget-content ui-corner-bottom ui-corner-tr'></div>");
		ddPanel.append(args.innerContent);
		ddPanel.hide();
		
		var callback = function(event){
			jQuery(this).trigger('ddcbutton', event.data[0]);
			jQuery(this).next().toggle(args.animation); 
		};
		button.bind('click', [args.name], callback);
		
		container.append(button);
		container.append(ddPanel);
		
		return container;
	}
	/** To Drop-Down Content:  produces the html/dom/javascript required for a jQuery UI Themed drop-down content button.
	*	This works much like the drop-down menu, but instead of forcing the drop-down blurb to be a menu, it allows you to fill the space with anything.
	*
	*	Note: unlike the rest of the method versions of the functions, the current contents of the selected DOM element does not fill the role of
	*	the 'contents' variable, but of the 'innerContent' variable. i.e. If you make a div tag filled with 'here is my text' and use this function on it
	*	without speficying an 'innerContent' the drop-down window will say 'here is my text', while the button will say either the default button name
	*	or the value of 'contents'.
	*
	*	@example	jQuery('.my-dd-content').toDDContent({name:'button4',contents:'click me'});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	contents:(String or jQuery)		Some contents for the button, likely a word label or icon html
	*	tooltip:(String)		Information to show-up on extended hover (simply fills-in the 'title' attribute producing browser specific results)
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	animation:(String)		The name of the jquery-ui animation to use for for opening the drop-down, or null/false for no animation
	*	innerContent:(String or jQuery)	Some contents for the drop-down window, likely some html
	*	@return jQuery			The original jQuery object
	*/
	jQuery.fn.toDDContent = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'ddcbutton'+Math.floor(Math.random()*100000);
		if(!args.contents || (!(args.contents instanceof jQuery) && !(args.contents.indexOf instanceof Function))) args.contents = args.name;
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		if(!args.innerContent) args.innerContent = null;
		
		//alert(args.name+' '+args.contents);
		if(!args.contents || args.contents instanceof jQuery || args.contents.indexOf('<') != -1) buttonClass = 'jqb-button';
		else buttonClass = 'jqb-text-button';
		if(args.action === false) buttonClass += ' jqb-disabled';
		buttonClass += ' '+args.classes;
		
		this.each(function(){
			var container = jQuery(this);
			//jQuery("<span class='jqb-ddContainer "+args.name+"'></span>");
			container.addClass('jqb-ddContainer '+args.name);
			
			var button = jQuery("<span class='"+buttonClass+" ui-state-default ui-corner-all'></span>");
			button.append(args.contents);
			if(args.css) button.css(args.css);
			if(args.tooltip) button.attr('title', args.tooltip);
			
			button.hover(function(){jQuery(this).addClass('ui-state-hover')}, function(){jQuery(this).removeClass('ui-state-hover')});
			button.mousedown(function(){jQuery(this).addClass('ui-state-active')});
			button.mouseup(function(){jQuery(this).removeClass('ui-state-active')});
			
			//make body
			var ddPanel = jQuery("<div class='jqb-ddMenu ui-widget-content ui-corner-bottom ui-corner-tr'></div>");
			if(args.innerContent) ddPanel.append(args.innerContent);
			else ddPanel.append(container.html());
			ddPanel.hide();
			
			var callback = function(event){
				jQuery(this).trigger('ddcbutton', event.data[0]);
				jQuery(this).next().toggle(args.animation); 
			};
			button.bind('click', [args.name], callback);
			
			container.empty();
			container.append(button);
			container.append(ddPanel);
		});
		
		return this;
	}
})();