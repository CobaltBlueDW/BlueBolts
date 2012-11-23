/**	Posty Blog:  A CMS Component utilizing Posty
*
*	@author	David Wipperfurth
*	@group	BlueSolutions
*	@dated	2010-05-22
*/


(function(){
	//Declare Namespace
	var BBC = NameSpace('BlueBoltCore');
	var P = NameSpace('Plugins.Posty');

	/** Fabricator:  Manages construction of this object and it's constructor inheritance chain.
	*
	*	@param	string	containerID	RenderableConstructor param
	*	@param	object	infoObject	StorableConstructor param
	*/
	P.PostyBlog = function(containerID, infoObject){
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ComponentConstructor();
		this.PostyBlogConstructor();
	}

	//extends
	P.PostyBlog.prototype = new BBC.Component();

	//constructor declaration
	P.PostyBlog.prototype.constructor = P.PostyBlog;

	//static methods

	//memebers
	P.PostyBlog.prototype.thread = null;
	P.PostyBlog.prototype.threadID = null;
	P.PostyBlog.prototype.editor = false;
	P.PostyBlog.editorConfig = {
		toolbar: [
			['Undo','Redo','RemoveFormat','-','Cut','Copy','Paste','PasteText','-','Find','Replace','SelectAll'],
			['SpellChecker', 'Scayt','-','Maximize','-','ShowBlocks','Source','Preview','-','Print'],
			['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','Outdent','Indent','-','NumberedList','BulletedList'],
			['Table','Textarea','Blockquote','HorizontalRule','PageBreak','-','Templates'],
			['Link','Unlink','Anchor','-','Image','Smiley','-','Flash'],
			['Font','FontSize','-','Bold','Italic','Underline','Strike','-','TextColor','BGColor','-','Subscript','Superscript','SpecialChar','-','Styles']
		],
		resize_enabled: false,
		skin: 'jqui1'
	};

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	P.PostyBlog.prototype.PostyBlogConstructor = function(){
		this.addViewAs('/bluebolts/plugins/Posty/views/blogdefault.html','default',true);
		this.parameters = jQuery.json.decode(this.parameters);
		if(this.parameters.threadID) this.getThread(this.parameters.threadID);
		if(this.parameters.roleIDs && this.parameters.roleIDs instanceof Array){
			for(var i=0;i<this.parameters.roleIDs.length;i++){
				if(this.parameters.roleIDs[i] == BBC.User.roleID) this.editor = true;
			}
		}
	}
	
	P.PostyBlog.prototype.preRender = function(toContainer){
		//todo
		return true;
	}
	
	P.PostyBlog.prototype.postRender = function(toContainer){
		if(!toContainer) toContainer = this.container;
		
		this.drawPostArea(toContainer+' .bbp-pty-blg-post');
		this.drawThread(toContainer+' .bbp-pty-blg-thread');
		
		return true;
	}
	
	P.PostyBlog.prototype.drawThread = function(toContainer){
		if(!toContainer) toContainer = this.container+' .bbp-pty-blg-thread';
		if(!this.thread) return false;
		
		var cur = this;
		var table = jQuery("<table style='width:auto;max-width:100%'></table>");
		for(var i=0; i<this.thread.length; i++){	//This is my body of textOn: 2010-04-01 10:20:05</div>
			table.append("<tr><td><div index='"+i+"' style='ppluging:4px;width:auto;max-width:100%' class='ui-widget-content ui-corner-top'>"+this.thread[i]['content']+"</div><div index='"+i+"' style='ppluging:1px 4px 2px 4px;text-align:center;width:auto;font-weight:normal' class='ui-widget-header ui-corner-bottom'>"+this.thread[i]['userName']+" wrote on "+this.thread[i]['dated']+"</div></td></tr>");
		}
		if(this.editor){
			table.find('div[index].ui-widget-content').click(function(){
				var bucket = jQuery(this);
				var index = bucket.attr('index');
				if(bucket.find('textarea').length > 0) return false;
				var stuff = bucket.html();
				bucket.html(jQuery("<textarea class='bbp-pty-blg-editor'>"+stuff+"</textarea>"));
				var cke = bucket.find('.bbp-pty-blg-editor').ckeditor(function(){}, P.PostyBlog.editorConfig);
				bucket.append(jQuery.createButton({name:'bbp-pty-blg-postButton', contents:'Save', action:function(){
					cur.setPost(cur.thread[index]['postyPostID'], cke.val());
				}}));
			});
		}
		
		jQuery(toContainer).empty().append(table);
	}
	
	P.PostyBlog.prototype.drawPostArea = function(toContainer){
		if(!toContainer) toContainer = this.container+' .bbp-pty-blg-post';
		if(!this.editor) return false;
		
		var cur = this;
		var box = jQuery(toContainer).empty();
		box.append("<textarea class='bbp-pty-blg-editor'></textarea>");
		var cke = box.find('.bbp-pty-blg-editor').ckeditor(function(){}, P.PostyBlog.editorConfig);
		box.append(jQuery.createButton({name:'bbp-pty-blg-postButton', contents:'Post', action:function(){
			cur.addPost(cke.val());
		}}));
		
	}
	
	/** Get Thread:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyBlog.prototype.getThread = function(threadID){
		if(!threadID) threadID = this.threadID;
		if(!threadID) return false;
		this.threadID = threadID;
		var cur = this;
		var callBack = function(json){cur.cb_getThread(json);};
		var args = {parentID:this.threadID,sort:{dated:'DESC'},limit:{count:5}};
		
		jQuery.ajax({
			url: '/bluebolts/Posty/PostyService/getPosts',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyBlog.prototype.cb_getThread = function(result){
		if(!result || !(result instanceof Array)) return false;
		this.thread = result;
		this.drawThread();
	}
	
	/** addPost:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyBlog.prototype.addPost = function(content){
		if(!content) return false;
		
		var cur = this;
		var callBack = function(json){cur.cb_addPost(json);};
		var args = {parentID:this.threadID,content:content};
		
		jQuery.ajax({
			url: '/bluebolts/Posty/PostyService/createPost',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyBlog.prototype.cb_addPost = function(result){
		this.getThread();
	}
	
	/** setPost:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyBlog.prototype.setPost = function(ID, content){
		if(!content) return false;
		
		var cur = this;
		var callBack = function(json){cur.cb_setPost(json);};
		var args = {postyPostID:ID,content:content};
		
		jQuery.ajax({
			url: '/bluebolts/Posty/PostyService/updatePost',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyBlog.prototype.cb_setPost = function(result){
		this.getThread();
	}
	
	/** savePost:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*
	P.PostyBlog.prototype.savePost = function(index, content){
		if(!index) return false;
		if(!this.thread || !this.thread[index]) return false;
		this.thread[index]['content'] = content;
		
		var cur = this;
		var callBack = function(json){cur.cb_savePost(json);};
		var args = {postyPostID:this.thread[index]['postyPostID'], content:content};
		
		jQuery.ajax({
			url: '/Posty/PostyService/updatePost',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyBlog.prototype.cb_savePost = function(result){
		//this.getThread();
	}*/

})();