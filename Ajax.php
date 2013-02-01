<?php
require_once 'MainController.php';
require_once 'Autoloader.php';


/** TODO !!!
 * Check here if the connection is from the same server, if not don't response
 *
*/
//Test remove later
$data = array("name" => "Hagrid", "age" => "36");
$data_string = json_encode($data);
// -----------------------------


$ctrl = MainController::getInstance();
$ctrl->coreConnector->SendRequest($data_string);

?>