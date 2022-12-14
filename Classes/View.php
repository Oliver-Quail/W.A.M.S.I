<?php

    // -1 no jobs avaliable
    
    /* 
    0 - management
    1 - bincollector
    2 - data upload 
    3 - comatinatio  checker 

    */

    /*
    BINS
    0 - uncollected 
    1 - Awating contamination
    2 - emptied
    3 - complete 
    5 - hold

    */



    class View extends Model {

        function V_CheckJob($Id, $Role, $LastJob = 1) {
            if(filter_var($Id, FILTER_VALIDATE_INT) && filter_var($Role, FILTER_VALIDATE_INT) && (filter_var($LastJob, FILTER_VALIDATE_INT) || $LastJob == 0)) {
                switch($Role) {
                    case 1:
                        $Job = $this->M_GetJob($Id);
                        if($Job == -7) {
                            return $this->V_OrganiseShit($Role, $Id, $LastJob);
                        }
                        else {
                            return $Job;
                        }
                    break;
                        
                    case 3: 
                        $Job = $this->M_GetContaminatedBin($Id);
                        If($Job == -7) {
                            return $this->V_OrganiseShit($Role, $Id, $LastJob);
                        }
                        else {
                            return $Job;
                        }

                    break;
                }
            }
            else {
                //http_response_code(-7);
                return -7;
                exit();
            }

                
        }


        function V_OrganiseShit($Role, $Id, $LastJob) {

            $PreferedJobArray = array(0=>2, 2=>0);

            if($Role == 1) {    
                $Data =$this->M_SetJob($Id, $PreferedJobArray[$LastJob]);
                if($Data == -7) {
                    echo "-7";
                    exit();
                }
                else {
                    return $this->M_GetJob($Id);
                }
            }
            else if($Role == 3) {
                 $Data = $this->M_GetContaminatedBin($Id);
                 if($Data == -7) {
                    $this->M_SetContaminatedBin($Id);
                    return json_encode($this->M_GetContaminatedBin($Id));
                    
                 }
                 else {
                    return json_encode($Data);
                 }

            }
            
        }

        function V_GetBinData() {
            return $this->ConvertToJSON($this->GetBinData());
        }

        function V_GetMassData()
        {
            $Data = $this->M_GetMassData();
            $OutputArray = array();
            while($Row  = mysqli_fetch_assoc($Data)) {
                $F_Colour = $this->FilterString($Row["colour"]);
                $F_Mass = $this->FilterDouble($Row["SUM(mass)"]);
                $OutputArray[$F_Colour]=$F_Mass;
            }
            return json_encode($OutputArray);
        }


        function V_GetContaminationData() {
            $Data = $this->M_GetContaminationData();
            $OutputArray = array();
            while($Row = mysqli_fetch_assoc($Data)) {
                $F_Type = $this->FilterInt($Row["contaminated"]);
                switch($F_Type) {
                    case -1:
                        $F_Type = "none";
                        $F_Count = $this->FilterInt($Row["COUNT(contaminated)"]);
                    break;
                    case 0:
                        $F_Type = "not";
                        $F_Count = $this->FilterInt($Row["COUNT(contaminated)"]);
                    break;
                    case 1:
                        $F_Type = "con";
                        $F_Count = $this->FilterInt($Row["COUNT(contaminated)"]);
                    break;
                    default:
                        exit();
                    break;
                }
                $OutputArray[$F_Type] = $F_Count;
            }
            return json_encode($OutputArray);
        }

        function V_GetUsers() {
            return $this->ConvertToJSON($this->M_GetUsers());
        }

        function V_GetMassDataRaw() {
            $MassData = $this->M_GetMassDataRaw();
            $ContaminationData = $this->M_GetContaminationDataRaw();
            $OutputArray = array();
            $Keys = array();
            while($Row = mysqli_fetch_assoc($MassData)) {   
                $F_ColourFrom = $this->FilterString($Row["frombin"]);
                $F_WasteColour = $this->FilterString($Row["colour"]);
                $F_Mass = $this->FilterDouble($Row["mass"]);
                if(!in_array($F_ColourFrom, $Keys)) {
                    $OutputArray[$F_ColourFrom] = array();
                    $OutputArray[$F_ColourFrom]["Con"] = 0;
                    $OutputArray[$F_ColourFrom]["Not"] = 0;
                    array_push($Keys, $F_ColourFrom);
                }
                if(!array_key_exists($F_WasteColour, $OutputArray[$F_ColourFrom])) {
                    $OutputArray[$F_ColourFrom][$F_WasteColour] = 0;
                }
                $OutputArray[$F_ColourFrom][$F_WasteColour] += $F_Mass;
                $OutputArray[$F_ColourFrom][$F_WasteColour] = round($OutputArray[$F_ColourFrom][$F_WasteColour], 2);
            }
            while($Row = mysqli_fetch_assoc($ContaminationData)) {
                $F_Colour = $this->FilterString($Row["colour"]);
                $F_Contamination = $this->FilterInt($Row["contaminated"]);
                if($F_Contamination == 0) {
                    $OutputArray[$F_Colour]["Not"] += 1;
                }
                else if($F_Contamination == 1) {
                    $OutputArray[$F_Colour]["Con"] += 1;
                }
            }
            return json_encode($OutputArray);
        }

        function V_GetColours() {
            return $this->ConvertToJSON($this->M_GetColours());
        }

    }

?>