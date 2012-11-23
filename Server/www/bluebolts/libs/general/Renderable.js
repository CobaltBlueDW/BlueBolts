/**	Renderable:  This class defines base behavior for classes that get rendered using HTML, and
*	act presistant.
*
*	@author		David Wipperfurth
*	@dated		2010-05-21
*/

(function(){
	//declare namespace
	var BBC = NameSpace('BlueBoltCore');
	
	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*/
	BBC.Renderable = function(containerID){
		this.RenderableConstructor(containerID);
	}
	
	//extends from Object
	BBC.Renderable.prototype = new Object();

	//constructor declaration
	BBC.Renderable.prototype.constructor = BBC.Renderable;

	//static methods
	
	//memebers
	BBC.Renderable.prototype.container = '';		//A string representation of a jquery selector for the container tag of the renderable object
	BBC.Renderable.prototype.prevContainer = '';	//A string representation of a jquery selector for the last container tag of the renderable object
	BBC.Renderable.prototype.content = '';		//A string repesentation of the centent in the widget (generally HTML)
	BBC.Renderable.prototype.views = {};			//A set of loaded view files, keyed by name/type A.K.A. 'default', 'settings', 'foreground'
	BBC.Renderable.prototype.state = null;		//A string equal to the name of the current view. e.g. 'default', 'settings', 'foreground'

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	BBC.Renderable.prototype.RenderableConstructor = function(containerID){
		if(!containerID) containerID = '#contentblock0';
		this.container = containerID;
	}
	
	/**	Render:  Called to have the widget display its self.  Usually this consists of
	*	filling the widget's container with the propper DOM elements, since the browser actualyl
	*	handles the rendering.
	*
	*	@param	String	toContainer	A string representation of a jQuery selector to use as a container.
	*								This is a very optional parameter, usually the default container
	*								set on construction will be used.
	*/
	BBC.Renderable.prototype.render = function(toContainer){
		if(toContainer==undefined) toContainer = this.container;
		//alert(this.container);
		
		if(this.setState instanceof Function) this.setState(toContainer);	//create a setState function to automatically update state
		if(this.state){
			if(this.views[this.state]) this.content = this.views[this.state];	//If no valid state is set, a loading image will be shown
			else this.content = "<div align='center'><img class='gk-loading' src='/core/images/ajax-loader.gif' alt='Loading...'></img></div>";
		}
		
		if(!this.preRender(toContainer)) return false;
		
		jQuery(toContainer).empty();
		jQuery(toContainer).append(this.content);
		
		if(!this.postRender(toContainer)) return false;
		
		return true;
	}
	
	/**	Pre-Render:  Called at the begining of the render process.  Over-ride this functino to
	*	easily customize the rendering process for a widget.
	*	
	*	@param	string	toContainer	a jquery selector pointing to the html tag to render into
	*	@return	boolean				if this function returns false, the render aborts.
	*/
	BBC.Renderable.prototype.preRender = function(toContainer){
		return true;//over-ride this function
	}
	
	/**	Prost-Render:  Called at the end of the render process.  Over-ride this functino to
	*	easily customize the rendering process for a widget.
	*	
	*	@param	string	toContainer	a jquery selector pointing to the html tag to render into
	*	@return	boolean				if this function returns false, the render aborts.
	*								which doesn't mean much since this is at the end of the render process,
	*								unless some other function is watching the value returned from render.
	*/
	BBC.Renderable.prototype.postRender = function(toContainer){
		return true;//over-ride this function
	}
	
	/**	renderTo:  Changes the current location this object renders to.
	*
	*	@param	String	toContainer	A string representation of a jQuery selector to use as a container.
	*								This parameter is only nessecary when changing the default. when left
	*								empty, the default container will be used.
	*/
	BBC.Renderable.prototype.renderTo = function(toContainer, state){
		if(toContainer){
			this.prevContainer = this.container;
			this.container = toContainer;
		}
		if(state) this.state = state;
		
		return this.render();
	}
	
	/**	Add View As:  used to add a view to the list of loaded views
	*
	*	@param	string		url				The location of the view to load.
	*	@param	string		stateName		The name to give the new state.
	*	@param	boolean		renderOnLoad	If true, when the view is loaded it will be set as 
	*										the current state and rendered. (true by default)
	*	@param	function	callBack		A function that is called once the requested view has 
	*										been loaded.  This function is passed the new state 
	*										name that the view got loaded into.
	*	@return	boolean						returns false on failure.
	*/
	BBC.Renderable.prototype.addViewAs = function(url, stateName, renderOnLoad, success){
		if(!url) return false;
		if(!stateName) stateName = 'default';
		if(renderOnLoad==undefined) renderOnLoad = true;
		
		var cur = this;
		var callBack = function(html){ cur.cb_addViewAs(html, stateName, renderOnLoad, success); };
		
		jQuery.ajax({
			url: url,
			success: callBack,
			dataType: 'html'
		});
		return true;
	}
	BBC.Renderable.prototype.cb_addViewAs = function(html, stateName, renderOnLoad, callBack){
		if(stateName && html) this.views[stateName] = html;
		if(callBack && callBack instanceof Function) callBack(stateName);
		if(renderOnLoad){		
			this.state = stateName;
			this.render();
		}
	}
	//private methods (please don't call?)
	
})();