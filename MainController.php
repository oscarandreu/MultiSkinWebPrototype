<?php
require_once 'Config.php';

class MainController
{
	
	public $config;
	public $theme;
	public $db;
	public $files;
	public $coreConnector;
	public $securityManager;
	
	private static $_instance;
	
	/** Singleton pattern, we need this controller in almost every page*/
	public static function getInstance()
	{
		if ( !self::$_instance instanceof self)
		{
			self::$_instance = new self;
		}
		return self::$_instance;
	}
	
	public function __construct()
	{
		//Load config object
		$this->config = new Config();
		$this->db = new DbHandler($this->config);
		
		//Load theme object
		$this->theme =  new ThemeManager();
		
		//load file manager
		$this->files = new FileManager($this->theme);
		
		//load Security manager
		$this->securityManager = new SecurityManager($this->config);
		
		//load coreConnector
		$this->coreConnector = new CoreConnector($this->config);
	}
}

?>