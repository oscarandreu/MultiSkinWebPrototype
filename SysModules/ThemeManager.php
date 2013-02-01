<?php


class ThemeManager
{
	
	public $skinPath;
	public $skinName;
	public $skinDescription;
	
	public function __construct()
	{
		//This values must come from the Database !!!!!!!!!!!!!!
		$this->skinPath = 'default';//SkinTest1';
		$this->skinName = 'default';
		$this->skinDescription = 'Default skin for test pourpouses';
	}
	
	public function getThemeIndex()
	{
		return THEMES_PATH.$this->skinPath.'/index.php';
	}
	
}

?>