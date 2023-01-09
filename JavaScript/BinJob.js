RegisterOnLoad(LoadEvent);

function LoadEvent() {
    //Get ids to output data
    var O_Location = document.getElementById("Location");
    var O_Id = document.getElementById("Id");
    var O_Colour = document.getElementById("Colour");
    var O_Description = document.getElementById("DescriptionText");
    var B_Update = document.getElementById("UpdateButton");
    var O_Status = document.getElementById("O_Status");
    var BinColour = "";
    var BindId = null;

    SetUp();

    B_Update.addEventListener('click', function(){
            CustomConfirm("Update Bin", BinColour, BindId, ValidateData, SetUp, "UpdateBinStatus", null);
           /* ValidateData("UpdateBinStatus", null);
            SetUp();*/
        
    });


    function SetUp() {
        var xhttp =  new XMLHttpRequest();
        xhttp.open("POST", "API.php?Mode=CheckJob");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onload = function() {
            console.log(this.responseText);
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                break;
                case "-8":
                    alert("Invalid data submitted");
                break;
        
                case "-7":
                    CustomAlert("No Jobs avaliable", "Click to update soon", SetUp);
                    B_Update.style.display = "none";
                break;
                case "0":
                    //! check
                    alert("no idea");
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    B_Update.style.display = "none";
                    CustomAlert("No Jobs avaliable", "Click to update soon", SetUp);
                    return;
                break;
                case null:
                    B_Update.style.display = "none";
                    CustomAlert("No Jobs avaliable", "Click to update soon", SetUp);
                    return;
            }
            console.log(this.responseText);
            var O_Data = JSON.parse(this.responseText);
            B_Update.style.display = "block";
            BinColour = O_Data["colour"];
            BindId = O_Data["binid"];
            //Output Variables
            var Statuses = ["Not picked up", "Awating contamination", "Awating return", "Complete"];
            O_Status.textContent = Statuses[O_Data["status"]];
            O_Colour.textContent = O_Data["colour"];
            O_Id.textContent = O_Data["binid"];
            O_Location.textContent = O_Data["location"];
            O_Description.textContent = O_Data["description"];
            O_Colour.removeAttribute("class");
            O_Colour.classList.add(O_Data["colour"]);
            
           
        }
        xhttp.send();
    }
}