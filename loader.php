<?php
        spl_autoload_register("FindClass");


        function FindClass($ClassName) {
            $Path = "Classes/";
            $Extention = ".php";
            $CompletePath = $Path.$ClassName.$Extention;

            include_once($CompletePath);

        }



    ?>