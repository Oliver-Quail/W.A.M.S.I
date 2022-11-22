
RegisterOnLoad(LoadEvent);


function LoadEvent() {
    var B_BinTab = document.getElementById("B_BinTab");
    var BinTab = document.getElementById("BinTab");

    var B_UserTab = document.getElementById("B_UserTab");
    var UserTab = document.getElementById("UserTab");

    var B_AddPerson = document.getElementById("B_AddPerson");
    var I_Role = document.getElementById("I_Role");
    var I_Name = document.getElementById("I_Name");
    var I_Password = document.getElementById("I_Password");


    var I_Colour= document.getElementById("I_Colour");
    var I_Location = document.getElementById("I_Location");
    var I_Description = document.getElementById("I_Description");

    var BinTable = document.getElementById("BinTable");
    var UserTable = document.getElementById("UserTable");

    //Page setup functions
    ValidateData("GetBinData", [], SetBinTable);
    ValidateData("GetUsers", [], SetUserTable);


    //Toggle functions
    B_BinTab.addEventListener("click", function(){
        UserTab.style.display = "none";
        BinTab.style.display = "block";
    });
    B_UserTab.addEventListener("click", function(){
        BinTab.style.display = "none";
        UserTab.style.display = "block";
    });

    B_AddPerson.addEventListener("click", function(){
        if(I_Name.value != null || I_Password.value != null || I_Password.value.length < 256) {
            var RoleText = I_Role.options[I_Role.selectedIndex].value;
            ValidateData("CreateUser", [["Username", I_Name.value], ["Password", I_Password.value], ["Role", RoleText]]);
            ValidateData("GetUsers", [], SetUserTable);
            I_Name.value = null;
            I_Password.value = null;
        }
        else {
            CustomAlert("Missing Data", "Please check you have filled in all fields");
        }
    });

    B_AddBin.addEventListener("click", function(){
        if(I_Colour.value != null && I_Colour.value != "" && I_Location.value != null && I_Location.value != "" && typeof(parseInt(I_Location.value)) == "number") {
            ValidateData("CreateBin", [["Colour",I_Colour.value], ["Location", I_Location.value], ["Description", I_Description.value]], null);
            ValidateData("GetBinData", [], SetBinTable);
        }  
        else {
            CustomAlert("Missing data", "Please Check you have entered valid data");
        }
    });


    function SetBinTable(Response) {
        var Counter = 0;
        var TableContents = " <tr><th>Id</th><th>Colour</th><th>Location</th><th>Description</th></tr>";
        while(Counter < Response.length) {
            TableContents += "<tr>";
            TableContents += "<td>"+ Response[Counter]["binid"]+"</td>";
            TableContents += "<td>"+ Response[Counter]["colour"]+"</td>";
            TableContents += "<td>"+ Response[Counter]["location"]+"</td>";
            TableContents += "<td>"+ Response[Counter]["description"]+"</td>";
            TableContents += "</tr>";
            Counter++;
        }
        BinTable.innerHTML = TableContents;
    }

    function SetUserTable(Response) {
        var Counter = 0;
        var TableContents = " <tr><th>Name</th><th>Role</th><th>Id</th></tr>";
        while(Counter < Response.length) {
            TableContents += "<tr>";
            TableContents += "<td>"+ Response[Counter]["username"]+"</td>";
            TableContents += "<td>"+ Response[Counter]["role"]+"</td>";
            TableContents += "<td>"+ Response[Counter]["id"]+"</td>";
            TableContents += "</tr>";
            Counter++;
        }
        UserTable.innerHTML = TableContents;

    }
    


}