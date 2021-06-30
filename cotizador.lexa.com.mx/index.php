<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);
session_start();
require_once "models/enlaces.php";
require_once "controllers/controller.php";

$mvc = new MvcController();

$mvc -> pagina();

?>