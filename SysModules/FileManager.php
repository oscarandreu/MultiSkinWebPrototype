<?php

/**
 * Class taht manage all css, javascript inclusions
 * */
class FileManager
{
	public $_themeUrl;

	public function __construct(ThemeManager $theme)
	{
		$this->_themeUrl = THEMES_URL . $theme->skinPath .'/';
	}

	public function includeGlobalCss($name)
	{
		echo sprintf('<link href="%s%s" rel="stylesheet">', CSS_URL, $name);
	}

	public function includeSkinCss($name)
	{
		echo sprintf('<link href="%scss/%s" rel="stylesheet">', $this->_themeUrl, $name);
	}

	public function includeJQuery($name)
	{
		echo sprintf('<script type="text/javascript" src="%s%s"></script>', JS_QUERY_URL, $name);
	}
	
	public function includeGlobalJs($name)
	{
		echo sprintf('<script type="text/javascript" src="%s%s"></script>', JS_URL, $name);
	}

	public function includeSkinJs($name)
	{
		echo sprintf('<script type="text/javascript" src="%sjs/%s"></script>', $this->_themeUrl, $name);
	}

	public function includeLanguajes()
	{
		echo sprintf('<script type="text/javascript" src="%sadapter.js"></script>', LANG_URL);
	}
}

?>