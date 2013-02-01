<?php

class CoreConnector
{
	private $_coreURL;
	
	
	/** Constructor
	 * Connects to a Mongo database if the name of one is supplied as an argument
	 * @param string $config => config class
	 */
	public function __construct(Config $config)
	{
		//Check some preconditions
		if(! $config) trigger_error('Config must be setted', E_ERROR);
						
		$this->_coreURL = $config::CoreURL;		
	}
	
	/**
	 * Function that send the request to the Core system and send the response to the calleer
	 */
	public function SendRequest($request)
	{
		$ch = curl_init($this->_coreURL);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
		curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Content-Type: application/json',
				'Content-Length: ' . strlen($request))
			);
		
		$result = curl_exec($ch);
		curl_close($ch);
		
		echo $result;
	}
}

?>