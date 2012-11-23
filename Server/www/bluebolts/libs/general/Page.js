/**	Page:  The Javascript representation of an entire webpage.
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
	BBC.Page = function(){
		//Get Page Info
		var pathParts = window.location.pathname.split('/');
		var pageAssoc = pathParts.pop();
		
		if((pageAssoc=="")) pageAssoc = "main";
		var cur = this;
		jQuery(document).ready(function(){
			cur.loadPageData(pageAssoc);
		});
		
		//setup event handler that navigation panels can trigger
		//jQuery('#page').bind('navigateTo', this.showContent);
	}
	
	//extends
	BBC.Page.prototype = join(new BBC.Receiver(), new Object());
	
	//constructor declaration
	BBC.Page.prototype.constructor = BBC.Page;
	
	//memebers
	BBC.Page.prototype.contentBlocks = {};
	BBC.Page.prototype.componentBlocks = {};
	BBC.Page.prototype.queueRender = {};
	
	//methods
	BBC.Page.prototype.loadPageData = function(pageID){
		var cur = this;
		var callBack = function(json){cur.cb_loadPageData(json);};
		jQuery.ajax({
			url: ROOT_URL+'page/loadPageData/'+pageID,
			type: 'GET',
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	BBC.Page.prototype.cb_loadPageData = function(response){
		//alert(response);
		if(response && response.pageInfo){
			response.pageInfo = jQuery.json.decode(response.pageInfo);
			if(response.pageInfo.contentblocks instanceof Array){
				for(var i=0; i<response.pageInfo.contentblocks.length; i++){
					this.showContent(response.pageInfo.contentblocks[i], "[contentblock="+i+"]");
				}
			}
			for(var i=0; i<response.pageInfo.components.length; i++){
				this.showComponent(response.pageInfo.components[i], "[component="+i+"]");
			}
		}
	}
	
	BBC.Page.prototype.showContent = function(contentBlockName, contentBlockContainer){
		//alert(contentBlockName);
		if(!this.contentBlocks[contentBlockName]){
			this.queueRender[contentBlockName] = contentBlockContainer;
			this.loadContentData(contentBlockName);
		}else{
			this.contentBlocks[contentBlockName].render(contentBlockContainer);
		}
	}
	
	BBC.Page.prototype.showComponent = function(componentID, componentContainer){
		//alert(componentID);
		if(!this.componentBlocks[componentID]){
			this.queueRender[componentID] = componentContainer;
			this.loadComponentData(componentID);
		}else{
			this.componentBlocks[componentID].render(componentContainer);
		}
	}
	
	BBC.Page.prototype.loadContentData = function(association){
		var cur = this;
		var callBack = function(json){cur.cb_loadContentData(json);};
		jQuery.ajax({
			url: ROOT_URL+'contentblock/loadContentData/'+association,
			type: 'GET',
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	
	BBC.Page.prototype.cb_loadContentData = function(response){
		//alert(response.association);
		if(!response || !response.association) return false;
		//alert(this.queueRender[response.association]);
		this.contentBlocks[response.association] = BBC.ContentBlock.newBlock(response.className, this.queueRender[response.association], response);
		this.contentBlocks[response.association].render(this.queueRender[response.association]);
	}
	
	BBC.Page.prototype.loadComponentData = function(id){
		//alert(id);
		var cur = this;
		var callBack = function(json){cur.cb_loadComponentData(json);};
		jQuery.ajax({
			url: ROOT_URL+'component/loadComponentData/'+id,
			type: 'GET',
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	
	BBC.Page.prototype.cb_loadComponentData = function(response){
		//alert(response.componentBlockID);
		if(!response || !response.componentBlockID) return false;
		this.componentBlocks[response.componentBlockID] = BBC.Component.newComponent(response.className, this.queueRender[response.componentBlockID], response);
		this.componentBlocks[response.componentBlockID].render(this.queueRender[response.componentBlockID]);
	};
	
	//singleton esque design
	BBC.Page = new BBC.Page();
	
})();