<?php
    //Public API for non-logged in users
    $Modes = array("GetMassData", "GetContaminationData");

    if(in_array($_GET["Mode"], $Modes)) {
        require("loader.php");

        switch($_GET["Mode"]) {
            case "GetMassData":
                $View = new View();
                echo $View->V_GetMassData();
            break;
            case "GetContaminationData":
                $View = new View();
                echo $View->V_GetContaminationData();
            break;
        }
    }



?>