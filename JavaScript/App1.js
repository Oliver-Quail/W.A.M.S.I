/*
    Author: Oliver Quail
    Contact: oliver.quail3@gmail.com
    

*/


var NoReturnMethods = ["UpdateBinStatus", "UpdateContamination", "AddMass", "SetPriority", "CreateUser", "CreateBin"];
var FunctionArray = [SecurityCheck];

function RegisterOnLoad(FunctionName) {
    FunctionArray.push(FunctionName);
}

function OnLoadEvents() {
    FunctionArray.forEach(Func => {
        console.log(Func);
        Func();
    });
}

function SecurityCheck() {
    ValidateData("Ping", []);
}

window.onload = function() {
    //console.table(FunctionArray);
    OnLoadEvents();
}


 
    
 function CheckNull(Value, NullAllowed, Flag) {
    if(NullAllowed) {
        if(Value.value == "" && NullAllowed) {
            return true;
        }
        else if(Value.value != "")  {
            return true;
        }
        else {
            return false;
        }
    }
  
 }

 //Data array
 function ValidateData(Mode, Data, CallBackFunction = null, FailureFunction = null) {
    var AvaliableModes =  ["CreateBin", "CreateUser", "SetPriority", "CheckJob", "UpdateContamination", "Login", "UpdateBinStatus", "AddMass", "GetUsers", "GetBinData", "Ping"];
    if(AvaliableModes.includes(Mode)) {
        var DataString = null;
        var Counter = 0;
        if(Mode == "UpdateContamination" || Mode == "SetPriority") {
            DataString = Data[0] +  "=" + Data[1];
            console.log(DataString);
        }
        else if(Mode == "Ping") {
            Mode += "&Page=" + document.getElementsByTagName("title")[0].innerHTML;
            console.log(Mode);
        } 
        else if(Data != null) {
            DataString = "";
            while(Counter < Data.length) {
                DataString += Data[Counter][0] + "=" + Data[Counter][1] + "&";
                Counter++;
            }
        }
        console.log(DataString);
        var ReturnedData = QueryServer(Mode, DataString, CallBackFunction, FailureFunction);
        return ReturnedData;
    }
    else {
        alert("Invalid API call");
    }
}

function QueryServer(Mode, Data, CallBackFunction = null, FailureFunction = null) {
    var xhttp =  new XMLHttpRequest();
    xhttp.open("POST", "API.php?Mode=" + Mode, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log(Data);
    xhttp.onload = function() {

        var ErrorMessage = "Please return to Old Gym";
        var TitleMessage = "No Jobs avaliable";
        if(Mode == "Login") {
            ErrorMessage = "";
            TitleMessage = "Invalid Username or Password";
        }
        else if(Mode.includes("Ping")) {
            console.log(this.responseText);
            if(this.responseText != "Allowed" && document.title != "W.A.M.S Login") {
                window.location =  "index.html";
                return;
            }
        }
        console.log(this.responseText);
        if(Mode == "Logout") {
            window.location = "index.html";
        }
        if(NoReturnMethods.includes(Mode)) {
            return;
        }
        switch(this.responseText) {
            case "-1":
                alert("You don't have approriate access to this page");
                return true;
            case "-8":
                alert("Invalid data submitted");
                return;
            case "-7":
                CustomAlert(TitleMessage, ErrorMessage, FailureFunction);
                return;
            case undefined:
                CustomAlert(TitleMessage, ErrorMessage, FailureFunction);
                return true;
            case "":
                CustomAlert(TitleMessage, ErrorMessage, FailureFunction);
                return true;

        }
        if(this.responseText.includes("redirect:"))  {
            var Location = this.responseText.split(":");
            //! add check for mode so no API call
            window.location = Location[1];
        }
        else {
            //If visual output is required call function on relevant script
            if(typeof(CallBackFunction) === "function") {
                console.log(this.responseText);
                CallBackFunction(JSON.parse(this.responseText));
            }
        }
    }
    
    xhttp.send(Data);

}

//Check redirect function
function CheckRedirect(Response) {
    if(Response.includes("redirect:"))  {
        var Location = Response.split(":");
        //! add check for mode so no API call
        window.location = Location[1];
    }
    else {
        return false;
    }
}
//custom alert
function CustomAlert(Title, Text, FunctionToCall = null){
    var Alert = document.createElement("section");
    Alert.id  = "Alert";
    Alert.innerHTML = "<h1>"+ Title +"</h1>" + "<p>" + Text +"</p>";
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(Alert);
    var B_Update = document.createElement("h3");
    B_Update.onclick = function() {
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("Alert"));
        if(FunctionToCall != null) {
            FunctionToCall();
        }
    } 
    B_Update.textContent = "Update Now";
    B_Update.id = "RequestJob";
    B_Update.classList.add("UpdateButton");
    Alert.appendChild(B_Update);
}

//custom confirm
function CustomConfirm(Title, Colour, Id, FunctionToCall, SetUpFunction, Mode, DataToSend, Contaminated = null) {
    var Body = document.getElementsByTagName("body")[0];
    var Alert = document.createElement("article");
    Alert.id = "CustomConfirm";
    if(Contaminated == null) {
        Alert.innerHTML = "<h1>"+ Title +"</h1>" + "<p>BinId:<b>" + Id + "</b></p><br/><span>Colour:</span><span id='CustomConfirmColour' class='"+Colour +"'>" + Colour+"</span>";
    }
    else {
        var Values = [];
        if(Contaminated == 1) {
            Values[0] = "Red";
            Values[1] = "Contaminated";
        }
        else {
            Values[0] = "Green";
            Values[1] = "Not Contaminated";
        }
        Alert.innerHTML = "<h1>"+ Title +"</h1>" + "<p>BinId:<b>" + Id + "</b></p><br/><span>Colour:</span><span id='CustomConfirmColour' class='"+Colour +"'>" + Colour+"</span>" + "<h3>Contamination:</h3>" + "<h4 class='"+ Values[0] +"'> "+ Values[1] +"</h4>";
    }
    var ButtonHolder = document.createElement("section");
    ButtonHolder.id = "AlertButtonHolder";

    // confirm buttons
    var B_Cancel = document.createElement("section");
    B_Cancel.innerHTML = "<b>Cancel</b>";
    B_Cancel.classList.add("RedBackground");
    B_Cancel.id = "B_Cancel";
    B_Cancel.onclick = function() {
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("CustomConfirm"));
    }
    
    var B_Confirm = document.createElement("section");
    B_Confirm.innerHTML = "<b>Confirm</b>";
    B_Confirm.classList.add("GreenBackground");
    B_Confirm.id = "B_Confirm";
    B_Confirm.onclick = function() {
        FunctionToCall(Mode, DataToSend);
        SetUpFunction();
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("CustomConfirm"));
    } 
    ButtonHolder.appendChild(B_Cancel);
    ButtonHolder.appendChild(B_Confirm);
    Alert.appendChild(ButtonHolder);
    Body.appendChild(Alert);
    



}

/*function CleanString(String1) {
    var BandPhrases = ["<script>", `</script>`, "<a>", "</a>", "<img", "--", "*", "^", "%", "&", "|", "<", ">", "[", "]", "?", ".", "=", '"', "'", "`"];
    var FilteredString = String1;
    console.log(String1);
    var Counter = 0;
    while(Counter < (BandPhrases.length -1)) {
        console.log(BandPhrases[Counter]);
        if(FilteredString.toLowerCase().includes(BandPhrases[Counter])) {
            FilteredString.replace(FilteredString, "");
            CleanString(FilteredString);
        }
        Counter++;
    }
    return FilteredString;
}*/

