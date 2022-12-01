window.onload = function() {
    var MassTotal = 0.00;
    UpdateData();
    //Masses output
    var O_BlueMass = document.getElementById("O_BlueMass");
    var O_GreenMass = document.getElementById("O_GreenMass");
    var O_RedMass = document.getElementById("O_RedMass");
    var O_YellowMass = document.getElementById("O_YellowMass");
    var O_OtherMass = document.getElementById("O_OtherMass");

    //Other stats
    var O_Stat2Data = document.getElementById("Stat2Data");
    var O_Stat3Data = document.getElementById("Stat3Data");
    var O_Stat1Data = document.getElementById("Stat1Data");


    //global graph settings
    Chart.defaults.font.size = 16;
    Chart.defaults.font.family = "'Roboto', sans-serif";
    Chart.defaults.font.weight = "bold";


    //spectific default settings
    Chart.defaults.plugins.legend.labels.color = "#181818";
    Chart.defaults.plugins.title.font.size = 24;

    //calc for estimated waste
    var TotalNotRedMass = 0;
    var WasteRatio = 0;

    //Graph 1

    var Chart1 = document.getElementById("Chart1");
    Chart1.width = 0;
    //Chart.defaults.global.legend.display = false;
    //Chart.defaults.global.plugins.color = "white";


    var ctx = document.getElementById('Chart1').getContext('2d');
    var myChart1 = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Blue', 'Green', 'Red', 'Yellow', "Electronic"],
        datasets: [{
            data: [12, 19, 3, 5],
            backgroundColor: [
                '#abd4c8',
                '#adc965',
                '#e46144',
                '#f2bd6e',
                "#ebc29f",  
            ],
            color: [
                "#181818"
            ],
            
        }]
    },
    options: {
        plugins : {
            title: {
                display: true,
                align: "center",
                color: "181818",
                text: "Break down of waste by mass",
                font : {
                    size: 20
                }
              
            },
            legend: {
                display: true,
                position: "bottom",

                labels: {
                    //family: "'Roboto', sans-serif",
                    font: {
                        size: "16"
                    },
                    boxWidth: 20
                    

                }
            },
            
        }
    },
    plugins: [ChartDataLabels],

});
    //graph 2
    var Chart2 = document.getElementById("Chart2");
    Chart1.width = 0;
    //Chart.defaults.global.legend.display = false;
    //Chart.defaults.global.plugins.color = "white";

    var ctx = document.getElementById('Chart2').getContext('2d');
    var myChart2 = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Contaminated', 'Non-contaminated'],
        datasets: [{
            data: [12, 19],
            backgroundColor: [
                '#e46144',
                '#adc965',
                
            ],
            borderColor: [
                /*'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',*/
                "#FFF",
                "#FFF",
              
                
            ],
            color: [
                "#FFF"
            ],
            borderWidth: 0
        }]
    },
    options: {
        
        scales: {
        
            
        },
        plugins : {
            title: {
                display: true,
                align: "center",
                color: "#181818",
                text: "Contaminated vs non-contaminated",
                font : {
                    size: 18
                }
              
            },
            legend: {
                display: true,
                position: "bottom",

                labels: {

                    
                    

                }
            },
            
        }
    },
    plugins: [ChartDataLabels],
});

    setInterval(UpdateData, 60000)
    //Timer function 
    function UpdateData() {
        var xhttp =  new XMLHttpRequest();
        //! update
        xhttp.open("POST", "P_API.php?Mode=GetMassData");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.onload = function() {
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                    return true;
                break;
        
                case "-8":
                    alert("Invalid data submitted");
                break;
        
                case "-7":
                    alert("No jobs avaliable at this time");
                    return true;
                break;
                case "0":
                    //! check
                    alert("non ady");
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    return true;
                break;
            }
                var Data = JSON.parse(this.responseText);
                console.log(Data["Green"]);

                myChart1.data.datasets[0].data = [parseFloat(Data["Blue"]), parseFloat(Data["Green"]), parseFloat(Data["Red"]), parseFloat(Data["Yellow"]), parseFloat(Data["Orange"])];
                //console.log(myChart1.data.datasets[0].data);
                myChart1.update();
                O_BlueMass.textContent = Data["Blue"];
                O_GreenMass.textContent = Data["Green"];
                O_RedMass.textContent = Data["Red"];
                O_YellowMass.textContent = Data["Yellow"];
                O_OtherMass.textContent = Data["Orange"];

                TotalNotRedMass = Data["Blue"] + Data["Green"] + Data["Yellow"];
                console.log(typeof(Data["Red"]));
                MassTotal = 0.00;

                if(Data["Blue"] != undefined) {
                    MassTotal += parseFloat(Data["Blue"]);
                }
                if(Data["Green"] != undefined) {
                    MassTotal += parseFloat(Data["Green"]);
                }
                if(Data["Red"] != undefined) {
                    MassTotal += parseFloat(Data["Red"]);
                }
                if(Data["Yellow"] != undefined) {
                    MassTotal += parseFloat(Data["Yellow"]);
                }
                if(Data["Orange"] != undefined) {
                    MassTotal += parseFloat(Data["Orange"]);
                }
                console.log(MassTotal.toFixed(2));
                O_Stat2Data.textContent = MassTotal.toFixed(2); //.toFixed(2);
                O_Stat3Data.textContent = Data["Red"];
                if(Data["Red"] != undefined) {
                    MassTotal -= parseFloat(Data["Red"]);
                }
                

            
        }
        xhttp.send();
        //myChart2.datasets[0].data = [];
        //myChart3.datasets[0].data = [];
        var xhttp2 = new XMLHttpRequest();
        xhttp2.open("POST", "P_API.php?Mode=GetContaminationData", true);
        xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp2.onload = function() {
            console.log(this.responseText);
            switch(this.responseText) {
                case "-1":
                    alert("You don't have approriate access to this page");
                    return true;
                break;
        
                case "-8":
                    alert("Invalid data submitted");
                break;
        
                case "-7":
                    alert("No jobs avaliable at this time");
                    return true;
                break;
                case "-28":
                    alert("Invalid data");
                break;
                case "":
                    //alert("no jobs avaliable");
                    return true;
                break;
            }
            var Data = JSON.parse(this.responseText);
            console.log(Data);
            myChart2.data.datasets[0].data = [parseInt(Data["con"]), parseInt(Data["not"])];
            myChart2.update();
            if(Data["con"]  == undefined) {
                O_Stat1Data.textContent = "0";
            }
            else {
                console.log(MassTotal);
                WasteRatio = parseInt(Data["con"])/(parseInt(Data["con"])+ parseInt(Data["not"]));
                O_Stat1Data.textContent = (MassTotal*WasteRatio).toFixed(2);
            }
     


        }

        xhttp2.send();

    }
    var Array = {};
    Array["Blue"] = 25;
    Array["Green"] = 10;
    Array["Red"] = 40;
    var ColoursArray = {"Blue": "#abd4c8", "Green": "#adc965", "Red": "#e46144", "Yellow": "#f2bd6e", "Orange": "#ebc29f", "Waste Due To Contamination": "#23433A", "Contaminated": "#e46144", "Not Contaminated":"#adc965"};
    GenerateChart("ChartXX1", Array, ColoursArray, "Break down of Waste streams in Blue bin (kg)");



    function GenerateChart(ChartId, Data, Colours, Title) {

        var Keys = Object.keys(Data);
        var DataArray = [];
        var ColoursArray = [];
        Keys.forEach(element => {
            DataArray.push(Data[element]);
            ColoursArray.push(Colours[element]);
        });
        var ctx = ChartId;
        var NewChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Keys,
            datasets: [{
                data: DataArray,
                backgroundColor: ColoursArray,
                borderColor: [
                    "#FFF",
                    "#FFF",
                  
                    
                ],
                color: [
                    "#FFF"
                ],
                borderWidth: 0
            }]
        },
        options: {
            
            scales: {
            
                
            },
            plugins : {
                title: {
                    display: true,
                    align: "center",
                    color: "#181818",
                    text: Title,
                    font : {
                        size: 18
                    }
                  
                },
                legend: {
                    display: true,
                    position: "bottom",
    
                    labels: {
    
                        
                        
    
                    }
                },
                
            }
        },
        plugins: [ChartDataLabels],
    });

}

