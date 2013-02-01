<?php

class DbHandler
{
	/**
	 * mongo connection - if a MongoDB object already exists (from a previous script) then only DB operations use this
	 * @var Mongo
	 */
	protected $_conn;
	protected $db_name;


	/** Constructor
	 * Connects to a Mongo database if the name of one is supplied as an argument
	 * @param string $config => config class
	 */
	public function __construct(Config $config) 
	{

		//Check some preconditions
		if(! $config) trigger_error('Config must be setted', E_ERROR);
		if (!extension_loaded('mongo'))  throw new mongoExtensionNotInstalled();

		$db_name = $config::Database;

		try {
			$m = new Mongo(); // conectar
			$_conn = $m->selectDB($db_name);
				
		} catch (MongoConnectionException $e) {
			throw new cannotConnectToMongoServer();
		}
	}
}

/**
 * Thrown when the mongo extension for PHP is not installed
 */
class mongoExtensionNotInstalled extends Exception {
	public function __toString() {
		return '<h1>PHP cannot access MongoDB, you need to install the Mongo extension for PHP.</h1> '
				. PHP_EOL . 'Instructions and driver download: '
						. '<a href="http://vork.us/go/tv27">http://vork.us/go/tv27</a>';
	}
}

?>