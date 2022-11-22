<?php
    class DBConnect {
        protected function connect() {

            @Define("DBUSER", "oliver_db");
            @Define("DBPASS", "oliver_pass");
            @Define("DBHOST", "localhost");
            @Define("DBNAME", "oliver_db");
    
            try {
                


                $dbcon = new mysqli(DBHOST, DBUSER, DBPASS, DBNAME);
                mysqli_set_charset($dbcon, "utf8");
    
            }
            catch(Exception $e) {
                print($e->getMessage());
    
    
            }
            catch(Error $e){
                print($e->getMessage());
    
    
    
    
            }
            return $dbcon;
        }

        protected function Authenticate() {
            session_start();

            if(!isset($_SESSION["id"]) || !isset($_SESSION["Level"]) || $_SESSION["Level"] != 1) {
                header("Location:../index.html");
            }

            
        }


       
    }


?>