/**	Posty Forum:  A Forum Component form Posty
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
	P.PostyForum = function(containerID, infoObject){
		this.RenderableConstructor(containerID);
		this.StorableConstructor(infoObject);
		this.ComponentConstructor();
		this.PostyForumConstructor();
	}

	//extends
	P.PostyForum.prototype = new BBC.Component();

	//constructor declaration
	P.PostyForum.prototype.constructor = P.PostyForum;

	//static methods

	//memebers
	P.PostyForum.prototype.thread = null;
	P.PostyForum.prototype.threadID = null;

	//methods
	/**	Constructor:  because of the way JavaScript works(or doesn't) the actual constructor code for the class
	*	is stored here.  This function should get called once, in the class-named function, after all super 
	*	constructor calls.
	*
	*/
	P.PostyForum.prototype.PostyForumConstructor = function(){
		this.addViewAs('/core/plugins/Posty/views/forumdefault.html','deafult',true);
		if(this.parameters.threadID) this.getThread(this.parameters.threadID);
	}
	
	P.PostyForum.prototype.preRender = function(toContainer){
		//todo
		return true;
	}
	
	P.PostyForum.prototype.postRender = function(toContainer){
		if(!toContainer) toContainer = this.container;
		
		this.drawThread(toContainer+' .bbp-pty-pf-thread');
		this.drawReply(toContainer+' .bbp-pty-pf-reply');
		
		return true;
	}
	
	P.PostyForum.prototype.drawThread = function(toContainer){
		if(!toContainer) toContainer = this.container+' .bbp-pty-pf-thread';
		if(!this.thread) return false;
		
		var cur = this;
		var table = jQuery('<table></table>');
		table.append('<tr><th>Name</th><th>Content</th></tr>');
		for(var i=0; i<this.thread.length; i++){
			if(BBC.User.userName == this.thread[i]['userName']){
				var row = jQuery("<tr></tr>");
				row.append('<td>'+this.thread[i]['userName']+'</td>');
				row.append(jQuery("<td index='"+i+"'>"+this.thread[i]['content']+'</td>').click(function(e){
					var post = jQuery(this);
					if(post.find('textarea').length <= 0){
						post.html('<textarea>'+post.html()+'</textarea>');
					}
				}).change(function(e){
					var post = jQuery(this);
					var content = post.find('textarea').val();
					cur.savePost(post.attr('index'), content);
					post.html(content);
				}));
				table.append(row);
			}else{
				table.append('<tr><td>'+this.thread[i]['userName']+'</td><td>'+this.thread[i]['content']+'</td></tr>');
			}
		}
		
		jQuery(toContainer).replaceWith(table);
	}
	
	P.PostyForum.prototype.drawReply = function(toContainer){
		if(!toContainer) toContainer = this.container+' .bbp-pty-pf-reply';
		
		var cur = this;
		var box = jQuery(toContainer).empty();
		box.append("<textarea class='bbp-pty-pf-replyText'></textarea>");
		box.append(jQuery.createButton({name:'bbp-pty-pf-replyButton', contents:'Reply', action:function(){
			cur.sendReply(jQuery(cur.container+' .bbp-pty-pf-replyText').val());
		}}));
		
	}
	
	/** Get Thread:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyForum.prototype.getThread = function(threadID){
		if(!threadID) threadID = this.threadID;
		if(!threadID) return false;
		this.threadID = threadID;
		var cur = this;
		var callBack = function(json){cur.cb_getThread(json);};
		var args = {parentID:this.threadID};
		
		jQuery.ajax({
			url: '/Posty/PostyService/getPosts',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyForum.prototype.cb_getThread = function(result){
		if(!result || !(result instanceof Array)) return false;
		this.thread = result;
		this.drawThread();
	}
	
	/** sendReply:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyForum.prototype.sendReply = function(content){
		if(!content) return false;
		
		var cur = this;
		var callBack = function(json){cur.cb_sendReply(json);};
		var args = {parentID:this.threadID,content:content};
		
		jQuery.ajax({
			url: '/Posty/PostyService/createPost',
			type: 'POST',
			data: jQuery.json.encode(args),
			contentType: 'application/x-json',
			processData: false,
			success: callBack,
			dataType: 'json'
		});
	}
	P.PostyForum.prototype.cb_sendReply = function(result){
		this.getThread();
	}
	
	/** savePost:  returns a thread.
	*
	*	@param	Object	args	Value object to specify thread request properties
	*/
	P.PostyForum.prototype.savePost = function(index, content){
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
	P.PostyForum.prototype.cb_savePost = function(result){
		//this.getThread();
	}

})();