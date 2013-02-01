<?php
/*
function setLanguage($lang){
	setcookie("language", $lang, time()+604800);
}	
function getLanguage(){
	return isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
}	
function tr($text){
	$base_path = str_replace('adapter.php','',__FILE__);
	$lang = isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
	$url =  $base_path.$lang.'.xml';
	$xml = simplexml_load_file($url);
	if($nodes = $xml->xpath('//word[@key="'.$text.'"]')){
		$book = $nodes[0];
		$book = json_decode(json_encode($book['value']), TRUE);
		$book = $book[0];
		return $book;
	}
	return _($text);
}
function renderClientSideKeyValues(){
	$base_path = str_replace('adapter.php','',__FILE__);
	$lang = isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
	$url = $base_path.$lang.'.xml';
	$xml = simplexml_load_file($url);
	$output = '';
	 foreach ($xml->word as $word) {
		$word_new = $word->attributes();
		if($word_new->isjs=='true'){
			$output .= '<input class="translation" type="hidden" data-key="'.$word_new->key.'" data-value="'.$word_new->value.'" />';
		}
	 }
	echo $output;
}
 */
 function setLanguage($lang){
	setcookie("language", $lang, time()+604800);
}	
function getLanguage(){
	return isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
}	
function tr($text){
	$base_path = str_replace('adapter.php','',__FILE__);
	$lang = isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
	$url =  $base_path.$lang.'.xml';
	$xml = simplexml_load_file($url);
	if($nodes = $xml->xpath('//word[@key="'.$text.'"]')){
		$book = $nodes[0];
		$book = json_decode(json_encode($book[0]), TRUE);
		$book = $book[0];
		return $book;
	}
	return _($text);
}
function renderClientSideKeyValues(){
	$base_path = str_replace('adapter.php','',__FILE__);
	$lang = isset($_COOKIE['language'])?$_COOKIE['language']:'en_GB';
	$url = $base_path.$lang.'.xml';
	$xml = simplexml_load_file($url);
	$output = '';
	 foreach ($xml->word as $word) {
		$word_new = $word->attributes();
		if($word_new->isjs=='true'){
			$output .= '<span class="translation" style="display:none;" type="hidden" data-key="'.$word_new->key.'">'.$word[0].'</span>';
		}
	 }
	echo $output;
}
?>