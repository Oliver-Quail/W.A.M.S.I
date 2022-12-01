<?php
   /* session_start();
    $AllowedPages = array(array("Manage", "Audit Setup"), array("Bin Runner Page"), array("Data Job"), array("Contamination Page"));
     var_dump($AllowedPages);

     var_dump($AllowedPages[$_SESSION["Id"]]);*/

     require("loader.php");

     $View = new View();

     var_dump($View->V_GetMassDataRaw());


?>