var GetRawData = new XMLHttpRequest();
GetRawData.open("POST", "P_API.php?Mode=GetDataRaw", true);
GetRawData.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
GetRawData.onload = function() {
    console.log(this.responseText);
    switch(this.responseText) {
        case "-1":
            alert("You don't have approriate access to this page");
            return true;
        break;

        case "-8":
            alert("Invalid data submitted");
        break;

        case "-7":
            alert("No jobs avaliable at this time");
            return true;
        break;
        case "-28":
            alert("Invalid data");
        break;
        case "":
            //alert("no jobs avaliable");
            return true;
        break;
    }
    var Data = JSON.parse(this.responseText);
    var BinColours =[];

    for(var element in Data) {
        BinColours.push(element);    

    }
    var Counter = 0;
    while(Counter < BinColours.length) {
        var ContaminationGraphHolder = document.createElement("section");
        var WasteGraphHolder = document.createElement("section");
        var ContaminationGraph = document.createElement("canvas");
        var WasteGraph = document.createElement("canvas");


        ContaminationGraph.id = "Chart" + BinColours[Counter] + "Con";
        ContaminationGraphHolder.appendChild(ContaminationGraph);

        WasteGraph.id = "Chart" + BinColours[Counter] + "Mass";
        WasteGraphHolder.appendChild(WasteGraph);

        var BinWasteData = {};

        var StatFocus = document.createElement("article");
        StatFocus.classList.add("StatFocus");
        var Title = document.createElement("h1");
        Title.classList.add("Title");
        Title.textContent = "Break down of Waste From " + BinColours[Counter] + " Bin";
        Title.classList.add(BinColours[Counter]+"Background");
        StatFocus.appendChild(Title);
        var DataDivide3 = GenerateSimpleElement("section", "DataDivide3");
        var DataColum = document.createElement("section");
        var SubTitles = ["Break Down of Waste From " + BinColours[Counter] + " Bin", "Number of Contaminated vs Non Contaminated in " + BinColours[Counter] + " Bins (kg)", "Amount of " + BinColours[Counter] + " Waste in Other Colour bins", "Sources of " + BinColours[Counter] + " Waste Going To Landfill"];
        var TitlesCounter = 0;
        var ContaminationDataLocal = {"Contaminated":0, "Not Contaminated":0};
        var MassOfColourNotInBin = 0;
        while(TitlesCounter < SubTitles.length) {
            var LocalTitle = document.createElement("h1");
            LocalTitle.textContent = SubTitles[TitlesCounter];
            LocalTitle.classList.add(BinColours[Counter]+"BorderTop");
            DataColum.appendChild(LocalTitle);
            switch(TitlesCounter) {
                case 0:
                    var TempArray = {};
                    var MassKeys = Object.keys(Data[BinColours[Counter]]);
                    MassKeys.forEach(element => {
                        console.log(element);
                        if(element != "Con" && element != "Not") {
                            TempArray[element] = Data[BinColours[Counter]][element];
                        }
                        else if(element == "Con"){
                            ContaminationDataLocal["Contaminated"] = Data[BinColours[Counter]]["Con"];
                        }
                        else {
                            ContaminationDataLocal["Not Contaminated"] = Data[BinColours[Counter]]["Not"];
                        }
                    });
                    DataColum.appendChild(GenerateRow(TempArray));
                break;
                case 1:
                    DataColum.appendChild(GenerateRow(ContaminationDataLocal, ""));
                break;
                case 2:
                    var TempArray = {};
                    /*for(var ColourKey in BinColours) {
                        var CurrentColour = BinColours[ColourKey];
                        console.log(CurrentColour);
                        if(Object.keys(Data[CurrentColour]).includes(CurrentColour)) {
                            TempArray[CurrentColour] = Data[CurrentColour][CurrentColour];
                            console.log(TempArray[CurrentColour] = Data[CurrentColour][CurrentColour]);
                            MassOfColourNotInBin += TempArray[CurrentColour];
                        }
                    }*/
                    for(var Colour in Data) {
                        //! FIX ADD AN OPTION FOR NOT EXISTSING
                        if(Colour != BinColours[Counter]) {
                            BinWasteData[Colour] = Data[Colour][BinColours[Counter]];
                            TempArray[Colour] = Data[Colour][BinColours[Counter]];
                            MassOfColourNotInBin += TempArray[Colour];
                        }
                    }
                    /*Data.forEach(element => {
                        if(element == BinColours[Counter]) {

                        }
                    });*/
                    console.log(MassOfColourNotInBin);
                    console.table(TempArray);
                    DataColum.appendChild(GenerateRow(TempArray));
                break;
                case 3:
                    var TempArray = {};
                    var ContaminatedMass = Data[BinColours[Counter]][BinColours[Counter]] *(Data[BinColours[Counter]]["Con"]/(Data[BinColours[Counter]]["Con"] + Data[BinColours[Counter]]["Not"]))
                    BinWasteData["Waste Due To Contamination"] = Math.round(ContaminatedMass * 100)/100;
                    TempArray["Amount Going to landfill due to being put in wrong bin"] = Math.round(MassOfColourNotInBin*100)/100;
                    TempArray["Due to contamination"] = BinWasteData["Waste Due To Contamination"];
                    TempArray["Total"] = TempArray["Due to contamination"] + TempArray["Amount Going to landfill due to being put in wrong bin"];
                    DataColum.appendChild(GenerateRow(TempArray));
                    break;
            }
            TitlesCounter++;
        }
        DataDivide3.appendChild(DataColum);
        DataDivide3.appendChild(ContaminationGraphHolder);
        DataDivide3.appendChild(WasteGraphHolder);
        StatFocus.appendChild(DataDivide3);
        document.getElementsByTagName("body")[0].appendChild(StatFocus);
        BinWasteData["Going to where it should"] = Math.round((Data[BinColours[Counter]][BinColours[Counter]] - BinWasteData["Waste Due To Contamination"])*100)/100;

        var WasteColours = {"Waste Due To Contamination": ColoursArray["Waste Due To Contamination"], "Going to where it should": ColoursArray[BinColours[Counter]]};
        var Keys = Object.keys(Data);
        Keys.forEach(element => {
            if(element != BinColours[Counter]) {
                WasteColours[element] = ColoursArray[element]; 
            }
        });
        console.table(WasteColours);

        GenerateChart(WasteGraph, BinWasteData, WasteColours, "Breakdown of Which Bin" + BinColours[Counter] + " Waste is in (kg)");
        GenerateChart(ContaminationGraph, ContaminationDataLocal, {"Contaminated": ColoursArray["Contaminated"], "Not Contaminated":ColoursArray["Not Contaminated"]}, "Number of Contaminated vs Non-Contaminated "+ BinColours[Counter] +" Bins");
        Counter++;
    }



}

GetRawData.send();

function GenerateSimpleElement(ElementType, Data, Mode = "Class") {
    var Element = document.createElement(ElementType);
    if(Mode == "Text") {
        Element.textContent = Data;
    }
    else {
        Element.classList.add(Data);
    }
    return Element;
}

function GenerateRow(Data, Type="kg") {
        var Row = GenerateSimpleElement("div", "Row");
        console.table(Data);
        var Titles = Object.keys(Data);
        Titles.forEach(element => {
            console.log(Data[element]);
            var MassOfColour = Data[element].toFixed(2);
            console.log(element);
            var RowData = GenerateSimpleElement("section", "RowData");
            RowData.appendChild(GenerateSimpleElement("h3", element, "Text"));
            RowData.appendChild(GenerateSimpleElement("span", MassOfColour + Type, "Text"));
            Row.appendChild(RowData);
        });
        //Row.appendChild(RowData);
        return Row;
}


}

    


//end code
