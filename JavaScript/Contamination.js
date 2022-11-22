RegisterOnLoad(LoadEvent);


function LoadEvent() {
    var O_Id = document.getElementById("Id");
    var O_Colour = document.getElementById("Colour");

    //Event buttons
    var B_Con = document.getElementById("ConButton");
    var B_NotCon = document.getElementById("NotButton");

    //Data for custom alert 
    var Colour =  "";
    var Id = 0;

    SetUp();
    
    B_Con.addEventListener('click', function(){
        CustomConfirm("Update Contamination of", Colour, Id, ValidateData, SetUp, "UpdateContamination", ["Contaminated", 1], 1);
    });

    B_NotCon.addEventListener('click', function(){
        CustomConfirm("Update Contamination of", Colour, Id, ValidateData, SetUp, "UpdateContamination", ["Contaminated", 0], 0);
    });

    //Function to get data
    function SetUp() {
        ValidateData("CheckJob", [], DisplayBinData, SetUp);
    }

    function DisplayBinData(Response) {
        O_Colour.textContent = "NULL";
        O_Id.textContent = "NULL";
        if(Response == "" || Response == null) {
            CustomAlert("No Jobs avaliable", "Please return to Old Gym", SetUp);
            O_Colour.textContent = "NULL";
            O_Id.textContent = "NULL";
        }
        else {
            var O_Data = Response;
            O_Colour.textContent = O_Data["colour"];
            O_Id.textContent = O_Data["binid"];
            O_Colour.removeAttribute("class");
            O_Colour.classList.add(O_Data["colour"]);
            Colour = O_Data["colour"];
            Id = O_Data["binid"];
        }

        
    }
}

