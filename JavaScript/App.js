export default class App {

    constructor() {
        this.#QueryServer("Ping");
    }
    //Data array
    ValidateData(Mode, Data) {
        var AvaliableModes =  ["CreateBin", "CreateUser", "SetPriority", "CheckJob", "UpdateContamination"];
        if(AvaliableModes.includes(this.#CleanString(Mode))) {
            var DataString = "";
            var Counter = 0;
            while(Counter < Data.length) {
                DataString += Data[Counter][0] + this.#CleanString(Data[Counter][1]) + "&";
                Counter++;
            }
            this.#QueryServer(Mode, DataString);
        }
        else {
            alert("Invalid API call");
        }
    }

   #QueryServer(Mode, Data) {
        var xhttp =  new XMLHttpRequest();
        xhttp.open("POST", "API.php?Mode=" + Mode, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
       /* xhttp.onload = function() {
            switch(this.response.status) {
                case -1:
                    alert("You don't have approriate access to this page");
                    return true;
                break;
                case -7:
                    alert("No jobs avaliable at this time");
                    return true;
                break;
            }
            //return JSON.parse(this.responseText);
        }*/
        xhttp.send(Data);

   }

   #CleanString(String1) {
        //var BandPhrases = ["<script>", `</script>`, "<a>", "</a>", "<img", "--", "*", "^", "%", "&", "|", "<", ">", "[", "]", "?", ".", "=", '"', "'", "`"];
        var BandPhrases = ['<script>'];
        var FilteredString = String1;
        var Counter = 0;
        while(Counter < (BandPhrases.length -1)) {
            console.log(BandPhrases[Counter]);
            if(FilteredString.toLowerCase().includes(BandPhrases[Counter])) {
                //FilteredString.replace(FilteredString, "");
            }
            Counter++;
        }
        return FilteredString;
   }


   



}


