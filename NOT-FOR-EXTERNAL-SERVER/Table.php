<?php

    require("../Classes/DBConnect.php");

    class Table extends DBConnect {

        private $Connection;

        function __construct()
        {   
            $this->Connection = $this->connect();
        }


        function CreateTable() {
            $Con = mysqli_stmt_init($this->Connection);
            $Query = "SELECT colour, location, binid, description FROM t_auditdata";
            mysqli_stmt_prepare($Con, $Query);
            mysqli_stmt_execute($Con);
            $Result = mysqli_stmt_get_result($Con);
            while($Row = mysqli_fetch_assoc($Result)) {
                echo "<tr>";
                echo "<td>" . $Row["location"] . "</td>";
                echo "<td>" . $Row["binid"] . "</td>";
                echo "<td class='". $Row['colour'] ."'>" . $Row["colour"] . "</td>";
                echo "<td>". $Row["description"] . "</td>";
                echo "</tr>";
            }
        }
    }

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap');

        :root {
            --MainBlue: #abd4c8;
            --MainGreen: #adc965;
            --MainRed: #e46144;
            --MainYellow: #f2bd6e;
        }

        * {
            font-family: 'Source Sans Pro', sans-serif;
        }

        table {
            width: 100%;
        }
        tr, td {
            text-align: center;
            font-weight: bold;
        }

        .Blue {
            color: var(--MainBlue);
        }
        .Green {
            color: var(--MainGreen);
        }
        .Red {
            color: var(--MainRed);
        }
        .Blue, .Green, .Red {
            font-weight: 1000;
        }


    </style>
</head>
<body>
    <table border="1">
        <tr>
            <th>Location</th>
            <th>Id</th>
            <th>Colour</th>
            <th>Description</th>
        </tr>
        <?php 
            $Tbl = new Table();

            $Tbl->CreateTable();
        ?>
    </table>
    
</body>
</html>