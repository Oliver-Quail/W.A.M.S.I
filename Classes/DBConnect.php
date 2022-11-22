<?php
    class DBConnect {
        protected function connect() {

            //@Define("DBUSER", "u476476974_Production");
            //@Define("DBPASS", '$IhT5aL3o2Z3');
            @Define("DBUSER", "root");
            @Define("DBPASS", "");
            @Define("DBHOST", "localhost");
            @Define("DBNAME", "wasteaudit2");
    
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