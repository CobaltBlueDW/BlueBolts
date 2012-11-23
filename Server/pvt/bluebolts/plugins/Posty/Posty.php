<?php
/**	Posty:  creates a posting system capable of supporting blogs, news feeds, forums, chat rooms, wikis, logs, etc.
*
*	@author	David Wipperfurth
*	@group	BlueSolutions
*	@dated	2010-05-22
*/

require_once('PluginBase/PluginBase.php');

Class Posty extends PluginBase{

	//Set these in your sub-classes to configur your plugin
	protected $name = "Posty";									//The pretty name of this plugin
		//The description of the plugin
	protected $description = "creates a posting system capable of supporting blogs, new feeds, forums, chat rooms, wikis, logs, etc.";
	protected $version = 100;									//A space delimited list of words used for searching for this plugin
	protected $tags = "blog news feed forum chat room wiki log";	//A space delimited list of words used for searching for this plugin
	protected $basePath = "Posty";								//The base path for the files in thie plugin
	protected $tables = Array("structure");						//A list of sql script files used to setup database tables for the plugin
	protected $scripts = Array("Posty");						//A list of javascripts files used by the front-end of the plugin
	protected $styles = Array("PostyStyles");					//A list of style files used by the front-end of the plugin
	protected $required = Array();								//An Associative Array of plugin-name/plugin-version pairs that this plugin requires (must be verison of greater)
	protected $conflicts = Array();								//An Associative Array of plugin-name/plugin-version pairs that this plugin conflicts with (must be less than version)
}

?>