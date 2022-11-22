

RegisterOnLoad(LoadEvent);

function LoadEvent() {
    var Username = document.getElementById("Username");
    var Password = document.getElementById("Password");
    var LoginButton  = document.getElementById("LoginButton");

    LoginButton.addEventListener("click", function(){
        var T_Username =  Username.value;
        var T_Password =  Password.value;
        ValidateData("Login", [["Username", T_Username], ["Password", T_Password]]);

    });
}
