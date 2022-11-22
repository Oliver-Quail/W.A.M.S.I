<?php

    session_start();
    $AllowedPages = array(array("Manage", "Audit Setup"), array("Bin Runner Page"), array("Data Job"), array("Contamination Page"));

    //! update 
    if(!isset($_SESSION['Id']) && ($_GET["Mode"] != "Login" && $_GET["Mode"] != "Ping")) {
        echo "redirect:index.html";
        exit();
    }
    else if($_GET["Mode"] == "Ping" && $_GET["Page"] != "W.A.M.S Login") {
        //var_dump($AllowedPages[$_SESSION["Id"]]);
        if(in_array($_GET["Page"], $AllowedPages[$_SESSION["Role"]])){ //&& isset($_GET["Page"]) || $_GET["Page"] == "W.A.M.S Login") {
            echo "Allowed";
        }
        else {
            echo "No";
        }
        exit(); 
        
    }
    else {
        function ValidateLevel($Level, $Mode) {
            if((filter_var($Level, FILTER_VALIDATE_INT) || $Level == 0) && $Level <= 3 && $Level >= 0) {
                $F_Level = filter_var($Level, FILTER_SANITIZE_NUMBER_INT);
                $AccessArray = array(0=>array("CreateBin", "CreateUser", "SetPriority", "GetUsers"), 1=>array("CheckJob", "UpdateBinStatus"), 2=>array("AddMass"), 3=>array("CheckJob", "UpdateContamination"));
                if(in_array($Mode, $AccessArray[$F_Level])) {
                    echo "redirect:../index.html";
                    exit();
                }
            }
            //Not allowed access
            echo "failed";
            //http_response_code(-1);
            exit();
            


        }


        if(isset($_GET["Mode"])) {

            //Prevent errors from occuring
            try {
                require_once("loader.php");
            }
            catch(Exception $e) {
                echo -6;
                //http_response_code(-6);
                exit();
            }
            catch(Error $e) {
                echo -6;
                //http_response_code(-6);
                exit();
            }
            $F_Mode = htmlspecialchars($_GET["Mode"], ENT_QUOTES);
            if(!$_GET["Mode"] == "Login") {
                ValidateLevel($_SESSION["Level"], $F_Mode);
            }

            switch($F_Mode) {

                case "Login":
                    $Controller = new Controller();
                    $Controller->C_Login($_POST["Username"],  $_POST["Password"]);
                break;

                case "Logout":
                    $Controller = new Controller();
                    $Controller->C_Logout();
                break;

                case "CheckJob":
                    $View = new View();
                    if(isset($_SESSION["LastJob"])) {
                        echo json_encode($View->V_CheckJob($_SESSION["Id"], $_SESSION["Role"], $_SESSION["LastJob"]));
                    }
                    else {
                        echo json_encode($View->V_CheckJob($_SESSION["Id"], $_SESSION["Role"]));
                    }
                break;

                case "CreateBin":
                    $Controller = new Controller();
                    $Controller->C_CreateBin($_POST["Colour"], $_POST["Location"], $_POST["Description"]);
                break;

                case "CreateUser":
                    $Controller = new Controller();
                    $F_Role = 1;
                    switch($_POST["Role"]){
                        case "BinJob":
                            $F_Role = 1;
                        break;
                        case "DataJob":
                            $F_Role = 2;
                        break;
                        case "Contamination":
                            $F_Role = 3;
                        break;
                        case "Admin":
                            if($_SESSION["Level"] == 0) {
                                $F_Role = 0;
                            }
                            else {
                                echo -1;
                                exit();
                            }
                        break;
                        default:
                            echo -8;
                            exit();
                        break;
                    }
                    $Controller->C_CreateUser($_POST["Username"], $_POST["Password"], $F_Role);
                break;

                case "UpdateContamination":
                    $Controller = new Controller();
                    $Controller->C_UpdateContamination($_SESSION["Id"], $_POST["Contaminated"]);
                    $View = new View();
                    echo $View->V_CheckJob($_SESSION["Id"], $_SESSION["Role"]);
                break;

                case "SetPriority":
                    $Controller = new Controller();
                    $Controller->C_SetPriority($_POST["Colour"]);
                break;

                case "UpdateBinStatus":
                    $Controller = new Controller();
                    $Controller->C_UpdateBinStatus($_SESSION["Id"]);
                break;

                case "GetBinData":
                    $View = new View();
                    echo $View->V_GetBinData();
                break;

                default:
                    echo 0;
                break;

                case "AddMass":
                    $Controller = new Controller();
                    $Controller->C_AddMass($_POST["Mass"], $_POST["Colour"]);
                break;

                case "GetUsers":
                    $View = new View();
                    echo $View->V_GetUsers();
                break; 

                



            }

            /* 
                0 - management
                1 - bincollector
                2 - data upload 
                3 - comatinatio  checker 

            */


            //Finish
        
        }
    }





?>