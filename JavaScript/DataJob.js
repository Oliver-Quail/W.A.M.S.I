RegisterOnLoad(LoadEvent);

function LoadEvent() {

    //Colour buttons
    var B_Blue = document.getElementById("B_Blue");
    var B_Green = document.getElementById("B_Green");
    var B_Red = document.getElementById("B_Red");
    var B_Yellow = document.getElementById("B_Yellow");
    var B_Orange = document.getElementById("B_Orange");

    //Update buttons and masses
    var B_Update = document.getElementById("B_Update");
    var I_Mass = document.getElementById("I_Mass");
    var I_BucketMass = document.getElementById("I_BucketMass");
    var I_Colour = "";

    //Colour settings
    B_Blue.addEventListener("click", function(){
        RemoveClasses();
        B_Blue.classList.add("BlueBackground");
        I_Colour = "Blue";
    });
    B_Green.addEventListener("click", function(){
        RemoveClasses();
        B_Green.classList.add("GreenBackground");
        I_Colour = "Green";
    });
    B_Red.addEventListener("click", function(){
        RemoveClasses();
        B_Red.classList.add("RedBackground");
        I_Colour = "Red";
    });
    B_Yellow.addEventListener("click", function(){
        RemoveClasses();
        B_Yellow.classList.add("YellowBackground");
        I_Colour = "Yellow";
    });
    B_Orange.addEventListener("click", function(){
        RemoveClasses();
        B_Orange.classList.add("OrangeBackground");
        I_Colour = "Orange";
    });

    //Send data to database
    B_Update.addEventListener("click", function(){
        if(I_Colour != "" && I_Mass.value != "" && I_BucketMass != "") {
            var Mass = I_Mass.value - Math.abs(I_BucketMass.value);
            Mass.toFixed(2);
            if(Mass > 0) {
                ValidateData("AddMass", [["Mass", Mass], ["Colour", I_Colour]]);
                I_Mass.value = null;
                RemoveClasses();
                I_Colour = "";
                CustomAlert("Mass Added", "");
            }
            else {
                alert("Bucket mass is to large");
            }
           
        }
        else {
            alert("Data Missing");
        }
    });




    function RemoveClasses() {
        B_Blue.removeAttribute("class");
        B_Green.removeAttribute("class");
        B_Red.removeAttribute("class");
        B_Yellow.removeAttribute("class");
        B_Orange.removeAttribute("class");
    }
}