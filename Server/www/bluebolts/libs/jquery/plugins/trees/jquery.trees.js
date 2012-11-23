/** jQuery Trees:  A plugin for jQuery that makes the creation of jQuery-ui Themed tree structures easy.
*
*	ToDo:
*
*	@author		David Wipperfurth
*	@group		WellBe.me
*	@dated		3/25/10
*	@updated	3/25/10
*	@version	0.9
*/
(function(){	//scope for variable protection
	/** Create Tree:  produces the html/dom/javascript required for a jQuery UI Themed tree structure
	*
	*	@example	jQuery.createTree({obj:{"My Object"}});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	obj:(Object)			The object to model as a tree
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.createTree = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tree'+Math.floor(Math.random()*100000);
		if(!args.obj) args.obj = new Object();
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		
		//alert(args.name+' '+args.contents);
		
		var tree = jQuery("<span class='jqt-root "+args.classes+" ui-widget-content ui-corner-all "+args.name+"'></span>");
		if(args.css) tree.css(args.css);
		 
		objRenderer(args.name, '', args.obj, tree);
		tree.click(function(e){
			var root = jQuery(this);
			var targ = jQuery(e.target);
			if(targ.hasClass('jqt-tname')){
				root.find('.ui-state-active').removeClass('ui-state-active');
				targ.addClass('ui-state-active');
				var path = targ.attr('path');
				root.trigger('jqTreeSelect', [path, eval('args.obj'+path)]);
			}else if(targ.hasClass('jqt-icon')){
				targ.toggleClass('ui-icon-circlesmall-minus').toggleClass('ui-icon-circlesmall-plus');
				targ.parent().next().toggle();
			}
		});
		
		return tree;
	}
	
	/** To Tree:  converts the currently selected DOM elements into jQuery UI Themed tree
	*
	*	@example	jQuery('.myclass').toTree({obj:{"My Object"}});
	*
	*	@param	object	args	A value object containing all the nessecary paramaters.
	*	name:(String)			A class name to give this button to be used as identification
	*	classes:(String)		A extra classes to be applied to the button
	*	css:(Object)			A value object of CSS attributes to be added to the button
	*	obj:(Object)			The object to model as a tree
	*	@return jQuery			A jQuery DOM object to be applied to an HTML DOM tree
	*/
	jQuery.fn.toTree = function(args){
		if(!args) args = new Object();
		if(!args.name) args.name = 'tree'+Math.floor(Math.random()*100000);
		if(!args.obj) args.obj = new Object();
		if(!args.classes || !args.classes.indexOf) args.classes = '';
		
		//alert(args.name+' '+args.contents);
		this.each(function(){
			var tree = jQuery(this).addClass('jqt-root ui-widget-content ui-corner-all '+args.name+' '+args.classes);
			if(args.css) tree.css(args.css);
			tree.empty();
			
			objRenderer(args.name, '', args.obj, tree);
			tree.click(function(e){
				var root = jQuery(this);
				var targ = jQuery(e.target);
				if(targ.hasClass('jqt-tname')){
					root.find('.ui-state-active').removeClass('ui-state-active');
					targ.addClass('ui-state-active');
					var path = targ.attr('path');
					if(!path) path = ' ';
					root.trigger('jqTreeSelect', [path, eval('args.obj'+path)]);
				}else if(targ.hasClass('jqt-icon')){
					targ.toggleClass('ui-icon-circlesmall-minus').toggleClass('ui-icon-circlesmall-plus');
					targ.parent().next().toggle();
				}
			});
		});
		
		return this;
	}
	
	objRenderer = function(name, path, obj, jObj){
		if(obj instanceof Array){
			var content = jQuery("<span></span>");
			jObj.append(jQuery("<div></div>").append("<span><span class='jqt-icon ui-icon ui-icon-circlesmall-minus'></span><span class='jqt-tname' path='"+path+"'>"+name+"</span></span>").append(content));
			for(var i=0; i<obj.length; i++){
				objRenderer(i, path+'['+i+']', obj[i], content);
			}
		}else if(obj instanceof Object){
			var content = jQuery("<span></span>");
			jObj.append(jQuery("<div></div>").append("<span><span class='jqt-icon ui-icon ui-icon-circlesmall-minus'></span><span class='jqt-tname' path='"+path+"'>"+name+"</span></span>").append(content));
			for(var i in obj){
				objRenderer(i, path+"[\""+i+"\"]", obj[i], content);
			}
		}else{
			jObj.append("<div><span class='jqt-icon'></span><span class='jqt-tname' path='"+path+"'>"+name+": </span><span> "+obj+"</span></div>");
		}
	}
})();