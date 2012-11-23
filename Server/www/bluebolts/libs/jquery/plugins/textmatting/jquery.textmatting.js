/** jQuery Textmatting:  A jQuery plugin used to format text.
*
*	ToDo:
*	- add valuable standard formats to the formats list.
*
*	@author		David Wipperfurth
*	@group		WellBe.me
*	@dated		4/8/10
*/
(function(){	//scope for variable protection (likely not used, but still a good idea to use by default)

	//variables
	jQuery.textmatting = {
		formats:{
			/* example */
			sql:[
				[/insert|select|from|where|into|join|left|inner|outer|replace|limit|order|by|on|show|drop/gi, function(str){ return '<b>'+str.toUpperCase()+'</b>'; }]
			]
		}
	};
	
	/** 
	*/
	jQuery.fn.formatText = function(args){
		if(!args.format) return false;
		var curFormat = jQuery.textmatting.formats[args.format];
		if(!curFormat) return false;
		
		jQuery(this).each(function(){
			var fText = jQuery(this).text();
			if(!fText){
				var input = true;
				fText =  jQuery(this).val();
			}
			
			//alert(fText);
			
			for(var i=0; i<curFormat.length; i++){
				fText = fText.replace(curFormat[i][0], curFormat[i][1]);
			}
			
			//alert(fText);
			if(input){
				jQuery(this).html(fText);
			}else{
				jQuery(this).html(fText);
			}
		});
	}
})();