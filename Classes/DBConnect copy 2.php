<?php
    class DBConnect {
        protected function connect() {

            @Define("DBUSER", "id19961452_oliver");
            @Define("DBPASS", "~O{<<G)=?~>v6~!F");
            @Define("DBHOST", "localhost");
            @Define("DBNAME", "id19961452_wasteaudit2");
    
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