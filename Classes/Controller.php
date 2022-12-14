<?php
    //-8 == invalid data submitted
    class Controller extends Model {
        
        function C_Login($Username, $Password) {
            $F_Username = $this->FilterString($Username);
            $F_Password = $Password;
            $this->M_Login($F_Username, $F_Password);
        }

        function C_Logout() {
            $this->M_Logout();
        }


       function C_CreateBin($Colour, $Location, $Description) {
        //! FIX
            /*if(filter_var($Location, FILTER_VALIDATE_INT) || is_double($Location)) {
                echo -8;
                exit();
            }
            else {*/
                $F_Colour = $this->FilterString($Colour);
                $F_Description = $this->FilterString($Description);
                $F_Location = $this->FilterInt($Location);
                $this->M_CreateBin($F_Colour, $F_Location, $F_Description);
            //}
       }

       function C_UpdateBinStatus($Id) {
            //! Update later
            if(filter_var($Id, FILTER_VALIDATE_INT)) {
                $F_Id = filter_var($Id, FILTER_SANITIZE_NUMBER_INT);
                $this->M_UpdateBinStatus($F_Id);
            }
            else {
                echo "-8";
                exit();
            }


       }

       function C_CreateUser($Username, $Password, $Role = 1) {
            if(!Filter_var($Role, FILTER_VALIDATE_INT) && $Role != 0) {
                echo -8;
                exit();
            }
            else { 
                $F_Username = $this->FilterString($Username);
                $F_Role = $this->FilterInt($Role);
                $this->M_CreateUser($F_Username, $Password, $F_Role);
            }
       }

       function C_UpdateContamination($BinId, $Contaminated) {
            if(filter_var($BinId, FILTER_VALIDATE_INT) && (filter_var($Contaminated, FILTER_VALIDATE_INT) || $Contaminated == 0)) {
                $F_BindId = filter_var($BinId, FILTER_SANITIZE_NUMBER_INT);
                //! Update later
                $F_Contaminated = $Contaminated;
                $this->M_UpdateBinContamination($F_BindId, $F_Contaminated);
            }
            else {
                http_response_code(-1);
                echo "-1";
                exit();
            }
       }

       function C_AddMass($Mass, $Colour, $FromBin) {
            $F_Colour = $this->FilterString($Colour);
            $F_Mass = $this->FilterDouble($Mass);
            $F_FromBin = $this->FilterString($FromBin);
            $this->M_AddMass($F_Mass, $F_Colour, $F_FromBin);
       }

       function C_SetPriority($Colour) {
            $F_Colour = $this->FilterString($Colour);
            $this->M_SetPriority($F_Colour);
       }

       function C_CreateAudit($AuditName, $AdminId, $AuditDate, $MapLocation) {
            $F_AuditName = $this->FilterString($AuditName);
            $F_AdminId = $this->FilterInt($AdminId);
            $F_AuditDate = $this->FilterString($AuditDate);
            $F_MapLocation = $this->FilterString($MapLocation);
            $this->M_CreateAudit($F_AuditName, $F_AdminId, $F_AuditDate, $F_MapLocation);
       }
    }



?>