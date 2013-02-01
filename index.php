<?php
/**
 * The directory file names of shared files are in uppercase, the directories file names of skins are downcase
 * */

require_once 'MainController.php';
require_once 'Autoloader.php';

$ctrl = MainController::getInstance();
include $ctrl->theme->getThemeIndex();


?>