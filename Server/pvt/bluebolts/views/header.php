<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Frameset//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd'>
<html>
<head>
	<meta http-equiv='content-type' content='text/html; charset=utf-8'>
	<meta http-equiv='content-language' content='en-US'>
	<meta name='group' content='BlueSolutions'>
	<meta name='copyright' content='protected under U.S. Publication Copyright laws'>
	<!-- dynamicly loaded metadata -->
	<?php
		if($args['metaData']){
			foreach($args['metaData'] as $key =>$value){
				$temp = "\t<meta ";
				if($value->name) $temp .= " name='".$value->name."' ";
				if($value->equiv) $temp .= "' http-equiv='".$value->equiv."' ";
				if($value->content) $temp .= "' content='".$value->content."' ";
				$temp .= "/>\n";
				print $temp;
			}
		}
	?>
	
	<!-- jQuery Plugins -->
	<link type='text/css' href='/<? print Base::ROOT_URL?>/libs/jquery/plugins/buttons/jquery.buttons.css'  rel='stylesheet' />
	<!-- dynamicly loaded styles -->
	<?php
		if($args['styles']){
			foreach($args['styles'] as $key =>$value){
				print "\t<link rel='stylesheet' type='text/css' media='screen' charset='utf-8' href='".$value."' />\n";
			}
		}
	?>
	
	<!-- Global Constants -->
	<script type='text/javascript'>ROOT_URL='/bluebolts/';ROOT_PVT='/bluebolts/';</script>
	<!-- jQuery -->
	<script src='/<? print Base::ROOT_URL?>/libs/jquery/jquery.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/jquery/jquery-ui.js' type='text/javascript'></script>
	<!-- jQuery Plugins -->
	<script src='/<? print Base::ROOT_URL?>/libs/jquery/plugins/json/jquery_json.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/jquery/plugins/buttons/jquery.buttons.js' type='text/javascript'></script>
	<!-- JavaScript Extensions -->
	<script src='/<? print Base::ROOT_URL?>/libs/general/JavaScriptExtensions.js' type='text/javascript'></script>
	<!-- BlueBoltCore -->
	<script src='/<? print Base::ROOT_URL?>/libs/general/Storable.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/Renderable.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/InterComm.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/Receiver.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/Page.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/Component.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/ContentBlock.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/general/User.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/libs/ckeditor/ckeditor.js' type='text/javascript' ></script>
	<script src='/<? print Base::ROOT_URL?>/libs/ckeditor/adapters/jquery.js' type='text/javascript' ></script>
	<!-- Plugins -->
	<script src='/<? print Base::ROOT_URL?>/plugins/Posty/scripts/PostyBlog.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/plugins/Posty/scripts/PostyForum.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/plugins/LoginComp/scripts/LoginComp.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/plugins/Registrar/scripts/Registrar.js' type='text/javascript'></script>
	<script src='/<? print Base::ROOT_URL?>/plugins/Q20/scripts/Q20.js' type='text/javascript'></script>
	<!-- dynamicly loaded scripts -->
	<?php
		if($args['scripts']){
			foreach($args['scripts'] as $key =>$value){
				print "\t<script type='text/javascript' src='".$value."'></script>\n";
			}
		}
	?>
	
	<title><?php print $args['title']; ?></title>
</head>
<body>