<?php

    /* 
    0 - management
    1 - bincollector
    2 - data upload 
    3 - comatinatio  checker 

    */

    /*
    BINS
 


    */

    /*
        Error codes

        -28 = invalid query

         
    */


    class Model extends DBConnect {
        private $Connection;

        function __construct() {
            $this->Connection = $this->connect();
        }

        protected function M_GetUsers() {
            $Con = $this->ReadyQuery("SELECT username, id, role FROM t_users");
            mysqli_stmt_execute($Con);
            return mysqli_stmt_get_result($Con);
        }


        protected function M_Login($Username, $Password) {
            $Con = $this->ReadyQuery("SELECT password, id, role, username, lastjob FROM t_users WHERE username = ? LIMIT 1");
            mysqli_stmt_bind_param($Con, "s", $Username);
            mysqli_stmt_execute($Con);
            $Data = mysqli_stmt_get_result($Con);
            if(mysqli_num_rows($Data) == 0) {
                //Code for invalid login
                
                echo 0;
                exit();
            }
            else {
                while($Row = mysqli_fetch_assoc($Data)) {
                    if(password_verify($Password, $Row["password"])) {
                        @session_start();
                        if(filter_var($Row["id"], FILTER_VALIDATE_INT) && (filter_var($Row["role"], FILTER_VALIDATE_INT) || $Row["role"]==0)) 
                        {
                            $_SESSION["Id"] = filter_var($Row["id"], FILTER_SANITIZE_NUMBER_INT);
                            $_SESSION["Role"] = filter_var($Row["role"], FILTER_SANITIZE_NUMBER_INT);
                            $_SESSION["Username"] = $this->FilterString($Row["username"]);
                            $_SESSION["LastJob"]  = filter_var($Row["lastjob"], FILTER_SANITIZE_NUMBER_INT);
                            switch($_SESSION["Role"]) {
                                case 0:
                                    echo "redirect:Manage.html";
                                    exit();
                                break;
                                case 1:
                                    echo "redirect:BinJob.html";
                                    exit();
                                break;
                                case 2:
                                    echo "redirect:DataJob.html";
                                    exit();
                                break;
                                case 3:
                                    echo "redirect:ConJob.html";
                                    exit();
                                break;
                            }
                        
                            exit();
                        }
                        else {
                            echo 0;
                            exit();
                        }
                    }
                }
            }
        }

        //Update data

        protected function M_UpdateBinStatus($Id) {
            $Con = $this->ReadyQuery("UPDATE t_auditdata SET status = (status +1), assigned = -1 WHERE assigned = ?");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
        }

    
        

        //Create user and bin functions

        protected function M_CreateBin($Colour, $Location, $Description) {
            $Con = $this->ReadyQuery("INSERT INTO t_auditdata (colour, location, description) VALUES (?,?,?)");
            mysqli_stmt_bind_param($Con, "sis", $Colour, $Location, $Description);
            mysqli_stmt_execute($Con);
        }

        protected function M_CreateUser($Username, $Password, $Role) {
            $Con = $this->ReadyQuery("INSERT INTO t_users (username, password, role) VALUES (?,?,?)");
            $E_Password = password_hash($Password, PASSWORD_DEFAULT);
            mysqli_stmt_bind_param($Con, "ssi", $Username, $E_Password, $Role);
            mysqli_stmt_execute($Con);
        }



        //Organising function for V_OrganiseShit only
        protected function M_GetJob($Id) {
            $Con = $this->ReadyQuery("SELECT `colour`, `location`, `status`, `description`, `binid` FROM `t_auditdata` WHERE assigned = ?");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
            $Data = mysqli_fetch_assoc(mysqli_stmt_get_result($Con));
            if($Data == null) {
                return -7;
            }
            else {
                return $Data;
            }
        }

        protected function M_GetBins($Id) {
            $Con = $this->ReadyQuery("SELECT `colour`, `location`, `status`, `assigned`, `description`, `binid` FROM `t_auditdata` WHERE `priority` = 1 AND `assigned` = ? ORDER BY `lastupdate` ASC");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
            $Result = mysqli_stmt_get_result($Con);
            if(mysqli_stmt_num_rows($Con) == 0) {
                return -7;
            }
            else {
                return mysqli_stmt_get_result($Con);
            }
        }

        protected function M_SetPriority($Colour) {
            $Con = $this->ReadyQuery("UPDATE t_auditdata SET priority = 1 WHERE colour = ?");
            mysqli_stmt_bind_param($Con, "s", $Colour);
            mysqli_stmt_execute($Con);
        }

        protected function M_SetJob($Id, $PreferedJob) {
            $Con = $this->ReadyQuery("UPDATE t_auditdata SET assigned = ? WHERE priority = 1 AND (status = ? OR status = 0) AND assigned = -1 LIMIT 1");
            mysqli_stmt_bind_param($Con, "ii", $Id, $PreferedJob);
            mysqli_stmt_execute($Con);
            if(mysqli_stmt_affected_rows($Con) == 0) {
                echo -7;
                exit();
            }
        }

        protected function M_SetContaminatedBin($Id) {
            $Con = $this->ReadyQuery("UPDATE t_auditdata SET assigned = ? WHERE status = 1 AND assigned = -1 LIMIT 1");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
            if(mysqli_stmt_num_rows($Con) == 0) {
                //http_response_code(-7);
                exit();
            }
        }
        
        protected function M_GetContaminatedBin($Id) {
            $Con = $this->ReadyQuery("SELECT colour, binid FROM t_auditdata WHERE assigned = ? AND status = 1 LIMIT 1");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
            $Data = mysqli_stmt_get_result($Con);
            if(mysqli_num_rows($Data) == 0) {
                //http_response_code(-7);
                return -7;
            }
            else {
                return mysqli_fetch_assoc($Data);
            }
        }

        //User type 3 related functions
        protected function M_UpdateBinContamination($Id, $Contaminated) {
            //echo $Id;
            $Con = $this->ReadyQuery("UPDATE t_auditdata SET contaminated = {$Contaminated}, assigned = -1, status  = 2 WHERE assigned = ? LIMIT 1");
            mysqli_stmt_bind_param($Con, "i", $Id);
            mysqli_stmt_execute($Con);
        }

        
        //Ulityly functions

        private function ReadyQuery($Query) {
            $Con = mysqli_stmt_init($this->Connection);
            if(mysqli_stmt_prepare($Con, $Query)) {
                return $Con;
            }
            else {
                //invalid query code
                echo $Query . "<br/>";
                echo mysqli_stmt_prepare($Con, $Query);
                echo -28;
                exit();
            }
            
        }


        protected function GetBinData() {
            $Con = $this->ReadyQuery("SELECT colour, location, assigned, status, binid, contaminated, priority, lastupdate, description FROM t_auditdata");
            mysqli_stmt_execute($Con);
            $Data = mysqli_stmt_get_result($Con);
            //var_dump(mysqli_fetch_assoc($Data));
            return $Data;
            
        }

        protected function M_Logout() {
            session_destroy();
            return "redirect:index.html";
        }

        //Get MassData

        protected function M_GetMassData() {
            $Con = $this->ReadyQuery("SELECT SUM(mass), colour FROM t_data GROUP BY colour ORDER BY colour ASC");
            mysqli_stmt_execute($Con);
            return mysqli_stmt_get_result($Con);
                    
        }

        protected function M_GetContaminationData() {
            $Con = $this->ReadyQuery("SELECT COUNT(contaminated), contaminated FROM t_auditdata GROUP BY contaminated");
            mysqli_stmt_execute($Con);
            return mysqli_stmt_get_result($Con);
        }

        

        protected function ConvertToJSON($Array) {
            $NewArray = array();

            while($Row = mysqli_fetch_array($Array)) {
                $Counter = 0;
                $ArrayToAppend = array();
                $Keys = array_keys($Row);
                while($Counter < count($Keys)) {
                    //echo $Row . "<br/>";                   
                    switch($Keys[$Counter]) {
                        case "colour":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterString($Row["colour"]);
                        break;
                        case "username":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterString($Row["username"]);
                        break;
                        case "description":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterString($Row["description"]);
                        break;
                        case "assigned":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["assigned"]);
                        break;
                        case "status":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["status"]);
                        break;
                        case "binid":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["binid"]);
                        break;
                        case "priority":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["priority"]);
                        break;
                        case "contaminated":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["contaminated"]);
                        break;
                        case "lastupdate":
                            //!  FIX
                            $ArrayToAppend[$Keys[$Counter]]=$Row["lastupdate"];
                        break;
                        case "id":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["id"]);
                        break;
                        case "role":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["role"]);
                        break;
                        case "location":
                            $ArrayToAppend[$Keys[$Counter]]=$this->FilterInt($Row["location"]);
                        break;
                    }
                    $Counter++;
                }
                array_push($NewArray, $ArrayToAppend);
            }
            return json_encode($NewArray);
            
        }

        //Stripping algorithms for filterting
        function FilterString($StringToFilter) {
            $StringToFilter = preg_replace("/[^A-Za-z0-9 ]/", '', $StringToFilter);
            return $StringToFilter;
        }
        function FilterInt($IntToFilter) {
            $IntToFilter = preg_replace('/[^0-9-]/', "", $IntToFilter);
            return $IntToFilter;
        }

        function FilterDouble($DoubleToFilter) {
            $DoubleToFilter = preg_replace("/[^0-9.]/", "", $DoubleToFilter);
            return $DoubleToFilter;
        }

        protected function M_AddMass($Mass, $Colour) {
            $Con = $this->ReadyQuery("INSERT INTO t_data (mass, colour) VALUES (?, ?)");
            mysqli_stmt_bind_param($Con, "ds", $Mass, $Colour);
            mysqli_stmt_execute($Con);
        }


        protected function M_GetPriorities() {
            $Con = $this->ReadyQuery("SELECT DISTINCT colour, priority FROM t_auditdata");
            mysqli_stmt_execute($Con);
            return mysqli_stmt_get_result($Con);
        }


        //kill the database connection on class closing
        function __destruct()
        {
            mysqli_close($this->Connection);
        }


    }



?>