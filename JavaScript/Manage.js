
RegisterOnLoad(LoadEvent);

function LoadEvent() {
    
    
    var B_BluePriority = document.getElementById("BluePriority");
    var B_GreenPriority = document.getElementById("GreenPriority");
    var B_RedPriority = document.getElementById("RedPriority");
    var O_BinTable =  document.getElementById("BinsTable");

    B_BluePriority.addEventListener('click', function(){
        ValidateData("SetPriority", ["Colour", "Blue"]);
    }); 
    B_GreenPriority.addEventListener("click", function(){
        ValidateData("SetPriority", ["Colour", "Green"]);
    });
    B_RedPriority.addEventListener("click", function(){
        ValidateData("SetPriority", ["Colour", "Red"]);
    });


    ValidateData("GetBinData", [], UpdateBinData);

    ValidateData("GetUsers", null, UserTable);

    setInterval(function() {ValidateData("GetBinData", [], UpdateBinData);}, 10000);




    function UpdateBinData(ReturnData) {
            var Counter = 0;
            var TableData = "<tr><th>Id</th><th>Colour</th><th>Status</th><th>Contaminated</th><th>assigned</th><th>Last Update</th><th>Priority</th></tr>";
            console.table(ReturnData);
            while(Counter < ReturnData.length) {    
                //Alert data to make it reable for humans
                var T_Priority = "True";
                var T_Status = "";
                var T_Contaminated = "Unchecked";
                var T_Assigned = "";
                switch(ReturnData[Counter]["status"]) {
                    case "0":
                        T_Status = "Uncollected";
                    break;
                    case "1":
                        T_Status = "Awaiting contamination check";
                    break;
                    case "2":
                        T_Status = "Awaiting drop off";
                    break;
                    case "3":
                        T_Status = "Complete";
                    break;
                }
                if(ReturnData[Counter]["priority"] == "0") {
                    T_Priority = "False";
                }
                if(ReturnData[Counter]["contaminated"] == "1") {
                    T_Contaminated = "True";
                }
                else if(ReturnData[Counter]["contaminated"] == "0") {
                    T_Contaminated = "False";
                }

                if(ReturnData[Counter]["assigned"] == "-1") {
                    T_Assigned = "No one";
                }
                else {
                    T_Assigned  = ReturnData[Counter]["assigned"];
                }


                TableData += "<tr>";
                TableData += "<td>"+ ReturnData[Counter]["binid"] +"</td>";
                TableData += "<td>"+ ReturnData[Counter]["colour"] +"</td>";
                TableData += "<td>"+ T_Status +"</td>";
                TableData += "<td>"+ T_Contaminated +"</td>";
                TableData += "<td>"+ T_Assigned +"</td>";
                TableData += "<td>"+ ReturnData[Counter]["lastupdate"] +"</td>";
                TableData += "<td>"+ T_Priority +"</td>";
                TableData += "</tr>";
                Counter++;
            }
            O_BinTable.innerHTML = TableData;
        
    }
    function UserTable(Data) {
        var Counter = 0;
        var UserTable = document.getElementById("UserTable");
        var TableData = "";
        while(Counter < Data.length) {
            TableData += "<tr>";
            TableData += "<td>" + Data[Counter]["username"] + "</td>";
            TableData += "<td>" + Data[Counter]["id"] + "</td>";
            TableData += "<td>" + Data[Counter]["role"] + "</td>";
            TableData += "</tr>";
            Counter++;
        }
        UserTable.innerHTML+= TableData;
    }
}