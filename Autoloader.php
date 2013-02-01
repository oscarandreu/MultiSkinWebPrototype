<?php


$pageURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
if ($_SERVER["SERVER_PORT"] != "80")
{
	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
}
else
{
	$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
}

/** Define ABSPATH as this file's directory */
define( 'ABSPATH', dirname(__FILE__) . '/' );


/** Here we define the paths where included files must be searched */
define( 'SYS_MODULES_PATH',  ABSPATH. '/SysModules' );

/** Here we define the skins paths*/
define( 'THEMES_PATH',  ABSPATH. '/Themes/' );

/** Here we define Assets paths */
define( 'LANG_PATH',  ABSPATH. '/Assets/languages/' );


/** Define ABSURL as this file's directory */
define( 'ABSURL', $pageURL);

/** Here we define Assets URLs */
define( 'THEMES_URL',  ABSURL. 'Themes/' );
define( 'CSS_URL',  ABSURL. 'Assets/css/' );
define( 'IMG_URL',  ABSURL. 'Assets/img/' );
define( 'JS_URL',  ABSURL. 'Assets/js/' );
define( 'LANG_URL',  ABSURL. 'Assets/languages/' );
/** Here we define the version of JQuery*/
define( 'JS_QUERY_URL',  ABSURL. 'Assets/js/jquery-ui-1.8.18.custom.min.js' );




function wgobd_autoload( $className )
{
	// Convert class name to filename format.
	$class_name = strtolower( $className );
	$paths = array(
			SYS_MODULES_PATH //,WGOBD_MODEL_PATH
	);

	// Search for included file
	foreach( $paths as $path ) {
		if( file_exists( "$path/$className.php" ) )
			require_once( "$path/$className.php" );
	}

}
spl_autoload_register( 'wgobd_autoload');

?>